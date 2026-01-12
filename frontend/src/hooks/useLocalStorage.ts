import { useState, useEffect, useCallback } from 'react'
import type { Task } from '../types'

/**
 * Error types for localStorage operations
 */
export class LocalStorageError extends Error {
  constructor(message: string, public readonly code: string) {
    super(message)
    this.name = 'LocalStorageError'
  }
}

/**
 * Options for configuring the useLocalStorage hook
 */
interface UseLocalStorageOptions<T = Task[]> {
  /** Synchronize state across tabs/windows */
  syncData?: boolean
  /** Initial value if localStorage is empty */
  initialValue?: T
}

/**
 * Custom hook for managing data in localStorage
 * Provides save, retrieve, update, and delete operations with error handling
 *
 * @template T - The type of data to store (array of items)
 * @param key - The localStorage key name
 * @param options - Configuration options
 * @returns Object containing state and operations
 *
 * @example
 * const { data, addItem, removeItem, error } = useLocalStorage<Task[]>('tasks', {
 *   initialValue: []
 * })
 */
export function useLocalStorage<T extends unknown[] = Task[]>(
  key: string,
  options: UseLocalStorageOptions<T> = {}
) {
  const { syncData = true, initialValue = [] as unknown as T } = options

  const [data, setData] = useState<T>(initialValue)
  const [error, setError] = useState<LocalStorageError | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Safely parse JSON from localStorage
   */
  const parseStoredValue = useCallback(
    (value: string | null): T => {
      if (!value) return initialValue
      try {
        const parsed = JSON.parse(value)
        return Array.isArray(parsed) ? (parsed as T) : initialValue
      } catch (e) {
        const err = new LocalStorageError(
          `Failed to parse localStorage data for key "${key}"`,
          'PARSE_ERROR'
        )
        setError(err)
        return initialValue
      }
    },
    [key, initialValue]
  )

  /**
   * Initialize data from localStorage on mount
   */
  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(key)
      const parsed = parseStoredValue(stored)
      setData(parsed)
      setError(null)
    } catch (e) {
      const err = new LocalStorageError(
        `Failed to load data from localStorage: ${e instanceof Error ? e.message : String(e)}`,
        'LOAD_ERROR'
      )
      setError(err)
      setData(initialValue)
    } finally {
      setIsLoading(false)
    }
  }, [key, initialValue, parseStoredValue])

  /**
   * Listen for storage changes across tabs/windows
   */
  useEffect(() => {
    if (!syncData) return

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === key && event.newValue) {
        try {
          const parsed = parseStoredValue(event.newValue)
          setData(parsed)
          setError(null)
        } catch (e) {
          const err = new LocalStorageError(
            `Failed to sync data from another tab`,
            'SYNC_ERROR'
          )
          setError(err)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key, syncData, parseStoredValue])

  /**
   * Save data to localStorage
   * @param value - The value to save
   * @throws LocalStorageError if save fails
   */
  const save = useCallback(
    (value: T): void => {
      try {
        window.localStorage.setItem(key, JSON.stringify(value))
        setData(value)
        setError(null)
      } catch (e) {
        if (e instanceof Error && e.name === 'QuotaExceededError') {
          const err = new LocalStorageError(
            'localStorage quota exceeded',
            'QUOTA_ERROR'
          )
          setError(err)
          throw err
        }
        const err = new LocalStorageError(
          `Failed to save data to localStorage: ${e instanceof Error ? e.message : String(e)}`,
          'SAVE_ERROR'
        )
        setError(err)
        throw err
      }
    },
    [key]
  )

  /**
   * Clear all data from localStorage for this key
   */
  const clear = useCallback((): void => {
    try {
      window.localStorage.removeItem(key)
      setData(initialValue)
      setError(null)
    } catch (e) {
      const err = new LocalStorageError(
        `Failed to clear localStorage`,
        'CLEAR_ERROR'
      )
      setError(err)
      throw err
    }
  }, [key, initialValue])

  /**
   * Add a new item to the stored array
   * @param item - The item to add
   */
  const addItem = useCallback(
    (item: T extends (infer U)[] ? U : never): void => {
      setData((prevData) => {
        const updated = [...(prevData as unknown[]), item] as T
        save(updated)
        return updated
      })
    },
    [save]
  )

  /**
   * Update an existing item by predicate function
   * @param predicate - Function to find the item
   * @param updates - Partial updates to apply
   */
  const updateItem = useCallback(
    (
      predicate: (item: T extends (infer U)[] ? U : never) => boolean,
      updates: Partial<T extends (infer U)[] ? U : never>
    ): void => {
      setData((prevData) => {
        const updated = (prevData as unknown[]).map((item) =>
          predicate(item as T extends (infer U)[] ? U : never)
            ? Object.assign({}, item, updates)
            : item
        ) as T
        save(updated)
        return updated
      })
    },
    [save]
  )

  /**
   * Remove an item from the stored array
   * @param predicate - Function to find the item to remove
   */
  const removeItem = useCallback(
    (
      predicate: (item: T extends (infer U)[] ? U : never) => boolean
    ): void => {
      setData((prevData) => {
        const updated = (prevData as unknown[]).filter(
          (item) => !predicate(item as T extends (infer U)[] ? U : never)
        ) as T
        save(updated)
        return updated
      })
    },
    [save]
  )

  /**
   * Get an item from the stored array
   * @param predicate - Function to find the item
   * @returns The found item or undefined
   */
  const getItem = useCallback(
    (
      predicate: (item: T extends (infer U)[] ? U : never) => boolean
    ): (T extends (infer U)[] ? U : never) | undefined => {
      return (data as unknown[]).find(
        (item) => predicate(item as T extends (infer U)[] ? U : never)
      ) as (T extends (infer U)[] ? U : never) | undefined
    },
    [data]
  )

  /**
   * Replace all stored data
   * @param newData - The new data to store
   */
  const setAll = useCallback((newData: T): void => {
    save(newData)
  }, [save])

  return {
    // State
    data,
    isLoading,
    error,

    // Operations
    save,
    clear,
    addItem,
    updateItem,
    removeItem,
    getItem,
    setAll,

    // Aliases for convenience
    get: getItem,
    add: addItem,
    update: updateItem,
    remove: removeItem,
    set: setAll,
  }
}

/**
 * Specialized hook for managing Task items in localStorage
 * Provides task-specific operations
 *
 * @example
 * const { tasks, addTask, updateTask, removeTask } = useLocalStorageTasks('tasks')
 */
export function useLocalStorageTasks(
  key: string = 'tasks',
  options: UseLocalStorageOptions<Task[]> = {}
) {
  const storage = useLocalStorage<Task[]>(key, {
    initialValue: [],
    ...options,
  })

  /**
   * Add a new task
   */
  const addTask = useCallback(
    (task: Task): void => {
      storage.addItem(task)
    },
    [storage]
  )

  /**
   * Update a task by ID
   */
  const updateTask = useCallback(
    (taskId: string, updates: Partial<Task>): void => {
      storage.updateItem((task) => task.id === taskId, updates)
    },
    [storage]
  )

  /**
   * Remove a task by ID
   */
  const removeTask = useCallback(
    (taskId: string): void => {
      storage.removeItem((task) => task.id === taskId)
    },
    [storage]
  )

  /**
   * Get a task by ID
   */
  const getTask = useCallback(
    (taskId: string): Task | undefined => {
      return storage.getItem((task) => task.id === taskId)
    },
    [storage]
  )

  /**
   * Get all tasks for a specific board
   */
  const getTasksByBoard = useCallback(
    (boardId: string): Task[] => {
      return storage.data.filter((task) => task.boardId === boardId)
    },
    [storage.data]
  )

  /**
   * Get all tasks with a specific status/column
   */
  const getTasksByColumn = useCallback(
    (column: Task['column']): Task[] => {
      return storage.data.filter((task) => task.column === column)
    },
    [storage.data]
  )

  /**
   * Move a task to a different column
   */
  const moveTask = useCallback(
    (taskId: string, column: Task['column']): void => {
      storage.updateItem((task) => task.id === taskId, {
        column,
        updatedAt: new Date().toISOString(),
      })
    },
    [storage]
  )

  /**
   * Update task priority
   */
  const updateTaskPriority = useCallback(
    (taskId: string, priority: Task['priority']): void => {
      storage.updateItem((task) => task.id === taskId, {
        priority,
        updatedAt: new Date().toISOString(),
      })
    },
    [storage]
  )

  return {
    // Core storage properties
    tasks: storage.data,
    isLoading: storage.isLoading,
    error: storage.error,

    // Task-specific operations
    addTask,
    updateTask,
    removeTask,
    getTask,
    getTasksByBoard,
    getTasksByColumn,
    moveTask,
    updateTaskPriority,

    // Generic operations
    clearAll: storage.clear,
    replace: storage.setAll,

    // Re-export storage for advanced usage
    _storage: storage,
  }
}
