/**
 * Error Logging Service
 * Centralized service for logging errors to backend and localStorage
 */

import { ERROR_HANDLING_CONFIG } from '@/config/errorHandling.config';
import { categorizeError, formatErrorForLogging } from '@/utils/errorCategorizer';

export interface ErrorLog {
  id: string;
  timestamp: string;
  category: string;
  severity: string;
  message: string;
  userMessage: string;
  context: Record<string, unknown>;
  url: string;
  userAgent: string;
  stackTrace?: string;
  userId?: string;
  sessionId?: string;
}

/**
 * Service for logging errors to backend and localStorage
 */
class ErrorLoggingService {
  private sessionId: string;
  private localErrors: ErrorLog[] = [];

  constructor() {
    this.sessionId = this.generateSessionId();
    this.loadErrorsFromStorage();
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    const stored = sessionStorage.getItem('error_session_id');
    if (stored) {
      return stored;
    }
    const newId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('error_session_id', newId);
    return newId;
  }

  /**
   * Get current user ID from localStorage/sessionStorage
   */
  private getCurrentUserId(): string | undefined {
    // Adjust this based on your auth storage structure
    try {
      const token = localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken');
      if (token) {
        // Extract user ID from JWT if available
        const payload = token.split('.')[1];
        if (payload) {
          const decoded = JSON.parse(atob(payload));
          return decoded.sub || decoded.userId || undefined;
        }
      }
    } catch {
      // Silently fail - we don't want logging errors to cause more errors
    }
    return undefined;
  }

  /**
   * Get browser and device information
   */
  private getBrowserInfo() {
    const nav = navigator as Navigator & {
      deviceMemory?: number;
      hardwareConcurrency?: number;
    };

    return {
      userAgent: navigator.userAgent,
      language: navigator.language,
      onLine: navigator.onLine,
      memory: nav.deviceMemory,
      cores: nav.hardwareConcurrency,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    };
  }

  /**
   * Log error with context
   */
  log(error: unknown, context: Record<string, unknown> = {}) {
    try {
      const categorized = categorizeError(error);
      const stack = error instanceof Error ? error.stack : undefined;

      const errorLog: ErrorLog = {
        id: `error_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        category: categorized.category,
        severity: categorized.severity,
        message: categorized.technicalMessage,
        userMessage: categorized.userMessage,
        context: {
          ...context,
          browserInfo: this.getBrowserInfo(),
        },
        url: window.location.href,
        userAgent: navigator.userAgent,
        stackTrace: stack,
        userId: this.getCurrentUserId(),
        sessionId: this.sessionId,
      };

      // Store locally
      this.addToLocalStorage(errorLog);

      // Log to console in development
      if (ERROR_HANDLING_CONFIG.verbose) {
        console.error('[ErrorLogging]', {
          category: categorized.category,
          severity: categorized.severity,
          message: categorized.technicalMessage,
          context,
          stack,
        });
      }

      // Report to backend if appropriate
      if (categorized.shouldReport) {
        this.reportToBackend(errorLog).catch(err => {
          // Silently fail - we don't want logging errors to cascade
          if (ERROR_HANDLING_CONFIG.verbose) {
            console.error('[ErrorLogging] Failed to report to backend:', err);
          }
        });
      }

      return errorLog;
    } catch (loggingError) {
      // If logging itself fails, just console log it
      console.error('[ErrorLogging] Logging service error:', loggingError);
      return null;
    }
  }

  /**
   * Add error to local storage
   */
  private addToLocalStorage(errorLog: ErrorLog) {
    try {
      this.localErrors.push(errorLog);

      // Keep only the most recent errors
      if (this.localErrors.length > ERROR_HANDLING_CONFIG.maxStoredErrors) {
        this.localErrors = this.localErrors.slice(-ERROR_HANDLING_CONFIG.maxStoredErrors);
      }

      // Save to sessionStorage for persistence
      sessionStorage.setItem(
        'error_logs',
        JSON.stringify(this.localErrors)
      );
    } catch (error) {
      // If storage fails (quota exceeded), clear old errors and try again
      if (error instanceof Error && error.message.includes('QuotaExceededError')) {
        this.localErrors = this.localErrors.slice(-10);
        try {
          sessionStorage.setItem('error_logs', JSON.stringify(this.localErrors));
        } catch {
          // Silently fail
        }
      }
    }
  }

  /**
   * Load errors from storage
   */
  private loadErrorsFromStorage() {
    try {
      const stored = sessionStorage.getItem('error_logs');
      if (stored) {
        this.localErrors = JSON.parse(stored);
      }
    } catch {
      this.localErrors = [];
    }
  }

  /**
   * Report error to backend API
   */
  private async reportToBackend(errorLog: ErrorLog): Promise<void> {
    try {
      const response = await fetch(ERROR_HANDLING_CONFIG.errorLogEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('accessToken') || sessionStorage.getItem('accessToken') || ''}`,
        },
        body: JSON.stringify(errorLog),
      });

      if (!response.ok) {
        throw new Error(`Backend error: ${response.status}`);
      }
    } catch (error) {
      // Silently fail - we don't want logging to cause cascading errors
      if (ERROR_HANDLING_CONFIG.verbose) {
        console.error('[ErrorLogging] Failed to report to backend:', error);
      }
    }
  }

  /**
   * Get all logged errors
   */
  getErrors(): ErrorLog[] {
    return [...this.localErrors];
  }

  /**
   * Clear error logs
   */
  clearErrors() {
    this.localErrors = [];
    sessionStorage.removeItem('error_logs');
  }

  /**
   * Get errors by severity
   */
  getErrorsBySeverity(severity: string): ErrorLog[] {
    return this.localErrors.filter(log => log.severity === severity);
  }

  /**
   * Get errors by category
   */
  getErrorsByCategory(category: string): ErrorLog[] {
    return this.localErrors.filter(log => log.category === category);
  }

  /**
   * Export errors as JSON (for debugging)
   */
  exportErrors(): string {
    return JSON.stringify(this.localErrors, null, 2);
  }

  /**
   * Get session info
   */
  getSessionInfo() {
    return {
      sessionId: this.sessionId,
      userId: this.getCurrentUserId(),
      errorCount: this.localErrors.length,
      criticalCount: this.localErrors.filter(e => e.severity === 'CRITICAL').length,
      browserInfo: this.getBrowserInfo(),
    };
  }
}

// Export singleton instance
export const errorLoggingService = new ErrorLoggingService();
