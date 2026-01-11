import { useState } from 'react'
import { Plus, RotateCcw } from 'lucide-react'
import { useApiData } from '../../hooks/useApiData'
import { LoadingSpinner, ErrorMessage, EmptyState } from '../common'

export interface Task {
  id: string
  title: string
  description?: string
  assignee?: string
  priority?: 'low' | 'medium' | 'high'
  status: 'todo' | 'inprogress' | 'done'
}

interface Column {
  id: string
  title: string
  tasks: Task[]
}

const getPriorityColor = (priority?: string) => {
  switch (priority) {
    case 'high':
      return 'bg-red-100 text-red-800'
    case 'medium':
      return 'bg-yellow-100 text-yellow-800'
    case 'low':
      return 'bg-green-100 text-green-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const statusToColumnId = (status: string) => {
  const map: Record<string, string> = {
    todo: 'todo',
    inprogress: 'inprogress',
    done: 'done',
  }
  return map[status] || status
}

const COLUMN_DEFINITIONS = [
  { id: 'todo', title: 'To Do' },
  { id: 'inprogress', title: 'In Progress' },
  { id: 'done', title: 'Done' },
]

export const KanbanBoard = () => {
  const { data: tasks, isLoading, error, retry } = useApiData<Task[]>('/api/tasks', {
    showError: true,
    errorMessage: 'Failed to load tasks. Please check your connection and try again.',
  })

  if (isLoading) {
    return <LoadingSpinner label="Loading your tasks..." />
  }

  if (error) {
    return (
      <div className="flex-1 bg-gray-50 p-4 md:p-6">
        <ErrorMessage
          title="Failed to Load Tasks"
          message={error.message}
          onRetry={retry}
          onDismiss={() => {}}
        />
      </div>
    )
  }

  // Group tasks by status
  const columns: Column[] = COLUMN_DEFINITIONS.map((colDef) => ({
    ...colDef,
    tasks: (tasks || []).filter((task) => statusToColumnId(task.status) === colDef.id),
  }))

  const totalTasks = tasks?.length || 0

  // Show empty state if no tasks
  if (totalTasks === 0) {
    return (
      <div className="flex-1 bg-gray-50 p-4 md:p-6 flex items-center justify-center">
        <EmptyState
          title="No Tasks Yet"
          description="Start by creating a task to organize your work"
          action={{
            label: 'Create Your First Task',
            onClick: () => {
              // This would typically open a modal or navigate to create task
              console.log('Create task clicked')
            },
          }}
        />
      </div>
    )
  }

  return (
    <div className="flex-1 overflow-x-auto bg-gray-50 p-4 md:p-6">
      {/* Header with task count and retry button */}
      <div className="mb-4 flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Total tasks: <span className="font-semibold text-gray-900">{totalTasks}</span>
        </div>
        <button
          onClick={retry}
          className="flex items-center gap-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors"
          title="Refresh tasks"
        >
          <RotateCcw className="h-4 w-4" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Grid layout that stacks on mobile and becomes horizontal on larger screens */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 min-w-max md:min-w-0">
        {columns.map((column) => (
          <div
            key={column.id}
            className="flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            data-testid={`column-${column.id}`}
          >
            {/* Column Header */}
            <div className="bg-gray-100 px-4 py-3 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-lg font-semibold text-gray-800">{column.title}</h2>
                <span className="bg-gray-300 text-gray-700 text-xs font-semibold px-2 py-1 rounded-full">
                  {column.tasks.length}
                </span>
              </div>
            </div>

            {/* Tasks List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-3" data-testid={`tasks-${column.id}`}>
              {column.tasks.length === 0 ? (
                <div className="h-32 flex items-center justify-center text-gray-400">
                  <p className="text-sm text-center">No tasks in this column yet</p>
                </div>
              ) : (
                column.tasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white border border-gray-200 rounded-md p-3 cursor-move hover:shadow-md transition-shadow"
                    data-testid={`task-${task.id}`}
                  >
                    <h3 className="font-medium text-gray-800 text-sm break-words">{task.title}</h3>
                    {task.description && (
                      <p className="text-gray-600 text-xs mt-1 break-words">{task.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      {task.priority && (
                        <span
                          className={`text-xs px-2 py-1 rounded ${getPriorityColor(task.priority)}`}
                        >
                          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                        </span>
                      )}
                      {task.assignee && (
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded truncate">
                          {task.assignee}
                        </span>
                      )}
                    </div>
                  </div>
                ))
              )}

              {/* Add Task Button */}
              <button
                className="w-full mt-2 py-2 px-3 rounded-md border-2 border-dashed border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700 flex items-center justify-center gap-1 text-sm transition-colors"
                data-testid={`add-task-${column.id}`}
              >
                <Plus size={16} />
                <span className="hidden sm:inline">Add Task</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile instructions */}
      <div className="md:hidden mt-4 text-center text-gray-600 text-sm">
        <p>Scroll horizontally to view all columns →</p>
      </div>
    </div>
  )
}
