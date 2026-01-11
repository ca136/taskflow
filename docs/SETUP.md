# TaskFlow Setup Guide

## Prerequisites

Before setting up TaskFlow, ensure you have the following installed:

- **Node.js** 18.0 or higher
- **npm** 9.0 or higher (comes with Node.js)
- **Python** 3.9 or higher
- **pip** (comes with Python)
- **PostgreSQL** 12+ (optional, SQLite used for development)
- **Git**

### Verify Installation

```bash
node --version      # Should be v18.0.0 or higher
npm --version       # Should be 9.0.0 or higher
python --version    # Should be 3.9.0 or higher
```

## Project Setup

### 1. Clone the Repository

```bash
git clone https://github.com/ca136/taskflow.git
cd taskflow
```

### 2. Frontend Setup

Navigate to the frontend directory:

```bash
cd frontend
```

#### Install Dependencies

```bash
npm install
```

#### Create Environment File (if needed)

```bash
# Copy example environment file
cp .env.example .env.local
```

#### Start Development Server

```bash
npm run dev
```

The frontend will be available at `http://localhost:5173`

#### Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory.

#### Run Linter

```bash
npm run lint
```

### 3. Backend Setup

Navigate to the backend directory:

```bash
cd ../backend
```

#### Create Virtual Environment

**On macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

**On Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Create Environment File

```bash
# Copy example environment file
cp .env.example .env
```

Edit `.env` with your configuration:
```
DATABASE_URL=sqlite:///./taskflow.db
DEBUG=True
SECRET_KEY=dev-secret-key-change-in-production
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

#### Initialize Database

For SQLite (development):
```bash
# Database will be created automatically on first run
python main.py
```

For PostgreSQL (production):
```bash
# Create database
createdb taskflow

# Update DATABASE_URL in .env
DATABASE_URL=postgresql://user:password@localhost:5432/taskflow

# Run migrations (when set up)
alembic upgrade head
```

#### Start Development Server

```bash
python main.py
```

The API will be available at `http://localhost:8000`

#### Access API Documentation

Open your browser and visit: `http://localhost:8000/docs`

This opens the interactive Swagger UI for all available endpoints.

#### Run Tests

```bash
pytest
```

## Development Workflow

### Terminal Setup

It's recommended to run frontend and backend in separate terminals:

**Terminal 1 - Frontend:**
```bash
cd frontend
npm run dev
```

**Terminal 2 - Backend:**
```bash
cd backend
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

### Making API Requests from Frontend

The frontend is configured to proxy API requests to the backend:
- Frontend requests to `/api/*` are forwarded to `http://localhost:8000/*`

Example:
```typescript
// In frontend code
const response = await axios.get('/api/projects');
// This requests: http://localhost:8000/projects
```

## Database Setup

### Using SQLite (Development)

SQLite requires minimal setup:

1. The database file `taskflow.db` is created automatically
2. No additional configuration needed
3. Perfect for local development

### Using PostgreSQL (Production)

For PostgreSQL setup:

1. **Install PostgreSQL**: Follow [official guide](https://www.postgresql.org/download/)

2. **Create Database:**
   ```bash
   createdb taskflow
   ```

3. **Update Environment:**
   ```
   DATABASE_URL=postgresql://user:password@localhost:5432/taskflow
   ```

4. **Run Migrations:**
   ```bash
   alembic init alembic
   alembic upgrade head
   ```

## Troubleshooting

### Frontend Issues

#### Port Already in Use
If port 5173 is already in use:
```bash
npm run dev -- --port 5174
```

#### Dependencies Won't Install
```bash
rm -rf node_modules package-lock.json
npm install
```

#### Build Fails
Check TypeScript errors:
```bash
npm run lint
```

### Backend Issues

#### Python Venv Not Activating
Make sure you're in the backend directory:
```bash
cd backend
source venv/bin/activate  # macOS/Linux
# or
venv\Scripts\activate     # Windows
```

#### Module Not Found
Ensure all dependencies are installed:
```bash
pip install -r requirements.txt
```

#### Port Already in Use
Modify `main.py` to use a different port:
```python
uvicorn.run(app, host="0.0.0.0", port=8001)
```

#### Database Connection Error
Check your DATABASE_URL in `.env`:
```bash
# For SQLite
DATABASE_URL=sqlite:///./taskflow.db

# For PostgreSQL (ensure PostgreSQL is running)
DATABASE_URL=postgresql://user:password@localhost:5432/taskflow
```

## IDE Setup

### Visual Studio Code

#### Recommended Extensions
- ES7+ React/Redux/React-Native snippets
- ESLint
- Prettier - Code formatter
- Python
- Pylance
- Thunder Client (or REST Client)

#### Settings (`.vscode/settings.json`)
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "[python]": {
    "editor.defaultFormatter": "ms-python.python"
  },
  "editor.formatOnSave": true
}
```

### PyCharm

1. Open backend folder as project
2. Configure Python interpreter from venv
3. Mark `backend/` as Sources Root
4. Enable Django/FastAPI support

## Git Workflow

### Feature Branch Workflow

1. Create a new branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes and commit:
   ```bash
   git add .
   git commit -m "Add your feature description"
   ```

3. Push to repository:
   ```bash
   git push origin feature/your-feature-name
   ```

4. Create a Pull Request on GitHub

## Deployment

### Frontend Deployment

Build for production:
```bash
cd frontend
npm run build
```

Deploy the `dist/` folder to:
- **Vercel**: Push to GitHub, auto-deploys
- **Netlify**: Connect repository, configure build
- **AWS S3**: Upload dist folder to S3 bucket
- **Any static host**: Upload dist folder

### Backend Deployment

Using Heroku:
```bash
heroku create taskflow-api
heroku addons:create heroku-postgresql:hobby-dev
git push heroku main
```

Using Docker:
```bash
docker build -t taskflow-api .
docker run -p 8000:8000 taskflow-api
```

Using Railway, Render, or similar platforms:
- Connect your GitHub repository
- Set environment variables
- Deploy

## Next Steps

1. **Read the API Documentation**: Visit `http://localhost:8000/docs`
2. **Review Architecture**: See `docs/ARCHITECTURE.md`
3. **Check API Guide**: See `docs/API.md`
4. **Start Building**: Create components and implement features

## Getting Help

- Check existing issues on GitHub
- Review logs for error messages
- Ask in discussions or Discord
- Create a new issue with detailed information

## Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [SQLAlchemy Documentation](https://docs.sqlalchemy.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/)
