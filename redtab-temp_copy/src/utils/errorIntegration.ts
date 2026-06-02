/**
 * Error Integration Utilities
 * Utilities for integrating error handling with TanStack Query and API calls
 */

import { errorLoggingService } from '@/lib/errorLoggingService';
import { categorizeError } from '@/utils/errorCategorizer';

/**
 * TanStack Query error handler
 * Use this in the onError callback of useQuery/useMutation
 */
export function handleQueryError(error: unknown, context?: Record<string, unknown>) {
  const categorized = categorizeError(error);

  errorLoggingService.log(error, {
    type: 'QUERY_ERROR',
    ...context,
  });

  return categorized;
}

/**
 * API request error handler
 * Wraps API errors with proper logging and categorization
 */
export async function executeWithErrorHandling<T>(
  fn: () => Promise<T>,
  context?: Record<string, unknown>
): Promise<T> {
  try {
    return await fn();
  } catch (error) {
    const categorized = categorizeError(error);

    errorLoggingService.log(error, {
      type: 'API_REQUEST_ERROR',
      ...context,
    });

    throw categorized;
  }
}

/**
 * Create a safe version of a function that catches and logs errors
 */
export function createSafeFunction<T extends unknown[], R>(
  fn: (...args: T) => R,
  context?: Record<string, unknown>
) {
  return (...args: T) => {
    try {
      const result = fn(...args);

      // If it's a promise, handle errors
      if (result instanceof Promise) {
        return result.catch(error => {
          errorLoggingService.log(error, {
            type: 'FUNCTION_ERROR',
            ...context,
          });
          return null;
        });
      }

      return result;
    } catch (error) {
      errorLoggingService.log(error, {
        type: 'FUNCTION_ERROR',
        ...context,
      });
      return null;
    }
  };
}

/**
 * Create a safe async function that catches and logs errors
 */
export function createSafeAsyncFunction<T extends unknown[], R>(
  fn: (...args: T) => Promise<R>,
  context?: Record<string, unknown>
) {
  return async (...args: T): Promise<R | null> => {
    try {
      return await fn(...args);
    } catch (error) {
      errorLoggingService.log(error, {
        type: 'ASYNC_FUNCTION_ERROR',
        ...context,
      });
      return null;
    }
  };
}
