import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import { Task, TaskFilter, TaskStatus } from '../types'

/**
 * Task Store State Interface
 * Defines the shape of the task store state
 */
export interface TaskStoreState {
  // State
  tasks: Task[]
  filter: TaskFilter
  isLoading: boolean
  error: string | null

  // Actions
  addTask: (task: Task) => void
  updateTask: (id: string | number, updates: Partial<Task>) => void
  deleteTask: (id: string | number) => void
  setFilter: (filter: TaskFilter) => void
  clearFilter: () => void
  setTasks: (tasks: Task[]) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Computed/Helper actions
  getFilteredTasks: () => Task[]
  getTaskById: (id: string | number) => Task | undefined
  getTasksByStatus: (status: TaskStatus) => Task[]
  clearAll: () => void
}

const initialState = {
  tasks: [] as Task[],
  filter: {} as TaskFilter,
  isLoading: false,
  error: null as string | null,
}

/**
 * Task Store
 * Manages task state using Zustand with local storage persistence
 * Includes development tools support for debugging
 */
export const useTaskStore = create<TaskStoreState>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // ==================== Basic Actions ====================
        /**
         * Add a new task to the store
         */
        addTask: (task: Task) => {
          set((state) => ({
            tasks: [...state.tasks, task],
          }))
        },

        /**
         * Update an existing task
         */
        updateTask: (id: string | number, updates: Partial<Task>) => {
          set((state) => ({
            tasks: state.tasks.map((task) =>
              task.id === id ? { ...task, ...updates } : task
            ),
          }))
        },

        /**
         * Delete a task by ID
         */
        deleteTask: (id: string | number) => {
          set((state) => ({
            tasks: state.tasks.filter((task) => task.id !== id),
          }))
        },

        /**
         * Set the current filter for task display
         */
        setFilter: (filter: TaskFilter) => {
          set({ filter })
        },

        /**
         * Clear all filters (reset to empty filter)
         */
        clearFilter: () => {
          set({ filter: {} })
        },

        /**
         * Replace all tasks (useful when fetching from API)
         */
        setTasks: (tasks: Task[]) => {
          set({ tasks })
        },

        /**
         * Set loading state
         */
        setLoading: (loading: boolean) => {
          set({ isLoading: loading })
        },

        /**
         * Set error message
         */
        setError: (error: string | null) => {
          set({ error })
        },

        // ==================== Computed/Helper Actions ====================
        /**
         * Get tasks filtered by current filter criteria
         */
        getFilteredTasks: () => {
          const state = get()
          const { tasks, filter } = state

          return tasks.filter((task) => {
            // Filter by status
            if (filter.status) {
              const statuses = Array.isArray(filter.status)
                ? filter.status
                : [filter.status]
              if (!statuses.includes(task.status)) {
                return false
              }
            }

            // Filter by priority
            if (filter.priority) {
              const priorities = Array.isArray(filter.priority)
                ? filter.priority
                : [filter.priority]
              if (task.priority && !priorities.includes(task.priority)) {
                return false
              }
            }

            // Filter by project ID
            if (filter.projectId && task.projectId !== filter.projectId) {
              return false
            }

            // Filter by assigned user ID
            if (
              filter.assignedToId &&
              task.assignedToId !== filter.assignedToId
            ) {
              return false
            }

            // Filter by search term
            if (filter.searchTerm) {
              const searchLower = filter.searchTerm.toLowerCase()
              const matchesTitle = task.title
                .toLowerCase()
                .includes(searchLower)
              const matchesDescription = task.description
                ?.toLowerCase()
                .includes(searchLower)
              if (!matchesTitle && !matchesDescription) {
                return false
              }
            }

            return true
          })
        },

        /**
         * Get a single task by ID
         */
        getTaskById: (id: string | number) => {
          const state = get()
          return state.tasks.find((task) => task.id === id)
        },

        /**
         * Get all tasks with a specific status
         */
        getTasksByStatus: (status: TaskStatus) => {
          const state = get()
          return state.tasks.filter((task) => task.status === status)
        },

        /**
         * Clear all store data (reset to initial state)
         */
        clearAll: () => {
          set(initialState)
        },
      }),
      {
        name: 'task-store', // Key for localStorage
        version: 1, // Version for migrations if needed
      }
    ),
    { name: 'TaskStore' }
  )
)
