import React from 'react'

export interface ErrorMessageProps {
  /**
   * Error message or error object to display
   */
  message: string | Error
  
  /**
   * Type of error - 'error', 'warning', or 'info'
   * @default 'error'
   */
  type?: 'error' | 'warning' | 'info'
  
  /**
   * Optional title displayed above the message
   */
  title?: string
  
  /**
   * Callback function when dismiss button is clicked
   */
  onDismiss?: () => void
  
  /**
   * Whether to show a dismiss button
   * @default false
   */
  dismissible?: boolean
  
  /**
   * Additional CSS classes
   */
  className?: string
  
  /**
   * Optional action button configuration
   */
  action?: {
    label: string
    onClick: () => void
  }
}

/**
 * ErrorMessage component displays error, warning, or info messages.
 * Can be dismissed or trigger an action.
 */
const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  type = 'error',
  title,
  onDismiss,
  dismissible = false,
  className = '',
  action,
}) => {
  const messageText = message instanceof Error ? message.message : message

  const typeConfig = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      text: 'text-red-800',
      icon: '⚠️',
      button: 'hover:bg-red-100',
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      text: 'text-yellow-800',
      icon: '⚡',
      button: 'hover:bg-yellow-100',
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      text: 'text-blue-800',
      icon: 'ℹ️',
      button: 'hover:bg-blue-100',
    },
  }

  const config = typeConfig[type]

  return (
    <div
      className={`
        ${config.bg} ${config.border} ${config.text}
        border rounded-lg px-4 py-3
        ${className}
      `}
      role="alert"
    >
      <div className="flex items-start gap-3">
        {/* Icon */}
        <span className="flex-shrink-0 text-lg">{config.icon}</span>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {title && (
            <h3 className="font-semibold text-sm mb-1">{title}</h3>
          )}
          <p className="text-sm break-words">{messageText}</p>
        </div>

        {/* Action Buttons */}
        <div className="flex-shrink-0 flex gap-2 ml-2">
          {action && (
            <button
              onClick={action.onClick}
              className={`
                px-3 py-1 rounded text-sm font-medium
                transition-colors duration-150
                ${config.button}
              `}
            >
              {action.label}
            </button>
          )}
          {dismissible && (
            <button
              onClick={onDismiss}
              className={`
                px-2 py-1 rounded text-lg font-medium
                transition-colors duration-150
                ${config.button}
              `}
              aria-label="Dismiss"
            >
              ×
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default ErrorMessage
