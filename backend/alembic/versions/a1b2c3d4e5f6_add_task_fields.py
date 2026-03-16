"""add task position, due_date, cover_color, is_archived fields

Revision ID: a1b2c3d4e5f6
Revises: c19f0f4e43f1
Create Date: 2026-03-16 00:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, None] = "c19f0f4e43f1"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("tasks", sa.Column("position", sa.Integer(), server_default=sa.text("0"), nullable=False))
    op.add_column("tasks", sa.Column("due_date", sa.DateTime(timezone=True), nullable=True))
    op.add_column("tasks", sa.Column("cover_color", sa.String(7), nullable=True))
    op.add_column("tasks", sa.Column("is_archived", sa.Boolean(), server_default=sa.text("false"), nullable=False))


def downgrade() -> None:
    op.drop_column("tasks", "is_archived")
    op.drop_column("tasks", "cover_color")
    op.drop_column("tasks", "due_date")
    op.drop_column("tasks", "position")
