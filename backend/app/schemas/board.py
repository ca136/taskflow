"""Board schemas."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class BoardCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    position: int = 0


class BoardUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=200)
    position: Optional[int] = None


class BoardResponse(BaseModel):
    id: UUID
    project_id: UUID
    name: str
    position: int
    created_at: datetime

    model_config = {"from_attributes": True}


class BoardReorderItem(BaseModel):
    id: UUID
    position: int
