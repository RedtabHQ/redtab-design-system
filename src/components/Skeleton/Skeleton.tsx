import { type HTMLAttributes } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../utils/cn';

const skeletonVariants = cva('animate-pulse bg-neutral-200', {
  variants: {
    variant: {
      text: 'h-4 rounded',
      circular: 'rounded-full',
      rectangular: 'rounded-md',
    },
  },
  defaultVariants: {
    variant: 'text',
  },
});

export interface SkeletonProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof skeletonVariants> {
  width?: string | number;
  height?: string | number;
}

export function Skeleton({ className, variant, width, height, style, ...props }: SkeletonProps) {
  return (
    <div
      className={cn(skeletonVariants({ variant, className }))}
      style={{ width, height, ...style }}
      {...props}
    />
  );
}
