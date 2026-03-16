import { useState, useEffect, useRef, FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask, deleteTask } from '@/services/tasks'
import type { Task } from '@/types'

interface Props {
  task: Task
  boardId: string
  onClose: () => void
}

export default function TaskDetailModal({ task, boardId, onClose }: Props) {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? '')
  const [priority, setPriority] = useState(task.priority)
  const [status, setStatus] = useState(task.status)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return

    dialog.focus()

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }

      // Focus trap: cycle focus within the modal
      if (e.key === 'Tab') {
        const focusable = dialog.querySelectorAll<HTMLElement>(
          'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
        )
        if (focusable.length === 0) return

        const first = focusable[0]
        const last = focusable[focusable.length - 1]

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault()
          last.focus()
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault()
          first.focus()
        }
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const updateMutation = useMutation({
    mutationFn: (data: Parameters<typeof updateTask>[2]) =>
      updateTask(boardId, task.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId, 'tasks'] })
      onClose()
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteTask(boardId, task.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['boards', boardId, 'tasks'] })
      onClose()
    },
  })

  const handleSave = (e: FormEvent) => {
    e.preventDefault()
    updateMutation.mutate({
      title: title.trim(),
      description: description.trim() || null,
      priority,
      status,
    })
  }

  const hasChanges =
    title !== task.title ||
    (description || '') !== (task.description || '') ||
    priority !== task.priority ||
    status !== task.status

  return createPortal(
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="taskModalTitle"
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        className="bg-white rounded-lg p-6 w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSave}>
          <div className="space-y-4">
            {/* Title */}
            <div>
              <label htmlFor="taskTitle" id="taskModalTitle" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="taskTitle"
                type="text"
                required
                maxLength={300}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            {/* Description */}
            <div>
              <label htmlFor="taskDesc" className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                id="taskDesc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Add a description..."
              />
            </div>

            {/* Priority & Status */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="taskPriority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="taskPriority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Task['priority'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
              <div>
                <label htmlFor="taskStatus" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="taskStatus"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Task['status'])}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>
            </div>

            {/* Timestamps */}
            <div className="text-xs text-secondary-500 space-y-1">
              <p>Created: {new Date(task.created_at).toLocaleString()}</p>
              <p>Updated: {new Date(task.updated_at).toLocaleString()}</p>
            </div>

            {/* Error */}
            {updateMutation.error && (
              <p className="text-sm text-red-600">Failed to update task.</p>
            )}
            {deleteMutation.error && (
              <p className="text-sm text-red-600">Failed to delete task.</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200">
            <div>
              {confirmDelete ? (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-red-600">Delete this task?</span>
                  <button
                    type="button"
                    onClick={() => deleteMutation.mutate()}
                    disabled={deleteMutation.isPending}
                    className="px-3 py-1.5 bg-red-600 text-white rounded text-sm hover:bg-red-700 disabled:opacity-50"
                  >
                    {deleteMutation.isPending ? 'Deleting...' : 'Yes, delete'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(false)}
                    className="px-3 py-1.5 text-sm text-secondary-500 hover:text-gray-900"
                  >
                    No
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setConfirmDelete(true)}
                  className="text-sm text-red-600 hover:text-red-700"
                >
                  Delete
                </button>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm text-secondary-500 hover:text-gray-900 rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending || !hasChanges}
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 text-sm font-medium"
              >
                {updateMutation.isPending ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>,
    document.body
  )
}
