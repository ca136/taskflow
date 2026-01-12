"""Project model."""

from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Text
import uuid

from app.db.base import Base
from app.db.types import GUID


class Project(Base):
    """Project database model."""

    __tablename__ = "projects"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    name = Column(String, nullable=False, index=True)
    description = Column(Text)
    created_by = Column(GUID(), ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
