# Productivity Tracker Backend

FastAPI backend for the Productivity Tracker App with LangChain/Gemini AI integration.

## Quick Start

### 1. Setup Virtual Environment

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# macOS/Linux:
source venv/bin/activate

# Windows (Command Prompt):
venv\Scripts\activate

# Windows (PowerShell):
.\venv\Scripts\Activate.ps1
```

### 2. Install Dependencies

```bash
# Upgrade pip
pip install --upgrade pip

# Install all dependencies
pip install -r requirements.txt
```

### 3. Environment Configuration

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and configure:
# - GOOGLE_API_KEY: Get from https://ai.google.dev/gemini-api/docs/api-key
# - SECRET_KEY: Generate a secure key for production
# - DATABASE_URL: Adjust if needed (default: SQLite)
```

### 4. Initialize Database

```bash
# The database is initialized automatically on first app startup
# Or manually create tables with:
python -c "from src.repository.database import init_db; init_db()"
```

### 5. Run Development Server

```bash
# Start FastAPI development server
fastapi dev main.py

# Or with uvicorn directly:
uvicorn main:app --reload

# Server will start at: http://127.0.0.1:8000
```

### 6. Access API Documentation

- **Swagger UI**: http://127.0.0.1:8000/docs
- **ReDoc**: http://127.0.0.1:8000/redoc
- **OpenAPI JSON**: http://127.0.0.1:8000/openapi.json

---

## Project Structure

```
backend/
├── src/
│   ├── __init__.py
│   ├── api/
│   │   ├── __init__.py
│   │   ├── router_auth.py       # Authentication endpoints
│   │   ├── router_tasks.py      # Task CRUD endpoints
│   │   ├── router_ai.py         # AI suggestion endpoints
│   │   └── router_context.py    # User context endpoints
│   ├── services/
│   │   ├── __init__.py
│   │   ├── auth_service.py      # Authentication logic & JWT
│   │   └── langchain_service.py # LangChain/Gemini AI logic
│   └── repository/
│       ├── __init__.py
│       ├── database.py          # Database models & config
│       └── repositories.py      # Data access layer
├── db/
│   ├── schema.sql               # Database schema
│   └── productivity_tracker.db   # SQLite database (auto-created)
├── main.py                      # Application entry point
├── requirements.txt             # Python dependencies
├── .env.example                 # Environment template
└── README.md                    # This file
```

---

## API Endpoints

### Authentication (`/api/v1/auth`)

- **POST** `/auth/register` - Register a new user
- **POST** `/auth/login` - Login and get JWT token
- **GET** `/auth/me` - Get current user profile (requires token)
- **POST** `/auth/logout` - Logout (frontend clears token)

### Tasks (`/api/v1/tasks`)

- **POST** `/tasks` - Create a new task
- **GET** `/tasks` - Get all tasks for user (with optional filter)
- **GET** `/tasks/{task_id}` - Get a specific task
- **PUT** `/tasks/{task_id}` - Update a task
- **DELETE** `/tasks/{task_id}` - Delete a task
- **GET** `/tasks/stats/overview` - Get task statistics

### AI Suggestions (`/api/v1/ai`)

- **POST** `/ai/suggest` - Generate AI task suggestions
- **GET** `/ai/health` - Check AI service status
- **POST** `/ai/suggest-and-create` - Generate and auto-create tasks
- **GET** `/ai/examples` - Get example queries

### User Context (`/api/v1/context`)

- **GET** `/context` - Get user's goals and notes
- **PUT** `/context` - Update user's goals and notes
- **DELETE** `/context` - Clear user context
- **GET** `/context/profile` - Get full profile with context
- **POST** `/context/validate` - Validate context before saving
- **GET** `/context/guidelines/best-practices` - Get context guidelines

---

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

### Token Flow

1. User registers with email/password
2. System hashes password with bcrypt
3. User logs in with credentials
4. Backend generates JWT token
5. Token is returned and stored on frontend
6. Token is sent with each request
7. Backend validates token before processing

### Token Details

- **Expiration**: 30 minutes (configurable in .env)
- **Algorithm**: HS256
- **Contains**: User ID (sub claim)

---

## Environment Variables

| Variable                      | Required | Default     | Description             |
| ----------------------------- | -------- | ----------- | ----------------------- |
| `ENVIRONMENT`                 | No       | development | App environment         |
| `API_HOST`                    | No       | 127.0.0.1   | API host                |
| `API_PORT`                    | No       | 8000        | API port                |
| `DATABASE_URL`                | No       | SQLite      | Database connection URL |
| `SECRET_KEY`                  | **Yes**  | None        | JWT secret key          |
| `GOOGLE_API_KEY`              | **Yes**  | None        | Google Gemini API key   |
| `ALGORITHM`                   | No       | HS256       | JWT algorithm           |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | No       | 30          | Token expiration        |

---

## Getting Google Gemini API Key

1. Visit https://ai.google.dev/gemini-api/docs/api-key
2. Click "Get API Key"
3. Create new API key in Google Cloud Console
4. Copy the key to `.env` file as `GOOGLE_API_KEY`

**Free Tier Limits**: 15 requests per minute, 60 requests per day

---

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    hashed_password TEXT NOT NULL,
    goals TEXT,
    notes TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Tasks Table

```sql
CREATE TABLE tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    is_completed BOOLEAN NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

---

## Development Commands

### Run Tests

```bash
pytest

# Run with verbose output
pytest -v

# Run specific test file
pytest tests/test_auth.py

# Run with coverage
pytest --cov=src
```

### Database Operations

```bash
# Initialize database
python -c "from src.repository.database import init_db; init_db()"

# Reset database (drops all tables)
python -c "from src.repository.database import reset_db; reset_db()"
```

### Generate Secret Key

```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## AI Integration

### LangChain Service

The `LangChainService` handles all AI logic:

1. **Retrieve Context**: Fetches user's goals and notes from database
2. **Construct Prompt**: Creates dynamic prompt with user context
3. **Call Gemini API**: Sends prompt to Google's Gemini model
4. **Parse Response**: Extracts structured task suggestions
5. **Return Results**: Sends suggestions back to frontend

### Prompt Structure

```
User's Goals: [user-provided goals]
User's Notes: [user-provided notes]
User's Query: [natural language question]

Generate 3-5 specific, actionable task suggestions
```

### Error Handling

- API key validation on startup
- Graceful fallback if Gemini API unavailable
- Detailed error messages for debugging
- Request timeout (30 seconds)

---

## Logging

All operations are logged for debugging and monitoring:

```python
import logging

logger = logging.getLogger(__name__)
logger.info("User registered successfully")
logger.error("Error creating task")
```

View logs in console during development. For production, configure proper logging infrastructure.

---

## Common Issues & Solutions

### Issue: "GOOGLE_API_KEY not set"

**Solution**: Add `GOOGLE_API_KEY` to `.env` file with valid Gemini API key

### Issue: "Port 8000 already in use"

**Solution**:

```bash
# macOS/Linux
lsof -i :8000
kill -9 <PID>

# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Issue: Database locked error

**Solution**: SQLite can have concurrency issues. For production, migrate to PostgreSQL.

### Issue: JWT token validation fails

**Solution**: Ensure token format is correct: `Authorization: Bearer <token>`

### Issue: AI suggestions not generating

**Solution**:

1. Verify Google API key is valid and has quota
2. Check user has set goals/notes
3. Ensure query is not empty

---

## Performance Optimization

### Database

- Connection pooling via SQLAlchemy
- Indexes on user_id and created_at for queries
- Use `.first()` instead of `.all()` when possible

### API

- Request timeout: 30 seconds
- AI response timeout: 30 seconds (configurable)
- Connection keep-alive enabled

### Caching

Consider implementing Redis for:

- Token validation caching
- AI response caching
- User context caching

---

## Security Considerations

- ✅ Passwords hashed with bcrypt
- ✅ JWT for stateless authentication
- ✅ CORS configured for frontend
- ✅ Input validation with Pydantic
- ⚠️ SQLite single-writer limitation (production: use PostgreSQL)
- ⚠️ API key exposed in environment (production: use secret management)

---

## Production Deployment

Before deploying to production:

1. **Security**

   - Generate strong SECRET_KEY
   - Use PostgreSQL instead of SQLite
   - Enable HTTPS
   - Use environment-specific secrets

2. **Performance**

   - Configure connection pooling
   - Add database indexes
   - Enable caching layer
   - Use production ASGI server (Gunicorn)

3. **Monitoring**

   - Setup centralized logging
   - Add error tracking (Sentry)
   - Monitor API performance
   - Setup health checks

4. **Deployment**
   ```bash
   # Production server (example with Gunicorn)
   gunicorn main:app --workers 4 --worker-class uvicorn.workers.UvicornWorker
   ```

---

## Support & Documentation

- **FastAPI Docs**: https://fastapi.tiangolo.com
- **LangChain Docs**: https://python.langchain.com
- **Google Gemini**: https://ai.google.dev
- **SQLAlchemy**: https://docs.sqlalchemy.org

---

## License

This project is part of a portfolio demonstration.
