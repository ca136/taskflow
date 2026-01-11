# TaskFlow - Quick Start Guide

**Quick reference for getting TaskFlow up and running**

---

## 30-Second Setup

```bash
# Clone the repository
git clone https://github.com/ca136/taskflow.git
cd taskflow

# Copy environment file
cp .env.example .env

# Start everything with Docker Compose
docker-compose up -d

# Done! Access at:
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

---

## Manual Setup (Without Docker)

### Frontend

```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
alembic upgrade head
uvicorn app.main:app --reload
# Runs on http://localhost:8000
```

---

## Common Commands

### Frontend
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
npm test             # Run tests
```

### Backend
```bash
uvicorn app.main:app --reload  # Start dev server
pytest                         # Run tests
alembic upgrade head           # Run migrations
alembic revision --autogenerate -m "message"  # Create migration
```

### Docker
```bash
docker-compose up -d           # Start all services
docker-compose down            # Stop all services
docker-compose logs -f         # View logs
docker-compose ps              # Check service status
```

---

## Environment Variables

Create `.env` file in root (copy from `.env.example`):

```
# Backend
DATABASE_URL=postgresql://taskflow_user:taskflow_password@localhost/taskflow
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
BACKEND_CORS_ORIGINS=["http://localhost:5173"]

# Frontend
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=TaskFlow

# Environment
ENVIRONMENT=development
DEBUG=true
```

---

## Project Structure Overview

```
taskflow/
├── frontend/                  # React + TypeScript
│   ├── src/
│   │   ├── api/             # API client
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components
│   │   ├── store/           # Zustand state
│   │   └── types/           # TypeScript types
│   └── package.json
├── backend/                   # FastAPI + Python
│   ├── app/
│   │   ├── routes/          # API endpoints
│   │   ├── models/          # Database models
│   │   ├── schemas/         # Pydantic schemas
│   │   └── services/        # Business logic
│   └── requirements.txt
├── docs/                      # Documentation
├── .env.example              # Environment template
├── docker-compose.yml        # Local dev stack
└── README.md
```

---

## Accessing Services

| Service | URL | Purpose |
|---------|-----|---------|
| Frontend | http://localhost:5173 | React application |
| Backend API | http://localhost:8000 | FastAPI backend |
| API Docs | http://localhost:8000/docs | Interactive Swagger UI |
| PostgreSQL | localhost:5432 | Database |
| Redis | localhost:6379 | Cache (optional) |

---

## Database

### Create Migration
```bash
cd backend
alembic revision --autogenerate -m "Add new table"
alembic upgrade head
```

### Backup Database
```bash
# Via Docker
docker exec taskflow_postgres pg_dump -U taskflow_user taskflow > backup.sql

# Via psql
pg_dump -U taskflow_user -h localhost taskflow > backup.sql
```

### Restore Database
```bash
psql -U taskflow_user -h localhost taskflow < backup.sql
```

---

## Testing

### Frontend Tests
```bash
cd frontend
npm test                 # Run all tests
npm test -- --ui        # UI test runner
npm test -- --coverage  # Coverage report
```

### Backend Tests
```bash
cd backend
pytest                       # Run all tests
pytest --cov=app            # Coverage report
pytest tests/test_auth.py   # Specific file
pytest -k "test_login"      # Specific function
```

---

## Troubleshooting

### Port Already in Use
```bash
# Find and kill process
lsof -i :5173
kill -9 <PID>
```

### Database Connection Error
```bash
# Check PostgreSQL is running
docker-compose ps postgres

# Restart services
docker-compose down
docker-compose up -d
```

### Module Not Found
```bash
# Frontend
cd frontend && rm -rf node_modules && npm install

# Backend
cd backend && rm -rf venv && python -m venv venv && pip install -r requirements.txt
```

### CORS Issues
Ensure `BACKEND_CORS_ORIGINS` in `.env` includes your frontend URL:
```
BACKEND_CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
```

---

## Technology Stack

**Frontend:**
- React 18, TypeScript, Vite, Tailwind CSS
- React Router, React Query, Zustand, Axios

**Backend:**
- FastAPI, Python 3.11, SQLAlchemy, Pydantic
- PostgreSQL, Redis, JWT Authentication

**Infrastructure:**
- Docker, Docker Compose, GitHub Actions
- pytest (Python), vitest (JavaScript)

---

## Documentation

- **Main README**: `README.md`
- **Setup Instructions**: `docs/SETUP.md`
- **Architecture Guide**: `docs/ARCHITECTURE.md`
- **API Reference**: `docs/API.md`
- **Development Guide**: `docs/development.md`
- **Deployment Guide**: `docs/deployment.md`

---

## Useful Links

- [FastAPI Docs](https://fastapi.tiangolo.com/)
- [React Docs](https://react.dev/)
- [Vite Docs](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [SQLAlchemy](https://www.sqlalchemy.org/)
- [Docker Docs](https://www.docker.com/)

---

## Getting Help

1. Check the documentation files
2. Review existing GitHub issues
3. Check `.env.example` for configuration help
4. Review error messages carefully
5. Check Docker logs: `docker-compose logs -f`

---

## Next Steps

1. **Setup the environment**: Follow 30-second setup above
2. **Explore the code**: Check `frontend/src/` and `backend/app/`
3. **Read documentation**: Start with `README.md` then `docs/`
4. **Start developing**: Create a feature branch and code!

---

**Quick Reference Version**: 1.0
**Last Updated**: 2024
**Status**: Ready to Use
