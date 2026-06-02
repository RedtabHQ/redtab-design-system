/**
 * Status badge styling utilities
 * Provides consistent styling for status badges across the application
 */

type StatusStyleMap = Record<string, string>;

const STATUS_STYLES: StatusStyleMap = {
  SETTLED: 'bg-green-50 text-green-600 border-green-100',
  PENDING: 'bg-yellow-50 text-yellow-600 border-yellow-100',
  FAILED: 'bg-red-50 text-red-600 border-red-100',
  PROCESSING: 'bg-blue-50 text-blue-600 border-blue-100',
};

const DEFAULT_STATUS_STYLE = 'bg-gray-50 text-gray-600 border-gray-100';

/**
 * Get Tailwind CSS classes for a status badge
 * @param status - The status string (case-insensitive)
 * @returns Tailwind CSS classes for the status badge
 */
export const getStatusStyles = (status: string): string => {
  return STATUS_STYLES[status.toUpperCase()] || DEFAULT_STATUS_STYLE;
};
