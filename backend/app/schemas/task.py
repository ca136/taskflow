"""Task schemas for request/response validation"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum as PyEnum
from uuid import UUID


class TaskStatus(str, PyEnum):
    """Task status enumeration"""
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class TaskPriority(str, PyEnum):
    """Task priority enumeration"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"


class TaskBase(BaseModel):
    """Base task schema"""
    title: str
    description: Optional[str] = None
    priority: TaskPriority = TaskPriority.MEDIUM
    status: TaskStatus = TaskStatus.TODO


class TaskCreate(TaskBase):
    """Task creation schema"""
    board_id: UUID


class TaskUpdate(BaseModel):
    """Task update schema"""
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[TaskPriority] = None
    status: Optional[TaskStatus] = None
    assignee: Optional[UUID] = None


class TaskStatusUpdate(BaseModel):
    """Task status update schema"""
    status: TaskStatus


class TaskResponse(TaskBase):
    """Task response schema"""
    id: UUID
    board_id: UUID
    assignee: Optional[UUID] = None
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
