import React, { useState } from 'react'
import { useApiData } from '../../hooks/useApiData'
import { LoadingSpinner, ErrorMessage, EmptyState } from '../common'
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

  if (isLoading) {
    return <LoadingSpinner label="Loading tasks..." />
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <ErrorMessage
          title="Failed to Load Tasks"
          message={error.message}
          onRetry={handleRetry}
          onDismiss={() => {}}
        />
        {isRetrying && (
          <div className="mt-4">
            <RefreshCw className="h-4 w-4 animate-spin text-primary-600" />
          </div>
        )}
      </div>
    )
  }

  if (!tasks || tasks.length === 0) {
    return (
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
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6" role="main">
      {Object.entries(columns).map(([status, columnTasks]) => (
        <div
          key={status}
          className="bg-gray-100 rounded-lg p-4 min-h-96 flex flex-col"
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

          {/* Tasks */}
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
                  className="bg-white rounded-lg shadow p-3 hover:shadow-md transition-shadow cursor-pointer"
                  role="listitem"
                  data-testid={`task-item-${task.id}`}
                >
                  <p className="text-gray-900 text-sm font-medium line-clamp-2">{task.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
