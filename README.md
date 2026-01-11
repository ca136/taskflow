# TaskFlow - Project Management Application

A lightweight, full-stack project management application designed for small teams. TaskFlow provides a modern kanban-style interface for organizing tasks and collaborating on projects.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
- [Development](#development)
- [Architecture](#architecture)
- [Documentation](#documentation)

## 🎯 Overview

TaskFlow is a modern project management tool built with a focus on simplicity and collaboration. It provides an intuitive kanban board interface for managing tasks across different project stages, allowing teams to visualize workflow and track progress effectively.

### Key Characteristics
- **Lightweight**: Minimal dependencies and fast performance
- **Team-focused**: Real-time collaboration features
- **Modern UI**: Clean, responsive interface built with React
- **Scalable**: Microservices-ready backend architecture
- **Type-safe**: Full TypeScript support throughout the stack

## ✨ Features

### Current Features
- Kanban board interface with drag-and-drop task management
- Project and task creation/editing
- User authentication and authorization
- Real-time task status updates
- Team collaboration workspace

### Planned Features
- Task comments and attachments
- Notification system
- Advanced filtering and search
- Custom workflow stages
- Analytics and reporting
- Mobile app support

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Data Fetching**: React Query
- **UI Components**: Custom components + Radix UI
- **Testing**: Vitest + React Testing Library

### Backend
- **Framework**: FastAPI
- **Language**: Python 3.11+
- **Database**: PostgreSQL
- **ORM**: SQLAlchemy
- **Authentication**: JWT + OAuth2
- **Validation**: Pydantic
- **Testing**: pytest
- **API Documentation**: OpenAPI/Swagger

## 📁 Project Structure

```
taskflow/
├── frontend/                    # React + TypeScript + Vite application
│   ├── public/
│   ├── src/
│   │   ├── components/         # Reusable React components
│   │   │   ├── common/         # Common components (Button, Modal, etc.)
│   │   │   ├── layout/         # Layout components
│   │   │   ├── kanban/         # Kanban board components
│   │   │   └── task/           # Task-related components
│   │   ├── pages/              # Page components (Board, Projects, etc.)
│   │   ├── hooks/              # Custom React hooks
│   │   ├── services/           # API client and services
│   │   ├── store/              # Zustand state management
│   │   ├── types/              # TypeScript type definitions
│   │   ├── styles/             # Global styles
│   │   ├── utils/              # Utility functions
│   │   ├── App.tsx             # Root component
│   │   └── main.tsx            # Entry point
│   ├── package.json
│   └── vite.config.ts
│
├── backend/                     # FastAPI Python application
│   ├── app/
│   │   ├── api/                # API routes
│   │   │   ├── endpoints/      # Endpoint handlers
│   │   │   └── dependencies.py # Dependency injection
│   │   ├── core/               # Core configuration
│   │   │   ├── config.py       # Environment config
│   │   │   └── security.py     # Authentication/security
│   │   ├── models/             # Database models
│   │   ├── schemas/            # Pydantic schemas
│   │   ├── services/           # Business logic
│   │   ├── database.py         # Database connection
│   │   └── main.py             # Application entry point
│   ├── tests/                  # Test suite
│   ├── requirements.txt        # Python dependencies
│   └── .env.example            # Environment variables template
│
├── docs/                        # Project documentation
│   ├── architecture.md         # System architecture
│   ├── api.md                  # API documentation
│   ├── development.md          # Development guide
│   ├── deployment.md           # Deployment instructions
│   └── contributing.md         # Contributing guidelines
│
├── .gitignore                   # Git ignore rules
├── README.md                    # This file
└── package.json                # Root package.json for monorepo tools

```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm
- Python 3.11+
- Git
- (Optional) Docker for containerization

### Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Run linting
npm run lint
```

### Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload

# Run tests
pytest

# Run linting
flake8 app/
```

## 💻 Development

### Frontend Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes in the `frontend/src` directory
3. Run tests and linting: `npm test && npm run lint`
4. Commit with descriptive messages
5. Push and create a pull request

### Backend Development Workflow

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Make your changes in the `backend/app` directory
3. Write tests for new functionality
4. Run tests and linting: `pytest && flake8 app/`
5. Commit with descriptive messages
6. Push and create a pull request

### Common Development Commands

```bash
# Frontend
npm run dev              # Start dev server
npm run build            # Build for production
npm test                 # Run tests
npm run lint             # Run ESLint
npm run type-check       # Run TypeScript checks

# Backend
uvicorn app.main:app --reload   # Start server with auto-reload
pytest                           # Run tests
pytest --cov                     # Run tests with coverage
flake8 app/                      # Lint code
black app/                       # Format code
```

## 🏗️ Architecture

### High-Level Architecture

```
┌─────────────────────────────────────┐
│   Frontend (React + TypeScript)     │
│   - Kanban Board UI                 │
│   - Task Management                 │
│   - Real-time Updates               │
└──────────────────┬──────────────────┘
                   │
                   │ HTTP/WebSocket
                   │
┌──────────────────▼──────────────────┐
│   API Gateway / Load Balancer       │
└──────────────────┬──────────────────┘
                   │
┌──────────────────▼──────────────────┐
│   Backend (FastAPI + Python)        │
│   - REST API Endpoints              │
│   - Authentication/Authorization    │
│   - Business Logic                  │
│   - WebSocket for Real-time         │
└──────────────────┬──────────────────┘
                   │
┌──────────────────▼──────────────────┐
│   Database (PostgreSQL)             │
│   - Projects, Tasks, Users          │
│   - Relationships & Indexes         │
└─────────────────────────────────────┘
```

### Component Architecture

**Frontend Components:**
- Stateless UI components (buttons, modals, cards)
- Container components (pages, layouts)
- Custom hooks for logic reuse
- Zustand for global state management

**Backend Services:**
- Route handlers for HTTP endpoints
- Service layer for business logic
- Database models using SQLAlchemy
- Authentication middleware

## 📚 Documentation

Detailed documentation is available in the `docs/` directory:

- **[Architecture](docs/architecture.md)** - System design and component relationships
- **[API Reference](docs/api.md)** - API endpoints and usage examples
- **[Development Guide](docs/development.md)** - Detailed development setup and practices
- **[Deployment](docs/deployment.md)** - Deployment instructions for various environments
- **[Contributing](docs/contributing.md)** - Contribution guidelines and code standards

## 🔐 Security

- JWT-based authentication
- CORS configuration for API security
- Environment variable management
- Input validation with Pydantic
- SQL injection prevention with SQLAlchemy ORM

## 📦 Dependencies

See individual `package.json` (frontend) and `requirements.txt` (backend) for complete dependency lists.

## 🧪 Testing

### Frontend
```bash
cd frontend
npm test
npm run test:coverage
```

### Backend
```bash
cd backend
pytest
pytest --cov=app --cov-report=html
```

## 🤝 Contributing

Contributions are welcome! Please see [CONTRIBUTING.md](docs/contributing.md) for guidelines on:
- Code style and standards
- Testing requirements
- Commit message conventions
- Pull request process

## 📄 License

This project is licensed under the MIT License - see LICENSE file for details.

## 🆘 Support

For issues, questions, or suggestions:
- Open an issue on GitHub
- Check existing documentation in `docs/`
- Review recent commits and PRs for solutions

## 🎉 Acknowledgments

- Built with modern web technologies
- Designed for small team collaboration
- Inspired by popular project management tools

---

**Version**: 1.0.0 (Initial Setup)  
**Last Updated**: 2024
