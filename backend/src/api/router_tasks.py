"""
Task management API endpoints - CRUD operations for tasks
"""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session

from src.repository.database import get_db
from src.repository.repositories import TaskRepository
from src.schemas import (
    ErrorResponse,
    TaskCreate,
    TaskListResponse,
    TaskResponse,
    TaskUpdate,
)
from src.services.auth_service import get_current_user

logger = logging.getLogger(__name__)

router = APIRouter()


# ============================================================================
# DEPENDENCY: Get Authenticated User
# ============================================================================


async def get_auth_user(
    authorization: Optional[str] = None, db: Session = Depends(get_db)
):
    """Extract user from Authorization header token"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
        )

    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format",
        )

    token = parts[1]
    user = get_current_user(db, token)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token"
        )

    return user


# ============================================================================
# CREATE TASK
# ============================================================================


@router.post(
    "",
    response_model=TaskResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        201: {"description": "Task created successfully"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
    },
)
async def create_task(
    task_data: TaskCreate, user=Depends(get_auth_user), db: Session = Depends(get_db)
):
    """
    Create a new task for the authenticated user

    - **title**: Task title (required, 1-255 characters)
    """
    created_task = TaskRepository.create_task(db, user.id, task_data)

    if not created_task:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating task",
        )

    logger.info(f"Task created: {created_task.id} for user {user.id}")
    return TaskResponse.model_validate(created_task)


# ============================================================================
# GET ALL TASKS
# ============================================================================


@router.get(
    "",
    response_model=TaskListResponse,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Tasks retrieved successfully"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
    },
)
async def get_tasks(
    status_filter: str = Query(None, description="Filter: all, completed, pending"),
    user=Depends(get_auth_user),
    db: Session = Depends(get_db),
):
    """
    Get all tasks for the authenticated user

    - **status_filter**: Optional filter (all, completed, pending)
    """
    if status_filter == "completed":
        tasks = TaskRepository.get_completed_tasks(db, user.id)
    elif status_filter == "pending":
        tasks = TaskRepository.get_pending_tasks(db, user.id)
    else:
        tasks = TaskRepository.get_tasks_by_user(db, user.id)

    stats = TaskRepository.get_task_statistics(db, user.id)

    logger.info(f"Retrieved {len(tasks)} tasks for user {user.id}")
    return TaskListResponse(
        tasks=[TaskResponse.model_validate(t) for t in tasks],
        total=stats["total"],
        completed=stats["completed"],
        pending=stats["pending"],
    )


# ============================================================================
# GET SINGLE TASK
# ============================================================================


@router.get(
    "/{task_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Task retrieved"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        404: {"model": ErrorResponse, "description": "Task not found"},
    },
)
async def get_task(
    task_id: int, user=Depends(get_auth_user), db: Session = Depends(get_db)
):
    """
    Get a specific task by ID

    - **task_id**: Task ID (must belong to authenticated user)
    """
    task = TaskRepository.get_task_by_id(db, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )

    # Verify task belongs to user
    if task.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to access this task",
        )

    return TaskResponse.model_validate(task)


# ============================================================================
# UPDATE TASK
# ============================================================================


@router.put(
    "/{task_id}",
    response_model=TaskResponse,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Task updated successfully"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        404: {"model": ErrorResponse, "description": "Task not found"},
    },
)
async def update_task(
    task_id: int,
    task_data: TaskUpdate,
    user=Depends(get_auth_user),
    db: Session = Depends(get_db),
):
    """
    Update a specific task

    - **task_id**: Task ID
    - **title**: New task title (optional)
    - **is_completed**: Mark as completed/pending (optional)
    """
    task = TaskRepository.get_task_by_id(db, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )

    # Verify task belongs to user
    if task.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to update this task",
        )

    updated_task = TaskRepository.update_task(db, task_id, task_data)

    if not updated_task:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating task",
        )

    logger.info(f"Task updated: {task_id}")
    return TaskResponse.model_validate(updated_task)


# ============================================================================
# DELETE TASK
# ============================================================================


@router.delete(
    "/{task_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        204: {"description": "Task deleted successfully"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        404: {"model": ErrorResponse, "description": "Task not found"},
    },
)
async def delete_task(
    task_id: int, user=Depends(get_auth_user), db: Session = Depends(get_db)
):
    """
    Delete a specific task

    - **task_id**: Task ID to delete
    """
    task = TaskRepository.get_task_by_id(db, task_id)

    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="Task not found"
        )

    # Verify task belongs to user
    if task.user_id != user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have permission to delete this task",
        )

    success = TaskRepository.delete_task(db, task_id)

    if not success:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error deleting task",
        )

    logger.info(f"Task deleted: {task_id}")
    return None


# ============================================================================
# GET TASK STATISTICS
# ============================================================================


@router.get(
    "/stats/overview",
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Statistics retrieved"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
    },
)
async def get_statistics(user=Depends(get_auth_user), db: Session = Depends(get_db)):
    """
    Get task statistics for the authenticated user

    Returns: total, completed, pending tasks and completion rate
    """
    stats = TaskRepository.get_task_statistics(db, user.id)

    logger.info(f"Retrieved statistics for user {user.id}")
    return {
        "total_tasks": stats["total"],
        "completed_tasks": stats["completed"],
        "pending_tasks": stats["pending"],
        "completion_rate": round(stats["completion_rate"], 2),
        "message": f"You have completed {stats['completed']} out of {stats['total']} tasks",
    }
