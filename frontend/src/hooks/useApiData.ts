import { useState, useEffect, useCallback } from 'react'
import { apiClient, ApiError } from '../services/apiClient'
import { useToast } from '../stores/notificationStore'

export interface UseApiDataState<T> {
  data: T | null
  isLoading: boolean
  error: ApiError | null
  retry: () => Promise<void>
}

interface UseApiDataOptions {
  showError?: boolean
  showSuccess?: boolean
  successMessage?: string
  errorMessage?: string
}

export const useApiData = <T,>(
  url: string | null,
  options: UseApiDataOptions = {}
): UseApiDataState<T> => {
  const [data, setData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<ApiError | null>(null)
  const toast = useToast()

  const {
    showError = true,
    showSuccess = false,
    successMessage = 'Data loaded successfully',
    errorMessage,
  } = options

  const fetchData = useCallback(async () => {
    if (!url) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await apiClient.get<T>(url)
      setData(response.data)
      if (showSuccess) {
        toast.success(successMessage)
      }
    } catch (err) {
      const apiError = err as ApiError
      setError(apiError)
      if (showError) {
        toast.error(errorMessage || apiError.message)
      }
    } finally {
      setIsLoading(false)
    }
  }, [url, showError, showSuccess, successMessage, errorMessage, toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const retry = useCallback(async () => {
    await fetchData()
  }, [fetchData])

  return { data, isLoading, error, retry }
}
