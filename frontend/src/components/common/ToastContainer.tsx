import React from 'react'
import { useNotificationStore } from '../../stores/notificationStore'
import { Toast } from './Toast'

export const ToastContainer: React.FC = () => {
  const notifications = useNotificationStore((state) => state.notifications)
  const removeNotification = useNotificationStore((state) => state.removeNotification)

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 max-w-sm">
      {notifications.map((notification) => (
        <Toast
          key={notification.id}
          notification={notification}
          onClose={removeNotification}
        />
      ))}
    </div>
  )
}
