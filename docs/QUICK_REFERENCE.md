# TaskFlow Quick Reference Guide

Fast lookup guide for common tasks and commands. Keep this open while developing.

## Table of Contents

1. [Environment Setup](#environment-setup)
2. [Starting Development](#starting-development)
3. [Common Commands](#common-commands)
4. [Git Workflow](#git-workflow)
5. [Frontend Development](#frontend-development)
6. [Backend Development](#backend-development)
7. [Database Operations](#database-operations)
8. [Testing](#testing)
9. [Troubleshooting](#troubleshooting)
10. [Documentation Resources](#documentation-resources)

---

## Environment Setup

### One-Time Setup

```bash
# Clone and navigate
git clone https://github.com/ca136/taskflow.git
cd taskflow

# Backend
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
cd ..

# Frontend
cd frontend
npm install
cp .env.example .env.local
cd ..

# Database
createdb taskflow_db  # If PostgreSQL installed
```

### Environment Files Quick Reference

**backend/.env:**
```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/taskflow_db
SECRET_KEY=dev-key-change-in-production
ENVIRONMENT=development
DEBUG=True
```

**frontend/.env.local:**
```bash
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=TaskFlow
```

---

## Starting Development

### Option 1: Local Development (Recommended for coding)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload
# http://localhost:8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
# http://localhost:5173
```

**Terminal 3 (optional) - Database:**
```bash
psql taskflow_db
```

### Option 2: Docker Compose (Recommended for testing)

```bash
# One command starts everything
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all
docker-compose down
```

**Ports:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- DB: localhost:5432
- Docs: http://localhost:8000/docs

---

## Common Commands

### Start/Stop Development

```bash
# Start backend
cd backend && source venv/bin/activate && uvicorn app.main:app --reload

# Start frontend
cd frontend && npm run dev

# Start with Docker
docker-compose up -d

# Stop Docker services
docker-compose down

# View Docker logs
docker-compose logs -f backend
```

### Code Quality

```bash
# Backend
cd backend
black .                          # Format code
flake8 .                         # Lint
mypy app --ignore-missing-imports  # Type check
pytest                           # Test

# Frontend
cd frontend
npm run lint                     # ESLint
npm run format                   # Prettier
npm run type-check              # TypeScript
npm test                        # Jest/Vitest
```

### Build for Production

```bash
# Frontend
cd frontend
npm run build          # Creates dist/

# Backend
cd backend
# Docker: docker build -t taskflow-backend .
```

---

## Git Workflow

### Creating a Feature

```bash
# Update main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/my-feature

# Make changes, commit, push
git add .
git commit -m "feat: description of change"
git push origin feature/my-feature

# Create PR on GitHub
```

### Commit Message Format

```bash
feat:     New feature
fix:      Bug fix
docs:     Documentation
test:     Tests
refactor: Refactoring code
style:    Code style (formatting)
chore:    Dependencies, config

# Example
git commit -m "feat(auth): add password reset endpoint"
git commit -m "fix(tasks): resolve drag-drop issue"
git commit -m "docs: update API reference"
```

### Syncing with Main

```bash
git fetch origin
git rebase origin/main  # Or git merge if unsure
git push origin feature/my-feature --force-with-lease
```

---

## Frontend Development

### Project Structure Quick Map

```
src/
├── components/        # Reusable UI components
│   ├── common/       # Buttons, modals, etc
│   └── features/     # Feature-specific components
├── pages/            # Page components (routes)
├── hooks/            # Custom React hooks
├── services/         # API calls, utilities
├── store/            # Zustand state management
└── styles/           # Global styles, Tailwind config
```

### Common Frontend Tasks

```bash
cd frontend

# Development server with hot reload
npm run dev

# Type checking
npm run type-check

# Format & lint code
npm run lint
npm run format

# Run tests
npm test
npm run coverage

# Build for production
npm run build

# Preview production build
npm run preview
```

### Adding a New Component

```typescript
// src/components/MyComponent.tsx
import { FC } from 'react';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

const MyComponent: FC<MyComponentProps> = ({ title, onAction }) => {
  return (
    <div className="p-4">
      <h2 className="text-xl font-bold">{title}</h2>
      {onAction && (
        <button onClick={onAction} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
          Action
        </button>
      )}
    </div>
  );
};

export default MyComponent;
```

### Using React Query

```typescript
import { useQuery, useMutation } from '@tanstack/react-query';

// Fetch data
const { data, isLoading, error } = useQuery({
  queryKey: ['projects'],
  queryFn: () => api.get('/projects'),
});

// Mutate data
const { mutate } = useMutation({
  mutationFn: (data) => api.post('/projects', data),
  onSuccess: () => queryClient.invalidateQueries({ queryKey: ['projects'] }),
});
```

### Using Zustand

```typescript
import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  logout: () => set({ user: null }),
}));

// Usage in component
const { user, logout } = useAuthStore();
```

---

## Backend Development

### Project Structure Quick Map

```
app/
├── api/
│   ├── endpoints/    # Route handlers
│   ├── dependencies.py  # Dependency injection
│   └── router.py     # Route registration
├── models/           # SQLAlchemy ORM models
├── schemas/          # Pydantic validation
├── services/         # Business logic
├── core/             # Config, security, constants
└── db/               # Database utilities
```

### Common Backend Tasks

```bash
cd backend
source venv/bin/activate

# Development server with hot reload
uvicorn app.main:app --reload

# Run tests
pytest
pytest --cov=app  # With coverage
pytest -v  # Verbose

# Code quality
black .                              # Format
flake8 .                            # Lint
mypy app --ignore-missing-imports   # Type check
```

### Adding a New Endpoint

**1. Create schema** (`schemas/mymodel.py`):
```python
from pydantic import BaseModel

class MyModelCreate(BaseModel):
    name: str
    
class MyModelSchema(MyModelCreate):
    id: int
    class Config:
        from_attributes = True
```

**2. Create model** (`models/mymodel.py`):
```python
from sqlalchemy import Column, Integer, String
from app.db.base import Base

class MyModel(Base):
    __tablename__ = "mymodels"
    id = Column(Integer, primary_key=True)
    name = Column(String, nullable=False)
```

**3. Create service** (`services/mymodel_service.py`):
```python
from sqlalchemy.orm import Session

class MyModelService:
    @staticmethod
    async def create(db: Session, obj_in: MyModelCreate) -> MyModel:
        db_obj = MyModel(**obj_in.dict())
        db.add(db_obj)
        db.commit()
        db.refresh(db_obj)
        return db_obj
```

**4. Create endpoint** (`api/endpoints/mymodel.py`):
```python
from fastapi import APIRouter, Depends
from app.api.dependencies import get_db

router = APIRouter(prefix="/api/v1/mymodels", tags=["MyModels"])

@router.post("/", response_model=MyModelSchema)
async def create(obj_in: MyModelCreate, db: Session = Depends(get_db)):
    return await MyModelService.create(db, obj_in)
```

**5. Register route** (`api/router.py`):
```python
from app.api.endpoints import mymodel
api_router.include_router(mymodel.router)
```

### Testing an Endpoint

```python
# tests/api/test_mymodel.py
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_create_mymodel():
    response = client.post(
        "/api/v1/mymodels/",
        json={"name": "Test"}
    )
    assert response.status_code == 201
    assert response.json()["name"] == "Test"
```

---

## Database Operations

### Migrations

```bash
cd backend
source venv/bin/activate

# Create migration
alembic revision --autogenerate -m "Add user table"

# Apply migrations
alembic upgrade head

# Revert one migration
alembic downgrade -1

# View migration history
alembic history
```

### Database Queries

```bash
# Connect to database
psql taskflow_db

# Common queries
\dt                  # List tables
\d users             # Describe table
SELECT * FROM users; # Query table
\q                   # Exit
```

### Reset Database

```bash
cd backend
source venv/bin/activate

# Drop all and restart
alembic downgrade base
alembic upgrade head

# Or manually
dropdb taskflow_db
createdb taskflow_db
alembic upgrade head
```

---

## Testing

### Frontend Testing

```bash
cd frontend

# Run all tests
npm test

# Watch mode
npm test -- --watch

# Coverage
npm run coverage

# Specific test file
npm test -- tasks.test.ts
```

### Backend Testing

```bash
cd backend
source venv/bin/activate

# All tests
pytest

# Specific file
pytest tests/api/test_projects.py

# Specific test
pytest tests/api/test_projects.py::test_create_project

# Verbose
pytest -v

# With coverage
pytest --cov=app --cov-report=html
```

### Test Template

```python
# Backend
import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

@pytest.fixture
def sample_user(db):
    return UserFactory.create()

def test_list_projects(sample_user):
    response = client.get("/api/v1/projects/")
    assert response.status_code == 200
```

```typescript
// Frontend
import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    render(<MyComponent title="Test" />);
    expect(screen.getByText('Test')).toBeDefined();
  });
});
```

---

## Troubleshooting

### Backend Won't Start

```bash
# Check Python version
python3 --version

# Activate virtual environment
source venv/bin/activate

# Reinstall dependencies
pip install -r requirements.txt

# Check database connection
psql taskflow_db

# Check port 8000 is free
lsof -i :8000
```

### Frontend Won't Start

```bash
# Check Node version
node --version

# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check port 5173 is free
lsof -i :5173

# Check .env.local exists
cat .env.local
```

### Database Connection Failed

```bash
# Check PostgreSQL is running
sudo service postgresql status

# Test connection
psql -U postgres

# Check DATABASE_URL in .env
cat backend/.env | grep DATABASE_URL

# View PostgreSQL logs
sudo tail -f /var/log/postgresql/postgresql.log
```

### Migrations Failed

```bash
cd backend
source venv/bin/activate

# Check migration status
alembic current

# View history
alembic history

# Revert and retry
alembic downgrade -1
alembic upgrade head
```

### Docker Issues

```bash
# Clean up everything
docker-compose down -v
docker system prune -a

# Rebuild images
docker-compose build --no-cache

# Start fresh
docker-compose up -d
```

### Module Not Found

```bash
# Backend
cd backend
source venv/bin/activate
pip install -r requirements.txt

# Frontend
cd frontend
npm install
```

---

## Documentation Resources

### Quick Links

| Resource | URL |
|----------|-----|
| **Root README** | [README.md](../README.md) |
| **System Architecture** | [docs/SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) |
| **API Reference** | [docs/API_REFERENCE.md](./API_REFERENCE.md) |
| **Setup & Deployment** | [docs/SETUP_DEPLOYMENT.md](./SETUP_DEPLOYMENT.md) |
| **Backend Dev Guide** | [backend/README.md](../backend/README.md) |
| **Frontend Dev Guide** | [frontend/README.md](../frontend/README.md) |
| **Contributing** | [CONTRIBUTING.md](../CONTRIBUTING.md) |

### External Documentation

- **React**: https://react.dev
- **FastAPI**: https://fastapi.tiangolo.com
- **PostgreSQL**: https://www.postgresql.org/docs/
- **Tailwind CSS**: https://tailwindcss.com/docs
- **TypeScript**: https://www.typescriptlang.org/docs/
- **SQLAlchemy**: https://docs.sqlalchemy.org/
- **Pydantic**: https://docs.pydantic.dev/

### API Documentation

**Interactive API Docs:**
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

**API Reference:**
- See [docs/API_REFERENCE.md](./API_REFERENCE.md) for detailed endpoints

---

## Keyboard Shortcuts

### VS Code

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+P` | Command palette |
| `Ctrl+/` | Toggle comment |
| `Alt+Up/Down` | Move line up/down |
| `Ctrl+D` | Select word (multi-select) |
| `Ctrl+Shift+L` | Select all occurrences |
| `F2` | Rename symbol |
| `Ctrl+Shift+F` | Find in files |

### Git

```bash
# View status
git status

# Stage changes
git add .

# Commit
git commit -m "message"

# Push
git push

# Pull
git pull

# View log
git log --oneline -10
```

---

## Performance Tips

### Frontend
- Use `memo()` for expensive components
- Lazy load routes with `lazy()` and `Suspense`
- Use React Query for caching
- Profile with React DevTools

### Backend
- Add database indexes on foreign keys
- Use `async/await` properly
- Cache with Redis
- Profile with cProfile

### Database
- Use EXPLAIN ANALYZE
- Run VACUUM ANALYZE regularly
- Monitor slow queries
- Optimize N+1 queries with eager loading

---

## Quick Checklist Before PR

```bash
# Backend
cd backend
source venv/bin/activate
pytest
black . && flake8 . && mypy app --ignore-missing-imports
git add .

# Frontend
cd frontend
npm test
npm run lint
npm run type-check
npm run build  # Verify builds
git add .

# Git
git commit -m "[TYPE] description"
git push origin feature/branch-name

# Create PR on GitHub with:
# - Clear title
# - Description of changes
# - Link to related issues
```

---

**Last Updated**: January 2024  
**Keep this guide nearby while developing!**
