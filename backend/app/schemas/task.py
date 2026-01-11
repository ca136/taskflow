"""Task schemas for request/response validation"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from enum import Enum as PyEnum


class TaskStatus(str, PyEnum):
    """Task status enumeration"""
    TODO = "todo"
    IN_PROGRESS = "in_progress"
    DONE = "done"


class TaskBase(BaseModel):
    """Base task schema"""
    title: str
    description: Optional[str] = None
    status: TaskStatus = TaskStatus.TODO
    assigned_to: Optional[int] = None
    due_date: Optional[datetime] = None


class TaskCreate(TaskBase):
    """Task creation schema"""
    pass


class TaskUpdate(BaseModel):
    """Task update schema"""
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[TaskStatus] = None
    assigned_to: Optional[int] = None
    due_date: Optional[datetime] = None


class TaskResponse(TaskBase):
    """Task response schema"""
    id: int
    project_id: int
    created_by: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
