import client from '@/api/client'
import type { Comment } from '@/types'

export async function getComments(taskId: string): Promise<Comment[]> {
  const response = await client.get<Comment[]>(`/tasks/${taskId}/comments`)
  return response.data
}

export async function createComment(
  taskId: string,
  data: { content: string }
): Promise<Comment> {
  const response = await client.post<Comment>(`/tasks/${taskId}/comments`, data)
  return response.data
}

export async function updateComment(
  taskId: string,
  commentId: string,
  data: { content: string }
): Promise<Comment> {
  const response = await client.patch<Comment>(
    `/tasks/${taskId}/comments/${commentId}`,
    data
  )
  return response.data
}

export async function deleteComment(taskId: string, commentId: string): Promise<void> {
  await client.delete(`/tasks/${taskId}/comments/${commentId}`)
}
