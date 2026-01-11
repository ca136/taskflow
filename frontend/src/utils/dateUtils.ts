/**
 * Format a date string or Date object into a human-readable format.
 * @param date - The date to format (ISO string or Date object)
 * @param options - Formatting options
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDate(
  date: string | Date,
  options: { includeTime?: boolean; includeYear?: boolean } = {}
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  const { includeTime = false, includeYear = true } = options;

  const formatter = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: includeYear ? 'numeric' : undefined,
    hour: includeTime ? '2-digit' : undefined,
    minute: includeTime ? '2-digit' : undefined,
    hour12: includeTime ? true : undefined,
  });

  return formatter.format(dateObj);
}

/**
 * Get a relative time string (e.g., "2 hours ago", "in 3 days").
 * @param date - The date to compare to now
 * @param baseDate - The date to compare from (defaults to now)
 * @returns Relative time string
 */
export function getRelativeTime(
  date: string | Date,
  baseDate: string | Date = new Date()
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const baseObj = typeof baseDate === 'string' ? new Date(baseDate) : baseDate;

  if (isNaN(dateObj.getTime())) {
    return 'Invalid date';
  }

  const diffMs = baseObj.getTime() - dateObj.getTime();
  const diffSecs = Math.round(diffMs / 1000);
  const diffMins = Math.round(diffSecs / 60);
  const diffHours = Math.round(diffMins / 60);
  const diffDays = Math.round(diffHours / 24);
  const diffWeeks = Math.round(diffDays / 7);
  const diffMonths = Math.round(diffDays / 30);
  const diffYears = Math.round(diffDays / 365);

  // Future dates
  if (diffMs < 0) {
    const absDiffSecs = Math.round(Math.abs(diffMs) / 1000);
    const absDiffMins = Math.round(absDiffSecs / 60);
    const absDiffHours = Math.round(absDiffMins / 60);
    const absDiffDays = Math.round(absDiffHours / 24);
    const absDiffWeeks = Math.round(absDiffDays / 7);
    const absDiffMonths = Math.round(absDiffDays / 30);
    const absDiffYears = Math.round(absDiffDays / 365);

    if (absDiffSecs < 60) return 'in moments';
    if (absDiffMins < 60) return `in ${absDiffMins} minute${absDiffMins !== 1 ? 's' : ''}`;
    if (absDiffHours < 24) return `in ${absDiffHours} hour${absDiffHours !== 1 ? 's' : ''}`;
    if (absDiffDays < 7) return `in ${absDiffDays} day${absDiffDays !== 1 ? 's' : ''}`;
    if (absDiffWeeks < 4) return `in ${absDiffWeeks} week${absDiffWeeks !== 1 ? 's' : ''}`;
    if (absDiffMonths < 12) return `in ${absDiffMonths} month${absDiffMonths !== 1 ? 's' : ''}`;
    return `in ${absDiffYears} year${absDiffYears !== 1 ? 's' : ''}`;
  }

  // Past dates
  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  if (diffWeeks < 4) return `${diffWeeks} week${diffWeeks !== 1 ? 's' : ''} ago`;
  if (diffMonths < 12) return `${diffMonths} month${diffMonths !== 1 ? 's' : ''} ago`;
  return `${diffYears} year${diffYears !== 1 ? 's' : ''} ago`;
}

/**
 * Format a date with both absolute and relative time information.
 * @param date - The date to format
 * @param options - Formatting options
 * @returns Object with absolute and relative time strings
 */
export function formatDateWithRelative(
  date: string | Date,
  options: { includeTime?: boolean; includeYear?: boolean } = {}
): { absolute: string; relative: string } {
  return {
    absolute: formatDate(date, options),
    relative: getRelativeTime(date),
  };
}

/**
 * Get a date range string (e.g., "Jan 15 - Jan 20, 2024").
 * @param startDate - The start date
 * @param endDate - The end date
 * @returns Formatted date range string
 */
export function formatDateRange(startDate: string | Date, endDate: string | Date): string {
  const start = new Date(typeof startDate === 'string' ? startDate : startDate.toISOString());
  const end = new Date(typeof endDate === 'string' ? endDate : endDate.toISOString());

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Invalid date range';
  }

  const startFormatted = formatDate(start, { includeYear: false });
  const endFormatted = formatDate(end, { includeYear: true });

  return `${startFormatted} - ${endFormatted}`;
}

/**
 * Parse and validate an ISO date string.
 * @param dateString - ISO date string to validate
 * @returns Date object if valid, null otherwise
 */
export function parseISODate(dateString: string): Date | null {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return null;
    }
    return date;
  } catch {
    return null;
  }
}

/**
 * Check if a date is today.
 * @param date - The date to check
 * @returns True if the date is today
 */
export function isToday(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const today = new Date();

  return (
    dateObj.getDate() === today.getDate() &&
    dateObj.getMonth() === today.getMonth() &&
    dateObj.getFullYear() === today.getFullYear()
  );
}

/**
 * Check if a date is in the past.
 * @param date - The date to check
 * @returns True if the date is in the past
 */
export function isPast(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.getTime() < new Date().getTime();
}

/**
 * Check if a date is in the future.
 * @param date - The date to check
 * @returns True if the date is in the future
 */
export function isFuture(date: string | Date): boolean {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  return dateObj.getTime() > new Date().getTime();
}
