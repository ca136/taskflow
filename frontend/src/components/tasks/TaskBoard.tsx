import React, { useState } from 'react'
import { useApiData } from '../../hooks/useApiData'
import { LoadingState, ErrorDisplay, EmptyState } from '../common'
import { RefreshCw } from 'lucide-react'

interface Task {
  id: string
  title: string
  status: 'todo' | 'in_progress' | 'done'
  projectId: string
}

interface TaskBoardProps {
  projectId: string
}

export const TaskBoard: React.FC<TaskBoardProps> = ({ projectId }) => {
  const [isRetrying, setIsRetrying] = useState(false)

  const { data: tasks, isLoading, error, retry } = useApiData<Task[]>(
    `/api/projects/${projectId}/tasks`,
    {
      showError: true,
      errorMessage: 'Failed to load tasks',
    }
  )

  const handleRetry = async () => {
    setIsRetrying(true)
    try {
      await retry()
    } finally {
      setIsRetrying(false)
    }
  }

  // Show skeleton loaders while loading
  if (isLoading) {
    return (
      <div className="p-4 md:p-6">
        <LoadingState type="skeleton" label="Loading tasks..." count={4} />
      </div>
    )
  }

  // Show error with retry option
  if (error) {
    return (
      <div className="p-4 md:p-6">
        <ErrorDisplay
          error={error}
          variant="card"
          title="Failed to Load Tasks"
          onRetry={handleRetry}
          isRetrying={isRetrying}
        />
      </div>
    )
  }

  // Show empty state if no tasks
  if (!tasks || tasks.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96 p-4">
        <EmptyState
          title="No Tasks Yet"
          description="Create a task to get started with this project"
          action={{
            label: 'Add Task',
            onClick: () => {
              console.log('Add task clicked')
            },
          }}
        />
      </div>
    )
  }

  const columns = {
    todo: tasks.filter((t) => t.status === 'todo'),
    in_progress: tasks.filter((t) => t.status === 'in_progress'),
    done: tasks.filter((t) => t.status === 'done'),
  }

  const columnLabels = {
    todo: 'To Do',
    in_progress: 'In Progress',
    done: 'Done',
  }

  return (
    <div className="p-4 md:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Tasks</h1>
          <p className="text-gray-600 text-sm mt-1">
            Total: {tasks.length} task{tasks.length !== 1 ? 's' : ''}
          </p>
        </div>
        <button
          onClick={handleRetry}
          disabled={isRetrying}
          className="flex items-center gap-2 px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          title="Refresh tasks"
          aria-label="Refresh tasks"
        >
          <RefreshCw className={`h-4 w-4 ${isRetrying ? 'animate-spin' : ''}`} />
          <span>{isRetrying ? 'Refreshing...' : 'Refresh'}</span>
        </button>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="main">
        {Object.entries(columns).map(([status, columnTasks]) => (
          <div
            key={status}
            className="bg-gray-100 rounded-lg p-4 min-h-96 flex flex-col border border-gray-200"
            data-testid={`task-column-${status}`}
          >
            {/* Column Header */}
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-300">
              <h2 className="text-lg font-semibold text-gray-900">
                {columnLabels[status as keyof typeof columnLabels]}
              </h2>
              <span className="inline-flex items-center justify-center h-6 w-6 rounded-full bg-gray-300 text-gray-700 text-xs font-bold">
                {columnTasks.length}
              </span>
            </div>

            {/* Tasks List */}
            {columnTasks.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-gray-500 text-sm text-center">
                  No tasks in {columnLabels[status as keyof typeof columnLabels].toLowerCase()}
                </p>
              </div>
            ) : (
              <div className="space-y-3 flex-1" role="list">
                {columnTasks.map((task) => (
                  <div
                    key={task.id}
                    className="bg-white rounded-lg shadow p-3 hover:shadow-md transition-shadow cursor-pointer border border-gray-100 hover:border-blue-200"
                    role="listitem"
                    data-testid={`task-item-${task.id}`}
                  >
                    <p className="text-gray-900 text-sm font-medium line-clamp-2">{task.title}</p>
                  </div>
                ))}
              </div>
            )}

            {/* Add Task Button */}
            <button
              className="mt-3 w-full px-3 py-2 text-sm font-medium text-gray-600 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:text-gray-700 transition-colors"
              aria-label={`Add task to ${columnLabels[status as keyof typeof columnLabels]}`}
            >
              + Add Task
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
