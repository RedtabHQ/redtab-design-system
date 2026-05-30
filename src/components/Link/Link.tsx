import { forwardRef, type AnchorHTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const linkVariants = cva(
  'inline-flex items-center gap-1 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2',
  {
    variants: {
      variant: {
        primary: 'text-primary-600 hover:text-primary-700',
        secondary: 'text-neutral-700 hover:text-neutral-900',
        subtle: 'text-neutral-500 hover:text-neutral-700',
      },
      underline: {
        true: 'underline',
        false: 'no-underline',
      },
    },
    defaultVariants: {
      variant: 'primary',
      underline: true,
    },
  },
);

export interface LinkProps
  extends AnchorHTMLAttributes<HTMLAnchorElement>,
    VariantProps<typeof linkVariants> {}

export const Link = forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, variant, underline, children, ...props }, ref) => (
    <a ref={ref} className={cn(linkVariants({ variant, underline, className }))} {...props}>
      {children}
    </a>
  ),
);

Link.displayName = 'Link';

export { linkVariants };
