import { useState, useCallback } from 'react'
import { apiClient, ApiError } from '../services/apiClient'
import { useToast } from '../stores/notificationStore'

export interface UseApiActionState {
  isLoading: boolean
  error: ApiError | null
  isSuccess: boolean
}

interface UseApiActionOptions {
  onSuccess?: () => Promise<void> | void
  onError?: (error: ApiError) => void
  successMessage?: string
  errorMessage?: string
  showSuccess?: boolean
  showError?: boolean
}

export const useApiAction = (options: UseApiActionOptions = {}) => {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const toast = useToast()

  const {
    onSuccess,
    onError,
    successMessage = 'Operation successful',
    errorMessage,
    showSuccess = true,
    showError = true,
  } = options

  const execute = useCallback(
    async <T,>(
      apiCall: () => Promise<T>
    ): Promise<{ success: boolean; data?: T; error?: ApiError }> => {
      setIsLoading(true)
      setError(null)
      setIsSuccess(false)

      try {
        const result = await apiCall()

        setIsSuccess(true)
        if (showSuccess) {
          toast.success(successMessage)
        }

        if (onSuccess) {
          await onSuccess()
        }

        return { success: true, data: result }
      } catch (err) {
        const apiError = err as ApiError
        setError(apiError)

        if (showError) {
          toast.error(errorMessage || apiError.message)
        }

        if (onError) {
          onError(apiError)
        }

        return { success: false, error: apiError }
      } finally {
        setIsLoading(false)
      }
    },
    [onSuccess, onError, successMessage, errorMessage, showSuccess, showError, toast]
  )

  const reset = useCallback(() => {
    setIsLoading(false)
    setError(null)
    setIsSuccess(false)
  }, [])

  return { execute, isLoading, error, isSuccess, reset }
}
