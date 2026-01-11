# TaskFlow Setup Guide

This document provides detailed instructions for setting up and running TaskFlow locally.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Quick Start with Docker](#quick-start-with-docker)
3. [Manual Setup](#manual-setup)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Running the Application](#running-the-application)
7. [Development Workflow](#development-workflow)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

You'll need one of the following setups:

### Option 1: Docker (Recommended)
- Docker 20.10+
- Docker Compose 2.0+

### Option 2: Local Development
- Node.js 18+
- npm 8+
- Python 3.9+
- PostgreSQL 12+
- Redis (optional)

## Quick Start with Docker

The fastest way to get TaskFlow running:

```bash
# 1. Clone the repository
git clone https://github.com/ca136/taskflow.git
cd taskflow

# 2. Copy environment file
cp .env.example .env

# 3. Start all services
docker-compose up -d

# 4. Access the application
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Documentation: http://localhost:8000/docs
```

### Docker Commands

```bash
# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Stop services
docker-compose down

# Remove all data and start fresh
docker-compose down -v
docker-compose up -d

# Rebuild images
docker-compose build --no-cache
```

## Manual Setup

### Backend Setup

#### 1. Create Python Virtual Environment

```bash
cd backend

# Create virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

#### 2. Install Dependencies

```bash
# Upgrade pip
pip install --upgrade pip

# Install dependencies
pip install -r requirements.txt
```

#### 3. Configure Environment

```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings
# Important: Change SECRET_KEY to a random string
```

#### 4. Setup Database

```bash
# Ensure PostgreSQL is running
# Update DATABASE_URL in .env if using non-standard connection

# Run migrations
alembic upgrade head
```

#### 5. Start Backend Server

```bash
# Start development server
uvicorn app.main:app --reload --port 8000

# API will be available at http://localhost:8000
# API docs at http://localhost:8000/docs
```

### Frontend Setup

#### 1. Install Dependencies

```bash
cd frontend

# Install npm dependencies
npm install
```

#### 2. Configure Environment

```bash
# Copy environment template
cp .env.example .env.local

# Edit .env.local if needed
# Default VITE_API_URL=http://localhost:8000 should work
```

#### 3. Start Development Server

```bash
# Start Vite dev server
npm run dev

# Frontend will be available at http://localhost:5173
```

## Environment Configuration

### Backend Environment Variables (.env)

```env
# Database Connection
DATABASE_URL=postgresql://user:password@localhost:5432/taskflow

# Security (generate with: openssl rand -hex 32)
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS - Allowed origins
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Application
ENVIRONMENT=development
DEBUG=true
```

### Frontend Environment Variables (.env.local)

```env
# API Configuration
VITE_API_URL=http://localhost:8000

# App Settings
VITE_APP_NAME=TaskFlow
VITE_DEBUG=true
```

## Database Setup

### PostgreSQL Installation

#### macOS (using Homebrew)
```bash
brew install postgresql@15
brew services start postgresql@15

# Create database and user
createuser taskflow_user -P  # Will prompt for password
createdb taskflow -O taskflow_user
```

#### Ubuntu/Debian
```bash
sudo apt-get install postgresql postgresql-contrib

# Create database and user
sudo -u postgres createuser taskflow_user -P
sudo -u postgres createdb taskflow -O taskflow_user
```

#### Windows
- Download and install PostgreSQL from https://www.postgresql.org/download/windows/
- Run the installer and note the password you set for the postgres user

### Database Migrations

Once the database is set up:

```bash
cd backend

# Apply all migrations
alembic upgrade head

# Create a new migration
alembic revision --autogenerate -m "Add new table"

# Revert to previous migration
alembic downgrade -1
```

## Running the Application

### Using Docker Compose (Recommended)

```bash
docker-compose up -d

# Check status
docker-compose ps

# View all logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Running Locally

In separate terminal windows:

```bash
# Terminal 1: Backend
cd backend
source venv/bin/activate  # or venv\Scripts\activate on Windows
uvicorn app.main:app --reload --port 8000

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: PostgreSQL (if running locally)
# Ensure it's running - check with: psql -U taskflow_user -d taskflow
```

Access the application:
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Documentation: http://localhost:8000/docs

## Development Workflow

### Frontend Development

```bash
cd frontend

# Start dev server with hot reload
npm run dev

# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build

# Preview production build
npm run preview
```

### Backend Development

```bash
cd backend

# Start with auto-reload
uvicorn app.main:app --reload --port 8000

# Run tests
pytest

# Run tests with coverage
pytest --cov=app

# Format code
black .

# Lint code
flake8 .

# Type check
mypy app --ignore-missing-imports
```

### Code Quality

#### Python/Backend

```bash
cd backend

# Format code with Black
black .

# Check formatting
black --check .

# Lint with Flake8
flake8 app

# Type check with mypy
mypy app --ignore-missing-imports

# Run security checks
bandit -r app
```

#### JavaScript/Frontend

```bash
cd frontend

# Lint with ESLint
npm run lint

# Fix linting issues
npm run lint -- --fix

# Format with Prettier
npm run format

# Type check
npm run type-check
```

### Git Workflow

```bash
# Create a feature branch
git checkout -b feature/your-feature-name

# Make changes and commit
git add .
git commit -m "Add your feature"

# Push to remote
git push origin feature/your-feature-name

# Create a pull request on GitHub
```

## Testing

### Backend Tests

```bash
cd backend

# Run all tests
pytest

# Run specific test file
pytest tests/api/test_projects.py

# Run with coverage report
pytest --cov=app --cov-report=html

# Run tests in verbose mode
pytest -v

# Run and stop on first failure
pytest -x
```

### Frontend Tests

```bash
cd frontend

# Run all tests
npm run test

# Run tests in watch mode
npm run test -- --watch

# Run tests with coverage
npm run test:coverage

# Run specific test file
npm run test -- projects.test.ts
```

## API Documentation

Once the backend is running, access the interactive API documentation:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

These provide:
- Interactive endpoint testing
- Request/response examples
- Authentication testing
- Schema documentation

## Troubleshooting

### Common Issues

#### 1. "Cannot connect to database"

```bash
# Check if PostgreSQL is running
psql -U taskflow_user -d taskflow -c "SELECT 1"

# If connection fails, verify DATABASE_URL in .env
# Example correct format:
# DATABASE_URL=postgresql://taskflow_user:password@localhost:5432/taskflow
```

#### 2. "Port already in use"

```bash
# Find process using port 8000 (backend)
lsof -i :8000

# Find process using port 5173 (frontend)
lsof -i :5173

# Find process using port 5432 (database)
lsof -i :5432

# Kill process (replace PID with actual process ID)
kill -9 <PID>
```

#### 3. "Module not found" errors

Backend:
```bash
cd backend
pip install -r requirements.txt
```

Frontend:
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

#### 4. Docker issues

```bash
# Check Docker is running
docker ps

# Remove stuck containers
docker-compose down -v

# Rebuild from scratch
docker-compose build --no-cache

# Check logs for errors
docker-compose logs -f backend
```

#### 5. CORS errors in browser console

Ensure `ALLOWED_ORIGINS` in backend `.env` includes your frontend URL:
```env
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### 6. "Secret Key" warning in development

Generate a secure key:
```bash
python3 -c "import secrets; print(secrets.token_hex(32))"
```

Update in `.env`:
```env
SECRET_KEY=<generated-key>
```

### Getting Help

1. Check existing [GitHub Issues](https://github.com/ca136/taskflow/issues)
2. Review logs: `docker-compose logs -f`
3. Verify environment variables are set correctly
4. Ensure all services are running: `docker-compose ps`

## Next Steps

Once everything is running:

1. Visit http://localhost:5173 for the frontend
2. Check http://localhost:8000/docs for API documentation
3. Create your first project and start managing tasks
4. Read [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details

## Production Deployment

For deploying to production, see:
- [Deployment Guide](./DEPLOYMENT.md)
- [Environment Configuration](./CONFIG.md)
- Docker deployment via `.github/workflows/deploy.yml`
