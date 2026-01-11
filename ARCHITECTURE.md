# TaskFlow Architecture

This document describes the overall architecture, design patterns, and technical decisions for TaskFlow.

## Table of Contents

1. [Overview](#overview)
2. [System Architecture](#system-architecture)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Database Schema](#database-schema)
6. [API Design](#api-design)
7. [Security](#security)
8. [Deployment](#deployment)
9. [Design Patterns](#design-patterns)

## Overview

TaskFlow is a full-stack web application using:
- **Frontend**: React 18+ with TypeScript, Vite, and Tailwind CSS
- **Backend**: FastAPI with async Python
- **Database**: PostgreSQL
- **Infrastructure**: Docker & Docker Compose

### Technology Decisions

| Component | Technology | Rationale |
|-----------|-----------|-----------|
| Frontend Framework | React 18+ | Wide ecosystem, component-based, good for SPA |
| Language (Frontend) | TypeScript | Type safety, IDE support, fewer runtime errors |
| Build Tool | Vite | Fast dev server, optimal build output |
| Styling | Tailwind CSS | Rapid development, consistent design system |
| State Management | Zustand | Lightweight, simple API |
| Data Fetching | React Query | Automatic caching, sync, background updates |
| Backend Framework | FastAPI | Modern, fast, async-native, automatic docs |
| Language (Backend) | Python 3.9+ | Rich ecosystem, async support, readability |
| Database | PostgreSQL | Reliable, feature-rich, JSON support |
| ORM | SQLAlchemy | Flexible, powerful, async support |
| Validation | Pydantic | Runtime validation, auto-generated docs |
| Containerization | Docker | Consistency across environments |

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
├─────────────────────────────────────────────────────────────┤
│  React App (TypeScript)                                     │
│  ├── Pages                                                  │
│  ├── Components                                             │
│  ├── Hooks (custom, useQuery, useForm)                      │
│  └── Store (Zustand)                                        │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTP/REST
┌──────────────────────▼──────────────────────────────────────┐
│                      API Layer                               │
├─────────────────────────────────────────────────────────────┤
│  FastAPI Application                                        │
│  ├── Routes (/api/v1/...)                                   │
│  ├── Dependencies (auth, validation)                        │
│  ├── Schemas (Pydantic models)                              │
│  └── Security (JWT tokens)                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │ SQL
┌──────────────────────▼──────────────────────────────────────┐
│                   Business Logic                             │
├─────────────────────────────────────────────────────────────┤
│  Services                                                   │
│  ├── ProjectService                                         │
│  ├── TaskService                                            │
│  ├── UserService                                            │
│  └── AuthService                                            │
└──────────────────────┬──────────────────────────────────────┘
                       │ ORM (SQLAlchemy)
┌──────────────────────▼──────────────────────────────────────┐
│                   Data Access Layer                          │
├─────────────────────────────────────────────────────────────┤
│  Models (SQLAlchemy)                                        │
│  ├── User                                                   │
│  ├── Project                                                │
│  ├── Task                                                   │
│  └── Board                                                  │
└──────────────────────┬──────────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                      Database                                │
├─────────────────────────────────────────────────────────────┤
│  PostgreSQL                                                 │
└──────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Directory Structure

```
frontend/
├── public/               # Static assets
├── src/
│   ├── components/
│   │   ├── common/      # Reusable UI components
│   │   │   ├── Button.tsx
│   │   │   ├── Modal.tsx
│   │   │   └── Form.tsx
│   │   ├── layout/      # Layout wrappers
│   │   │   ├── Header.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── MainLayout.tsx
│   │   ├── forms/       # Domain-specific forms
│   │   │   ├── ProjectForm.tsx
│   │   │   └── TaskForm.tsx
│   │   └── kanban/      # Kanban board components
│   │       ├── Board.tsx
│   │       ├── Column.tsx
│   │       └── Card.tsx
│   ├── pages/           # Page components (route pages)
│   │   ├── Dashboard.tsx
│   │   ├── Projects.tsx
│   │   └── NotFound.tsx
│   ├── hooks/           # Custom React hooks
│   │   ├── useProjects.ts
│   │   ├── useTasks.ts
│   │   └── useAuth.ts
│   ├── store/           # Zustand state management
│   │   ├── authStore.ts
│   │   └── appStore.ts
│   ├── services/        # API client and utilities
│   │   ├── api.ts       # Axios/fetch client
│   │   └── endpoints.ts # API endpoint constants
│   ├── types/           # TypeScript interfaces
│   │   └── index.ts
│   ├── styles/          # Global styles
│   │   └── index.css
│   ├── App.tsx          # Root component
│   └── main.tsx         # Entry point
├── index.html
├── vite.config.ts
├── tsconfig.json
├── tailwind.config.js
└── package.json
```

### Component Architecture

Components follow a hierarchy:

```
App
├── MainLayout
│   ├── Header
│   ├── Sidebar
│   └── MainContent
│       ├── Dashboard
│       │   └── ProjectGrid
│       │       └── ProjectCard
│       └── Projects
│           └── Board
│               ├── Column
│               │   └── Card
│               └── Modal (TaskForm)
```

### State Management with Zustand

```typescript
// Simple, focused stores
authStore     // User auth state
appStore      // App-level state (notifications, UI)
projectStore  // Project list and current project
taskStore     // Tasks for current project

// Zustand advantages:
// - No providers needed (much simpler than Redux)
// - Smaller bundle size
// - Easy to test
// - Less boilerplate
```

### Data Flow

```
User Interaction
    ↓
Component Event Handler
    ↓
API Call (React Query useQuery/useMutation)
    ↓
Backend API
    ↓
Response
    ↓
Store Update (Zustand)
    ↓
Component Re-render
    ↓
UI Updated
```

## Backend Architecture

### Directory Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── endpoints/
│   │   │   ├── projects.py
│   │   │   ├── tasks.py
│   │   │   ├── users.py
│   │   │   └── auth.py
│   │   ├── dependencies.py    # Shared dependencies
│   │   └── router.py          # API router setup
│   ├── core/
│   │   ├── config.py          # Settings/environment
│   │   ├── security.py        # Auth logic
│   │   └── constants.py
│   ├── models/                # SQLAlchemy models
│   │   ├── user.py
│   │   ├── project.py
│   │   └── task.py
│   ├── schemas/               # Pydantic schemas
│   │   ├── user.py
│   │   ├── project.py
│   │   └── task.py
│   ├── services/              # Business logic
│   │   ├── auth_service.py
│   │   ├── project_service.py
│   │   └── task_service.py
│   ├── db/
│   │   ├── session.py         # Database session
│   │   └── base.py            # Base model
│   └── main.py                # FastAPI app
├── migrations/                # Alembic migrations
├── tests/
│   ├── api/
│   ├── services/
│   └── conftest.py
├── requirements.txt
├── alembic.ini
└── .env.example
```

### Dependency Injection

FastAPI's `Depends()` provides clean dependency injection:

```python
# In endpoints
@router.get("/projects")
async def get_projects(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Dependencies automatically injected and resolved
    ...
```

### Request/Response Flow

```
HTTP Request
    ↓
Route Handler (endpoint)
    ↓
Dependencies Resolved
    ├── get_current_user (auth check)
    ├── get_db (database session)
    └── validation (Pydantic schemas)
    ↓
Service Logic
    ├── Query/modify data
    ├── Business rules
    └── Return result
    ↓
Response Schema (Pydantic)
    ↓
JSON Response
```

### Authentication Flow

```
1. User logs in with email/password
   ↓
2. Backend verifies credentials
   ↓
3. Generate JWT token (with user ID, expiration)
   ↓
4. Return token to frontend
   ↓
5. Frontend stores token (localStorage/sessionStorage)
   ↓
6. All subsequent requests include token in header:
   Authorization: Bearer <token>
   ↓
7. Backend verifies token signature and expiration
   ↓
8. Extract user ID from token
   ↓
9. Load user from database
   ↓
10. Proceed with request
```

## Database Schema

### Core Tables

```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR UNIQUE NOT NULL,
    username VARCHAR UNIQUE NOT NULL,
    hashed_password VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT TRUE
);

-- Projects table
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    name VARCHAR NOT NULL,
    description TEXT,
    owner_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Tasks table
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    project_id INTEGER REFERENCES projects(id),
    status VARCHAR DEFAULT 'todo',  -- todo, in_progress, done
    priority VARCHAR DEFAULT 'medium',  -- low, medium, high
    assigned_to INTEGER REFERENCES users(id),
    created_by INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    due_date DATE
);

-- Boards (Kanban boards per project)
CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    project_id INTEGER REFERENCES projects(id),
    name VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```

### Relationships

```
User
  ├── owns Projects
  ├── creates Tasks
  └── assigned Tasks

Project
  ├── has Tasks
  ├── has Boards (kanban boards)
  └── owned by User

Task
  ├── belongs to Project
  ├── assigned to User
  └── created by User
```

## API Design

### RESTful Endpoints

```
# Projects
GET    /api/v1/projects              # List projects
POST   /api/v1/projects              # Create project
GET    /api/v1/projects/{id}         # Get project details
PUT    /api/v1/projects/{id}         # Update project
DELETE /api/v1/projects/{id}         # Delete project

# Tasks
GET    /api/v1/projects/{id}/tasks   # List tasks
POST   /api/v1/projects/{id}/tasks   # Create task
PUT    /api/v1/tasks/{id}            # Update task
DELETE /api/v1/tasks/{id}            # Delete task

# Authentication
POST   /api/v1/auth/login            # Login
POST   /api/v1/auth/register         # Register
POST   /api/v1/auth/refresh          # Refresh token

# Users
GET    /api/v1/users/me              # Current user
PUT    /api/v1/users/me              # Update profile
```

### Response Format

```json
// Success Response
{
    "status": "success",
    "data": { /* actual data */ },
    "meta": {
        "timestamp": "2024-01-01T00:00:00Z"
    }
}

// Error Response
{
    "status": "error",
    "error": {
        "code": "VALIDATION_ERROR",
        "message": "Invalid input",
        "details": [/* field errors */]
    }
}
```

## Security

### Authentication
- JWT (JSON Web Tokens) for stateless authentication
- Tokens include user ID and expiration time
- Secure secret key (environment variable)
- Token refresh mechanism for extended sessions

### Authorization
- Role-based access control (RBAC)
- Users can only access their own resources
- Project ownership verified before operations

### Data Protection
- CORS configured to allow only trusted origins
- HTTPS enforced in production
- Password hashing with bcrypt
- SQL injection prevention via SQLAlchemy ORM

### Best Practices
- Environment variables for secrets (never hardcoded)
- CSRF protection for state-changing operations
- Rate limiting for API endpoints
- Input validation with Pydantic
- Secure headers set by framework

## Deployment

### Container Strategy

```
docker-compose.yml
├── postgres      # PostgreSQL database
├── backend       # FastAPI application
├── frontend      # React SPA (served by nginx)
└── redis         # Cache (optional)
```

### Production Considerations

1. **Backend**
   - Use production ASGI server (Gunicorn + Uvicorn)
   - Configure for horizontal scaling
   - Environment-based configuration
   - Structured logging

2. **Frontend**
   - Static build deployed to CDN/web server
   - Environment-based API URL
   - Security headers
   - Caching strategy

3. **Database**
   - Automated backups
   - Read replicas for scaling
   - Connection pooling
   - Monitoring and alerts

4. **Infrastructure**
   - Load balancer (nginx, AWS ALB)
   - Reverse proxy
   - SSL/TLS certificates
   - Monitoring and observability

## Design Patterns

### 1. Service Layer Pattern
Business logic separated into services for reusability and testability.

```python
# Bad: Logic in route handler
@router.post("/tasks")
async def create_task(task_data: TaskCreate, db: Session = Depends()):
    # Validation, business logic mixed in
    task = Task(**task_data.dict())
    db.add(task)
    db.commit()
    return task

# Good: Logic in service
@router.post("/tasks")
async def create_task(
    task_data: TaskCreate,
    service: TaskService = Depends(get_task_service),
    current_user: User = Depends(get_current_user),
):
    return await service.create_task(task_data, current_user)
```

### 2. Repository Pattern
Abstract data access for easier testing and switching databases.

```python
class ProjectRepository:
    def get_by_id(self, project_id: int) -> Project:
        ...
    
    def get_by_owner(self, owner_id: int) -> List[Project]:
        ...
    
    def create(self, data: ProjectCreate) -> Project:
        ...
```

### 3. Dependency Injection
FastAPI's Depends() provides clean DI for services, repositories, and configuration.

### 4. React Hooks Pattern
Custom hooks encapsulate data fetching and state logic.

```typescript
// Encapsulates API call and state
const useProjects = () => {
    const { data, isLoading, error } = useQuery(['projects'], fetchProjects);
    return { projects: data, isLoading, error };
};

// Usage in components
const MyComponent = () => {
    const { projects, isLoading } = useProjects();
    // ...
};
```

## Scalability Considerations

### Frontend
- Code splitting and lazy loading
- Image optimization
- Caching strategies
- CDN for static assets

### Backend
- Database query optimization
- Caching layer (Redis)
- Async operations for I/O
- Connection pooling
- Horizontal scaling support

### Database
- Indexes on frequently queried columns
- Query optimization
- Partitioning for large tables
- Read replicas for scaling reads

## Performance Metrics

Monitor:
- API response times
- Database query performance
- Frontend bundle size
- Frontend Lighthouse scores
- Error rates and types
- User session metrics
