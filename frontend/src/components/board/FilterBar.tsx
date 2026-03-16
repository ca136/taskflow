import { useQuery } from '@tanstack/react-query'
import { useFilterStore } from '@/stores/filters'
import { getLabels } from '@/services/labels'

interface Props {
  projectId: string
}

export default function FilterBar({ projectId }: Props) {
  const {
    searchText,
    priorities,
    labelIds,
    dueDateFilter,
    setSearchText,
    togglePriority,
    toggleLabel,
    setDueDateFilter,
    clearAll,
  } = useFilterStore()

  const { data: labels } = useQuery({
    queryKey: ['projects', projectId, 'labels'],
    queryFn: () => getLabels(projectId),
  })

  const hasFilters = searchText || priorities.length > 0 || labelIds.length > 0 || dueDateFilter

  return (
    <div className="mb-4 flex flex-wrap items-center gap-2">
      {/* Search */}
      <input
        type="text"
        value={searchText}
        onChange={(e) => setSearchText(e.target.value)}
        placeholder="Search tasks..."
        className="px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 w-48"
      />

      {/* Priority filter */}
      <div className="flex items-center gap-1">
        {['low', 'medium', 'high'].map((p) => (
          <button
            key={p}
            onClick={() => togglePriority(p)}
            className={`px-2 py-1 text-xs rounded-md border ${
              priorities.includes(p)
                ? 'bg-primary-100 border-primary-300 text-primary-700'
                : 'bg-white border-gray-300 text-gray-600 hover:bg-gray-50'
            }`}
          >
            {p}
          </button>
        ))}
      </div>

      {/* Due date filter */}
      <select
        value={dueDateFilter}
        onChange={(e) => setDueDateFilter(e.target.value)}
        className="px-2 py-1.5 text-xs border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
      >
        <option value="">All dates</option>
        <option value="overdue">Overdue</option>
        <option value="due_this_week">Due this week</option>
        <option value="no_date">No date</option>
      </select>

      {/* Label filter */}
      {labels && labels.length > 0 && (
        <div className="flex items-center gap-1">
          {labels.map((label) => (
            <button
              key={label.id}
              onClick={() => toggleLabel(label.id)}
              className={`px-2 py-1 text-xs rounded-md border ${
                labelIds.includes(label.id)
                  ? 'ring-2 ring-offset-1 ring-gray-900'
                  : 'hover:opacity-80'
              }`}
              style={{
                backgroundColor: label.color,
                color: '#fff',
                borderColor: label.color,
              }}
              title={label.name}
            >
              {label.name}
            </button>
          ))}
        </div>
      )}

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={clearAll}
          className="px-2 py-1 text-xs text-secondary-500 hover:text-gray-900"
        >
          Clear filters
        </button>
      )}
    </div>
  )
}
