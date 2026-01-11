"""Task model."""

from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
from sqlalchemy.dialects.postgresql import UUID
import uuid

from app.db.base import Base


class Task(Base):
    """Task database model."""

    __tablename__ = "tasks"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    board_id = Column(UUID(as_uuid=True), ForeignKey("boards.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    assignee = Column(UUID(as_uuid=True), ForeignKey("users.id"))
    priority = Column(String, default="medium")  # low, medium, high
    status = Column(String, default="todo")  # todo, in-progress, done
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
