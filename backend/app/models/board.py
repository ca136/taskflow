"""Board model."""

from datetime import datetime
from sqlalchemy import Column, String, DateTime, ForeignKey, Integer
import uuid

from app.db.base import Base
from app.db.types import GUID


class Board(Base):
    """Board database model."""

    __tablename__ = "boards"

    id = Column(GUID(), primary_key=True, default=uuid.uuid4)
    project_id = Column(GUID(), ForeignKey("projects.id"), nullable=False, index=True)
    name = Column(String, nullable=False)
    order = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
