import { useState, useMemo, FormEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { getTasks } from '@/services/tasks'
import { updateBoard, deleteBoard } from '@/services/boards'
import TaskCard from '@/components/tasks/TaskCard'
import CreateTaskForm from '@/components/tasks/CreateTaskForm'
import type { Board } from '@/types'

interface Props {
  board: Board
  projectId: string
  filters?: {
    searchText?: string
    priorities?: string[]
    labelIds?: string[]
    dueDateFilter?: string
    assigneeId?: string | null
  }
}

export default function BoardColumn({ board, projectId, filters }: Props) {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(board.name)
  const [confirmDelete, setConfirmDelete] = useState(false)

  const { setNodeRef } = useDroppable({ id: board.id, data: { type: 'board' } })

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['boards', board.id, 'tasks'],
    queryFn: () => getTasks(board.id),
  })

  const renameMutation = useMutation({
    mutationFn: (name: string) => updateBoard(projectId, board.id, { name }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'boards'] })
      setIsEditing(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: () => deleteBoard(projectId, board.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'boards'] })
    },
  })

  const handleRename = (e: FormEvent) => {
    e.preventDefault()
    if (editName.trim() && editName !== board.name) {
      renameMutation.mutate(editName.trim())
    } else {
      setIsEditing(false)
      setEditName(board.name)
    }
  }

  const sortedTasks = useMemo(() => {
    if (!tasks) return []
    let filtered = [...tasks].filter((t) => !t.is_archived)

    // Apply filters
    if (filters?.searchText) {
      const q = filters.searchText.toLowerCase()
      filtered = filtered.filter(
        (t) =>
          t.title.toLowerCase().includes(q) ||
          (t.description && t.description.toLowerCase().includes(q))
      )
    }
    if (filters?.priorities && filters.priorities.length > 0) {
      filtered = filtered.filter((t) => filters.priorities!.includes(t.priority))
    }
    if (filters?.labelIds && filters.labelIds.length > 0) {
      filtered = filtered.filter((t) =>
        t.labels?.some((l) => filters.labelIds!.includes(l.id))
      )
    }
    if (filters?.dueDateFilter === 'overdue') {
      filtered = filtered.filter((t) => t.due_date && new Date(t.due_date) < new Date())
    } else if (filters?.dueDateFilter === 'due_this_week') {
      const now = new Date()
      const weekFromNow = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000)
      filtered = filtered.filter(
        (t) => t.due_date && new Date(t.due_date) >= now && new Date(t.due_date) <= weekFromNow
      )
    } else if (filters?.dueDateFilter === 'no_date') {
      filtered = filtered.filter((t) => !t.due_date)
    }
    if (filters?.assigneeId) {
      filtered = filtered.filter((t) => t.assignee_id === filters.assigneeId)
    }

    return filtered.sort((a, b) => a.position - b.position)
  }, [tasks, filters])

  const taskIds = useMemo(() => sortedTasks.map((t) => t.id), [sortedTasks])

  return (
    <div
      ref={setNodeRef}
      className={`w-80 shrink-0 rounded-lg p-3 flex flex-col max-h-[calc(100vh-12rem)] bg-gray-100`}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        {isEditing ? (
          <form onSubmit={handleRename} className="flex-1 mr-2">
            <input
              autoFocus
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
              onBlur={handleRename}
              maxLength={200}
              className="w-full px-2 py-1 text-sm font-semibold border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </form>
        ) : (
          <h3
            onDoubleClick={() => setIsEditing(true)}
            className="font-semibold text-gray-900 text-sm truncate flex-1 cursor-pointer"
            title="Double-click to rename"
          >
            {board.name}
            {sortedTasks.length > 0 ? (
              <span className="ml-2 text-xs font-normal text-secondary-500">
                {sortedTasks.length}
              </span>
            ) : null}
          </h3>
        )}
        {confirmDelete ? (
          <div className="flex items-center gap-1 ml-2 shrink-0">
            <button
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="text-xs text-red-600 hover:text-red-700 font-medium disabled:opacity-50"
            >
              {deleteMutation.isPending ? '...' : 'Yes'}
            </button>
            <span className="text-xs text-secondary-500">/</span>
            <button
              onClick={() => setConfirmDelete(false)}
              className="text-xs text-secondary-500 hover:text-gray-900"
            >
              No
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="ml-2 text-secondary-500 hover:text-red-600 text-xs shrink-0"
            title="Delete board"
          >
            &times;
          </button>
        )}
      </div>

      {/* Errors */}
      {renameMutation.error && (
        <p className="text-xs text-red-600 mb-2">Failed to rename board.</p>
      )}
      {deleteMutation.error && (
        <p className="text-xs text-red-600 mb-2">Failed to delete board.</p>
      )}

      {/* Task list */}
      <div className="flex-1 overflow-y-auto space-y-2 min-h-[2rem]">
        {isLoading ? (
          <p className="text-xs text-secondary-500">Loading...</p>
        ) : (
          <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
            {sortedTasks.length > 0 ? (
              sortedTasks.map((task) => (
                <TaskCard key={task.id} task={task} boardId={board.id} projectId={projectId} />
              ))
            ) : (
              <p className="text-xs text-secondary-500 text-center py-2">No tasks</p>
            )}
          </SortableContext>
        )}
      </div>

      {/* Add task */}
      <CreateTaskForm boardId={board.id} />
    </div>
  )
}
