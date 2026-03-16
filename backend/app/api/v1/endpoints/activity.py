"""Activity log endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user
from app.db.session import get_db
from app.models.activity_log import ActivityLog
from app.models.board import Board
from app.models.project import Project
from app.models.task import Task
from app.models.user import User
from app.schemas.activity_log import ActivityLogResponse

router = APIRouter()


@router.get("/tasks/{task_id}/activity", response_model=list[ActivityLogResponse])
async def list_activity(
    task_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    # Verify access
    result = await db.execute(select(Task).where(Task.id == task_id))
    task = result.scalar_one_or_none()
    if task is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")

    result = await db.execute(select(Board).where(Board.id == task.board_id))
    board = result.scalar_one_or_none()
    if board is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Board not found")

    result = await db.execute(select(Project).where(Project.id == board.project_id))
    project = result.scalar_one_or_none()
    if project is None or project.owner_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Access denied")

    result = await db.execute(
        select(ActivityLog)
        .where(ActivityLog.task_id == task_id)
        .options(selectinload(ActivityLog.user))
        .order_by(ActivityLog.created_at.desc())
    )

    logs = result.scalars().all()
    return [
        {
            "id": log.id,
            "task_id": log.task_id,
            "user_id": log.user_id,
            "action": log.action,
            "details": log.details,
            "user_name": log.user.full_name if log.user else None,
            "created_at": log.created_at,
        }
        for log in logs
    ]
