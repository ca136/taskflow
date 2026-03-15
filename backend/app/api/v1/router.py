"""V1 API router — combines all endpoint modules."""

from fastapi import APIRouter

from app.api.v1.endpoints import auth, boards, health, projects, tasks, users

api_router = APIRouter()

api_router.include_router(health.router, tags=["health"])
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
api_router.include_router(users.router, prefix="/users", tags=["users"])
api_router.include_router(projects.router, prefix="/projects", tags=["projects"])
api_router.include_router(boards.router, prefix="/projects/{project_id}/boards", tags=["boards"])
api_router.include_router(tasks.router, prefix="/boards/{board_id}/tasks", tags=["tasks"])
