"""
Productivity Tracker App - FastAPI Backend
Main application entry point with FastAPI setup and middleware configuration
"""

import logging
import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.router_ai import router as router_ai
from src.api.router_auth import router as router_auth
from src.api.router_context import router as router_context
from src.api.router_tasks import router as router_tasks
from src.repository.database import init_db

# Load environment variables
load_dotenv()

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


# Initialize database on startup
@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Application startup: Initializing database...")
    init_db()
    logger.info("Database initialized successfully")
    yield
    logger.info("Application shutdown")


# Create FastAPI application
app = FastAPI(
    title="Productivity Tracker API",
    description="FastAPI backend for AI-powered task management with LangChain and Gemini integration",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json",
    lifespan=lifespan,
)

# CORS middleware configuration
# Get allowed origins from environment or use defaults for development
allowed_origins = os.getenv(
    "ALLOWED_ORIGINS",
    "http://localhost:3000,http://localhost:8081,http://127.0.0.1:3000,http://127.0.0.1:8081,http://127.0.0.1:8000",
).split(",")

# Only allow wildcard in development
environment = os.getenv("ENVIRONMENT", "development")
if environment == "development":
    allowed_origins.append("*")

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint to verify API is running
    """
    return {
        "status": "healthy",
        "api": "Productivity Tracker API v1.0",
        "environment": os.getenv("ENVIRONMENT", "development"),
    }


# Include routers
app.include_router(router_auth, prefix="/api/v1/auth", tags=["Authentication"])
app.include_router(router_tasks, prefix="/api/v1/tasks", tags=["Tasks"])
app.include_router(router_ai, prefix="/api/v1/ai", tags=["AI Suggestions"])
app.include_router(router_context, prefix="/api/v1/context", tags=["User Context"])


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """
    Welcome endpoint
    """
    return {
        "message": "Welcome to Productivity Tracker API",
        "docs": "/docs",
        "redoc": "/redoc",
        "health": "/health",
    }


if __name__ == "__main__":
    import uvicorn

    host = os.getenv("API_HOST", "127.0.0.1")
    port = int(os.getenv("API_PORT", "8000"))

    uvicorn.run("main:app", host=host, port=port, reload=True, log_level="info")
