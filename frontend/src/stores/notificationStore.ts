import { create } from 'zustand'

export type NotificationType = 'success' | 'error' | 'warning' | 'info'

export interface Notification {
  id: string
  message: string
  type: NotificationType
  duration?: number
  action?: {
    label: string
    onClick: () => void
  }
}

interface NotificationStore {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, 'id'>) => string
  removeNotification: (id: string) => void
  clearNotifications: () => void
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) => {
    const id = `${Date.now()}-${Math.random()}`
    set((state) => ({
      notifications: [...state.notifications, { ...notification, id }],
    }))

    // Auto-remove after duration (default 5 seconds)
    const duration = notification.duration || 5000
    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }))
      }, duration)
    }

    return id
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    }))
  },
  clearNotifications: () => {
    set({ notifications: [] })
  },
}))

// Utility functions for common notification types
export const useToast = () => {
  const addNotification = useNotificationStore((state) => state.addNotification)

  return {
    success: (message: string, duration?: number) =>
      addNotification({ message, type: 'success', duration }),
    error: (message: string, duration?: number) =>
      addNotification({ message, type: 'error', duration: duration || 7000 }),
    warning: (message: string, duration?: number) =>
      addNotification({ message, type: 'warning', duration }),
    info: (message: string, duration?: number) =>
      addNotification({ message, type: 'info', duration }),
  }
}
