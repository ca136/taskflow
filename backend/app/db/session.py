"""Database engine and session factory — single source of truth."""

from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine

from app.core.config import get_settings


def _make_async_url(url: str) -> str:
    """Convert a postgresql:// URL to postgresql+asyncpg://."""
    return url.replace("postgresql://", "postgresql+asyncpg://", 1)


settings = get_settings()

engine = create_async_engine(
    _make_async_url(settings.DATABASE_URL),
    echo=False,
    pool_pre_ping=True,
)

async_session_factory = async_sessionmaker(engine, expire_on_commit=False)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        yield session
