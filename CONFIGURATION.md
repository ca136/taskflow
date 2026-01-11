# TaskFlow Configuration Guide

Complete reference for all configuration options and settings.

## Table of Contents
1. [Environment Variables](#environment-variables)
2. [Frontend Configuration](#frontend-configuration)
3. [Backend Configuration](#backend-configuration)
4. [Database Configuration](#database-configuration)
5. [Docker Configuration](#docker-configuration)
6. [Security Settings](#security-settings)
7. [Advanced Settings](#advanced-settings)

## Environment Variables

### Creating .env File

```bash
# Copy template to working .env file
cp .env.example .env

# Edit with your values
# DO NOT commit .env to version control
```

### Variable Reference

#### Backend API

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `DATABASE_URL` | string | - | PostgreSQL connection string |
| `SECRET_KEY` | string | - | JWT signing key (min 32 chars) |
| `ALGORITHM` | string | `HS256` | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | int | `30` | Access token lifetime |
| `REFRESH_TOKEN_EXPIRE_DAYS` | int | `7` | Refresh token lifetime |
| `BACKEND_CORS_ORIGINS` | JSON array | `[]` | Allowed frontend origins |
| `ENVIRONMENT` | string | `development` | `development` or `production` |
| `DEBUG` | boolean | `false` | Enable debug mode |
| `LOG_LEVEL` | string | `INFO` | Log level (DEBUG, INFO, WARNING, ERROR) |

#### Database

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `DATABASE_URL` | string | - | PostgreSQL connection URL |
| `DB_POOL_SIZE` | int | `20` | Connection pool size |
| `DB_POOL_RECYCLE` | int | `3600` | Connection recycle time (seconds) |

#### Frontend

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `VITE_API_URL` | string | - | Backend API URL |
| `VITE_APP_NAME` | string | `TaskFlow` | Application name |

#### Optional Services

| Variable | Type | Default | Description |
|----------|------|---------|-------------|
| `REDIS_URL` | string | - | Redis connection URL |
| `MAIL_FROM_EMAIL` | string | - | Sender email address |
| `SMTP_HOST` | string | - | SMTP server hostname |
| `SMTP_PORT` | int | `587` | SMTP server port |
| `SMTP_USERNAME` | string | - | SMTP username |
| `SMTP_PASSWORD` | string | - | SMTP password |

### Example Configuration

```env
# Development
DATABASE_URL=postgresql://taskflow_user:taskflow_password@localhost:5432/taskflow
SECRET_KEY=your-generated-secret-key-here-min-32-characters
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
BACKEND_CORS_ORIGINS=["http://localhost:5173", "http://localhost:3000"]
ENVIRONMENT=development
DEBUG=true
LOG_LEVEL=DEBUG

VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=TaskFlow
```

```env
# Production
DATABASE_URL=postgresql://prod_user:secure_password@prod-db.example.com:5432/taskflow
SECRET_KEY=generated-secret-key-change-this-in-production-32chars-min
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=15
BACKEND_CORS_ORIGINS=["https://taskflow.example.com"]
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=WARNING

VITE_API_URL=https://api.taskflow.example.com/api/v1
VITE_APP_NAME=TaskFlow
```

## Frontend Configuration

### Vite Configuration (vite.config.ts)

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser'
  }
})
```

### TypeScript Configuration (tsconfig.json)

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@services/*": ["src/services/*"],
      "@types/*": ["src/types/*"]
    },
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "forceConsistentCasingInFileNames": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "resolveJsonModule": true
  }
}
```

### Tailwind CSS Configuration (tailwind.config.js)

```javascript
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',
        secondary: '#10B981',
      }
    },
  },
  plugins: [],
}
```

### Environment Variables in Frontend

Access in React components:
```typescript
const apiUrl = import.meta.env.VITE_API_URL
const appName = import.meta.env.VITE_APP_NAME
```

## Backend Configuration

### Main Configuration (backend/app/core/config.py)

```python
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    # API
    API_V1_STR: str = "/api/v1"
    PROJECT_NAME: str = "TaskFlow"
    
    # Database
    DATABASE_URL: str
    DB_POOL_SIZE: int = 20
    
    # Security
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # CORS
    BACKEND_CORS_ORIGINS: list = []
    
    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = False
    LOG_LEVEL: str = "INFO"
    
    class Config:
        env_file = ".env"

settings = Settings()
```

### Database URL Format

```
postgresql://username:password@hostname:port/database

# Examples:
postgresql://user:pass@localhost:5432/taskflow
postgresql://prod_user:secure_pass@db.example.com:5432/taskflow
```

### Logging Configuration

```python
import logging

logging.basicConfig(
    level=logging.getLevelName(settings.LOG_LEVEL),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)
```

### FastAPI Application Settings

```python
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(
    title="TaskFlow API",
    description="Kanban project management API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url="/openapi.json"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
```

## Database Configuration

### PostgreSQL Connection

```python
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "postgresql://user:password@localhost/taskflow"

engine = create_engine(
    DATABASE_URL,
    echo=False,  # Set to True for SQL debugging
    pool_size=20,
    max_overflow=0,
    pool_recycle=3600,
    pool_pre_ping=True  # Verify connection before use
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)
```

### Connection Pool Settings

| Setting | Default | Description |
|---------|---------|-------------|
| `pool_size` | 5 | Number of connections to keep pooled |
| `max_overflow` | 10 | Number of additional connections beyond pool_size |
| `pool_recycle` | -1 | Recycle connections after seconds (prevent stale connections) |
| `pool_pre_ping` | False | Test connections before using |

### Recommended Settings for Production

```python
engine = create_engine(
    DATABASE_URL,
    echo=False,
    pool_size=30,
    max_overflow=10,
    pool_recycle=3600,
    pool_pre_ping=True,
    ssl={'mode': 'require'}  # SSL connection
)
```

## Docker Configuration

### Docker Compose Environment Variables

Create or update `.env` file for docker-compose:

```env
# Database
DB_USER=taskflow_user
DB_PASSWORD=secure_password_here
DB_NAME=taskflow
DB_PORT=5432

# Backend
SECRET_KEY=generated-secret-key-min-32-chars
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
ENVIRONMENT=development
DEBUG=true
BACKEND_PORT=8000

# Frontend
VITE_API_URL=http://localhost:8000
FRONTEND_PORT=5173

# Redis (optional)
REDIS_PORT=6379
```

### Service Configuration

#### PostgreSQL Service
```yaml
postgres:
  image: postgres:15-alpine
  environment:
    POSTGRES_USER: ${DB_USER}
    POSTGRES_PASSWORD: ${DB_PASSWORD}
    POSTGRES_DB: ${DB_NAME}
  ports:
    - "${DB_PORT}:5432"
  volumes:
    - postgres_data:/var/lib/postgresql/data
  healthcheck:
    test: ["CMD-SHELL", "pg_isready -U ${DB_USER}"]
    interval: 10s
    timeout: 5s
    retries: 5
```

#### Backend Service
```yaml
backend:
  build:
    context: .
    dockerfile: Dockerfile
  environment:
    DATABASE_URL: postgresql://${DB_USER}:${DB_PASSWORD}@postgres:5432/${DB_NAME}
    SECRET_KEY: ${SECRET_KEY}
    ENVIRONMENT: ${ENVIRONMENT}
  ports:
    - "${BACKEND_PORT}:8000"
  depends_on:
    postgres:
      condition: service_healthy
```

#### Frontend Service
```yaml
frontend:
  build:
    context: frontend
    dockerfile: ../frontend.Dockerfile
  environment:
    VITE_API_URL: http://localhost:8000
  ports:
    - "${FRONTEND_PORT}:5173"
  depends_on:
    - backend
```

## Security Settings

### JWT Configuration

```python
# In config.py
SECRET_KEY = "your-secret-key-minimum-32-characters-required"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Token generation
from datetime import timedelta
from jose import jwt

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt
```

### Password Hashing

```python
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)
```

### CORS Configuration

```python
# Development
CORS_ORIGINS = [
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173"
]

# Production
CORS_ORIGINS = [
    "https://taskflow.example.com",
    "https://www.taskflow.example.com"
]

# In FastAPI
app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
    max_age=600
)
```

### HTTPS/SSL Configuration

For production, use HTTPS:

```python
# In docker-compose.yml or deployment
# Use reverse proxy (nginx) with SSL certificate
# Or use Uvicorn with SSL:
# uvicorn app.main:app --ssl-keyfile=key.pem --ssl-certfile=cert.pem
```

## Advanced Settings

### Logging Configuration

```python
import logging
from logging.handlers import RotatingFileHandler

# Create logs directory
import os
os.makedirs("logs", exist_ok=True)

# File handler
file_handler = RotatingFileHandler(
    "logs/app.log",
    maxBytes=10485760,  # 10MB
    backupCount=10
)

# Setup logger
logger = logging.getLogger("taskflow")
logger.setLevel(logging.DEBUG)
logger.addHandler(file_handler)
```

### Redis Configuration

```python
import redis

REDIS_URL = "redis://localhost:6379/0"

redis_client = redis.from_url(REDIS_URL)

# Usage: caching, sessions, job queues
redis_client.set("key", "value", ex=3600)  # 1 hour expiry
```

### Database Monitoring

```python
# PostgreSQL slow query logging
# Add to postgresql.conf:
log_min_duration_statement = 1000  # 1 second
log_statement = 'all'

# Or via SQLAlchemy
from sqlalchemy import event

@event.listens_for(Engine, "before_cursor_execute")
def receive_before_cursor_execute(conn, cursor, statement, params, context, executemany):
    conn.info.setdefault('query_start_time', []).append(time.time())

@event.listens_for(Engine, "after_cursor_execute")
def receive_after_cursor_execute(conn, cursor, statement, params, context, executemany):
    total_time = time.time() - conn.info['query_start_time'].pop(-1)
    if total_time > 1:  # Log queries slower than 1 second
        logger.warning(f"Query took {total_time:.2f}s: {statement}")
```

### Development vs Production

```python
# Use environment variable to switch
if ENVIRONMENT == "development":
    DEBUG = True
    SQLALCHEMY_ECHO = True
    LOG_LEVEL = "DEBUG"
else:
    DEBUG = False
    SQLALCHEMY_ECHO = False
    LOG_LEVEL = "WARNING"
```

### API Rate Limiting

```python
from slowapi import Limiter
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter

@app.get("/api/v1/items")
@limiter.limit("100/minute")
async def get_items(request: Request):
    pass
```

### Monitoring and Metrics

```python
from prometheus_client import Counter, Histogram, generate_latest

# Metrics
request_count = Counter('requests_total', 'Total requests', ['method', 'endpoint'])
request_duration = Histogram('request_duration_seconds', 'Request duration')

@app.middleware("http")
async def add_metrics(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    
    request_count.labels(request.method, request.url.path).inc()
    request_duration.observe(duration)
    
    return response

@app.get("/metrics")
async def metrics():
    return Response(generate_latest(), media_type="text/plain")
```

## Configuration Checklist

- [ ] Copy `.env.example` to `.env`
- [ ] Generate and set `SECRET_KEY`
- [ ] Set `DATABASE_URL` with correct credentials
- [ ] Configure `BACKEND_CORS_ORIGINS` for your frontend
- [ ] Set `ENVIRONMENT` and `DEBUG` appropriately
- [ ] Configure `VITE_API_URL` for frontend
- [ ] Update `.env` for docker-compose if using Docker
- [ ] Review security settings for production
- [ ] Test database connection
- [ ] Verify API health check
- [ ] Check frontend environment variables

## Troubleshooting

### Configuration Not Applied

```bash
# Restart application to load new .env values
# Make sure .env file is in correct location (root directory)
# Verify format: KEY=VALUE (no quotes needed unless value has spaces)
```

### Database Connection Failed

```bash
# Check DATABASE_URL format
# Verify PostgreSQL is running
# Check credentials and database name
psql -U user -d database -h host
```

### CORS Errors

```bash
# Add frontend URL to BACKEND_CORS_ORIGINS
# Format: ["http://localhost:5173", "https://example.com"]
# Restart backend after changes
```

### Port Already in Use

See [INSTALLATION.md](./INSTALLATION.md#port-already-in-use)
