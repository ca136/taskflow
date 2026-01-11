import React from 'react'

export type FilterStatus = 'all' | 'todo' | 'in-progress' | 'done'

export interface StatusFilterProps {
  /**
   * Currently selected filter status
   * @default 'all'
   */
  selectedFilter?: FilterStatus
  
  /**
   * Callback function triggered when a filter is selected
   * Receives the selected filter status
   */
  onFilterChange: (filter: FilterStatus) => void
  
  /**
   * Additional CSS classes
   */
  className?: string
}

/**
 * StatusFilter component displays filter buttons/tabs for task statuses.
 * Allows users to filter tasks by their status: All, Todo, In Progress, or Done.
 * Selected filter is highlighted with active state styling.
 */
const StatusFilter: React.FC<StatusFilterProps> = ({
  selectedFilter = 'all',
  onFilterChange,
  className = '',
}) => {
  const filters: Array<{ value: FilterStatus; label: string }> = [
    { value: 'all', label: 'All' },
    { value: 'todo', label: 'Todo' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ]

  return (
    <div className={`flex gap-2 flex-wrap ${className}`}>
      {filters.map((filter) => {
        const isActive = selectedFilter === filter.value
        
        return (
          <button
            key={filter.value}
            onClick={() => onFilterChange(filter.value)}
            className={`
              px-4 py-2 rounded-lg font-medium transition-all duration-200
              ${
                isActive
                  ? 'bg-primary-500 text-white shadow-md hover:bg-primary-600'
                  : 'bg-secondary-100 text-secondary-700 hover:bg-secondary-200'
              }
              focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
              active:scale-95
            `}
            aria-pressed={isActive}
            aria-label={`Filter tasks by ${filter.label}`}
          >
            {filter.label}
          </button>
        )
      })}
    </div>
  )
}

export default StatusFilter
