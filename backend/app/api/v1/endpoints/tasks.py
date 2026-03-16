"""Task endpoints — nested under boards."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.activity_log import ActivityLog
from app.models.board import Board
from app.models.label import Label
from app.models.project import Project
from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskReorderItem, TaskResponse, TaskUpdate

router = APIRouter()


async def _verify_board_access(board_id: UUID, user: User, db: AsyncSession) -> Board:
    result = await db.execute(select(Board).where(Board.id == board_id))
    board = result.scalar_one_or_none()
    if board is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")

    result = await db.execute(select(Project).where(Project.id == board.project_id))
    project = result.scalar_one_or_none()
    if project is None or project.owner_id != user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")
    return board


def _task_to_response(task: Task) -> dict:
    """Convert task to response dict with assignee_name."""
    data = {
        "id": task.id,
        "board_id": task.board_id,
        "title": task.title,
        "description": task.description,
        "assignee_id": task.assignee_id,
        "priority": task.priority,
        "status": task.status,
        "position": task.position,
        "due_date": task.due_date,
        "cover_color": task.cover_color,
        "is_archived": task.is_archived,
        "labels": task.labels,
        "checklists": task.checklists,
        "assignee_name": task.assignee.full_name if task.assignee else None,
        "created_at": task.created_at,
        "updated_at": task.updated_at,
    }
    return data


@router.post("/", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    board_id: UUID,
    body: TaskCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _verify_board_access(board_id, current_user, db)

    # Auto-assign position if not provided
    position = body.position
    if position is None:
        result = await db.execute(
            select(func.coalesce(func.max(Task.position), -1)).where(Task.board_id == board_id)
        )
        position = result.scalar() + 1

    task = Task(
        board_id=board_id,
        title=body.title,
        description=body.description,
        assignee_id=body.assignee_id,
        priority=body.priority,
        status=body.status,
        position=position,
    )
    db.add(task)
    await db.commit()
    await db.refresh(task, attribute_names=["labels", "checklists", "assignee"])
    return _task_to_response(task)


@router.get("/", response_model=list[TaskResponse])
async def list_tasks(
    board_id: UUID,
    include_archived: bool = Query(False),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _verify_board_access(board_id, current_user, db)
    query = (
        select(Task)
        .where(Task.board_id == board_id)
        .options(selectinload(Task.assignee))
    )
    if not include_archived:
        query = query.where(Task.is_archived == False)  # noqa: E712
    query = query.order_by(Task.position)
    result = await db.execute(query)
    tasks = result.scalars().all()
    return [_task_to_response(t) for t in tasks]


@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    board_id: UUID,
    task_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _verify_board_access(board_id, current_user, db)
    result = await db.execute(
        select(Task)
        .where(Task.id == task_id, Task.board_id == board_id)
        .options(selectinload(Task.assignee))
    )
    task = result.scalar_one_or_none()
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return _task_to_response(task)


@router.patch("/{task_id}", response_model=TaskResponse)
async def update_task(
    board_id: UUID,
    task_id: UUID,
    body: TaskUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _verify_board_access(board_id, current_user, db)
    result = await db.execute(
        select(Task)
        .where(Task.id == task_id, Task.board_id == board_id)
        .options(selectinload(Task.assignee))
    )
    task = result.scalar_one_or_none()
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    update_data = body.model_dump(exclude_unset=True)

    # Track changes for activity logging
    tracked_fields = {"status", "priority", "title", "is_archived"}
    changes: list[tuple[str, str, str]] = []
    for field in tracked_fields:
        if field in update_data and getattr(task, field) != update_data[field]:
            old_val = str(getattr(task, field))
            new_val = str(update_data[field])
            changes.append((field, old_val, new_val))

    # Handle label_ids specially
    label_ids = update_data.pop("label_ids", None)
    if label_ids is not None:
        result = await db.execute(select(Label).where(Label.id.in_(label_ids)))
        task.labels = list(result.scalars().all())

    # Handle board_id change (cross-board move)
    new_board_id = update_data.pop("board_id", None)
    if new_board_id is not None and new_board_id != board_id:
        await _verify_board_access(new_board_id, current_user, db)
        changes.append(("board", str(board_id), str(new_board_id)))
        task.board_id = new_board_id

        # Auto-assign position at end of target board if not specified
        if "position" not in update_data:
            result = await db.execute(
                select(func.coalesce(func.max(Task.position), -1)).where(
                    Task.board_id == new_board_id
                )
            )
            task.position = result.scalar() + 1

    for key, value in update_data.items():
        setattr(task, key, value)

    # Create activity log entries
    for field, old_val, new_val in changes:
        action = f"{field}_changed"
        if field == "board":
            action = "task_moved"
        elif field == "is_archived":
            action = "archived" if new_val == "True" else "unarchived"
        log = ActivityLog(
            task_id=task.id,
            user_id=current_user.id,
            action=action,
            details=f"{old_val} → {new_val}",
        )
        db.add(log)

    await db.commit()
    await db.refresh(task, attribute_names=["labels", "checklists", "assignee"])
    return _task_to_response(task)


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_task(
    board_id: UUID,
    task_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _verify_board_access(board_id, current_user, db)
    result = await db.execute(
        select(Task).where(Task.id == task_id, Task.board_id == board_id)
    )
    task = result.scalar_one_or_none()
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    await db.delete(task)
    await db.commit()


@router.post("/reorder", status_code=status.HTTP_204_NO_CONTENT)
async def reorder_tasks(
    board_id: UUID,
    items: list[TaskReorderItem],
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _verify_board_access(board_id, current_user, db)

    for item in items:
        result = await db.execute(
            select(Task).where(Task.id == item.id, Task.board_id == board_id)
        )
        task = result.scalar_one_or_none()
        if task is not None:
            task.position = item.position

    await db.commit()
