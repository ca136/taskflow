"""Checklist endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, verify_task_access
from app.db.session import get_db
from app.models.checklist import Checklist, ChecklistItem
from app.models.user import User
from app.schemas.checklist import (
    ChecklistCreate,
    ChecklistItemCreate,
    ChecklistItemResponse,
    ChecklistItemUpdate,
    ChecklistResponse,
    ChecklistUpdate,
)

router = APIRouter()


async def _get_checklist_and_verify(
    checklist_id: UUID, user: User, db: AsyncSession
) -> Checklist:
    """Fetch checklist and verify the user owns the parent task's project."""
    result = await db.execute(select(Checklist).where(Checklist.id == checklist_id))
    checklist = result.scalar_one_or_none()
    if checklist is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Checklist not found")
    await verify_task_access(checklist.task_id, user, db)
    return checklist


# --- Checklist CRUD ---

@router.post(
    "/tasks/{task_id}/checklists",
    response_model=ChecklistResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_checklist(
    task_id: UUID,
    body: ChecklistCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await verify_task_access(task_id, current_user, db)

    result = await db.execute(
        select(func.coalesce(func.max(Checklist.position), -1)).where(Checklist.task_id == task_id)
    )
    position = result.scalar() + 1

    checklist = Checklist(task_id=task_id, title=body.title, position=position)
    db.add(checklist)
    await db.commit()
    await db.refresh(checklist, attribute_names=["items"])
    return checklist


@router.patch(
    "/tasks/{task_id}/checklists/{checklist_id}",
    response_model=ChecklistResponse,
)
async def update_checklist(
    task_id: UUID,
    checklist_id: UUID,
    body: ChecklistUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await verify_task_access(task_id, current_user, db)
    result = await db.execute(
        select(Checklist).where(Checklist.id == checklist_id, Checklist.task_id == task_id)
    )
    checklist = result.scalar_one_or_none()
    if checklist is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Checklist not found")

    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(checklist, key, value)
    await db.commit()
    await db.refresh(checklist, attribute_names=["items"])
    return checklist


@router.delete(
    "/tasks/{task_id}/checklists/{checklist_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_checklist(
    task_id: UUID,
    checklist_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await verify_task_access(task_id, current_user, db)
    result = await db.execute(
        select(Checklist).where(Checklist.id == checklist_id, Checklist.task_id == task_id)
    )
    checklist = result.scalar_one_or_none()
    if checklist is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Checklist not found")
    await db.delete(checklist)
    await db.commit()


# --- Checklist Item CRUD ---

@router.post(
    "/checklists/{checklist_id}/items",
    response_model=ChecklistItemResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_checklist_item(
    checklist_id: UUID,
    body: ChecklistItemCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    checklist = await _get_checklist_and_verify(checklist_id, current_user, db)

    result = await db.execute(
        select(func.coalesce(func.max(ChecklistItem.position), -1)).where(
            ChecklistItem.checklist_id == checklist_id
        )
    )
    position = result.scalar() + 1

    item = ChecklistItem(
        checklist_id=checklist.id, content=body.content, position=position
    )
    db.add(item)
    await db.commit()
    await db.refresh(item)
    return item


@router.patch(
    "/checklists/{checklist_id}/items/{item_id}",
    response_model=ChecklistItemResponse,
)
async def update_checklist_item(
    checklist_id: UUID,
    item_id: UUID,
    body: ChecklistItemUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_checklist_and_verify(checklist_id, current_user, db)

    result = await db.execute(
        select(ChecklistItem).where(
            ChecklistItem.id == item_id, ChecklistItem.checklist_id == checklist_id
        )
    )
    item = result.scalar_one_or_none()
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")

    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(item, key, value)
    await db.commit()
    await db.refresh(item)
    return item


@router.delete(
    "/checklists/{checklist_id}/items/{item_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_checklist_item(
    checklist_id: UUID,
    item_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_checklist_and_verify(checklist_id, current_user, db)

    result = await db.execute(
        select(ChecklistItem).where(
            ChecklistItem.id == item_id, ChecklistItem.checklist_id == checklist_id
        )
    )
    item = result.scalar_one_or_none()
    if item is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Item not found")
    await db.delete(item)
    await db.commit()
