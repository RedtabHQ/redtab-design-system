export { Spinner, type SpinnerProps } from '@redtabhq/design-system';

type SpinnerSize = 'sm' | 'md' | 'lg' | 'xl';
type SpinnerVariant = 'primary' | 'secondary' | 'white';

const sizeClasses: Record<SpinnerSize, string> = {
  sm: 'w-3 h-3 border',
  md: 'w-4 h-4 border-2',
  lg: 'w-5 h-5 border-2',
  xl: 'w-6 h-6 border-2',
};

const variantClasses: Record<SpinnerVariant, string> = {
  primary: 'border-redtab border-t-transparent',
  secondary: 'border-gray-500 border-t-transparent',
  white: 'border-white border-t-transparent',
};

interface InlineSpinnerProps {
  size?: SpinnerSize;
  variant?: SpinnerVariant;
  className?: string;
}

export function InlineSpinner({ size = 'md', variant = 'white', className = '' }: InlineSpinnerProps) {
  return (
    <div
      className={`inline-block rounded-full animate-spin ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      aria-label="Loading"
    />
  );
}
