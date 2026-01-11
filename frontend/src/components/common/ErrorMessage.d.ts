import React from 'react';
interface ErrorMessageProps {
    message: string;
    title?: string;
    onDismiss?: () => void;
    onRetry?: () => void;
    details?: string;
    fullScreen?: boolean;
}
export declare const ErrorMessage: React.FC<ErrorMessageProps>;
export {};
