import { useState, useCallback } from 'react'
import { ApiError } from '../services/apiClient'
import { useToast } from '../stores/notificationStore'

interface UseFormSubmitOptions {
  /**
   * Callback to execute on successful submission
   */
  onSuccess?: () => void
  /**
   * Success message to show in toast
   */
  successMessage?: string
  /**
   * Callback to execute on error
   */
  onError?: (error: ApiError) => void
  /**
   * Whether to automatically show error toast
   */
  showErrorToast?: boolean
}

/**
 * Hook for managing form submission state with loading, error, and success handling
 *
 * @example
 * ```tsx
 * const { isLoading, error, submit } = useFormSubmit({
 *   successMessage: 'Project created successfully!',
 * })
 *
 * const handleSubmit = async (data) => {
 *   await submit(async () => {
 *     await api.createProject(data)
 *   })
 * }
 *
 * return (
 *   <>
 *     {error && <ErrorDisplay error={error} />}
 *     <button onClick={handleSubmit} disabled={isLoading}>
 *       {isLoading ? 'Saving...' : 'Save'}
 *     </button>
 *   </>
 * )
 * ```
 */
export const useFormSubmit = (options: UseFormSubmitOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const toast = useToast()

  const submit = useCallback(
    async (fn: () => Promise<void>) => {
      try {
        setIsLoading(true)
        setError(null)

        await fn()

        // Show success message if provided
        if (options.successMessage) {
          toast.success(options.successMessage)
        }

        // Call onSuccess callback if provided
        options.onSuccess?.()
      } catch (err) {
        const apiError = err as ApiError
        setError(apiError)

        // Show error toast if enabled
        if (options.showErrorToast !== false) {
          toast.error(apiError.message)
        }

        // Call onError callback if provided
        options.onError?.(apiError)

        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [options, toast]
  )

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    /**
     * Whether a submission is in progress
     */
    isLoading,
    /**
     * Error from the last submission attempt
     */
    error,
    /**
     * Function to call when submitting the form
     */
    submit,
    /**
     * Function to clear the current error
     */
    clearError,
  }
}
