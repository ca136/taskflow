# TaskFlow Developer Setup Guide

## 📋 Table of Contents
1. [Prerequisites](#prerequisites)
2. [Quick Start](#quick-start)
3. [Local Development Setup](#local-development-setup)
4. [Docker Setup](#docker-setup)
5. [Project Structure](#project-structure)
6. [Configuration](#configuration)
7. [Development Workflow](#development-workflow)
8. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements
- **Node.js**: ≥18.0.0 (for frontend development)
- **Python**: ≥3.9 (for backend development)
- **PostgreSQL**: ≥12 (for database)
- **npm**: ≥9.0.0
- **Git**: ≥2.40

### Installation
```bash
# macOS (using Homebrew)
brew install node python postgresql

# Ubuntu/Debian
sudo apt-get install nodejs npm python3 postgresql postgresql-contrib git

# Windows (using Chocolatey)
choco install nodejs python postgresql git
```

### Verify Installation
```bash
node --version      # Should be ≥18.0.0
npm --version       # Should be ≥9.0.0
python3 --version   # Should be ≥3.9
psql --version      # Should be ≥12
git --version       # Should be ≥2.40
```

---

## Quick Start

### 1. Clone Repository
```bash
git clone https://github.com/ca136/taskflow.git
cd taskflow
```

### 2. Setup Frontend (React)
```bash
cd frontend
npm install
npm run dev
# Frontend will be available at http://localhost:5173
```

### 3. Setup Backend (FastAPI) - In Another Terminal
```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run server
uvicorn app.main:app --reload
# Backend will be available at http://localhost:8000
```

### 4. Database Setup

**Option A: Local PostgreSQL**
```bash
# Create database
createdb taskflow

# Set DATABASE_URL in backend/.env
DATABASE_URL="postgresql://your_user:your_password@localhost/taskflow"
```

**Option B: Docker PostgreSQL**
```bash
docker run --name taskflow-postgres \
  -e POSTGRES_USER=taskflow_user \
  -e POSTGRES_PASSWORD=taskflow_password \
  -e POSTGRES_DB=taskflow \
  -p 5432:5432 \
  -d postgres:15-alpine

# Set DATABASE_URL in backend/.env
DATABASE_URL="postgresql://taskflow_user:taskflow_password@localhost/taskflow"
```

---

## Local Development Setup

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Type checking
npm run type-check

# Linting
npm run lint

# Run tests
npm test
```

**Frontend Port**: `http://localhost:5173`

**Environment Variables** (frontend/.env):
```env
VITE_API_BASE_URL=http://localhost:8000
```

### Backend Setup

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate  # macOS/Linux
# OR
venv\Scripts\activate     # Windows

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your local settings
# Key variables:
# - DATABASE_URL
# - SECRET_KEY
# - ENVIRONMENT=development

# Run migrations
alembic upgrade head

# Start server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

**Backend Port**: `http://localhost:8000`
**API Docs**: `http://localhost:8000/docs`
**ReDoc**: `http://localhost:8000/redoc`

**Environment Variables** (backend/.env):
```env
# Database
DATABASE_URL=postgresql://taskflow_user:taskflow_password@localhost/taskflow

# API
API_V1_STR=/api/v1
PROJECT_NAME=TaskFlow

# Security (change in production!)
SECRET_KEY=your-super-secret-key-change-this-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]

# Environment
ENVIRONMENT=development
DEBUG=true
```

---

## Docker Setup

### Using Docker Compose (Recommended for Full Stack)

```bash
# Build and start all services
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Stop services and remove volumes
docker-compose down -v
```

**Services Started**:
- PostgreSQL: `localhost:5432`
- Backend (FastAPI): `localhost:8000`
- Frontend (React): `localhost:5173`
- Redis: `localhost:6379` (optional)

### Docker Compose Environment Variables

Create `.env` file in root directory:
```env
# Database
DB_USER=taskflow_user
DB_PASSWORD=taskflow_password
DB_NAME=taskflow
DB_PORT=5432

# Backend
BACKEND_PORT=8000
SECRET_KEY=your-secret-key-change-in-production
ENVIRONMENT=development
DEBUG=true

# Frontend
FRONTEND_PORT=5173
VITE_API_URL=http://localhost:8000

# Redis
REDIS_PORT=6379
```

---

## Project Structure

```
taskflow/
├── frontend/                    # React + TypeScript + Vite
│   ├── src/
│   │   ├── components/         # React components
│   │   ├── pages/              # Page components
│   │   ├── hooks/              # Custom React hooks
│   │   ├── api/                # API client
│   │   ├── services/           # Business logic
│   │   ├── store/              # Zustand stores
│   │   ├── types/              # TypeScript types
│   │   ├── utils/              # Utility functions
│   │   └── styles/             # Global styles
│   ├── public/                 # Static assets
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── backend/                     # FastAPI + Python
│   ├── app/
│   │   ├── api/                # API routes
│   │   ├── models/             # SQLAlchemy models
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── services/           # Business logic
│   │   ├── core/               # Config, auth, etc.
│   │   └── db/                 # Database utilities
│   ├── tests/                  # Test files
│   ├── migrations/             # Alembic migrations
│   ├── requirements.txt
│   ├── main.py
│   └── pyproject.toml
│
├── docs/                        # Documentation
│   ├── API.md                  # API reference
│   ├── ARCHITECTURE.md         # System architecture
│   ├── SETUP.md                # Setup instructions
│   ├── development.md          # Development guide
│   └── deployment.md           # Deployment guide
│
├── docker-compose.yml          # Multi-container setup
├── .gitignore
├── LICENSE
└── README.md
```

---

## Configuration

### Environment Files

#### Root Level (.env.example)
Contains all shared environment variables for the full stack.

#### Frontend (.env.example)
```env
VITE_API_BASE_URL=http://localhost:8000
VITE_ENV=development
```

#### Backend (.env.example)
```env
DATABASE_URL=postgresql://user:pass@localhost/taskflow
SECRET_KEY=your-secret-key
ALGORITHM=HS256
ENVIRONMENT=development
```

### Copy Environment Templates
```bash
# Create .env files from examples
cp .env.example .env
cp frontend/.env.example frontend/.env
cp backend/.env.example backend/.env
```

---

## Development Workflow

### Making Changes

#### Frontend
1. Create a branch: `git checkout -b feature/my-feature`
2. Make changes in `frontend/src/`
3. Run `npm run lint` to check code style
4. Run `npm test` to run tests
5. Test locally at `http://localhost:5173`
6. Commit and push: `git push origin feature/my-feature`
7. Create a Pull Request

#### Backend
1. Create a branch: `git checkout -b feature/my-feature`
2. Make changes in `backend/app/`
3. Run `pytest` to run tests
4. Test locally at `http://localhost:8000/docs`
5. Commit and push: `git push origin feature/my-feature`
6. Create a Pull Request

### Database Migrations

```bash
cd backend

# Create a new migration
alembic revision --autogenerate -m "Add new column"

# Apply migrations
alembic upgrade head

# Rollback last migration
alembic downgrade -1
```

### Testing

#### Frontend
```bash
cd frontend
npm test              # Run tests
npm run test:watch   # Watch mode
```

#### Backend
```bash
cd backend
pytest                # Run all tests
pytest -v             # Verbose output
pytest -k "test_name" # Run specific test
```

---

## Troubleshooting

### Frontend Issues

#### Port 5173 Already in Use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :5173    # Windows (find PID and kill)

# Or use a different port
npm run dev -- --port 3000
```

#### Module Not Found
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run dev
```

#### TypeScript Errors
```bash
npm run type-check  # Check TypeScript compilation
npm run lint        # Check ESLint errors
```

### Backend Issues

#### Python Virtual Environment Issues
```bash
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate  # macOS/Linux
pip install -r requirements.txt
```

#### Database Connection Issues
```bash
# Check PostgreSQL is running
psql -U your_user -d taskflow -h localhost

# Check DATABASE_URL in .env
# Format: postgresql://user:password@host:port/database

# Run migrations
alembic upgrade head
```

#### Port 8000 Already in Use
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9  # macOS/Linux
netstat -ano | findstr :8000    # Windows

# Or use a different port
uvicorn app.main:app --port 8001 --reload
```

### Docker Issues

#### Build Fails
```bash
# Clean up Docker
docker system prune -a
docker volume prune

# Rebuild
docker-compose up --build
```

#### Services Can't Connect
```bash
# Check service names in docker-compose.yml
# Frontend should connect to http://backend:8000
# Backend should connect to postgresql://postgres:5432

# Restart services
docker-compose down
docker-compose up --build
```

#### Database Already Exists
```bash
# Remove everything and start fresh
docker-compose down -v
docker-compose up --build
```

---

## Additional Resources

- **Frontend README**: `frontend/README.md`
- **Backend README**: `backend/README.md`
- **Architecture**: `docs/ARCHITECTURE.md`
- **API Reference**: `docs/API.md` or `http://localhost:8000/docs`
- **Contributing**: `CONTRIBUTING.md`

## Getting Help

- Check documentation in `/docs` directory
- Review existing GitHub issues
- Create a new issue with detailed description
- Join our community discussions

---

**Happy Coding! 🚀**
