import React from 'react'
import { AlertCircle, X } from 'lucide-react'

interface ErrorMessageProps {
  message: string
  title?: string
  onDismiss?: () => void
  onRetry?: () => void
  details?: string
  fullScreen?: boolean
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  title = 'Error',
  onDismiss,
  onRetry,
  details,
  fullScreen = false,
}) => {
  const content = (
    <div className="flex items-start gap-4">
      <div className="flex-shrink-0">
        <AlertCircle className="h-6 w-6 text-red-500" />
      </div>
      <div className="flex-grow">
        <h3 className="text-sm font-medium text-red-800">{title}</h3>
        <p className="mt-1 text-sm text-red-700">{message}</p>
        {details && <p className="mt-2 text-xs text-red-600 bg-red-50 p-2 rounded">{details}</p>}
        <div className="mt-4 flex gap-2">
          {onRetry && (
            <button
              onClick={onRetry}
              className="inline-flex items-center px-3 py-1.5 border border-red-300 rounded-md text-sm font-medium text-red-700 hover:bg-red-50 transition-colors"
            >
              Retry
            </button>
          )}
          {onDismiss && (
            <button
              onClick={onDismiss}
              className="inline-flex items-center px-3 py-1.5 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Dismiss
            </button>
          )}
        </div>
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-gray-400 hover:text-gray-500"
        >
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  )

  if (fullScreen) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
        <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6">
          {content}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-md bg-red-50 p-4 border border-red-200">
      {content}
    </div>
  )
}
