/**
 * Task Types
 * Defines all TypeScript interfaces and types related to tasks in TaskFlow
 */

/**
 * Enum representing the possible status states of a task
 */
export enum TaskStatus {
  TODO = 'todo',
  IN_PROGRESS = 'in-progress',
  DONE = 'done',
}

/**
 * Main Task interface
 * Represents a single task in the TaskFlow application
 */
export interface Task {
  /** Unique identifier for the task */
  id: string

  /** Title/name of the task */
  title: string

  /** Detailed description of the task */
  description: string

  /** Current status of the task */
  status: TaskStatus | 'todo' | 'in-progress' | 'done'

  /** Timestamp when the task was created */
  createdAt: Date

  /** Timestamp when the task was last updated */
  updatedAt: Date
}

/**
 * Create task request payload
 * Used when creating a new task
 */
export interface CreateTaskRequest {
  title: string
  description?: string
  status?: TaskStatus | 'todo' | 'in-progress' | 'done'
}

/**
 * Update task request payload
 * Used when updating an existing task
 */
export interface UpdateTaskRequest {
  title?: string
  description?: string
  status?: TaskStatus | 'todo' | 'in-progress' | 'done'
}

/**
 * Task with board information
 * Extends Task with additional board reference
 */
export interface TaskWithBoard extends Task {
  boardId: string
}

/**
 * Type for task status union
 * Useful for type-safe status comparisons
 */
export type TaskStatusType = 'todo' | 'in-progress' | 'done'
