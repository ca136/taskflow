import { useState } from 'react'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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
  projectId?: string
  isOverlay?: boolean
}

export default function TaskCard({ task, boardId, projectId, isOverlay }: Props) {
  const [showModal, setShowModal] = useState(false)

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: { type: 'task', task, boardId },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <>
      <div
        ref={!isOverlay ? setNodeRef : undefined}
        style={!isOverlay ? style : undefined}
        {...(!isOverlay ? { ...attributes, ...listeners } : {})}
        onClick={() => {
          if (!isDragging) setShowModal(true)
        }}
        className={`bg-white rounded-md p-3 shadow-sm border border-gray-200 hover:shadow-md cursor-pointer select-none ${
          isDragging ? 'opacity-30' : ''
        } ${isOverlay ? 'shadow-lg ring-2 ring-primary-300 rotate-2' : ''}`}
      >
        {/* Labels */}
        {task.labels && task.labels.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {task.labels.map((label) => (
              <span
                key={label.id}
                className="h-2 w-8 rounded-full inline-block"
                style={{ backgroundColor: label.color }}
                title={label.name}
              />
            ))}
          </div>
        )}

        {/* Cover color */}
        {task.cover_color && (
          <div
            className="h-2 -mx-3 -mt-3 mb-2 rounded-t-md"
            style={{ backgroundColor: task.cover_color }}
          />
        )}

        <p className="text-sm font-medium text-gray-900 leading-snug">{task.title}</p>
        <div className="flex items-center gap-2 mt-2 flex-wrap">
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
          {task.due_date && (
            <DueDateBadge dueDate={task.due_date} />
          )}
          {task.checklists && task.checklists.length > 0 && (
            <ChecklistProgress checklists={task.checklists} />
          )}
          {task.assignee_name && (
            <span
              className="ml-auto w-6 h-6 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-[10px] font-medium shrink-0"
              title={task.assignee_name}
            >
              {task.assignee_name
                .split(' ')
                .map((n) => n[0])
                .join('')
                .toUpperCase()
                .slice(0, 2)}
            </span>
          )}
        </div>
      </div>

      {showModal && (
        <TaskDetailModal
          task={task}
          boardId={boardId}
          projectId={projectId}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  )
}

function DueDateBadge({ dueDate }: { dueDate: string }) {
  const due = new Date(dueDate)
  const now = new Date()
  const diffMs = due.getTime() - now.getTime()
  const diffHours = diffMs / (1000 * 60 * 60)

  let colorClass = 'bg-gray-100 text-gray-600'
  if (diffMs < 0) {
    colorClass = 'bg-red-100 text-red-700'
  } else if (diffHours < 24) {
    colorClass = 'bg-yellow-100 text-yellow-700'
  }

  const formatted = due.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })

  return (
    <span className={`text-xs px-1.5 py-0.5 rounded ${colorClass}`}>
      {formatted}
    </span>
  )
}

function ChecklistProgress({ checklists }: { checklists: Task['checklists'] }) {
  let total = 0
  let completed = 0
  for (const cl of checklists) {
    for (const item of cl.items) {
      total++
      if (item.is_completed) completed++
    }
  }
  if (total === 0) return null

  return (
    <span className="text-xs text-secondary-500 flex items-center gap-1">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
      {completed}/{total}
    </span>
  )
}
