/**
 * Task Helper Utilities
 * Common utility functions for task operations in TaskFlow
 */

import type { Task } from '../types/task'

/**
 * Generate a unique identifier for a new task
 * Uses timestamp + random string to create a unique ID
 * @returns A unique ID string
 */
export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
}

/**
 * Format a date for display purposes
 * Returns a human-readable date string in local timezone
 * @param date - The date to format
 * @returns Formatted date string (e.g., "Jan 15, 2024")
 */
export function formatDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return dateObj.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * Sort tasks by their creation date
 * By default sorts in descending order (newest first)
 * @param tasks - Array of tasks to sort
 * @param order - 'asc' for ascending (oldest first) or 'desc' for descending (newest first)
 * @returns A new sorted array of tasks
 */
export function sortTasksByDate(
  tasks: Task[],
  order: 'asc' | 'desc' = 'desc'
): Task[] {
  return [...tasks].sort((a, b) => {
    const dateA = new Date(a.createdAt).getTime()
    const dateB = new Date(b.createdAt).getTime()
    return order === 'asc' ? dateA - dateB : dateB - dateA
  })
}

/**
 * Get Tailwind CSS classes for task status styling
 * Returns appropriate color and styling classes based on task status
 * @param status - The task status
 * @returns Tailwind CSS class string for styling
 */
export function getStatusColor(
  status: 'todo' | 'in-progress' | 'done'
): string {
  switch (status) {
    case 'todo':
      return 'bg-slate-100 text-slate-800 border-slate-300'
    case 'in-progress':
      return 'bg-blue-100 text-blue-800 border-blue-300'
    case 'done':
      return 'bg-green-100 text-green-800 border-green-300'
    default:
      return 'bg-slate-100 text-slate-800 border-slate-300'
  }
}
