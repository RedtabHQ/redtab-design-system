/**
 * Global Error Handling Setup
 * Configures global error handlers for uncaught errors and promise rejections
 */

import { errorLoggingService } from '@/lib/errorLoggingService';
import { categorizeError, shouldReloadOnError } from '@/utils/errorCategorizer';
import { ERROR_HANDLING_CONFIG } from '@/config/errorHandling.config';

/**
 * Setup global error handlers
 * Should be called once in app initialization (main.tsx or App.tsx)
 */
export function setupGlobalErrorHandling() {
  // Handle uncaught synchronous errors
  window.addEventListener('error', (event: ErrorEvent) => {
    const categorized = categorizeError(event.error);

    errorLoggingService.log(event.error || new Error(event.message), {
      type: 'UNCAUGHT_ERROR',
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      message: event.message,
    });

    if (ERROR_HANDLING_CONFIG.verbose) {
      console.error('[GlobalErrorHandler] Uncaught error:', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        error: event.error,
      });
    }

    // Check if we should reload
    if (shouldReloadOnError(event.message)) {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  });

  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event: PromiseRejectionEvent) => {
    const reason = event.reason;
    const categorized = categorizeError(reason);

    errorLoggingService.log(reason || new Error('Unhandled promise rejection'), {
      type: 'UNHANDLED_REJECTION',
      reason: String(reason),
    });

    if (ERROR_HANDLING_CONFIG.verbose) {
      console.error('[GlobalErrorHandler] Unhandled promise rejection:', reason);
    }

    // Prevent the error from being printed to console in non-dev environments
    if (!ERROR_HANDLING_CONFIG.verbose) {
      event.preventDefault();
    }

    // Check if we should reload
    if (reason && shouldReloadOnError(String(reason))) {
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }
  });

  // Log when user becomes offline
  window.addEventListener('offline', () => {
    errorLoggingService.log(new Error('Network connection lost'), {
      type: 'NETWORK_STATUS_CHANGE',
      status: 'offline',
    });

    if (ERROR_HANDLING_CONFIG.verbose) {
      console.warn('[GlobalErrorHandler] User went offline');
    }
  });

  // Log when user comes back online
  window.addEventListener('online', () => {
    errorLoggingService.log(new Error('Network connection restored'), {
      type: 'NETWORK_STATUS_CHANGE',
      status: 'online',
    });

    if (ERROR_HANDLING_CONFIG.verbose) {
      console.log('[GlobalErrorHandler] User came back online');
    }
  });

  if (ERROR_HANDLING_CONFIG.verbose) {
    console.log('[GlobalErrorHandler] Global error handlers initialized');
  }
}

/**
 * Cleanup global error handlers
 * Useful for testing or cleanup
 */
export function cleanupGlobalErrorHandling() {
  // Note: We don't actually remove the listeners since they're needed
  // throughout the app lifecycle. This is just a placeholder for cleanup logic.
  if (ERROR_HANDLING_CONFIG.verbose) {
    console.log('[GlobalErrorHandler] Global error handlers cleaned up');
  }
}
