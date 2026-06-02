import React, { ErrorInfo, ReactNode } from 'react';
import { AlertTriangle } from 'lucide-react';

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

/**
 * ErrorBoundary - Catches React component errors and displays fallback UI
 * Prevents entire app crash when a component throws an error
 */
export class ErrorBoundary extends React.Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return {
      hasError: true,
      error,
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error to console
    console.error('ErrorBoundary caught:', error, errorInfo);

    // Generate error ID for support reference
    const errorId = `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    console.error(`Error ID: ${errorId}`);

    // Call custom error handler if provided
    this.props.onError?.(error, errorInfo);
  }

  private getErrorId(): string {
    return `ERR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    });
  };

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      const errorId = this.getErrorId();
      const isDevelopment = import.meta.env.DEV;

      return (
        this.props.fallback || (
          <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white rounded-3xl border border-gray-100 shadow-lg p-8 max-w-md w-full">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 mx-auto mb-4">
                <AlertTriangle size={24} className="text-red-600" />
              </div>

              <h1 className="text-lg font-bold text-gray-900 text-center mb-2">
                Something went wrong
              </h1>

              <p className="text-sm text-gray-600 text-center mb-4">
                An unexpected error occurred. Our team has been notified. You can try refreshing the page or contact support for assistance.
              </p>

              {/* Error ID for support reference */}
              <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="text-xs+ font-medium text-gray-500 uppercase tracking-widest mb-1">
                  Error Reference ID
                </p>
                <p className="text-xs font-mono text-gray-700 break-all">
                  {errorId}
                </p>
              </div>

              {this.state.error && (
                <details className="mb-6">
                  <summary className="cursor-pointer text-xs font-semibold text-gray-500 uppercase tracking-widest hover:text-gray-700">
                    Error details {isDevelopment && '(Dev only)'}
                  </summary>
                  <pre className="mt-3 p-3 bg-gray-50 rounded-lg text-2xs text-gray-700 overflow-auto max-h-48 border border-gray-100 font-mono">
                    {`${this.state.error.name}: ${this.state.error.message}\n\n${this.state.error.stack || ''}`}
                  </pre>
                </details>
              )}

              <div className="flex gap-2">
                <button
                  onClick={this.handleReset}
                  className="flex-1 px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-colors"
                >
                  Try again
                </button>
                <button
                  onClick={this.handleReload}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-xl text-sm font-bold hover:bg-gray-300 transition-colors"
                >
                  Refresh page
                </button>
              </div>

              <a
                href={`mailto:support@redtab.xyz?subject=Error%20Report&body=Error%20ID:%20${errorId}`}
                className="block mt-3 text-center px-4 py-2 text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                Contact support →
              </a>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}

/**
 * Functional component wrapper for ErrorBoundary
 * For use with Suspense and other functional patterns
 */
interface ErrorBoundaryWrapperProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export const withErrorBoundary = <P extends object>(
  Component: React.ComponentType<P>,
  errorBoundaryProps?: Omit<ErrorBoundaryProps, 'children'>
) => {
  return (props: P) => (
    <ErrorBoundary {...errorBoundaryProps}>
      <Component {...props} />
    </ErrorBoundary>
  );
};
