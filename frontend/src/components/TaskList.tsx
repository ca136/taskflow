import React, { useMemo } from 'react'
import TaskCard from './TaskCard'
import { Task, TaskStatusType } from '../types/task'

export type FilterStatus = 'all' | 'todo' | 'in-progress' | 'done'

export interface TaskListProps {
  /**
   * Array of tasks to display in the list
   */
  tasks: Task[]

  /**
   * Current filter status to apply to the task list
   * @default 'all'
   */
  filterStatus?: FilterStatus

  /**
   * Callback when a task's status is changed
   */
  onStatusChange?: (taskId: string, newStatus: TaskStatusType) => void

  /**
   * Callback when a task is edited
   */
  onEdit?: (task: Task) => void

  /**
   * Callback when a task is deleted
   */
  onDelete?: (taskId: string) => void

  /**
   * Display mode: grouped by status or as a single list
   * @default 'grouped'
   */
  displayMode?: 'grouped' | 'list'

  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * TaskList component displays a list of tasks with filtering and organization options.
 * Can display tasks in a single list view or organized by status columns.
 * Includes empty state messaging when no tasks match the current filter.
 */
const TaskList: React.FC<TaskListProps> = ({
  tasks,
  filterStatus = 'all',
  onStatusChange,
  onEdit,
  onDelete,
  displayMode = 'grouped',
  className = '',
}) => {
  // Filter tasks based on the selected filter status
  const filteredTasks = useMemo(() => {
    if (filterStatus === 'all') {
      return tasks
    }
    return tasks.filter((task) => task.status === filterStatus)
  }, [tasks, filterStatus])

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatusType, Task[]> = {
      'todo': [],
      'in-progress': [],
      'done': [],
    }

    tasks.forEach((task) => {
      const status = task.status as TaskStatusType
      if (grouped[status]) {
        grouped[status].push(task)
      }
    })

    return grouped
  }, [tasks])

  // Empty state message based on filter
  const emptyMessage = useMemo(() => {
    if (tasks.length === 0) {
      return 'No tasks yet. Create one to get started!'
    }

    switch (filterStatus) {
      case 'todo':
        return 'No tasks to do. Great job!'
      case 'in-progress':
        return 'No tasks in progress.'
      case 'done':
        return 'No completed tasks yet.'
      default:
        return 'No tasks match the current filter.'
    }
  }, [tasks.length, filterStatus])

  // Status labels for display
  const statusLabels: Record<TaskStatusType, string> = {
    'todo': 'To Do',
    'in-progress': 'In Progress',
    'done': 'Done',
  }

  // Status colors for visual separation
  const statusColors: Record<TaskStatusType, string> = {
    'todo': 'border-l-4 border-l-yellow-500',
    'in-progress': 'border-l-4 border-l-blue-500',
    'done': 'border-l-4 border-l-green-500',
  }

  // Render empty state
  if (filteredTasks.length === 0) {
    return (
      <div
        className={`
          flex items-center justify-center p-8 rounded-lg
          bg-secondary-50 border-2 border-dashed border-secondary-200
          text-center
          ${className}
        `}
        role="status"
        aria-live="polite"
      >
        <div>
          <p className="text-secondary-600 text-lg font-medium">{emptyMessage}</p>
          {filterStatus !== 'all' && (
            <p className="text-secondary-500 text-sm mt-2">
              Try adjusting your filter to see more tasks.
            </p>
          )}
        </div>
      </div>
    )
  }

  // Grouped by status display mode
  if (displayMode === 'grouped' && filterStatus === 'all') {
    return (
      <div className={`space-y-6 ${className}`}>
        {Object.entries(tasksByStatus).map(([status, statusTasks]) => {
          const statusKey = status as TaskStatusType
          const hasTasksInStatus = statusTasks.length > 0

          return (
            <div key={status} className="space-y-3">
              {/* Status header with count */}
              <div className="flex items-center gap-3">
                <h3 className="text-lg font-semibold text-secondary-900">
                  {statusLabels[statusKey]}
                </h3>
                <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-primary-100 text-primary-700 text-sm font-medium">
                  {statusTasks.length}
                </span>
              </div>

              {/* Status section container */}
              <div className="space-y-2 pl-4 border-l-4 border-l-secondary-200">
                {hasTasksInStatus ? (
                  statusTasks.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={onEdit}
                      onDelete={onDelete}
                      onStatusChange={onStatusChange}
                    />
                  ))
                ) : (
                  <p className="text-secondary-500 italic py-2">
                    No tasks in this status
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // Single list display mode or filtered view
  return (
    <div className={`space-y-2 ${className}`}>
      {filteredTasks.map((task) => (
        <div
          key={task.id}
          className={`${statusColors[task.status as TaskStatusType]}`}
        >
          <TaskCard
            task={task}
            onEdit={onEdit}
            onDelete={onDelete}
            onStatusChange={onStatusChange}
          />
        </div>
      ))}
    </div>
  )
}

export default TaskList
