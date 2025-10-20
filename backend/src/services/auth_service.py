"""
Authentication service for user registration, login, and JWT token management
"""

import logging
import os
from datetime import datetime, timedelta, timezone
from typing import Optional

import jwt
from passlib.context import CryptContext
from sqlalchemy.orm import Session

from src.repository.database import User
from src.schemas import TokenResponse, UserRegister, UserResponse

logger = logging.getLogger(__name__)

# Password hashing configuration
pwd_context = CryptContext(
    schemes=["bcrypt"],
    deprecated="auto",
    bcrypt__rounds=12,
)

# JWT configuration
SECRET_KEY = os.getenv(
    "SECRET_KEY", "your-secret-key-change-in-production-use-32-char-minimum"
)
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))


# ============================================================================
# PASSWORD MANAGEMENT
# ============================================================================


def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)


# ============================================================================
# JWT TOKEN MANAGEMENT
# ============================================================================


def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Create a JWT access token

    Args:
        data: Dictionary containing token claims (e.g., {"sub": user_id})
        expires_delta: Optional custom expiration time

    Returns:
        Encoded JWT token
    """
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(
            minutes=ACCESS_TOKEN_EXPIRE_MINUTES
        )

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_token(token: str) -> Optional[dict]:
    """
    Decode and verify a JWT token

    Args:
        token: JWT token string

    Returns:
        Decoded token payload or None if invalid
    """
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        logger.warning("Token has expired")
        return None
    except jwt.InvalidTokenError as e:
        logger.warning(f"Invalid token: {str(e)}")
        return None


def get_user_id_from_token(token: str) -> Optional[int]:
    """
    Extract user ID from token

    Args:
        token: JWT token string

    Returns:
        User ID or None if token is invalid
    """
    payload = decode_token(token)
    if payload:
        return payload.get("sub")
    return None


# ============================================================================
# USER REGISTRATION & LOGIN
# ============================================================================


def register_user(
    db: Session, user_data: UserRegister
) -> tuple[bool, str, Optional[User]]:
    """
    Register a new user

    Args:
        db: Database session
        user_data: User registration data

    Returns:
        Tuple of (success, message, user)
        - success: True if registration successful
        - message: Success or error message
        - user: User object if successful, None otherwise
    """
    # Check if user already exists
    existing_user = db.query(User).filter(User.email == user_data.email).first()
    if existing_user:
        logger.warning(
            f"Registration failed: User with email {user_data.email} already exists"
        )
        return False, "Email already registered", None

    try:
        # Create new user
        new_user = User(
            email=user_data.email, hashed_password=hash_password(user_data.password)
        )

        db.add(new_user)
        db.commit()
        db.refresh(new_user)

        logger.info(f"User registered successfully: {new_user.email}")
        return True, "User registered successfully", new_user

    except Exception as e:
        db.rollback()
        logger.error(f"Error registering user: {str(e)}")
        return False, "Error registering user", None


def authenticate_user(
    db: Session, email: str, password: str
) -> tuple[bool, str, Optional[User]]:
    """
    Authenticate user and return user object

    Args:
        db: Database session
        email: User email
        password: User password

    Returns:
        Tuple of (success, message, user)
        - success: True if authentication successful
        - message: Success or error message
        - user: User object if successful, None otherwise
    """
    # Find user by email
    user = db.query(User).filter(User.email == email).first()

    if not user:
        logger.warning(f"Login failed: User with email {email} not found")
        return False, "Invalid email or password", None

    # Verify password
    if not verify_password(password, user.hashed_password):  # type: ignore
        logger.warning(f"Login failed: Invalid password for user {email}")
        return False, "Invalid email or password", None

    logger.info(f"User authenticated successfully: {email}")
    return True, "Authentication successful", user


def create_token_response(user: User) -> TokenResponse:
    """
    Create a token response for authenticated user

    Args:
        user: User object

    Returns:
        TokenResponse with access token and user data
    """
    # Create access token
    access_token = create_access_token(data={"sub": user.id})

    # Create response
    return TokenResponse(
        access_token=access_token,
        token_type="bearer",
        user=UserResponse.model_validate(user),
    )


# ============================================================================
# GET CURRENT USER
# ============================================================================


def get_current_user(db: Session, token: str) -> Optional[User]:
    """
    Get current authenticated user from token

    Args:
        db: Database session
        token: JWT token

    Returns:
        User object or None if token is invalid
    """
    user_id = get_user_id_from_token(token)

    if not user_id:
        return None

    user = db.query(User).filter(User.id == user_id).first()
    return user
