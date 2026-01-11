"""Task endpoints for CRUD operations"""

from typing import List, Optional
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.models.task import Task
from app.models.user import User
from app.schemas.task import TaskCreate, TaskUpdate, TaskStatusUpdate, TaskResponse, TaskStatus
from app.database import get_db
from app.api.v1.dependencies import get_current_user

router = APIRouter()


@router.post(
    "/tasks",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    tags=["tasks"]
)
def create_task(
    task_in: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TaskResponse:
    """Create a new task.
    
    - **title**: Task title (required)
    - **description**: Task description (optional)
    - **priority**: Task priority - low, medium, high (default: medium)
    - **status**: Task status - todo, in_progress, done (default: todo)
    - **board_id**: ID of the board this task belongs to (required)
    - **assignee**: UUID of the user assigned to this task (optional)
    """
    # Create new task
    task = Task(
        title=task_in.title,
        description=task_in.description,
        priority=task_in.priority,
        status=task_in.status,
        board_id=task_in.board_id,
        assignee=task_in.assignee,
    )
    
    db.add(task)
    db.commit()
    db.refresh(task)
    
    return TaskResponse.from_orm(task)


@router.get(
    "/tasks",
    response_model=List[TaskResponse],
    tags=["tasks"]
)
def list_tasks(
    board_id: Optional[UUID] = None,
    status: Optional[TaskStatus] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> List[TaskResponse]:
    """List all tasks with optional filters.
    
    - **board_id**: Filter tasks by board ID (optional)
    - **status**: Filter tasks by status (optional)
    - **skip**: Number of records to skip (default: 0)
    - **limit**: Maximum number of records to return (default: 100)
    """
    query = db.query(Task)
    
    # Apply filters
    if board_id:
        query = query.filter(Task.board_id == board_id)
    
    if status:
        query = query.filter(Task.status == status)
    
    # Apply pagination
    tasks = query.offset(skip).limit(limit).all()
    
    return [TaskResponse.from_orm(task) for task in tasks]


@router.get(
    "/tasks/{task_id}",
    response_model=TaskResponse,
    tags=["tasks"]
)
def get_task(
    task_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TaskResponse:
    """Get a single task by ID."""
    task = db.query(Task).filter(Task.id == task_id).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found",
        )
    
    return TaskResponse.from_orm(task)


@router.put(
    "/tasks/{task_id}",
    response_model=TaskResponse,
    tags=["tasks"]
)
def update_task(
    task_id: UUID,
    task_in: TaskUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TaskResponse:
    """Update a task by ID.
    
    - **title**: New task title (optional)
    - **description**: New task description (optional)
    - **priority**: New task priority (optional)
    - **status**: New task status (optional)
    - **assignee**: New assignee UUID (optional)
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found",
        )
    
    # Update only provided fields
    if task_in.title is not None:
        task.title = task_in.title
    if task_in.description is not None:
        task.description = task_in.description
    if task_in.priority is not None:
        task.priority = task_in.priority
    if task_in.status is not None:
        task.status = task_in.status
    if task_in.assignee is not None:
        task.assignee = task_in.assignee
    
    db.commit()
    db.refresh(task)
    
    return TaskResponse.from_orm(task)


@router.patch(
    "/tasks/{task_id}/status",
    response_model=TaskResponse,
    tags=["tasks"]
)
def update_task_status(
    task_id: UUID,
    status_in: TaskStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> TaskResponse:
    """Update only the status of a task.
    
    - **status**: New status - todo, in_progress, done (required)
    """
    task = db.query(Task).filter(Task.id == task_id).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found",
        )
    
    task.status = status_in.status
    
    db.commit()
    db.refresh(task)
    
    return TaskResponse.from_orm(task)


@router.delete(
    "/tasks/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    tags=["tasks"]
)
def delete_task(
    task_id: UUID,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> None:
    """Delete a task by ID."""
    task = db.query(Task).filter(Task.id == task_id).first()
    
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Task with id {task_id} not found",
        )
    
    db.delete(task)
    db.commit()
