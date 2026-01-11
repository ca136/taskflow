# TaskFlow Quick Start Guide

## ⚡ 5-Minute Setup

### Option 1: Docker Compose (Recommended - Fastest)

```bash
# Clone and navigate to project
git clone https://github.com/ca136/taskflow.git
cd taskflow

# Start the full stack
docker-compose up
```

Then visit:
- **Frontend:** http://localhost:5173
- **Backend API:** http://localhost:8000
- **API Docs:** http://localhost:8000/docs

### Option 2: Local Development

#### Prerequisites
- Node.js 18+ (`node --version`)
- Python 3.11+ (`python3 --version`)
- PostgreSQL 12+ (local or Docker)

#### Step 1: Backend Setup
```bash
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env from template
cp ../.env.example .env

# Run development server
uvicorn app.main:app --reload
```

Backend runs at: **http://localhost:8000**
- API Docs: http://localhost:8000/docs

#### Step 2: Frontend Setup (New Terminal)
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev
```

Frontend runs at: **http://localhost:5173**

## 📋 Essential Commands

### Frontend
```bash
cd frontend

npm run dev          # Start development server
npm run build        # Create production build
npm run preview      # Preview production build
npm run lint         # Check code style
npm run type-check   # TypeScript validation
npm test             # Run tests
```

### Backend
```bash
cd backend

uvicorn app.main:app --reload     # Start dev server
pytest                             # Run tests
pytest --cov=app tests/            # Coverage report
alembic upgrade head               # Run migrations
alembic revision --autogenerate    # Create migration
```

### Full Stack (Docker)
```bash
# Start all services
docker-compose up

# Stop all services
docker-compose down

# View logs
docker-compose logs -f backend
docker-compose logs -f frontend

# Rebuild containers
docker-compose up --build
```

## 🏗️ Project Structure at a Glance

```
taskflow/
├── frontend/          React app (TypeScript, Vite, Tailwind)
├── backend/           FastAPI app (Python 3.11+)
├── docs/              Documentation
├── docker-compose.yml Full stack orchestration
└── README.md          Full documentation
```

### Frontend Structure
```
frontend/src/
├── components/    # Reusable React components
├── pages/         # Page-level components
├── hooks/         # Custom React hooks
├── api/           # API client setup
├── services/      # Business logic
├── store/         # Zustand state (zustand 4.5.3)
├── types/         # TypeScript types
├── utils/         # Helper functions
└── styles/        # CSS/Tailwind
```

### Backend Structure
```
backend/app/
├── main.py          # FastAPI entry point
├── database.py      # Database connection
├── core/            # Configuration, security, auth
├── api/             # Route handlers (/api/v1/*)
├── models/          # SQLAlchemy ORM models
├── schemas/         # Pydantic data schemas
├── services/        # Business logic
├── routes/          # Alternative route files
└── db/              # Database utilities
```

## 🔐 Environment Setup

### Create Backend `.env`
```bash
cd backend
cp ../.env.example .env
```

Key variables to configure:
- `DATABASE_URL` - PostgreSQL connection string
- `SECRET_KEY` - JWT secret (change in production!)
- `ALLOWED_ORIGINS` - CORS origins

### Create Frontend `.env.local` (Optional)
```bash
cd frontend
echo "VITE_API_URL=http://localhost:8000" > .env.local
```

## 🗄️ Database Setup

### Using PostgreSQL Locally

```bash
# macOS (Homebrew)
brew install postgresql
brew services start postgresql

# Linux (Ubuntu/Debian)
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start

# Create database
createdb taskflow
```

### Using PostgreSQL in Docker
```bash
# Already configured in docker-compose.yml
docker-compose up postgres
```

### Run Migrations
```bash
cd backend
alembic upgrade head
```

## 🧪 Testing

### Frontend Tests
```bash
cd frontend
npm test                    # Run tests
npm test -- --watch       # Watch mode
npm test -- --coverage    # Coverage report
```

### Backend Tests
```bash
cd backend
pytest                     # Run all tests
pytest tests/             # Run specific directory
pytest -v                 # Verbose output
pytest --cov=app tests/   # Coverage report
```

## 📚 Documentation

- **[README.md](README.md)** - Full project overview
- **[ARCHITECTURE.md](ARCHITECTURE.md)** - System design
- **[CONTRIBUTING.md](CONTRIBUTING.md)** - Development guidelines
- **[docs/](docs/)** - Additional documentation

## 🐛 Troubleshooting

### Frontend won't start
```bash
# Clear node_modules and reinstall
rm -rf frontend/node_modules frontend/package-lock.json
cd frontend && npm install
npm run dev
```

### Backend won't start
```bash
# Check Python version
python3 --version  # Need 3.11+

# Recreate virtual environment
rm -rf backend/venv
python3 -m venv backend/venv
source backend/venv/bin/activate
pip install -r backend/requirements.txt
```

### Database connection issues
```bash
# Check DATABASE_URL in .env
# Verify PostgreSQL is running
psql -U taskflow_user -d taskflow

# Run migrations if needed
cd backend && alembic upgrade head
```

### Port already in use
```bash
# Frontend uses 5173, Backend uses 8000
# Change ports in vite.config.ts and app configuration
# Or kill existing process:
lsof -i :5173  # Find process on port 5173
kill -9 <PID>
```

## 🚀 Next Steps

1. **Read the [Architecture Guide](ARCHITECTURE.md)** to understand the design
2. **Check the [Contributing Guide](CONTRIBUTING.md)** for code standards
3. **Start with the backend** - Create your first API endpoint
4. **Then the frontend** - Build components to consume the API
5. **Run the full stack** with Docker to test everything together

## 💡 Development Tips

- Use TypeScript strict mode in frontend - catch bugs early
- Follow REST conventions in backend API design
- Write tests for critical business logic
- Use React Query for server state (not Zustand)
- Use Zustand for client-only state
- Check API docs at http://localhost:8000/docs while developing
- Keep components pure and testable

## 🤝 Got Issues?

1. Check the [full README](README.md) for detailed documentation
2. Review existing code in the repository
3. Check error messages carefully
4. Try the troubleshooting section above
5. Open an issue on GitHub with:
   - What you're trying to do
   - Error message
   - Steps to reproduce
   - Your environment (OS, Node/Python versions)

---

**Happy coding! 🎉**

For more detailed information, see [README.md](README.md) and [ARCHITECTURE.md](ARCHITECTURE.md).
