"""Import all models so Alembic and Base.metadata can see them."""

from app.models.user import User  # noqa: F401
from app.models.project import Project  # noqa: F401
from app.models.board import Board  # noqa: F401
from app.models.task import Task  # noqa: F401
from app.models.label import Label, task_labels  # noqa: F401
from app.models.checklist import Checklist, ChecklistItem  # noqa: F401
from app.models.comment import Comment  # noqa: F401
from app.models.activity_log import ActivityLog  # noqa: F401
