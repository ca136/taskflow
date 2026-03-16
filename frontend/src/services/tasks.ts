import client from '@/api/client'
import type { Task } from '@/types'

export async function getTasks(boardId: string, includeArchived = false): Promise<Task[]> {
  const params = includeArchived ? { include_archived: true } : {}
  const response = await client.get<Task[]>(`/boards/${boardId}/tasks`, { params })
  return response.data
}

export async function createTask(
  boardId: string,
  data: { title: string; description?: string; priority?: string; status?: string; position?: number }
): Promise<Task> {
  const response = await client.post<Task>(`/boards/${boardId}/tasks`, data)
  return response.data
}

export async function updateTask(
  boardId: string,
  taskId: string,
  data: {
    title?: string
    description?: string | null
    priority?: string
    status?: string
    assignee_id?: string | null
    position?: number
    board_id?: string
    due_date?: string | null
    cover_color?: string | null
    is_archived?: boolean
    label_ids?: string[]
  }
): Promise<Task> {
  const response = await client.patch<Task>(`/boards/${boardId}/tasks/${taskId}`, data)
  return response.data
}

export async function deleteTask(boardId: string, taskId: string): Promise<void> {
  await client.delete(`/boards/${boardId}/tasks/${taskId}`)
}

export async function reorderTasks(
  boardId: string,
  items: { id: string; position: number }[]
): Promise<void> {
  await client.post(`/boards/${boardId}/tasks/reorder`, items)
}
