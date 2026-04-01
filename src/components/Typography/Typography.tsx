import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

type HeadingLevel = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

const headingStyles: Record<HeadingLevel, string> = {
  h1: 'text-6xl font-bold leading-tight',
  h2: 'text-5xl font-bold leading-tight',
  h3: 'text-4xl font-bold leading-tight',
  h4: 'text-3xl font-semibold leading-tight',
  h5: 'text-2xl font-semibold leading-tight',
  h6: 'text-xl font-semibold leading-tight',
};

export interface HeadingProps extends HTMLAttributes<HTMLHeadingElement> {
  level?: HeadingLevel;
  as?: HeadingLevel;
}

export const Heading = forwardRef<HTMLHeadingElement, HeadingProps>(
  ({ className, level = 'h2', as, children, ...props }, ref) => {
    const Tag = as || level;

    return (
      <Tag ref={ref} className={cn(headingStyles[level], 'text-neutral-900', className)} {...props}>
        {children}
      </Tag>
    );
  },
);

Heading.displayName = 'Heading';

export interface TextProps extends HTMLAttributes<HTMLParagraphElement> {
  variant?: 'body' | 'caption';
  as?: 'p' | 'span' | 'div';
}

export const Text = forwardRef<HTMLParagraphElement, TextProps>(
  ({ className, variant = 'body', as: Tag = 'p', children, ...props }, ref) => {
    const styles = {
      body: 'text-base font-normal leading-normal',
      caption: 'text-sm font-normal leading-normal',
    };

    return (
      <Tag ref={ref} className={cn(styles[variant], 'text-neutral-700', className)} {...props}>
        {children}
      </Tag>
    );
  },
);

Text.displayName = 'Text';
