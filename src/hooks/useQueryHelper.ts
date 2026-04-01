import { useState, useCallback } from 'react';

// ---------------------------------------------------------------------------
// Query Key Factory
// ---------------------------------------------------------------------------

/**
 * Creates a consistent query key factory for a given resource.
 *
 * Designed to integrate with **TanStack Query v5** query key conventions.
 * Each method returns a `readonly` tuple suitable for `queryKey` in
 * `useQuery` / `useMutation`.
 *
 * @example
 * ```tsx
 * const userKeys = createQueryKey('users');
 *
 * userKeys.all;              // ['users']
 * userKeys.lists();          // ['users', 'list']
 * userKeys.list('active');   // ['users', 'list', { filters: 'active' }]
 * userKeys.details();        // ['users', 'detail']
 * userKeys.detail('123');    // ['users', 'detail', '123']
 * ```
 */
export function createQueryKey<TResource extends string>(resource: TResource) {
  const all = [resource] as const;

  return {
    /** Base key for the entire resource */
    all,

    /** Key for list queries */
    lists: () => [...all, 'list'] as const,

    /** Key for a filtered list query */
    list: (filters: string) =>
      [...all, 'list', { filters }] as const,

    /** Key prefix for all detail queries */
    details: () => [...all, 'detail'] as const,

    /** Key for a single detail query by id */
    detail: (id: string) => [...all, 'detail', id] as const,
  };
}

// ---------------------------------------------------------------------------
// Query Config Type
// ---------------------------------------------------------------------------

/**
 * Configuration type for query hooks, modeled after common TanStack Query options.
 *
 * Use this as a base config when building custom query hooks that wrap
 * `useQuery` from **TanStack Query v5**.
 *
 * @example
 * ```tsx
 * function useUsers(config?: Partial<QueryConfig<User[]>>) {
 *   return useQuery({
 *     queryKey: userKeys.lists(),
 *     queryFn: () => fetchUsers(),
 *     ...config,
 *   });
 * }
 * ```
 */
export interface QueryConfig<TData> {
  /** The query key used by TanStack Query for caching and deduplication */
  queryKey: readonly unknown[];
  /** Whether the query is enabled. Set to `false` to disable automatic fetching. */
  enabled: boolean;
  /** Duration in milliseconds that data is considered fresh (TanStack Query `staleTime`) */
  staleTime: number;
  /** Whether to refetch when the browser window regains focus */
  refetchOnWindowFocus: boolean;
}

// ---------------------------------------------------------------------------
// Fetch State Hook
// ---------------------------------------------------------------------------

interface FetchState<T> {
  /** The fetched data, or `null` if not yet loaded */
  data: T | null;
  /** Error message if the fetch failed, or `null` */
  error: string | null;
  /** Whether a fetch is currently in progress */
  isLoading: boolean;
}

interface UseFetchStateReturn<T> extends FetchState<T> {
  /** Set the data value (clears error and loading state) */
  setData: (data: T) => void;
  /** Set an error message (clears loading state, preserves existing data) */
  setError: (error: string) => void;
  /** Set the loading state */
  setLoading: (isLoading: boolean) => void;
  /** Reset to initial state */
  reset: () => void;
}

/**
 * Manages `{ data, error, isLoading }` state for async operations.
 *
 * This is a lightweight helper for managing fetch lifecycle states.
 * For production data fetching, prefer **TanStack Query** which provides
 * caching, deduplication, background refetching, and more.
 *
 * @example
 * ```tsx
 * const { data, error, isLoading, setData, setError, setLoading } =
 *   useFetchState<User[]>();
 *
 * useEffect(() => {
 *   setLoading(true);
 *   fetchUsers()
 *     .then(setData)
 *     .catch((err) => setError(err.message));
 * }, []);
 * ```
 */
export function useFetchState<T>(): UseFetchStateReturn<T> {
  const [state, setState] = useState<FetchState<T>>({
    data: null,
    error: null,
    isLoading: false,
  });

  const setData = useCallback((data: T) => {
    setState({ data, error: null, isLoading: false });
  }, []);

  const setError = useCallback((error: string) => {
    setState((prev) => ({ ...prev, error, isLoading: false }));
  }, []);

  const setLoading = useCallback((isLoading: boolean) => {
    setState((prev) => ({ ...prev, isLoading }));
  }, []);

  const reset = useCallback(() => {
    setState({ data: null, error: null, isLoading: false });
  }, []);

  return {
    ...state,
    setData,
    setError,
    setLoading,
    reset,
  };
}
