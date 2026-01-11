import React from 'react';
import { Notification } from '../../stores/notificationStore';
interface ToastProps {
    notification: Notification;
    onClose: (id: string) => void;
}
export declare const Toast: React.FC<ToastProps>;
export {};
