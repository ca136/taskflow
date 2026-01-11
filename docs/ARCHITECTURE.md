# TaskFlow Architecture

This document describes the overall architecture and design patterns used in TaskFlow.

## High-Level Architecture

TaskFlow follows a modern, full-stack monorepo architecture with clear separation between frontend and backend.

```
┌─────────────────────────────────────────────────────────┐
│                    Client (Browser)                      │
│            React 18 + TypeScript + Vite                 │
└──────────────────────────┬──────────────────────────────┘
                           │ HTTP/REST API
                           │ (JSON)
┌──────────────────────────▼──────────────────────────────┐
│              FastAPI Server (Port 8000)                  │
│         Python 3.11 + SQLAlchemy + Pydantic            │
└──────────────────────────┬──────────────────────────────┘
                           │ SQL
                           │
┌──────────────────────────▼──────────────────────────────┐
│          PostgreSQL Database                             │
└──────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Folder Structure

```
frontend/src/
├── components/          # Reusable UI components
│   ├── common/         # Shared components (Button, Modal, etc.)
│   ├── layout/         # Layout components (Header, Sidebar, etc.)
│   ├── board/          # Board-specific components
│   └── task/           # Task-specific components
├── pages/              # Page-level components (routes)
│   ├── Dashboard.tsx
│   ├── Projects.tsx
│   ├── Project.tsx
│   └── NotFound.tsx
├── hooks/              # Custom React hooks
│   ├── useAuth.ts
│   ├── useTasks.ts
│   └── useProjects.ts
├── utils/              # Utility functions
│   ├── api.ts
│   ├── format.ts
│   └── validation.ts
├── api/                # API client
│   ├── client.ts       # Axios/Fetch wrapper
│   ├── endpoints.ts    # API endpoint definitions
│   └── types.ts        # API response types
├── types/              # TypeScript types
│   ├── index.ts
│   ├── models.ts       # Domain models
│   └── api.ts          # API-related types
├── store/              # Zustand state management
│   ├── auth.store.ts
│   ├── project.store.ts
│   └── task.store.ts
├── assets/             # Static assets
│   ├── icons/
│   └── images/
├── App.tsx             # Root component
└── main.tsx            # Entry point
```

### Key Technologies

- **React Query** (TanStack Query): Server state management, caching, synchronization
- **Zustand**: Client state management (UI state, auth, preferences)
- **React Router v6**: Client-side routing
- **Tailwind CSS**: Styling
- **TypeScript**: Type safety

### State Management Strategy

**React Query (Server State):**
- API responses
- Data that comes from the backend
- Cache invalidation and synchronization

**Zustand (Client State):**
- Authentication status
- UI state (modals, sidebars)
- User preferences
- Temporary UI state

### Data Flow

```
User Interaction
    ↓
Component Event Handler
    ↓
Zustand Store Update (if local state) / React Query Mutation
    ↓
API Call (if needed)
    ↓
Backend Processing
    ↓
Database Operation
    ↓
Response to Frontend
    ↓
React Query Cache Update / Zustand Store Update
    ↓
Component Re-render
```

## Backend Architecture

### Folder Structure

```
backend/
├── app/
│   ├── main.py              # FastAPI app initialization
│   ├── __init__.py
│   ├── routes/              # API route handlers
│   │   ├── __init__.py
│   │   ├── users.py         # User endpoints
│   │   ├── projects.py      # Project endpoints
│   │   ├── tasks.py         # Task endpoints
│   │   └── boards.py        # Board endpoints
│   ├── models/              # SQLAlchemy ORM models
│   │   ├── __init__.py
│   │   ├── base.py          # Base model with timestamps
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── task.py
│   │   └── board.py
│   ├── schemas/             # Pydantic schemas (request/response)
│   │   ├── __init__.py
│   │   ├── user.py
│   │   ├── project.py
│   │   ├── task.py
│   │   └── board.py
│   ├── core/                # Core configurations
│   │   ├── __init__.py
│   │   ├── config.py        # Settings and environment config
│   │   ├── security.py      # JWT, password hashing, etc.
│   │   ├── dependencies.py  # FastAPI dependencies
│   │   └── errors.py        # Custom exceptions
│   └── services/            # Business logic
│       ├── __init__.py
│       ├── user_service.py
│       ├── project_service.py
│       ├── task_service.py
│       └── board_service.py
├── tests/                   # Test suite
│   ├── __init__.py
│   ├── conftest.py          # Pytest fixtures
│   ├── test_users.py
│   ├── test_projects.py
│   └── test_tasks.py
├── scripts/                 # Database scripts
│   ├── init_db.py           # Database initialization
│   └── seed.py              # Seed initial data
├── alembic/                 # Database migrations
├── requirements.txt         # Python dependencies
├── .env.example
└── pyproject.toml           # Project metadata
```

### Key Technologies

- **FastAPI**: Modern, fast web framework with async support
- **SQLAlchemy**: ORM for database operations
- **Pydantic**: Data validation and serialization
- **PostgreSQL**: Relational database
- **Alembic**: Database migrations

### Design Patterns

#### 1. Dependency Injection
```python
# FastAPI dependencies for reusable logic
def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    # Validate token and return user
    pass
```

#### 2. Service Layer
```python
# Separation of concerns
class ProjectService:
    def create_project(self, project_in: ProjectCreate, user_id: int) -> Project:
        # Business logic here
        pass
```

#### 3. Schema Validation
```python
# Request validation with Pydantic
class TaskCreate(BaseModel):
    title: str
    description: Optional[str] = None
    board_id: int
```

#### 4. Error Handling
```python
# Custom exceptions
class ProjectNotFoundError(Exception):
    pass

# Proper HTTP status codes
@router.get("/projects/{project_id}")
async def get_project(project_id: int):
    project = await project_service.get(project_id)
    if not project:
        raise HTTPException(status_code=404, detail="Project not found")
    return project
```

## Database Schema

### Core Tables

**users**
- id (Primary Key)
- email (Unique)
- password_hash
- full_name
- is_active
- created_at
- updated_at

**projects**
- id (Primary Key)
- owner_id (Foreign Key → users)
- name
- description
- created_at
- updated_at

**boards**
- id (Primary Key)
- project_id (Foreign Key → projects)
- name
- order (for sorting)
- created_at
- updated_at

**tasks**
- id (Primary Key)
- board_id (Foreign Key → boards)
- title
- description
- status (todo, in_progress, done)
- priority (low, medium, high)
- assignee_id (Foreign Key → users, nullable)
- created_at
- updated_at

**project_members**
- id (Primary Key)
- project_id (Foreign Key → projects)
- user_id (Foreign Key → users)
- role (owner, member, viewer)
- created_at

## API Design

### REST Endpoints

```
GET    /api/v1/projects              # List projects
POST   /api/v1/projects              # Create project
GET    /api/v1/projects/{id}         # Get project
PUT    /api/v1/projects/{id}         # Update project
DELETE /api/v1/projects/{id}         # Delete project

GET    /api/v1/projects/{id}/boards  # List boards in project
POST   /api/v1/projects/{id}/boards  # Create board

GET    /api/v1/boards/{id}/tasks     # List tasks in board
POST   /api/v1/boards/{id}/tasks     # Create task
PUT    /api/v1/tasks/{id}            # Update task
DELETE /api/v1/tasks/{id}            # Delete task

POST   /api/v1/auth/login            # User login
POST   /api/v1/auth/register         # User registration
POST   /api/v1/auth/refresh          # Refresh token
```

### Response Format

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Q1 Planning",
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "Project created successfully"
}
```

## Authentication & Security

### JWT Authentication Flow

```
Client Login Request
    ↓
Backend Validates Credentials
    ↓
Generate Access Token + Refresh Token
    ↓
Send Tokens to Client
    ↓
Client Stores Tokens (localStorage/sessionStorage)
    ↓
Client Includes Access Token in API Requests
    ↓
Backend Validates Token on Each Request
```

### Security Best Practices

- JWT tokens for API authentication
- Password hashing with bcrypt
- CORS configuration
- Input validation with Pydantic
- SQL injection prevention via ORM
- Rate limiting (to be implemented)
- HTTPS in production

## Deployment Architecture

```
┌─────────────────────────────────┐
│   GitHub Repository             │
└────────┬────────────────────────┘
         │ Push/PR
┌────────▼────────────────────────┐
│   CI/CD Pipeline (GitHub Actions) │
│   - Tests                       │
│   - Linting                     │
│   - Building                    │
└────────┬────────────────────────┘
         │ Successful Build
┌────────▼────────────────────────┐
│   Container Registry             │
│   (Docker Hub / GitHub Packages) │
└────────┬────────────────────────┘
         │ Deploy
┌────────▼────────────────────────┐
│   Production Environment         │
│   - Web Server (Nginx)          │
│   - API Container               │
│   - Database (PostgreSQL)       │
│   - Cache (Redis, optional)     │
└─────────────────────────────────┘
```

## Performance Considerations

1. **Database Queries**: Use eager loading to prevent N+1 queries
2. **Caching**: React Query for frontend caching, Redis for backend (optional)
3. **Pagination**: Implement pagination for large datasets
4. **Indexes**: Database indexes on frequently queried columns
5. **Lazy Loading**: Load components and routes on demand in frontend
6. **Image Optimization**: Use appropriate formats and sizes

## Monitoring & Logging

- **Frontend**: Browser console logs, error tracking (Sentry, optional)
- **Backend**: Structured logging with context
- **Database**: Query performance monitoring
- **API**: Response time tracking

## Future Enhancements

- Real-time updates with WebSockets
- File/attachment storage (S3/Cloud Storage)
- Email notifications
- Advanced search and filtering
- Custom workflows
- Mobile app
- Team analytics and reporting

