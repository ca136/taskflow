"""Project CRUD endpoints"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from uuid import UUID

from app.database import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.api.v1.dependencies import get_current_user
from app.models.user import User

router = APIRouter()


@router.post(
    "/projects",
    response_model=ProjectResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["projects"]
)
async def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> ProjectResponse:
    """Create a new project"""
    db_project = Project(
        name=project_in.name,
        description=project_in.description,
        created_by=current_user.id
    )
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project


@router.get(
    "/projects",
    response_model=List[ProjectResponse],
    tags=["projects"]
)
async def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    skip: int = 0,
    limit: int = 100
) -> List[ProjectResponse]:
    """List all projects for the current user"""
    projects = db.query(Project).filter(
        Project.created_by == current_user.id
    ).offset(skip).limit(limit).all()
    return projects


@router.get(
    "/projects/{project_id}",
    response_model=ProjectResponse,
    tags=["projects"]
)
async def get_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> ProjectResponse:
    """Get a single project by ID"""
    db_project = db.query(Project).filter(
        Project.id == project_id,
        Project.created_by == current_user.id
    ).first()
    
    if not db_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    return db_project


@router.put(
    "/projects/{project_id}",
    response_model=ProjectResponse,
    tags=["projects"]
)
async def update_project(
    project_id: UUID,
    project_in: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> ProjectResponse:
    """Update a project"""
    db_project = db.query(Project).filter(
        Project.id == project_id,
        Project.created_by == current_user.id
    ).first()
    
    if not db_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    # Update only provided fields
    if project_in.name is not None:
        db_project.name = project_in.name
    if project_in.description is not None:
        db_project.description = project_in.description
    
    db.commit()
    db.refresh(db_project)
    return db_project


@router.delete(
    "/projects/{project_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["projects"]
)
async def delete_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> None:
    """Delete a project"""
    db_project = db.query(Project).filter(
        Project.id == project_id,
        Project.created_by == current_user.id
    ).first()
    
    if not db_project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )
    
    db.delete(db_project)
    db.commit()
