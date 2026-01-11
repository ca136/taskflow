import { useState, useCallback } from 'react'
import { Task, CreateTaskRequest, UpdateTaskRequest, TaskStatus } from '../../types/task'

/**
 * Props for the TaskForm component
 */
interface TaskFormProps {
  /** Mode of the form: 'create' for new tasks, 'edit' for existing tasks */
  mode: 'create' | 'edit'
  /** Initial task data when in edit mode (optional) */
  initialTask?: Task
  /** Callback function when form is submitted successfully */
  onSubmit: (data: CreateTaskRequest | UpdateTaskRequest) => Promise<void>
  /** Callback function when form is cancelled */
  onCancel?: () => void
  /** Whether the form is currently submitting */
  isLoading?: boolean
}

/**
 * Form validation error state
 */
interface FormErrors {
  title?: string
}

/**
 * TaskForm component for creating and editing tasks
 *
 * Features:
 * - Required title field with validation
 * - Optional description field
 * - Status dropdown with three states (todo, in-progress, done)
 * - Form validation with error messages
 * - Support for both create and edit modes
 * - Loading state during submission
 * - Styled with Tailwind CSS form utilities
 *
 * @example
 * Create mode:
 * <TaskForm
 *   mode="create"
 *   onSubmit={async (data) => {
 *     await createTask(data)
 *   }}
 *   onCancel={() => setIsOpen(false)}
 * />
 *
 * Edit mode:
 * <TaskForm
 *   mode="edit"
 *   initialTask={task}
 *   onSubmit={async (data) => {
 *     await updateTask(task.id, data)
 *   }}
 *   onCancel={() => setIsOpen(false)}
 * />
 */
export default function TaskForm({
  mode,
  initialTask,
  onSubmit,
  onCancel,
  isLoading = false,
}: TaskFormProps) {
  // Form state
  const [title, setTitle] = useState(initialTask?.title || '')
  const [description, setDescription] = useState(initialTask?.description || '')
  const [status, setStatus] = useState<TaskStatus | string>(
    initialTask?.status || TaskStatus.TODO
  )
  const [errors, setErrors] = useState<FormErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)

  /**
   * Validate form fields
   * Returns true if form is valid, false otherwise
   */
  const validateForm = useCallback((): boolean => {
    const newErrors: FormErrors = {}

    // Validate title is not empty
    if (!title.trim()) {
      newErrors.title = 'Title is required'
    } else if (title.trim().length < 2) {
      newErrors.title = 'Title must be at least 2 characters long'
    } else if (title.trim().length > 200) {
      newErrors.title = 'Title must not exceed 200 characters'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [title])

  /**
   * Handle form submission
   */
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitError(null)

    // Validate form before submission
    if (!validateForm()) {
      return
    }

    try {
      const formData =
        mode === 'create'
          ? ({
              title: title.trim(),
              description: description.trim() || undefined,
              status: (status as TaskStatus) || TaskStatus.TODO,
            } as CreateTaskRequest)
          : ({
              title: title.trim(),
              description: description.trim() || undefined,
              status: (status as TaskStatus) || TaskStatus.TODO,
            } as UpdateTaskRequest)

      await onSubmit(formData)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to save task'
      setSubmitError(errorMessage)
    }
  }

  /**
   * Handle form cancellation
   */
  const handleCancel = () => {
    // Reset form state
    setTitle(initialTask?.title || '')
    setDescription(initialTask?.description || '')
    setStatus(initialTask?.status || TaskStatus.TODO)
    setErrors({})
    setSubmitError(null)

    if (onCancel) {
      onCancel()
    }
  }

  const submitButtonText = mode === 'create' ? 'Create Task' : 'Update Task'

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Error Message Alert */}
      {submitError && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <p className="text-sm font-medium text-red-800">{submitError}</p>
        </div>
      )}

      {/* Title Field */}
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => {
            setTitle(e.target.value)
            // Clear error when user starts typing
            if (errors.title) {
              setErrors({})
            }
          }}
          placeholder="Enter task title"
          disabled={isLoading}
          className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
            errors.title
              ? 'border-red-300 bg-red-50 text-red-900'
              : 'border-gray-300 text-gray-900 placeholder-gray-400'
          } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          maxLength={200}
          required
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title}</p>
        )}
        <p className="mt-1 text-xs text-gray-500">
          {title.length}/200 characters
        </p>
      </div>

      {/* Description Field */}
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description (optional)"
          disabled={isLoading}
          rows={4}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 placeholder-gray-400 resize-none ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
          maxLength={2000}
        />
        <p className="mt-1 text-xs text-gray-500">
          {description.length}/2000 characters
        </p>
      </div>

      {/* Status Dropdown */}
      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Status
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          disabled={isLoading}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 transition-colors text-gray-900 bg-white ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <option value={TaskStatus.TODO}>To Do</option>
          <option value={TaskStatus.IN_PROGRESS}>In Progress</option>
          <option value={TaskStatus.DONE}>Done</option>
        </select>
      </div>

      {/* Form Actions */}
      <div className="flex gap-3 pt-4 border-t border-gray-200">
        <button
          type="submit"
          disabled={isLoading}
          className={`flex-1 px-4 py-2 font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Saving...' : submitButtonText}
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={handleCancel}
            disabled={isLoading}
            className={`flex-1 px-4 py-2 font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  )
}
