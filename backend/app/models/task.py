"""Task model."""

from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
import uuid

from app.db.base import Base
from app.db.types import GUID


class Task(Base):
    """Task database model."""

    __tablename__ = "tasks"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    board_id = Column(GUID(), ForeignKey("boards.id"), nullable=False, index=True)
    title = Column(String, nullable=False)
    description = Column(Text)
    assignee = Column(GUID(), ForeignKey("users.id"))
    priority = Column(String, default="medium")  # low, medium, high
    status = Column(String, default="todo")  # todo, in-progress, done
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
