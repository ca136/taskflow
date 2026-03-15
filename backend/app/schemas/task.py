"""Task schemas."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.task import TaskPriority, TaskStatus


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    description: Optional[str] = None
    assignee_id: Optional[UUID] = None
    priority: TaskPriority = TaskPriority.MEDIUM
    status: TaskStatus = TaskStatus.TODO


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=300)
    description: Optional[str] = None
    assignee_id: Optional[UUID] = None
    priority: Optional[TaskPriority] = None
    status: Optional[TaskStatus] = None


class TaskResponse(BaseModel):
    id: UUID
    board_id: UUID
    title: str
    description: Optional[str]
    assignee_id: Optional[UUID]
    priority: TaskPriority
    status: TaskStatus
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
