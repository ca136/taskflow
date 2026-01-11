import React from 'react'
import { useApiData } from '../../hooks/useApiData'
import { LoadingSpinner, ErrorMessage, EmptyState } from '../common'

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
  const { data: tasks, isLoading, error, retry } = useApiData<Task[]>(
    `/api/projects/${projectId}/tasks`,
    {
      showError: true,
      errorMessage: 'Failed to load tasks',
    }
  )

  if (isLoading) {
    return <LoadingSpinner label="Loading tasks..." />
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to Load Tasks"
        message={error.message}
        onRetry={retry}
        onDismiss={() => {}}
      />
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

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {Object.entries(columns).map(([status, columnTasks]) => (
        <div key={status} className="bg-gray-100 rounded-lg p-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 capitalize">
            {status.replace('_', ' ')}
          </h2>
          <div className="space-y-3">
            {columnTasks.map((task) => (
              <div
                key={task.id}
                className="bg-white rounded-lg shadow p-3 hover:shadow-md transition-shadow"
              >
                <p className="text-gray-900">{task.title}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
