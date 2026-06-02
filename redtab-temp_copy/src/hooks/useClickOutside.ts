import { useEffect, useRef, RefObject } from 'react';

/**
 * Custom hook to handle click-outside detection
 * Automatically closes/hides element when clicking outside of it
 * @param callback - Function to call when click occurs outside
 * @param isActive - Whether the hook should be active (default: true)
 */
export const useClickOutside = (
  callback: () => void,
  isActive: boolean = true
): RefObject<HTMLDivElement | null> => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (elementRef.current && !elementRef.current.contains(event.target as Node)) {
        callback();
      }
    };

    if (isActive) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isActive, callback]);

  return elementRef;
};
