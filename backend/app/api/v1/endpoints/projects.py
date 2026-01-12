"""Project CRUD endpoints"""

from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.user import User
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.services.project_service import ProjectService
from app.api.v1.dependencies import get_current_user

router = APIRouter()


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED, tags=["projects"])
async def create_project(
    project: ProjectCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> ProjectResponse:
    """Create a new project
    
    Args:
        project: Project data
        db: Database session
        current_user: Authenticated user
        
    Returns:
        Created project
        
    Raises:
        HTTPException: If project creation fails
    """
    try:
        db_project = ProjectService.create_project(db, project, current_user.id)
        return ProjectResponse.model_validate(db_project)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create project: {str(e)}"
        )


@router.get("", response_model=list[ProjectResponse], tags=["projects"])
async def list_projects(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> list[ProjectResponse]:
    """List all projects
    
    Args:
        skip: Number of records to skip
        limit: Maximum number of records to return
        db: Database session
        current_user: Authenticated user
        
    Returns:
        List of projects
    """
    try:
        projects = ProjectService.get_all_projects(db, skip=skip, limit=limit)
        return [ProjectResponse.model_validate(p) for p in projects]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to list projects: {str(e)}"
        )


@router.get("/{project_id}", response_model=ProjectResponse, tags=["projects"])
async def get_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> ProjectResponse:
    """Get project by ID
    
    Args:
        project_id: Project ID
        db: Database session
        current_user: Authenticated user
        
    Returns:
        Project details
        
    Raises:
        HTTPException: If project not found
    """
    try:
        project = ProjectService.get_project_by_id(db, project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        return ProjectResponse.model_validate(project)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to get project: {str(e)}"
        )


@router.put("/{project_id}", response_model=ProjectResponse, tags=["projects"])
async def update_project(
    project_id: UUID,
    project_update: ProjectUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> ProjectResponse:
    """Update project
    
    Args:
        project_id: Project ID
        project_update: Updated project data
        db: Database session
        current_user: Authenticated user
        
    Returns:
        Updated project
        
    Raises:
        HTTPException: If project not found or update fails
    """
    try:
        project = ProjectService.get_project_by_id(db, project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )

        updated_project = ProjectService.update_project(db, project_id, project_update)
        return ProjectResponse.model_validate(updated_project)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update project: {str(e)}"
        )


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["projects"])
async def delete_project(
    project_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> None:
    """Delete project
    
    Args:
        project_id: Project ID
        db: Database session
        current_user: Authenticated user
        
    Raises:
        HTTPException: If project not found or deletion fails
    """
    try:
        project = ProjectService.get_project_by_id(db, project_id)
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )

        deleted = ProjectService.delete_project(db, project_id)
        if not deleted:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to delete project"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to delete project: {str(e)}"
        )
