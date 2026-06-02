/**
 * Error Handler Hook
 * Hook for handling errors in components with automatic logging and UI feedback
 */

import { useCallback, useRef, useEffect } from 'react';
import { errorLoggingService } from '@/lib/errorLoggingService';
import { categorizeError, shouldReloadOnError } from '@/utils/errorCategorizer';
import { useToastContext } from '@/components/common/ToastContainer';

interface ErrorHandlerOptions {
  showToast?: boolean;
  showModal?: boolean;
  context?: Record<string, unknown>;
  onError?: (error: unknown) => void;
}

/**
 * Hook for handling errors with logging and UI feedback
 */
export const useErrorHandler = (options: ErrorHandlerOptions = {}) => {
  const {
    showToast = true,
    showModal = false,
    context = {},
    onError,
  } = options;

  const toast = useToastContext();
  const componentContext = useRef(context);

  // Update context ref when it changes
  useEffect(() => {
    componentContext.current = context;
  }, [context]);

  /**
   * Handle an error with logging and user feedback
   */
  const handle = useCallback(
    (error: unknown, errorContext?: Record<string, unknown>) => {
      try {
        const categorized = categorizeError(error);
        const mergedContext = {
          ...componentContext.current,
          ...errorContext,
        };

        // Log the error
        const logged = errorLoggingService.log(error, mergedContext);

        // Show user feedback
        if (showToast) {
          toast.show({
            type: categorized.severity === 'CRITICAL' ? 'DANGER' : 'WARNING',
            title: 'Error Occurred',
            message: categorized.userMessage,
          });
        }

        // Check if we need to reload the page
        if (shouldReloadOnError(categorized.technicalMessage)) {
          setTimeout(() => {
            window.location.reload();
          }, 2000);
        }

        // Call optional callback
        onError?.(error);

        return logged;
      } catch (handlingError) {
        // If error handling itself fails, log it
        console.error('[useErrorHandler] Error handling failed:', handlingError);
        return null;
      }
    },
    [showToast, showModal, onError, toast]
  );

  /**
   * Handle async function with error handling
   */
  const handleAsync = useCallback(
    async <T,>(
      fn: () => Promise<T>,
      errorContext?: Record<string, unknown>
    ): Promise<T | null> => {
      try {
        return await fn();
      } catch (error) {
        handle(error, errorContext);
        return null;
      }
    },
    [handle]
  );

  /**
   * Wrap a function to automatically handle errors
   */
  const wrapFunction = useCallback(
    <T extends unknown[], R>(
      fn: (...args: T) => R,
      errorContext?: Record<string, unknown>
    ) => {
      return (...args: T) => {
        try {
          const result = fn(...args);
          // Handle promises
          if (result instanceof Promise) {
            return result.catch(error => {
              handle(error, errorContext);
              return null;
            });
          }
          return result;
        } catch (error) {
          handle(error, errorContext);
          return null;
        }
      };
    },
    [handle]
  );

  /**
   * Create an async event handler
   */
  const createAsyncHandler = useCallback(
    <Args extends unknown[]>(
      fn: (...args: Args) => Promise<void>,
      errorContext?: Record<string, unknown>
    ) => {
      return (...args: Args) => {
        return handleAsync(() => fn(...args), errorContext);
      };
    },
    [handleAsync]
  );

  return {
    handle,
    handleAsync,
    wrapFunction,
    createAsyncHandler,
  };
};

/**
 * Hook for API call error handling
 */
export const useApiErrorHandler = () => {
  const toast = useToastContext();

  /**
   * Handle API error with user feedback
   */
  const handleApiError = useCallback(
    (error: unknown, fallbackMessage?: string) => {
      const categorized = categorizeError(error);

      // Log the error
      errorLoggingService.log(error, {
        type: 'API_ERROR',
        source: 'useApiErrorHandler',
      });

      // Show toast
      toast.show({
        type: categorized.severity === 'CRITICAL' ? 'DANGER' : 'WARNING',
        title: 'Request Failed',
        message: fallbackMessage || categorized.userMessage,
      });
    },
    [toast]
  );

  return { handleApiError };
};
