import { forwardRef, useState, type ReactNode } from 'react';
import { cn } from '../../utils/cn';

export interface AccordionItemProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  disabled?: boolean;
}

export interface AccordionProps {
  children: ReactNode;
  className?: string;
}

export function Accordion({ children, className }: AccordionProps) {
  return <div className={cn('space-y-2 rounded-md border border-neutral-200 bg-neutral-0 p-1', className)}>{children}</div>;
}

const AccordionItem = forwardRef<HTMLDivElement, AccordionItemProps>(
  ({ title, children, defaultOpen = false, disabled = false }, ref) => {
    const [open, setOpen] = useState(defaultOpen);

    return (
      <div ref={ref} className="overflow-hidden rounded-md bg-neutral-0">
        <button
          type="button"
          disabled={disabled}
          aria-expanded={open}
          onClick={() => setOpen((current) => !current)}
          className={cn(
            'flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium transition-colors',
            disabled
              ? 'cursor-not-allowed text-neutral-400'
              : 'cursor-pointer text-neutral-900 hover:bg-neutral-100',
          )}
        >
          <span>{title}</span>
          <span className="text-neutral-500">{open ? '−' : '+'}</span>
        </button>
        {open ? <div className="border-t border-neutral-200 px-4 py-3 text-sm text-neutral-700">{children}</div> : null}
      </div>
    );
  },
);

AccordionItem.displayName = 'AccordionItem';

export { AccordionItem };
