import { useState, useEffect, useRef, FormEvent } from 'react'
import { createPortal } from 'react-dom'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { updateTask, deleteTask } from '@/services/tasks'
import LabelPicker from '@/components/tasks/LabelPicker'
import ChecklistSection from '@/components/tasks/ChecklistSection'
import CommentsSection from '@/components/tasks/CommentsSection'
import ActivitySection from '@/components/tasks/ActivitySection'
import type { Task } from '@/types'

interface Props {
  task: Task
  boardId: string
  projectId?: string
  onClose: () => void
}

export default function TaskDetailModal({ task, boardId, projectId, onClose }: Props) {
  const queryClient = useQueryClient()
  const [title, setTitle] = useState(task.title)
  const [description, setDescription] = useState(task.description ?? '')
  const [priority, setPriority] = useState(task.priority)
  const [status, setStatus] = useState(task.status)
  const [dueDate, setDueDate] = useState(task.due_date ? task.due_date.split('T')[0] : '')
  const [coverColor, setCoverColor] = useState(task.cover_color ?? '')
  const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>(
    task.labels?.map((l) => l.id) ?? []
  )
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [showLabelPicker, setShowLabelPicker] = useState(false)
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

  const archiveMutation = useMutation({
    mutationFn: () => updateTask(boardId, task.id, { is_archived: !task.is_archived }),
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
      due_date: dueDate || null,
      cover_color: coverColor || null,
      label_ids: selectedLabelIds,
    })
  }

  const toggleLabel = (labelId: string) => {
    setSelectedLabelIds((prev) =>
      prev.includes(labelId) ? prev.filter((id) => id !== labelId) : [...prev, labelId]
    )
  }

  const hasChanges =
    title !== task.title ||
    (description || '') !== (task.description || '') ||
    priority !== task.priority ||
    status !== task.status ||
    dueDate !== (task.due_date ? task.due_date.split('T')[0] : '') ||
    coverColor !== (task.cover_color ?? '') ||
    JSON.stringify(selectedLabelIds.sort()) !==
      JSON.stringify((task.labels?.map((l) => l.id) ?? []).sort())

  const coverColors = ['#61BD4F', '#F2D600', '#FF9F1A', '#EB5A46', '#C377E0', '#0079BF', '#00C2E0', '#51E898']

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
        className="bg-white rounded-lg w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto outline-none"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Cover color banner */}
        {coverColor && (
          <div className="h-8 rounded-t-lg" style={{ backgroundColor: coverColor }} />
        )}

        <form onSubmit={handleSave} className="p-6">
          <div className="flex gap-6">
            {/* Main content */}
            <div className="flex-1 space-y-4 min-w-0">
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

              {/* Labels display */}
              {selectedLabelIds.length > 0 && task.labels && (
                <div className="flex flex-wrap gap-1">
                  {task.labels
                    .filter((l) => selectedLabelIds.includes(l.id))
                    .map((label) => (
                      <span
                        key={label.id}
                        className="px-2 py-0.5 rounded text-xs text-white font-medium"
                        style={{ backgroundColor: label.color }}
                      >
                        {label.name}
                      </span>
                    ))}
                </div>
              )}

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

              {/* Checklists */}
              {task.checklists && (
                <ChecklistSection
                  taskId={task.id}
                  boardId={boardId}
                  checklists={task.checklists}
                />
              )}

              {/* Comments & Activity */}
              <div className="border-t border-gray-200 pt-4 space-y-4">
                <CommentsSection taskId={task.id} />
                <ActivitySection taskId={task.id} />
              </div>

              {/* Timestamps */}
              <div className="text-xs text-secondary-500 space-y-1">
                <p>Created: {new Date(task.created_at).toLocaleString()}</p>
                <p>Updated: {new Date(task.updated_at).toLocaleString()}</p>
              </div>
            </div>

            {/* Sidebar */}
            <div className="w-48 shrink-0 space-y-4">
              {/* Priority */}
              <div>
                <label htmlFor="taskPriority" className="block text-sm font-medium text-gray-700 mb-1">
                  Priority
                </label>
                <select
                  id="taskPriority"
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Task['priority'])}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>

              {/* Status */}
              <div>
                <label htmlFor="taskStatus" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="taskStatus"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as Task['status'])}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="todo">To Do</option>
                  <option value="in_progress">In Progress</option>
                  <option value="done">Done</option>
                </select>
              </div>

              {/* Due date */}
              <div>
                <label htmlFor="taskDueDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Due Date
                </label>
                <input
                  id="taskDueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                {dueDate && (
                  <button
                    type="button"
                    onClick={() => setDueDate('')}
                    className="text-xs text-secondary-500 hover:text-red-600 mt-1"
                  >
                    Clear date
                  </button>
                )}
              </div>

              {/* Labels */}
              <div>
                <button
                  type="button"
                  onClick={() => setShowLabelPicker(!showLabelPicker)}
                  className="w-full px-2 py-1.5 text-sm text-left border border-gray-300 rounded-md hover:bg-gray-50"
                >
                  Labels ({selectedLabelIds.length})
                </button>
                {showLabelPicker && projectId && (
                  <div className="mt-2 p-2 border border-gray-200 rounded-md bg-white">
                    <LabelPicker
                      projectId={projectId}
                      selectedLabelIds={selectedLabelIds}
                      onToggle={toggleLabel}
                    />
                  </div>
                )}
              </div>

              {/* Cover color */}
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">Cover</p>
                <div className="flex flex-wrap gap-1">
                  {coverColors.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setCoverColor(coverColor === c ? '' : c)}
                      className={`w-6 h-6 rounded ${coverColor === c ? 'ring-2 ring-offset-1 ring-gray-900' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              {/* Archive */}
              <button
                type="button"
                onClick={() => archiveMutation.mutate()}
                disabled={archiveMutation.isPending}
                className="w-full px-2 py-1.5 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-left"
              >
                {task.is_archived ? 'Unarchive' : 'Archive'}
              </button>
            </div>
          </div>

          {/* Error */}
          {updateMutation.error && (
            <p className="text-sm text-red-600 mt-4">Failed to update task.</p>
          )}
          {deleteMutation.error && (
            <p className="text-sm text-red-600 mt-4">Failed to delete task.</p>
          )}

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
