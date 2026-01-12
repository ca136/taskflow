import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const sizeStyles = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
};
const containerSize = {
    sm: 'min-h-[100px]',
    md: 'min-h-[200px]',
    lg: 'min-h-[300px]',
};
export const Loading = ({ size = 'md', fullScreen = false, label = 'Loading...', }) => {
    const spinnerClass = sizeStyles[size];
    const containerClass = fullScreen
        ? 'fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-50'
        : `flex items-center justify-center ${containerSize[size]}`;
    return (_jsx("div", { className: containerClass, children: _jsxs("div", { className: "flex flex-col items-center gap-3", children: [_jsxs("svg", { className: `animate-spin text-primary-600 ${spinnerClass}`, xmlns: "http://www.w3.org/2000/svg", fill: "none", viewBox: "0 0 24 24", children: [_jsx("circle", { className: "opacity-25", cx: "12", cy: "12", r: "10", stroke: "currentColor", strokeWidth: "4" }), _jsx("path", { className: "opacity-75", fill: "currentColor", d: "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" })] }), label && (_jsx("p", { className: "text-sm font-medium text-secondary-700", children: label }))] }) }));
};
export const Skeleton = ({ count = 1, height = '1rem', circle = false, className, ...props }) => {
    const heightClass = typeof height === 'number' ? `h-[${height}px]` : '';
    const heightStyle = typeof height === 'string' ? { height } : {};
    const skeletons = Array.from({ length: count });
    return (_jsx("div", { className: className, ...props, children: skeletons.map((_, index) => (_jsx("div", { className: `
            bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200
            bg-[length:200%_100%]
            animate-pulse
            mb-2
            ${circle ? 'rounded-full' : 'rounded-lg'}
            ${heightClass}
          `, style: {
                ...heightStyle,
                backgroundSize: '200% 100%',
            } }, index))) }));
};
export default Loading;
