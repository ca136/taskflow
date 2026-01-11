import React, { useState } from 'react'
import { AlertCircle, X, ChevronDown, Zap } from 'lucide-react'
import { ApiError } from '../../services/apiClient'

interface ErrorDisplayProps {
  /**
   * Error object with message and optional details
   */
  error: ApiError | string
  /**
   * Display variant
   * - 'inline': Small inline error message
   * - 'card': Card-based error with actions
   * - 'banner': Full width banner
   */
  variant?: 'inline' | 'card' | 'banner'
  /**
   * Callback when retry is clicked
   */
  onRetry?: () => void
  /**
   * Callback when dismiss is clicked
   */
  onDismiss?: () => void
  /**
   * Custom title (default: 'Error')
   */
  title?: string
  /**
   * Show loading state during retry
   */
  isRetrying?: boolean
  /**
   * Whether to show full error details
   */
  showDetails?: boolean
}

/**
 * Inline error display - small and compact
 */
const InlineError: React.FC<{
  message: string
  onRetry?: () => void
  isRetrying?: boolean
}> = ({ message, onRetry, isRetrying }) => (
  <div className="inline-flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-200 rounded-md">
    <AlertCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
    <span className="text-sm text-red-700 flex-grow">{message}</span>
    {onRetry && (
      <button
        onClick={onRetry}
        disabled={isRetrying}
        className="text-xs font-medium text-red-700 hover:text-red-800 disabled:text-red-500 ml-2 px-2 py-1 bg-red-100 rounded hover:bg-red-200 disabled:bg-red-50 transition-colors"
      >
        {isRetrying ? 'Retrying...' : 'Retry'}
      </button>
    )}
  </div>
)

/**
 * Card error display - detailed with expandable details
 */
const CardError: React.FC<{
  message: string
  title?: string
  details?: string
  onRetry?: () => void
  onDismiss?: () => void
  isRetrying?: boolean
}> = ({ message, title = 'Error', details, onRetry, onDismiss, isRetrying }) => {
  const [showDetails, setShowDetails] = useState(false)

  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 shadow-sm">
      <div className="flex items-start gap-4">
        <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-grow">
          <h3 className="font-semibold text-red-900">{title}</h3>
          <p className="text-red-800 text-sm mt-1">{message}</p>

          {/* Expandable Details */}
          {details && (
            <div className="mt-3">
              <button
                onClick={() => setShowDetails(!showDetails)}
                className="inline-flex items-center gap-1 text-xs font-medium text-red-700 hover:text-red-800 transition-colors"
                aria-expanded={showDetails}
              >
                <ChevronDown
                  className={`h-3 w-3 transition-transform ${showDetails ? 'rotate-180' : ''}`}
                />
                {showDetails ? 'Hide details' : 'Show details'}
              </button>
              {showDetails && (
                <div className="mt-2 p-3 bg-red-100 border border-red-300 rounded text-xs text-red-800 font-mono break-words max-h-40 overflow-auto">
                  {details}
                </div>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 mt-4">
            {onRetry && (
              <button
                onClick={onRetry}
                disabled={isRetrying}
                className="px-3 py-2 bg-red-600 text-white text-sm font-medium rounded hover:bg-red-700 disabled:bg-red-500 disabled:cursor-not-allowed transition-colors"
              >
                {isRetrying ? 'Retrying...' : 'Try Again'}
              </button>
            )}
            {onDismiss && (
              <button
                onClick={onDismiss}
                disabled={isRetrying}
                className="px-3 py-2 bg-gray-200 text-gray-800 text-sm font-medium rounded hover:bg-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors"
              >
                Dismiss
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/**
 * Banner error display - full width attention grabber
 */
const BannerError: React.FC<{
  message: string
  onDismiss?: () => void
  onRetry?: () => void
  isRetrying?: boolean
}> = ({ message, onDismiss, onRetry, isRetrying }) => (
  <div className="fixed top-0 left-0 right-0 bg-red-600 text-white px-4 py-3 shadow-lg z-40">
    <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <Zap className="h-5 w-5 flex-shrink-0" />
        <p className="text-sm font-medium">{message}</p>
      </div>
      <div className="flex items-center gap-2">
        {onRetry && (
          <button
            onClick={onRetry}
            disabled={isRetrying}
            className="px-3 py-1 bg-white text-red-600 text-sm font-medium rounded hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isRetrying ? 'Retrying...' : 'Retry'}
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            disabled={isRetrying}
            className="text-white hover:text-red-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Close error banner"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  </div>
)

/**
 * Main error display component - shows errors with retry and dismiss options
 */
export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  variant = 'card',
  onRetry,
  onDismiss,
  title,
  isRetrying = false,
  showDetails = false,
}) => {
  const message = typeof error === 'string' ? error : error.message
  const details = typeof error === 'string' ? undefined : (error as any).details?.toString?.()

  if (variant === 'inline') {
    return <InlineError message={message} onRetry={onRetry} isRetrying={isRetrying} />
  }

  if (variant === 'banner') {
    return (
      <BannerError
        message={message}
        onDismiss={onDismiss}
        onRetry={onRetry}
        isRetrying={isRetrying}
      />
    )
  }

  // Card variant (default)
  return (
    <CardError
      message={message}
      title={title}
      details={details || (showDetails ? JSON.stringify(error, null, 2) : undefined)}
      onRetry={onRetry}
      onDismiss={onDismiss}
      isRetrying={isRetrying}
    />
  )
}
