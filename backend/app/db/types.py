"""Custom SQLAlchemy types."""

import uuid
from sqlalchemy.types import CHAR, TypeDecorator
from sqlalchemy.dialects.postgresql import UUID as PG_UUID


class GUID(TypeDecorator):
    """Platform-independent GUID type that uses BINARY(16) on SQLite and UUID on PostgreSQL."""

    impl = CHAR
    cache_ok = True

    def load_dialect_impl(self, dialect):
        if dialect.name == 'postgresql':
            return dialect.type_descriptor(PG_UUID(as_uuid=True))
        return dialect.type_descriptor(CHAR(32))

    def process_bind_param(self, value, dialect):
        if value is None:
            return value

        if dialect.name == 'postgresql':
            return str(value) if not isinstance(value, uuid.UUID) else value

        if isinstance(value, uuid.UUID):
            return value.hex

        if isinstance(value, str):
            return uuid.UUID(value).hex

        return value

    def process_result_value(self, value, dialect):
        if value is None:
            return value

        if dialect.name == 'postgresql':
            return value if isinstance(value, uuid.UUID) else uuid.UUID(value)

        return uuid.UUID(value) if isinstance(value, str) else value
