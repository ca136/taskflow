# TaskFlow API Documentation

## Base URL

```
http://localhost:8000/api
```

For production, replace `localhost:8000` with your deployment domain.

## Authentication

TaskFlow uses JWT (JSON Web Token) for API authentication.

### Obtaining a Token

1. Register a new account:
   ```bash
   POST /auth/register
   ```

2. Login to get a token:
   ```bash
   POST /auth/login
   ```

3. Include the token in the `Authorization` header for all authenticated requests:
   ```
   Authorization: Bearer <your_jwt_token>
   ```

## Error Handling

All errors follow a consistent format:

```json
{
  "detail": "Error message describing what went wrong",
  "error_code": "SPECIFIC_ERROR_CODE",
  "status_code": 400
}
```

### Common Status Codes
- `200 OK` - Request successful
- `201 Created` - Resource created successfully
- `204 No Content` - Request successful, no content to return
- `400 Bad Request` - Invalid request parameters
- `401 Unauthorized` - Authentication required or invalid
- `403 Forbidden` - Insufficient permissions
- `404 Not Found` - Resource not found
- `409 Conflict` - Resource conflict (e.g., duplicate)
- `422 Unprocessable Entity` - Validation error
- `500 Internal Server Error` - Server error

## API Endpoints

### Authentication

#### Register User

```http
POST /auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "username": "john_doe",
  "password": "secure_password_123"
}
```

**Response (201 Created):**
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "username": "john_doe",
  "created_at": "2024-01-15T10:30:00Z"
}
```

#### Login User

```http
POST /auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "secure_password_123"
}
```

**Response (200 OK):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

#### Refresh Token

```http
POST /auth/refresh
Authorization: Bearer <refresh_token>
```

**Response (200 OK):**
```json
{
  "access_token": "eyJ0eXAiOiJKV1QiLCJhbGc...",
  "token_type": "bearer",
  "expires_in": 3600
}
```

#### Logout User

```http
POST /auth/logout
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

### Projects

#### List Projects

```http
GET /projects
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `skip` (integer) - Number of records to skip (pagination)
- `limit` (integer) - Maximum records to return (default: 10)
- `search` (string) - Search term for project names

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "project-uuid",
      "name": "Website Redesign",
      "description": "Redesign the company website",
      "owner_id": "user-uuid",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 10
}
```

#### Create Project

```http
POST /projects
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Website Redesign",
  "description": "Redesign the company website"
}
```

**Response (201 Created):**
```json
{
  "id": "project-uuid",
  "name": "Website Redesign",
  "description": "Redesign the company website",
  "owner_id": "user-uuid",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

#### Get Project Details

```http
GET /projects/{project_id}
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": "project-uuid",
  "name": "Website Redesign",
  "description": "Redesign the company website",
  "owner_id": "user-uuid",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z",
  "members": [
    {
      "id": "user-uuid",
      "username": "john_doe",
      "email": "user@example.com",
      "role": "admin"
    }
  ]
}
```

#### Update Project

```http
PUT /projects/{project_id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "name": "Website Redesign v2",
  "description": "Redesign the company website with new features"
}
```

**Response (200 OK):**
```json
{
  "id": "project-uuid",
  "name": "Website Redesign v2",
  "description": "Redesign the company website with new features",
  "owner_id": "user-uuid",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T12:00:00Z"
}
```

#### Delete Project

```http
DELETE /projects/{project_id}
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

### Tasks

#### List Project Tasks

```http
GET /projects/{project_id}/tasks
Authorization: Bearer <access_token>
```

**Query Parameters:**
- `skip` (integer) - Number of records to skip
- `limit` (integer) - Maximum records to return
- `status` (string) - Filter by status (todo, in_progress, done)
- `priority` (string) - Filter by priority (low, medium, high)
- `assignee_id` (string) - Filter by assignee

**Response (200 OK):**
```json
{
  "items": [
    {
      "id": "task-uuid",
      "title": "Design mockups",
      "description": "Create mockups for new design",
      "project_id": "project-uuid",
      "assignee_id": "user-uuid",
      "status": "in_progress",
      "priority": "high",
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-01-15T10:30:00Z"
    }
  ],
  "total": 1,
  "skip": 0,
  "limit": 10
}
```

#### Create Task

```http
POST /projects/{project_id}/tasks
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Design mockups",
  "description": "Create mockups for new design",
  "status": "todo",
  "priority": "high",
  "assignee_id": "user-uuid"
}
```

**Response (201 Created):**
```json
{
  "id": "task-uuid",
  "title": "Design mockups",
  "description": "Create mockups for new design",
  "project_id": "project-uuid",
  "assignee_id": "user-uuid",
  "status": "todo",
  "priority": "high",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

#### Get Task Details

```http
GET /tasks/{task_id}
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": "task-uuid",
  "title": "Design mockups",
  "description": "Create mockups for new design",
  "project_id": "project-uuid",
  "assignee_id": "user-uuid",
  "status": "in_progress",
  "priority": "high",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T12:00:00Z"
}
```

#### Update Task

```http
PUT /tasks/{task_id}
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "title": "Design mockups",
  "description": "Create mockups for new design",
  "status": "in_progress",
  "priority": "high",
  "assignee_id": "user-uuid"
}
```

**Response (200 OK):**
```json
{
  "id": "task-uuid",
  "title": "Design mockups",
  "description": "Create mockups for new design",
  "project_id": "project-uuid",
  "assignee_id": "user-uuid",
  "status": "in_progress",
  "priority": "high",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T12:00:00Z"
}
```

#### Delete Task

```http
DELETE /tasks/{task_id}
Authorization: Bearer <access_token>
```

**Response (204 No Content)**

### Users

#### Get Current User

```http
GET /users/me
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
{
  "id": "user-uuid",
  "email": "user@example.com",
  "username": "john_doe",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T10:30:00Z"
}
```

#### Update Profile

```http
PUT /users/me
Authorization: Bearer <access_token>
Content-Type: application/json

{
  "username": "john_doe",
  "email": "newemail@example.com"
}
```

**Response (200 OK):**
```json
{
  "id": "user-uuid",
  "email": "newemail@example.com",
  "username": "john_doe",
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-01-15T12:00:00Z"
}
```

#### Get Project Members

```http
GET /projects/{project_id}/members
Authorization: Bearer <access_token>
```

**Response (200 OK):**
```json
[
  {
    "id": "user-uuid",
    "username": "john_doe",
    "email": "john@example.com",
    "role": "admin"
  },
  {
    "id": "user-uuid-2",
    "username": "jane_smith",
    "email": "jane@example.com",
    "role": "member"
  }
]
```

## Data Types

### Enums

**Task Status:**
- `todo` - Task not started
- `in_progress` - Task currently being worked on
- `done` - Task completed

**Priority Levels:**
- `low` - Low priority
- `medium` - Medium priority (default)
- `high` - High priority

**Member Roles:**
- `admin` - Full permissions
- `member` - Can create and edit tasks
- `viewer` - Read-only access

## Rate Limiting

Currently, TaskFlow does not implement rate limiting in the development version. For production, consider implementing rate limiting (e.g., 100 requests per minute per user).

## CORS

The API is configured to accept requests from the frontend application. When deploying, ensure the `CORS_ORIGINS` environment variable is properly configured.

## Webhooks (Planned)

Future versions will support webhooks for real-time integrations with external tools.

## Batch Operations (Planned)

Future versions will support batch operations for updating multiple tasks at once.

---

## Example Workflows

### Complete Task Creation Workflow

1. **User logs in:**
   ```bash
   curl -X POST http://localhost:8000/api/auth/login \
     -H "Content-Type: application/json" \
     -d '{"email":"user@example.com","password":"password"}'
   ```

2. **List projects:**
   ```bash
   curl -X GET http://localhost:8000/api/projects \
     -H "Authorization: Bearer <token>"
   ```

3. **Create a task:**
   ```bash
   curl -X POST http://localhost:8000/api/projects/<project_id>/tasks \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>" \
     -d '{"title":"New Task","description":"Task description","priority":"high"}'
   ```

4. **Update task status:**
   ```bash
   curl -X PUT http://localhost:8000/api/tasks/<task_id> \
     -H "Content-Type: application/json" \
     -H "Authorization: Bearer <token>" \
     -d '{"status":"in_progress"}'
   ```

---

For more information, see:
- [Architecture Guide](architecture.md)
- [Development Guide](development.md)
