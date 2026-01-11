# TaskFlow System Architecture

Complete architectural overview of the TaskFlow project management system, including design principles, system layers, data models, API design, security, and deployment considerations.

## Table of Contents

1. [System Overview](#system-overview)
2. [Technology Stack](#technology-stack)
3. [Architectural Layers](#architectural-layers)
4. [Frontend Architecture](#frontend-architecture)
5. [Backend Architecture](#backend-architecture)
6. [Data Models & Database](#data-models--database)
7. [API Design](#api-design)
8. [Security Architecture](#security-architecture)
9. [Deployment Architecture](#deployment-architecture)
10. [Design Patterns](#design-patterns)
11. [Performance Considerations](#performance-considerations)

---

## System Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Layer                          │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  React SPA + TypeScript                             │   │
│  │  (Browser-based application with routing)           │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    HTTP/HTTPS & REST API
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                    Application Layer                        │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  FastAPI Server + Uvicorn                           │   │
│  │  (RESTful API, authentication, business logic)      │   │
│  └──────────────────────────────────────────────────────┘   │
└──────────────────────────┬──────────────────────────────────┘
                           │
                    SQLAlchemy ORM
                           │
┌──────────────────────────▼──────────────────────────────────┐
│                   Persistence Layer                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │  PostgreSQL Database                                │   │
│  │  (Relational data, ACID compliance)                 │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Key Characteristics

- **Monorepo**: Frontend and backend in single repository
- **Stateless Backend**: No session state on server (JWT-based auth)
- **RESTful API**: Standard HTTP methods and status codes
- **Type-Safe**: TypeScript frontend, Python type hints
- **Scalable**: Horizontal scaling via containerization

---

## Technology Stack

### Frontend Stack

| Layer | Technology | Purpose | Version |
|-------|-----------|---------|---------|
| **Runtime** | Node.js | JavaScript runtime | 18.0+ |
| **Framework** | React | UI framework | 18.3.1 |
| **Language** | TypeScript | Type-safe JavaScript | 5.6.3 |
| **Build** | Vite | Fast build tool & dev server | 5.4.2 |
| **Styling** | Tailwind CSS | Utility-first CSS | 3.4.3 |
| **State** | React Query | Server state | 5.50.1 |
| **State** | Zustand | Client state | 4.5.2 |
| **Routing** | React Router | Page routing | 6.x |
| **HTTP** | Axios | HTTP client | 1.x |
| **Forms** | React Hook Form | Form management | 7.x |
| **Testing** | Vitest | Test framework | Latest |

### Backend Stack

| Layer | Technology | Purpose | Version |
|-------|-----------|---------|---------|
| **Runtime** | Python | Programming language | 3.11+ |
| **Framework** | FastAPI | Web framework | 0.115.0 |
| **ASGI** | Uvicorn | ASGI server | 0.30+ |
| **ORM** | SQLAlchemy | Object-relational mapper | 2.0+ |
| **Validation** | Pydantic | Data validation | 2.0+ |
| **Database** | PostgreSQL | Relational database | 12+ |
| **Migrations** | Alembic | Database migrations | 1.13+ |
| **Auth** | PyJWT | JWT authentication | Latest |
| **Security** | Passlib + Bcrypt | Password hashing | Latest |
| **Testing** | Pytest | Test framework | 8.0+ |

### Infrastructure

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Containerization** | Docker | Container runtime |
| **Orchestration** | Docker Compose | Multi-container setup |
| **Reverse Proxy** | Nginx | Web server & load balancer |
| **Database** | PostgreSQL | Primary data store |
| **Caching** | Redis | Optional cache layer |

---

## Architectural Layers

### Clean Architecture Pattern

TaskFlow follows a **4-layer clean architecture**:

```
┌─────────────────────────────────────────────────┐
│           Presentation Layer                    │
│    (React Components, Routes, Store)            │
├─────────────────────────────────────────────────┤
│          Application Layer                      │
│   (API Endpoints, Dependency Injection)         │
├─────────────────────────────────────────────────┤
│          Domain Layer                           │
│   (Business Logic, Use Cases, Services)         │
├─────────────────────────────────────────────────┤
│          Data Layer                             │
│   (Models, Repository, Database)                │
└─────────────────────────────────────────────────┘
```

### Layer Responsibilities

**Presentation Layer:**
- User interface components
- Page routing
- Client-side state management
- Form handling and validation

**Application Layer:**
- HTTP endpoint definitions
- Request/response handling
- Dependency injection setup
- Error handling middleware

**Domain Layer:**
- Business logic and rules
- Use cases and services
- Domain models
- Validation rules

**Data Layer:**
- Database models (ORM)
- Repository/DAO pattern
- Query optimization
- Data persistence

---

## Frontend Architecture

### Frontend Structure

```
Frontend/
├── Pages
│   ├── DashboardPage
│   ├── ProjectPage
│   ├── BoardPage
│   └── LoginPage
│
├── Components
│   ├── Kanban Board
│   │   ├── Board (Container)
│   │   ├── Column
│   │   ├── Card
│   │   └── DragDropContext
│   │
│   ├── Forms
│   │   ├── LoginForm
│   │   ├── ProjectForm
│   │   └── TaskForm
│   │
│   ├── Layout
│   │   ├── Header (Navigation)
│   │   ├── Sidebar
│   │   └── MainLayout
│   │
│   └── Common
│       ├── Button
│       ├── Modal
│       ├── Loader
│       └── ErrorBoundary
│
├── State Management
│   ├── Zustand Stores
│   │   ├── authStore (user, token, login)
│   │   ├── projectStore (selected project)
│   │   ├── taskStore (filters, selected task)
│   │   └── uiStore (modals, sidebar)
│   │
│   └── React Query
│       ├── useProjects hook
│       ├── useTasks hook
│       ├── useUsers hook
│       └── useAuth hook
│
├── Services
│   ├── API Client (Axios)
│   ├── Auth Service
│   ├── Project Service
│   └── Task Service
│
└── Utilities
    ├── Formatters (date, text)
    ├── Validators
    ├── Error handlers
    └── Constants
```

### Data Flow (Frontend)

```
User Action (click, type, submit)
          ↓
Component Event Handler
          ↓
Zustand Store Update / Service Call
          ↓
React Query Mutation / API Request
          ↓
HTTP Request to Backend
          ↓
Response received
          ↓
Cache Update / Store Update
          ↓
Component State Update (via hooks)
          ↓
Component Re-render
          ↓
Updated UI
```

### State Management Strategy

**React Query (Server State):**
- API responses and cached data
- Automatic refetching and invalidation
- Background synchronization
- Loading and error states

**Zustand (Client State):**
- Authentication (user, token, roles)
- UI state (modals, sidebar, theme)
- Filters and preferences
- Form data

**Local Component State:**
- Input field values
- Hover states
- Internal component logic

---

## Backend Architecture

### Backend Structure

```
Backend/
├── API Layer
│   ├── Endpoints (Routes)
│   │   ├── auth.py → /auth/*
│   │   ├── projects.py → /projects/*
│   │   ├── tasks.py → /tasks/*
│   │   ├── users.py → /users/*
│   │   └── boards.py → /boards/*
│   │
│   ├── Dependencies
│   │   ├── get_db (database session)
│   │   ├── get_current_user (auth)
│   │   └── Custom dependencies
│   │
│   └── Middleware
│       ├── CORS
│       ├── Error handling
│       └── Logging
│
├── Service Layer
│   ├── AuthService (login, register, token refresh)
│   ├── UserService (create, update, delete)
│   ├── ProjectService (CRUD operations)
│   ├── TaskService (CRUD operations)
│   └── BoardService (CRUD operations)
│
├── Domain Layer
│   ├── Models (SQLAlchemy ORM)
│   │   ├── User
│   │   ├── Project
│   │   ├── Task
│   │   ├── Board
│   │   └── Associations
│   │
│   └── Schemas (Pydantic validation)
│       ├── Request schemas
│       └── Response schemas
│
├── Infrastructure
│   ├── Database setup
│   ├── Session management
│   ├── Configuration
│   └── Security utilities
│
└── Tests
    ├── Unit tests (services)
    ├── Integration tests (API)
    └── Fixtures
```

### Request Processing Flow

```
HTTP Request received
          ↓
Route matching
          ↓
Dependency Injection
  • Get database session
  • Verify authentication
  • Extract current user
          ↓
Request validation (Pydantic)
          ↓
Business logic in Service
  • Load data from database
  • Apply business rules
  • Modify/create records
          ↓
Response serialization (Schema)
          ↓
HTTP Response with status code
```

---

## Data Models & Database

### Core Tables

#### Users Table
```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

**Relationships:**
- ← Projects (one user owns many projects)
- ← Tasks (one user assigned to many tasks)

#### Projects Table
```sql
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_projects_owner ON projects(owner_id);
```

**Relationships:**
- → User (many projects belong to one owner)
- ← Tasks (one project has many tasks)
- ← Boards (one project has many boards)

#### Boards Table
```sql
CREATE TABLE boards (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_boards_project ON boards(project_id);
```

**Relationships:**
- → Project (many boards belong to one project)
- ← Tasks (one board has many tasks)

#### Tasks Table
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    board_id INTEGER NOT NULL REFERENCES boards(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo',
    priority VARCHAR(50) DEFAULT 'medium',
    assigned_to INTEGER REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_tasks_board ON tasks(board_id);
CREATE INDEX idx_tasks_assigned ON tasks(assigned_to);
```

**Relationships:**
- → Board (many tasks belong to one board)
- → User (assigned_to user, can be NULL)

### Entity Relationship Diagram

```
┌────────────┐
│   Users    │
├────────────┤
│ id (PK)    │◄─────┐
│ email      │      │ owns
│ password   │      │ (1:N)
└────────────┘      │
       │             │
       │ assigned_to │
       │ (N:M)       │
       ▼             │
┌────────────┐       │
│   Tasks    │       │
├────────────┤       │
│ id (PK)    │       │
│ title      │       │
│ status     │       │
│ assigned_to│───────┘
│ board_id───┐
└────────────┘│
              │
              │ (N:1)
              ▼
        ┌────────────┐
        │  Boards    │
        ├────────────┤
        │ id (PK)    │
        │ name       │
        │ project_id─┐
        └────────────┘│
                      │
                      │ (N:1)
                      ▼
              ┌────────────────┐
              │  Projects      │
              ├────────────────┤
              │ id (PK)        │
              │ name           │
              │ owner_id───────┼──► (User that created/owns)
              └────────────────┘
```

### Database Constraints & Indexes

**Primary Keys:**
- All tables have `id` as primary key with auto-increment

**Foreign Keys:**
- Projects.owner_id → Users.id (CASCADE on delete)
- Boards.project_id → Projects.id (CASCADE on delete)
- Tasks.board_id → Boards.id (CASCADE on delete)
- Tasks.assigned_to → Users.id (SET NULL on delete)

**Unique Constraints:**
- Users.email (unique email per user)

**Indexes:**
- Projects(owner_id) - for faster user's project lookup
- Boards(project_id) - for faster project's boards lookup
- Tasks(board_id) - for faster board's tasks lookup
- Tasks(assigned_to) - for faster user's assignments lookup

---

## API Design

### RESTful Principles

TaskFlow API follows REST conventions:

- **Resources**: `/api/v1/{resource}`
- **Methods**: GET (retrieve), POST (create), PUT (update), DELETE (delete)
- **Status Codes**: 200 (OK), 201 (Created), 204 (No Content), 400 (Bad Request), 401 (Unauthorized), 404 (Not Found)
- **JSON Format**: Request and response bodies

### API Endpoints

#### Authentication
```
POST   /api/v1/auth/register          Register new user
POST   /api/v1/auth/login             Login (get token)
POST   /api/v1/auth/refresh           Refresh token
POST   /api/v1/auth/logout            Logout
```

#### Projects
```
GET    /api/v1/projects               List user's projects
POST   /api/v1/projects               Create project
GET    /api/v1/projects/{id}          Get project details
PUT    /api/v1/projects/{id}          Update project
DELETE /api/v1/projects/{id}          Delete project
```

#### Boards
```
GET    /api/v1/projects/{pid}/boards      List project boards
POST   /api/v1/projects/{pid}/boards      Create board
PUT    /api/v1/boards/{id}                Update board
DELETE /api/v1/boards/{id}                Delete board
```

#### Tasks
```
GET    /api/v1/boards/{bid}/tasks        List board tasks
POST   /api/v1/boards/{bid}/tasks        Create task
GET    /api/v1/tasks/{id}                Get task details
PUT    /api/v1/tasks/{id}                Update task
PATCH  /api/v1/tasks/{id}/status         Update task status
DELETE /api/v1/tasks/{id}                Delete task
```

#### Users
```
GET    /api/v1/users/me                  Get current user
PUT    /api/v1/users/me                  Update profile
GET    /api/v1/users/{id}                Get user profile
```

### Request/Response Format

**Success Response:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "My Project",
    "owner_id": 1,
    "created_at": "2024-01-01T00:00:00Z"
  },
  "message": "Project retrieved successfully"
}
```

**Error Response:**
```json
{
  "detail": "Invalid credentials",
  "status_code": 401,
  "error_type": "UNAUTHORIZED"
}
```

**Pagination:**
```json
{
  "status": "success",
  "data": [
    { "id": 1, "name": "Task 1" },
    { "id": 2, "name": "Task 2" }
  ],
  "meta": {
    "total": 100,
    "skip": 0,
    "limit": 2
  }
}
```

---

## Security Architecture

### Authentication Flow

```
Login Request (email, password)
              ↓
Verify credentials (bcrypt comparison)
              ↓
Generate JWT token
  • Payload: user_id, email, exp
  • Sign with SECRET_KEY
              ↓
Return access_token
              ↓
Client stores token (localStorage or sessionStorage)
              ↓
Future requests include: Authorization: Bearer {token}
              ↓
Backend verifies token signature and expiration
              ↓
Extract user_id from token
              ↓
Proceed with request
```

### JWT Token Structure

```
Header.Payload.Signature

Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "sub": "1",
  "email": "user@example.com",
  "exp": 1234567890
}

Signature:
HMACSHA256(base64UrlEncode(header) + "." + base64UrlEncode(payload), SECRET_KEY)
```

### Security Measures

1. **Password Security**
   - Hash with Bcrypt (10 rounds)
   - Never store plain passwords
   - Verify on login

2. **JWT Security**
   - Secret key stored in environment variables
   - Short expiration time (30 minutes)
   - Refresh token mechanism

3. **Input Validation**
   - Pydantic schemas validate all input
   - Type checking prevents injection attacks
   - Email format validation

4. **SQL Injection Prevention**
   - SQLAlchemy ORM handles escaping
   - No raw SQL queries
   - Parameterized queries

5. **CORS Protection**
   - Configure allowed origins
   - Restrict cross-origin requests
   - Credentials handling

6. **HTTPS/TLS**
   - SSL certificates in production
   - Secure cookie flags (HttpOnly, Secure, SameSite)
   - HSTS headers

7. **Rate Limiting** (future feature)
   - Prevent brute force attacks
   - DDoS protection
   - API rate limiting

---

## Deployment Architecture

### Development Setup

```
Local Machine
│
├─ Frontend (npm run dev)
│  └─ Vite dev server @ localhost:5173
│
├─ Backend (uvicorn ... --reload)
│  └─ FastAPI server @ localhost:8000
│
└─ Database (PostgreSQL local)
   └─ Connection via DATABASE_URL
```

### Docker Compose Setup

```
Docker Compose Stack
│
├─ frontend (nginx)
│  └─ Serves React SPA @ port 3000
│
├─ backend (Uvicorn + FastAPI)
│  └─ API server @ port 8000
│
├─ postgres
│  └─ PostgreSQL database @ port 5432
│
└─ redis (optional)
   └─ Redis cache @ port 6379
```

### Production Setup

```
Internet
   │
   ▼
Load Balancer (AWS ELB, GCP LB, etc.)
   │
   ├─ Zone A ──► Nginx (reverse proxy)
   │             └─► FastAPI Container (replica 1)
   │             └─► FastAPI Container (replica 2)
   │             └─► FastAPI Container (replica 3)
   │
   └─ Zone B ──► Nginx (reverse proxy)
                └─► FastAPI Container (replica 1)
                └─► FastAPI Container (replica 2)
                
Shared Infrastructure:
   ├─ PostgreSQL (managed database)
   ├─ Redis (cache layer)
   └─ CloudFront/CDN (static frontend assets)
```

### Container Images

**Backend Dockerfile:**
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["gunicorn", "-w", "4", "-k", "uvicorn.workers.UvicornWorker", "app.main:app"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
```

---

## Design Patterns

### 1. Repository Pattern
Abstracts data access, making services testable:

```python
class ProjectRepository:
    def __init__(self, db: Session):
        self.db = db
    
    def get_all(self, owner_id: int) -> List[Project]:
        return self.db.query(Project).filter(...).all()
```

### 2. Service Layer Pattern
Encapsulates business logic:

```python
class ProjectService:
    def __init__(self, repo: ProjectRepository):
        self.repo = repo
    
    async def create_project(self, name: str, owner_id: int) -> Project:
        # Business logic here
        return self.repo.create(Project(name=name, owner_id=owner_id))
```

### 3. Dependency Injection Pattern
Decouples components:

```python
@router.get("/projects/")
async def list_projects(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Dependencies injected by FastAPI
```

### 4. Factory Pattern
Creates complex objects:

```python
class UserFactory:
    @staticmethod
    def create_user(email: str, password: str) -> User:
        return User(
            email=email,
            password_hash=hash_password(password)
        )
```

### 5. Observer Pattern
State management updates:

```python
# Zustand (client-side observer)
const store = create((set) => ({
  user: null,
  setUser: (user) => set({ user })
}));

store.subscribe((state) => {
  console.log('User updated:', state.user);
});
```

---

## Performance Considerations

### Frontend Optimization

1. **Code Splitting**: Routes lazy-loaded with React Router
2. **Image Optimization**: Compressed, responsive images
3. **Bundle Size**: Tree-shaking unused code
4. **Caching**: React Query cache strategies
5. **Memoization**: `useMemo`, `useCallback`, `memo()`
6. **Virtual Scrolling**: For large lists
7. **Debouncing**: API search calls

### Backend Optimization

1. **Database Indexing**: Indexes on foreign keys and frequently queried fields
2. **Query Optimization**: Eager loading relationships, avoiding N+1 queries
3. **Caching**: Redis for frequently accessed data
4. **Pagination**: Limit result sets (default 10, max 100)
5. **Connection Pooling**: Reuse database connections
6. **Compression**: Gzip responses
7. **Async Operations**: Non-blocking I/O with Uvicorn

### Network Optimization

1. **HTTP/2**: Multiplexing
2. **Gzip Compression**: Reduce payload size
3. **CDN**: Static assets distribution
4. **API Rate Limiting**: Prevent abuse
5. **Batching**: Combine multiple requests
6. **WebSockets**: Real-time updates (future)

### Monitoring & Metrics

- API response times
- Database query performance
- Error rates
- User load/concurrency
- Resource utilization (CPU, memory)

---

## Scalability Strategy

### Horizontal Scaling

1. **Stateless Backend**: Each instance independent
2. **Load Balancer**: Distribute traffic
3. **Shared Database**: Central data source
4. **Cache Layer**: Reduce database load
5. **Queue System**: Offload long-running tasks

### Database Scaling

1. **Read Replicas**: For read-heavy operations
2. **Sharding**: Partition data by user_id or project_id
3. **Connection Pooling**: Limit open connections
4. **Regular Backups**: Data durability

### Frontend CDN

1. **Static Asset Distribution**: Serve from nearest edge
2. **Cache Busting**: Hash-based filenames
3. **Gzip Compression**: Reduce file sizes

---

## Summary

TaskFlow implements a **modern, scalable architecture** combining:

- ✅ **Clean Architecture**: Layered design with clear separation of concerns
- ✅ **Type Safety**: TypeScript + Python type hints
- ✅ **RESTful API**: Standard HTTP conventions
- ✅ **Security**: JWT auth, bcrypt hashing, input validation
- ✅ **Performance**: Caching, indexing, optimization
- ✅ **Scalability**: Stateless design, horizontal scaling
- ✅ **Maintainability**: Design patterns, testing, documentation

This architecture supports current requirements and scales as TaskFlow grows.

---

**Architecture Maintained By**: Development Team  
**Last Updated**: 2024  
**Version**: 1.0.0
