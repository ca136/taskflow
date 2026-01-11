import { useState, useEffect, useCallback, useRef } from 'react'
import { apiClient, ApiError } from '../services/apiClient'
import { useToast } from '../stores/notificationStore'

export interface UseApiDataState<T> {
  data: T | null
  isLoading: boolean
  error: ApiError | null
  retry: () => Promise<void>
  refetch: () => Promise<void>
}

interface UseApiDataOptions {
  /**
   * Show error toast on failure
   */
  showError?: boolean
  /**
   * Show success toast on success
   */
  showSuccess?: boolean
  /**
   * Custom success message
   */
  successMessage?: string
  /**
   * Custom error message
   */
  errorMessage?: string
  /**
   * Number of retry attempts for failed requests (default: 3)
   */
  retryAttempts?: number
  /**
   * Delay between retries in milliseconds (default: 1000)
   */
  retryDelay?: number
  /**
   * Use exponential backoff for retries (default: true)
   */
  useExponentialBackoff?: boolean
}

/**
 * Hook for fetching data from API endpoints with loading, error, and retry states
 *
 * @example
 * ```tsx
 * const { data: tasks, isLoading, error, retry } = useApiData<Task[]>('/api/tasks')
 *
 * if (isLoading) return <LoadingState />
 * if (error) return <ErrorDisplay error={error} onRetry={retry} />
 * if (!tasks) return <EmptyState />
 *
 * return <TaskList tasks={tasks} />
 * ```
 */
export const useApiData = <T,>(
  url: string | null,
  options: UseApiDataOptions = {}
): UseApiDataState<T> => {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const toast = useToast()
  const retryTimeoutRef = useRef<NodeJS.Timeout>()

  const {
    showError = true,
    showSuccess = false,
    successMessage = 'Data loaded successfully',
    errorMessage,
    retryAttempts = 3,
    retryDelay = 1000,
    useExponentialBackoff = true,
  } = options

  /**
   * Calculate delay for exponential backoff: delay * (2 ^ attemptNumber)
   */
  const getRetryDelay = (attempt: number) => {
    if (!useExponentialBackoff) return retryDelay
    return retryDelay * Math.pow(2, attempt)
  }

  /**
   * Check if error is retryable (network errors, 5xx, 429 status codes)
   */
  const isRetryableError = (err: ApiError): boolean => {
    // Network errors
    if (!err.status || err.message.includes('network')) {
      return true
    }

    // Server errors and rate limiting
    const retryableStatuses = [408, 429, 500, 502, 503, 504]
    return retryableStatuses.includes(err.status)
  }

  const fetchData = useCallback(
    async (isAutoRetry = false) => {
      if (!url) return

      if (!isAutoRetry) {
        setIsLoading(true)
        setError(null)
        setRetryCount(0)
      }

      try {
        const response = await apiClient.get<T>(url)
        setData(response.data)
        setRetryCount(0)

        if (showSuccess) {
          toast.success(successMessage)
        }
      } catch (err) {
        const apiError = err as ApiError

        // Check if we should retry
        if (
          isAutoRetry === false &&
          retryCount < retryAttempts &&
          isRetryableError(apiError)
        ) {
          // Schedule automatic retry
          const delay = getRetryDelay(retryCount)
          retryTimeoutRef.current = setTimeout(async () => {
            setRetryCount((prev) => prev + 1)
            await fetchData(true)
          }, delay)
          return
        }

        setError(apiError)
        if (showError) {
          toast.error(errorMessage || apiError.message)
        }
      } finally {
        if (!isAutoRetry) {
          setIsLoading(false)
        }
      }
    },
    [url, retryCount, retryAttempts, showError, showSuccess, successMessage, errorMessage, getRetryDelay, toast]
  )

  // Initial fetch on mount or when URL changes
  useEffect(() => {
    fetchData(false)

    // Cleanup retry timeout on unmount
    return () => {
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current)
      }
    }
  }, [url, fetchData])

  /**
   * Manual retry - resets retry count and tries again
   */
  const retry = useCallback(async () => {
    setRetryCount(0)
    await fetchData(false)
  }, [fetchData])

  /**
   * Refetch - manually trigger new fetch without resetting state
   */
  const refetch = useCallback(async () => {
    setError(null)
    await fetchData(false)
  }, [fetchData])

  return {
    data,
    isLoading,
    error,
    retry,
    refetch,
  }
}
