"""Board endpoints — nested under projects."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import case, select, update
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, verify_project_access
from app.db.session import get_db
from app.models.board import Board
from app.models.user import User
from app.schemas.board import BoardCreate, BoardReorderItem, BoardResponse, BoardUpdate

router = APIRouter()


@router.post("/", response_model=BoardResponse, status_code=status.HTTP_201_CREATED)
async def create_board(
    project_id: UUID,
    body: BoardCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await verify_project_access(project_id, current_user, db)
    board = Board(project_id=project_id, name=body.name, position=body.position)
    db.add(board)
    await db.commit()
    await db.refresh(board)
    return board


@router.get("/", response_model=list[BoardResponse])
async def list_boards(
    project_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await verify_project_access(project_id, current_user, db)
    result = await db.execute(
        select(Board).where(Board.project_id == project_id).order_by(Board.position)
    )
    return result.scalars().all()


@router.patch("/{board_id}", response_model=BoardResponse)
async def update_board(
    project_id: UUID,
    board_id: UUID,
    body: BoardUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await verify_project_access(project_id, current_user, db)
    result = await db.execute(
        select(Board).where(Board.id == board_id, Board.project_id == project_id)
    )
    board = result.scalar_one_or_none()
    if board is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")

    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(board, key, value)
    await db.commit()
    await db.refresh(board)
    return board


@router.delete("/{board_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_board(
    project_id: UUID,
    board_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await verify_project_access(project_id, current_user, db)
    result = await db.execute(
        select(Board).where(Board.id == board_id, Board.project_id == project_id)
    )
    board = result.scalar_one_or_none()
    if board is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")
    await db.delete(board)
    await db.commit()


@router.post("/reorder", status_code=status.HTTP_204_NO_CONTENT)
async def reorder_boards(
    project_id: UUID,
    items: list[BoardReorderItem],
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await verify_project_access(project_id, current_user, db)
    if not items:
        return

    id_to_pos = {item.id: item.position for item in items}
    await db.execute(
        update(Board)
        .where(Board.id.in_(id_to_pos.keys()), Board.project_id == project_id)
        .values(position=case(id_to_pos, value=Board.id))
    )
    await db.commit()
