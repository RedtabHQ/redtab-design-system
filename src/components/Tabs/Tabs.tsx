import {
  forwardRef,
  useRef,
  useState,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import { cn } from '../../utils/cn';

export interface TabItem {
  id: string;
  label: string;
  content: ReactNode;
}

export interface TabsProps extends HTMLAttributes<HTMLDivElement> {
  tabs: TabItem[];
  defaultTab?: string;
  onTabChange?: (id: string) => void;
}

export const Tabs = forwardRef<HTMLDivElement, TabsProps>(
  ({ tabs, defaultTab, onTabChange, className, ...props }, ref) => {
    const [activeTab, setActiveTab] = useState<string>(defaultTab ?? tabs[0]?.id ?? '');
    const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

    const handleSelect = (id: string) => {
      setActiveTab(id);
      onTabChange?.(id);
    };

    const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
      let nextIndex: number | null = null;

      if (e.key === 'ArrowRight') {
        nextIndex = (index + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft') {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else if (e.key === 'Home') {
        nextIndex = 0;
      } else if (e.key === 'End') {
        nextIndex = tabs.length - 1;
      }

      if (nextIndex !== null) {
        e.preventDefault();
        const nextTab = tabs[nextIndex];
        // Guard required by noUncheckedIndexedAccess
        if (nextTab) {
          handleSelect(nextTab.id);
          tabRefs.current[nextIndex]?.focus();
        }
      }
    };

    const activeItem = tabs.find((t) => t.id === activeTab);

    return (
      <div ref={ref} className={cn('flex flex-col', className)} {...props}>
        {/* Tab list */}
        <div role="tablist" aria-label="Tabs" className="flex border-b border-neutral-200">
          {tabs.map((tab, index) => {
            const isActive = tab.id === activeTab;
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[index] = el;
                }}
                type="button"
                role="tab"
                id={`tab-${tab.id}`}
                aria-selected={isActive}
                aria-controls={`tabpanel-${tab.id}`}
                tabIndex={isActive ? 0 : -1}
                onClick={() => handleSelect(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                className={cn(
                  'relative px-4 py-2.5 text-sm font-medium transition-colors',
                  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-inset',
                  isActive
                    ? 'text-primary-600 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary-500'
                    : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50',
                )}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Tab panels — render all, show only the active one via hidden */}
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`tabpanel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            hidden={tab.id !== activeTab}
            tabIndex={0}
            className="pt-4 text-sm text-neutral-700 focus-visible:outline-none"
          >
            {tab.id === activeTab ? activeItem?.content : null}
          </div>
        ))}
      </div>
    );
  },
);

Tabs.displayName = 'Tabs';
