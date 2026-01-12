import React from 'react';
interface LoadingProps {
    size?: 'sm' | 'md' | 'lg';
    fullScreen?: boolean;
    label?: string;
}
export declare const Loading: React.FC<LoadingProps>;
/**
 * Skeleton loading component for content placeholders
 */
interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
    count?: number;
    height?: string | number;
    circle?: boolean;
}
export declare const Skeleton: React.FC<SkeletonProps>;
export default Loading;
