import { useState, useEffect, useCallback } from 'react';
import { safeStorage } from './storage';

/**
 * A hook that provides a persistent state synchronized with localStorage.
 * 
 * @param key - The localStorage key to store the value under
 * @param initialValue - The initial value to use if no value exists in storage
 * @returns A tuple of [value, setValue, removeValue] where:
 *   - value: The current value (from localStorage or initialValue)
 *   - setValue: Function to update the value in state and localStorage
 *   - removeValue: Function to remove the value from state and localStorage
 * 
 * @example
 * ```typescript
 * const [theme, setTheme] = useLocalStorage('theme', 'light');
 * ```
 * 
 * @example
 * ```typescript
 * const [user, setUser, removeUser] = useLocalStorage<User | null>('user', null);
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T | (() => T)
): [T, (value: T | ((val: T) => T)) => void, () => void] {
  // Initialize state with initialValue or value from localStorage
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = safeStorage.getItem(key);
      if (item !== null) {
        return JSON.parse(item) as T;
      }
      return typeof initialValue === 'function' 
        ? (initialValue as () => T)() 
        : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return typeof initialValue === 'function' 
        ? (initialValue as () => T)() 
        : initialValue;
    }
  });

  // Listen for storage events from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          const newValue = JSON.parse(e.newValue) as T;
          setStoredValue(newValue);
        } catch (error) {
          console.warn(`Error parsing storage change for key "${key}":`, error);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [key]);

  // Update localStorage when state changes
  const setValue = useCallback((value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      safeStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Remove value from localStorage and reset to initial value
  const removeValue = useCallback(() => {
    try {
      safeStorage.removeItem(key);
      const initialValueToUse = typeof initialValue === 'function' 
        ? (initialValue as () => T)() 
        : initialValue;
      setStoredValue(initialValueToUse);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}