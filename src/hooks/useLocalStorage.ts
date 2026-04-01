import { useState, useEffect, useCallback } from 'react';

/**
 * Persists state in `localStorage` with automatic JSON serialization.
 *
 * - Reads the stored value on mount (falls back to `initialValue` on parse error or missing key).
 * - Writes to `localStorage` whenever the value changes.
 * - Listens for `storage` events so changes from other tabs are reflected.
 * - SSR-safe: falls back to `initialValue` when `window` is undefined.
 *
 * @example
 * ```tsx
 * const [theme, setTheme] = useLocalStorage<'light' | 'dark'>('theme', 'light');
 * setTheme('dark');
 * setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((val: T) => T)) => void] {
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item !== null ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const [storedValue, setStoredValue] = useState<T>(readValue);

  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;

        setStoredValue(valueToStore);

        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch {
        // Silently fail on localStorage quota or serialization errors
      }
    },
    [key, storedValue]
  );

  // Sync with changes from other tabs / windows
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (event: StorageEvent) => {
      if (event.key !== key) {
        return;
      }

      try {
        const newValue =
          event.newValue !== null
            ? (JSON.parse(event.newValue) as T)
            : initialValue;
        setStoredValue(newValue);
      } catch {
        setStoredValue(initialValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, initialValue]);

  return [storedValue, setValue];
}
