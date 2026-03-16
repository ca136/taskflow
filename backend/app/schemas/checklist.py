"""Checklist schemas."""

from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class ChecklistItemCreate(BaseModel):
    content: str = Field(..., min_length=1, max_length=500)


class ChecklistItemUpdate(BaseModel):
    content: Optional[str] = Field(None, min_length=1, max_length=500)
    is_completed: Optional[bool] = None
    position: Optional[int] = None


class ChecklistItemResponse(BaseModel):
    id: UUID
    checklist_id: UUID
    content: str
    is_completed: bool
    position: int

    model_config = {"from_attributes": True}


class ChecklistCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)


class ChecklistUpdate(BaseModel):
    title: Optional[str] = Field(None, min_length=1, max_length=200)
    position: Optional[int] = None


class ChecklistResponse(BaseModel):
    id: UUID
    task_id: UUID
    title: str
    position: int
    items: list[ChecklistItemResponse] = []

    model_config = {"from_attributes": True}
