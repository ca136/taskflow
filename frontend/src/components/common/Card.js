import { jsx as _jsx } from "react/jsx-runtime";
import React from 'react';
const paddingStyles = {
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
};
const shadowStyles = {
    none: '',
    sm: 'shadow-sm',
    md: 'shadow-md',
    lg: 'shadow-lg',
};
export const Card = React.forwardRef(({ children, padding = 'md', shadow = 'md', hover = false, className, ...props }, ref) => {
    const hoverClass = hover ? 'hover:shadow-lg transition-shadow duration-200 cursor-pointer' : '';
    const paddingClass = paddingStyles[padding];
    const shadowClass = shadowStyles[shadow];
    return (_jsx("div", { ref: ref, className: `
          bg-white rounded-lg border border-gray-200
          ${paddingClass}
          ${shadowClass}
          ${hoverClass}
          ${className || ''}
        `, ...props, children: children }));
});
Card.displayName = 'Card';
export const CardHeader = React.forwardRef(({ children, className, ...props }, ref) => (_jsx("div", { ref: ref, className: `pb-4 border-b border-gray-200 mb-4 ${className || ''}`, ...props, children: children })));
CardHeader.displayName = 'CardHeader';
export const CardBody = React.forwardRef(({ children, className, ...props }, ref) => (_jsx("div", { ref: ref, className: `${className || ''}`, ...props, children: children })));
CardBody.displayName = 'CardBody';
export const CardFooter = React.forwardRef(({ children, className, ...props }, ref) => (_jsx("div", { ref: ref, className: `pt-4 border-t border-gray-200 mt-4 ${className || ''}`, ...props, children: children })));
CardFooter.displayName = 'CardFooter';
