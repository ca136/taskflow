import client from '@/api/client'
import type { Board } from '@/types'

export async function getBoards(projectId: string): Promise<Board[]> {
  const response = await client.get<Board[]>(`/projects/${projectId}/boards`)
  return response.data
}

export async function createBoard(
  projectId: string,
  data: { name: string; position?: number }
): Promise<Board> {
  const response = await client.post<Board>(`/projects/${projectId}/boards`, data)
  return response.data
}

export async function updateBoard(
  projectId: string,
  boardId: string,
  data: { name?: string; position?: number }
): Promise<Board> {
  const response = await client.patch<Board>(
    `/projects/${projectId}/boards/${boardId}`,
    data
  )
  return response.data
}

export async function deleteBoard(projectId: string, boardId: string): Promise<void> {
  await client.delete(`/projects/${projectId}/boards/${boardId}`)
}
