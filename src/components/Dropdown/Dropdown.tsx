import {
  forwardRef,
  useEffect,
  useRef,
  useState,
  type ButtonHTMLAttributes,
  type HTMLAttributes,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';

// ── DropdownItem ─────────────────────────────────────────────────────────────

export interface DropdownItemProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const DropdownItem = forwardRef<HTMLButtonElement, DropdownItemProps>(
  ({ className, disabled, children, onClick, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className={cn(
        'w-full text-left px-3 py-2 text-sm text-neutral-700 rounded-md transition-colors',
        'hover:bg-neutral-100 active:bg-neutral-200',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset',
        'disabled:pointer-events-none disabled:opacity-50',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  ),
);

DropdownItem.displayName = 'DropdownItem';

// ── Dropdown ─────────────────────────────────────────────────────────────────

export interface DropdownProps extends HTMLAttributes<HTMLDivElement> {
  trigger: ReactNode;
  children: ReactNode;
  align?: 'left' | 'right';
}

export const Dropdown = forwardRef<HTMLDivElement, DropdownProps>(
  ({ trigger, children, align = 'left', className, ...props }, ref) => {
    const [open, setOpen] = useState(false);
    // Internal ref for outside-click detection — separate from the forwarded ref.
    const innerRef = useRef<HTMLDivElement>(null);

    // Close on outside click.
    useEffect(() => {
      if (!open) return;
      const handleClick = (e: MouseEvent) => {
        if (innerRef.current && !innerRef.current.contains(e.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener('mousedown', handleClick);
      return () => document.removeEventListener('mousedown', handleClick);
    }, [open]);

    // Close on Escape.
    useEffect(() => {
      if (!open) return;
      const handleKey = (e: KeyboardEvent) => {
        if (e.key === 'Escape') setOpen(false);
      };
      document.addEventListener('keydown', handleKey);
      return () => document.removeEventListener('keydown', handleKey);
    }, [open]);

    return (
      // innerRef is used for click-outside detection; the forwarded ref is
      // passed to a wrapper so callers can also access the element.
      <div ref={innerRef} className={cn('relative inline-block', className)}>
        <div ref={ref} {...props}>
          {/* Trigger wrapper */}
          <div
            onClick={() => setOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={open}
          >
            {trigger}
          </div>

          {/* Menu */}
          {open && (
            <div
              role="menu"
              aria-orientation="vertical"
              className={cn(
                'absolute z-50 mt-1 min-w-[10rem] rounded-lg border border-neutral-200 bg-neutral-0 p-1 shadow-lg',
                align === 'right' ? 'right-0' : 'left-0',
              )}
            >
              {children}
            </div>
          )}
        </div>
      </div>
    );
  },
);

Dropdown.displayName = 'Dropdown';
