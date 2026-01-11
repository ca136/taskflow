/**
 * Task Model and Related Types
 * Defines TypeScript interfaces for task management in TaskFlow
 */

/**
 * Task Status enumeration
 */
export type TaskStatus = 'todo' | 'in-progress' | 'done'

/**
 * Task Priority enumeration
 */
export type TaskPriority = 'low' | 'medium' | 'high'

/**
 * Core Task Model
 * Represents a task in the kanban board
 */
export interface Task {
  /** Unique identifier for the task */
  id: string

  /** Board ID this task belongs to */
  boardId: string

  /** Task title */
  title: string

  /** Optional task description */
  description?: string

  /** Optional assignee user ID */
  assignee?: string

  /** Task priority level */
  priority: TaskPriority

  /** Current status of the task */
  status: TaskStatus

  /** Task creation timestamp (ISO 8601 string) */
  createdAt: string

  /** Task last update timestamp (ISO 8601 string) */
  updatedAt: string
}

/**
 * Task Form Input
 * Used for creating and updating tasks
 */
export interface TaskFormInput {
  /** Task title (required) */
  title: string

  /** Optional task description */
  description?: string

  /** Optional assignee user ID */
  assignee?: string

  /** Task priority level */
  priority: TaskPriority

  /** Task status */
  status: TaskStatus
}

/**
 * Task Filter Options
 * Used for filtering and searching tasks
 */
export interface TaskFilter {
  /** Filter by status */
  status?: TaskStatus | TaskStatus[]

  /** Filter by priority */
  priority?: TaskPriority | TaskPriority[]

  /** Filter by assignee user ID */
  assignee?: string

  /** Search query for title and description */
  search?: string

  /** Filter by board ID */
  boardId?: string

  /** Sort field */
  sortBy?: 'createdAt' | 'updatedAt' | 'priority' | 'title'

  /** Sort direction */
  sortOrder?: 'asc' | 'desc'
}

/**
 * Task Creation Payload
 * Used when creating a new task via API
 */
export interface TaskCreatePayload extends TaskFormInput {
  /** Board ID where task will be created */
  boardId: string
}

/**
 * Task Update Payload
 * Used when updating an existing task via API
 * All fields are optional for partial updates
 */
export interface TaskUpdatePayload extends Partial<TaskFormInput> {
  // Allows partial updates of task fields
}

/**
 * Task List Response
 * Represents paginated task data
 */
export interface TaskListResponse {
  /** Array of tasks */
  tasks: Task[]

  /** Total number of tasks matching filter */
  total: number

  /** Current page number */
  page: number

  /** Number of tasks per page */
  pageSize: number
}

/**
 * Task with computed properties
 * Extended task interface with derived/computed fields
 */
export interface TaskWithComputedFields extends Task {
  /** Whether task is overdue (only if has due date in future) */
  isOverdue?: boolean

  /** Days until due (only if has due date) */
  daysUntilDue?: number

  /** Whether task is completed */
  isCompleted: boolean
}

/**
 * Task Bulk Action Payload
 * Used for bulk operations on multiple tasks
 */
export interface TaskBulkActionPayload {
  /** Task IDs to operate on */
  taskIds: string[]

  /** Action to perform */
  action: 'updateStatus' | 'updatePriority' | 'assignTo' | 'delete'

  /** Payload for the action */
  payload: Record<string, unknown>
}

/**
 * Task Statistics
 * Aggregated task data for dashboards
 */
export interface TaskStatistics {
  /** Total number of tasks */
  total: number

  /** Tasks in todo status */
  todo: number

  /** Tasks in in-progress status */
  inProgress: number

  /** Tasks in done status */
  done: number

  /** Tasks with high priority */
  highPriority: number

  /** Tasks with medium priority */
  mediumPriority: number

  /** Tasks with low priority */
  lowPriority: number
}
