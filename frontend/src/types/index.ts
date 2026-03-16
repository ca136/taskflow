// User Types
export interface User {
  id: string
  email: string
  username: string
  full_name: string
  is_active: boolean
  created_at: string
  updated_at: string
}

// Project Types
export interface Project {
  id: string
  name: string
  description: string | null
  owner_id: string
  created_at: string
  updated_at: string
}

// Board Types
export interface Board {
  id: string
  project_id: string
  name: string
  position: number
  created_at: string
}

// Label Types
export interface Label {
  id: string
  name: string
  color: string
  project_id: string
}

// Checklist Types
export interface ChecklistItem {
  id: string
  checklist_id: string
  content: string
  is_completed: boolean
  position: number
}

export interface Checklist {
  id: string
  task_id: string
  title: string
  position: number
  items: ChecklistItem[]
}

// Comment Types
export interface Comment {
  id: string
  task_id: string
  user_id: string
  content: string
  author_name: string
  created_at: string
  updated_at: string
}

// Activity Log Types
export interface ActivityLog {
  id: string
  task_id: string
  user_id: string | null
  action: string
  details: string | null
  user_name: string | null
  created_at: string
}

// Task Types
export interface Task {
  id: string
  board_id: string
  title: string
  description: string | null
  assignee_id: string | null
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in_progress' | 'done'
  position: number
  due_date: string | null
  cover_color: string | null
  is_archived: boolean
  labels: Label[]
  checklists: Checklist[]
  assignee_name: string | null
  created_at: string
  updated_at: string
}

// Auth Types
export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  email: string
  username: string
  full_name: string
  password: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
