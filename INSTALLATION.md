# TaskFlow Installation Guide

Complete setup instructions for TaskFlow development and production environments.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Docker Setup](#docker-setup)
4. [Environment Configuration](#environment-configuration)
5. [Database Setup](#database-setup)
6. [Verification](#verification)
7. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- **OS**: macOS, Linux, or Windows (with WSL2)
- **Disk Space**: At least 2GB free

### Software Requirements

#### Option 1: Local Development
- **Node.js**: ≥18.0.0 ([Download](https://nodejs.org/))
- **npm**: ≥9.0.0 (comes with Node.js)
- **Python**: ≥3.9 ([Download](https://www.python.org/))
- **PostgreSQL**: ≥12 ([Download](https://www.postgresql.org/))
- **Git**: ≥2.20 ([Download](https://git-scm.com/))

#### Option 2: Docker Setup (Recommended)
- **Docker**: ≥20.10 ([Download](https://www.docker.com/products/docker-desktop))
- **Docker Compose**: ≥1.29 (included with Docker Desktop)
- **Git**: ≥2.20

### Verify Installation

```bash
# Node.js and npm
node --version    # Should be v18.0.0 or higher
npm --version     # Should be 9.0.0 or higher

# Python
python3 --version  # Should be 3.9 or higher

# Git
git --version     # Should be 2.20 or higher

# Docker (if using Docker setup)
docker --version
docker-compose --version
```

## Local Development Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ca136/taskflow.git
cd taskflow
```

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env with your settings
# Important settings to update:
# - DATABASE_URL: PostgreSQL connection string
# - SECRET_KEY: Generate a secure random key
# - ALLOWED_ORIGINS: Frontend URL
```

#### Generate SECRET_KEY

```bash
# On macOS/Linux
python3 -c "import secrets; print(secrets.token_urlsafe(32))"

# On Windows PowerShell
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

### 3. Setup Backend

```bash
cd backend

# Create Python virtual environment
python3 -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows (Command Prompt):
venv\Scripts\activate
# On Windows (PowerShell):
venv\Scripts\Activate.ps1

# Install dependencies
pip install --upgrade pip
pip install -r requirements.txt

# Verify installation
pip list
```

### 4. Setup Frontend

```bash
cd frontend

# Install dependencies
npm install

# Verify installation
npm list --depth=0
```

### 5. Setup Database

#### Option A: PostgreSQL Locally

```bash
# macOS with Homebrew
brew install postgresql@15
brew services start postgresql@15

# Ubuntu/Debian
sudo apt-get install postgresql postgresql-contrib
sudo systemctl start postgresql

# Create database and user
psql -U postgres

# In psql prompt:
CREATE USER taskflow_user WITH PASSWORD 'taskflow_password';
CREATE DATABASE taskflow OWNER taskflow_user;
ALTER DATABASE taskflow OWNER TO taskflow_user;
GRANT ALL PRIVILEGES ON DATABASE taskflow TO taskflow_user;
\q
```

#### Option B: PostgreSQL with Docker

```bash
docker run --name taskflow-postgres \
  -e POSTGRES_USER=taskflow_user \
  -e POSTGRES_PASSWORD=taskflow_password \
  -e POSTGRES_DB=taskflow \
  -p 5432:5432 \
  -v postgres_data:/var/lib/postgresql/data \
  -d postgres:15-alpine

# Verify connection
docker logs taskflow-postgres
```

### 6. Initialize Database Schema

```bash
cd backend

# Run database migrations
# (If using Alembic)
alembic upgrade head

# Or create tables directly (see backend/README.md)
python -c "from app.core.database import engine; from app.models import Base; Base.metadata.create_all(bind=engine)"
```

### 7. Start Development Servers

#### Terminal 1: Backend API

```bash
cd backend
source venv/bin/activate    # Ensure venv is active
uvicorn app.main:app --reload --port 8000
# API running at http://localhost:8000
# Swagger docs at http://localhost:8000/docs
```

#### Terminal 2: Frontend Development Server

```bash
cd frontend
npm run dev
# Frontend running at http://localhost:5173
```

### 8. Verify Setup

- Open http://localhost:5173 in your browser
- Should see TaskFlow application
- Check http://localhost:8000/docs for API documentation
- Try creating an account

## Docker Setup

### Quick Start with Docker Compose

```bash
# Build and start all services
docker-compose up --build

# Services available:
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# PostgreSQL: localhost:5432
# Redis: localhost:6379
# pgAdmin: http://localhost:5050 (optional)
```

### Individual Docker Commands

```bash
# Build images
docker build -f Dockerfile -t taskflow-backend:latest .
docker build -f frontend.Dockerfile -t taskflow-frontend:latest frontend

# Run containers
docker run -p 8000:8000 --env-file .env taskflow-backend:latest
docker run -p 5173:5173 taskflow-frontend:latest

# Stop containers
docker-compose down

# Remove volumes (careful - deletes data!)
docker-compose down -v
```

### Docker Compose Services

The `docker-compose.yml` includes:

1. **PostgreSQL**: Database server
2. **Backend**: FastAPI application
3. **Frontend**: React development server
4. **Redis**: Caching layer (optional)

### Environment Variables for Docker

Edit `.env` file before running `docker-compose up`:

```env
# Database
DB_USER=taskflow_user
DB_PASSWORD=taskflow_password
DB_NAME=taskflow
DB_PORT=5432

# Backend
SECRET_KEY=your-generated-secret-key
ENVIRONMENT=development
DEBUG=true

# Frontend
VITE_API_URL=http://localhost:8000/api/v1

# Ports
BACKEND_PORT=8000
FRONTEND_PORT=5173
```

## Environment Configuration

### .env File Structure

```env
# ==========================================
# BACKEND CONFIGURATION
# ==========================================

# Database
DATABASE_URL=postgresql://taskflow_user:taskflow_password@localhost:5432/taskflow
DB_POOL_SIZE=20
DB_POOL_RECYCLE=3600

# Security
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS
BACKEND_CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]

# Redis (optional)
REDIS_URL=redis://localhost:6379/0

# Environment
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=INFO

# ==========================================
# FRONTEND CONFIGURATION
# ==========================================

VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=TaskFlow

# ==========================================
# OPTIONAL SERVICES
# ==========================================

# Email Configuration
MAIL_FROM_EMAIL=noreply@taskflow.dev
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_USERNAME=
SMTP_PASSWORD=

# AWS/Cloud (if needed)
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_REGION=us-east-1
```

## Database Setup

### Schema Creation

The database schema is automatically created from models. Options:

#### Option 1: Alembic Migrations
```bash
cd backend
alembic upgrade head
```

#### Option 2: Direct ORM Creation
```bash
cd backend
python -c "
from app.core.database import engine
from app.models import Base
Base.metadata.create_all(bind=engine)
"
```

### Initial Data

Create an admin user:

```bash
cd backend
python -c "
from app.core.database import SessionLocal
from app.services.user import UserService
from app.schemas.user import UserCreate

db = SessionLocal()
service = UserService(db)
user = UserCreate(email='admin@example.com', password='changeme', full_name='Admin')
service.create_user(user)
print('Admin user created: admin@example.com')
"
```

### Database Backup

```bash
# Backup
pg_dump taskflow > backup.sql

# Restore
psql taskflow < backup.sql

# With Docker
docker exec taskflow-postgres pg_dump -U taskflow_user taskflow > backup.sql
```

## Verification

### Backend Verification

```bash
# Check API health
curl http://localhost:8000/health

# Check Swagger docs
open http://localhost:8000/docs

# Run tests
cd backend
pytest

# Check code quality
flake8 app
mypy app
black --check app
```

### Frontend Verification

```bash
# Check build
cd frontend
npm run build

# Check linting
npm run lint

# Check types
npm run type-check

# Run tests
npm run test
```

### Database Verification

```bash
# Connect to database
psql -U taskflow_user -d taskflow -h localhost

# Check tables
\dt

# Check connections
SELECT datname, count(*) FROM pg_stat_activity GROUP BY datname;

# Exit
\q
```

## Troubleshooting

### Port Already in Use

```bash
# Find process using port
lsof -i :8000    # macOS/Linux
netstat -ano | findstr :8000    # Windows

# Kill process
kill -9 <PID>    # macOS/Linux
taskkill /PID <PID> /F    # Windows
```

### Database Connection Error

```bash
# Check if PostgreSQL is running
# macOS:
brew services list

# Linux:
sudo systemctl status postgresql

# Docker:
docker ps | grep postgres

# Test connection
psql -U taskflow_user -d taskflow -h localhost
```

### Python Virtual Environment Issues

```bash
# Recreate venv
cd backend
rm -rf venv
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Node Modules Issues

```bash
# Clear cache and reinstall
cd frontend
rm -rf node_modules package-lock.json
npm cache clean --force
npm install
```

### Docker Issues

```bash
# View logs
docker-compose logs backend
docker-compose logs frontend

# Rebuild images
docker-compose build --no-cache

# Reset all containers
docker-compose down -v
docker-compose up --build
```

### Frontend Build Errors

```bash
cd frontend
npm run build -- --debug
npm run lint
npm run type-check
```

### Backend Import Errors

```bash
cd backend
source venv/bin/activate
pip install -r requirements.txt --force-reinstall
python -m pytest --collect-only    # Verify imports
```

## Next Steps

After successful installation:

1. **Read Documentation**: Review [ARCHITECTURE.md](./ARCHITECTURE.md)
2. **Setup IDE**: Configure VS Code/PyCharm with formatters
3. **Create First Task**: Try creating a project and task
4. **Review API**: Check Swagger docs at http://localhost:8000/docs
5. **Read Contributing**: See [CONTRIBUTING.md](./CONTRIBUTING.md)

## Getting Help

- Check [Troubleshooting](#troubleshooting) section
- Review [docs/](./docs/) directory
- Check [GitHub Issues](https://github.com/ca136/taskflow/issues)
- See [README.md](./README.md) for quick reference

## Production Deployment

For production setup, see [DEPLOYMENT.md](./docs/DEPLOYMENT.md)
