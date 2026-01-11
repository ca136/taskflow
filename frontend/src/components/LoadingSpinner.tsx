import React from 'react'

export interface LoadingSpinnerProps {
  /**
   * Size of the spinner - 'sm' (24px), 'md' (40px), or 'lg' (56px)
   * @default 'md'
   */
  size?: 'sm' | 'md' | 'lg'
  
  /**
   * Label text displayed below the spinner
   */
  label?: string
  
  /**
   * Additional CSS classes
   */
  className?: string
  
  /**
   * Color of the spinner - 'primary', 'secondary', or 'white'
   * @default 'primary'
   */
  color?: 'primary' | 'secondary' | 'white'
  
  /**
   * Whether to center the spinner in its container
   * @default false
   */
  centered?: boolean
}

/**
 * LoadingSpinner component displays a rotating loader animation.
 * Useful for indicating loading states in async operations.
 */
const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label,
  className = '',
  color = 'primary',
  centered = false,
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
  }

  const colorClasses = {
    primary: 'border-primary-500',
    secondary: 'border-secondary-500',
    white: 'border-white',
  }

  const spinnerClasses = `
    ${sizeClasses[size]}
    ${colorClasses[color]}
    border-4 border-t-4 border-opacity-20
    rounded-full animate-spin
    ${color === 'primary' && 'border-t-primary-500'}
    ${color === 'secondary' && 'border-t-secondary-500'}
    ${color === 'white' && 'border-t-white'}
  `

  const containerClasses = centered ? 'flex justify-center items-center' : ''

  return (
    <div className={`${containerClasses} ${className}`}>
      <div className="flex flex-col items-center gap-3">
        <div className={spinnerClasses} />
        {label && <p className="text-sm text-secondary-500">{label}</p>}
      </div>
    </div>
  )
}

export default LoadingSpinner
