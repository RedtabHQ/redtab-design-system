import { useEffect } from 'react';
import type { RefObject } from 'react';

/**
 * Detects clicks (mousedown) and touches (touchstart) outside a referenced element
 * and invokes the provided handler.
 *
 * @example
 * ```tsx
 * const dropdownRef = useRef<HTMLDivElement>(null);
 * useClickOutside(dropdownRef, () => setIsOpen(false));
 * ```
 */
export function useClickOutside<T extends HTMLElement>(
  ref: RefObject<T | null>,
  handler: () => void
): void {
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      const target = event.target;

      // Do nothing if the ref is not attached or the click is inside the element
      if (!ref.current || !(target instanceof Node)) {
        return;
      }

      if (ref.current.contains(target)) {
        return;
      }

      handler();
    };

    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);

    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [ref, handler]);
}
