import { useState } from 'react'
import { AlertCircle, Loader } from 'lucide-react'

interface TaskFormProps {
  onSubmit: (data: FormData) => void | Promise<void>
  isLoading?: boolean
  error?: string
}

interface FormData {
  title: string
  description: string
  assignee: string
  priority: 'low' | 'medium' | 'high'
}

export const TaskForm = ({ onSubmit, isLoading = false, error }: TaskFormProps) => {
  const [formData, setFormData] = useState<FormData>({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
  })
  const [localError, setLocalError] = useState<string | null>(null)
  const [touched, setTouched] = useState<Record<string, boolean>>({})

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setLocalError(null)
  }

  const handleBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name } = e.target
    setTouched((prev) => ({ ...prev, [name]: true }))
  }

  const validateForm = (): boolean => {
    if (!formData.title.trim()) {
      setLocalError('Task title is required')
      setTouched({ title: true })
      return false
    }
    if (formData.title.trim().length < 3) {
      setLocalError('Task title must be at least 3 characters')
      setTouched({ title: true })
      return false
    }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      setLocalError(null)
      await onSubmit(formData)
      // Only reset if successful (parent component handles this)
      setFormData({ title: '', description: '', assignee: '', priority: 'medium' })
      setTouched({})
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to create task'
      setLocalError(errorMessage)
    }
  }

  const displayError = error || localError

  return (
    <form onSubmit={handleSubmit} className="space-y-4" data-testid="task-form">
      {/* Error Alert */}
      {displayError && (
        <div
          className="flex items-start gap-3 p-3 bg-red-50 border border-red-200 rounded-md"
          role="alert"
          data-testid="form-error"
        >
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-red-900">Error</p>
            <p className="text-sm text-red-800 mt-0.5">{displayError}</p>
          </div>
        </div>
      )}

      {/* Title */}
      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
          Task Title <span className="text-red-500">*</span>
        </label>
        <input
          id="title"
          type="text"
          name="title"
          value={formData.title}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isLoading}
          required
          placeholder="Enter task title"
          className={`w-full px-3 py-2 border rounded-md transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed focus:outline-none focus:ring-2 ${
            touched.title && !formData.title.trim()
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300 focus:ring-primary-500 focus:border-primary-500'
          }`}
          data-testid="form-title"
        />
        {touched.title && !formData.title.trim() && (
          <p className="text-sm text-red-600 mt-1">Task title is required</p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isLoading}
          placeholder="Enter task description"
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          data-testid="form-description"
        />
      </div>

      {/* Assignee */}
      <div>
        <label htmlFor="assignee" className="block text-sm font-medium text-gray-700 mb-1">
          Assign To
        </label>
        <input
          id="assignee"
          type="text"
          name="assignee"
          value={formData.assignee}
          onChange={handleChange}
          onBlur={handleBlur}
          disabled={isLoading}
          placeholder="Team member name (optional)"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          data-testid="form-assignee"
        />
      </div>

      {/* Priority */}
      <div>
        <label htmlFor="priority" className="block text-sm font-medium text-gray-700 mb-1">
          Priority
        </label>
        <select
          id="priority"
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
          data-testid="form-priority"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
      </div>

      {/* Buttons */}
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={isLoading}
          className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:bg-gray-400 transition-colors font-medium disabled:cursor-not-allowed"
          data-testid="form-submit"
        >
          {isLoading && <Loader className="h-4 w-4 animate-spin" />}
          {isLoading ? 'Creating...' : 'Create Task'}
        </button>
        <button
          type="reset"
          disabled={isLoading}
          onClick={() => {
            setFormData({ title: '', description: '', assignee: '', priority: 'medium' })
            setTouched({})
            setLocalError(null)
          }}
          className="flex-1 sm:flex-initial px-4 py-2 bg-gray-300 text-gray-800 rounded-md hover:bg-gray-400 disabled:bg-gray-200 transition-colors font-medium disabled:cursor-not-allowed"
          data-testid="form-reset"
        >
          Clear
        </button>
      </div>
    </form>
  )
}
