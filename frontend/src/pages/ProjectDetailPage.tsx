import { useState, useCallback, useRef, useMemo, FormEvent } from 'react'
import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  DndContext,
  DragOverlay,
  pointerWithin,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from '@dnd-kit/core'
import { arrayMove } from '@dnd-kit/sortable'
import { getProject } from '@/services/projects'
import { getBoards, createBoard } from '@/services/boards'
import { updateTask, reorderTasks } from '@/services/tasks'
import BoardColumn from '@/components/board/BoardColumn'
import FilterBar from '@/components/board/FilterBar'
import TaskCard from '@/components/tasks/TaskCard'
import { useFilterStore } from '@/stores/filters'
import type { Task } from '@/types'

export default function ProjectDetailPage() {
  const { projectId } = useParams<{ projectId: string }>()
  const queryClient = useQueryClient()
  const [showBoardForm, setShowBoardForm] = useState(false)
  const [boardName, setBoardName] = useState('')
  const [activeTask, setActiveTask] = useState<{ task: Task; boardId: string } | null>(null)
  const filters = useFilterStore()
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
    const data = active.data.current as { type: string; task: Task; boardId: string } | undefined
    if (data?.type === 'task') {
      setActiveTask({ task: data.task, boardId: data.boardId })
    }
  }, [])

  const handleDragOver = useCallback((event: DragOverEvent) => {
    const { active, over } = event
    if (!over) return

    const activeData = active.data.current as { type: string; task: Task; boardId: string } | undefined
    if (activeData?.type !== 'task') return

    const sourceBoardId = activeData.boardId

    // Determine target board: could be dropping on a task (get its boardId) or on a board directly
    const overData = over.data.current as { type?: string; boardId?: string; task?: Task } | undefined
    let targetBoardId: string

    if (overData?.type === 'task') {
      targetBoardId = overData.boardId!
    } else if (overData?.type === 'board') {
      targetBoardId = String(over.id)
    } else {
      // Dropping on board droppable
      targetBoardId = String(over.id)
    }

    if (sourceBoardId === targetBoardId) return

    // Optimistic: move task from source to target in cache
    const task = activeData.task
    const sourceKey = ['boards', sourceBoardId, 'tasks']
    const targetKey = ['boards', targetBoardId, 'tasks']

    queryClient.setQueryData<Task[]>(sourceKey, (old) =>
      old ? old.filter((t) => t.id !== task.id) : []
    )

    queryClient.setQueryData<Task[]>(targetKey, (old) => {
      if (!old) return [{ ...task, board_id: targetBoardId }]
      if (old.find((t) => t.id === task.id)) return old
      return [...old, { ...task, board_id: targetBoardId }]
    })

    // Update active task's boardId
    setActiveTask((prev) => prev ? { ...prev, boardId: targetBoardId } : prev)
    // Update the data on the active drag element
    active.data.current = { ...activeData, boardId: targetBoardId }
  }, [queryClient])

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    const { active, over } = event
    setMoveError(null)

    const activeData = active.data.current as { type: string; task: Task; boardId: string } | undefined
    if (!activeData || activeData.type !== 'task') {
      setActiveTask(null)
      return
    }

    const task = activeData.task
    const currentBoardId = activeData.boardId

    if (!over) {
      setActiveTask(null)
      return
    }

    // Determine the final board and position
    const overData = over.data.current as { type?: string; boardId?: string; task?: Task } | undefined
    let targetBoardId: string

    if (overData?.type === 'task') {
      targetBoardId = overData.boardId!
    } else {
      targetBoardId = String(over.id)
    }

    const targetKey = ['boards', targetBoardId, 'tasks']
    const currentTasks = queryClient.getQueryData<Task[]>(targetKey) || []

    // Calculate new position
    if (overData?.type === 'task' && overData.task) {
      // Dropped on a specific task — insert at its position
      const overIndex = currentTasks.findIndex((t) => t.id === overData.task!.id)
      const activeIndex = currentTasks.findIndex((t) => t.id === task.id)

      if (activeIndex !== -1 && overIndex !== -1 && activeIndex !== overIndex) {
        const reordered = arrayMove(currentTasks, activeIndex, overIndex)
        const items = reordered.map((t, i) => ({ ...t, position: i }))
        queryClient.setQueryData<Task[]>(targetKey, items)

        // Persist
        try {
          if (currentBoardId !== task.board_id) {
            // Cross-board move
            await updateTask(task.board_id, task.id, {
              board_id: targetBoardId,
              position: overIndex,
            })
          }
          await reorderTasks(
            targetBoardId,
            items.map((t) => ({ id: t.id, position: t.position }))
          )
        } catch {
          setMoveError('Failed to reorder tasks. Please refresh.')
        }
      } else if (currentBoardId !== task.board_id) {
        // Cross-board move, dropped on a task but might be same index
        try {
          await updateTask(task.board_id, task.id, {
            board_id: targetBoardId,
            position: overIndex >= 0 ? overIndex : currentTasks.length - 1,
          })
        } catch {
          setMoveError('Failed to move task. Please refresh.')
        }
      }
    } else {
      // Dropped on empty board area
      if (currentBoardId !== task.board_id) {
        try {
          await updateTask(task.board_id, task.id, {
            board_id: targetBoardId,
          })
        } catch {
          setMoveError('Failed to move task. Please refresh.')
        }
      } else {
        // Same board, possibly reordered within — re-persist positions
        const items = currentTasks.map((t, i) => ({ ...t, position: i }))
        queryClient.setQueryData<Task[]>(targetKey, items)
        try {
          await reorderTasks(
            targetBoardId,
            items.map((t) => ({ id: t.id, position: t.position }))
          )
        } catch {
          setMoveError('Failed to reorder tasks. Please refresh.')
        }
      }
    }

    setActiveTask(null)

    // Refresh all board task caches
    if (boards) {
      for (const b of boards) {
        queryClient.invalidateQueries({ queryKey: ['boards', b.id, 'tasks'] })
      }
    }
  }, [queryClient, boards])

  const sortedBoards = useMemo(
    () => (boards ? [...boards].sort((a, b) => a.position - b.position) : []),
    [boards]
  )

  if (projectLoading || boardsLoading) {
    return <div className="text-secondary-500">Loading...</div>
  }

  if (!project) {
    return <div className="text-red-600">Project not found.</div>
  }

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

      {sortedBoards.length > 0 && <FilterBar projectId={projectId!} />}

      {sortedBoards.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-secondary-500 text-lg">No boards yet.</p>
          <p className="text-secondary-500 text-sm mt-1">Add a board to start organizing tasks.</p>
        </div>
      ) : (
        <DndContext
          collisionDetection={pointerWithin}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 overflow-x-auto pb-4 items-start flex-1">
            {sortedBoards.map((board) => (
              <BoardColumn
                key={board.id}
                board={board}
                projectId={projectId!}
                filters={{
                  searchText: filters.searchText,
                  priorities: filters.priorities,
                  labelIds: filters.labelIds,
                  dueDateFilter: filters.dueDateFilter,
                  assigneeId: filters.assigneeId,
                }}
              />
            ))}
          </div>
          <DragOverlay>
            {activeTask ? (
              <TaskCard task={activeTask.task} boardId={activeTask.boardId} projectId={projectId} isOverlay />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  )
}
