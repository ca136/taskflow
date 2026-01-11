import React, { ReactNode } from 'react';
interface EmptyStateProps {
    icon?: ReactNode;
    title: string;
    description: string;
    action?: {
        label: string;
        onClick: () => void;
    };
}
export declare const EmptyState: React.FC<EmptyStateProps>;
export {};
