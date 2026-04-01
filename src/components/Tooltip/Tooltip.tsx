import { forwardRef, useState, type HTMLAttributes, type ReactNode } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const tooltipVariants = cva(
  'absolute z-50 px-2.5 py-1.5 text-xs font-medium text-neutral-0 bg-neutral-800 rounded-md shadow-md whitespace-nowrap pointer-events-none',
  {
    variants: {
      position: {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2',
      },
    },
    defaultVariants: {
      position: 'top',
    },
  },
);

export interface TooltipProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tooltipVariants> {
  content: string;
  children: ReactNode;
}

export const Tooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ content, children, position = 'top', className, ...props }, ref) => {
    const [visible, setVisible] = useState(false);

    return (
      <div
        ref={ref}
        className={cn('relative inline-flex', className)}
        onMouseEnter={() => setVisible(true)}
        onMouseLeave={() => setVisible(false)}
        onFocus={() => setVisible(true)}
        onBlur={() => setVisible(false)}
        {...props}
      >
        {children}
        {visible && (
          <div role="tooltip" className={cn(tooltipVariants({ position }))}>
            {content}
          </div>
        )}
      </div>
    );
  },
);

Tooltip.displayName = 'Tooltip';

export { tooltipVariants };
