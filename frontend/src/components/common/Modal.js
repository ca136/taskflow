import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect } from 'react';
const sizeStyles = {
    sm: 'sm:max-w-sm',
    md: 'sm:max-w-md',
    lg: 'sm:max-w-lg',
};
export const Modal = ({ isOpen, onClose, title, children, size = 'md', closeButton = true, }) => {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);
    if (!isOpen)
        return null;
    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };
    const handleKeyDown = (e) => {
        if (e.key === 'Escape') {
            onClose();
        }
    };
    return (_jsx("div", { className: "fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50", onClick: handleBackdropClick, onKeyDown: handleKeyDown, role: "presentation", children: _jsxs("div", { className: `relative w-full mx-4 bg-white rounded-lg shadow-lg ${sizeStyles[size]}`, role: "dialog", "aria-modal": "true", "aria-labelledby": "modal-title", children: [_jsxs("div", { className: "flex items-center justify-between px-6 py-4 border-b border-gray-200", children: [_jsx("h2", { id: "modal-title", className: "text-xl font-semibold text-secondary-900", children: title }), closeButton && (_jsx("button", { onClick: onClose, className: "text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 rounded", "aria-label": "Close modal", children: _jsx("svg", { className: "w-6 h-6", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" }) }) }))] }), _jsx("div", { className: "px-6 py-4 max-h-[calc(100vh-200px)] overflow-y-auto", children: children })] }) }));
};
