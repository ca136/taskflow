import { useState } from 'react'
import { useFormSubmit } from '../../hooks/useFormSubmit'
import { ErrorDisplay } from '../common'
import { Loader } from 'lucide-react'

interface CreateProjectFormProps {
  onSuccess?: () => void
}

export const CreateProjectForm = ({ onSuccess }: CreateProjectFormProps) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const { isLoading, error, submit, clearError } = useFormSubmit({
    successMessage: 'Project created successfully!',
    onSuccess,
    showErrorToast: true,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      return
    }

    try {
      await submit(async () => {
        // This would call your API endpoint
        const response = await fetch('/api/projects', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            description,
          }),
        })

        if (!response.ok) {
          throw new Error(`Failed to create project: ${response.statusText}`)
        }
      })

      // Reset form on success
      setName('')
      setDescription('')
    } catch (err) {
      // Error is already handled by useFormSubmit
      console.error('Form submission error:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Error display */}
      {error && (
        <ErrorDisplay
          error={error}
          variant="inline"
          onDismiss={clearError}
        />
      )}

      {/* Form fields */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Project Name *
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
          placeholder="Enter project name"
          aria-label="Project name"
        />
      </div>

      <div>
        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
          Description
        </label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 disabled:text-gray-500"
          placeholder="Enter project description (optional)"
          rows={4}
          aria-label="Project description"
        />
      </div>

      {/* Submit button */}
      <button
        type="submit"
        disabled={isLoading || !name.trim()}
        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
        aria-label={isLoading ? 'Creating project...' : 'Create project'}
      >
        {isLoading ? (
          <>
            <Loader className="h-4 w-4 animate-spin" />
            <span>Creating...</span>
          </>
        ) : (
          <span>Create Project</span>
        )}
      </button>
    </form>
  )
}
