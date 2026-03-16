import { useState, FormEvent } from 'react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  createChecklist,
  deleteChecklist,
  createChecklistItem,
  updateChecklistItem,
  deleteChecklistItem,
} from '@/services/checklists'
import type { Checklist } from '@/types'

interface Props {
  taskId: string
  boardId: string
  checklists: Checklist[]
}

export default function ChecklistSection({ taskId, boardId, checklists }: Props) {
  const queryClient = useQueryClient()
  const [showAddChecklist, setShowAddChecklist] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ['boards', boardId, 'tasks'] })
  }

  const addChecklistMutation = useMutation({
    mutationFn: (title: string) => createChecklist(taskId, { title }),
    onSuccess: () => {
      invalidate()
      setNewTitle('')
      setShowAddChecklist(false)
    },
  })

  const handleAddChecklist = (e: FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return
    addChecklistMutation.mutate(newTitle.trim())
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-gray-700">Checklists</p>
        {!showAddChecklist && (
          <button
            type="button"
            onClick={() => setShowAddChecklist(true)}
            className="text-xs text-primary-600 hover:text-primary-700"
          >
            + Add checklist
          </button>
        )}
      </div>

      {showAddChecklist && (
        <form onSubmit={handleAddChecklist} className="flex gap-2">
          <input
            autoFocus
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            placeholder="Checklist title"
            maxLength={200}
            className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          <button
            type="submit"
            disabled={addChecklistMutation.isPending}
            className="px-3 py-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700 disabled:opacity-50"
          >
            Add
          </button>
          <button
            type="button"
            onClick={() => { setShowAddChecklist(false); setNewTitle('') }}
            className="px-2 py-1 text-xs text-secondary-500"
          >
            Cancel
          </button>
        </form>
      )}

      {checklists.map((cl) => (
        <SingleChecklist
          key={cl.id}
          checklist={cl}
          taskId={taskId}
          onInvalidate={invalidate}
        />
      ))}
    </div>
  )
}

function SingleChecklist({
  checklist,
  taskId,
  onInvalidate,
}: {
  checklist: Checklist
  taskId: string
  onInvalidate: () => void
}) {
  const [newItemContent, setNewItemContent] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const deleteClMutation = useMutation({
    mutationFn: () => deleteChecklist(taskId, checklist.id),
    onSuccess: onInvalidate,
  })

  const addItemMutation = useMutation({
    mutationFn: (content: string) => createChecklistItem(checklist.id, { content }),
    onSuccess: () => {
      onInvalidate()
      setNewItemContent('')
    },
  })

  const toggleItemMutation = useMutation({
    mutationFn: ({ itemId, is_completed }: { itemId: string; is_completed: boolean }) =>
      updateChecklistItem(checklist.id, itemId, { is_completed }),
    onSuccess: onInvalidate,
  })

  const deleteItemMutation = useMutation({
    mutationFn: (itemId: string) => deleteChecklistItem(checklist.id, itemId),
    onSuccess: onInvalidate,
  })

  const handleAddItem = (e: FormEvent) => {
    e.preventDefault()
    if (!newItemContent.trim()) return
    addItemMutation.mutate(newItemContent.trim())
  }

  const completed = checklist.items.filter((i) => i.is_completed).length
  const total = checklist.items.length
  const pct = total > 0 ? (completed / total) * 100 : 0

  return (
    <div className="border border-gray-200 rounded-md p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-gray-900">{checklist.title}</h4>
        {confirmDelete ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => deleteClMutation.mutate()}
              className="text-xs text-red-600 hover:text-red-700 font-medium"
            >
              Yes
            </button>
            <span className="text-xs text-secondary-500">/</span>
            <button
              type="button"
              onClick={() => setConfirmDelete(false)}
              className="text-xs text-secondary-500"
            >
              No
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className="text-xs text-secondary-500 hover:text-red-600"
          >
            Delete
          </button>
        )}
      </div>

      {/* Progress */}
      {total > 0 && (
        <div className="mb-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs text-secondary-500">{completed}/{total}</span>
          </div>
          <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all ${pct === 100 ? 'bg-green-500' : 'bg-primary-500'}`}
              style={{ width: `${pct}%` }}
            />
          </div>
        </div>
      )}

      {/* Items */}
      <div className="space-y-1">
        {checklist.items.map((item) => (
          <div key={item.id} className="flex items-center gap-2 group">
            <input
              type="checkbox"
              checked={item.is_completed}
              onChange={() =>
                toggleItemMutation.mutate({
                  itemId: item.id,
                  is_completed: !item.is_completed,
                })
              }
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span
              className={`flex-1 text-sm ${
                item.is_completed ? 'line-through text-secondary-500' : 'text-gray-700'
              }`}
            >
              {item.content}
            </span>
            <button
              type="button"
              onClick={() => deleteItemMutation.mutate(item.id)}
              className="text-xs text-secondary-500 hover:text-red-600 opacity-0 group-hover:opacity-100"
            >
              &times;
            </button>
          </div>
        ))}
      </div>

      {/* Add item */}
      <form onSubmit={handleAddItem} className="mt-2 flex gap-2">
        <input
          type="text"
          value={newItemContent}
          onChange={(e) => setNewItemContent(e.target.value)}
          placeholder="Add an item..."
          maxLength={500}
          className="flex-1 px-2 py-1 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        <button
          type="submit"
          disabled={addItemMutation.isPending}
          className="px-2 py-1 bg-primary-600 text-white rounded text-xs hover:bg-primary-700 disabled:opacity-50"
        >
          Add
        </button>
      </form>
    </div>
  )
}
