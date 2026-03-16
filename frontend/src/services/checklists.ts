import client from '@/api/client'
import type { Checklist, ChecklistItem } from '@/types'

export async function createChecklist(
  taskId: string,
  data: { title: string }
): Promise<Checklist> {
  const response = await client.post<Checklist>(`/tasks/${taskId}/checklists`, data)
  return response.data
}

export async function updateChecklist(
  taskId: string,
  checklistId: string,
  data: { title?: string; position?: number }
): Promise<Checklist> {
  const response = await client.patch<Checklist>(
    `/tasks/${taskId}/checklists/${checklistId}`,
    data
  )
  return response.data
}

export async function deleteChecklist(taskId: string, checklistId: string): Promise<void> {
  await client.delete(`/tasks/${taskId}/checklists/${checklistId}`)
}

export async function createChecklistItem(
  checklistId: string,
  data: { content: string }
): Promise<ChecklistItem> {
  const response = await client.post<ChecklistItem>(
    `/checklists/${checklistId}/items`,
    data
  )
  return response.data
}

export async function updateChecklistItem(
  checklistId: string,
  itemId: string,
  data: { content?: string; is_completed?: boolean; position?: number }
): Promise<ChecklistItem> {
  const response = await client.patch<ChecklistItem>(
    `/checklists/${checklistId}/items/${itemId}`,
    data
  )
  return response.data
}

export async function deleteChecklistItem(
  checklistId: string,
  itemId: string
): Promise<void> {
  await client.delete(`/checklists/${checklistId}/items/${itemId}`)
}
