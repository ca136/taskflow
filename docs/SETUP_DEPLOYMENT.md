# TaskFlow Setup & Deployment Guide

Complete guide for setting up TaskFlow development environment and deploying to production.

## Table of Contents

1. [Development Setup](#development-setup)
2. [Docker Setup](#docker-setup)
3. [Database Setup](#database-setup)
4. [Environment Configuration](#environment-configuration)
5. [Running the Application](#running-the-application)
6. [Production Deployment](#production-deployment)
7. [Troubleshooting](#troubleshooting)

---

## Development Setup

### Prerequisites

Verify you have the required tools:

```bash
# Check Node.js and npm
node --version  # Should be 18.0+
npm --version   # Should be 9.0+

# Check Python
python3 --version  # Should be 3.11+
pip3 --version

# Check Git
git --version
```

### Clone Repository

```bash
git clone https://github.com/ca136/taskflow.git
cd taskflow
```

### Frontend Setup

Navigate to frontend directory and install dependencies:

```bash
cd frontend
npm install
```

Create `.env.local` file:

```bash
cat > .env.local << EOF
VITE_API_URL=http://localhost:8000/api/v1
VITE_APP_NAME=TaskFlow
VITE_APP_VERSION=1.0.0
EOF
```

### Backend Setup

Navigate to backend directory:

```bash
cd backend
```

Create Python virtual environment:

```bash
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `.env` file:

```bash
cat > .env << EOF
# Database
DATABASE_URL=postgresql://taskflow_user:taskflow_pass@localhost:5432/taskflow_db

# Security
SECRET_KEY=your-super-secret-key-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000

# Environment
ENVIRONMENT=development
DEBUG=True
EOF
```

### Initialize Database

```bash
# Create database (PostgreSQL)
createdb -U postgres taskflow_db

# Run migrations
alembic upgrade head
```

---

## Docker Setup

### Build Docker Images

Build frontend image:

```bash
docker build -t taskflow-frontend ./frontend
```

Build backend image:

```bash
docker build -t taskflow-backend ./backend
```

### Docker Compose Setup

Create `docker-compose.yml` in root:

```yaml
version: '3.9'

services:
  postgres:
    image: postgres:15-alpine
    container_name: taskflow-postgres
    environment:
      POSTGRES_USER: taskflow_user
      POSTGRES_PASSWORD: taskflow_pass
      POSTGRES_DB: taskflow_db
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U taskflow_user"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: taskflow-redis
    ports:
      - "6379:6379"
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    container_name: taskflow-backend
    environment:
      DATABASE_URL: postgresql://taskflow_user:taskflow_pass@postgres:5432/taskflow_db
      REDIS_URL: redis://redis:6379
      SECRET_KEY: ${SECRET_KEY:-dev-secret-key-change-in-production}
      ENVIRONMENT: ${ENVIRONMENT:-development}
      DEBUG: ${DEBUG:-True}
    ports:
      - "8000:8000"
    depends_on:
      postgres:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - ./backend:/app
    command: uvicorn app.main:app --host 0.0.0.0 --reload

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    container_name: taskflow-frontend
    environment:
      VITE_API_URL: http://localhost:8000/api/v1
    ports:
      - "3000:80"
    depends_on:
      - backend
    volumes:
      - ./frontend/src:/app/src

volumes:
  postgres_data:
```

### Start with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Remove volumes (caution: deletes data)
docker-compose down -v
```

### Access Services

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000
- **Swagger Docs**: http://localhost:8000/docs
- **PostgreSQL**: localhost:5432
- **Redis**: localhost:6379

---

## Database Setup

### PostgreSQL Installation

**macOS (Homebrew):**
```bash
brew install postgresql
brew services start postgresql
```

**Ubuntu/Debian:**
```bash
sudo apt-get install postgresql postgresql-contrib
sudo service postgresql start
```

**Windows:**
Download from https://www.postgresql.org/download/windows/

### Create Database and User

```bash
# Connect to PostgreSQL
psql -U postgres

# Create database
CREATE DATABASE taskflow_db;

# Create user with password
CREATE USER taskflow_user WITH PASSWORD 'taskflow_pass';

# Grant privileges
ALTER ROLE taskflow_user SET client_encoding TO 'utf8';
ALTER ROLE taskflow_user SET default_transaction_isolation TO 'read committed';
ALTER ROLE taskflow_user SET default_transaction_deferrable TO on;
ALTER ROLE taskflow_user SET default_transaction_read_only TO off;
GRANT ALL PRIVILEGES ON DATABASE taskflow_db TO taskflow_user;

# Exit
\q
```

### Verify Connection

```bash
psql -U taskflow_user -d taskflow_db -h localhost
```

### Run Migrations

```bash
cd backend
source venv/bin/activate
alembic upgrade head
```

### Check Database

```bash
psql -U taskflow_user -d taskflow_db

\dt              # List tables
\d users         # Describe users table
\q              # Exit
```

---

## Environment Configuration

### Backend .env File

Complete `.env` reference:

```bash
# Database Configuration
DATABASE_URL=postgresql://taskflow_user:taskflow_pass@localhost:5432/taskflow_db

# Security
SECRET_KEY=your-super-secret-key-minimum-32-characters-long-change-in-production
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
REFRESH_TOKEN_EXPIRE_DAYS=7

# CORS Configuration
ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000,https://taskflow.dev

# Environment
ENVIRONMENT=development  # production or development
DEBUG=True

# Redis Configuration (optional)
REDIS_URL=redis://localhost:6379/0

# Email Configuration (optional)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
MAIL_FROM=noreply@taskflow.dev

# Logging
LOG_LEVEL=INFO

# API Rate Limiting
RATE_LIMIT_ENABLED=False
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_PERIOD=3600
```

### Frontend .env.local File

```bash
# API Configuration
VITE_API_URL=http://localhost:8000/api/v1

# App Configuration
VITE_APP_NAME=TaskFlow
VITE_APP_VERSION=1.0.0

# Feature Flags
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_REAL_TIME=false

# Analytics (optional)
VITE_ANALYTICS_ID=

# Environment
VITE_ENVIRONMENT=development
```

### Docker Compose .env File

```bash
# Postgres
POSTGRES_USER=taskflow_user
POSTGRES_PASSWORD=taskflow_pass
POSTGRES_DB=taskflow_db

# Backend
SECRET_KEY=dev-secret-key-change-in-production
ENVIRONMENT=development
DEBUG=True

# Frontend
VITE_API_URL=http://localhost:8000/api/v1
```

---

## Running the Application

### Development Mode (Local)

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Development Mode (Docker Compose)

```bash
docker-compose up -d
```

**Access:**
- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- API Docs: http://localhost:8000/docs

### Run Tests

**Backend tests:**
```bash
cd backend
source venv/bin/activate
pytest
pytest --cov=app  # With coverage
```

**Frontend tests:**
```bash
cd frontend
npm test
npm run coverage
```

---

## Production Deployment

### Pre-Deployment Checklist

- [ ] All tests passing
- [ ] Environment variables configured
- [ ] Database migrations completed
- [ ] Security keys generated and secured
- [ ] CORS origins updated
- [ ] SSL/TLS certificates obtained
- [ ] Backup strategy in place
- [ ] Monitoring configured

### Backend Production Build

```bash
cd backend

# Create optimized Python environment
python3 -m venv venv-prod
source venv-prod/bin/activate
pip install -r requirements.txt

# Build Docker image
docker build -t taskflow-backend:1.0.0 .

# Push to registry
docker tag taskflow-backend:1.0.0 yourregistry/taskflow-backend:1.0.0
docker push yourregistry/taskflow-backend:1.0.0
```

### Frontend Production Build

```bash
cd frontend

# Build static files
npm run build

# Output in dist/ directory
ls -la dist/

# Build Docker image
docker build -t taskflow-frontend:1.0.0 .

# Push to registry
docker tag taskflow-frontend:1.0.0 yourregistry/taskflow-frontend:1.0.0
docker push yourregistry/taskflow-frontend:1.0.0
```

### Deploy to Kubernetes

Create `k8s/deployment.yaml`:

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: taskflow-backend
spec:
  replicas: 3
  selector:
    matchLabels:
      app: taskflow-backend
  template:
    metadata:
      labels:
        app: taskflow-backend
    spec:
      containers:
      - name: backend
        image: yourregistry/taskflow-backend:1.0.0
        ports:
        - containerPort: 8000
        env:
        - name: DATABASE_URL
          valueFrom:
            secretKeyRef:
              name: taskflow-secrets
              key: database-url
        - name: SECRET_KEY
          valueFrom:
            secretKeyRef:
              name: taskflow-secrets
              key: secret-key
        livenessProbe:
          httpGet:
            path: /docs
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /docs
            port: 8000
          initialDelaySeconds: 5
          periodSeconds: 5
```

Deploy:
```bash
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml
```

### Deploy to AWS EC2

```bash
# Connect to instance
ssh -i key.pem ec2-user@your-instance-ip

# Install Docker
sudo yum update
sudo yum install docker
sudo systemctl start docker
sudo usermod -aG docker ec2-user

# Clone repository
git clone https://github.com/ca136/taskflow.git
cd taskflow

# Create production env file
nano .env  # Add production values

# Start with Docker Compose
docker-compose -f docker-compose.prod.yml up -d
```

### Nginx Configuration

Create `nginx/default.conf`:

```nginx
upstream backend {
    server backend:8000;
}

upstream frontend {
    server frontend:3000;
}

server {
    listen 80;
    server_name api.taskflow.dev;

    client_max_body_size 10M;

    # Backend API
    location /api/ {
        proxy_pass http://backend;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # CORS headers
        add_header 'Access-Control-Allow-Origin' '$http_origin' always;
        add_header 'Access-Control-Allow-Methods' 'GET, POST, PUT, DELETE, OPTIONS' always;
        add_header 'Access-Control-Allow-Headers' 'Content-Type, Authorization' always;
    }

    # Frontend
    location / {
        proxy_pass http://frontend;
        proxy_set_header Host $host;
    }

    # SSL configuration
    listen 443 ssl http2;
    ssl_certificate /etc/ssl/certs/taskflow.crt;
    ssl_certificate_key /etc/ssl/private/taskflow.key;
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_ciphers HIGH:!aNULL:!MD5;
}

# Redirect HTTP to HTTPS
server {
    listen 80;
    server_name api.taskflow.dev;
    return 301 https://$server_name$request_uri;
}
```

### Health Checks

**Backend health check:**
```bash
curl http://localhost:8000/docs
```

**Database health check:**
```bash
psql -U taskflow_user -d taskflow_db -c "SELECT 1"
```

**Application health check:**
```bash
curl http://localhost:8000/api/v1/health
```

### Database Backups

**Automated backup script:**

```bash
#!/bin/bash
# backup.sh
BACKUP_DIR="/backups/taskflow"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

pg_dump -U taskflow_user -d taskflow_db > $BACKUP_DIR/taskflow_$DATE.sql

# Keep only last 7 days
find $BACKUP_DIR -name "taskflow_*.sql" -mtime +7 -delete

echo "Backup completed: taskflow_$DATE.sql"
```

Schedule with cron:
```bash
0 2 * * * /path/to/backup.sh  # Daily at 2 AM
```

### Monitor and Logs

**View logs:**
```bash
docker-compose logs -f backend
docker-compose logs -f frontend
```

**Log aggregation:**
```bash
# Using ELK Stack or CloudWatch
docker logs --tail 100 taskflow-backend
```

---

## Troubleshooting

### Database Connection Issues

**Error**: `could not connect to server`

**Solution:**
```bash
# Verify PostgreSQL is running
sudo service postgresql status

# Check connection parameters
psql -U taskflow_user -d taskflow_db -h localhost

# View PostgreSQL logs
tail -f /var/log/postgresql/postgresql.log
```

### Port Already in Use

**Error**: `Address already in use`

**Solution:**
```bash
# Find process using port 8000
lsof -i :8000

# Kill process
kill -9 <PID>

# Or use different port
uvicorn app.main:app --reload --port 8001
```

### Migration Issues

**Error**: `alembic.util.exc.CommandError: Can't locate revision`

**Solution:**
```bash
# Reset migrations (development only)
alembic downgrade base
alembic upgrade head

# Or check migration status
alembic history
```

### Docker Permission Denied

**Error**: `permission denied while trying to connect to Docker daemon`

**Solution:**
```bash
sudo usermod -aG docker $USER
newgrp docker
docker ps  # Test
```

### Environment Variables Not Loading

**Solution:**
```bash
# Verify .env file exists
ls -la .env

# Check syntax
cat .env

# Reload environment
source venv/bin/activate
export $(cat .env | xargs)
```

### Frontend API Connection Issues

**Error**: `GET http://localhost:8000/api/v1/... 404`

**Solution:**
```bash
# Check VITE_API_URL in .env.local
cat frontend/.env.local

# Verify backend is running
curl http://localhost:8000/docs

# Check CORS configuration
curl -H "Origin: http://localhost:5173" http://localhost:8000/docs -v
```

### Memory Issues

**Error**: `MemoryError` or container killed

**Solution:**
```bash
# Increase Docker memory limit
docker update --memory 2g taskflow-backend

# Monitor memory usage
docker stats taskflow-backend

# Check Python memory
ps aux | grep python
```

---

## Performance Optimization

### Database Optimization

```bash
# Analyze query performance
EXPLAIN ANALYZE SELECT * FROM tasks WHERE board_id = 1;

# Vacuum and analyze
VACUUM ANALYZE;
```

### Frontend Optimization

```bash
# Build analysis
npm run build -- --mode analyze

# Check bundle size
npm run build && du -sh dist/
```

### Backend Optimization

```bash
# Profile with cProfile
python -m cProfile -s cumulative app/main.py

# Load test
ab -n 1000 -c 100 http://localhost:8000/api/v1/projects
```

---

## Monitoring & Alerts

### Prometheus Metrics

Add to backend:
```python
from prometheus_client import Counter, Histogram

request_count = Counter('requests_total', 'Total requests')
request_duration = Histogram('request_duration_seconds', 'Request duration')
```

### Sentry Error Tracking

```python
import sentry_sdk

sentry_sdk.init(
    dsn="https://your-sentry-dsn@sentry.io/project",
    traces_sample_rate=1.0
)
```

---

**Last Updated**: January 2024  
**Version**: 1.0.0
