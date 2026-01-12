import React from 'react';
interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title: string;
    children: React.ReactNode;
    size?: 'sm' | 'md' | 'lg';
    closeButton?: boolean;
}
export declare const Modal: React.FC<ModalProps>;
export {};
