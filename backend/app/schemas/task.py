"""Task schemas."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field

from app.models.task import TaskPriority, TaskStatus
from app.schemas.label import LabelResponse
from app.schemas.checklist import ChecklistResponse


class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=300)
    description: Optional[str] = None
    assignee_id: Optional[UUID] = None
    priority: TaskPriority = TaskPriority.MEDIUM
    status: TaskStatus = TaskStatus.TODO
    position: Optional[int] = None


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=300)
    description: Optional[str] = None
    assignee_id: Optional[UUID] = None
    priority: Optional[TaskPriority] = None
    status: Optional[TaskStatus] = None
    position: Optional[int] = None
    board_id: Optional[UUID] = None
    due_date: Optional[datetime] = None
    cover_color: Optional[str] = Field(None, max_length=7)
    is_archived: Optional[bool] = None
    label_ids: Optional[list[UUID]] = None


class TaskReorderItem(BaseModel):
    id: UUID
    position: int


class TaskResponse(BaseModel):
    id: UUID
    board_id: UUID
    title: str
    description: Optional[str]
    assignee_id: Optional[UUID]
    priority: TaskPriority
    status: TaskStatus
    position: int
    due_date: Optional[datetime] = None
    cover_color: Optional[str] = None
    is_archived: bool = False
    labels: list[LabelResponse] = []
    checklists: list[ChecklistResponse] = []
    assignee_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
