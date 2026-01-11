# TaskFlow Backend

FastAPI + Python async web application for TaskFlow project management. A modern, RESTful API with comprehensive documentation, database migrations, and production-ready architecture.

## 🚀 Quick Start

### Installation

```bash
# Create and activate virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Apply database migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`

### Available Scripts

```bash
# Running the application
uvicorn app.main:app --reload                    # Development mode
uvicorn app.main:app --reload --port 8001       # Custom port

# Database operations
alembic revision --autogenerate -m "Description" # Create migration
alembic upgrade head                             # Apply migrations
alembic downgrade -1                             # Revert one migration
alembic history                                  # View migration history

# Testing
pytest                                           # Run all tests
pytest --cov=app                                 # With coverage
pytest -v                                        # Verbose output
pytest tests/api/test_projects.py                # Specific test file
pytest -k "test_create"                          # Run matching tests

# Code Quality
black .                                          # Format code
flake8 .                                         # Lint code
black --check .                                  # Check formatting
mypy app --ignore-missing-imports               # Type checking
bandit -r app                                    # Security audit
```

---

## 🏗️ Architecture

### Tech Stack

| Component | Technology | Version |
|-----------|-----------|---------|
| Framework | FastAPI | 0.115.0 |
| Language | Python | 3.11+ |
| ORM | SQLAlchemy | 2.0+ |
| Validation | Pydantic | 2.0+ |
| Database | PostgreSQL | 12+ |
| Migrations | Alembic | 1.13+ |
| Testing | Pytest | 8.0+ |
| Async Support | Uvicorn | 0.30+ |
| Code Quality | Black, Flake8, MyPy | Latest |

### Design Patterns

TaskFlow backend uses **proven architectural patterns**:

1. **Layered Architecture**
   ```
   Routes (HTTP) → Services (Business Logic) → Models (Data Access) → Database
   ```

2. **Dependency Injection**
   - FastAPI's `Depends()` for clean, testable dependencies
   - Session management
   - Current user resolution

3. **Service Layer**
   - Encapsulates business logic
   - Reusable across different routes
   - Easy to test in isolation

4. **Schema Validation**
   - Pydantic for request/response validation
   - Type safety throughout
   - Automatic OpenAPI documentation

### Async/Await Pattern

```python
# ✅ All endpoints are async
@router.get("/tasks/")
async def get_tasks(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
) -> list[TaskSchema]:
    return await TaskService.list_tasks(db, current_user.id)
```

---

## 📁 Directory Structure

```
app/
├── api/                                  # API layer
│   ├── endpoints/                        # Endpoint groupings
│   │   ├── __init__.py
│   │   ├── auth.py                       # /api/v1/auth/*
│   │   ├── projects.py                   # /api/v1/projects/*
│   │   ├── tasks.py                      # /api/v1/tasks/*
│   │   ├── users.py                      # /api/v1/users/*
│   │   └── boards.py                     # /api/v1/boards/*
│   ├── dependencies.py                   # Shared dependencies (DB, auth)
│   └── router.py                         # Route registration
│
├── core/                                 # Core application files
│   ├── __init__.py
│   ├── config.py                         # Settings/environment variables
│   ├── security.py                       # Authentication & JWT
│   ├── constants.py                      # Application constants
│   └── exceptions.py                     # Custom exceptions
│
├── models/                               # SQLAlchemy ORM models
│   ├── __init__.py
│   ├── base.py                           # Base model class
│   ├── user.py                           # User model
│   ├── project.py                        # Project model
│   ├── task.py                           # Task model
│   ├── board.py                          # Kanban board model
│   └── association.py                    # Association tables (M2M)
│
├── schemas/                              # Pydantic validation schemas
│   ├── __init__.py
│   ├── auth.py                           # Auth request/response schemas
│   ├── user.py                           # User schemas
│   ├── project.py                        # Project schemas
│   ├── task.py                           # Task schemas
│   └── base.py                           # Base schema class
│
├── services/                             # Business logic layer
│   ├── __init__.py
│   ├── base.py                           # Base service class
│   ├── auth_service.py                   # Authentication logic
│   ├── user_service.py                   # User operations
│   ├── project_service.py                # Project operations
│   ├── task_service.py                   # Task operations
│   └── board_service.py                  # Board operations
│
├── db/                                   # Database utilities
│   ├── __init__.py
│   ├── base.py                           # Base database models
│   └── session.py                        # Session management
│
├── migrations/                           # Alembic migrations (auto-generated)
│   ├── env.py
│   ├── script.py.mako
│   └── versions/
│       └── [migration files]
│
├── tests/                                # Test suite
│   ├── conftest.py                       # Pytest fixtures
│   ├── test_main.py                      # Main app tests
│   ├── api/                              # Endpoint tests
│   │   ├── test_auth.py
│   │   ├── test_projects.py
│   │   ├── test_tasks.py
│   │   └── test_users.py
│   └── services/                         # Service layer tests
│       ├── test_auth_service.py
│       ├── test_project_service.py
│       └── test_task_service.py
│
├── database.py                           # Database configuration
├── main.py                               # FastAPI application entry point
├── __init__.py
│
├── requirements.txt                      # Python dependencies
├── pyproject.toml                        # Project metadata
├── pytest.ini                            # Pytest configuration
├── .env.example                          # Environment variables template
└── alembic.ini                           # Alembic configuration
```

---

## 🧠 Development Guide

### Creating a New Endpoint

**1. Define the Pydantic schema** (`schemas/myresource.py`):

```python
from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class MyResourceBase(BaseModel):
    name: str
    description: Optional[str] = None

class MyResourceCreate(MyResourceBase):
    pass

class MyResourceUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None

class MyResourceSchema(MyResourceBase):
    id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True
```

**2. Create the SQLAlchemy model** (`models/myresource.py`):

```python
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class MyResource(Base):
    __tablename__ = "my_resources"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(String, nullable=True)
    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    owner = relationship("User", back_populates="my_resources")
```

**3. Create the service layer** (`services/myresource_service.py`):

```python
from sqlalchemy.orm import Session
from app.models import MyResource, User
from app.schemas import MyResourceCreate, MyResourceUpdate

class MyResourceService:
    @staticmethod
    async def create(db: Session, obj_in: MyResourceCreate, owner_id: int) -> MyResource:
        db_obj = MyResource(**obj_in.dict(), owner_id=owner_id)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    @staticmethod
    async def get(db: Session, id: int) -> MyResource:
        return db.query(MyResource).filter(MyResource.id == id).first()
    
    @staticmethod
    async def list(db: Session, owner_id: int, skip: int = 0, limit: int = 10):
        return db.query(MyResource).filter(
            MyResource.owner_id == owner_id
        ).offset(skip).limit(limit).all()
    
    @staticmethod
    async def update(db: Session, id: int, obj_in: MyResourceUpdate) -> MyResource:
        db_obj = db.query(MyResource).filter(MyResource.id == id).first()
        if not db_obj:
            return None
        update_data = obj_in.dict(exclude_unset=True)
        for field, value in update_data.items():
            setattr(db_obj, field, value)
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
    
    @staticmethod
    async def delete(db: Session, id: int) -> bool:
        db_obj = db.query(MyResource).filter(MyResource.id == id).first()
        if db_obj:
            db.delete(db_obj)
            db.commit()
            return True
        return False
```

**4. Create the API endpoint** (`api/endpoints/myresource.py`):

```python
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.dependencies import get_db, get_current_user
from app.models import User
from app.schemas import MyResourceCreate, MyResourceUpdate, MyResourceSchema
from app.services import MyResourceService

router = APIRouter(prefix="/api/v1/my-resources", tags=["My Resources"])

@router.get("/", response_model=list[MyResourceSchema])
async def list_resources(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """List all resources for the current user."""
    return await MyResourceService.list(db, current_user.id, skip, limit)

@router.post("/", response_model=MyResourceSchema, status_code=status.HTTP_201_CREATED)
async def create_resource(
    resource_in: MyResourceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create a new resource."""
    return await MyResourceService.create(db, resource_in, current_user.id)

@router.get("/{id}", response_model=MyResourceSchema)
async def get_resource(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Get a specific resource."""
    resource = await MyResourceService.get(db, id)
    if not resource or resource.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Resource not found")
    return resource

@router.put("/{id}", response_model=MyResourceSchema)
async def update_resource(
    id: int,
    resource_in: MyResourceUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Update a resource."""
    resource = await MyResourceService.get(db, id)
    if not resource or resource.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Resource not found")
    return await MyResourceService.update(db, id, resource_in)

@router.delete("/{id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_resource(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Delete a resource."""
    resource = await MyResourceService.get(db, id)
    if not resource or resource.owner_id != current_user.id:
        raise HTTPException(status_code=404, detail="Resource not found")
    await MyResourceService.delete(db, id)
    return None
```

**5. Register the router** (`api/router.py`):

```python
from fastapi import APIRouter
from app.api.endpoints import myresource

api_router = APIRouter()
api_router.include_router(myresource.router)
```

---

## 🔐 Authentication & Security

### JWT Authentication Flow

```python
# core/security.py
from jose import JWTError, jwt
from datetime import datetime, timedelta
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
SECRET_KEY = "your-secret-key"
ALGORITHM = "HS256"

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)
```

### Using Authentication in Endpoints

```python
@router.get("/protected")
async def protected_route(
    current_user: User = Depends(get_current_user)
):
    return {"user": current_user.email}
```

---

## 🗄️ Database Management

### Creating Migrations

```bash
# Create new migration with auto-detection
alembic revision --autogenerate -m "Add user avatar column"

# Manual migration (if auto-detect doesn't work)
alembic revision -m "Add user avatar"
```

### Applying Migrations

```bash
# Apply all pending migrations
alembic upgrade head

# Apply specific migration
alembic upgrade ae1027a6acf

# Revert one migration
alembic downgrade -1

# Revert to specific migration
alembic downgrade ae1027a6acf
```

### Migration File Example

```python
# migrations/versions/001_initial.py
from alembic import op
import sqlalchemy as sa

def upgrade():
    op.create_table(
        'users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('email', sa.String(255), nullable=False),
        sa.Column('password_hash', sa.String(255), nullable=False),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('email')
    )

def downgrade():
    op.drop_table('users')
```

---

## 🧪 Testing

### Test Structure

```python
# tests/api/test_projects.py
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.fixture
def auth_headers(db_user):
    """Fixture providing auth headers."""
    response = client.post(
        "/api/v1/auth/login",
        json={"email": db_user.email, "password": "password123"}
    )
    return {"Authorization": f"Bearer {response.json()['access_token']}"}

def test_list_projects(auth_headers):
    """Test listing projects."""
    response = client.get("/api/v1/projects/", headers=auth_headers)
    assert response.status_code == 200
    assert isinstance(response.json(), list)

def test_create_project(auth_headers):
    """Test creating a project."""
    response = client.post(
        "/api/v1/projects/",
        headers=auth_headers,
        json={
            "name": "Test Project",
            "description": "A test project"
        }
    )
    assert response.status_code == 201
    assert response.json()["name"] == "Test Project"
```

### Running Tests with Coverage

```bash
# Run all tests with coverage
pytest --cov=app --cov-report=html

# View coverage report
open htmlcov/index.html
```

---

## 🔌 Environment Variables

Create `.env` (not committed to git):

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/taskflow_db
# or for development
DATABASE_URL=sqlite:///./taskflow.db

# Security
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Environment
ENVIRONMENT=development
DEBUG=True

# Email (optional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password

# Redis (optional)
REDIS_URL=redis://localhost:6379
```

---

## 📊 API Documentation

### Built-in Documentation

Once the server is running, access:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

### Response Format Standards

**Success Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "My Project"
  },
  "message": "Project retrieved successfully"
}
```

**Error Response:**
```json
{
  "detail": "Project not found",
  "status_code": 404,
  "error_type": "NOT_FOUND"
}
```

---

## 🚀 Deployment

### Building for Production

1. **Set environment variables**
   ```bash
   export ENVIRONMENT=production
   export DEBUG=False
   export SECRET_KEY=your-production-key
   ```

2. **Use production ASGI server**
   ```bash
   pip install gunicorn
   gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
   ```

3. **Nginx reverse proxy**
   ```nginx
   server {
     listen 80;
     server_name api.taskflow.dev;
     
     location / {
       proxy_pass http://localhost:8000;
       proxy_set_header Host $host;
       proxy_set_header X-Real-IP $remote_addr;
     }
   }
   ```

### Docker Deployment

```bash
docker build -t taskflow-backend .
docker run -p 8000:8000 --env-file .env taskflow-backend
```

---

## 🐛 Debugging

### Logging

```python
import logging

logger = logging.getLogger(__name__)

@router.get("/tasks/")
async def get_tasks(db: Session = Depends(get_db)):
    logger.info("Fetching tasks")
    try:
        tasks = db.query(Task).all()
        logger.info(f"Retrieved {len(tasks)} tasks")
        return tasks
    except Exception as e:
        logger.error(f"Error fetching tasks: {e}")
        raise
```

### Database Query Debugging

```python
# Enable SQL logging
import logging
logging.basicConfig()
logging.getLogger('sqlalchemy.engine').setLevel(logging.INFO)
```

---

## 📚 Resources

- **FastAPI Docs**: https://fastapi.tiangolo.com
- **SQLAlchemy**: https://www.sqlalchemy.org
- **Pydantic**: https://docs.pydantic.dev
- **Alembic**: https://alembic.sqlalchemy.org
- **Pytest**: https://docs.pytest.org

---

## 🔗 Related Documentation

- [Frontend README](../frontend/README.md) - Frontend development guide
- [Architecture Guide](../docs/ARCHITECTURE.md) - System design
- [API Reference](../docs/API.md) - Complete API endpoints
- [Contributing Guide](../CONTRIBUTING.md) - Contribution guidelines

---

## 💡 Best Practices

1. **Always use type hints**
   ```python
   def get_user(id: int) -> Optional[User]:  # ✅ Good
   def get_user(id):  # ❌ Avoid
   ```

2. **Validate inputs with Pydantic**
   ```python
   class TaskCreate(BaseModel):
       title: str  # Required
       description: Optional[str] = None  # Optional
   ```

3. **Use dependency injection**
   ```python
   async def route(db: Session = Depends(get_db)):  # ✅ Good
   ```

4. **Handle errors gracefully**
   ```python
   raise HTTPException(status_code=404, detail="Not found")
   ```

5. **Keep services testable**
   - Separate business logic from HTTP logic
   - Make services reusable

---

**Happy coding! 🚀**
