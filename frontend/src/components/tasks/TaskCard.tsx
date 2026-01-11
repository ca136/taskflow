import { Task } from '../../types'
import { useState } from 'react'
import { Loader, Trash2 } from 'lucide-react'

interface TaskCardProps {
  task: Task
  onTaskClick: (task: Task) => void
  onDelete?: (taskId: string) => Promise<void>
  isDeleting?: boolean
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onTaskClick,
  onDelete,
  isDeleting = false,
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteConfirm(true)
    setDeleteError(null)
  }

  const confirmDelete = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onDelete) {
      try {
        setDeleteError(null)
        await onDelete(task.id)
        setShowDeleteConfirm(false)
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete task'
        setDeleteError(errorMessage)
      }
    }
  }

  const cancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    setShowDeleteConfirm(false)
    setDeleteError(null)
  }

  const getPriorityColor = (priority: Task['priority']): string => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const priorityLabels = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  }

  const isLoading = isDeleting

  return (
    <>
      <div
        onClick={() => !isLoading && onTaskClick(task)}
        className={`p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer border border-gray-200 hover:border-primary-500 ${
          isLoading ? 'opacity-75' : ''
        }`}
        aria-busy={isLoading}
        data-testid={`task-card-${task.id}`}
      >
        <div className="space-y-2">
          {/* Title */}
          <h3 className="font-semibold text-gray-900 text-sm line-clamp-2 hover:text-primary-600">
            {task.title}
          </h3>

          {/* Description snippet */}
          {task.description && (
            <p className="text-xs text-gray-600 line-clamp-2">{task.description}</p>
          )}

          {/* Priority and Assignee */}
          <div className="flex items-center justify-between gap-2 pt-2">
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-medium ${getPriorityColor(task.priority)}`}
              data-testid={`task-priority-${task.id}`}
            >
              {priorityLabels[task.priority]}
            </span>

            {task.assignee && (
              <div className="flex items-center gap-1" title={`Assigned to ${task.assignee}`}>
                <div className="w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center text-xs font-bold">
                  {task.assignee.charAt(0).toUpperCase()}
                </div>
              </div>
            )}
          </div>

          {/* Delete button */}
          <div className="pt-2 border-t border-gray-100 flex justify-end">
            <button
              onClick={handleDelete}
              disabled={isLoading}
              className="text-gray-500 hover:text-red-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors p-1 rounded hover:bg-red-50"
              title="Delete task"
              aria-label="Delete task"
              data-testid={`task-delete-btn-${task.id}`}
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" role="dialog">
          <div className="bg-white rounded-lg shadow-lg max-w-sm w-full">
            <div className="p-6">
              <h2 className="text-lg font-bold text-gray-900 mb-4">Delete Task?</h2>
              <p className="text-gray-600 mb-6">
                Are you sure you want to delete "{task.title}"? This action cannot be undone.
              </p>

              {deleteError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-800">{deleteError}</p>
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  onClick={cancelDelete}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 transition-colors font-medium disabled:cursor-not-allowed"
                  data-testid="delete-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 transition-colors font-medium flex items-center gap-2 disabled:cursor-not-allowed"
                  data-testid="delete-confirm-btn"
                >
                  {isLoading && <Loader className="h-4 w-4 animate-spin" />}
                  {isLoading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
