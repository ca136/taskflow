import React, { useState } from 'react'
import { useApiData } from '../../hooks/useApiData'
import { LoadingState, ErrorDisplay, EmptyState } from '../common'
import { useToast } from '../../stores/notificationStore'

interface Project {
  id: string
  name: string
  description?: string
}

export const ProjectList: React.FC = () => {
  const [isRetrying, setIsRetrying] = useState(false)
  const { data: projects, isLoading, error, retry } = useApiData<Project[]>('/api/projects')
  const toast = useToast()

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
        <LoadingState type="skeleton" label="Loading projects..." count={6} />
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
          title="Failed to Load Projects"
          onRetry={handleRetry}
          isRetrying={isRetrying}
        />
      </div>
    )
  }

  // Show empty state if no projects
  if (!projects || projects.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-96 p-4">
        <EmptyState
          title="No Projects Yet"
          description="Create your first project to get started with TaskFlow"
          action={{
            label: 'Create Project',
            onClick: () => {
              toast.info('Project creation feature coming soon')
            },
          }}
        />
      </div>
    )
  }

  return (
    <div className="p-4 md:p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Projects</h1>
        <p className="text-gray-600 text-sm mt-1">
          You have {projects.length} project{projects.length !== 1 ? 's' : ''}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <div
            key={project.id}
            className="bg-white rounded-lg shadow p-4 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 hover:border-blue-300"
            role="article"
            aria-label={`Project: ${project.name}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-grow">
                <h3 className="text-lg font-semibold text-gray-900">{project.name}</h3>
                {project.description && (
                  <p className="text-gray-600 text-sm mt-2 line-clamp-3">{project.description}</p>
                )}
              </div>
            </div>

            {/* Project Card Footer */}
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
              <button
                className="flex-1 px-3 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded transition-colors"
                aria-label={`Open project ${project.name}`}
              >
                Open
              </button>
              <button
                className="flex-1 px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded transition-colors"
                aria-label={`View details for project ${project.name}`}
              >
                Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
