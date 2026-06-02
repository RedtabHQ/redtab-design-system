/**
 * Error Boundary Component
 * Catches React component errors and displays fallback UI
 */

import React, { ReactNode, ReactElement, ErrorInfo } from 'react';
import { errorLoggingService } from '@/lib/errorLoggingService';
import { categorizeError } from '@/utils/errorCategorizer';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

/**
 * Error Boundary to catch React component errors
 */
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Update state with error info
    this.setState({ errorInfo });

    // Log the error
    const categorized = categorizeError(error);
    errorLoggingService.log(error, {
      component: 'ErrorBoundary',
      componentStack: errorInfo.componentStack,
      category: categorized.category,
      severity: categorized.severity,
    });

    // Log to console in development
    console.error('[ErrorBoundary] Component error caught:', {
      error: error.toString(),
      componentStack: errorInfo.componentStack,
    });
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render(): ReactElement {
    if (this.state.hasError && this.state.error) {
      const categorized = categorizeError(this.state.error);

      return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50 px-4">
          <div className="w-full max-w-md">
            <div className="bg-white rounded-xl shadow-xl p-8">
              {/* Icon */}
              <div className="flex justify-center mb-6">
                <div className="bg-red-100 rounded-full p-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
              </div>

              {/* Heading */}
              <h1 className="text-2xl font-bold text-center text-gray-900 mb-2">
                Something Went Wrong
              </h1>

              {/* Message */}
              <p className="text-center text-gray-600 mb-6">
                {categorized.userMessage}
              </p>

              {/* Error Details (Development only) */}
              {import.meta.env.DEV && this.state.error && (
                <div className="mb-6 bg-gray-50 rounded-lg p-4 max-h-40 overflow-y-auto border border-gray-200">
                  <p className="text-xs font-mono text-gray-700 break-all">
                    <strong>Error:</strong> {this.state.error.message}
                  </p>
                  {this.state.errorInfo?.componentStack && (
                    <p className="text-xs font-mono text-gray-600 mt-2 mt-2 break-all">
                      <strong>Component Stack:</strong>
                      <br />
                      {this.state.errorInfo.componentStack}
                    </p>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3">
                <button
                  onClick={this.handleReset}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  aria-label="Try again"
                >
                  <RefreshCw className="w-4 h-4" />
                  Try Again
                </button>

                <button
                  onClick={this.handleReload}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-200 text-gray-900 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                  aria-label="Reload page"
                >
                  <RefreshCw className="w-4 h-4" />
                  Reload Page
                </button>
              </div>

              {/* Support Info */}
              <p className="text-xs text-gray-500 text-center mt-6">
                If the problem persists, please contact support with error ID:{' '}
                <code className="font-mono bg-gray-100 px-2 py-1 rounded">
                  {this.state.error.message.substring(0, 8).toUpperCase()}
                </code>
              </p>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children as ReactElement;
  }
}
