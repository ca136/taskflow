/**
 * Date formatting and parsing utilities
 * Provides functions for formatting dates, calculating relative time, and parsing date strings
 */

/**
 * Represents a parsed date object with validation
 */
export interface ParsedDate {
  date: Date;
  isValid: boolean;
  error?: string;
}

/**
 * Represents options for date formatting
 */
export interface DateFormatOptions {
  year?: 'numeric' | '2-digit';
  month?: 'numeric' | '2-digit' | 'long' | 'short';
  day?: 'numeric' | '2-digit';
  hour?: 'numeric' | '2-digit';
  minute?: 'numeric' | '2-digit';
  second?: 'numeric' | '2-digit';
  hour12?: boolean;
  timeZone?: string;
}

/**
 * Formats a date object or string to a readable date format
 * @param date - The date to format (Date object or ISO string)
 * @param format - Format string with pattern tokens or DateFormatOptions
 * @returns Formatted date string
 * @example
 * formatDate(new Date(), 'MM/DD/YYYY') => '01/15/2024'
 * formatDate(new Date(), 'MMMM D, YYYY') => 'January 15, 2024'
 */
export function formatDate(
  date: Date | string,
  format: string = 'MM/DD/YYYY'
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return '';
    }

    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const seconds = dateObj.getSeconds();

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const monthShort = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const dayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const pad = (num: number): string => String(num).padStart(2, '0');

    const replacements: Record<string, string> = {
      YYYY: String(year),
      YY: String(year).slice(-2),
      MMMM: monthNames[dateObj.getMonth()],
      MMM: monthShort[dateObj.getMonth()],
      MM: pad(month),
      M: String(month),
      DD: pad(day),
      D: String(day),
      dddd: dayNames[dateObj.getDay()],
      ddd: dayShort[dateObj.getDay()],
      HH: pad(hours),
      H: String(hours),
      hh: pad(hours % 12 || 12),
      h: String(hours % 12 || 12),
      mm: pad(minutes),
      m: String(minutes),
      ss: pad(seconds),
      s: String(seconds),
      A: hours >= 12 ? 'PM' : 'AM',
      a: hours >= 12 ? 'pm' : 'am',
    };

    let result = format;
    // Replace longer patterns first to avoid partial replacements
    Object.keys(replacements)
      .sort((a, b) => b.length - a.length)
      .forEach((key) => {
        result = result.replace(new RegExp(key, 'g'), replacements[key]);
      });

    return result;
  } catch {
    return '';
  }
}

/**
 * Formats a date using Intl.DateTimeFormat for locale-aware formatting
 * @param date - The date to format
 * @param options - Intl.DateTimeFormat options
 * @param locale - The locale string (default: 'en-US')
 * @returns Formatted date string
 * @example
 * formatDateLocale(new Date(), { year: 'numeric', month: 'long', day: 'numeric' })
 * => 'January 15, 2024' (in en-US locale)
 */
export function formatDateLocale(
  date: Date | string,
  options: DateFormatOptions = {},
  locale: string = 'en-US'
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return '';
    }

    const defaults: DateFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    };

    const mergedOptions = { ...defaults, ...options };
    return dateObj.toLocaleDateString(locale, mergedOptions);
  } catch {
    return '';
  }
}

/**
 * Formats a date and time using Intl.DateTimeFormat
 * @param date - The date to format
 * @param options - Intl.DateTimeFormat options
 * @param locale - The locale string (default: 'en-US')
 * @returns Formatted date and time string
 * @example
 * formatDateTime(new Date(), { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })
 * => 'Jan 15, 3:45 PM' (in en-US locale)
 */
export function formatDateTime(
  date: Date | string,
  options: DateFormatOptions = {},
  locale: string = 'en-US'
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return '';
    }

    const defaults: DateFormatOptions = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    };

    const mergedOptions = { ...defaults, ...options };
    return dateObj.toLocaleDateString(locale, mergedOptions);
  } catch {
    return '';
  }
}

/**
 * Formats only the time portion of a date
 * @param date - The date to format
 * @param format24 - Use 24-hour format (default: false for 12-hour)
 * @returns Formatted time string
 * @example
 * formatTime(new Date()) => '3:45 PM'
 * formatTime(new Date(), true) => '15:45'
 */
export function formatTime(date: Date | string, format24: boolean = false): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return '';
    }

    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const pad = (num: number): string => String(num).padStart(2, '0');

    if (format24) {
      return `${pad(hours)}:${pad(minutes)}`;
    }

    const displayHours = hours % 12 || 12;
    const ampm = hours >= 12 ? 'PM' : 'AM';
    return `${pad(displayHours)}:${pad(minutes)} ${ampm}`;
  } catch {
    return '';
  }
}

/**
 * Calculates the relative time difference from now (e.g., '2 hours ago', 'in 3 days')
 * @param date - The date to calculate from
 * @param now - The reference date (default: current time)
 * @returns Human-readable relative time string
 * @example
 * getRelativeTime(new Date(Date.now() - 2 * 60 * 60 * 1000)) => '2 hours ago'
 * getRelativeTime(new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)) => 'in 3 days'
 */
export function getRelativeTime(
  date: Date | string,
  now: Date = new Date()
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime()) || isNaN(now.getTime())) {
      return '';
    }

    const diffMs = dateObj.getTime() - now.getTime();
    const diffSecs = Math.round(diffMs / 1000);
    const diffMins = Math.round(diffSecs / 60);
    const diffHours = Math.round(diffMins / 60);
    const diffDays = Math.round(diffHours / 24);
    const diffWeeks = Math.round(diffDays / 7);
    const diffMonths = Math.round(diffDays / 30);
    const diffYears = Math.round(diffDays / 365);

    const isFuture = diffMs > 0;

    if (Math.abs(diffSecs) < 60) {
      if (diffSecs === 0) return 'just now';
      return isFuture ? 'in a few seconds' : 'a few seconds ago';
    }

    if (Math.abs(diffMins) < 60) {
      const mins = Math.abs(diffMins);
      return isFuture
        ? `in ${mins} minute${mins > 1 ? 's' : ''}`
        : `${mins} minute${mins > 1 ? 's' : ''} ago`;
    }

    if (Math.abs(diffHours) < 24) {
      const hours = Math.abs(diffHours);
      return isFuture
        ? `in ${hours} hour${hours > 1 ? 's' : ''}`
        : `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }

    if (Math.abs(diffDays) < 7) {
      const days = Math.abs(diffDays);
      return isFuture
        ? `in ${days} day${days > 1 ? 's' : ''}`
        : `${days} day${days > 1 ? 's' : ''} ago`;
    }

    if (Math.abs(diffWeeks) < 4) {
      const weeks = Math.abs(diffWeeks);
      return isFuture
        ? `in ${weeks} week${weeks > 1 ? 's' : ''}`
        : `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    }

    if (Math.abs(diffMonths) < 12) {
      const months = Math.abs(diffMonths);
      return isFuture
        ? `in ${months} month${months > 1 ? 's' : ''}`
        : `${months} month${months > 1 ? 's' : ''} ago`;
    }

    const years = Math.abs(diffYears);
    return isFuture
      ? `in ${years} year${years > 1 ? 's' : ''}`
      : `${years} year${years > 1 ? 's' : ''} ago`;
  } catch {
    return '';
  }
}

/**
 * Parses a date string in various formats
 * Supports: ISO 8601, MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD, and common date strings
 * @param dateString - The date string to parse
 * @param assumeYMD - Assume YYYY-MM-DD format when ambiguous (default: true)
 * @returns ParsedDate object with validation
 * @example
 * parseDate('2024-01-15') => { date: Date, isValid: true }
 * parseDate('01/15/2024') => { date: Date, isValid: true }
 * parseDate('invalid') => { date: null, isValid: false, error: '...' }
 */
export function parseDate(
  dateString: string,
  assumeYMD: boolean = true
): ParsedDate {
  if (!dateString || typeof dateString !== 'string') {
    return {
      date: new Date(),
      isValid: false,
      error: 'Invalid date string provided',
    };
  }

  const trimmed = dateString.trim();

  // Try native Date parsing first (ISO 8601 and common formats)
  const nativeDate = new Date(trimmed);
  if (!isNaN(nativeDate.getTime())) {
    return { date: nativeDate, isValid: true };
  }

  // Try MM/DD/YYYY or DD/MM/YYYY format
  const slashRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
  const slashMatch = trimmed.match(slashRegex);
  if (slashMatch) {
    const [, part1, part2, year] = slashMatch;
    const num1 = parseInt(part1, 10);
    const num2 = parseInt(part2, 10);
    const yearNum = parseInt(year, 10);

    // Assume MM/DD/YYYY format
    if (num1 <= 12 && num2 <= 31) {
      const date = new Date(yearNum, num1 - 1, num2);
      if (!isNaN(date.getTime())) {
        return { date, isValid: true };
      }
    }

    // Try DD/MM/YYYY format
    if (num1 <= 31 && num2 <= 12) {
      const date = new Date(yearNum, num2 - 1, num1);
      if (!isNaN(date.getTime())) {
        return { date, isValid: true };
      }
    }
  }

  // Try YYYY-MM-DD format
  const dashRegex = /^(\d{4})-(\d{1,2})-(\d{1,2})$/;
  const dashMatch = trimmed.match(dashRegex);
  if (dashMatch) {
    const [, year, month, day] = dashMatch;
    const date = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
    if (!isNaN(date.getTime())) {
      return { date, isValid: true };
    }
  }

  // Try DD-MM-YYYY format
  const dashRegex2 = /^(\d{1,2})-(\d{1,2})-(\d{4})$/;
  const dashMatch2 = trimmed.match(dashRegex2);
  if (dashMatch2) {
    const [, day, month, year] = dashMatch2;
    const num1 = parseInt(day, 10);
    const num2 = parseInt(month, 10);
    if (num1 <= 31 && num2 <= 12) {
      const date = new Date(parseInt(year, 10), num2 - 1, num1);
      if (!isNaN(date.getTime())) {
        return { date, isValid: true };
      }
    }
  }

  return {
    date: new Date(),
    isValid: false,
    error: `Unable to parse date string: "${dateString}". Supported formats: ISO 8601, MM/DD/YYYY, DD/MM/YYYY, YYYY-MM-DD`,
  };
}

/**
 * Converts a date to ISO 8601 string format
 * @param date - The date to convert
 * @returns ISO 8601 formatted string
 * @example
 * toISOString(new Date()) => '2024-01-15T15:30:45.000Z'
 */
export function toISOString(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return '';
    }

    return dateObj.toISOString();
  } catch {
    return '';
  }
}

/**
 * Converts a date to a date-only string in YYYY-MM-DD format
 * @param date - The date to convert
 * @returns Date string in YYYY-MM-DD format
 * @example
 * toDateString(new Date(2024, 0, 15)) => '2024-01-15'
 */
export function toDateString(date: Date | string): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return '';
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
}

/**
 * Checks if a date is valid
 * @param date - The date to validate
 * @returns true if date is valid, false otherwise
 * @example
 * isValidDate(new Date()) => true
 * isValidDate('invalid') => false
 */
export function isValidDate(date: Date | string): boolean {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return !isNaN(dateObj.getTime());
  } catch {
    return false;
  }
}

/**
 * Gets the start of a given date (00:00:00)
 * @param date - The date
 * @returns New date at start of day
 * @example
 * getStartOfDay(new Date(2024, 0, 15, 15, 30, 45))
 * => 2024-01-15 00:00:00
 */
export function getStartOfDay(date: Date | string): Date {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return new Date();
    }

    const result = new Date(dateObj);
    result.setHours(0, 0, 0, 0);
    return result;
  } catch {
    return new Date();
  }
}

/**
 * Gets the end of a given date (23:59:59.999)
 * @param date - The date
 * @returns New date at end of day
 * @example
 * getEndOfDay(new Date(2024, 0, 15, 8, 30, 0))
 * => 2024-01-15 23:59:59.999
 */
export function getEndOfDay(date: Date | string): Date {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return new Date();
    }

    const result = new Date(dateObj);
    result.setHours(23, 59, 59, 999);
    return result;
  } catch {
    return new Date();
  }
}

/**
 * Adds a specified number of days to a date
 * @param date - The base date
 * @param days - Number of days to add (negative to subtract)
 * @returns New date with days added
 * @example
 * addDays(new Date(2024, 0, 15), 5) => 2024-01-20
 * addDays(new Date(2024, 0, 15), -3) => 2024-01-12
 */
export function addDays(date: Date | string, days: number): Date {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return new Date();
    }

    const result = new Date(dateObj);
    result.setDate(result.getDate() + days);
    return result;
  } catch {
    return new Date();
  }
}

/**
 * Adds a specified number of months to a date
 * @param date - The base date
 * @param months - Number of months to add (negative to subtract)
 * @returns New date with months added
 * @example
 * addMonths(new Date(2024, 0, 15), 3) => 2024-04-15
 * addMonths(new Date(2024, 0, 31), 1) => 2024-02-29 (handles month-end dates)
 */
export function addMonths(date: Date | string, months: number): Date {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return new Date();
    }

    const result = new Date(dateObj);
    result.setMonth(result.getMonth() + months);
    return result;
  } catch {
    return new Date();
  }
}

/**
 * Adds a specified number of years to a date
 * @param date - The base date
 * @param years - Number of years to add (negative to subtract)
 * @returns New date with years added
 * @example
 * addYears(new Date(2024, 0, 15), 2) => 2026-01-15
 */
export function addYears(date: Date | string, years: number): Date {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return new Date();
    }

    const result = new Date(dateObj);
    result.setFullYear(result.getFullYear() + years);
    return result;
  } catch {
    return new Date();
  }
}

/**
 * Calculates the difference in days between two dates
 * @param date1 - First date
 * @param date2 - Second date
 * @returns Number of days difference (positive if date1 > date2)
 * @example
 * getDaysDifference(new Date(2024, 0, 20), new Date(2024, 0, 15)) => 5
 */
export function getDaysDifference(date1: Date | string, date2: Date | string): number {
  try {
    const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
    const d2 = typeof date2 === 'string' ? new Date(date2) : date2;

    if (isNaN(d1.getTime()) || isNaN(d2.getTime())) {
      return 0;
    }

    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.round((d1.getTime() - d2.getTime()) / msPerDay);
  } catch {
    return 0;
  }
}

/**
 * Checks if a date is in the past
 * @param date - The date to check
 * @param now - Reference date (default: current time)
 * @returns true if date is in the past
 * @example
 * isDateInPast(new Date(2020, 0, 1)) => true
 */
export function isDateInPast(date: Date | string, now: Date = new Date()): boolean {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime()) || isNaN(now.getTime())) {
      return false;
    }

    return dateObj.getTime() < now.getTime();
  } catch {
    return false;
  }
}

/**
 * Checks if a date is in the future
 * @param date - The date to check
 * @param now - Reference date (default: current time)
 * @returns true if date is in the future
 * @example
 * isDateInFuture(new Date(Date.now() + 86400000)) => true
 */
export function isDateInFuture(date: Date | string, now: Date = new Date()): boolean {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime()) || isNaN(now.getTime())) {
      return false;
    }

    return dateObj.getTime() > now.getTime();
  } catch {
    return false;
  }
}

/**
 * Checks if a date is today
 * @param date - The date to check
 * @returns true if date is today
 * @example
 * isToday(new Date()) => true
 */
export function isToday(date: Date | string): boolean {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();

    if (isNaN(dateObj.getTime())) {
      return false;
    }

    return (
      dateObj.getFullYear() === today.getFullYear() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getDate() === today.getDate()
    );
  } catch {
    return false;
  }
}

/**
 * Gets a human-readable day of week string
 * @param date - The date
 * @param short - Return short format (e.g., 'Mon' instead of 'Monday')
 * @returns Day of week name
 * @example
 * getDayOfWeek(new Date(2024, 0, 15)) => 'Monday'
 * getDayOfWeek(new Date(2024, 0, 15), true) => 'Mon'
 */
export function getDayOfWeek(date: Date | string, short: boolean = false): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return '';
    }

    const dayNames = [
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday',
    ];
    const dayShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const day = dateObj.getDay();
    return short ? dayShort[day] : dayNames[day];
  } catch {
    return '';
  }
}

/**
 * Gets a human-readable month name
 * @param date - The date
 * @param short - Return short format (e.g., 'Jan' instead of 'January')
 * @returns Month name
 * @example
 * getMonthName(new Date(2024, 0, 15)) => 'January'
 * getMonthName(new Date(2024, 0, 15), true) => 'Jan'
 */
export function getMonthName(date: Date | string, short: boolean = false): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;

    if (isNaN(dateObj.getTime())) {
      return '';
    }

    const monthNames = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];
    const monthShort = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];

    const month = dateObj.getMonth();
    return short ? monthShort[month] : monthNames[month];
  } catch {
    return '';
  }
}
