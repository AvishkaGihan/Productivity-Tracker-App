"""
Pydantic schemas for request/response validation
"""

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, EmailStr, Field

# ============================================================================
# AUTHENTICATION SCHEMAS
# ============================================================================


class UserRegister(BaseModel):
    """Schema for user registration"""

    email: EmailStr = Field(..., description="User email address")
    password: str = Field(
        ..., min_length=8, description="Password (minimum 8 characters)"
    )

    model_config = {
        "json_schema_extra": {
            "example": {"email": "user@example.com", "password": "password123"}
        }
    }


class UserLogin(BaseModel):
    """Schema for user login"""

    email: EmailStr = Field(..., description="User email address")
    password: str = Field(..., description="User password")

    model_config = {
        "json_schema_extra": {
            "example": {"email": "user@example.com", "password": "password123"}
        }
    }


class UserResponse(BaseModel):
    """Schema for user response (without password)"""

    id: int
    email: str
    goals: Optional[str] = None
    notes: Optional[str] = None
    created_at: datetime

    model_config = {
        "from_attributes": True,
        "json_schema_extra": {
            "example": {
                "id": 1,
                "email": "user@example.com",
                "goals": "Learn FastAPI, build portfolio projects",
                "notes": "Starting backend development",
                "created_at": "2025-10-18T12:00:00",
            }
        },
    }


class TokenResponse(BaseModel):
    """Schema for authentication token response"""

    access_token: str = Field(..., description="JWT access token")
    token_type: str = Field(default="bearer", description="Token type")
    user: UserResponse = Field(..., description="Authenticated user data")


# ============================================================================
# TASK SCHEMAS
# ============================================================================


class TaskCreate(BaseModel):
    """Schema for creating a new task"""

    title: str = Field(..., min_length=1, max_length=255, description="Task title")

    model_config = {
        "json_schema_extra": {
            "example": {"title": "Implement authentication API endpoints"}
        }
    }


class TaskUpdate(BaseModel):
    """Schema for updating a task"""

    title: Optional[str] = Field(
        None, min_length=1, max_length=255, description="Task title"
    )
    is_completed: Optional[bool] = Field(None, description="Completion status")

    model_config = {
        "json_schema_extra": {
            "example": {
                "title": "Implement authentication API endpoints",
                "is_completed": False,
            }
        }
    }


class TaskResponse(BaseModel):
    """Schema for task response"""

    id: int
    user_id: int
    title: str
    is_completed: bool
    created_at: datetime

    model_config = {
        "from_attributes": True,
        "json_schema_extra": {
            "example": {
                "id": 1,
                "user_id": 1,
                "title": "Implement authentication API endpoints",
                "is_completed": False,
                "created_at": "2025-10-18T12:00:00",
            }
        },
    }


class TaskListResponse(BaseModel):
    """Schema for task list response with statistics"""

    tasks: List[TaskResponse]
    total: int
    completed: int
    pending: int


# ============================================================================
# CONTEXT SCHEMAS (Goals and Notes)
# ============================================================================


class ContextUpdate(BaseModel):
    """Schema for updating user goals and notes"""

    goals: Optional[str] = Field(None, description="User's goals (text)")
    notes: Optional[str] = Field(None, description="User's notes (text)")

    model_config = {
        "json_schema_extra": {
            "example": {
                "goals": "Learn FastAPI, build a portfolio project, master LangChain",
                "notes": "Currently focused on backend development with AI integration",
            }
        }
    }


class ContextResponse(BaseModel):
    """Schema for context response"""

    goals: Optional[str] = None
    notes: Optional[str] = None

    model_config = {"from_attributes": True}


# ============================================================================
# AI SUGGESTION SCHEMAS
# ============================================================================


class AISuggestionRequest(BaseModel):
    """Schema for AI suggestion request"""

    query: str = Field(..., min_length=1, description="Natural language query for AI")

    model_config = {
        "json_schema_extra": {
            "example": {
                "query": "Suggest tasks based on my goals to improve productivity"
            }
        }
    }


class SuggestedTask(BaseModel):
    """Schema for a single suggested task"""

    title: str = Field(..., description="Suggested task title")
    reason: Optional[str] = Field(None, description="Why this task was suggested")


class AISuggestionResponse(BaseModel):
    """Schema for AI suggestion response"""

    success: bool = Field(..., description="Whether suggestion generation succeeded")
    suggestions: List[SuggestedTask] = Field(
        default_factory=list, description="List of suggested tasks"
    )
    message: Optional[str] = Field(
        None, description="Additional message or error details"
    )
    query_context: Optional[str] = Field(
        None, description="User's goals and notes context sent to AI"
    )

    model_config = {
        "json_schema_extra": {
            "example": {
                "success": True,
                "suggestions": [
                    {
                        "title": "Create project documentation",
                        "reason": "Supports goal of building portfolio projects",
                    },
                    {
                        "title": "Study LangChain prompt engineering",
                        "reason": "Aligns with learning objectives",
                    },
                ],
                "message": "Generated 2 context-aware task suggestions",
                "query_context": "Goals: Learn FastAPI, build portfolio. Notes: Backend focus.",
            }
        }
    }


# ============================================================================
# ERROR SCHEMAS
# ============================================================================


class ErrorResponse(BaseModel):
    """Schema for error responses"""

    error: str = Field(..., description="Error message")
    detail: Optional[str] = Field(None, description="Detailed error information")
    code: Optional[str] = Field(None, description="Error code")

    model_config = {
        "json_schema_extra": {
            "example": {
                "error": "Invalid credentials",
                "detail": "Email or password is incorrect",
                "code": "AUTH_001",
            }
        }
    }
