/**
 * Error Categorizer Utility
 * Categorizes errors and determines severity levels for proper handling
 */

import { ERROR_HANDLING_CONFIG, type ErrorSeverity, type ErrorCategory } from '@/config/errorHandling.config';

export interface CategorizedError {
  category: ErrorCategory;
  severity: ErrorSeverity;
  userMessage: string;
  technicalMessage: string;
  shouldReport: boolean;
  shouldLogLocally: boolean;
  shouldShowModal: boolean;
}

/**
 * Categorize an error based on type, message, and context
 */
export function categorizeError(error: unknown): CategorizedError {
  const technicalMessage = getTechnicalMessage(error);
  const category = determineCategory(error, technicalMessage);
  const severity = determineSeverity(error, category);
  const shouldReport = !isErrorSilent(technicalMessage);

  return {
    category,
    severity,
    userMessage: ERROR_HANDLING_CONFIG.userMessages[category],
    technicalMessage,
    shouldReport,
    shouldLogLocally: true,
    shouldShowModal: severity === 'CRITICAL' || severity === 'HIGH',
  };
}

/**
 * Extract technical message from error object
 */
function getTechnicalMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message || error.toString();
  }
  if (typeof error === 'string') {
    return error;
  }
  if (typeof error === 'object' && error !== null) {
    // Handle API error responses
    if ('message' in error) {
      return String((error as Record<string, unknown>).message);
    }
    if ('error' in error) {
      return String((error as Record<string, unknown>).error);
    }
  }
  return 'An unknown error occurred';
}

/**
 * Determine error category based on error properties and message
 */
function determineCategory(error: unknown, message: string): ErrorCategory {
  const messageLower = message.toLowerCase();

  // Check for specific error types
  if (error instanceof TypeError) {
    return ERROR_HANDLING_CONFIG.categories.RUNTIME;
  }

  if (error instanceof ReferenceError) {
    return ERROR_HANDLING_CONFIG.categories.RUNTIME;
  }

  if (error instanceof SyntaxError) {
    return ERROR_HANDLING_CONFIG.categories.RUNTIME;
  }

  if (error instanceof RangeError) {
    return ERROR_HANDLING_CONFIG.categories.RUNTIME;
  }

  // Check for authentication/authorization errors
  if (
    messageLower.includes('unauthorized') ||
    messageLower.includes('401') ||
    messageLower.includes('authentication') ||
    messageLower.includes('session expired') ||
    messageLower.includes('not authenticated')
  ) {
    return ERROR_HANDLING_CONFIG.categories.AUTHENTICATION;
  }

  // Check for validation errors
  if (
    messageLower.includes('validation') ||
    messageLower.includes('invalid') ||
    messageLower.includes('required field')
  ) {
    return ERROR_HANDLING_CONFIG.categories.VALIDATION;
  }

  // Check for network/API errors
  if (
    messageLower.includes('network') ||
    messageLower.includes('fetch') ||
    messageLower.includes('http') ||
    messageLower.includes('request') ||
    messageLower.includes('timeout') ||
    messageLower.includes('failed to') ||
    messageLower.includes('connection') ||
    messageLower.includes('econnrefused')
  ) {
    return ERROR_HANDLING_CONFIG.categories.API;
  }

  // Check for storage errors
  if (
    messageLower.includes('storage') ||
    messageLower.includes('quota') ||
    messageLower.includes('localstorage') ||
    messageLower.includes('sessionstorage')
  ) {
    return ERROR_HANDLING_CONFIG.categories.STORAGE;
  }

  // Check for promise rejection
  if (
    messageLower.includes('promise') ||
    messageLower.includes('unhandled rejection') ||
    messageLower.includes('rejected')
  ) {
    return ERROR_HANDLING_CONFIG.categories.PROMISE_REJECTION;
  }

  // Check if it's a component error (typically from error boundary)
  if (error instanceof Error && error.stack?.includes('React')) {
    return ERROR_HANDLING_CONFIG.categories.COMPONENT;
  }

  return ERROR_HANDLING_CONFIG.categories.UNKNOWN;
}

/**
 * Determine error severity based on category and message
 */
function determineSeverity(error: unknown, category: ErrorCategory): ErrorSeverity {
  const message = getTechnicalMessage(error);
  const messageLower = message.toLowerCase();

  // Critical errors
  if (
    message.includes('FATAL') ||
    message.includes('SecurityError') ||
    message.includes('QuotaExceededError') ||
    category === ERROR_HANDLING_CONFIG.categories.COMPONENT ||
    category === ERROR_HANDLING_CONFIG.categories.AUTHENTICATION
  ) {
    return 'CRITICAL';
  }

  // High severity
  if (
    messageLower.includes('error') ||
    category === ERROR_HANDLING_CONFIG.categories.API ||
    category === ERROR_HANDLING_CONFIG.categories.STORAGE
  ) {
    return 'HIGH';
  }

  // Medium severity
  if (
    category === ERROR_HANDLING_CONFIG.categories.VALIDATION ||
    category === ERROR_HANDLING_CONFIG.categories.RUNTIME
  ) {
    return 'MEDIUM';
  }

  // Low severity (network issues that might be transient)
  if (category === ERROR_HANDLING_CONFIG.categories.NETWORK) {
    return 'LOW';
  }

  return 'MEDIUM';
}

/**
 * Check if error should be silently ignored (not reported to backend)
 */
function isErrorSilent(message: string): boolean {
  return ERROR_HANDLING_CONFIG.silentErrorPatterns.some(pattern =>
    message.toLowerCase().includes(pattern.toLowerCase())
  );
}

/**
 * Format error for display in UI
 */
export function formatErrorForDisplay(categorized: CategorizedError, showDetails: boolean = false): string {
  if (showDetails && ERROR_HANDLING_CONFIG.showErrorDetails) {
    return `${categorized.userMessage}\n\nTechnical: ${categorized.technicalMessage}`;
  }
  return categorized.userMessage;
}

/**
 * Format error for logging to backend
 */
export function formatErrorForLogging(
  categorized: CategorizedError,
  context: Record<string, unknown>
) {
  return {
    timestamp: new Date().toISOString(),
    category: categorized.category,
    severity: categorized.severity,
    message: categorized.technicalMessage,
    userMessage: categorized.userMessage,
    context,
    url: window.location.href,
    userAgent: navigator.userAgent,
  };
}

/**
 * Check if error should trigger a page reload
 */
export function shouldReloadOnError(message: string): boolean {
  return ERROR_HANDLING_CONFIG.criticalErrorPatterns.some(pattern =>
    message.includes(pattern)
  );
}
