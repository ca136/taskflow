import React from 'react'
import { Loader } from 'lucide-react'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  fullScreen?: boolean
  overlay?: boolean
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  label = 'Loading...',
  fullScreen = false,
  overlay = false,
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  }

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4" role="status" aria-live="polite">
      <div className={sizeClasses[size]}>
        <Loader className="w-full h-full text-primary-600 animate-spin" />
      </div>
      {label && <p className="text-sm text-gray-600 font-medium">{label}</p>}
      {!label && <span className="sr-only">Loading...</span>}
    </div>
  )

  if (fullScreen) {
    return (
      <div
        className="fixed inset-0 bg-white flex items-center justify-center z-50"
        aria-label="Full page loading"
      >
        {spinner}
      </div>
    )
  }

  if (overlay) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-10 flex items-center justify-center z-50">
        {spinner}
      </div>
    )
  }

  return spinner
}
