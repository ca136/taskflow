import React, { useState } from 'react'
import { Loader } from 'lucide-react'
import { apiClient } from '../../services/apiClient'
import { useApiAction } from '../../hooks/useApiAction'
import { useToast } from '../../stores/notificationStore'

interface TaskFormProps {
  projectId: string
  onSuccess?: () => void | Promise<void>
}

export const TaskForm: React.FC<TaskFormProps> = ({ projectId, onSuccess }) => {
  const [title, setTitle] = useState('')
  const toast = useToast()
  const { execute, isLoading, error } = useApiAction({
    successMessage: 'Task created successfully',
    onSuccess,
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim()) {
      toast.warning('Task title is required')
      return
    }

    const result = await execute(() =>
      apiClient.post(`/api/projects/${projectId}/tasks`, {
        title: title.trim(),
        status: 'todo',
      })
    )

    if (result.success) {
      setTitle('')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
          className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
          placeholder="What needs to be done?"
        />
        <button
          type="submit"
          disabled={isLoading || !title.trim()}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
        >
          {isLoading && <Loader className="h-4 w-4 animate-spin" />}
          {isLoading ? 'Adding...' : 'Add'}
        </button>
      </div>

      {error && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">{error.message}</p>
        </div>
      )}
    </form>
  )
}
