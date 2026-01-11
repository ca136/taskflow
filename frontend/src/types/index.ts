// User Types
export interface User {
  id: string
  email: string
  name: string
  avatar?: string
  createdAt: string
}

// Project Types
export interface Project {
  id: string
  name: string
  description: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

// Board Types
export interface Board {
  id: string
  projectId: string
  name: string
  order: number
  createdAt: string
}

// Task Types
export interface Task {
  id: string
  boardId: string
  title: string
  description?: string
  assignee?: string
  priority: 'low' | 'medium' | 'high'
  status: 'todo' | 'in-progress' | 'done'
  createdAt: string
  updatedAt: string
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
