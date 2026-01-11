import React, { Component, ReactNode, ErrorInfo } from 'react'
import { AlertTriangle } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
  onError?: (error: Error, errorInfo: ErrorInfo) => void
}

interface State {
  hasError: boolean
  error: Error | null
  errorInfo: ErrorInfo | null
}

/**
 * Error boundary to catch unhandled errors in component tree
 * Displays a user-friendly error message instead of blank page
 */
export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo)
    }

    this.setState({ errorInfo })
    this.props.onError?.(error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback
      }

      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
          <div className="max-w-md w-full bg-white rounded-lg shadow-lg border border-red-200 p-6">
            <div className="flex items-start gap-4">
              <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-grow">
                <h1 className="text-lg font-bold text-red-900 mb-2">
                  Something went wrong
                </h1>
                <p className="text-red-700 text-sm mb-4">
                  An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.
                </p>

                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-4 text-xs">
                    <summary className="cursor-pointer text-red-600 hover:text-red-700 font-medium">
                      Error details (development only)
                    </summary>
                    <div className="mt-2 p-3 bg-red-50 rounded border border-red-200 font-mono text-red-800 overflow-auto max-h-48">
                      <div>{this.state.error.toString()}</div>
                      {this.state.errorInfo?.componentStack && (
                        <div className="mt-2 text-red-700">
                          {this.state.errorInfo.componentStack}
                        </div>
                      )}
                    </div>
                  </details>
                )}

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={this.handleReset}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md font-medium hover:bg-blue-700 transition-colors text-sm"
                  >
                    Try Again
                  </button>
                  <button
                    onClick={() => window.location.href = '/'}
                    className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-md font-medium hover:bg-gray-300 transition-colors text-sm"
                  >
                    Go Home
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
