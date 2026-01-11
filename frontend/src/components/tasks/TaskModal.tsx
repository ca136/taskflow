import { Task, User } from '../../types'
import { useState, useEffect } from 'react'
import { Loader } from 'lucide-react'

interface TaskModalProps {
  task: Task | null
  isOpen: boolean
  onClose: () => void
  onSave?: (task: Task) => Promise<void>
  onDelete?: (taskId: string) => Promise<void>
  users?: User[]
  isEditing?: boolean
  setIsEditing?: (isEditing: boolean) => void
}

export const TaskModal: React.FC<TaskModalProps> = ({
  task,
  isOpen,
  onClose,
  onSave,
  onDelete,
  users = [],
  isEditing = false,
  setIsEditing,
}) => {
  const [formData, setFormData] = useState<Task | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  // Sync form data when task changes
  useEffect(() => {
    if (task) {
      setFormData({ ...task })
      setSaveError(null)
      setDeleteError(null)
    }
  }, [task, isOpen])

  if (!isOpen || !task || !formData) {
    return null
  }

  const handleClose = () => {
    setShowDeleteConfirm(false)
    if (setIsEditing) setIsEditing(false)
    setSaveError(null)
    setDeleteError(null)
    onClose()
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => (prev ? { ...prev, [name]: value } : null))
    setSaveError(null)
  }

  const handleSave = async () => {
    if (formData && onSave) {
      setIsSaving(true)
      setSaveError(null)
      try {
        await onSave(formData)
        if (setIsEditing) setIsEditing(false)
        handleClose()
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to save task'
        setSaveError(errorMessage)
      } finally {
        setIsSaving(false)
      }
    }
  }

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true)
    setDeleteError(null)
  }

  const confirmDelete = async () => {
    if (onDelete) {
      setIsDeleting(true)
      setDeleteError(null)
      try {
        await onDelete(task.id)
        setShowDeleteConfirm(false)
        handleClose()
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to delete task'
        setDeleteError(errorMessage)
      } finally {
        setIsDeleting(false)
      }
    }
  }

  const getPriorityColor = (priority: Task['priority']): string => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'low':
        return 'bg-green-100 text-green-800 border-green-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const statusLabels = {
    todo: 'To Do',
    'in-progress': 'In Progress',
    done: 'Done',
  }

  const priorityLabels = {
    high: 'High',
    medium: 'Medium',
    low: 'Low',
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const selectedAssignee = users.find((u) => u.id === formData.assignee)
  const isProcessing = isSaving || isDeleting

  return (
    <>
      {/* Modal Overlay */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 z-40"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal Content */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto" role="dialog">
        <div
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full my-8"
          onClick={(e) => e.stopPropagation()}
          role="document"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Task' : 'Task Details'}
            </h2>
            <button
              onClick={handleClose}
              disabled={isProcessing}
              className="text-gray-400 hover:text-gray-600 disabled:text-gray-300 transition-colors text-2xl leading-none disabled:cursor-not-allowed"
              title="Close"
              aria-label="Close modal"
            >
              ✕
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Save Error Alert */}
            {saveError && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg" role="alert">
                <p className="text-sm text-red-800 font-medium">Error</p>
                <p className="text-sm text-red-700 mt-1">{saveError}</p>
              </div>
            )}

            {/* Title */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="task-title">
                Title
              </label>
              {isEditing ? (
                <input
                  id="task-title"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  disabled={isProcessing}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  data-testid="task-title-input"
                />
              ) : (
                <p className="text-gray-900 font-medium">{formData.title}</p>
              )}
            </div>

            {/* Description */}
            <div>
              <label
                className="block text-sm font-semibold text-gray-700 mb-2"
                htmlFor="task-description"
              >
                Description
              </label>
              {isEditing ? (
                <textarea
                  id="task-description"
                  name="description"
                  value={formData.description || ''}
                  onChange={handleInputChange}
                  placeholder="Add a description..."
                  disabled={isProcessing}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none resize-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                  data-testid="task-description-input"
                />
              ) : (
                <p className="text-gray-600 whitespace-pre-wrap">
                  {formData.description || 'No description'}
                </p>
              )}
            </div>

            {/* Status, Priority, Assignee - Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Status */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="task-status">
                  Status
                </label>
                {isEditing ? (
                  <select
                    id="task-status"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    disabled={isProcessing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    data-testid="task-status-select"
                  >
                    <option value="todo">{statusLabels.todo}</option>
                    <option value="in-progress">{statusLabels['in-progress']}</option>
                    <option value="done">{statusLabels.done}</option>
                  </select>
                ) : (
                  <div className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">
                    {statusLabels[formData.status]}
                  </div>
                )}
              </div>

              {/* Priority */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="task-priority">
                  Priority
                </label>
                {isEditing ? (
                  <select
                    id="task-priority"
                    name="priority"
                    value={formData.priority}
                    onChange={handleInputChange}
                    disabled={isProcessing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    data-testid="task-priority-select"
                  >
                    <option value="low">{priorityLabels.low}</option>
                    <option value="medium">{priorityLabels.medium}</option>
                    <option value="high">{priorityLabels.high}</option>
                  </select>
                ) : (
                  <div
                    className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(
                      formData.priority
                    )}`}
                  >
                    {priorityLabels[formData.priority]}
                  </div>
                )}
              </div>

              {/* Assignee */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="task-assignee">
                  Assignee
                </label>
                {isEditing ? (
                  <select
                    id="task-assignee"
                    name="assignee"
                    value={formData.assignee || ''}
                    onChange={handleInputChange}
                    disabled={isProcessing}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
                    data-testid="task-assignee-select"
                  >
                    <option value="">Unassigned</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="flex items-center gap-2">
                    {selectedAssignee ? (
                      <>
                        <div className="w-8 h-8 bg-primary-500 text-white rounded-full flex items-center justify-center text-sm font-bold">
                          {selectedAssignee.name.charAt(0).toUpperCase()}
                        </div>
                        <span className="text-gray-900 font-medium">{selectedAssignee.name}</span>
                      </>
                    ) : (
                      <span className="text-gray-500">Unassigned</span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Metadata */}
            {!isEditing && (
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Created</p>
                  <p className="text-sm text-gray-900">{formatDate(formData.createdAt)}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Updated</p>
                  <p className="text-sm text-gray-900">{formatDate(formData.updatedAt)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
            <button
              onClick={handleDeleteClick}
              disabled={isProcessing}
              className="px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 disabled:text-red-300 disabled:bg-transparent disabled:cursor-not-allowed rounded-lg transition-colors font-medium"
              title="Delete task"
              data-testid="delete-task-btn"
            >
              Delete
            </button>

            <div className="flex gap-3">
              {isEditing && (
                <button
                  onClick={() => {
                    if (setIsEditing) setIsEditing(false)
                    setFormData({ ...task })
                    setSaveError(null)
                  }}
                  disabled={isProcessing}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors font-medium"
                  data-testid="cancel-edit-btn"
                >
                  Cancel
                </button>
              )}

              {!isEditing ? (
                <button
                  onClick={() => {
                    if (setIsEditing) setIsEditing(true)
                  }}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed transition-colors font-medium"
                  data-testid="edit-task-btn"
                >
                  Edit
                </button>
              ) : (
                <button
                  onClick={handleSave}
                  disabled={isProcessing}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:bg-primary-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                  data-testid="save-task-btn"
                >
                  {isSaving && <Loader className="h-4 w-4 animate-spin" />}
                  {isSaving ? 'Saving...' : 'Save'}
                </button>
              )}
            </div>
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
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md" role="alert">
                  <p className="text-sm text-red-800">{deleteError}</p>
                </div>
              )}

              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors font-medium"
                  data-testid="delete-cancel-btn"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white hover:bg-red-700 disabled:bg-red-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center gap-2"
                  data-testid="delete-confirm-btn"
                >
                  {isDeleting && <Loader className="h-4 w-4 animate-spin" />}
                  {isDeleting ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
