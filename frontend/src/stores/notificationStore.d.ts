export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export interface Notification {
    id: string;
    message: string;
    type: NotificationType;
    duration?: number;
    action?: {
        label: string;
        onClick: () => void;
    };
}
interface NotificationStore {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id'>) => string;
    removeNotification: (id: string) => void;
    clearNotifications: () => void;
}
export declare const useNotificationStore: import("zustand").UseBoundStore<import("zustand").StoreApi<NotificationStore>>;
export declare const useToast: () => {
    success: (message: string, duration?: number) => string;
    error: (message: string, duration?: number) => string;
    warning: (message: string, duration?: number) => string;
    info: (message: string, duration?: number) => string;
};
export {};
