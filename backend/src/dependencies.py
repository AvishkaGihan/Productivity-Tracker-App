"""
Common dependencies for authentication and authorization
Provides reusable FastAPI dependency functions for JWT token validation and user authentication
"""

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from sqlalchemy.orm import Session

from src.repository.database import User, get_db
from src.services.auth_service import get_current_user

# Security scheme for OpenAPI documentation
security = HTTPBearer()


async def get_authenticated_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
    db: Session = Depends(get_db),
) -> User:
    """
    Get current authenticated user from JWT token

    This is the main dependency function used across all protected endpoints.
    It validates the JWT token and returns the authenticated user.

    Args:
        credentials: HTTP Bearer token credentials from Authorization header
        db: Database session

    Returns:
        Authenticated User object

    Raises:
        HTTPException: If token is invalid, expired, or user not found
    """
    token = credentials.credentials
    user = get_current_user(db, token)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    return user
