import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React from 'react';
export const Select = React.forwardRef(({ label, error, helperText, fullWidth = true, options, onChange, disabled = false, className, value, ...props }, ref) => {
    const widthClass = fullWidth ? 'w-full' : '';
    const errorClass = error ? 'border-red-500 focus:ring-red-500' : 'border-gray-300 focus:ring-primary-500';
    const handleChange = (e) => {
        if (onChange) {
            const selectedValue = e.target.value;
            // Try to convert to number if possible
            const numValue = Number(selectedValue);
            onChange(isNaN(numValue) ? selectedValue : numValue);
        }
    };
    return (_jsxs("div", { className: widthClass, children: [label && (_jsxs("label", { htmlFor: props.id, className: "block text-sm font-medium text-secondary-700 mb-1.5", children: [label, props.required && _jsx("span", { className: "text-red-500 ml-1", children: "*" })] })), _jsxs("div", { className: "relative", children: [_jsxs("select", { ref: ref, disabled: disabled, value: value || '', onChange: handleChange, className: `
              flex w-full px-4 py-2 pr-10 border rounded-lg appearance-none
              text-secondary-900 bg-white
              focus:outline-none focus:ring-2 focus:ring-offset-0 focus:border-transparent
              ${errorClass}
              disabled:bg-gray-100 disabled:cursor-not-allowed disabled:text-gray-500
              transition-colors duration-200
              ${className || ''}
            `, ...props, children: [_jsx("option", { value: "", children: props.placeholder || 'Select an option' }), options.map((option) => (_jsx("option", { value: option.value, disabled: option.disabled, children: option.label }, `${option.value}`)))] }), _jsx("div", { className: "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400", children: _jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M19 14l-7 7m0 0l-7-7m7 7V3" }) }) })] }), error && (_jsxs("p", { className: "mt-1.5 text-sm text-red-600 flex items-center", children: [_jsx("svg", { className: "w-4 h-4 mr-1", fill: "currentColor", viewBox: "0 0 20 20", children: _jsx("path", { fillRule: "evenodd", d: "M18.101 12.93a1 1 0 00-1.414-1.414L10 14.586l-6.687-6.687a1 1 0 00-1.414 1.414l8 8a1 1 0 001.414 0l8-8z", clipRule: "evenodd" }) }), error] })), helperText && !error && (_jsx("p", { className: "mt-1.5 text-sm text-gray-500", children: helperText }))] }));
});
Select.displayName = 'Select';
