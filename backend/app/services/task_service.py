"""Task service - business logic for task operations"""

from uuid import UUID
from typing import Optional, List
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app.models.task import Task
from app.schemas.task import TaskCreate, TaskUpdate, TaskStatus


class TaskService:
    """Service for task operations"""
    
    @staticmethod
    def create_task(db: Session, task: TaskCreate) -> Task:
        """Create a new task"""
        db_task = Task(
            board_id=task.board_id,
            title=task.title,
            description=task.description,
            priority=task.priority.value,
            status=task.status.value,
        )
        db.add(db_task)
        db.commit()
        db.refresh(db_task)
        return db_task
    
    @staticmethod
    def get_task_by_id(db: Session, task_id: UUID) -> Optional[Task]:
        """Get task by ID"""
        return db.query(Task).filter(Task.id == task_id).first()
    
    @staticmethod
    def get_tasks(
        db: Session,
        project_id: Optional[UUID] = None,
        board_id: Optional[UUID] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Task]:
        """Get tasks with optional filtering"""
        query = db.query(Task)
        
        # Apply filters
        filters = []
        if board_id:
            filters.append(Task.board_id == board_id)
        
        if filters:
            query = query.filter(and_(*filters))
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def update_task(db: Session, task_id: UUID, task_update: TaskUpdate) -> Optional[Task]:
        """Update task"""
        db_task = TaskService.get_task_by_id(db, task_id)
        if not db_task:
            return None
        
        update_data = task_update.model_dump(exclude_unset=True)
        
        # Convert enums to their string values
        if "status" in update_data and update_data["status"] is not None:
            update_data["status"] = update_data["status"].value
        if "priority" in update_data and update_data["priority"] is not None:
            update_data["priority"] = update_data["priority"].value
        
        for key, value in update_data.items():
            if value is not None:
                setattr(db_task, key, value)
        
        db.commit()
        db.refresh(db_task)
        return db_task
    
    @staticmethod
    def update_task_status(db: Session, task_id: UUID, status: TaskStatus) -> Optional[Task]:
        """Update task status"""
        db_task = TaskService.get_task_by_id(db, task_id)
        if not db_task:
            return None
        
        db_task.status = status.value
        db.commit()
        db.refresh(db_task)
        return db_task
    
    @staticmethod
    def delete_task(db: Session, task_id: UUID) -> bool:
        """Delete task"""
        db_task = TaskService.get_task_by_id(db, task_id)
        if not db_task:
            return False
        
        db.delete(db_task)
        db.commit()
        return True
