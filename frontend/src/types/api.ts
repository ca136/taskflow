/**
 * API Model Types
 * TypeScript interfaces matching backend Pydantic schemas
 */

// ============================================================================
// Enums
// ============================================================================

export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in_progress',
  DONE = 'done',
}

// ============================================================================
// User API Models
// ============================================================================

export interface UserBase {
  email: string
  name: string
}

export interface UserCreate extends UserBase {
  password: string
}

export interface UserUpdate {
  name?: string
  email?: string
}

export interface UserResponse extends UserBase {
  id: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// ============================================================================
// Project API Models
// ============================================================================

export interface ProjectBase {
  name: string
  description?: string | null
}

export interface ProjectCreate extends ProjectBase {}

export interface ProjectUpdate {
  name?: string
  description?: string | null
}

export interface ProjectResponse extends ProjectBase {
  id: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface ProjectList extends ProjectResponse {}

// ============================================================================
// Task API Models
// ============================================================================

export interface TaskBase {
  title: string
  description?: string | null
  status: TaskStatus
  assigned_to?: number | null
  due_date?: string | null
}

export interface TaskCreate extends TaskBase {}

export interface TaskUpdate {
  title?: string
  description?: string | null
  status?: TaskStatus
  assigned_to?: number | null
  due_date?: string | null
}

export interface TaskResponse extends TaskBase {
  id: number
  project_id: number
  created_by: number
  created_at: string
  updated_at: string
}

// ============================================================================
// Authentication API Models
// ============================================================================

export interface LoginRequest {
  username: string
  password: string
}

export interface TokenPayload {
  sub: string
  exp?: number
  iat?: number
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user: UserResponse
}

// ============================================================================
// Error Models
// ============================================================================

export interface ApiError {
  detail: string
}

export interface ValidationError {
  loc: (string | number)[]
  msg: string
  type: string
}

export interface ApiErrorResponse {
  detail: string | ValidationError[]
}

// ============================================================================
// Generic API Response Wrapper
// ============================================================================

export interface ApiListResponse<T> {
  items: T[]
  total: number
  skip?: number
  limit?: number
}

export interface ApiPaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  page_size: number
}
