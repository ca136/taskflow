"""Project schemas for request/response validation"""

from pydantic import BaseModel
from datetime import datetime
from typing import Optional
from uuid import UUID


class ProjectBase(BaseModel):
    """Base project schema"""
    name: str
    description: Optional[str] = None


class ProjectCreate(ProjectBase):
    """Project creation schema"""
    pass


class ProjectUpdate(BaseModel):
    """Project update schema"""
    name: Optional[str] = None
    description: Optional[str] = None


class ProjectResponse(ProjectBase):
    """Project response schema"""
    id: UUID
    created_by: UUID
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
