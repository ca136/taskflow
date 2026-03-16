import { useState, useCallback, useRef, FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { DndContext, DragOverlay, closestCorners, type DragStartEvent, type DragEndEvent } from '@dnd-kit/core'
import { getProject } from '@/services/projects'
import { getBoards, createBoard } from '@/services/boards'
import { createTask, deleteTask } from '@/services/tasks'
import BoardColumn from '@/components/board/BoardColumn'
import TaskCard from '@/components/tasks/TaskCard'
import type { Task } from '@/types'

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const queryClient = useQueryClient()
  const [showBoardForm, setShowBoardForm] = useState(false)
  const [boardName, setBoardName] = useState('')
  const [activeTask, setActiveTask] = useState<{ task: Task; boardId: string } | null>(null)
  const [moveError, setMoveError] = useState<string | null>(null)
  const boardNameInputRef = useRef<HTMLInputElement>(null)

  const { data: project, isLoading: projectLoading } = useQuery({
    queryKey: ['projects', projectId],
    queryFn: () => getProject(projectId!),
    enabled: !!projectId,
  })

  const { data: boards, isLoading: boardsLoading } = useQuery({
    queryKey: ['projects', projectId, 'boards'],
    queryFn: () => getBoards(projectId!),
    enabled: !!projectId,
  })

  const createBoardMutation = useMutation({
    mutationFn: (data: { name: string; position?: number }) => createBoard(projectId!, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects', projectId, 'boards'] })
      setBoardName('')
      setShowBoardForm(false)
    },
  })

  const handleCreateBoard = (e: FormEvent) => {
    e.preventDefault()
    const position = boards ? boards.length : 0
    createBoardMutation.mutate({ name: boardName, position })
  }

  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event
    const data = active.data.current as { task: Task; boardId: string } | undefined
    if (data) {
      setActiveTask({ task: data.task, boardId: data.boardId })
    }
  }, [])

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event
    setActiveTask(null)
    setMoveError(null)

    if (!over) return

    const sourceData = active.data.current as { task: Task; boardId: string } | undefined
    if (!sourceData) return

    const targetBoardId = String(over.id)
    const sourceBoardId = sourceData.boardId

    if (sourceBoardId === targetBoardId) return

    const task = sourceData.task

    // Optimistic update: remove from source, add to target
    const sourceKey = ['boards', sourceBoardId, 'tasks']
    const targetKey = ['boards', targetBoardId, 'tasks']
    const prevSource = queryClient.getQueryData<Task[]>(sourceKey)
    const prevTarget = queryClient.getQueryData<Task[]>(targetKey)

    queryClient.setQueryData<Task[]>(sourceKey, (old) =>
      old ? old.filter((t) => t.id !== task.id) : []
    )
    queryClient.setQueryData<Task[]>(targetKey, (old) =>
      old ? [...old, { ...task, board_id: targetBoardId }] : [{ ...task, board_id: targetBoardId }]
    )

    try {
      await createTask(targetBoardId, {
        title: task.title,
        description: task.description ?? undefined,
        priority: task.priority,
        status: task.status,
      })
      await deleteTask(sourceBoardId, task.id)
    } catch {
      // Rollback optimistic update
      queryClient.setQueryData<Task[]>(sourceKey, prevSource)
      queryClient.setQueryData<Task[]>(targetKey, prevTarget)
      setMoveError('Failed to move task. Please try again.')
    } finally {
      queryClient.invalidateQueries({ queryKey: sourceKey })
      queryClient.invalidateQueries({ queryKey: targetKey })
    }
  }, [queryClient])

  if (projectLoading || boardsLoading) {
    return <div className="text-secondary-500">Loading...</div>
  }

  if (!project) {
    return <div className="text-red-600">Project not found.</div>
  }

  const sortedBoards = boards ? [...boards].sort((a, b) => a.position - b.position) : []

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Link
            to="/projects"
            className="text-secondary-500 hover:text-gray-900 text-sm"
          >
            &larr; Projects
          </Link>
          <h2 className="text-2xl font-bold text-gray-900">{project.name}</h2>
        </div>
        <button
          onClick={() => {
            setShowBoardForm(!showBoardForm)
            if (!showBoardForm) {
              setTimeout(() => boardNameInputRef.current?.focus(), 0)
            }
          }}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium"
        >
          {showBoardForm ? 'Cancel' : 'Add Board'}
        </button>
      </div>

      {showBoardForm && (
        <form onSubmit={handleCreateBoard} className="mb-4 flex items-center gap-2">
          <input
            ref={boardNameInputRef}
            type="text"
            required
            maxLength={200}
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm"
            placeholder="Board name"
          />
          <button
            type="submit"
            disabled={createBoardMutation.isPending}
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 text-sm font-medium"
          >
            {createBoardMutation.isPending ? 'Creating...' : 'Create'}
          </button>
          {createBoardMutation.error && (
            <span className="text-sm text-red-600">Failed to create board.</span>
          )}
        </form>
      )}

      {moveError && (
        <div className="mb-4 px-4 py-2 bg-red-50 border border-red-200 rounded-md flex items-center justify-between">
          <p className="text-sm text-red-600">{moveError}</p>
          <button onClick={() => setMoveError(null)} className="text-red-400 hover:text-red-600 text-sm ml-4">&times;</button>
        </div>
      )}

      {sortedBoards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-secondary-500 text-lg">No boards yet.</p>
          <p className="text-secondary-500 text-sm mt-1">Add a board to start organizing tasks.</p>
        </div>
      ) : (
        <DndContext
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4 items-start flex-1">
            {sortedBoards.map((board) => (
              <BoardColumn key={board.id} board={board} projectId={projectId!} />
            ))}
          </div>
          <DragOverlay>
            {activeTask ? (
              <TaskCard task={activeTask.task} boardId={activeTask.boardId} isOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  )
}
