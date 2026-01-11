/**
 * Form validation utilities
 * Provides helper functions for common form validation scenarios
 */

/**
 * Validation error result object
 */
export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

/**
 * Validates an email address
 * @param email - Email address to validate
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateEmail = (email: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  return { isValid: true };
};

/**
 * Validates password strength
 * Requirements:
 * - Minimum 8 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character (!@#$%^&*)
 * @param password - Password to validate
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validatePasswordStrength = (password: string): ValidationResult => {
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }

  if (password.length < 8) {
    return { isValid: false, error: 'Password must be at least 8 characters long' };
  }

  if (!/[A-Z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one uppercase letter' };
  }

  if (!/[a-z]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one lowercase letter' };
  }

  if (!/[0-9]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one number' };
  }

  if (!/[!@#$%^&*()_+\-=\[\]{};:'",.<>?/\\|`~]/.test(password)) {
    return { isValid: false, error: 'Password must contain at least one special character' };
  }

  return { isValid: true };
};

/**
 * Validates required field (not empty)
 * @param value - Field value to validate
 * @param fieldName - Name of the field for error message
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateRequired = (value: string | number | boolean, fieldName: string = 'Field'): ValidationResult => {
  if (value === null || value === undefined) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (typeof value === 'string' && value.trim() === '') {
    return { isValid: false, error: `${fieldName} is required` };
  }

  return { isValid: true };
};

/**
 * Validates minimum length for a string
 * @param value - String value to validate
 * @param minLength - Minimum required length
 * @param fieldName - Name of the field for error message
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateMinLength = (value: string, minLength: number, fieldName: string = 'Field'): ValidationResult => {
  if (!value) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (value.length < minLength) {
    return { isValid: false, error: `${fieldName} must be at least ${minLength} characters long` };
  }

  return { isValid: true };
};

/**
 * Validates maximum length for a string
 * @param value - String value to validate
 * @param maxLength - Maximum allowed length
 * @param fieldName - Name of the field for error message
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateMaxLength = (value: string, maxLength: number, fieldName: string = 'Field'): ValidationResult => {
  if (value && value.length > maxLength) {
    return { isValid: false, error: `${fieldName} must not exceed ${maxLength} characters` };
  }

  return { isValid: true };
};

/**
 * Validates that two fields match (useful for password confirmation)
 * @param value1 - First value
 * @param value2 - Second value
 * @param fieldName - Name of the field for error message
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateMatch = (value1: string, value2: string, fieldName: string = 'Fields'): ValidationResult => {
  if (value1 !== value2) {
    return { isValid: false, error: `${fieldName} do not match` };
  }

  return { isValid: true };
};

/**
 * Validates a URL format
 * @param url - URL to validate
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateURL = (url: string): ValidationResult => {
  if (!url) {
    return { isValid: false, error: 'URL is required' };
  }

  try {
    new URL(url);
    return { isValid: true };
  } catch {
    return { isValid: false, error: 'Please enter a valid URL' };
  }
};

/**
 * Validates a phone number (basic format: digits, spaces, hyphens, parentheses)
 * @param phoneNumber - Phone number to validate
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validatePhoneNumber = (phoneNumber: string): ValidationResult => {
  if (!phoneNumber) {
    return { isValid: false, error: 'Phone number is required' };
  }

  const phoneRegex = /^[\d\s\-().+]*$/;
  if (!phoneRegex.test(phoneNumber)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }

  const digitsOnly = phoneNumber.replace(/\D/g, '');
  if (digitsOnly.length < 10) {
    return { isValid: false, error: 'Phone number must contain at least 10 digits' };
  }

  return { isValid: true };
};

/**
 * Validates a number is within a specific range
 * @param value - Number to validate
 * @param min - Minimum value (inclusive)
 * @param max - Maximum value (inclusive)
 * @param fieldName - Name of the field for error message
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateNumberRange = (
  value: number,
  min: number,
  max: number,
  fieldName: string = 'Number'
): ValidationResult => {
  if (value < min || value > max) {
    return { isValid: false, error: `${fieldName} must be between ${min} and ${max}` };
  }

  return { isValid: true };
};

/**
 * Validates that a value matches a regex pattern
 * @param value - Value to validate
 * @param pattern - Regex pattern
 * @param errorMessage - Custom error message
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validatePattern = (value: string, pattern: RegExp, errorMessage: string = 'Invalid format'): ValidationResult => {
  if (!value) {
    return { isValid: false, error: 'Field is required' };
  }

  if (!pattern.test(value)) {
    return { isValid: false, error: errorMessage };
  }

  return { isValid: true };
};

/**
 * Validates an alphanumeric string (letters and numbers only)
 * @param value - Value to validate
 * @param fieldName - Name of the field for error message
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateAlphanumeric = (value: string, fieldName: string = 'Field'): ValidationResult => {
  if (!value) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (!/^[a-zA-Z0-9]+$/.test(value)) {
    return { isValid: false, error: `${fieldName} must contain only letters and numbers` };
  }

  return { isValid: true };
};

/**
 * Validates that a string contains only letters and spaces
 * @param value - Value to validate
 * @param fieldName - Name of the field for error message
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateAlphabetic = (value: string, fieldName: string = 'Field'): ValidationResult => {
  if (!value) {
    return { isValid: false, error: `${fieldName} is required` };
  }

  if (!/^[a-zA-Z\s]+$/.test(value)) {
    return { isValid: false, error: `${fieldName} must contain only letters and spaces` };
  }

  return { isValid: true };
};

/**
 * Validates a credit card number using Luhn algorithm
 * @param cardNumber - Credit card number to validate
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateCreditCard = (cardNumber: string): ValidationResult => {
  if (!cardNumber) {
    return { isValid: false, error: 'Credit card number is required' };
  }

  const sanitized = cardNumber.replace(/\s/g, '');

  if (!/^\d{13,19}$/.test(sanitized)) {
    return { isValid: false, error: 'Credit card number must be between 13 and 19 digits' };
  }

  // Luhn algorithm
  let sum = 0;
  let isEven = false;

  for (let i = sanitized.length - 1; i >= 0; i--) {
    let digit = parseInt(sanitized.charAt(i), 10);

    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }

    sum += digit;
    isEven = !isEven;
  }

  if (sum % 10 !== 0) {
    return { isValid: false, error: 'Invalid credit card number' };
  }

  return { isValid: true };
};

/**
 * Validates a username (3-20 characters, alphanumeric and underscore)
 * @param username - Username to validate
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateUsername = (username: string): ValidationResult => {
  if (!username) {
    return { isValid: false, error: 'Username is required' };
  }

  if (username.length < 3) {
    return { isValid: false, error: 'Username must be at least 3 characters long' };
  }

  if (username.length > 20) {
    return { isValid: false, error: 'Username must not exceed 20 characters' };
  }

  if (!/^[a-zA-Z0-9_]+$/.test(username)) {
    return { isValid: false, error: 'Username can only contain letters, numbers, and underscores' };
  }

  return { isValid: true };
};

/**
 * Validates an ISO date string (YYYY-MM-DD)
 * @param dateString - Date string to validate
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateDate = (dateString: string): ValidationResult => {
  if (!dateString) {
    return { isValid: false, error: 'Date is required' };
  }

  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return { isValid: false, error: 'Date must be in YYYY-MM-DD format' };
  }

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return { isValid: false, error: 'Invalid date' };
  }

  return { isValid: true };
};

/**
 * Validates that a date is not in the past
 * @param dateString - Date string to validate (ISO format YYYY-MM-DD)
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateFutureDate = (dateString: string): ValidationResult => {
  const dateValidation = validateDate(dateString);
  if (!dateValidation.isValid) {
    return dateValidation;
  }

  const date = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (date < today) {
    return { isValid: false, error: 'Date must be in the future' };
  }

  return { isValid: true };
};

/**
 * Combines multiple validation functions and returns the first error encountered
 * @param validators - Array of validation functions to run
 * @returns ValidationResult with isValid flag and optional error message
 */
export const validateMultiple = (validators: (() => ValidationResult)[]): ValidationResult => {
  for (const validator of validators) {
    const result = validator();
    if (!result.isValid) {
      return result;
    }
  }

  return { isValid: true };
};

/**
 * Trims and normalizes whitespace in a string
 * @param value - String to normalize
 * @returns Normalized string
 */
export const normalizeString = (value: string): string => {
  return value.trim().replace(/\s+/g, ' ');
};

/**
 * Sanitizes input to prevent common security issues
 * @param value - String to sanitize
 * @returns Sanitized string
 */
export const sanitizeInput = (value: string): string => {
  return value
    .trim()
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;');
};
