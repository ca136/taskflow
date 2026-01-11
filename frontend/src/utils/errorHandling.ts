/**
 * API Error Handling Utilities
 * Provides functions to parse API errors and format user-friendly error messages
 */

import axios, { AxiosError } from 'axios'
import { ApiErrorResponse, ValidationError } from '../types/api'

// ============================================================================
// Types
// ============================================================================

/**
 * Parsed error information for consistent handling
 */
export interface ParsedError {
  /** Primary error message for the user */
  message: string
  /** HTTP status code (if applicable) */
  statusCode?: number
  /** Field-specific errors for form validation */
  fieldErrors?: Record<string, string>
  /** Raw error data for debugging */
  rawError?: unknown
  /** Whether this is a validation error */
  isValidationError: boolean
  /** Whether this is a network/connectivity error */
  isNetworkError: boolean
  /** Whether this is a 404 Not Found error */
  isNotFound: boolean
  /** Whether this is a 401/403 authentication error */
  isAuthError: boolean
  /** Whether this is a server error (5xx) */
  isServerError: boolean
}

/**
 * Error message templates for common scenarios
 */
export const ERROR_MESSAGES = {
  // Network errors
  NETWORK_ERROR: 'Unable to connect to the server. Please check your internet connection.',
  TIMEOUT: 'Request timed out. Please try again.',
  OFFLINE: 'You are currently offline. Please check your connection.',

  // Validation errors
  VALIDATION_ERROR: 'Please check the form for errors.',
  FORM_ERROR: 'There were errors in your submission. Please correct them and try again.',

  // Authentication errors
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  FORBIDDEN: 'Access denied. You do not have permission.',
  AUTHENTICATION_REQUIRED: 'Please log in to continue.',

  // Not found
  NOT_FOUND: 'The requested resource was not found.',

  // Server errors
  SERVER_ERROR: 'An unexpected error occurred. Please try again later.',
  SERVICE_UNAVAILABLE: 'The service is temporarily unavailable. Please try again later.',

  // Generic error
  UNKNOWN_ERROR: 'An unexpected error occurred.',
} as const

// ============================================================================
// Error Type Guards
// ============================================================================

/**
 * Check if an error is an Axios error with a response
 */
function isAxiosErrorWithResponse(error: unknown): error is AxiosError<ApiErrorResponse> {
  return axios.isAxiosError(error) && error.response !== undefined
}

/**
 * Check if an error is an Axios error (any type)
 */
function isAxiosError(error: unknown): error is AxiosError {
  return axios.isAxiosError(error)
}

/**
 * Check if a value is an API error response
 */
function isApiErrorResponse(data: unknown): data is ApiErrorResponse {
  return (
    typeof data === 'object' &&
    data !== null &&
    ('detail' in data)
  )
}

/**
 * Check if detail is an array of validation errors
 */
function isValidationErrorArray(detail: unknown): detail is ValidationError[] {
  return (
    Array.isArray(detail) &&
    detail.length > 0 &&
    detail.every(
      (item) =>
        typeof item === 'object' &&
        item !== null &&
        'loc' in item &&
        'msg' in item &&
        'type' in item
    )
  )
}

// ============================================================================
// Error Parsing Functions
// ============================================================================

/**
 * Extract field errors from a validation error array
 * Maps field locations to error messages
 */
function extractFieldErrors(validationErrors: ValidationError[]): Record<string, string> {
  const fieldErrors: Record<string, string> = {}

  validationErrors.forEach((error) => {
    // loc is typically ['body', 'fieldname'] for request body fields
    // or ['query', 'fieldname'] for query parameters
    if (Array.isArray(error.loc) && error.loc.length > 0) {
      const fieldName = error.loc[error.loc.length - 1]?.toString() || 'form'
      // Use the first error for each field
      if (!fieldErrors[fieldName]) {
        fieldErrors[fieldName] = error.msg
      }
    }
  })

  return fieldErrors
}

/**
 * Extract the primary error message from API error response
 */
function extractDetailMessage(detail: string | ValidationError[] | unknown): string {
  if (typeof detail === 'string') {
    return detail
  }

  if (isValidationErrorArray(detail)) {
    return ERROR_MESSAGES.VALIDATION_ERROR
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR
}

/**
 * Determine if an error is a validation error
 */
function isValidationErrorResponse(data: unknown): boolean {
  if (!isApiErrorResponse(data)) {
    return false
  }

  return isValidationErrorArray(data.detail)
}

/**
 * Determine error category based on status code
 */
function getErrorCategory(statusCode: number): {
  isNotFound: boolean
  isAuthError: boolean
  isServerError: boolean
} {
  return {
    isNotFound: statusCode === 404,
    isAuthError: statusCode === 401 || statusCode === 403,
    isServerError: statusCode >= 500,
  }
}

/**
 * Get user-friendly message based on status code
 */
function getMessageForStatusCode(statusCode: number, detail?: string): string {
  if (detail) {
    return detail
  }

  switch (statusCode) {
    case 400:
      return ERROR_MESSAGES.FORM_ERROR
    case 401:
      return ERROR_MESSAGES.AUTHENTICATION_REQUIRED
    case 403:
      return ERROR_MESSAGES.FORBIDDEN
    case 404:
      return ERROR_MESSAGES.NOT_FOUND
    case 408:
      return ERROR_MESSAGES.TIMEOUT
    case 503:
      return ERROR_MESSAGES.SERVICE_UNAVAILABLE
    case 500:
    case 502:
    case 504:
      return ERROR_MESSAGES.SERVER_ERROR
    default:
      return ERROR_MESSAGES.UNKNOWN_ERROR
  }
}

// ============================================================================
// Main Parsing Function
// ============================================================================

/**
 * Parse any error type into a standardized ParsedError object
 * Handles Axios errors, API error responses, and generic errors
 *
 * @param error - The error to parse (can be AxiosError, Error, or unknown)
 * @returns Normalized ParsedError object
 *
 * @example
 * ```typescript
 * try {
 *   await apiCall()
 * } catch (error) {
 *   const parsedError = parseApiError(error)
 *   console.log(parsedError.message)
 *   if (parsedError.fieldErrors) {
 *     updateForm(parsedError.fieldErrors)
 *   }
 * }
 * ```
 */
export function parseApiError(error: unknown): ParsedError {
  const rawError = error

  // Handle Axios errors with response
  if (isAxiosErrorWithResponse(error)) {
    const response = error.response
    const statusCode = response!.status
    const data = response!.data

    // Determine error categories
    const { isNotFound, isAuthError, isServerError } = getErrorCategory(statusCode)
    const isValidationError = isValidationErrorResponse(data)

    // Extract messages and field errors
    let message: string
    let fieldErrors: Record<string, string> | undefined

    if (isApiErrorResponse(data)) {
      message = extractDetailMessage(data.detail)

      if (isValidationErrorArray(data.detail)) {
        fieldErrors = extractFieldErrors(data.detail)
      }
    } else {
      message = getMessageForStatusCode(statusCode)
    }

    return {
      message,
      statusCode,
      fieldErrors,
      rawError,
      isValidationError,
      isNetworkError: false,
      isNotFound,
      isAuthError,
      isServerError,
    }
  }

  // Handle other Axios errors (network, timeout, etc.)
  if (isAxiosError(error)) {
    const isNetworkError = !error.response
    const isTimeoutError = error.code === 'ECONNABORTED'

    const message = isTimeoutError
      ? ERROR_MESSAGES.TIMEOUT
      : isNetworkError
        ? ERROR_MESSAGES.NETWORK_ERROR
        : error.message || ERROR_MESSAGES.UNKNOWN_ERROR

    return {
      message,
      rawError,
      isValidationError: false,
      isNetworkError,
      isNotFound: false,
      isAuthError: false,
      isServerError: false,
    }
  }

  // Handle standard Error objects
  if (error instanceof Error) {
    return {
      message: error.message || ERROR_MESSAGES.UNKNOWN_ERROR,
      rawError,
      isValidationError: false,
      isNetworkError: false,
      isNotFound: false,
      isAuthError: false,
      isServerError: false,
    }
  }

  // Handle unknown errors
  return {
    message: ERROR_MESSAGES.UNKNOWN_ERROR,
    rawError,
    isValidationError: false,
    isNetworkError: false,
    isNotFound: false,
    isAuthError: false,
    isServerError: false,
  }
}

// ============================================================================
// Formatting Functions
// ============================================================================

/**
 * Format error message for display to user
 * Optionally prepends a context prefix
 *
 * @param error - The parsed error or raw error to format
 * @param context - Optional context to prepend (e.g., "Failed to update project")
 * @returns User-friendly error message
 *
 * @example
 * ```typescript
 * const message = formatErrorMessage(error, 'Failed to create task')
 * // "Failed to create task: Field validation error"
 * ```
 */
export function formatErrorMessage(error: ParsedError | unknown, context?: string): string {
  const parsed = error instanceof Object && 'message' in error
    ? (error as ParsedError)
    : parseApiError(error)

  const message = parsed.message || ERROR_MESSAGES.UNKNOWN_ERROR

  if (context) {
    return `${context}: ${message}`
  }

  return message
}

/**
 * Format validation errors for display in forms
 * Returns field errors and optionally a summary message
 *
 * @param error - The parsed error containing validation errors
 * @param includeSummary - Whether to include a general error summary
 * @returns Object with fieldErrors and optional summary message
 *
 * @example
 * ```typescript
 * const { fieldErrors, summary } = formatValidationError(error)
 * // fieldErrors: { email: 'Invalid email format', password: '...' }
 * // summary: 'Please check the form for errors.'
 * ```
 */
export function formatValidationError(
  error: ParsedError,
  includeSummary = true
): {
  fieldErrors: Record<string, string>
  summary?: string
} {
  return {
    fieldErrors: error.fieldErrors || {},
    summary: includeSummary ? error.message : undefined,
  }
}

/**
 * Get a user-friendly error summary from an error
 * Useful for displaying in toast notifications or alerts
 *
 * @param error - The error to summarize
 * @param context - Optional context prefix
 * @param length - Maximum length of the summary (0 = unlimited)
 * @returns Summarized error message
 *
 * @example
 * ```typescript
 * showToast(getErrorSummary(error, 'Task update failed'))
 * ```
 */
export function getErrorSummary(error: unknown, context?: string, length = 0): string {
  const message = formatErrorMessage(error, context)

  if (length > 0 && message.length > length) {
    return message.substring(0, length - 3) + '...'
  }

  return message
}

/**
 * Check if error is a specific type
 * Provides convenient type checking for error handling
 *
 * @param error - The error to check
 * @param type - The type to check for: 'validation', 'network', 'notfound', 'auth', 'server'
 * @returns True if error matches the specified type
 *
 * @example
 * ```typescript
 * if (isErrorType(error, 'validation')) {
 *   // Handle validation error
 * }
 * ```
 */
export function isErrorType(
  error: ParsedError | unknown,
  type: 'validation' | 'network' | 'notfound' | 'auth' | 'server'
): boolean {
  const parsed = error instanceof Object && 'message' in error
    ? (error as ParsedError)
    : parseApiError(error)

  switch (type) {
    case 'validation':
      return parsed.isValidationError
    case 'network':
      return parsed.isNetworkError
    case 'notfound':
      return parsed.isNotFound
    case 'auth':
      return parsed.isAuthError
    case 'server':
      return parsed.isServerError
    default:
      return false
  }
}

// ============================================================================
// Error Handler with Retry Logic
// ============================================================================

/**
 * Async error handler with retry capability
 * Useful for handling API calls with exponential backoff
 *
 * @param fn - The async function to execute
 * @param options - Retry options
 * @returns Result or throws ParsedError
 *
 * @example
 * ```typescript
 * const data = await handleApiCallWithRetry(
 *   () => fetchProjects(),
 *   { maxRetries: 3, initialDelay: 1000 }
 * )
 * ```
 */
export async function handleApiCallWithRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number
    initialDelay?: number
    backoffMultiplier?: number
    shouldRetry?: (error: ParsedError) => boolean
  } = {}
): Promise<T> {
  const {
    maxRetries = 3,
    initialDelay = 1000,
    backoffMultiplier = 2,
    shouldRetry = (error) => error.isNetworkError || error.isServerError,
  } = options

  let lastError: ParsedError
  let delay = initialDelay

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      return await fn()
    } catch (error) {
      lastError = parseApiError(error)

      // Don't retry if we shouldn't or if it's the last attempt
      if (attempt === maxRetries || !shouldRetry(lastError)) {
        throw lastError
      }

      // Wait before retrying
      await new Promise((resolve) => setTimeout(resolve, delay))
      delay *= backoffMultiplier
    }
  }

  throw lastError!
}
