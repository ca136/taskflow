import React, { useCallback, useState } from 'react'
import { Modal } from './common/Modal'
import { Task } from '../types/task'

interface DeleteConfirmationProps {
  isOpen: boolean
  task: Task | null
  onCancel: () => void
  onConfirm: () => Promise<void> | void
  isLoading?: boolean
}

/**
 * DeleteConfirmation Component
 * Modal dialog for confirming task deletion
 * Shows task title and warning message with Cancel/Delete action buttons
 */
export const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({
  isOpen,
  task,
  onCancel,
  onConfirm,
  isLoading = false,
}) => {
  const [isDeleting, setIsDeleting] = useState(false)

  const handleConfirm = useCallback(async () => {
    setIsDeleting(true)
    try {
      await Promise.resolve(onConfirm())
    } finally {
      setIsDeleting(false)
    }
  }, [onConfirm])

  if (!task) return null

  const footer = (
    <div className="flex gap-3 justify-end">
      <button
        onClick={onCancel}
        disabled={isDeleting || isLoading}
        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Cancel delete operation"
      >
        Cancel
      </button>
      <button
        onClick={handleConfirm}
        disabled={isDeleting || isLoading}
        className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        aria-label="Confirm task deletion"
      >
        {isDeleting || isLoading ? 'Deleting...' : 'Delete'}
      </button>
    </div>
  )

  return (
    <Modal
      isOpen={isOpen}
      onClose={onCancel}
      title="Delete Task"
      size="sm"
      footer={footer}
      closeOnBackdropClick={!isDeleting && !isLoading}
      closeOnEsc={!isDeleting && !isLoading}
    >
      <div className="space-y-4">
        {/* Task Title Display */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm font-medium text-gray-600 mb-1">Task to delete:</p>
          <p className="text-lg font-semibold text-gray-900 break-words">
            {task.title}
          </p>
        </div>

        {/* Warning Message */}
        <div className="flex gap-3 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex-shrink-0 mt-0.5">
            <svg
              className="w-5 h-5 text-yellow-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-yellow-800">
              This action cannot be undone.
            </p>
            <p className="text-sm text-yellow-700 mt-1">
              Once you delete this task, all associated data will be permanently removed.
            </p>
          </div>
        </div>
      </div>
    </Modal>
  )
}

export default DeleteConfirmation
