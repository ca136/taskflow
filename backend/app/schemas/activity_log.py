"""ActivityLog schemas."""

from datetime import datetime
from typing import Optional
from uuid import UUID

from pydantic import BaseModel


class ActivityLogResponse(BaseModel):
    id: UUID
    task_id: UUID
    user_id: Optional[UUID]
    action: str
    details: Optional[str]
    user_name: Optional[str] = None
    created_at: datetime

    model_config = {"from_attributes": True}
