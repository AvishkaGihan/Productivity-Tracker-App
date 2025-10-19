"""
AI suggestion API endpoints - LangChain/Gemini integration for task suggestions
"""

import logging
from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.repository.database import get_db
from src.repository.repositories import TaskRepository
from src.schemas import (
    AISuggestionRequest,
    AISuggestionResponse,
    ErrorResponse,
    TaskResponse,
)
from src.services.auth_service import get_current_user
from src.services.langchain_service import langchain_service

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
# GENERATE SUGGESTIONS
# ============================================================================


@router.post(
    "/suggest",
    response_model=AISuggestionResponse,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Suggestions generated successfully"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        503: {"model": ErrorResponse, "description": "AI service unavailable"},
    },
)
async def generate_suggestions(
    request: AISuggestionRequest,
    user=Depends(get_auth_user),
    db: Session = Depends(get_db),
):
    """
    Generate AI-powered task suggestions based on user's goals, notes, and query

    - **query**: Natural language query (e.g., "Suggest tasks for today")

    Returns: List of suggested tasks with reasoning
    """
    # Validate query
    if not request.query or len(request.query.strip()) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Query cannot be empty"
        )

    logger.info(f"Generating suggestions for user {user.id}: {request.query}")

    # Generate suggestions using LangChain
    response = langchain_service.generate_suggestions(
        db=db, user_id=user.id, query=request.query
    )

    if (
        not response.success
        and response.message
        and "not available" in response.message.lower()
    ):
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=response.message
        )

    logger.info(f"Generated {len(response.suggestions)} suggestions for user {user.id}")
    return response


# ============================================================================
# VALIDATE AI CONNECTION
# ============================================================================


@router.get(
    "/health",
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "AI service is healthy"},
        503: {"description": "AI service is unavailable"},
    },
)
async def check_ai_health():
    """
    Check if AI service (LangChain/Gemini) is operational

    Returns: Status of AI service connection
    """
    is_valid = langchain_service.validate_connection()

    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI service is not available. Check API configuration.",
        )

    logger.info("AI service health check passed")
    return {
        "status": "healthy",
        "service": "LangChain/Gemini API",
        "model": langchain_service.model_name,
    }


# ============================================================================
# CREATE TASK FROM SUGGESTION
# ============================================================================


@router.post(
    "/suggest-and-create",
    response_model=dict,
    status_code=status.HTTP_201_CREATED,
    responses={
        201: {"description": "Suggestions generated and tasks created"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        503: {"model": ErrorResponse, "description": "AI service unavailable"},
    },
)
async def suggest_and_create_tasks(
    request: AISuggestionRequest,
    user=Depends(get_auth_user),
    db: Session = Depends(get_db),
):
    """
    Generate AI suggestions and automatically create suggested tasks

    - **query**: Natural language query

    Returns: Suggestions and created tasks
    """
    if not request.query or len(request.query.strip()) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Query cannot be empty"
        )

    logger.info(f"Suggest and create for user {user.id}: {request.query}")

    # Generate suggestions
    response = langchain_service.generate_suggestions(
        db=db, user_id=user.id, query=request.query
    )

    if not response.success:
        if response.message and "not available" in response.message.lower():
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE, detail=response.message
            )
        else:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST, detail=response.message
            )

    # Create tasks from suggestions
    created_tasks = []
    for suggestion in response.suggestions:
        from src.schemas import TaskCreate

        task_data = TaskCreate(title=suggestion.title)
        created_task = TaskRepository.create_task(db, user.id, task_data)

        if created_task:
            created_tasks.append(TaskResponse.model_validate(created_task))

    logger.info(
        f"Created {len(created_tasks)} tasks from suggestions for user {user.id}"
    )

    return {
        "suggestions": response.suggestions,
        "created_tasks": created_tasks,
        "total_created": len(created_tasks),
        "message": f"Created {len(created_tasks)} task(s) from AI suggestions",
    }


# ============================================================================
# GET SUGGESTION EXAMPLES
# ============================================================================


@router.get(
    "/examples",
    status_code=status.HTTP_200_OK,
)
async def get_suggestion_examples():
    """
    Get example queries for AI suggestions

    Helpful for users learning how to use the AI feature
    """
    return {
        "examples": [
            "Suggest tasks to improve my productivity",
            "What tasks would help me achieve my goals?",
            "Generate actionable tasks for my goals",
            "Based on my interests, what should I work on?",
            "Suggest 5 tasks I should complete today",
        ],
        "tips": [
            "Make sure you've set your goals and notes first",
            "Be specific about what you want to accomplish",
            "Ask open-ended questions for better suggestions",
            "You can use follow-up queries to refine results",
        ],
    }
