"""API v1 aggregator - re-exports the main router"""

from app.api.v1.router import api_router

__all__ = ["api_router"]
