"""
User context API endpoints - Manage user goals and notes
These are used as context for AI suggestion generation
"""

import logging

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from src.dependencies import get_authenticated_user
from src.repository.database import get_db
from src.repository.repositories import UserRepository
from src.schemas import ContextUpdate, ErrorResponse, UserResponse

logger = logging.getLogger(__name__)

router = APIRouter()


# ============================================================================
# GET USER CONTEXT
# ============================================================================


@router.get(
    "",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Context retrieved successfully"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
    },
)
async def get_user_context(
    user=Depends(get_authenticated_user), db: Session = Depends(get_db)
):
    """
    Get the authenticated user's goals and notes

    These are used as context for AI suggestion generation
    """
    context = UserRepository.get_user_context(db, user.id)

    if not context:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, detail="User not found"
        )

    goals, notes = context

    logger.info(f"Retrieved context for user {user.id}")
    return {
        "goals": goals if goals else None,
        "notes": notes if notes else None,
        "has_context": bool(goals or notes),
        "message": "Your context will be used to generate personalized AI suggestions",
    }


# ============================================================================
# UPDATE USER CONTEXT
# ============================================================================


@router.put(
    "",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Context updated successfully"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
        400: {"model": ErrorResponse, "description": "Bad request"},
    },
)
async def update_user_context(
    context_data: ContextUpdate,
    user=Depends(get_authenticated_user),
    db: Session = Depends(get_db),
):
    """
    Update the authenticated user's goals and/or notes

    - **goals**: Your personal/professional goals (optional)
    - **notes**: Any additional notes or context (optional)

    At least one field must be provided
    """
    # Validate that at least one field is provided
    if context_data.goals is None and context_data.notes is None:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="At least one field (goals or notes) must be provided",
        )

    logger.info(f"Updating context for user {user.id}")

    updated_user = UserRepository.update_user_context(db, user.id, context_data)

    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error updating context",
        )

    logger.info(f"Context updated for user {user.id}")
    return {
        "success": True,
        "message": "Context updated successfully",
        "goals": updated_user.goals,
        "notes": updated_user.notes,
        "user": UserResponse.model_validate(updated_user),
    }


# ============================================================================
# GET USER PROFILE WITH CONTEXT
# ============================================================================


@router.get(
    "/profile",
    response_model=dict,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Profile retrieved successfully"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
    },
)
async def get_profile_with_context(
    user=Depends(get_authenticated_user), db: Session = Depends(get_db)
):
    """
    Get the authenticated user's full profile including goals and notes
    """
    logger.info(f"Retrieved profile for user {user.id}")
    return {
        "user": UserResponse.model_validate(user),
        "context": {"goals": user.goals, "notes": user.notes},
        "has_goals": bool(user.goals),
        "has_notes": bool(user.notes),
    }


# ============================================================================
# CLEAR USER CONTEXT
# ============================================================================


@router.delete(
    "",
    status_code=status.HTTP_204_NO_CONTENT,
    responses={
        204: {"description": "Context cleared successfully"},
        401: {"model": ErrorResponse, "description": "Unauthorized"},
    },
)
async def clear_user_context(
    user=Depends(get_authenticated_user), db: Session = Depends(get_db)
):
    """
    Clear the authenticated user's goals and notes

    Note: This will reset your context, which may affect AI suggestion quality
    """
    clear_data = ContextUpdate(goals="", notes="")

    updated_user = UserRepository.update_user_context(db, user.id, clear_data)

    if not updated_user:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error clearing context",
        )

    logger.info(f"Context cleared for user {user.id}")
    return None


# ============================================================================
# GET CONTEXT GUIDELINES
# ============================================================================


@router.get(
    "/guidelines/best-practices",
    status_code=status.HTTP_200_OK,
)
async def get_context_guidelines():
    """
    Get best practices for setting effective goals and notes

    Helps users create better context for AI suggestions
    """
    return {
        "goals": {
            "description": "Define your short-term and long-term objectives",
            "examples": [
                "Learn FastAPI and LangChain for AI backend development",
                "Build a portfolio project to showcase full-stack skills",
                "Improve code quality and write comprehensive documentation",
                "Master React Native for cross-platform mobile development",
            ],
            "tips": [
                "Be specific and measurable",
                "Include both personal and professional goals",
                "Update regularly as priorities change",
                "Include learning objectives",
            ],
        },
        "notes": {
            "description": "Add context about your current situation and preferences",
            "examples": [
                "Currently focused on backend development with AI integration",
                "Prefer short tasks (30 mins) over long ones",
                "Available 2 hours per day for side projects",
                "Interested in open-source contributions",
            ],
            "tips": [
                "Mention your current focus areas",
                "Note any constraints or preferences",
                "Add relevant technologies or tools you're using",
                "Include your availability and work style",
            ],
        },
        "impact": "Well-defined goals and notes lead to more relevant and actionable AI suggestions",
    }


# ============================================================================
# VALIDATE CONTEXT
# ============================================================================


@router.post(
    "/validate",
    status_code=status.HTTP_200_OK,
)
async def validate_context(
    context_data: ContextUpdate, user=Depends(get_authenticated_user)
):
    """
    Validate context before saving

    Checks for quality and provides feedback
    """
    feedback = {"valid": True, "warnings": [], "suggestions": []}

    # Validate goals
    if context_data.goals:
        if len(context_data.goals.strip()) < 10:
            feedback["warnings"].append(
                "Goals are very short, consider adding more detail"
            )
        if len(context_data.goals) > 1000:
            feedback["warnings"].append(
                "Goals are very long, consider being more concise"
            )
    else:
        feedback["suggestions"].append(
            "Consider adding goals for better AI suggestions"
        )

    # Validate notes
    if context_data.notes:
        if len(context_data.notes.strip()) < 10:
            feedback["warnings"].append(
                "Notes are very short, consider adding more context"
            )
        if len(context_data.notes) > 1000:
            feedback["warnings"].append(
                "Notes are very long, consider being more concise"
            )
    else:
        feedback["suggestions"].append("Consider adding notes for better AI context")

    # Overall check
    if not context_data.goals and not context_data.notes:
        feedback["valid"] = False
        feedback["warnings"].append("At least one field (goals or notes) is required")

    logger.info(f"Context validation for user {user.id}: valid={feedback['valid']}")
    return feedback
