import React, { useState } from 'react'
import { AlertCircle, X, ChevronDown } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  title?: string
  onDismiss?: () => void
  onRetry?: () => void
  details?: string
  fullScreen?: boolean
  isRetrying?: boolean
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  title = 'Error',
  onDismiss,
  onRetry,
  details,
  fullScreen = false,
  isRetrying = false,
}) => {
  const [showDetails, setShowDetails] = useState(false)

  const content = (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0 pt-0.5">
        <AlertCircle className="h-6 w-6 text-red-500" aria-hidden="true" />
      </div>
      <div className="flex-grow">
        <h3 className="text-sm font-semibold text-red-800">{title}</h3>
        <p className="mt-1 text-sm text-red-700">{message}</p>

        {/* Expandable Details */}
        {details && (
          <div className="mt-3">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="inline-flex items-center gap-1 text-xs font-medium text-red-700 hover:text-red-800 transition-colors"
              aria-expanded={showDetails}
              aria-label="Toggle error details"
            >
              <ChevronDown
                className={`h-3 w-3 transition-transform ${showDetails ? 'rotate-180' : ''}`}
              />
              {showDetails ? 'Hide details' : 'Show details'}
            </button>
            {showDetails && (
              <div className="mt-2 text-xs text-red-700 bg-red-100 border border-red-200 p-3 rounded font-mono break-words">
                {details}
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex flex-wrap gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              disabled={isRetrying}
              className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50 disabled:bg-red-50 disabled:text-red-500 disabled:cursor-not-allowed transition-colors"
              aria-label="Retry failed operation"
            >
              {isRetrying ? 'Retrying...' : 'Retry'}
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              disabled={isRetrying}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              aria-label="Dismiss error"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          disabled={isRetrying}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600 disabled:text-gray-300 disabled:cursor-not-allowed transition-colors"
          aria-label="Close error message"
          title="Dismiss error"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4" role="alert">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6 shadow-lg">
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md bg-red-50 p-4 border border-red-200" role="alert">
      {content}
    </div>
  )
}
