/**
 * Task Utility Functions
 * Common utilities for task operations used across components
 */

import { Task, TaskStatus, TaskPriority } from '../types'

/**
 * Format a date to a readable string
 * Handles both Date objects and ISO string inputs
 * @param date - Date to format (Date object or ISO string)
 * @param format - Format style: 'short' | 'long' | 'relative' (default: 'short')
 * @returns Formatted date string
 */
export const formatDate = (
  date: string | Date | undefined,
  format: 'short' | 'long' | 'relative' = 'short'
): string => {
  if (!date) return ''

  const dateObj = typeof date === 'string' ? new Date(date) : date

  if (isNaN(dateObj.getTime())) return ''

  switch (format) {
    case 'long':
      return dateObj.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })

    case 'relative': {
      const now = new Date()
      const diffMs = now.getTime() - dateObj.getTime()
      const diffMins = Math.floor(diffMs / 60000)
      const diffHours = Math.floor(diffMs / 3600000)
      const diffDays = Math.floor(diffMs / 86400000)

      if (diffMins < 1) return 'just now'
      if (diffMins < 60) return `${diffMins}m ago`
      if (diffHours < 24) return `${diffHours}h ago`
      if (diffDays < 7) return `${diffDays}d ago`
      if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7)
        return `${weeks}w ago`
      }

      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      })
    }

    case 'short':
    default:
      return dateObj.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: dateObj.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined,
      })
  }
}

/**
 * Get Tailwind color class for task status
 * Maps task status to visual color indicators
 * @param status - Task status
 * @returns Tailwind CSS color class name
 */
export const getStatusColor = (status: TaskStatus): string => {
  const colorMap: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: 'bg-gray-100 text-gray-700 border-gray-300',
    [TaskStatus.IN_PROGRESS]: 'bg-blue-100 text-blue-700 border-blue-300',
    [TaskStatus.DONE]: 'bg-green-100 text-green-700 border-green-300',
  }

  return colorMap[status] || 'bg-gray-100 text-gray-700'
}

/**
 * Get human-readable label for task status
 * @param status - Task status enum value
 * @returns Formatted status label
 */
export const getStatusLabel = (status: TaskStatus): string => {
  const labelMap: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: 'To Do',
    [TaskStatus.IN_PROGRESS]: 'In Progress',
    [TaskStatus.DONE]: 'Done',
  }

  return labelMap[status] || status
}

/**
 * Get human-readable label for task priority
 * @param priority - Task priority enum value
 * @returns Formatted priority label
 */
export const getPriorityLabel = (priority?: TaskPriority): string => {
  if (!priority) return 'No priority'

  const labelMap: Record<TaskPriority, string> = {
    [TaskPriority.LOW]: 'Low',
    [TaskPriority.MEDIUM]: 'Medium',
    [TaskPriority.HIGH]: 'High',
  }

  return labelMap[priority] || priority
}

/**
 * Get Tailwind color class for task priority
 * Maps priority to visual indicators
 * @param priority - Task priority
 * @returns Tailwind CSS color class name
 */
export const getPriorityColor = (priority?: TaskPriority): string => {
  if (!priority) return 'bg-gray-50 text-gray-600'

  const colorMap: Record<TaskPriority, string> = {
    [TaskPriority.LOW]: 'bg-green-50 text-green-700 border-green-200',
    [TaskPriority.MEDIUM]: 'bg-amber-50 text-amber-700 border-amber-200',
    [TaskPriority.HIGH]: 'bg-red-50 text-red-700 border-red-200',
  }

  return colorMap[priority] || 'bg-gray-50 text-gray-600'
}

/**
 * Sort tasks by date
 * @param tasks - Array of tasks to sort
 * @param order - Sort order: 'asc' (oldest first) | 'desc' (newest first), default: 'desc'
 * @param dateField - Which date field to sort by: 'created' | 'updated', default: 'updated'
 * @returns New sorted array (original array is not modified)
 */
export const sortTasksByDate = (
  tasks: Task[],
  order: 'asc' | 'desc' = 'desc',
  dateField: 'created' | 'updated' = 'updated'
): Task[] => {
  const field = dateField === 'created' ? 'createdAt' : 'updatedAt'

  return [...tasks].sort((a, b) => {
    const dateA = new Date(a[field]).getTime()
    const dateB = new Date(b[field]).getTime()

    return order === 'asc' ? dateA - dateB : dateB - dateA
  })
}

/**
 * Filter tasks by status
 * @param tasks - Array of tasks to filter
 * @param statuses - Single status or array of statuses to include
 * @returns Filtered array of tasks
 */
export const filterTasksByStatus = (
  tasks: Task[],
  statuses: TaskStatus | TaskStatus[]
): Task[] => {
  const statusArray = Array.isArray(statuses) ? statuses : [statuses]
  return tasks.filter((task) => statusArray.includes(task.status))
}

/**
 * Filter tasks by priority
 * @param tasks - Array of tasks to filter
 * @param priorities - Single priority or array of priorities to include
 * @returns Filtered array of tasks
 */
export const filterTasksByPriority = (
  tasks: Task[],
  priorities: TaskPriority | TaskPriority[]
): Task[] => {
  const priorityArray = Array.isArray(priorities) ? priorities : [priorities]
  return tasks.filter((task) => task.priority && priorityArray.includes(task.priority))
}

/**
 * Filter tasks by search term
 * Searches task title and description
 * @param tasks - Array of tasks to search
 * @param searchTerm - Text to search for (case-insensitive)
 * @returns Filtered array of matching tasks
 */
export const filterTasksBySearch = (tasks: Task[], searchTerm: string): Task[] => {
  if (!searchTerm.trim()) return tasks

  const lowerTerm = searchTerm.toLowerCase()
  return tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(lowerTerm) ||
      (task.description?.toLowerCase().includes(lowerTerm) ?? false)
  )
}

/**
 * Filter tasks by project ID
 * @param tasks - Array of tasks to filter
 * @param projectId - Project ID to filter by
 * @returns Filtered array of tasks
 */
export const filterTasksByProject = (
  tasks: Task[],
  projectId: string | number
): Task[] => {
  return tasks.filter((task) => task.projectId === projectId)
}

/**
 * Filter tasks by assignee
 * @param tasks - Array of tasks to filter
 * @param assignedToId - User ID to filter by
 * @returns Filtered array of tasks
 */
export const filterTasksByAssignee = (
  tasks: Task[],
  assignedToId: string | number
): Task[] => {
  return tasks.filter((task) => task.assignedToId === assignedToId)
}

/**
 * Get task statistics
 * Counts tasks grouped by status
 * @param tasks - Array of tasks to analyze
 * @returns Object with task counts by status
 */
export const getTaskStats = (
  tasks: Task[]
): {
  total: number
  todo: number
  inProgress: number
  done: number
} => {
  const stats = {
    total: tasks.length,
    todo: 0,
    inProgress: 0,
    done: 0,
  }

  tasks.forEach((task) => {
    switch (task.status) {
      case TaskStatus.TODO:
        stats.todo++
        break
      case TaskStatus.IN_PROGRESS:
        stats.inProgress++
        break
      case TaskStatus.DONE:
        stats.done++
        break
    }
  })

  return stats
}

/**
 * Calculate task completion percentage
 * @param tasks - Array of tasks to analyze
 * @returns Completion percentage (0-100)
 */
export const getCompletionPercentage = (tasks: Task[]): number => {
  if (tasks.length === 0) return 0
  const completedTasks = tasks.filter((task) => task.status === TaskStatus.DONE).length
  return Math.round((completedTasks / tasks.length) * 100)
}

/**
 * Group tasks by status
 * @param tasks - Array of tasks to group
 * @returns Object with tasks grouped by status
 */
export const groupTasksByStatus = (
  tasks: Task[]
): Record<TaskStatus, Task[]> => {
  return {
    [TaskStatus.TODO]: filterTasksByStatus(tasks, TaskStatus.TODO),
    [TaskStatus.IN_PROGRESS]: filterTasksByStatus(tasks, TaskStatus.IN_PROGRESS),
    [TaskStatus.DONE]: filterTasksByStatus(tasks, TaskStatus.DONE),
  }
}

/**
 * Check if task is overdue
 * Compares task update time to current time
 * @param task - Task to check
 * @param checkField - Which date field to check: 'created' | 'updated', default: 'updated'
 * @param daysThreshold - Days threshold for overdue (default: 0, meaning today or older)
 * @returns True if task is overdue
 */
export const isTaskOverdue = (
  task: Task,
  checkField: 'created' | 'updated' = 'updated',
  daysThreshold: number = 0
): boolean => {
  const field = checkField === 'created' ? 'createdAt' : 'updatedAt'
  const taskDate = new Date(task[field])
  const thresholdDate = new Date()
  thresholdDate.setDate(thresholdDate.getDate() - daysThreshold)

  return taskDate < thresholdDate
}

/**
 * Sort tasks by priority (high to low)
 * @param tasks - Array of tasks to sort
 * @param order - Sort order: 'asc' (low first) | 'desc' (high first), default: 'desc'
 * @returns New sorted array (original array is not modified)
 */
export const sortTasksByPriority = (
  tasks: Task[],
  order: 'asc' | 'desc' = 'desc'
): Task[] => {
  const getPriorityValue = (priority: TaskPriority | undefined): number => {
    switch (priority) {
      case TaskPriority.HIGH:
        return 3
      case TaskPriority.MEDIUM:
        return 2
      case TaskPriority.LOW:
        return 1
      default:
        return 0
    }
  }

  return [...tasks].sort((a, b) => {
    const priorityA = getPriorityValue(a.priority)
    const priorityB = getPriorityValue(b.priority)

    return order === 'asc' ? priorityA - priorityB : priorityB - priorityA
  })
}

/**
 * Get border color class for task status (for left border accent)
 * Useful for visual status indicators
 * @param status - Task status
 * @returns Tailwind border color class
 */
export const getStatusBorderColor = (status: TaskStatus): string => {
  const borderMap: Record<TaskStatus, string> = {
    [TaskStatus.TODO]: 'border-l-gray-400',
    [TaskStatus.IN_PROGRESS]: 'border-l-primary-500',
    [TaskStatus.DONE]: 'border-l-success-500',
  }

  return borderMap[status] || 'border-l-gray-400'
}

/**
 * Create a task summary for display
 * Truncates long descriptions and adds ellipsis
 * @param description - Task description
 * @param maxLength - Maximum character length (default: 100)
 * @returns Truncated description with ellipsis if needed
 */
export const getTaskSummary = (description?: string, maxLength: number = 100): string => {
  if (!description) return ''
  if (description.length <= maxLength) return description
  return `${description.substring(0, maxLength).trim()}...`
}

/**
 * Calculate time until task (for relative time display)
 * @param dateString - Date string to compare against
 * @returns Human-readable time string
 */
export const getTimeUntil = (dateString: string | Date): string => {
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  const now = new Date()
  const diffMs = date.getTime() - now.getTime()

  if (diffMs < 0) return 'overdue'

  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'in a moment'
  if (diffMins < 60) return `in ${diffMins}m`
  if (diffHours < 24) return `in ${diffHours}h`
  if (diffDays < 7) return `in ${diffDays}d`

  const weeks = Math.floor(diffDays / 7)
  return `in ${weeks}w`
}
