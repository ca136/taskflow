# TaskFlow API Documentation

## Base URL

```
http://localhost:8000
```

## Authentication

All authenticated endpoints require an `Authorization` header with a Bearer token:

```
Authorization: Bearer <token>
```

## Response Format

### Success Response
```json
{
  "status": "success",
  "data": { /* response data */ },
  "message": "Operation successful"
}
```

### Error Response
```json
{
  "detail": "Error description",
  "status_code": 400,
  "error_type": "BadRequest"
}
```

## Endpoints

### Health Check

#### GET /health
Check if the API is running.

**Response (200):**
```json
{
  "status": "ok"
}
```

---

## Authentication Endpoints

### POST /api/auth/register
Register a new user.

**Request Body:**
```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "secure_password"
}
```

**Response (201):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "created_at": "2024-01-15T10:30:00Z"
}
```

**Error (400):**
```json
{
  "detail": "Username already exists",
  "status_code": 400
}
```

### POST /api/auth/login
Login a user and receive a token.

**Request Body:**
```json
{
  "username": "john_doe",
  "password": "secure_password"
}
```

**Response (200):**
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIs...",
  "token_type": "bearer",
  "user": {
    "id": 1,
    "username": "john_doe",
    "email": "john@example.com"
  }
}
```

**Error (401):**
```json
{
  "detail": "Invalid credentials",
  "status_code": 401
}
```

### GET /api/users/me
Get current authenticated user.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "username": "john_doe",
  "email": "john@example.com",
  "created_at": "2024-01-15T10:30:00Z"
}
```

---

## Projects Endpoints

### GET /api/projects
List all projects for the current user.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `skip` (int, optional): Number of items to skip (default: 0)
- `limit` (int, optional): Number of items to return (default: 10)

**Response (200):**
```json
[
  {
    "id": 1,
    "name": "Q1 Planning",
    "description": "Q1 2024 roadmap planning",
    "owner_id": 1,
    "created_at": "2024-01-10T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
]
```

### POST /api/projects
Create a new project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Q1 Planning",
  "description": "Q1 2024 roadmap planning"
}
```

**Response (201):**
```json
{
  "id": 1,
  "name": "Q1 Planning",
  "description": "Q1 2024 roadmap planning",
  "owner_id": 1,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### GET /api/projects/{id}
Get a specific project by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Q1 Planning",
  "description": "Q1 2024 roadmap planning",
  "owner_id": 1,
  "created_at": "2024-01-10T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "tasks": [
    {
      "id": 1,
      "title": "Setup backend",
      "description": "Set up FastAPI backend",
      "status": "in_progress",
      "project_id": 1,
      "assigned_to_id": 1,
      "created_at": "2024-01-10T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ]
}
```

**Error (404):**
```json
{
  "detail": "Project not found",
  "status_code": 404
}
```

### PUT /api/projects/{id}
Update a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "name": "Q1 Planning - Updated",
  "description": "Updated Q1 2024 roadmap"
}
```

**Response (200):**
```json
{
  "id": 1,
  "name": "Q1 Planning - Updated",
  "description": "Updated Q1 2024 roadmap",
  "owner_id": 1,
  "created_at": "2024-01-10T10:30:00Z",
  "updated_at": "2024-01-16T14:20:00Z"
}
```

### DELETE /api/projects/{id}
Delete a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (204):**
No content

---

## Tasks Endpoints

### GET /api/projects/{project_id}/tasks
List all tasks in a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Query Parameters:**
- `status` (string, optional): Filter by status (todo, in_progress, done)
- `assigned_to` (int, optional): Filter by assigned user ID
- `skip` (int, optional): Number of items to skip
- `limit` (int, optional): Number of items to return

**Response (200):**
```json
[
  {
    "id": 1,
    "title": "Setup backend",
    "description": "Set up FastAPI backend with authentication",
    "status": "in_progress",
    "project_id": 1,
    "assigned_to_id": 1,
    "created_at": "2024-01-10T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  {
    "id": 2,
    "title": "Create React components",
    "description": "Create reusable UI components",
    "status": "todo",
    "project_id": 1,
    "assigned_to_id": null,
    "created_at": "2024-01-12T10:30:00Z",
    "updated_at": "2024-01-12T10:30:00Z"
  }
]
```

### POST /api/projects/{project_id}/tasks
Create a new task in a project.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Setup backend",
  "description": "Set up FastAPI backend with authentication",
  "status": "todo",
  "assigned_to_id": 1
}
```

**Response (201):**
```json
{
  "id": 1,
  "title": "Setup backend",
  "description": "Set up FastAPI backend with authentication",
  "status": "todo",
  "project_id": 1,
  "assigned_to_id": 1,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### GET /api/tasks/{id}
Get a specific task by ID.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Setup backend",
  "description": "Set up FastAPI backend with authentication",
  "status": "in_progress",
  "project_id": 1,
  "assigned_to_id": 1,
  "created_at": "2024-01-10T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

### PUT /api/tasks/{id}
Update a task.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "title": "Setup backend",
  "description": "Set up FastAPI backend with authentication and database",
  "status": "in_progress",
  "assigned_to_id": 1
}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Setup backend",
  "description": "Set up FastAPI backend with authentication and database",
  "status": "in_progress",
  "project_id": 1,
  "assigned_to_id": 1,
  "created_at": "2024-01-10T10:30:00Z",
  "updated_at": "2024-01-16T14:20:00Z"
}
```

### PATCH /api/tasks/{id}/status
Update only the task status.

**Headers:**
```
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "status": "done"
}
```

**Response (200):**
```json
{
  "id": 1,
  "title": "Setup backend",
  "description": "Set up FastAPI backend with authentication",
  "status": "done",
  "project_id": 1,
  "assigned_to_id": 1,
  "created_at": "2024-01-10T10:30:00Z",
  "updated_at": "2024-01-16T14:30:00Z"
}
```

### DELETE /api/tasks/{id}
Delete a task.

**Headers:**
```
Authorization: Bearer <token>
```

**Response (204):**
No content

---

## Status Codes

| Code | Meaning |
|------|---------|
| 200 | OK - Request successful |
| 201 | Created - Resource created successfully |
| 204 | No Content - Successful deletion |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 422 | Unprocessable Entity - Validation error |
| 500 | Internal Server Error - Server error |

---

## Error Examples

### Missing Authentication
```
Status: 401
{
  "detail": "Not authenticated",
  "status_code": 401
}
```

### Validation Error
```
Status: 422
{
  "detail": [
    {
      "loc": ["body", "title"],
      "msg": "field required",
      "type": "value_error.missing"
    }
  ]
}
```

### Resource Not Found
```
Status: 404
{
  "detail": "Task not found",
  "status_code": 404
}
```

---

## Rate Limiting

API endpoints are rate limited to prevent abuse:
- 100 requests per minute per IP

Rate limit information is included in response headers:
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 99
X-RateLimit-Reset: 1705334400
```

---

## Interactive Documentation

When running the backend locally, visit:
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

These provide interactive API exploration and testing.
