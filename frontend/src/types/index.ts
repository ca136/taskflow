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

// Task Types - Re-export from dedicated task types file
export {
  Task,
  TaskStatus,
  CreateTaskRequest,
  UpdateTaskRequest,
  TaskWithBoard,
  TaskStatusType,
} from './task'

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
