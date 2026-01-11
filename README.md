# TaskFlow 🚀

**TaskFlow** is a lightweight, full-stack kanban project management application designed for small teams. It enables intuitive task and project management with a focus on simplicity, efficiency, and a delightful user experience.

[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)]()
[![License](https://img.shields.io/badge/license-MIT-blue)](./LICENSE)
[![Node.js](https://img.shields.io/badge/node-%3E%3D18.0-green)]()
[![Python](https://img.shields.io/badge/python-%3E%3D3.9-blue)]()

---

## ✨ Features

- **📋 Kanban Board**: Visual task management with drag-and-drop support
- **👥 Team Collaboration**: Share projects and assign tasks to team members
- **⚡ Real-time Updates**: Instant synchronization across all clients
- **🔐 Secure Authentication**: JWT-based auth with role-based access control
- **🎨 Modern UI**: Clean, responsive design built with React and Tailwind CSS
- **📊 Task Management**: Create, organize, and track tasks with priorities and labels
- **📚 RESTful API**: Comprehensive API with Swagger documentation
- **🐘 PostgreSQL Database**: Robust, scalable data persistence
- **🐳 Docker Support**: Easy deployment with Docker Compose

---

## 🏗️ Architecture Overview

TaskFlow follows a **modern full-stack architecture** with clear separation of concerns:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    Frontend (React)                     │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ Pages → Components → Hooks → Store → Services   │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────┬──────────────────────────────────────┘
                       │ REST API (JSON)
┌──────────────────────┴──────────────────────────────────────────────────┐
│                  Backend (FastAPI)                      │
│  ┌──────────────────────────────────────────────────────────────────┐   │
│  │ Routes → Services → Models → Database           │   │
│  └──────────────────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────────────────┘
                       │ ORM (SQLAlchemy)
┌──────────────────────┴──────────────────────────────────────────────────┐
│                  PostgreSQL Database                    │
│  (Users, Projects, Tasks, Boards, Members)             │
└──────────────────────────────────────────────────────────────────────────┘
```

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React + TypeScript | 18.3.1 |
| | Vite (Build Tool) | 5.4.2 |
| | Tailwind CSS | 3.4.3 |
| | React Query | 5.50.1 |
| | Zustand | 4.5.2 |
| **Backend** | FastAPI | 0.115.0 |
| | Python | 3.11+ |
| | SQLAlchemy ORM | 2.0+ |
| | Pydantic | 2.0+ |
| | Alembic Migrations | 1.13+ |
| **Database** | PostgreSQL | 12+ |
| **Infrastructure** | Docker | Latest |

---

## 🚀 Quick Start

### Prerequisites
- **Node.js** 18.0+ and **npm** 9.0+
- **Python** 3.11+ and **pip**
- **PostgreSQL** 12+ (or use SQLite for development)
- **Git**

### Environment Configuration

Both frontend and backend require environment variables. Templates are provided:

#### Frontend Setup
```bash
cd frontend
cp .env.example .env.local
# Edit .env.local with your settings
```

**Frontend Environment Variables** (`.env.local`):
- `VITE_API_URL` - Backend API base URL (default: `http://localhost:8000/api/v1`)

#### Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your settings
```

**Backend Environment Variables** (`.env`):
- `DATABASE_URL` - PostgreSQL connection string (required)
- `SECRET_KEY` - JWT secret key for token signing (must be secure in production)
- `ACCESS_TOKEN_EXPIRE_MINUTES` - JWT access token expiration (default: 30)
- `REFRESH_TOKEN_EXPIRE_DAYS` - Refresh token expiration (default: 7)
- `CORS_ORIGINS` - Comma-separated list of allowed frontend origins

**Important:** 
- ⚠️ Never commit `.env` or `.env.local` files to version control
- 🔐 Change `SECRET_KEY` to a secure random string in production
- 📝 Refer to `.env.example` files for all available configuration options

### Option 1: Development Setup (Local)

#### Frontend
```bash
cd frontend
npm install
cp .env.example .env.local
npm run dev
# Opens at http://localhost:5173
```

#### Backend
```bash
cd backend
python -m venv venv
source venv/bin/activate  # or `venv\Scripts\activate` on Windows
pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --reload --port 8000
# Opens at http://localhost:8000
```

### Option 2: Docker Compose (One Command)

```bash
docker-compose up --build
```

This starts:
- **Frontend**: http://localhost:3000 (or 5173)
- **Backend**: http://localhost:8000
- **PostgreSQL**: localhost:5432
- **API Docs**: http://localhost:8000/docs

---

## 📚 Documentation

### Core Documentation
- **[Architecture Guide](./docs/ARCHITECTURE.md)** - System design, data models, design patterns
- **[API Reference](./docs/API.md)** - Complete REST API endpoints and examples
- **[Setup Guide](./docs/SETUP.md)** - Detailed installation and configuration
- **[Development Guide](./docs/development.md)** - Contributing code and best practices
- **[Deployment Guide](./docs/deployment.md)** - Production deployment steps
- **[Contributing Guide](./CONTRIBUTING.md)** - Contribution guidelines and code standards

### Module-Specific Documentation
- **[Frontend README](./frontend/README.md)** - React setup, component development, styling
- **[Backend README](./backend/README.md)** - FastAPI setup, API development, testing

---

## 📋 Project Structure

```
taskflow/
├── frontend/                    # React TypeScript application
│   ├── src/
│   │   ├── components/          # Reusable UI components
│   │   ├── pages/               # Page components (routing)
│   │   ├── hooks/               # Custom React hooks
│   │   ├── store/               # Zustand state management
│   │   ├── services/            # API client services
│   │   ├── types/               # TypeScript type definitions
│   │   ├── utils/               # Utility functions
│   │   ├── App.tsx              # Root component
│   │   └── main.tsx             # Entry point
│   ├── .env.example             # Environment template (copy to .env.local)
│   ├── package.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   └── tsconfig.json
│
├── backend/                     # FastAPI application
│   ├── app/
│   │   ├── api/                 # API endpoints
│   │   ├── core/                # Config, security, constants
│   │   ├── models/              # SQLAlchemy models
│   │   ├── schemas/             # Pydantic schemas
│   │   ├── services/            # Business logic
│   │   ├── db/                  # Database utilities
│   │   └── main.py              # FastAPI app
│   ├── tests/                   # Test suite
│   ├── migrations/              # Alembic migrations
│   ├── .env.example             # Environment template (copy to .env)
│   ├── requirements.txt
│   ├── pyproject.toml
│   └── pytest.ini
│
├── docs/                        # Documentation
│   ├── ARCHITECTURE.md
│   ├── API.md
│   ├── SETUP.md
│   ├── development.md
│   └── deployment.md
│
├── docker-compose.yml           # Multi-container setup
├── Dockerfile                   # Backend container
├── frontend.Dockerfile          # Frontend container
└── README.md                    # This file
```

---

## 🔌 API Endpoints

### Authentication
```
POST   /api/v1/auth/register    Create new user account
POST   /api/v1/auth/login       Login and get access token
POST   /api/v1/auth/refresh     Refresh access token
GET    /api/v1/auth/logout      Logout
```

### Projects
```
GET    /api/v1/projects         List all user projects
POST   /api/v1/projects         Create new project
GET    /api/v1/projects/{id}    Get project details
PUT    /api/v1/projects/{id}    Update project
DELETE /api/v1/projects/{id}    Delete project
```

### Tasks
```
GET    /api/v1/projects/{pid}/tasks        List project tasks
POST   /api/v1/projects/{pid}/tasks        Create new task
GET    /api/v1/tasks/{id}                  Get task details
PUT    /api/v1/tasks/{id}                  Update task
PATCH  /api/v1/tasks/{id}/status           Update task status
DELETE /api/v1/tasks/{id}                  Delete task
```

### Users
```
GET    /api/v1/users/me         Get current user
PUT    /api/v1/users/me         Update user profile
GET    /api/v1/users/{id}       Get user by ID
```

📖 **Full API documentation available at** `http://localhost:8000/docs` (Swagger UI)

---

## 🛠️ Development

### Running Tests

**Frontend:**
```bash
cd frontend
npm test                # Run all tests
npm run type-check      # TypeScript type checking
npm run lint            # ESLint
```

**Backend:**
```bash
cd backend
pytest                  # Run all tests
pytest --cov=app        # With coverage report
pytest -v               # Verbose output
```

### Code Quality

**Frontend:**
```bash
npm run lint            # ESLint
npm run format          # Prettier (format code)
npm run type-check      # TypeScript check
```

**Backend:**
```bash
black .                 # Format with Black
flake8 .                # Lint with Flake8
mypy app --ignore-missing-imports  # Type checking
bandit -r app           # Security checks
```

### Database Migrations

```bash
cd backend

# Create new migration
alembic revision --autogenerate -m "Add new feature"

# Apply pending migrations
alembic upgrade head

# Revert one migration
alembic downgrade -1

# View migration history
alembic history
```

---

## 🐳 Docker Deployment

### Build Images
```bash
# Build all containers
docker-compose build

# Build specific service
docker-compose build backend
docker-compose build frontend
```

### Run Containers
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

---

## 🔐 Security

TaskFlow implements industry-standard security practices:

- **🔑 JWT Authentication** - Stateless token-based auth with expiration
- **🛡️ Password Hashing** - Bcrypt with salt for password security
- **🚫 CORS Protection** - Configurable cross-origin resource sharing
- **✅ Input Validation** - Pydantic validation on all API inputs
- **🔒 SQL Injection Prevention** - SQLAlchemy ORM prevents SQL attacks
- **📝 Environment Variables** - Secrets managed via environment, never in code
- **🔐 HTTPS Ready** - SSL/TLS support for production

---

## 📊 Database Schema

### Users Table
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

### Projects Table
```sql
CREATE TABLE projects (
    id SERIAL PRIMARY KEY,
    owner_id INTEGER NOT NULL REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

### Tasks Table
```sql
CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    project_id INTEGER NOT NULL REFERENCES projects(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'todo',
    priority VARCHAR(50) DEFAULT 'medium',
    assignee_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);
```

📖 See [ARCHITECTURE.md](./docs/ARCHITECTURE.md) for complete schema documentation.

---

## 🤝 Contributing

We welcome contributions from the community! Please read our [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on:

- 🔀 Branching strategy
- 📝 Commit conventions
- ✅ Code quality standards
- 🧪 Testing requirements
- 🎯 Pull request process

### Quick Contribution Steps

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m '[feat] Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](./LICENSE) file for details.

MIT License includes:
- ✅ Commercial use
- ✅ Modification
- ✅ Distribution
- ✅ Private use
- ⚠️ License and copyright notice required

---

## 🗺️ Roadmap

### Phase 1: Core (✅ Complete)
- ✅ User authentication and authorization
- ✅ Project creation and management
- ✅ Kanban board with drag-and-drop
- ✅ Task creation and assignment
- ✅ REST API with Swagger documentation

### Phase 2: Enhancement (🔄 In Progress)
- 🔄 Real-time collaboration (WebSockets)
- 🔄 Task templates and automation
- 🔄 Advanced filtering and search
- 🔄 Activity logs and audit trails

### Phase 3: Advanced (📋 Planned)
- 📋 Team collaboration features
- 📋 Integration with external services (GitHub, Slack)
- 📋 Mobile app (React Native)
- 📋 Analytics and reporting
- 📋 Custom workflows and automation

---

## 🆘 Support & Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Frontend on different port
cd frontend && npm run dev -- --port 5174

# Backend on different port
cd backend && uvicorn app.main:app --reload --port 8001
```

**Database connection error:**
```bash
# Check PostgreSQL is running
psql -U postgres  # Should connect

# Verify DATABASE_URL in .env
echo $DATABASE_URL  # Should show valid connection string
```

**Dependencies installation fails:**
```bash
# Clear and reinstall
rm -rf node_modules package-lock.json
npm install

# Or for backend
rm -rf venv
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

### Resources
- 📖 [Full Documentation](./docs/)
- 🐛 [Issues & Bugs](https://github.com/ca136/taskflow/issues)
- 💬 [Discussions](https://github.com/ca136/taskflow/discussions)

---

## 👥 Team

TaskFlow is maintained by the development team. See [CONTRIBUTING.md](./CONTRIBUTING.md) for ways to get involved.

---

## 📞 Contact

- 📧 Email: support@taskflow.dev
- 💬 GitHub Issues: [Report a bug](https://github.com/ca136/taskflow/issues)
- 🌐 Website: https://taskflow.dev

---

## 🎉 Acknowledgments

TaskFlow is built on excellent open-source projects:
- [React](https://react.dev)
- [FastAPI](https://fastapi.tiangolo.com)
- [SQLAlchemy](https://www.sqlalchemy.org)
- [Tailwind CSS](https://tailwindcss.com)
- [PostgreSQL](https://www.postgresql.org)

---

**Made with ❤️ for efficient project management**
