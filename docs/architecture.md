# TaskFlow Architecture

## System Overview

TaskFlow is a monolithic full-stack application with a clear separation between frontend and backend. The architecture follows modern web application patterns with emphasis on scalability and maintainability.

## High-Level Architecture Diagram

```
┌─────────────────────────────────────────┐
│         Client Layer (Browser)          │
│  ┌──────────────────────────────────┐   │
│  │  React Components                │   │
│  │  - Kanban Board                  │   │
│  │  - Task Management               │   │
│  │  - Project Management            │   │
│  └──────────────────────────────────┘   │
│           ↓ (HTTP/WebSocket)            │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      Frontend Application Layer         │
│  ┌──────────────────────────────────┐   │
│  │  State Management (Zustand)      │   │
│  │  Custom Hooks                    │   │
│  │  API Client (React Query)        │   │
│  └──────────────────────────────────┘   │
│           ↓ (REST/WebSocket API)        │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│       Backend API Layer (FastAPI)       │
│  ┌──────────────────────────────────┐   │
│  │  Route Handlers                  │   │
│  │  Request Validation (Pydantic)   │   │
│  │  Authentication Middleware       │   │
│  └──────────────────────────────────┘   │
│           ↓ (Data Access)               │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│   Business Logic & Service Layer        │
│  ┌──────────────────────────────────┐   │
│  │  Project Services                │   │
│  │  Task Services                   │   │
│  │  User Services                   │   │
│  │  Authorization Logic             │   │
│  └──────────────────────────────────┘   │
│           ↓ (ORM Queries)               │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│      Data Access Layer (SQLAlchemy)     │
│  ┌──────────────────────────────────┐   │
│  │  Models & Relationships          │   │
│  │  Query Building                  │   │
│  └──────────────────────────────────┘   │
│           ↓ (SQL)                       │
└─────────────────────────────────────────┘
                  ↓
┌─────────────────────────────────────────┐
│       Database Layer (PostgreSQL)       │
│  ┌──────────────────────────────────┐   │
│  │  Tables                          │   │
│  │  Relationships                   │   │
│  │  Indexes                         │   │
│  │  Constraints                     │   │
│  └──────────────────────────────────┘   │
└─────────────────────────────────────────┘
```

## Frontend Architecture

### Technology Stack
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query
- **HTTP Client**: Axios

### Directory Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/
│   │   ├── common/      # Reusable components (Button, Modal, etc.)
│   │   ├── layout/      # Layout wrapper components
│   │   ├── kanban/      # Kanban board specific components
│   │   └── task/        # Task-related components
│   ├── pages/           # Full page components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API client and business logic
│   ├── store/           # Zustand stores
│   ├── types/           # TypeScript interfaces and types
│   ├── styles/          # Global styles
│   ├── utils/           # Utility functions
│   ├── App.tsx
│   └── main.tsx
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Component Hierarchy

```
App
├── Layout
│   ├── Header
│   ├── Sidebar
│   └── MainContent
│       ├── KanbanBoard
│       │   ├── KanbanColumn
│       │   │   └── TaskCard (multiple)
│       │   │       ├── TaskTitle
│       │   │       ├── TaskDescription
│       │   │       └── TaskActions
│       │   └── AddColumnButton
│       └── TaskDetailModal
│           ├── TaskForm
│           ├── CommentSection
│           └── ActionButtons
└── Footer
```

### State Management

**Zustand Stores:**
- `userStore` - Authentication and user data
- `projectStore` - Current project and projects list
- `taskStore` - Tasks, filters, and sorting
- `uiStore` - UI state (modals, toasts, etc.)

### API Client Architecture

```typescript
// services/api.ts
├── Instance creation
├── Request/Response interceptors
├── Error handling
└── Base configuration

// services/api/
├── auth.ts       - Authentication endpoints
├── projects.ts   - Project endpoints
├── tasks.ts      - Task endpoints
└── users.ts      - User endpoints
```

## Backend Architecture

### Technology Stack
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT + OAuth2
- **Validation**: Pydantic
- **Task Queue**: Celery (optional)

### Directory Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── endpoints/       # Route handlers
│   │   │   ├── projects.py
│   │   │   ├── tasks.py
│   │   │   ├── users.py
│   │   │   └── auth.py
│   │   └── dependencies.py  # Dependency injection
│   ├── core/
│   │   ├── config.py        # Environment configuration
│   │   ├── security.py      # Auth and security utils
│   │   └── constants.py     # Application constants
│   ├── models/              # SQLAlchemy models
│   │   ├── project.py
│   │   ├── task.py
│   │   └── user.py
│   ├── schemas/             # Pydantic schemas
│   │   ├── project.py
│   │   ├── task.py
│   │   └── user.py
│   ├── services/            # Business logic
│   │   ├── project_service.py
│   │   ├── task_service.py
│   │   └── user_service.py
│   ├── database.py          # Database configuration
│   └── main.py              # Application entry point
├── tests/                   # Test suite
├── requirements.txt
└── .env.example
```

### Request Flow

```
HTTP Request
    ↓
FastAPI Router
    ↓
Endpoint Handler
    ├── Validate Request (Pydantic)
    ├── Check Authentication (JWT)
    ├── Check Authorization
    └── Call Service Layer
        ├── Business Logic
        ├── Database Query (SQLAlchemy)
        └── Return Data
    ↓
Response (Pydantic Model)
    ↓
HTTP Response (JSON)
```

### Authentication Flow

```
1. User submits credentials
    ↓
2. Backend validates credentials
    ↓
3. Generate JWT token
    ↓
4. Return token to client
    ↓
5. Client stores token (localStorage/sessionStorage)
    ↓
6. Client includes token in Authorization header
    ↓
7. Backend validates token on each request
    ↓
8. Decode token and get user info
```

## Database Schema

### Core Tables

**Users Table**
```
- id (PK)
- email (UNIQUE)
- username
- password_hash
- created_at
- updated_at
```

**Projects Table**
```
- id (PK)
- name
- description
- owner_id (FK → Users)
- created_at
- updated_at
```

**Tasks Table**
```
- id (PK)
- title
- description
- project_id (FK → Projects)
- assignee_id (FK → Users, nullable)
- status (enum: todo, in_progress, done)
- priority (enum: low, medium, high)
- created_at
- updated_at
```

**Project Members Table**
```
- id (PK)
- project_id (FK → Projects)
- user_id (FK → Users)
- role (enum: admin, member, viewer)
- joined_at
```

**Relationships:**
- Users → Projects (one-to-many)
- Users → Tasks (one-to-many, as assignee)
- Projects → Tasks (one-to-many)
- Projects → Users (many-to-many through ProjectMembers)

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `POST /api/auth/refresh` - Refresh token

### Projects
- `GET /api/projects` - List user's projects
- `POST /api/projects` - Create new project
- `GET /api/projects/{id}` - Get project details
- `PUT /api/projects/{id}` - Update project
- `DELETE /api/projects/{id}` - Delete project

### Tasks
- `GET /api/projects/{id}/tasks` - List project tasks
- `POST /api/projects/{id}/tasks` - Create task
- `GET /api/tasks/{id}` - Get task details
- `PUT /api/tasks/{id}` - Update task
- `DELETE /api/tasks/{id}` - Delete task

### Users
- `GET /api/users/me` - Get current user
- `PUT /api/users/me` - Update profile
- `GET /api/projects/{id}/members` - List project members

## Security Considerations

1. **Authentication**: JWT tokens for API authentication
2. **Authorization**: Role-based access control (RBAC)
3. **Data Validation**: Pydantic schemas for input validation
4. **CORS**: Configured for cross-origin requests
5. **Password Security**: Bcrypt hashing for passwords
6. **Environment Variables**: Sensitive data in .env files
7. **SQL Injection Prevention**: SQLAlchemy ORM usage

## Performance Optimizations

1. **Database Indexing**: Indexes on frequently queried fields
2. **Caching**: React Query for client-side caching
3. **Pagination**: Large data sets are paginated
4. **Query Optimization**: Select only needed fields
5. **Asset Bundling**: Vite for optimized builds
6. **Lazy Loading**: Components and routes loaded on demand

## Scalability Considerations

1. **Microservices Ready**: Backend can be split into services
2. **Database Connection Pooling**: For handling concurrent connections
3. **Load Balancing**: Multiple backend instances can be deployed
4. **CDN**: Frontend assets can be served from CDN
5. **WebSocket**: Support for real-time features
6. **Message Queue**: Celery integration for async tasks

## Testing Strategy

### Frontend
- Unit tests for components
- Integration tests for features
- E2E tests for critical workflows
- Visual regression tests

### Backend
- Unit tests for services
- Integration tests for APIs
- Database tests with transactions
- Performance tests

## Deployment Architecture

```
┌─────────────────────────────────────┐
│      Load Balancer / CDN            │
└────────────────┬────────────────────┘
                 │
    ┌────────────┼────────────┐
    ↓            ↓            ↓
┌────────┐  ┌────────┐  ┌────────┐
│Frontend│  │Backend │  │Backend │
│ (S3)   │  │ (App)  │  │ (App)  │
└────────┘  └────────┘  └────────┘
                 │
        ┌────────┴────────┐
        ↓                 ↓
    ┌──────────┐    ┌──────────┐
    │ Database │    │ Cache    │
    │ Primary  │    │ (Redis)  │
    └──────────┘    └──────────┘
        ↓
    ┌──────────┐
    │ Database │
    │ Replica  │
    └──────────┘
```

---

For more details, see:
- [Development Guide](development.md)
- [API Reference](api.md)
- [Deployment Guide](deployment.md)
