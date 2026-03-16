import client from '@/api/client'
import type { Label } from '@/types'

export async function getLabels(projectId: string): Promise<Label[]> {
  const response = await client.get<Label[]>(`/projects/${projectId}/labels`)
  return response.data
}

export async function createLabel(
  projectId: string,
  data: { name: string; color: string }
): Promise<Label> {
  const response = await client.post<Label>(`/projects/${projectId}/labels`, data)
  return response.data
}

export async function updateLabel(
  projectId: string,
  labelId: string,
  data: { name?: string; color?: string }
): Promise<Label> {
  const response = await client.patch<Label>(`/projects/${projectId}/labels/${labelId}`, data)
  return response.data
}

export async function deleteLabel(projectId: string, labelId: string): Promise<void> {
  await client.delete(`/projects/${projectId}/labels/${labelId}`)
}
