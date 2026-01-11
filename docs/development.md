# TaskFlow Development Guide

## Development Environment Setup

### Prerequisites

- **Node.js 18+** - Download from [nodejs.org](https://nodejs.org)
- **Python 3.11+** - Download from [python.org](https://www.python.org)
- **Git** - Download from [git-scm.com](https://git-scm.com)
- **PostgreSQL 12+** (optional for local development)
- **Visual Studio Code** or preferred IDE

### Initial Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/ca136/taskflow.git
   cd taskflow
   ```

2. **Create a feature branch:**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Set up frontend:**
   ```bash
   cd frontend
   npm install
   ```

4. **Set up backend:**
   ```bash
   cd ../backend
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

## Frontend Development

### Technology Stack
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint
- **Formatting**: Prettier

### Starting Development Server

```bash
cd frontend
npm run dev
```

The application will be available at `http://localhost:5173`

### Project Structure

```
frontend/
├── public/              # Static files
├── src/
│   ├── components/      # Reusable React components
│   ├── pages/           # Full page components
│   ├── hooks/           # Custom React hooks
│   ├── services/        # API services
│   ├── store/           # Zustand stores
│   ├── types/           # TypeScript definitions
│   ├── styles/          # Global styles
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Root component
│   └── main.tsx         # Entry point
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Run linting
npm run lint

# Fix linting issues
npm run lint:fix

# Type check
npm run type-check

# Format code with Prettier
npm run format

# Check code formatting
npm run format:check
```

### Component Guidelines

#### Creating a Component

```typescript
// src/components/MyComponent.tsx
import React from 'react';

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export const MyComponent: React.FC<MyComponentProps> = ({
  title,
  onAction,
}) => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-bold">{title}</h2>
      {onAction && (
        <button
          onClick={onAction}
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Action
        </button>
      )}
    </div>
  );
};

export default MyComponent;
```

#### Component Best Practices
- Use functional components with hooks
- Always export typed components with `React.FC<Props>`
- Keep components focused and single-responsibility
- Use custom hooks for shared logic
- Separate container and presentation logic
- Memoize components when necessary with `React.memo`

### Styling Guidelines

Use Tailwind CSS classes for styling:

```typescript
// Good - Use Tailwind classes
<div className="flex flex-col gap-4 p-4 bg-white rounded-lg shadow">
  <h1 className="text-2xl font-bold text-gray-900">Title</h1>
  <p className="text-gray-600">Description</p>
</div>

// Avoid - Inline styles
<div style={{ display: 'flex', flexDirection: 'column' }}>
```

### State Management with Zustand

```typescript
// src/store/taskStore.ts
import create from 'zustand';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'in_progress' | 'done';
}

interface TaskStore {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, task: Partial<Task>) => void;
  removeTask: (id: string) => void;
}

export const useTaskStore = create<TaskStore>((set) => ({
  tasks: [],
  addTask: (task) =>
    set((state) => ({
      tasks: [...state.tasks, task],
    })),
  updateTask: (id, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id ? { ...t, ...updates } : t
      ),
    })),
  removeTask: (id) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
}));
```

### Custom Hooks

```typescript
// src/hooks/useFetch.ts
import { useEffect, useState } from 'react';

interface UseFetchResult<T> {
  data: T | null;
  loading: boolean;
  error: Error | null;
}

export const useFetch = <T,>(url: string): UseFetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch');
        const result = await response.json();
        setData(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [url]);

  return { data, loading, error };
};
```

### Testing Components

```typescript
// src/components/__tests__/MyComponent.test.tsx
import { render, screen } from '@testing-library/react';
import { MyComponent } from '../MyComponent';

describe('MyComponent', () => {
  it('renders with title', () => {
    render(<MyComponent title="Test Title" />);
    expect(screen.getByText('Test Title')).toBeInTheDocument();
  });

  it('calls onAction when button is clicked', () => {
    const handleAction = vi.fn();
    render(
      <MyComponent title="Test" onAction={handleAction} />
    );
    screen.getByRole('button').click();
    expect(handleAction).toHaveBeenCalled();
  });
});
```

## Backend Development

### Technology Stack
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT + OAuth2
- **Validation**: Pydantic
- **Testing**: pytest
- **Linting**: flake8, Black
- **API Docs**: Swagger/OpenAPI

### Starting Development Server

```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── endpoints/
│   │   │   ├── auth.py
│   │   │   ├── projects.py
│   │   │   ├── tasks.py
│   │   │   └── users.py
│   │   └── dependencies.py
│   ├── core/
│   │   ├── config.py
│   │   ├── security.py
│   │   └── constants.py
│   ├── models/
│   │   ├── project.py
│   │   ├── task.py
│   │   └── user.py
│   ├── schemas/
│   │   ├── project.py
│   │   ├── task.py
│   │   └── user.py
│   ├── services/
│   │   ├── project_service.py
│   │   ├── task_service.py
│   │   └── user_service.py
│   ├── database.py
│   └── main.py
├── tests/
├── requirements.txt
└── .env.example
```

### Creating an Endpoint

```python
# app/api/endpoints/tasks.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.schemas.task import TaskCreate, TaskUpdate, TaskResponse
from app.models.task import Task
from app.database import get_db
from app.api.dependencies import get_current_user

router = APIRouter(prefix="/tasks", tags=["tasks"])

@router.get("/{task_id}", response_model=TaskResponse)
async def get_task(
    task_id: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = db.query(Task).filter(Task.id == task_id).first()
    if not task:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Task not found",
        )
    return task

@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
async def create_task(
    task_in: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    task = Task(**task_in.dict(), creator_id=current_user.id)
    db.add(task)
    db.commit()
    db.refresh(task)
    return task
```

### Creating a Database Model

```python
# app/models/task.py
from sqlalchemy import Column, String, DateTime, ForeignKey, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import uuid

from app.database import Base

class Task(Base):
    __tablename__ = "tasks"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    title = Column(String, nullable=False)
    description = Column(String)
    status = Column(String, default="todo")
    priority = Column(String, default="medium")
    project_id = Column(String, ForeignKey("projects.id"), nullable=False)
    assignee_id = Column(String, ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    project = relationship("Project", back_populates="tasks")
    assignee = relationship("User", back_populates="assigned_tasks")
```

### Creating a Pydantic Schema

```python
# app/schemas/task.py
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime

class TaskCreate(BaseModel):
    title: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = None
    priority: str = Field(default="medium")
    status: str = Field(default="todo")
    project_id: str
    assignee_id: Optional[str] = None

class TaskUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    status: Optional[str] = None
    assignee_id: Optional[str] = None

class TaskResponse(BaseModel):
    id: str
    title: str
    description: Optional[str]
    status: str
    priority: str
    project_id: str
    assignee_id: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
```

### Testing Endpoints

```python
# tests/test_tasks.py
import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.database import get_db

client = TestClient(app)

@pytest.fixture
def auth_headers(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "test@example.com", "password": "password"}
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_get_task(auth_headers):
    response = client.get("/api/tasks/123", headers=auth_headers)
    assert response.status_code == 200

def test_create_task(auth_headers):
    task_data = {
        "title": "New Task",
        "project_id": "project-123",
        "priority": "high"
    }
    response = client.post(
        "/api/tasks",
        json=task_data,
        headers=auth_headers
    )
    assert response.status_code == 201
    assert response.json()["title"] == "New Task"
```

### Available Backend Scripts

```bash
# Run development server
uvicorn app.main:app --reload

# Run tests
pytest

# Run tests with coverage
pytest --cov=app

# Lint code
flake8 app

# Format code
black app

# Check types
mypy app

# Run database migrations
alembic upgrade head

# Create migration
alembic revision --autogenerate -m "description"
```

## Database Setup

### Local PostgreSQL Setup

```bash
# Create database
createdb taskflow_dev

# Connect to database
psql taskflow_dev

# Run migrations
cd backend
alembic upgrade head
```

### Environment Variables

Create `.env` file in backend directory:

```env
DATABASE_URL=postgresql://user:password@localhost/taskflow_dev
SECRET_KEY=your-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Git Workflow

### Creating a Feature Branch

```bash
git checkout -b feature/add-task-comments
```

### Commit Messages

Follow conventional commits format:

```
feat: add task comments feature
fix: resolve kanban board layout issue
docs: update API documentation
refactor: simplify task service logic
test: add tests for user authentication
```

### Making a Pull Request

1. Push your branch: `git push origin feature/your-feature`
2. Create PR on GitHub
3. Fill in PR template
4. Ensure CI checks pass
5. Request review from team members
6. Address feedback and update PR
7. Merge when approved

## Code Quality Standards

### Frontend

- Use TypeScript for type safety
- Follow ESLint rules
- Maintain 80%+ test coverage
- Format code with Prettier
- Use semantic HTML
- Ensure accessibility (a11y)

### Backend

- Follow PEP 8 style guide
- Use type hints for all functions
- Maintain 80%+ test coverage
- Write clear docstrings
- Use meaningful variable names
- Validate all inputs with Pydantic

## Debugging

### Frontend Debugging

```bash
# Run dev server with debug logs
DEBUG=* npm run dev

# Open DevTools in browser
F12 or Cmd+Option+I

# Use React DevTools extension
# Install from https://react-devtools-tutorial.vercel.app/
```

### Backend Debugging

```python
# Add print statements (works with uvicorn reload)
import logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)
logger.debug(f"Variable value: {value}")

# Use pdb debugger
import pdb; pdb.set_trace()

# Print to see values
print(f"Debug: {variable}")
```

## Performance Optimization

### Frontend
- Code splitting with dynamic imports
- Image optimization
- Remove unused dependencies
- Memoize expensive computations
- Use virtualization for long lists

### Backend
- Add database indexes
- Use query pagination
- Cache frequently accessed data
- Use async/await for I/O operations
- Profile code with cProfile

## Documentation

### Code Documentation

Write clear docstrings:

```python
def create_task(task_data: TaskCreate) -> Task:
    """
    Create a new task in the database.
    
    Args:
        task_data: Task creation schema with required fields
        
    Returns:
        Created task with generated ID
        
    Raises:
        ValueError: If project doesn't exist
    """
```

### Component Documentation

Write component stories with Storybook:

```typescript
// MyComponent.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { MyComponent } from './MyComponent';

const meta = {
  component: MyComponent,
} satisfies Meta<typeof MyComponent>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Default Title',
  },
};
```

## Common Issues and Solutions

### Issue: Port 5173 already in use
```bash
# Kill process on port 5173
lsof -ti:5173 | xargs kill -9
```

### Issue: Database connection refused
```bash
# Check PostgreSQL is running
pg_isready -h localhost -p 5432

# Start PostgreSQL
brew services start postgresql  # macOS
```

### Issue: Module not found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

---

For more information, see:
- [Architecture Guide](architecture.md)
- [API Reference](api.md)
- [Deployment Guide](deployment.md)
