import { useState, FormEvent } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getProjects, createProject, deleteProject } from '@/services/projects'
import type { Project } from '@/types'

export default function ProjectsPage() {
  const queryClient = useQueryClient()
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const { data: projects, isLoading, error } = useQuery({
    queryKey: ['projects'],
    queryFn: getProjects,
  })

  const createMutation = useMutation({
    mutationFn: createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
      setName('')
      setDescription('')
      setShowForm(false)
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] })
    },
  })

  const handleCreate = (e: FormEvent) => {
    e.preventDefault()
    createMutation.mutate({ name, description: description || undefined })
  }

  if (isLoading) {
    return <div className="text-secondary-500">Loading projects...</div>
  }

  if (error) {
    return <div className="text-red-600">Failed to load projects.</div>
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 text-sm font-medium"
        >
          {showForm ? 'Cancel' : 'New Project'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="mb-6 p-4 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="space-y-3">
            <div>
              <label htmlFor="projectName" className="block text-sm font-medium text-gray-700 mb-1">
                Name
              </label>
              <input
                id="projectName"
                type="text"
                required
                maxLength={200}
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Project name"
              />
            </div>
            <div>
              <label htmlFor="projectDesc" className="block text-sm font-medium text-gray-700 mb-1">
                Description (optional)
              </label>
              <textarea
                id="projectDesc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                placeholder="Brief description"
              />
            </div>
            {createMutation.error && (
              <p className="text-sm text-red-600">Failed to create project.</p>
            )}
            <button
              type="submit"
              disabled={createMutation.isPending}
              className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 disabled:opacity-50 text-sm font-medium"
            >
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      )}

      {projects && projects.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-secondary-500 text-lg">No projects yet.</p>
          <p className="text-secondary-500 text-sm mt-1">Create one to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects?.map((project: Project) => (
            <div
              key={project.id}
              className="p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <h3 className="font-semibold text-gray-900 truncate flex-1">
                  {project.name}
                </h3>
                <button
                  onClick={() => deleteMutation.mutate(project.id)}
                  className="ml-2 text-secondary-500 hover:text-red-600 text-sm shrink-0"
                  title="Delete project"
                >
                  Delete
                </button>
              </div>
              {project.description && (
                <p className="mt-1 text-sm text-secondary-500 line-clamp-2">
                  {project.description}
                </p>
              )}
              <p className="mt-3 text-xs text-secondary-500">
                Created {new Date(project.created_at).toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
