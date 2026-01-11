/**
 * Sample Data Generator for Testing
 * Provides utility functions to generate mock tasks for development and testing.
 * This module is designed to be used during development but can be removed or
 * disabled for production builds.
 */

import { Task, TaskStatus, TaskPriority } from '../types/task'

/**
 * Sample task titles for variety in generated data
 */
const SAMPLE_TITLES = [
  'Implement user authentication',
  'Create dashboard layout',
  'Fix login validation bug',
  'Add dark mode support',
  'Refactor API client',
  'Write unit tests',
  'Update documentation',
  'Optimize database queries',
  'Design mobile responsive layout',
  'Implement WebSocket support',
  'Add user profile page',
  'Create admin panel',
  'Setup CI/CD pipeline',
  'Migrate to TypeScript',
  'Add real-time notifications',
]

/**
 * Sample task descriptions for variety in generated data
 */
const SAMPLE_DESCRIPTIONS = [
  'Implement JWT-based authentication with refresh tokens',
  'Create a responsive dashboard with charts and metrics',
  'Fix issue where validation errors are not displayed to users',
  'Add support for dark mode across all components',
  'Refactor the API client to reduce code duplication and improve error handling',
  'Write comprehensive unit tests with 80%+ coverage',
  'Update API documentation and add missing endpoints',
  'Optimize slow database queries in the dashboard',
  'Ensure all pages look great on mobile, tablet, and desktop',
  'Add WebSocket support for real-time data updates',
  'Create a user profile page with settings and preferences',
  'Build an admin panel for managing users and permissions',
  'Setup GitHub Actions for automated testing and deployment',
  'Migrate JavaScript files to TypeScript for better type safety',
  'Implement push notifications for task updates',
]

/**
 * Generates a random ID for a sample task
 * @returns A random numeric ID
 */
function generateTaskId(): number {
  return Math.floor(Math.random() * 100000) + 1
}

/**
 * Generates a random date between the past 30 days
 * @returns A Date object
 */
function generateRandomDate(): Date {
  const now = new Date()
  const daysAgo = Math.floor(Math.random() * 30)
  const date = new Date(now)
  date.setDate(date.getDate() - daysAgo)
  date.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60))
  return date
}

/**
 * Generates a random task with all properties
 * @param overrides Optional partial task object to override generated values
 * @returns A complete Task object
 */
export function generateRandomTask(overrides?: Partial<Task>): Task {
  const createdAt = generateRandomDate()
  const updatedAt = new Date(createdAt)
  updatedAt.setHours(updatedAt.getHours() + Math.floor(Math.random() * 24))

  return {
    id: generateTaskId(),
    title: SAMPLE_TITLES[Math.floor(Math.random() * SAMPLE_TITLES.length)],
    description: SAMPLE_DESCRIPTIONS[Math.floor(Math.random() * SAMPLE_DESCRIPTIONS.length)],
    status: Object.values(TaskStatus)[Math.floor(Math.random() * Object.values(TaskStatus).length)],
    priority: Object.values(TaskPriority)[Math.floor(Math.random() * Object.values(TaskPriority).length)],
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
    projectId: Math.floor(Math.random() * 10) + 1,
    assignedToId: Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 1 : undefined,
    ...overrides,
  }
}

/**
 * Generates an array of sample tasks with specified counts for each status
 * Useful for testing filtering, sorting, and UI layouts with realistic data
 * @param todoCount Number of tasks with TODO status
 * @param inProgressCount Number of tasks with IN_PROGRESS status
 * @param doneCount Number of tasks with DONE status
 * @returns Array of Task objects
 */
export function generateSampleTasks(
  todoCount: number = 5,
  inProgressCount: number = 3,
  doneCount: number = 4,
): Task[] {
  const tasks: Task[] = []

  // Generate TODO tasks
  for (let i = 0; i < todoCount; i++) {
    tasks.push(generateRandomTask({ status: TaskStatus.TODO }))
  }

  // Generate IN_PROGRESS tasks
  for (let i = 0; i < inProgressCount; i++) {
    tasks.push(generateRandomTask({ status: TaskStatus.IN_PROGRESS }))
  }

  // Generate DONE tasks
  for (let i = 0; i < doneCount; i++) {
    tasks.push(generateRandomTask({ status: TaskStatus.DONE }))
  }

  return tasks
}

/**
 * Generates sample tasks with various statuses and priorities
 * Similar to generateSampleTasks but with balanced priorities
 * @param count Total number of tasks to generate
 * @returns Array of Task objects with varied statuses and priorities
 */
export function generateMixedSampleTasks(count: number = 12): Task[] {
  const tasks: Task[] = []
  const statuses = Object.values(TaskStatus)
  const priorities = Object.values(TaskPriority)

  for (let i = 0; i < count; i++) {
    tasks.push(
      generateRandomTask({
        status: statuses[i % statuses.length],
        priority: priorities[i % priorities.length],
      }),
    )
  }

  return tasks
}

/**
 * Generates sample tasks for a specific project
 * @param projectId The project ID to assign to all tasks
 * @param count Number of tasks to generate
 * @returns Array of Task objects all assigned to the specified project
 */
export function generateTasksForProject(projectId: string | number, count: number = 10): Task[] {
  const tasks: Task[] = []

  for (let i = 0; i < count; i++) {
    tasks.push(generateRandomTask({ projectId }))
  }

  return tasks
}

/**
 * Generates sample tasks assigned to a specific user
 * @param userId The user ID to assign to all tasks
 * @param count Number of tasks to generate
 * @returns Array of Task objects all assigned to the specified user
 */
export function generateTasksForUser(userId: string | number, count: number = 5): Task[] {
  const tasks: Task[] = []

  for (let i = 0; i < count; i++) {
    tasks.push(generateRandomTask({ assignedToId: userId }))
  }

  return tasks
}

/**
 * Generates sample tasks with specific combinations for testing filters
 * Useful for testing task filtering by status, priority, and assignment
 * @returns Object containing arrays of tasks organized by filter criteria
 */
export function generateTasksForFiltering(): {
  byStatus: Record<TaskStatus, Task[]>
  byPriority: Record<TaskPriority, Task[]>
  highPriorityInProgress: Task[]
  unassignedTodo: Task[]
} {
  const byStatus: Record<TaskStatus, Task[]> = {
    [TaskStatus.TODO]: [],
    [TaskStatus.IN_PROGRESS]: [],
    [TaskStatus.DONE]: [],
  }

  const byPriority: Record<TaskPriority, Task[]> = {
    [TaskPriority.LOW]: [],
    [TaskPriority.MEDIUM]: [],
    [TaskPriority.HIGH]: [],
  }

  // Generate tasks for each status
  for (const status of Object.values(TaskStatus)) {
    for (let i = 0; i < 4; i++) {
      const task = generateRandomTask({ status })
      byStatus[status].push(task)
    }
  }

  // Generate tasks for each priority
  for (const priority of Object.values(TaskPriority)) {
    for (let i = 0; i < 3; i++) {
      const task = generateRandomTask({ priority })
      byPriority[priority].push(task)
    }
  }

  // Generate specific combinations for filter testing
  const highPriorityInProgress: Task[] = []
  for (let i = 0; i < 3; i++) {
    highPriorityInProgress.push(
      generateRandomTask({
        status: TaskStatus.IN_PROGRESS,
        priority: TaskPriority.HIGH,
      }),
    )
  }

  const unassignedTodo: Task[] = []
  for (let i = 0; i < 2; i++) {
    unassignedTodo.push(
      generateRandomTask({
        status: TaskStatus.TODO,
        priority: TaskPriority.MEDIUM,
        assignedToId: undefined,
      }),
    )
  }

  return {
    byStatus,
    byPriority,
    highPriorityInProgress,
    unassignedTodo,
  }
}

/**
 * Returns a single sample task with sensible defaults
 * Useful for quick testing without needing full array generation
 * @param overrides Optional partial task object to override defaults
 * @returns A single Task object
 */
export function getSingleSampleTask(overrides?: Partial<Task>): Task {
  return generateRandomTask({
    title: 'Sample Task',
    description: 'This is a sample task for testing purposes',
    status: TaskStatus.TODO,
    priority: TaskPriority.MEDIUM,
    projectId: 1,
    assignedToId: 1,
    ...overrides,
  })
}
