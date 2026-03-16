"""Label schemas."""

from typing import Optional
from uuid import UUID

from pydantic import BaseModel, Field


class LabelCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=50)
    color: str = Field(..., min_length=4, max_length=7)


class LabelUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=50)
    color: Optional[str] = Field(None, min_length=4, max_length=7)


class LabelResponse(BaseModel):
    id: UUID
    name: str
    color: str
    project_id: UUID

    model_config = {"from_attributes": True}
