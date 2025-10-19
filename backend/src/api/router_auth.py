"""
Authentication API endpoints - Register, Login, Get Current User
"""

import logging

from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session

from src.repository.database import get_db
from src.schemas import (
    ErrorResponse,
    TokenResponse,
    UserLogin,
    UserRegister,
    UserResponse,
)
from src.services.auth_service import (
    authenticate_user,
    create_token_response,
    get_current_user,
    register_user,
)

logger = logging.getLogger(__name__)

router = APIRouter()


# ============================================================================
# DEPENDENCY: Get Token from Header
# ============================================================================


def get_token_from_header(authorization: str | None) -> str:
    """Extract and validate Bearer token from Authorization header"""
    if not authorization:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Authorization header missing",
            headers={"WWW-Authenticate": "Bearer"},
        )

    parts = authorization.split()
    if len(parts) != 2 or parts[0].lower() != "bearer":
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authorization header format",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return parts[1]


# ============================================================================
# REGISTER ENDPOINT
# ============================================================================


@router.post(
    "/register",
    response_model=TokenResponse,
    status_code=status.HTTP_201_CREATED,
    responses={
        201: {"description": "User registered successfully"},
        400: {"model": ErrorResponse, "description": "Email already registered"},
    },
)
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """
    Register a new user

    - **email**: User email (must be unique)
    - **password**: Password (minimum 8 characters)
    """
    success, message, user = register_user(db, user_data)

    if not success:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=message)

    logger.info(f"User registered: {user.email}")  # type: ignore
    return create_token_response(user)


# ============================================================================
# LOGIN ENDPOINT
# ============================================================================


@router.post(
    "/login",
    response_model=TokenResponse,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "Login successful"},
        401: {"model": ErrorResponse, "description": "Invalid credentials"},
    },
)
async def login(credentials: UserLogin, db: Session = Depends(get_db)):
    """
    Authenticate user and return access token

    - **email**: User email
    - **password**: User password
    """
    success, message, user = authenticate_user(
        db, credentials.email, credentials.password
    )

    if not success:
        logger.warning(f"Login failed for email: {credentials.email}")
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail=message)

    logger.info(f"User logged in: {user.email}")  # type: ignore
    return create_token_response(user)


# ============================================================================
# GET CURRENT USER ENDPOINT
# ============================================================================


@router.get(
    "/me",
    response_model=UserResponse,
    status_code=status.HTTP_200_OK,
    responses={
        200: {"description": "User profile retrieved"},
        401: {"model": ErrorResponse, "description": "Invalid or missing token"},
    },
)
async def get_current_user_profile(
    authorization: str | None = Header(None), db: Session = Depends(get_db)
):
    """
    Get current authenticated user's profile

    Requires valid JWT token in Authorization header: Bearer <token>
    """
    token = get_token_from_header(authorization)

    user = get_current_user(db, token)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    logger.info(f"User profile retrieved: {user.email}")  # type: ignore
    return UserResponse.model_validate(user)


# ============================================================================
# LOGOUT ENDPOINT (Frontend clears token)
# ============================================================================


@router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    responses={200: {"description": "Logout successful"}},
)
async def logout(authorization: str | None = Header(None)):
    """
    Logout endpoint (token is managed on frontend)

    - Frontend should delete the stored token
    - This endpoint is mainly for documentation purposes
    """
    get_token_from_header(authorization)

    logger.info("User logged out")
    return {
        "message": "Logged out successfully",
        "detail": "Token has been invalidated on frontend",
    }
