# TaskFlow - Complete Setup and Configuration Guide

**Project**: TaskFlow - Full-Stack Kanban Project Management Application
**Repository**: ca136/taskflow
**Status**: ✅ Production-Ready Project Structure
**Last Updated**: 2024

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Project Structure](#project-structure)
3. [Configuration Files](#configuration-files)
4. [Setup Instructions](#setup-instructions)
5. [Development Workflow](#development-workflow)
6. [Deployment Guide](#deployment-guide)
7. [Troubleshooting](#troubleshooting)

---

## Project Overview

TaskFlow is a modern, lightweight kanban-style project management application built with:

- **Frontend**: React 18 + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + Python 3.11+ + SQLAlchemy
- **Database**: PostgreSQL
- **Caching**: Redis (optional)
- **Containerization**: Docker & Docker Compose
- **CI/CD**: GitHub Actions

### Key Features
- Real-time task management with kanban boards
- User authentication with JWT tokens
- Project and team collaboration
- Responsive design for desktop and tablet
- API-first architecture with OpenAPI documentation

---

## Project Structure

### Root Directory Structure

```
taskflow/
├── .github/                 # GitHub configuration
│   └── workflows/           # CI/CD automation
│       ├── tests.yml       # Testing pipeline
│       └── deploy.yml      # Docker build & deployment
├── frontend/               # React application
├── backend/                # FastAPI application
├── docs/                   # Documentation
├── .gitignore             # Git ignore patterns
├── .env.example           # Environment template
├── .editorconfig          # Editor configuration
├── README.md              # Main README
├── Dockerfile             # Backend production image
├── frontend.Dockerfile    # Frontend production image
└── docker-compose.yml     # Local development stack
```

### Frontend Structure (`frontend/src/`)

```
frontend/src/
├── api/                   # API client and endpoints
├── assets/               # Static assets (images, icons)
├── components/           # Reusable React components
├── hooks/               # Custom React hooks
├── pages/               # Page-level components
├── services/            # API service helpers
├── store/               # Zustand state management
├── stores/              # Additional Zustand stores
├── styles/              # Global styles and Tailwind
├── types/               # TypeScript type definitions
├── utils/               # Utility functions
├── App.tsx             # Root component
└── main.tsx            # Application entry point
```

### Backend Structure (`backend/app/`)

```
backend/app/
├── api/                 # Route handlers (/api/v1/*)
├── core/               # Configuration, auth, dependencies
│   ├── config.py       # App configuration
│   ├── security.py     # JWT and password utilities
│   └── dependencies.py # FastAPI Depends() functions
├── db/                 # Database utilities
├── models/             # SQLAlchemy ORM models
│   ├── user.py
│   ├── project.py
│   └── task.py
├── routes/             # Route definitions
├── schemas/            # Pydantic validation schemas
├── services/           # Business logic layer
│   ├── user_service.py
│   ├── project_service.py
│   └── task_service.py
├── database.py         # Database connection
├── main.py            # FastAPI application
└── __init__.py
```

---

## Configuration Files

### Root Level Files

#### `.gitignore`
✅ **Configured for:**
- Python: `__pycache__/`, `*.py[cod]`, `.venv/`, etc.
- Node: `node_modules/`, `npm-debug.log`, etc.
- IDE: `.vscode/`, `.idea/`, etc.
- OS: `.DS_Store`, `Thumbs.db`, etc.
- Vite: `dist/`, `.env.local`, etc.
- Build: `build/`, `.turbo/`, etc.

**File**: `.gitignore` (1,727 bytes, 172 lines)

#### `.env.example`
✅ **Template Variables:**

**Backend Configuration:**
```
DATABASE_URL=postgresql://taskflow_user:taskflow_password@localhost/taskflow
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7
BACKEND_CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
```

**Frontend Configuration:**
```
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=TaskFlow
```

**Database:**
```
DB_POOL_SIZE=20
DB_POOL_RECYCLE=3600
```

**Optional Services:**
```
REDIS_URL=redis://localhost:6379/0
```

**Environment:**
```
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=INFO
```

**File**: `.env.example` (1,159 bytes, 51 lines)

#### `.editorconfig`
✅ **Configured for:**
- Indentation: 4 spaces (Python), 2 spaces (JavaScript)
- Line endings: LF
- Charset: UTF-8
- Trim trailing whitespace
- Final newline at EOF

#### `README.md`
✅ **Content:**
- Project overview and features
- Technology stack with versions
- Project structure documentation
- Setup instructions for frontend and backend
- Environment variables guide
- Development workflow
- Testing instructions
- Deployment guide
- Contributing guidelines
- Roadmap

---

### Frontend Configuration

#### `package.json`
```json
{
  "name": "taskflow-frontend",
  "version": "0.1.0",
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "lint": "eslint . --ext ts,tsx",
    "type-check": "tsc --noEmit",
    "test": "vitest"
  },
  "dependencies": {
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.28.0",
    "@tanstack/react-query": "^5.39.0",
    "zustand": "^4.5.3",
    "axios": "^1.7.7"
  }
}
```

#### `vite.config.ts`
✅ React plugin, TypeScript support, proxy configuration for API

#### `tsconfig.json`
✅ Strict mode enabled, ES2020 target, JSX support

#### `tailwind.config.js`
✅ Tailwind CSS configuration with custom theme options

#### `postcss.config.js`
✅ PostCSS processing for Tailwind CSS

#### `index.html`
✅ Entry HTML file with `<div id="root">` for React

---

### Backend Configuration

#### `requirements.txt`
✅ **Key Dependencies:**
- fastapi==0.110.0
- uvicorn[standard]==0.27.0
- sqlalchemy==2.0.25
- pydantic==2.6.0
- psycopg2-binary==2.9.9 (PostgreSQL)
- alembic==1.13.1 (Migrations)
- pytest==7.4.4 (Testing)
- python-jose[cryptography]==3.3.0 (JWT)
- passlib[bcrypt]==1.7.4 (Password hashing)

#### `pyproject.toml`
✅ Project metadata, build system, tool configurations

#### `pytest.ini`
✅ PyTest configuration with test discovery patterns

---

### Docker Configuration

#### `Dockerfile` (Backend)
✅ **Production Image:**
- Base: `python:3.11-slim`
- Health check: HTTP GET /health every 30s
- Non-root user: `appuser` (UID 1000)
- Entrypoint: `uvicorn app.main:app --host 0.0.0.0 --port 8000`

#### `frontend.Dockerfile` (Frontend)
✅ **Multi-stage Build:**
- Build stage: `node:18-alpine` (npm install, npm run build)
- Runtime stage: `node:18-alpine` (serve static files)
- Health check: Node HTTP request to localhost:3000
- Non-root user: `appuser`
- Entrypoint: `serve -s dist -l 3000`

#### `docker-compose.yml`
✅ **Services Included:**

**1. PostgreSQL (postgres)**
- Image: `postgres:15-alpine`
- Port: 5432
- Health check: pg_isready
- Volume: `postgres_data`

**2. Backend (backend)**
- Build: Dockerfile in root
- Port: 8000
- Environment: DATABASE_URL, SECRET_KEY, etc.
- Depends on: postgres (healthy)
- Command: `uvicorn app.main:app --reload`

**3. Frontend (frontend)**
- Build: frontend.Dockerfile
- Port: 5173 (or 3000 in production)
- Environment: VITE_API_URL
- Depends on: backend
- Command: `npm run dev`

**4. Redis (redis)**
- Image: `redis:7-alpine`
- Port: 6379
- Health check: redis-cli ping
- Volume: `redis_data`

**Networks**: `taskflow_network` (bridge)

---

### GitHub Actions CI/CD

#### `.github/workflows/tests.yml`
✅ **Backend Testing:**
- Python 3.11 setup
- PostgreSQL 15 service
- pip dependency installation
- Flake8 linting
- MyPy type checking
- PyTest with coverage
- Triggers: `push` to main/develop, `pull_request`

✅ **Frontend Testing:**
- Node 18 setup
- npm cache
- npm ci (clean install)
- ESLint
- TypeScript type check
- Vitest unit tests
- Vite build
- Triggers: `push` to main/develop, `pull_request`

#### `.github/workflows/deploy.yml`
✅ **Docker Build & Push:**
- Docker Buildx setup
- Backend image build (Dockerfile)
- Frontend image build (frontend.Dockerfile)
- Tags: `latest`, commit SHA
- Push to Docker Hub
- Docker layer caching (GHA cache)
- Requires: `DOCKER_USERNAME`, `DOCKER_PASSWORD` secrets
- Triggers: `push` to main, `workflow_dispatch`

---

## Setup Instructions

### Prerequisites

**System Requirements:**
- Node.js 18+ and npm 9+
- Python 3.11+
- PostgreSQL 12+ (if not using Docker)
- Docker & Docker Compose (optional but recommended)
- Git

### Local Development Setup

#### Option 1: Using Docker Compose (Recommended)

```bash
# Clone the repository
git clone https://github.com/ca136/taskflow.git
cd taskflow

# Copy environment file
cp .env.example .env

# Start all services
docker-compose up -d

# Check services are running
docker-compose ps

# View logs
docker-compose logs -f
```

**Access Points:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs
- PostgreSQL: localhost:5432
- Redis: localhost:6379

#### Option 2: Manual Setup

##### Frontend Setup
```bash
cd frontend

# Install dependencies
npm install

# Create .env.local if needed
echo "VITE_API_URL=http://localhost:8000/api/v1" > .env.local

# Start development server
npm run dev

# In another terminal - linting
npm run lint

# Type checking
npm run type-check

# Run tests
npm test
```

**Frontend will be available at**: http://localhost:5173

##### Backend Setup
```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment file
cp .env.example .env

# Edit .env with your database connection
# Example for local PostgreSQL:
# DATABASE_URL=postgresql://postgres:postgres@localhost/taskflow

# Run database migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload

# In another terminal - run tests
pytest

# Type checking
mypy app --ignore-missing-imports
```

**Backend will be available at**: http://localhost:8000

**API Documentation**: http://localhost:8000/docs (Swagger UI)

---

## Development Workflow

### Day-to-Day Development

#### Frontend Development
```bash
cd frontend

# Terminal 1: Start dev server
npm run dev

# Terminal 2: Watch for type errors
npm run type-check -- --watch

# Terminal 3: Lint on save
npm run lint -- --fix

# Before commit
npm test
npm run build
```

#### Backend Development
```bash
cd backend

# Terminal 1: Start development server
uvicorn app.main:app --reload

# Terminal 2: Run tests in watch mode
pytest --watch

# Terminal 3: Type checking
mypy app --ignore-missing-imports

# Before commit
pytest --cov=app
```

### Making Changes

#### Adding a New Feature

**Frontend:**
1. Create component in `frontend/src/components/`
2. Add API service in `frontend/src/services/`
3. Add types in `frontend/src/types/`
4. Add Zustand store in `frontend/src/store/` if needed
5. Create page or integrate into existing page
6. Test with `npm test`

**Backend:**
1. Create SQLAlchemy model in `backend/app/models/`
2. Create Pydantic schema in `backend/app/schemas/`
3. Create service logic in `backend/app/services/`
4. Create route in `backend/app/routes/`
5. Add to `backend/app/main.py` router
6. Test with `pytest`
7. Create migration: `alembic revision --autogenerate -m "description"`

#### Database Changes

```bash
cd backend

# Create new migration
alembic revision --autogenerate -m "Add new table"

# Review migration in backend/app/migrations/versions/

# Apply migration
alembic upgrade head

# Revert last migration if needed
alembic downgrade -1
```

### Testing

#### Frontend Tests
```bash
cd frontend
npm test                    # Run all tests
npm test -- --ui          # UI test runner
npm test -- --coverage    # Coverage report
```

#### Backend Tests
```bash
cd backend
pytest                     # Run all tests
pytest --watch            # Watch mode
pytest --cov=app          # Coverage report
pytest tests/test_auth.py # Specific test file
pytest -k "test_login"    # Specific test function
```

---

## Deployment Guide

### Production Docker Build

#### Build Images
```bash
# Build backend
docker build -t taskflow-backend:latest -f Dockerfile .

# Build frontend
docker build -t taskflow-frontend:latest -f frontend.Dockerfile frontend/

# Verify images
docker images | grep taskflow
```

#### Push to Registry
```bash
# Tag for registry
docker tag taskflow-backend:latest username/taskflow-backend:latest
docker tag taskflow-frontend:latest username/taskflow-frontend:latest

# Login to registry
docker login

# Push images
docker push username/taskflow-backend:latest
docker push username/taskflow-frontend:latest
```

### Production Environment Variables

Create production `.env`:
```
# Backend
DATABASE_URL=postgresql://produser:prodpass@db.example.com/taskflow_prod
SECRET_KEY=your-long-random-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
BACKEND_CORS_ORIGINS=["https://taskflow.example.com"]
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=WARNING

# Frontend
VITE_API_URL=https://api.taskflow.example.com/api/v1
VITE_APP_NAME=TaskFlow

# Database
DB_POOL_SIZE=20
DB_POOL_RECYCLE=3600

# Redis
REDIS_URL=redis://redis.example.com:6379/0
```

### Production Deployment Options

#### Option 1: Docker Compose (Small Teams)
```bash
docker-compose -f docker-compose.yml up -d
```

#### Option 2: Kubernetes
```bash
# Create configmaps and secrets
kubectl create configmap taskflow-config --from-file=.env

# Apply deployments
kubectl apply -f k8s/backend-deployment.yaml
kubectl apply -f k8s/frontend-deployment.yaml
kubectl apply -f k8s/postgres-statefulset.yaml
```

#### Option 3: Cloud Platform (Vercel, Render, Fly.io, etc.)
1. Connect repository
2. Configure build commands:
   - Backend: `pip install -r backend/requirements.txt`
   - Frontend: `cd frontend && npm install && npm run build`
3. Set environment variables
4. Deploy

### Database Backups

#### PostgreSQL Backup
```bash
# Backup
pg_dump -U taskflow_user -h localhost taskflow > backup.sql

# Restore
psql -U taskflow_user -h localhost taskflow < backup.sql
```

#### Docker Database Backup
```bash
docker exec taskflow_postgres pg_dump -U taskflow_user taskflow > backup.sql
```

---

## Troubleshooting

### Common Issues

#### Port Already in Use
```bash
# Find process using port 5173 (frontend)
lsof -i :5173
# Kill process
kill -9 <PID>

# Or change port in vite.config.ts
# Or use docker-compose (handles port mapping)
```

#### Database Connection Error
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Check DATABASE_URL in .env
# Ensure PostgreSQL service is healthy
docker-compose logs postgres

# Try reconnecting
docker-compose down && docker-compose up -d
```

#### Module Not Found Errors

**Frontend:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

**Backend:**
```bash
cd backend
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

#### TypeScript Errors
```bash
cd frontend
npm run type-check

# Fix errors or suppress if intentional
# @ts-ignore or @ts-expect-error
```

#### API CORS Issues
```bash
# Check BACKEND_CORS_ORIGINS in .env
# Should include frontend URL
BACKEND_CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]

# Restart backend for changes to take effect
uvicorn app.main:app --reload
```

#### Tests Failing

**Frontend:**
```bash
cd frontend
npm test -- --ui  # Open UI to see failures
npm test -- --reporter=verbose
```

**Backend:**
```bash
cd backend
pytest -v  # Verbose output
pytest -s  # Print stdout
pytest --pdb  # Debug on failure
```

#### Database Migrations Issues
```bash
cd backend

# Check migration history
alembic history

# Check current version
alembic current

# If migrations fail, manually inspect
alembic upgrade head --sql  # See SQL without executing

# Downgrade if needed
alembic downgrade -1
```

---

## Additional Resources

### Documentation
- **Main README**: `README.md`
- **Architecture Guide**: `docs/ARCHITECTURE.md`
- **API Reference**: `docs/API.md`
- **Setup Details**: `docs/SETUP.md`
- **Development Guide**: `docs/development.md`
- **Deployment Guide**: `docs/deployment.md`

### External Links
- **FastAPI Docs**: https://fastapi.tiangolo.com/
- **React Docs**: https://react.dev/
- **Vite Docs**: https://vitejs.dev/
- **Tailwind CSS**: https://tailwindcss.com/
- **SQLAlchemy**: https://www.sqlalchemy.org/
- **PostgreSQL**: https://www.postgresql.org/
- **Docker**: https://www.docker.com/

### Key Files Reference
- Frontend entry: `frontend/src/main.tsx`
- Backend entry: `backend/app/main.py`
- Database config: `backend/app/database.py`
- API routes: `backend/app/routes/`
- Components: `frontend/src/components/`

---

## Support & Contact

For issues, questions, or contributions:
1. Check existing documentation
2. Search GitHub issues
3. Create new issue with detailed information
4. Follow contributing guidelines

**Repository**: https://github.com/ca136/taskflow

---

**Document Version**: 1.0
**Last Updated**: 2024
**Status**: ✅ Complete and Verified
