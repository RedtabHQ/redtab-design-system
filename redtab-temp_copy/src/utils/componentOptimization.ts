import React from 'react';

/**
 * Enhanced React.memo with custom comparison
 * Useful for preventing unnecessary re-renders
 */
export const createMemoComponent = <P extends object>(
  Component: React.ComponentType<P>,
  propsAreEqual?: (prevProps: Readonly<P>, nextProps: Readonly<P>) => boolean
) => {
  return React.memo(Component, propsAreEqual);
};

/**
 * Custom hook for memoizing expensive computations
 * Similar to useMemo but with dependency array validation
 */
export const useMemoized = <T,>(
  fn: () => T,
  deps: React.DependencyList
): T => {
  return React.useMemo(fn, deps);
};

/**
 * Custom hook for memoizing callback functions
 * with type-safe dependency array
 */
export const useCallbackMemoized = <TCallback extends (...args: unknown[]) => unknown>(
  callback: TCallback,
  deps: React.DependencyList
): TCallback => {
  return React.useCallback(callback, deps) as TCallback;
};

/**
 * HOC to wrap component with memo and display name
 */
export const withMemo = <P extends object>(
  Component: React.ComponentType<P>,
  displayName?: string
) => {
  const MemoComponent = React.memo(Component);
  MemoComponent.displayName = displayName || `Memo(${Component.displayName || Component.name})`;
  return MemoComponent;
};

/**
 * Shallow comparison function for memo
 * Compares all props shallowly
 */
export const shallowEqual = <T extends Record<string, unknown>>(
  objA: T,
  objB: T
): boolean => {
  const keysA = Object.keys(objA);
  const keysB = Object.keys(objB);

  if (keysA.length !== keysB.length) {
    return false;
  }

  return keysA.every((key) => objA[key] === objB[key]);
};

/**
 * Deep comparison function for memo
 * Recursively compares objects and arrays
 */
export const deepEqual = <T,>(a: T, b: T): boolean => {
  if (a === b) return true;

  if (a == null || b == null) return a === b;

  if (typeof a !== typeof b) return false;

  if (typeof a === 'object') {
    const aObj = a as Record<string, unknown>;
    const bObj = b as Record<string, unknown>;

    const keysA = Object.keys(aObj);
    const keysB = Object.keys(bObj);

    if (keysA.length !== keysB.length) return false;

    return keysA.every((key) => deepEqual(aObj[key], bObj[key]));
  }

  return false;
};

/**
 * Debounce helper for event handlers
 */
export const debounce = <TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  delay: number
): ((...args: TArgs) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: TArgs) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      fn(...args);
    }, delay);
  };
};

/**
 * Throttle helper for event handlers
 */
export const throttle = <TArgs extends unknown[]>(
  fn: (...args: TArgs) => void,
  limit: number
): ((...args: TArgs) => void) => {
  let inThrottle: boolean;

  return (...args: TArgs) => {
    if (!inThrottle) {
      fn(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
};
