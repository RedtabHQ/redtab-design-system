import { type ReactNode, type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const emptyStateVariants = cva('flex flex-col items-center text-center', {
  variants: {
    variant: {
      minimal: 'justify-center py-12',
      compact: 'justify-center py-8',
      'with-icon': 'justify-center gap-4 opacity-20',
    },
  },
  defaultVariants: { variant: 'minimal' },
});

export interface EmptyStateProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
}

export function EmptyState({ className, variant = 'minimal', title, description, icon, action, ...props }: EmptyStateProps) {
  if (variant === 'with-icon') {
    return (
      <div className={cn(emptyStateVariants({ variant, className }))} {...props}>
        {icon ? (
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
            {icon}
          </div>
        ) : (
          <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center">
            <span className="text-2xl">📊</span>
          </div>
        )}
        <p className="font-black text-xs uppercase tracking-widest text-neutral-800">{title}</p>
        {description && <p className="text-sm text-neutral-500">{description}</p>}
        {action && <div className="mt-2">{action}</div>}
      </div>
    );
  }

  return (
    <div className={cn(emptyStateVariants({ variant, className }))} {...props}>
      <p className="font-semibold text-neutral-500">{title}</p>
      {description && <p className="text-sm text-neutral-400 mt-1">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
