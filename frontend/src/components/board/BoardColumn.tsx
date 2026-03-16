import { useState, FormEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useDroppable } from '@dnd-kit/core'
import { getTasks } from '@/services/tasks'
import { updateBoard, deleteBoard } from '@/services/boards'
import TaskCard from '@/components/tasks/TaskCard'
import CreateTaskForm from '@/components/tasks/CreateTaskForm'
import type { Board } from '@/types'

interface Props {
  board: Board
  projectId: string
}

export default function BoardColumn({ board, projectId }: Props) {
  const queryClient = useQueryClient()
  const [isEditing, setIsEditing] = useState(false)
  const [editName, setEditName] = useState(board.name)

  const { setNodeRef, isOver } = useDroppable({ id: board.id })

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

  return (
    <div
      ref={setNodeRef}
      className={`w-80 shrink-0 rounded-lg p-3 flex flex-col max-h-[calc(100vh-12rem)] ${
        isOver ? 'bg-primary-50 ring-2 ring-primary-300' : 'bg-gray-100'
      }`}
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
            {tasks ? (
              <span className="ml-2 text-xs font-normal text-secondary-500">
                {tasks.length}
              </span>
            ) : null}
          </h3>
        )}
        <button
          onClick={() => deleteMutation.mutate()}
          className="ml-2 text-secondary-500 hover:text-red-600 text-xs shrink-0"
          title="Delete board"
        >
          &times;
        </button>
      </div>

      {/* Task list */}
      <div className="flex-1 overflow-y-auto space-y-2 min-h-[2rem]">
        {isLoading ? (
          <p className="text-xs text-secondary-500">Loading...</p>
        ) : tasks && tasks.length > 0 ? (
          tasks.map((task) => (
            <TaskCard key={task.id} task={task} boardId={board.id} />
          ))
        ) : (
          <p className="text-xs text-secondary-500 text-center py-2">No tasks</p>
        )}
      </div>

      {/* Add task */}
      <CreateTaskForm boardId={board.id} />
    </div>
  )
}
