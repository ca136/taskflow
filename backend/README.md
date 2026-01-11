# TaskFlow Backend

FastAPI + Python async web application for TaskFlow project management.

## Quick Start

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows

# Install dependencies
pip install -r requirements.txt

# Configure environment
cp .env.example .env

# Run migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload --port 8000
```

## Development

The backend is built with:
- **FastAPI**: Modern Python web framework
- **SQLAlchemy**: ORM for database operations
- **Pydantic**: Data validation
- **Alembic**: Database migrations
- **Pytest**: Testing framework
- **PostgreSQL**: Database

## Directory Structure

```
app/
├── api/
│   ├── endpoints/      # API route handlers
│   ├── dependencies.py # Shared dependencies
│   └── router.py       # Route registration
├── core/
│   ├── config.py       # Settings/configuration
│   ├── security.py     # Authentication/security
│   └── constants.py    # Application constants
├── models/             # SQLAlchemy database models
├── schemas/            # Pydantic validation schemas
├── services/           # Business logic layer
├── db/
│   ├── session.py      # Database session management
│   └── base.py         # Base model class
└── main.py             # FastAPI application

tests/                  # Unit and integration tests
migrations/             # Alembic database migrations
```

## Environment Variables

### Setup

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update variables as needed for your environment.

### Configuration Variables

#### Database
- `DATABASE_URL` - PostgreSQL connection string
  - Format: `postgresql://username:password@host:port/database`
  - Example: `postgresql://taskflow_user:taskflow_password@localhost:5432/taskflow`

#### Security
- `SECRET_KEY` - Secret key for JWT token signing (generate a strong random key for production)
- `JWT_ALGORITHM` - Algorithm for JWT tokens (default: `HS256`)
- `JWT_EXPIRATION_HOURS` - JWT token expiration time in hours (default: `24`)

#### Development
- `DEBUG` - Enable debug mode (default: `true`)
- `LOG_LEVEL` - Logging level (default: `INFO`)
- `ENVIRONMENT` - Environment name: `development`, `staging`, or `production`

#### CORS
- `CORS_ORIGINS` - Comma-separated list of allowed origins for CORS
  - Example: `http://localhost:5173,http://localhost:3000`

#### Server
- `SERVER_HOST` - Host to bind to (default: `0.0.0.0`)
- `SERVER_PORT` - Port to run on (default: `8000`)

### Loading Environment Variables

The backend uses Pydantic's `BaseSettings` to load environment variables from `.env` file:

```python
from app.core.config import settings

# Access variables
database_url = settings.DATABASE_URL
secret_key = settings.SECRET_KEY
```

## API Documentation

Once the server is running:
- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc

## Testing

```bash
# Run all tests
pytest

# Run with coverage
pytest --cov=app

# Run specific test file
pytest tests/api/test_projects.py

# Run in verbose mode
pytest -v
```

## Code Quality

```bash
# Format code
black .

# Lint code
flake8 .

# Type checking
mypy app --ignore-missing-imports

# Security checks
bandit -r app
```

## Database Migrations

```bash
# Create new migration
alembic revision --autogenerate -m "Add new table"

# Apply migrations
alembic upgrade head

# Revert one migration
alembic downgrade -1
```

## Architecture

See [ARCHITECTURE.md](../ARCHITECTURE.md) for detailed backend architecture information.

## Setup Instructions

See [SETUP.md](../SETUP.md#backend-setup) for detailed setup instructions.

## API Endpoints

See API documentation at `/docs` when server is running.

Main endpoints include:
- `/api/v1/auth/` - Authentication
- `/api/v1/projects/` - Project management
- `/api/v1/tasks/` - Task management
- `/api/v1/users/` - User management
