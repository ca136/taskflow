import React from 'react'
import { Loader, Zap } from 'lucide-react'

interface LoadingStateProps {
  /**
   * Type of loading state to display
   * - 'spinner': Simple spinning loader with message
   * - 'skeleton': Skeleton placeholder components
   * - 'mini': Small inline loading indicator
   * - 'fullPage': Full page loading overlay
   */
  type?: 'spinner' | 'skeleton' | 'mini' | 'fullPage'
  label?: string
  count?: number // For skeleton type, number of skeleton items
}

/**
 * Skeleton loader component for list items
 */
const SkeletonItem: React.FC = () => (
  <div className="space-y-3">
    <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
    <div className="h-3 bg-gray-100 rounded w-1/2 animate-pulse"></div>
  </div>
)

/**
 * Skeleton loader for grid/card layout
 */
const SkeletonCard: React.FC = () => (
  <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-4">
    <div className="h-5 bg-gray-200 rounded w-2/3 animate-pulse"></div>
    <div className="space-y-2">
      <div className="h-3 bg-gray-100 rounded w-full animate-pulse"></div>
      <div className="h-3 bg-gray-100 rounded w-4/5 animate-pulse"></div>
    </div>
    <div className="flex gap-2 pt-2">
      <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
      <div className="h-6 bg-gray-200 rounded w-16 animate-pulse"></div>
    </div>
  </div>
)

/**
 * Mini loading indicator for inline use
 */
const MiniLoader: React.FC<{ label?: string }> = ({ label }) => (
  <div className="inline-flex items-center gap-2">
    <Loader className="h-4 w-4 text-blue-600 animate-spin" />
    {label && <span className="text-sm text-gray-600">{label}</span>}
  </div>
)

export const LoadingState: React.FC<LoadingStateProps> = ({
  type = 'spinner',
  label = 'Loading...',
  count = 3,
}) => {
  if (type === 'mini') {
    return <MiniLoader label={label} />
  }

  if (type === 'skeleton') {
    return (
      <div className="space-y-4 p-4">
        {Array.from({ length: count }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    )
  }

  if (type === 'fullPage') {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12">
            <Loader className="w-full h-full text-blue-600 animate-spin" />
          </div>
          {label && <p className="text-gray-600 font-medium">{label}</p>}
        </div>
      </div>
    )
  }

  // Default spinner
  return (
    <div className="flex flex-col items-center justify-center py-12 gap-4" role="status" aria-live="polite">
      <div className="w-8 h-8">
        <Loader className="w-full h-full text-blue-600 animate-spin" />
      </div>
      {label && <p className="text-gray-600 text-sm font-medium">{label}</p>}
    </div>
  )
}
