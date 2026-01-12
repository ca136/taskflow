"""Task CRUD endpoints"""

from uuid import UUID
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.task import TaskCreate, TaskUpdate, TaskStatusUpdate, TaskResponse, TaskStatus
from app.services.task_service import TaskService

router = APIRouter()


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED, tags=["tasks"])
async def create_task(
    task: TaskCreate,
    db: Session = Depends(get_db)
) -> TaskResponse:
    """Create a new task

    Args:
        task: Task creation data
        db: Database session

    Returns:
        Created task

    Raises:
        HTTPException: If task creation fails
    """
    try:
        db_task = TaskService.create_task(db, task)
        return TaskResponse.model_validate(db_task)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to create task: {str(e)}"
        )


@router.get("", response_model=List[TaskResponse], tags=["tasks"])
async def list_tasks(
    board_id: Optional[UUID] = Query(None, description="Filter by board ID"),
    skip: int = Query(0, ge=0, description="Number of records to skip"),
    limit: int = Query(100, ge=1, le=1000, description="Maximum number of records to return"),
    db: Session = Depends(get_db)
) -> List[TaskResponse]:
    """List all tasks with optional filtering

    Args:
        board_id: Optional board ID to filter tasks
        skip: Number of records to skip (default: 0)
        limit: Maximum number of records to return (default: 100)
        db: Database session

    Returns:
        List of tasks
    """
    try:
        tasks = TaskService.get_tasks(db, board_id=board_id, skip=skip, limit=limit)
        return [TaskResponse.model_validate(t) for t in tasks]
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to list tasks: {str(e)}"
        )


@router.get("/{task_id}", response_model=TaskResponse, tags=["tasks"])
async def get_task(
    task_id: UUID,
    db: Session = Depends(get_db)
) -> TaskResponse:
    """Get a specific task by ID

    Args:
        task_id: Task ID
        db: Database session

    Returns:
        Task details

    Raises:
        HTTPException: If task not found
    """
    try:
        task = TaskService.get_task_by_id(db, task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task with ID {task_id} not found"
            )
        return TaskResponse.model_validate(task)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to get task: {str(e)}"
        )


@router.put("/{task_id}", response_model=TaskResponse, tags=["tasks"])
async def update_task(
    task_id: UUID,
    task_update: TaskUpdate,
    db: Session = Depends(get_db)
) -> TaskResponse:
    """Update a task

    Args:
        task_id: ID of the task to update
        task_update: Updated task data
        db: Database session

    Returns:
        Updated task

    Raises:
        HTTPException: If task not found or update fails
    """
    try:
        task = TaskService.get_task_by_id(db, task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task with ID {task_id} not found"
            )

        updated_task = TaskService.update_task(db, task_id, task_update)
        return TaskResponse.model_validate(updated_task)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update task: {str(e)}"
        )


@router.patch("/{task_id}/status", response_model=TaskResponse, tags=["tasks"])
async def update_task_status(
    task_id: UUID,
    status_update: TaskStatusUpdate,
    db: Session = Depends(get_db)
) -> TaskResponse:
    """Update task status

    Args:
        task_id: ID of the task
        status_update: New task status
        db: Database session

    Returns:
        Updated task

    Raises:
        HTTPException: If task not found or update fails
    """
    try:
        task = TaskService.get_task_by_id(db, task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task with ID {task_id} not found"
            )

        updated_task = TaskService.update_task_status(db, task_id, status_update.status)
        return TaskResponse.model_validate(updated_task)
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to update task status: {str(e)}"
        )


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT, tags=["tasks"])
async def delete_task(
    task_id: UUID,
    db: Session = Depends(get_db)
) -> None:
    """Delete a task

    Args:
        task_id: ID of the task to delete
        db: Database session

    Raises:
        HTTPException: If task not found or deletion fails
    """
    try:
        task = TaskService.get_task_by_id(db, task_id)
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Task with ID {task_id} not found"
            )

        success = TaskService.delete_task(db, task_id)
        if not success:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Failed to delete task"
            )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to delete task: {str(e)}"
        )
