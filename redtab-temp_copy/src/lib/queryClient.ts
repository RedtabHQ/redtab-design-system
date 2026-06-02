import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';

/**
 * Type guard to check if an error has an HTTP response with status
 */
interface HttpError {
  response?: {
    status?: number;
  };
}

function isHttpError(error: unknown): error is HttpError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as HttpError).response === 'object'
  );
}

/**
 * Get HTTP status code from an error if available
 */
function getErrorStatus(error: unknown): number | undefined {
  if (isHttpError(error)) {
    return error.response?.status;
  }
  return undefined;
}

/**
 * Global React Query client configuration
 *
 * Features:
 * - Automatic caching with 5-minute stale time
 * - Smart retry logic (don't retry 4xx errors, retry 5xx and network errors)
 * - Exponential backoff for retries (1s, 2s, 4s, up to 30s)
 * - Global error handling for all queries and mutations
 * - Automatic refetch on network reconnection
 * - No refetch on window focus (prevents unnecessary requests)
 *
 * @example Integration with notification system:
 * ```typescript
 * // In onError handlers, you can integrate with your notification store:
 * import { useNotificationStore } from '@stores';
 *
 * onError: (error) => {
 *   const notificationStore = useNotificationStore.getState();
 *   notificationStore.addNotification({
 *     type: 'DANGER',
 *     title: 'Operation failed',
 *     message: error instanceof Error ? error.message : 'Unknown error'
 *   });
 * }
 * ```
 */
export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: unknown) => {
      if (import.meta.env.DEV) {
        console.error('[React Query] Query error:', error);
      }
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: unknown) => {
      if (import.meta.env.DEV) {
        console.error('[React Query] Mutation error:', error);
      }
    },
  }),
  defaultOptions: {
    queries: {
      // Data freshness and caching
      staleTime: 5 * 60 * 1000, // Data is fresh for 5 minutes
      gcTime: 10 * 60 * 1000, // Unused data is garbage collected after 10 minutes

      /**
       * Smart retry logic - don't waste time retrying client errors
       *
       * - 4xx errors (400-499): Client errors, don't retry
       *   - 400 Bad Request: Invalid request data
       *   - 401 Unauthorized: Auth token expired/invalid
       *   - 403 Forbidden: Insufficient permissions
       *   - 404 Not Found: Resource doesn't exist
       * - 5xx errors (500-599): Server errors, retry up to 3 times
       * - Network errors: Retry up to 3 times
       */
      retry: (failureCount, error) => {
        const status = getErrorStatus(error);

        // Don't retry client errors (4xx)
        if (status && status >= 400 && status < 500) {
          return false;
        }

        // Retry up to 3 times for server/network errors
        return failureCount < 3;
      },

      // Exponential backoff: 1s, 2s, 4s, 8s, up to max 30s
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),

      // Refetch behavior
      refetchOnWindowFocus: false, // Don't refetch when tab regains focus
      refetchOnReconnect: true, // Refetch when internet reconnects

    },
    mutations: {
      /**
       * Mutation retry logic - retry once for network failures only
       *
       * Mutations are more critical than queries because they change data.
       * We retry once for network failures, but never for client errors.
       */
      retry: (failureCount, error) => {
        const status = getErrorStatus(error);

        // Don't retry client errors (4xx)
        if (status && status >= 400 && status < 500) {
          return false;
        }

        // Retry once for server/network errors
        return failureCount < 1;
      },

      retryDelay: 1000,

    },
  },
});
