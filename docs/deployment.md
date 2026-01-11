# TaskFlow Deployment Guide

## Deployment Overview

TaskFlow can be deployed to various platforms. This guide covers deployment to popular cloud providers.

## Pre-Deployment Checklist

- [ ] All tests pass
- [ ] No console warnings or errors
- [ ] Environment variables documented
- [ ] Security review completed
- [ ] Database migrations ready
- [ ] API documentation updated
- [ ] Frontend build optimized

## Environment Configuration

### Required Environment Variables

#### Backend
```env
# Database
DATABASE_URL=postgresql://user:password@host/dbname
DATABASE_POOL_SIZE=20
DATABASE_MAX_OVERFLOW=10

# Security
SECRET_KEY=your-production-secret-key
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

# CORS
CORS_ORIGINS=https://yourdomain.com,https://app.yourdomain.com

# Server
ENVIRONMENT=production
DEBUG=false
LOG_LEVEL=info

# Optional: Email
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

#### Frontend
```env
VITE_API_URL=https://api.yourdomain.com/api
VITE_APP_NAME=TaskFlow
VITE_LOG_LEVEL=error
```

## Deployment Options

### Option 1: Heroku Deployment

#### Prerequisites
- Heroku account
- Heroku CLI installed

#### Frontend Deployment

1. Create `Procfile` in frontend:
   ```
   web: npm run build && npm run preview
   ```

2. Create app and deploy:
   ```bash
   cd frontend
   heroku create taskflow-frontend
   git push heroku main
   ```

#### Backend Deployment

1. Create `Procfile` in backend:
   ```
   web: uvicorn app.main:app --host 0.0.0.0 --port $PORT
   ```

2. Create `runtime.txt`:
   ```
   python-3.11.0
   ```

3. Deploy:
   ```bash
   cd backend
   heroku create taskflow-backend
   
   # Set environment variables
   heroku config:set SECRET_KEY=your-secret-key
   heroku config:set DATABASE_URL=your-db-url
   
   # Add PostgreSQL addon
   heroku addons:create heroku-postgresql:standard-0
   
   git push heroku main
   ```

### Option 2: AWS Deployment

#### Frontend - S3 + CloudFront

1. Build frontend:
   ```bash
   cd frontend
   npm run build
   ```

2. Upload to S3:
   ```bash
   aws s3 sync dist/ s3://taskflow-frontend-bucket/
   ```

3. Set up CloudFront distribution pointing to S3 bucket

#### Backend - AWS Elastic Beanstalk

1. Install EB CLI:
   ```bash
   pip install awsebcli
   ```

2. Initialize Elastic Beanstalk:
   ```bash
   cd backend
   eb init -p python-3.11 taskflow-backend
   ```

3. Create environment and deploy:
   ```bash
   eb create production
   eb deploy
   ```

4. Configure environment variables:
   ```bash
   eb setenv SECRET_KEY=your-secret-key DATABASE_URL=your-db-url
   ```

### Option 3: Docker Containerization

#### Backend Dockerfile

```dockerfile
# backend/Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements and install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

#### Frontend Dockerfile

```dockerfile
# frontend/Dockerfile
FROM node:20-alpine as builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:20-alpine

WORKDIR /app

RUN npm install -g serve

COPY --from=builder /app/dist ./dist

EXPOSE 3000

CMD ["serve", "-s", "dist", "-l", "3000"]
```

#### Docker Compose

```yaml
# docker-compose.yml
version: '3.8'

services:
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
    environment:
      - VITE_API_URL=http://localhost:8000/api
    depends_on:
      - backend

  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - DATABASE_URL=postgresql://taskflow:password@db:5432/taskflow
      - SECRET_KEY=dev-secret-key
    depends_on:
      - db

  db:
    image: postgres:15-alpine
    environment:
      - POSTGRES_USER=taskflow
      - POSTGRES_PASSWORD=password
      - POSTGRES_DB=taskflow
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"

volumes:
  postgres_data:
```

Deploy with Docker Compose:
```bash
docker-compose up -d
```

### Option 4: DigitalOcean App Platform

1. Push code to GitHub
2. Connect repository to DigitalOcean App Platform
3. Configure build and run commands:
   - Frontend: `npm install && npm run build`
   - Backend: `pip install -r requirements.txt && uvicorn app.main:app`
4. Add PostgreSQL database component
5. Deploy

## Database Migrations

### Production Migrations

Before deploying backend changes that modify the database:

1. Create migration:
   ```bash
   cd backend
   alembic revision --autogenerate -m "description"
   ```

2. Review migration file in `alembic/versions/`

3. Test locally:
   ```bash
   alembic upgrade head
   ```

4. Commit to version control

5. On production, run before deploying code:
   ```bash
   alembic upgrade head
   ```

## SSL/TLS Certificate

### Let's Encrypt with Certbot

```bash
# Install Certbot
sudo apt-get install certbot python3-certbot-nginx

# Get certificate
sudo certbot certonly --standalone -d yourdomain.com -d api.yourdomain.com

# Configure auto-renewal
sudo certbot renew --dry-run
```

## Monitoring and Logging

### Backend Logging

Configure logging in production:

```python
# app/core/config.py
import logging.config

LOGGING_CONFIG = {
    "version": 1,
    "formatters": {
        "default": {
            "format": "%(asctime)s - %(name)s - %(levelname)s - %(message)s"
        }
    },
    "handlers": {
        "console": {
            "class": "logging.StreamHandler",
            "formatter": "default"
        },
        "file": {
            "class": "logging.FileHandler",
            "filename": "app.log",
            "formatter": "default"
        }
    },
    "root": {
        "level": "INFO",
        "handlers": ["console", "file"]
    }
}

logging.config.dictConfig(LOGGING_CONFIG)
```

### Frontend Error Tracking

Use Sentry for error tracking:

```typescript
// src/main.tsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "https://key@sentry.io/project",
  environment: "production",
  tracesSampleRate: 0.1,
});
```

### Monitoring Services

Consider using:
- **Datadog** - Application performance monitoring
- **New Relic** - Infrastructure and application monitoring
- **CloudWatch** - AWS native monitoring
- **Prometheus** - Metrics collection
- **Grafana** - Metrics visualization

## Performance Optimization

### Frontend Optimization

1. Enable gzip compression:
   ```nginx
   gzip on;
   gzip_types text/plain text/css application/json application/javascript;
   ```

2. Set cache headers:
   ```nginx
   location ~* \.(js|css)$ {
     expires 1y;
     add_header Cache-Control "public, immutable";
   }
   ```

3. Use CDN for static assets

### Backend Optimization

1. Enable query caching:
   ```python
   from functools import lru_cache
   
   @lru_cache(maxsize=128)
   def get_project(project_id: str):
       ...
   ```

2. Configure database connection pooling:
   ```python
   engine = create_engine(
       DATABASE_URL,
       pool_size=20,
       max_overflow=10,
       pool_pre_ping=True
   )
   ```

3. Use async endpoints for I/O operations

## Scaling Strategies

### Horizontal Scaling

1. **Load Balancing**: Use Nginx or HAProxy
2. **API Gateway**: Amazon API Gateway or Kong
3. **Database Replication**: Set up read replicas
4. **Caching Layer**: Redis for session and data caching

### Vertical Scaling

1. Increase server resources (CPU, RAM)
2. Optimize database queries
3. Implement pagination
4. Use CDN for static assets

## Backup and Disaster Recovery

### Database Backups

```bash
# Manual backup
pg_dump taskflow > backup.sql

# Automated backups (AWS RDS)
aws rds create-db-snapshot --db-instance-identifier taskflow-prod

# Restore from backup
psql taskflow < backup.sql
```

### Version Control

- Always tag releases
- Maintain changelog
- Document breaking changes

## Rollback Procedures

### Frontend Rollback

```bash
# Revert to previous version
git checkout <previous-commit>
npm run build
# Redeploy
```

### Backend Rollback

```bash
# Revert code
git checkout <previous-commit>

# If database migrations need rollback
alembic downgrade -1

# Redeploy
```

## Security in Production

1. **Use HTTPS only** - Redirect HTTP to HTTPS
2. **Environment variables** - Keep secrets secure
3. **CORS** - Restrict to known domains
4. **Rate limiting** - Protect against abuse
5. **SQL injection prevention** - Use ORM (already using SQLAlchemy)
6. **CSRF protection** - Enable CSRF token validation
7. **Security headers** - Add security headers

### Security Headers

```nginx
add_header X-Content-Type-Options "nosniff" always;
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

## Troubleshooting

### Issue: Slow API Response

1. Check database query performance
2. Add database indexes
3. Implement caching
4. Check server resources

### Issue: Frontend Build Failures

```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
npm run build
```

### Issue: Database Connection Errors

1. Verify connection string
2. Check database is running
3. Verify credentials
4. Check network connectivity

---

For more information, see:
- [Development Guide](development.md)
- [Architecture Guide](architecture.md)
