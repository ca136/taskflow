# TaskFlow

A lightweight, full-stack kanban project management application designed for small teams.

## Overview

TaskFlow is a modern project management tool that provides an intuitive kanban-style interface for managing tasks and projects. Built with a focus on simplicity and efficiency, it helps teams collaborate and stay organized.

## Tech Stack

### Frontend
- **React 18+** - UI framework
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Query** - Server state management
- **Zustand** - Client state management
- **React Router** - Client-side routing

### Backend
- **FastAPI** - Modern, fast Python web framework
- **Python 3.11+** - Async/await support
- **SQLAlchemy** - ORM for database
- **Pydantic** - Data validation
- **PostgreSQL** - Primary database
- **Redis** - Caching (optional)

## Project Structure

```
taskflow/
├── frontend/                 # React + TypeScript application
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/           # Page components
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Utility functions
│   │   ├── api/             # API client and endpoints
│   │   ├── types/           # TypeScript types
│   │   ├── store/           # Zustand stores
│   │   └── assets/          # Icons, images
│   ├── package.json
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── tailwind.config.js
│
├── backend/                 # FastAPI application
│   ├── app/
│   │   ├── routes/          # API route handlers
│   │   ├── models/          # SQLAlchemy models
│   │   ├── schemas/         # Pydantic schemas
│   │   ├── core/            # Core configs, auth, dependencies
│   │   ├── services/        # Business logic
│   │   └── main.py          # FastAPI app entry point
│   ├── tests/               # Test suite
│   ├── scripts/             # Database migrations, seed scripts
│   ├── requirements.txt
│   ├── .env.example
│   └── pyproject.toml
│
├── docs/                    # Documentation
│   ├── API.md              # API reference
│   ├── SETUP.md            # Setup instructions
│   └── ARCHITECTURE.md     # System architecture
│
├── .gitignore
├── README.md
└── docker-compose.yml       # Optional: Local development setup

```

## Getting Started

### Prerequisites
- Node.js 18+ and npm 9+
- Python 3.11+
- PostgreSQL 12+ (for backend)

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Lint code
npm run lint
```

The frontend will be available at `http://localhost:5173`

### Backend Setup

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Set up environment variables
cp .env.example .env

# Run database migrations
alembic upgrade head

# Start development server
uvicorn app.main:app --reload

# Run tests
pytest
```

The backend API will be available at `http://localhost:8000`

### API Documentation

Once the backend is running, visit `http://localhost:8000/docs` for interactive API documentation (Swagger UI).

## Development Workflow

1. Create a feature branch from `main`
2. Implement changes in both frontend and/or backend as needed
3. Test your changes locally
4. Submit a pull request for code review
5. After approval, merge to `main` and deploy

## Environment Variables

### Frontend
Create `.env.local` in the frontend directory:
```
VITE_API_URL=http://localhost:8000/api
```

### Backend
Create `.env` in the backend directory (see `.env.example`):
```
DATABASE_URL=postgresql://user:password@localhost/taskflow
SECRET_KEY=your-secret-key-here
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Documentation

- **[Setup Guide](docs/SETUP.md)** - Detailed setup instructions for development
- **[Architecture Guide](docs/ARCHITECTURE.md)** - System design and patterns
- **[API Reference](docs/API.md)** - Complete API endpoint documentation

## Database

The application uses PostgreSQL as the primary database. Database migrations are managed using Alembic.

```bash
cd backend

# Create a new migration
alembic revision --autogenerate -m "Description of changes"

# Apply migrations
alembic upgrade head

# Revert to previous migration
alembic downgrade -1
```

## Testing

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
pytest --cov=app tests/
```

## Deployment

### Frontend
```bash
cd frontend
npm run build
# Output is in dist/ directory - can be served with any static file server
```

### Backend
```bash
# Using Docker
docker build -t taskflow-api .
docker run -p 8000:8000 taskflow-api

# Or using Gunicorn
gunicorn app.main:app -w 4 -k uvicorn.workers.UvicornWorker
```

## Contributing

1. Read the setup guide for your development environment
2. Follow the code style guidelines
3. Write tests for new features
4. Update documentation as needed

## License

MIT License - See LICENSE file for details

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

## Roadmap

- [ ] User authentication and authorization
- [ ] Project templates
- [ ] Team collaboration features
- [ ] Advanced filtering and search
- [ ] Integration with external tools
- [ ] Mobile app
- [ ] Real-time collaboration with WebSockets

---

**Last Updated:** 2024
