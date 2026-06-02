/**
 * Error Handling Configuration
 * Centralized configuration for error handling behavior, messages, and logging
 */

export const ERROR_HANDLING_CONFIG = {
  // Error log retention (days)
  logRetentionDays: 30,

  // Maximum number of errors to store in localStorage
  maxStoredErrors: 50,

  // API endpoint for logging errors
  errorLogEndpoint: '/api/v1/logs/errors',

  // Error severity levels
  severity: {
    LOW: 'LOW',
    MEDIUM: 'MEDIUM',
    HIGH: 'HIGH',
    CRITICAL: 'CRITICAL',
  } as const,

  // Error categories
  categories: {
    UNKNOWN: 'UNKNOWN',
    COMPONENT: 'COMPONENT',
    API: 'API',
    VALIDATION: 'VALIDATION',
    NETWORK: 'NETWORK',
    RUNTIME: 'RUNTIME',
    PROMISE_REJECTION: 'PROMISE_REJECTION',
    STORAGE: 'STORAGE',
    AUTHENTICATION: 'AUTHENTICATION',
  } as const,

  // User-friendly error messages (by category)
  userMessages: {
    UNKNOWN: 'Something went wrong. Please try again.',
    COMPONENT: 'A component encountered an error. Please refresh the page.',
    API: 'Failed to communicate with the server. Please check your connection.',
    VALIDATION: 'Please check your input and try again.',
    NETWORK: 'Network connection error. Please check your internet connection.',
    RUNTIME: 'An unexpected error occurred. Please refresh the page.',
    PROMISE_REJECTION: 'An operation failed. Please try again.',
    STORAGE: 'Unable to save data. Please check your browser storage settings.',
    AUTHENTICATION: 'Your session has expired. Please log in again.',
  } as const,

  // Don't report certain errors to the backend
  silentErrorPatterns: [
    'Network Error',
    'timeout of',
    'cancelled',
    'AbortError',
  ],

  // Errors that should trigger a page reload
  criticalErrorPatterns: [
    'Fatal',
    'SecurityError',
    'QuotaExceededError',
  ],

  // Development only: log all errors to console
  verbose: import.meta.env.DEV,

  // Development only: show error details in UI
  showErrorDetails: import.meta.env.DEV,
} as const;

export type ErrorSeverity = typeof ERROR_HANDLING_CONFIG.severity[keyof typeof ERROR_HANDLING_CONFIG.severity];
export type ErrorCategory = typeof ERROR_HANDLING_CONFIG.categories[keyof typeof ERROR_HANDLING_CONFIG.categories];
