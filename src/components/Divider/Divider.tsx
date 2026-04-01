import { forwardRef, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const dividerVariants = cva('shrink-0 bg-neutral-200', {
  variants: {
    orientation: {
      horizontal: 'h-px w-full',
      vertical: 'h-full w-px',
    },
    spacing: {
      none: '',
      sm: '',
      md: '',
      lg: '',
    },
  },
  compoundVariants: [
    { orientation: 'horizontal', spacing: 'sm', className: 'my-2' },
    { orientation: 'horizontal', spacing: 'md', className: 'my-4' },
    { orientation: 'horizontal', spacing: 'lg', className: 'my-6' },
    { orientation: 'vertical', spacing: 'sm', className: 'mx-2' },
    { orientation: 'vertical', spacing: 'md', className: 'mx-4' },
    { orientation: 'vertical', spacing: 'lg', className: 'mx-6' },
  ],
  defaultVariants: {
    orientation: 'horizontal',
    spacing: 'md',
  },
});

export interface DividerProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dividerVariants> {}

export const Divider = forwardRef<HTMLDivElement, DividerProps>(
  ({ className, orientation, spacing, ...props }, ref) => {
    return (
      <div
        ref={ref}
        role="separator"
        aria-orientation={orientation || 'horizontal'}
        className={cn(dividerVariants({ orientation, spacing, className }))}
        {...props}
      />
    );
  },
);

Divider.displayName = 'Divider';

export { dividerVariants };
