import React, { useState } from 'react'
import { Loader } from 'lucide-react'
import { apiClient } from '../../services/apiClient'
import { useApiAction } from '../../hooks/useApiAction'
import { useToast } from '../../stores/notificationStore'

interface ProjectFormProps {
  onSuccess?: () => void | Promise<void>
}

export const ProjectForm: React.FC<ProjectFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({ name: '', description: '' })
  const toast = useToast()
  const { execute, isLoading, error, reset } = useApiAction({
    successMessage: 'Project created successfully',
    onSuccess,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      toast.warning('Project name is required')
      return
    }

    const result = await execute(() =>
      apiClient.post('/api/projects', {
        name: formData.name,
        description: formData.description,
      })
    )

    if (result.success) {
      setFormData({ name: '', description: '' })
      reset()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Project Name
        </label>
        <input
          type="text"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Enter project name"
        />
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Description (Optional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          disabled={isLoading}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="Enter project description"
          rows={3}
        />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error.message}</p>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center justify-center gap-2"
      >
        {isLoading && <Loader className="h-4 w-4 animate-spin" />}
        {isLoading ? 'Creating...' : 'Create Project'}
      </button>
    </form>
  )
}
