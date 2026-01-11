import React from 'react'

interface EmptyStateProps {
  icon?: React.ReactNode
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
}

/**
 * EmptyState component displays when there are no tasks or items to show.
 * Provides a friendly message and optional action button to encourage user engagement.
 */
const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title = 'No tasks yet',
  description = 'Create your first task to get started',
  actionLabel = 'Create Task',
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="max-w-md text-center">
        {/* Icon */}
        {icon ? (
          <div className="mb-6 flex justify-center">
            {icon}
          </div>
        ) : (
          <div className="mb-6 flex justify-center">
            <svg
              className="w-24 h-24 text-gray-300"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
          </div>
        )}

        {/* Title */}
        <h2 className="mb-3 text-2xl font-bold text-gray-900">{title}</h2>

        {/* Description */}
        <p className="mb-8 text-base text-gray-600">{description}</p>

        {/* Action Button */}
        {onAction && (
          <button
            onClick={onAction}
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </div>
  )
}

export default EmptyState
