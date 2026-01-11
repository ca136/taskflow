import React from 'react'
import { AlertCircle, CheckCircle, AlertTriangle, Info, X } from 'lucide-react'
import { Notification } from '../../stores/notificationStore'

interface ToastProps {
  notification: Notification
  onClose: (id: string) => void
}

export const Toast: React.FC<ToastProps> = ({ notification, onClose }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getBgColor = () => {
    switch (notification.type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      case 'info':
        return 'bg-blue-50 border-blue-200'
    }
  }

  const getTextColor = () => {
    switch (notification.type) {
      case 'success':
        return 'text-green-800'
      case 'error':
        return 'text-red-800'
      case 'warning':
        return 'text-yellow-800'
      case 'info':
        return 'text-blue-800'
    }
  }

  return (
    <div
      className={`flex items-start gap-3 ${getBgColor()} border rounded-lg p-4 shadow-lg transition-all`}
      role="alert"
    >
      {getIcon()}
      <div className="flex-grow">
        <p className={`text-sm font-medium ${getTextColor()}`}>{notification.message}</p>
        {notification.action && (
          <button
            onClick={notification.action.onClick}
            className={`text-xs font-medium mt-2 ${getTextColor()} hover:opacity-75 transition-opacity`}
          >
            {notification.action.label}
          </button>
        )}
      </div>
      <button
        onClick={() => onClose(notification.id)}
        className="flex-shrink-0 text-gray-400 hover:text-gray-600"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
