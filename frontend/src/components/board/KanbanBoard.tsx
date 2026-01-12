import { useState, useCallback, useMemo } from 'react'
import {
  DndContext,
  DragEndEvent,
  DragOverEvent,
  DragStartEvent,
  closestCorners,
} from '@dnd-kit/core'
import type { Task } from '@/types'
import { useLocalStorageTasks } from '@/hooks/useLocalStorage'
import { KanbanColumn } from './KanbanColumn'
import { AddTaskModal } from './AddTaskModal'

interface KanbanBoardProps {
  boardId: string
}

/**
 * KanbanBoard - Main board container component
 * 
 * Manages the complete kanban board with:
 * - Three columns: Todo, In Progress, Done
 * - Drag-and-drop functionality using @dnd-kit/core
 * - Task persistence via localStorage
 * - Add/delete/move task operations
 */
export const KanbanBoard: React.FC<KanbanBoardProps> = ({ boardId }) => {
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalColumn, setModalColumn] = useState<Task['column']>('todo')

  // Persistent storage
  const { tasks, addTask, removeTask, moveTask, isLoading } = useLocalStorageTasks('tasks')

  // Filter tasks by board
  const boardTasks = useMemo(
    () => tasks.filter((task) => task.boardId === boardId),
    [tasks, boardId]
  )

  // Organize tasks by column
  const tasksByColumn = useMemo(
    () => ({
      'todo': boardTasks.filter((task) => task.column === 'todo'),
      'in-progress': boardTasks.filter((task) => task.column === 'in-progress'),
      'done': boardTasks.filter((task) => task.column === 'done'),
    }),
    [boardTasks]
  )

  // Handle adding a new task from modal
  const handleAddTask = useCallback(
    (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
      const newTask: Task = {
        ...taskData,
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      addTask(newTask)
      setIsModalOpen(false)
    },
    [addTask]
  )

  // Handle deleting a task
  const handleDeleteTask = useCallback(
    (taskId: string) => {
      removeTask(taskId)
    },
    [removeTask]
  )

  // Handle opening the add task modal for a specific column
  const handleOpenModal = useCallback((column: Task['column']) => {
    setModalColumn(column)
    setIsModalOpen(true)
  }, [])

  // Drag start - validate dragging task
  const handleDragStart = (event: DragStartEvent) => {
    const taskId = String(event.active.id)
    // Validate that the task exists in board tasks
    const task = boardTasks.find((t) => t.id === taskId)
    if (!task) {
      // Task not found, drag will be ignored by dnd context
      return
    }
  }

  // Drag over - visual feedback placeholder
  const handleDragOver = (event: DragOverEvent) => {
    // Placeholder for future visual feedback enhancements
    event
  }

  // Drag end - move task to new column
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (!over) return

    const taskId = String(active.id)
    const overColumnId = String(over.id)

    // Check if over is a valid column
    if (!['todo', 'in-progress', 'done'].includes(overColumnId)) return

    const task = boardTasks.find((t) => t.id === taskId)
    if (!task || task.column === overColumnId) return

    // Move task to new column
    moveTask(taskId, overColumnId as Task['column'])
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-500">Loading board...</p>
      </div>
    )
  }

  return (
    <DndContext
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      {/* Main board container */}
      <div className="flex flex-col gap-4 h-full bg-gray-50 p-6">
        {/* Board header */}
        <div className="mb-4">
          <h1 className="text-3xl font-bold text-gray-900">Kanban Board</h1>
          <p className="text-gray-600 mt-1">
            Organize your tasks across Todo, In Progress, and Done
          </p>
        </div>

        {/* Columns grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 auto-rows-max md:auto-rows-fr">
          {/* Todo Column */}
          <div className="flex flex-col min-h-96">
            <KanbanColumn
              columnId="todo"
              columnTitle="Todo"
              tasks={tasksByColumn['todo']}
              onAddTask={() => handleOpenModal('todo')}
              onDeleteTask={handleDeleteTask}
            />
          </div>

          {/* In Progress Column */}
          <div className="flex flex-col min-h-96">
            <KanbanColumn
              columnId="in-progress"
              columnTitle="In Progress"
              tasks={tasksByColumn['in-progress']}
              onAddTask={() => handleOpenModal('in-progress')}
              onDeleteTask={handleDeleteTask}
            />
          </div>

          {/* Done Column */}
          <div className="flex flex-col min-h-96">
            <KanbanColumn
              columnId="done"
              columnTitle="Done"
              tasks={tasksByColumn['done']}
              onAddTask={() => handleOpenModal('done')}
              onDeleteTask={handleDeleteTask}
            />
          </div>
        </div>
      </div>

      {/* Add Task Modal */}
      {isModalOpen && (
        <AddTaskModal
          isOpen={isModalOpen}
          boardId={boardId}
          onSubmit={(taskData) =>
            handleAddTask({
              ...taskData,
              column: modalColumn,
            })
          }
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </DndContext>
  )
}

export default KanbanBoard
