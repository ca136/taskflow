import client from '@/api/client'
import type { ActivityLog } from '@/types'

export async function getActivity(taskId: string): Promise<ActivityLog[]> {
  const response = await client.get<ActivityLog[]>(`/tasks/${taskId}/activity`)
  return response.data
}
