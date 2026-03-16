import { useQuery } from '@tanstack/react-query'
import { getActivity } from '@/services/activity'

interface Props {
  taskId: string
}

const ACTION_LABELS: Record<string, string> = {
  status_changed: 'changed status',
  priority_changed: 'changed priority',
  title_changed: 'renamed task',
  task_moved: 'moved task',
  archived: 'archived task',
  unarchived: 'unarchived task',
  is_archived_changed: 'changed archive status',
}

export default function ActivitySection({ taskId }: Props) {
  const { data: activity, isLoading } = useQuery({
    queryKey: ['tasks', taskId, 'activity'],
    queryFn: () => getActivity(taskId),
  })

  return (
    <div className="space-y-3">
      <p className="text-sm font-medium text-gray-700">Activity</p>

      {isLoading ? (
        <p className="text-xs text-secondary-500">Loading activity...</p>
      ) : activity && activity.length > 0 ? (
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {activity.map((entry) => (
            <div key={entry.id} className="flex gap-2 text-xs">
              <div className="w-5 h-5 rounded-full bg-gray-200 text-gray-600 flex items-center justify-center text-[10px] font-medium shrink-0 mt-0.5">
                {entry.user_name?.[0]?.toUpperCase() || '?'}
              </div>
              <div>
                <span className="font-medium text-gray-900">
                  {entry.user_name || 'System'}
                </span>{' '}
                <span className="text-secondary-500">
                  {ACTION_LABELS[entry.action] || entry.action}
                </span>
                {entry.details && (
                  <span className="text-secondary-500 ml-1">({entry.details})</span>
                )}
                <div className="text-secondary-400 mt-0.5">
                  {new Date(entry.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-xs text-secondary-500">No activity yet.</p>
      )}
    </div>
  )
}
