import { useState } from 'react'
import { useDraggable } from '@dnd-kit/core'
import TaskDetailModal from '@/components/tasks/TaskDetailModal'
import type { Task } from '@/types'

const priorityStyles: Record<string, string> = {
  high: 'bg-red-100 text-red-700',
  medium: 'bg-yellow-100 text-yellow-700',
  low: 'bg-gray-100 text-gray-600',
}

interface Props {
  task: Task
  boardId: string
  isOverlay?: boolean
}

export default function TaskCard({ task, boardId, isOverlay }: Props) {
  const [showModal, setShowModal] = useState(false)

  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: task.id,
    data: { task, boardId },
  })

  return (
    <>
      <div
        ref={!isOverlay ? setNodeRef : undefined}
        {...(!isOverlay ? { ...attributes, ...listeners } : {})}
        onClick={() => {
          if (!isDragging) setShowModal(true)
        }}
        className={`bg-white rounded-md p-3 shadow-sm border border-gray-200 hover:shadow-md cursor-pointer select-none ${
          isDragging ? 'opacity-30' : ''
        } ${isOverlay ? 'shadow-lg ring-2 ring-primary-300 rotate-2' : ''}`}
      >
        <p className="text-sm font-medium text-gray-900 leading-snug">{task.title}</p>
        <div className="flex items-center gap-2 mt-2">
          <span
            className={`text-xs px-1.5 py-0.5 rounded font-medium ${
              priorityStyles[task.priority] || priorityStyles.medium
            }`}
          >
            {task.priority}
          </span>
          {task.status !== 'todo' && (
            <span className="text-xs text-secondary-500">
              {task.status === 'in_progress' ? 'In Progress' : 'Done'}
            </span>
          )}
        </div>
      </div>

      {showModal && (
        <TaskDetailModal
          task={task}
          boardId={boardId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}
