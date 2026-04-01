import { forwardRef, useCallback, useEffect, useRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  helperText?: string;
  autoExpand?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, helperText, autoExpand = false, id, onChange, ...props }, ref) => {
    const innerRef = useRef<HTMLTextAreaElement>(null);

    // Merge refs
    const setRef = (node: HTMLTextAreaElement | null) => {
      (innerRef as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      if (typeof ref === 'function') {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<HTMLTextAreaElement | null>).current = node;
      }
    };

    const adjustHeight = useCallback((el: HTMLTextAreaElement) => {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }, []);

    // Adjust on mount if autoExpand and initial value is set
    useEffect(() => {
      if (autoExpand && innerRef.current) {
        adjustHeight(innerRef.current);
      }
    }, [autoExpand, adjustHeight]);

    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={textareaId} className="text-sm font-medium text-neutral-700">
            {label}
          </label>
        )}
        <textarea
          ref={setRef}
          id={textareaId}
          rows={3}
          className={cn(
            'min-h-[80px] w-full rounded-md border border-neutral-300 bg-neutral-0 px-3 py-2 text-sm text-neutral-900 placeholder:text-neutral-400 transition-colors',
            'focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-500/20',
            'disabled:cursor-not-allowed disabled:opacity-50',
            autoExpand && 'resize-none overflow-hidden',
            error && 'border-error-500 focus:border-error-500 focus:ring-error-500/20',
            className,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={
            error ? `${textareaId}-error` : helperText ? `${textareaId}-helper` : undefined
          }
          onChange={(e) => {
            if (autoExpand) {
              adjustHeight(e.currentTarget);
            }
            onChange?.(e);
          }}
          {...props}
        />
        {error && (
          <p id={`${textareaId}-error`} className="text-xs text-error-500" role="alert">
            {error}
          </p>
        )}
        {helperText && !error && (
          <p id={`${textareaId}-helper`} className="text-xs text-neutral-500">
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

Textarea.displayName = 'Textarea';
