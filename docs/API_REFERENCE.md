# TaskFlow API Reference

Complete API endpoint documentation for TaskFlow's RESTful backend. All endpoints return JSON and require `Content-Type: application/json` headers for POST/PUT requests.

**Base URL**: `http://localhost:8000/api/v1`  
**Documentation**: `http://localhost:8000/docs` (Swagger UI)

## Table of Contents

1. [Authentication](#authentication)
2. [Users](#users)
3. [Projects](#projects)
4. [Boards](#boards)
5. [Tasks](#tasks)
6. [Response Format](#response-format)
7. [Status Codes](#status-codes)
8. [Error Handling](#error-handling)

---

## Authentication

### Register User

Create a new user account.

```
POST /auth/register
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password_123",
  "full_name": "John Doe"
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z"
  },
  "message": "User registered successfully"
}
```

**Validation Rules:**
- Email must be valid format
- Email must be unique
- Password must be at least 8 characters
- Full name is required

---

### Login

Authenticate and get access token.

```
POST /auth/login
```

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "secure_password_123"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer",
    "user": {
      "id": 1,
      "email": "user@example.com",
      "full_name": "John Doe"
    }
  },
  "message": "Login successful"
}
```

**Token Usage:**
Include in all subsequent requests:
```
Authorization: Bearer {access_token}
```

**Error Responses:**
- `401 Unauthorized`: Invalid credentials
- `400 Bad Request`: Missing email or password

---

### Refresh Token

Get a new access token using refresh token.

```
POST /auth/refresh
```

**Headers:**
```
Authorization: Bearer {refresh_token}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "bearer"
  }
}
```

---

### Logout

Invalidate the current token.

```
POST /auth/logout
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "message": "Logout successful"
}
```

---

## Users

### Get Current User

Retrieve authenticated user profile.

```
GET /users/me
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "John Doe",
    "is_active": true,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

---

### Update User Profile

Update current user's information.

```
PUT /users/me
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "full_name": "Jane Doe",
  "password": "new_secure_password_123"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "email": "user@example.com",
    "full_name": "Jane Doe",
    "is_active": true,
    "updated_at": "2024-01-15T11:30:00Z"
  },
  "message": "Profile updated successfully"
}
```

---

### Get User by ID

Retrieve another user's public profile.

```
GET /users/{id}
```

**Parameters:**
- `id` (path, required): User ID

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "id": 2,
    "email": "other@example.com",
    "full_name": "Jane Smith",
    "is_active": true,
    "created_at": "2024-01-16T10:30:00Z"
  }
}
```

---

## Projects

### List User's Projects

Get all projects owned by the authenticated user.

```
GET /projects
```

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `skip` (optional, default: 0): Number of records to skip
- `limit` (optional, default: 10, max: 100): Number of records to return

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "E-Commerce Platform",
      "description": "Online shopping system",
      "owner_id": 1,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "name": "Mobile App",
      "description": "iOS and Android app",
      "owner_id": 1,
      "created_at": "2024-01-16T10:30:00Z",
      "updated_at": "2024-01-16T10:30:00Z"
    }
  ],
  "meta": {
    "total": 2,
    "skip": 0,
    "limit": 10
  }
}
```

---

### Create Project

Create a new project.

```
POST /projects
```

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "New Project",
  "description": "Project description"
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "data": {
    "id": 3,
    "name": "New Project",
    "description": "Project description",
    "owner_id": 1,
    "created_at": "2024-01-17T10:30:00Z",
    "updated_at": "2024-01-17T10:30:00Z"
  },
  "message": "Project created successfully"
}
```

**Validation Rules:**
- Name is required, max 255 characters
- Description is optional
- Owner is set to authenticated user

---

### Get Project Details

Retrieve a specific project.

```
GET /projects/{id}
```

**Parameters:**
- `id` (path, required): Project ID

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "E-Commerce Platform",
    "description": "Online shopping system",
    "owner_id": 1,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-15T10:30:00Z"
  }
}
```

**Error Responses:**
- `404 Not Found`: Project doesn't exist
- `403 Forbidden`: Not project owner

---

### Update Project

Update project details.

```
PUT /projects/{id}
```

**Parameters:**
- `id` (path, required): Project ID

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Updated Project Name",
  "description": "Updated description"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "name": "Updated Project Name",
    "description": "Updated description",
    "owner_id": 1,
    "updated_at": "2024-01-17T11:30:00Z"
  },
  "message": "Project updated successfully"
}
```

---

### Delete Project

Delete a project and all associated boards and tasks.

```
DELETE /projects/{id}
```

**Parameters:**
- `id` (path, required): Project ID

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `204 No Content`

---

## Boards

### List Project Boards

Get all boards in a project.

```
GET /projects/{project_id}/boards
```

**Parameters:**
- `project_id` (path, required): Project ID

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `skip` (optional, default: 0)
- `limit` (optional, default: 10, max: 100)

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "name": "To Do",
      "project_id": 1,
      "display_order": 0,
      "created_at": "2024-01-15T10:30:00Z"
    },
    {
      "id": 2,
      "name": "In Progress",
      "project_id": 1,
      "display_order": 1,
      "created_at": "2024-01-15T10:30:00Z"
    }
  ],
  "meta": {
    "total": 2,
    "skip": 0,
    "limit": 10
  }
}
```

---

### Create Board

Create a new board in a project.

```
POST /projects/{project_id}/boards
```

**Parameters:**
- `project_id` (path, required): Project ID

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Done",
  "display_order": 2
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "data": {
    "id": 3,
    "name": "Done",
    "project_id": 1,
    "display_order": 2,
    "created_at": "2024-01-17T10:30:00Z"
  },
  "message": "Board created successfully"
}
```

---

### Update Board

Update board information.

```
PUT /boards/{id}
```

**Parameters:**
- `id` (path, required): Board ID

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Completed",
  "display_order": 3
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "id": 3,
    "name": "Completed",
    "project_id": 1,
    "display_order": 3,
    "updated_at": "2024-01-17T11:30:00Z"
  },
  "message": "Board updated successfully"
}
```

---

### Delete Board

Delete a board and all its tasks.

```
DELETE /boards/{id}
```

**Parameters:**
- `id` (path, required): Board ID

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `204 No Content`

---

## Tasks

### List Board Tasks

Get all tasks in a board.

```
GET /boards/{board_id}/tasks
```

**Parameters:**
- `board_id` (path, required): Board ID

**Headers:**
```
Authorization: Bearer {access_token}
```

**Query Parameters:**
- `skip` (optional, default: 0)
- `limit` (optional, default: 20, max: 100)
- `status` (optional): Filter by status (todo, in_progress, done)
- `priority` (optional): Filter by priority (low, medium, high)
- `assigned_to` (optional): Filter by assignee user ID

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "Design landing page",
      "description": "Create responsive landing page mockup",
      "status": "in_progress",
      "priority": "high",
      "assigned_to": 1,
      "board_id": 2,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-16T14:30:00Z"
    },
    {
      "id": 2,
      "title": "Setup database",
      "description": "Configure PostgreSQL and migrations",
      "status": "todo",
      "priority": "medium",
      "assigned_to": null,
      "board_id": 1,
      "created_at": "2024-01-16T10:30:00Z"
    }
  ],
  "meta": {
    "total": 2,
    "skip": 0,
    "limit": 20
  }
}
```

---

### Create Task

Create a new task in a board.

```
POST /boards/{board_id}/tasks
```

**Parameters:**
- `board_id` (path, required): Board ID

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Review pull requests",
  "description": "Review and approve pending PRs",
  "priority": "high",
  "assigned_to": 2
}
```

**Response:** `201 Created`
```json
{
  "status": "success",
  "data": {
    "id": 3,
    "title": "Review pull requests",
    "description": "Review and approve pending PRs",
    "status": "todo",
    "priority": "high",
    "assigned_to": 2,
    "board_id": 1,
    "created_at": "2024-01-17T10:30:00Z"
  },
  "message": "Task created successfully"
}
```

**Valid Priority Values:**
- `low`
- `medium` (default)
- `high`

---

### Get Task Details

Retrieve a specific task.

```
GET /tasks/{id}
```

**Parameters:**
- `id` (path, required): Task ID

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "Design landing page",
    "description": "Create responsive landing page mockup",
    "status": "in_progress",
    "priority": "high",
    "assigned_to": 1,
    "board_id": 2,
    "created_at": "2024-01-15T10:30:00Z",
    "updated_at": "2024-01-16T14:30:00Z"
  }
}
```

---

### Update Task

Update task details.

```
PUT /tasks/{id}
```

**Parameters:**
- `id` (path, required): Task ID

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated title",
  "description": "Updated description",
  "status": "in_progress",
  "priority": "high",
  "assigned_to": 1
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "Updated title",
    "description": "Updated description",
    "status": "in_progress",
    "priority": "high",
    "assigned_to": 1,
    "board_id": 2,
    "updated_at": "2024-01-17T11:30:00Z"
  },
  "message": "Task updated successfully"
}
```

---

### Update Task Status (Quick Update)

Update only the task status.

```
PATCH /tasks/{id}/status
```

**Parameters:**
- `id` (path, required): Task ID

**Headers:**
```
Authorization: Bearer {access_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "done"
}
```

**Response:** `200 OK`
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "Design landing page",
    "status": "done",
    "updated_at": "2024-01-17T12:00:00Z"
  },
  "message": "Task status updated successfully"
}
```

**Valid Status Values:**
- `todo`
- `in_progress`
- `done`

---

### Delete Task

Delete a task.

```
DELETE /tasks/{id}
```

**Parameters:**
- `id` (path, required): Task ID

**Headers:**
```
Authorization: Bearer {access_token}
```

**Response:** `204 No Content`

---

## Response Format

### Standard Success Response

```json
{
  "status": "success",
  "data": { /* resource data */ },
  "message": "Operation successful"
}
```

### Standard Error Response

```json
{
  "detail": "Error message",
  "status_code": 400,
  "error_type": "VALIDATION_ERROR"
}
```

### Pagination Response

```json
{
  "status": "success",
  "data": [ /* array of resources */ ],
  "meta": {
    "total": 42,
    "skip": 0,
    "limit": 10
  }
}
```

---

## Status Codes

| Code | Meaning | Description |
|------|---------|-------------|
| `200` | OK | Request succeeded |
| `201` | Created | Resource created successfully |
| `204` | No Content | Request succeeded, no content returned |
| `400` | Bad Request | Invalid request data or validation error |
| `401` | Unauthorized | Missing or invalid authentication |
| `403` | Forbidden | Authenticated but not authorized for resource |
| `404` | Not Found | Resource doesn't exist |
| `409` | Conflict | Duplicate email or resource already exists |
| `422` | Unprocessable Entity | Validation error in request body |
| `500` | Server Error | Internal server error |

---

## Error Handling

### Validation Errors

```json
{
  "detail": [
    {
      "loc": ["body", "email"],
      "msg": "invalid email format",
      "type": "value_error.email"
    }
  ]
}
```

### Authentication Errors

```json
{
  "detail": "Invalid credentials",
  "status_code": 401,
  "error_type": "UNAUTHORIZED"
}
```

### Authorization Errors

```json
{
  "detail": "Not authorized to access this resource",
  "status_code": 403,
  "error_type": "FORBIDDEN"
}
```

### Not Found Errors

```json
{
  "detail": "Project not found",
  "status_code": 404,
  "error_type": "NOT_FOUND"
}
```

---

## Rate Limiting (Future)

The API will implement rate limiting:

**Headers:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642425600
```

**Response (when limit exceeded):**
```json
{
  "detail": "Rate limit exceeded",
  "status_code": 429
}
```

---

## Pagination Guidelines

### Query Parameters

- `skip`: Number of records to skip (default: 0)
- `limit`: Number of records per page (default: 10, max: 100)

### Example Request

```
GET /projects?skip=20&limit=10
```

### Response Metadata

```json
{
  "meta": {
    "total": 42,
    "skip": 20,
    "limit": 10
  }
}
```

---

## Examples with cURL

### Login
```bash
curl -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"password"}'
```

### Create Project
```bash
curl -X POST http://localhost:8000/api/v1/projects \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"name":"My Project","description":"Test"}'
```

### List Tasks
```bash
curl http://localhost:8000/api/v1/boards/1/tasks \
  -H "Authorization: Bearer {token}"
```

### Update Task Status
```bash
curl -X PATCH http://localhost:8000/api/v1/tasks/1/status \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{"status":"done"}'
```

---

## Interactive Documentation

Test endpoints directly in the browser:

- **Swagger UI**: http://localhost:8000/docs
- **ReDoc**: http://localhost:8000/redoc
- **OpenAPI JSON**: http://localhost:8000/openapi.json

---

**Last Updated**: January 2024  
**API Version**: v1  
**Status**: Active
