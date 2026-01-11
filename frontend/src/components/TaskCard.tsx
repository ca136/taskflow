import { Task, TaskStatus } from '../types/task'

interface TaskCardProps {
  task: Task
  onEdit?: (task: Task) => void
  onDelete?: (taskId: string) => void
  onStatusChange?: (taskId: string, newStatus: TaskStatus | 'todo' | 'in-progress' | 'done') => void
}

/**
 * TaskCard component for displaying a single task in the kanban board.
 * Shows task title, description, status badge, and action buttons.
 * Includes status-specific color coding and smooth hover effects.
 *
 * @example
 * ```tsx
 * const task = {
 *   id: '1',
 *   title: 'Build login page',
 *   description: 'Create user authentication UI',
 *   status: 'todo',
 *   createdAt: new Date(),
 *   updatedAt: new Date()
 * }
 *
 * <TaskCard
 *   task={task}
 *   onEdit={(task) => handleEdit(task)}
 *   onDelete={(id) => handleDelete(id)}
 *   onStatusChange={(id, status) => handleStatusChange(id, status)}
 * />
 * ```
 */
export default function TaskCard({
  task,
  onEdit,
  onDelete,
  onStatusChange,
}: TaskCardProps) {
  // Determine status badge class based on task status
  const getStatusBadgeClass = (status: string): string => {
    switch (status) {
      case 'todo':
      case TaskStatus.TODO:
        return 'task-status-todo'
      case 'in-progress':
      case TaskStatus.IN_PROGRESS:
        return 'task-status-in-progress'
      case 'done':
      case TaskStatus.DONE:
        return 'task-status-done'
      default:
        return 'task-status-todo'
    }
  }

  // Get next status for quick status change button
  const getNextStatus = (currentStatus: string): TaskStatus | 'todo' | 'in-progress' | 'done' => {
    switch (currentStatus) {
      case 'todo':
      case TaskStatus.TODO:
        return 'in-progress'
      case 'in-progress':
      case TaskStatus.IN_PROGRESS:
        return 'done'
      case 'done':
      case TaskStatus.DONE:
        return 'todo'
      default:
        return 'todo'
    }
  }

  // Get status display text
  const getStatusLabel = (status: string): string => {
    switch (status) {
      case 'todo':
      case TaskStatus.TODO:
        return 'To Do'
      case 'in-progress':
      case TaskStatus.IN_PROGRESS:
        return 'In Progress'
      case 'done':
      case TaskStatus.DONE:
        return 'Done'
      default:
        return 'To Do'
    }
  }

  const nextStatus = getNextStatus(task.status)
  const statusBadgeClass = getStatusBadgeClass(task.status)
  const statusLabel = getStatusLabel(task.status)

  return (
    <div
      className="card bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-all duration-200 cursor-default"
      role="article"
      aria-label={`Task: ${task.title}`}
    >
      {/* Card Header with Status Badge */}
      <div className="flex items-start justify-between gap-2 mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 line-clamp-2 break-words">
            {task.title}
          </h3>
        </div>
        <span className={`flex-shrink-0 whitespace-nowrap ${statusBadgeClass}`}>
          {statusLabel}
        </span>
      </div>

      {/* Card Body - Description */}
      {task.description && (
        <p className="text-sm text-gray-600 line-clamp-2 mb-4 break-words">
          {task.description}
        </p>
      )}

      {/* Card Footer - Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-gray-100">
        {/* Status Change Button */}
        <button
          onClick={() => onStatusChange?.(task.id, nextStatus)}
          className="text-xs font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 px-2 py-1 rounded transition-colors duration-150"
          aria-label={`Move task to ${getStatusLabel(nextStatus)}`}
          title={`Move to ${getStatusLabel(nextStatus)}`}
        >
          {/* Right Arrow Icon */}
          <svg
            className="w-4 h-4 inline-block mr-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
          <span className="hidden sm:inline">Move</span>
        </button>

        {/* Action Buttons Group */}
        <div className="flex items-center gap-1">
          {/* Edit Button */}
          {onEdit && (
            <button
              onClick={() => onEdit(task)}
              className="p-1.5 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded transition-colors duration-150"
              aria-label="Edit task"
              title="Edit task"
            >
              {/* Pencil Icon */}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </button>
          )}

          {/* Delete Button */}
          {onDelete && (
            <button
              onClick={() => onDelete(task.id)}
              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-150"
              aria-label="Delete task"
              title="Delete task"
            >
              {/* Trash Icon */}
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
