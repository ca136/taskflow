"""API v1 router - combines all v1 endpoints"""

from fastapi import APIRouter
from app.api.v1.endpoints import health, projects, tasks

api_router = APIRouter()

# Include endpoint routers
api_router.include_router(health.router)
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(tasks.router, prefix="/tasks", tags=["tasks"])

# TODO: Add additional endpoint routers when created
# api_router.include_router(users.router, prefix="/users", tags=["users"])
