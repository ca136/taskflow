import client from '@/api/client'
import type { Project } from '@/types'

export async function getProject(projectId: string): Promise<Project> {
  const response = await client.get<Project>(`/projects/${projectId}`)
  return response.data
}

export async function getProjects(): Promise<Project[]> {
  const response = await client.get<Project[]>('/projects')
  return response.data
}

export async function createProject(data: { name: string; description?: string }): Promise<Project> {
  const response = await client.post<Project>('/projects', data)
  return response.data
}

export async function deleteProject(projectId: string): Promise<void> {
  await client.delete(`/projects/${projectId}`)
}
