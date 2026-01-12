"""Project service - business logic for project operations"""

from uuid import UUID
from sqlalchemy.orm import Session
from sqlalchemy.exc import SQLAlchemyError
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate


class ProjectService:
    """Service for project operations"""

    @staticmethod
    def create_project(db: Session, project: ProjectCreate, created_by: UUID) -> Project:
        """Create a new project
        
        Args:
            db: Database session
            project: Project creation data
            created_by: User ID creating the project
            
        Returns:
            Created project instance
        """
        db_project = Project(
            name=project.name,
            description=project.description,
            created_by=created_by
        )
        db.add(db_project)
        db.commit()
        db.refresh(db_project)
        return db_project

    @staticmethod
    def get_project_by_id(db: Session, project_id: UUID) -> Project | None:
        """Get project by ID
        
        Args:
            db: Database session
            project_id: Project ID
            
        Returns:
            Project instance or None if not found
        """
        return db.query(Project).filter(Project.id == project_id).first()

    @staticmethod
    def get_all_projects(db: Session, skip: int = 0, limit: int = 100) -> list[Project]:
        """Get all projects with pagination
        
        Args:
            db: Database session
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            List of projects
        """
        return db.query(Project).offset(skip).limit(limit).all()

    @staticmethod
    def get_projects_by_user(db: Session, user_id: UUID, skip: int = 0, limit: int = 100) -> list[Project]:
        """Get projects created by a specific user
        
        Args:
            db: Database session
            user_id: User ID
            skip: Number of records to skip
            limit: Maximum number of records to return
            
        Returns:
            List of projects
        """
        return db.query(Project).filter(Project.created_by == user_id).offset(skip).limit(limit).all()

    @staticmethod
    def update_project(db: Session, project_id: UUID, project_update: ProjectUpdate) -> Project | None:
        """Update project information
        
        Args:
            db: Database session
            project_id: Project ID
            project_update: Updated project data
            
        Returns:
            Updated project instance or None if not found
        """
        db_project = ProjectService.get_project_by_id(db, project_id)
        if not db_project:
            return None

        update_data = project_update.model_dump(exclude_unset=True)

        for key, value in update_data.items():
            setattr(db_project, key, value)

        db.commit()
        db.refresh(db_project)
        return db_project

    @staticmethod
    def delete_project(db: Session, project_id: UUID) -> bool:
        """Delete project
        
        Args:
            db: Database session
            project_id: Project ID
            
        Returns:
            True if deleted, False if not found
        """
        db_project = ProjectService.get_project_by_id(db, project_id)
        if not db_project:
            return False

        db.delete(db_project)
        db.commit()
        return True
