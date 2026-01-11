import React from 'react'
import { useApiData } from '../../hooks/useApiData'
import { LoadingSpinner, ErrorMessage, EmptyState } from '../common'
import { useToast } from '../../stores/notificationStore'

interface Project {
  id: string
  name: string
  description?: string
}

export const ProjectList: React.FC = () => {
  const { data: projects, isLoading, error, retry } = useApiData<Project[]>('/api/projects')
  const toast = useToast()

  if (isLoading) {
    return <LoadingSpinner label="Loading projects..." />
  }

  if (error) {
    return (
      <ErrorMessage
        title="Failed to Load Projects"
        message={error.message}
        onRetry={retry}
        onDismiss={() => {}}
      />
    )
  }

  if (!projects || projects.length === 0) {
    return (
      <EmptyState
        title="No Projects Yet"
        description="Create your first project to get started with TaskFlow"
        action={{
          label: 'Create Project',
          onClick: () => toast.info('Create project feature coming soon'),
        }}
      />
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {projects.map((project) => (
        <div
          key={project.id}
          className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow cursor-pointer"
        >
          <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
          {project.description && (
            <p className="text-gray-600 text-sm mt-2">{project.description}</p>
          )}
        </div>
      ))}
    </div>
  )
}
