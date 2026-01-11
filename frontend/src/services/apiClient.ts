import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios'

export interface ApiError {
  message: string
  status: number
  code?: string
  details?: Record<string, unknown>
}

export interface ApiResponse<T> {
  data: T
  status: number
  message?: string
}

class ApiClient {
  private client: AxiosInstance
  private errorCallbacks: ((error: ApiError) => void)[] = []

  constructor(baseURL: string = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1') {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      },
    })

    // Add request interceptor for auth
    this.client.interceptors.request.use((config: InternalAxiosRequestConfig) => {
      const token = localStorage.getItem('auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
      return config
    })

    // Add response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        const apiError = this.handleError(error)
        this.errorCallbacks.forEach((cb) => cb(apiError))
        return Promise.reject(apiError)
      }
    )
  }

  private handleError(error: AxiosError): ApiError {
    const apiError: ApiError = {
      message: 'An error occurred',
      status: error.response?.status || 500,
    }

    if (error.response?.status === 401) {
      apiError.message = 'Session expired. Please login again.'
      localStorage.removeItem('auth_token')
      window.location.href = '/login'
    } else if (error.response?.status === 403) {
      apiError.message = 'You do not have permission to perform this action.'
    } else if (error.response?.status === 404) {
      apiError.message = 'Resource not found.'
    } else if (error.response?.status === 422) {
      apiError.message = 'Validation error.'
      apiError.details = (error.response.data as any)?.detail
    } else if (error.response?.status === 500) {
      apiError.message = 'Server error. Please try again later.'
    } else if (error.code === 'ECONNABORTED') {
      apiError.message = 'Request timeout. Please check your connection.'
    } else if (error.message === 'Network Error') {
      apiError.message = 'Network error. Please check your internet connection.'
    } else if (error.response?.data) {
      apiError.message = (error.response.data as any)?.message || error.message
    } else {
      apiError.message = error.message || 'An unexpected error occurred'
    }

    return apiError
  }

  onError(callback: (error: ApiError) => void): () => void {
    this.errorCallbacks.push(callback)
    return () => {
      this.errorCallbacks = this.errorCallbacks.filter((cb) => cb !== callback)
    }
  }

  async get<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.get<T>(url, config)
    return {
      data: response.data,
      status: response.status,
    }
  }

  async post<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.post<T>(url, data, config)
    return {
      data: response.data,
      status: response.status,
    }
  }

  async put<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.put<T>(url, data, config)
    return {
      data: response.data,
      status: response.status,
    }
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.patch<T>(url, data, config)
    return {
      data: response.data,
      status: response.status,
    }
  }

  async delete<T>(url: string, config?: any): Promise<ApiResponse<T>> {
    const response = await this.client.delete<T>(url, config)
    return {
      data: response.data,
      status: response.status,
    }
  }
}

export const apiClient = new ApiClient()
