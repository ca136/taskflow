"""Activity log endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends, Query, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user, verify_task_access
from app.db.session import get_db
from app.models.activity_log import ActivityLog
from app.models.user import User
from app.schemas.activity_log import ActivityLogResponse

router = APIRouter()


@router.get("/tasks/{task_id}/activity", response_model=list[ActivityLogResponse])
async def list_activity(
    task_id: UUID,
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await verify_task_access(task_id, current_user, db)

    result = await db.execute(
        select(ActivityLog)
        .where(ActivityLog.task_id == task_id)
        .options(selectinload(ActivityLog.user))
        .order_by(ActivityLog.created_at.desc())
        .limit(limit)
        .offset(offset)
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
