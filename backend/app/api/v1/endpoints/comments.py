"""Comment endpoints."""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.api.deps import get_current_user, verify_task_access
from app.db.session import get_db
from app.models.comment import Comment
from app.models.user import User
from app.schemas.comment import CommentCreate, CommentResponse, CommentUpdate

router = APIRouter()


def _comment_to_response(comment: Comment) -> dict:
    return {
        "id": comment.id,
        "task_id": comment.task_id,
        "user_id": comment.user_id,
        "content": comment.content,
        "author_name": comment.user.full_name if comment.user else "",
        "created_at": comment.created_at,
        "updated_at": comment.updated_at,
    }


@router.post(
    "/tasks/{task_id}/comments",
    response_model=CommentResponse,
    status_code=status.HTTP_201_CREATED,
)
async def create_comment(
    task_id: UUID,
    body: CommentCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await verify_task_access(task_id, current_user, db)
    comment = Comment(task_id=task_id, user_id=current_user.id, content=body.content)
    db.add(comment)
    await db.commit()
    # Load with user relationship in one query
    result = await db.execute(
        select(Comment).where(Comment.id == comment.id).options(selectinload(Comment.user))
    )
    comment = result.scalar_one()
    return _comment_to_response(comment)


@router.get("/tasks/{task_id}/comments", response_model=list[CommentResponse])
async def list_comments(
    task_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await verify_task_access(task_id, current_user, db)
    result = await db.execute(
        select(Comment)
        .where(Comment.task_id == task_id)
        .options(selectinload(Comment.user))
        .order_by(Comment.created_at)
    )
    return [_comment_to_response(c) for c in result.scalars().all()]


@router.patch("/tasks/{task_id}/comments/{comment_id}", response_model=CommentResponse)
async def update_comment(
    task_id: UUID,
    comment_id: UUID,
    body: CommentUpdate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await verify_task_access(task_id, current_user, db)
    result = await db.execute(
        select(Comment)
        .where(Comment.id == comment_id, Comment.task_id == task_id)
        .options(selectinload(Comment.user))
    )
    comment = result.scalar_one_or_none()
    if comment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    if comment.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Can only edit own comments")

    for key, value in body.model_dump(exclude_unset=True).items():
        setattr(comment, key, value)
    await db.commit()
    await db.refresh(comment)
    return _comment_to_response(comment)


@router.delete(
    "/tasks/{task_id}/comments/{comment_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
async def delete_comment(
    task_id: UUID,
    comment_id: UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await verify_task_access(task_id, current_user, db)
    result = await db.execute(
        select(Comment).where(Comment.id == comment_id, Comment.task_id == task_id)
    )
    comment = result.scalar_one_or_none()
    if comment is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Comment not found")
    if comment.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Can only delete own comments")
    await db.delete(comment)
    await db.commit()
