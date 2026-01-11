// Re-export all task types from task.ts
export type {
  Task,
  TaskStatus,
  TaskPriority,
  TaskFormInput,
  TaskFilter,
  TaskCreatePayload,
  TaskUpdatePayload,
  TaskListResponse,
  TaskWithComputedFields,
  TaskBulkActionPayload,
  TaskStatistics,
} from './task'

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

// API Response Types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
}
