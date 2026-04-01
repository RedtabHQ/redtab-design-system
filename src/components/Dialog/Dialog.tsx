import {
  forwardRef,
  useEffect,
  useRef,
  type HTMLAttributes,
  type MouseEvent,
  type ReactNode,
} from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const dialogVariants = cva(
  'relative rounded-lg border border-neutral-200 bg-neutral-0 shadow-lg text-neutral-900 p-0 backdrop:bg-neutral-900/50 backdrop:backdrop-blur-sm open:flex open:flex-col',
  {
    variants: {
      size: {
        sm: 'w-full max-w-sm',
        md: 'w-full max-w-md',
        lg: 'w-full max-w-lg',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
);

export interface DialogProps extends VariantProps<typeof dialogVariants> {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  className?: string;
}

export const Dialog = forwardRef<HTMLDialogElement, DialogProps>(
  ({ open, onClose, title, children, size, className }, _ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);

    useEffect(() => {
      const el = dialogRef.current;
      if (!el) return;
      if (open && !el.open) {
        el.showModal();
      } else if (!open && el.open) {
        el.close();
      }
    }, [open]);

    useEffect(() => {
      const el = dialogRef.current;
      if (!el) return;
      const handleClose = (): void => { onClose(); };
      el.addEventListener('close', handleClose);
      return () => { el.removeEventListener('close', handleClose); };
    }, [onClose]);

    const handleBackdropClick = (e: MouseEvent<HTMLDialogElement>): void => {
      const el = dialogRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const isOutside =
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom;
      if (isOutside) onClose();
    };

    return (
      <dialog
        ref={dialogRef}
        className={cn(dialogVariants({ size }), className)}
        onClick={handleBackdropClick}
        aria-labelledby={title ? 'dialog-title' : undefined}
      >
        {children}
      </dialog>
    );
  },
);

Dialog.displayName = 'Dialog';

// ── Sub-components ───────────────────────────────────────────────────────────

export interface DialogTitleProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogTitle = forwardRef<HTMLDivElement, DialogTitleProps>(
  ({ className, children, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-between border-b border-neutral-200 px-6 py-4',
        className,
      )}
      {...props}
    >
      <h2 id="dialog-title" className="text-lg font-semibold text-neutral-900">
        {children}
      </h2>
    </div>
  ),
);

DialogTitle.displayName = 'DialogTitle';

export interface DialogContentProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogContent = forwardRef<HTMLDivElement, DialogContentProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn('flex-1 px-6 py-4 text-sm text-neutral-700', className)}
      {...props}
    />
  ),
);

DialogContent.displayName = 'DialogContent';

export interface DialogFooterProps extends HTMLAttributes<HTMLDivElement> {}

export const DialogFooter = forwardRef<HTMLDivElement, DialogFooterProps>(
  ({ className, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center justify-end gap-2 border-t border-neutral-200 px-6 py-4',
        className,
      )}
      {...props}
    />
  ),
);

DialogFooter.displayName = 'DialogFooter';

export { dialogVariants };
