import React, { useState, useRef, useCallback, useEffect } from 'react';
import { createPortal } from 'react-dom';

interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  delay?: number;
}

const GAP = 8;
const PADDING = 8;
const ARROW_SIZE = 4;

/**
 * Get arrow position classes based on tooltip position
 */
const getArrowClasses = (position: 'top' | 'bottom' | 'left' | 'right'): string => {
  const baseClasses = 'absolute w-2 h-2 bg-gray-900 transform rotate-45';
  const positionClasses: Record<string, string> = {
    'top': 'bottom-[-4px] left-1/2 -translate-x-1/2',
    'bottom': 'top-[-4px] left-1/2 -translate-x-1/2',
    'left': 'right-[-4px] top-1/2 -translate-y-1/2',
    'right': 'left-[-4px] top-1/2 -translate-y-1/2',
  };
  return `${baseClasses} ${positionClasses[position]}`;
};

/**
 * Get or create tooltip portal container
 */
const getTooltipContainer = (): HTMLElement => {
  let container = document.getElementById('tooltip-portal-root');
  if (!container) {
    container = document.createElement('div');
    container.id = 'tooltip-portal-root';
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }
  return container;
};

/**
 * Calculate tooltip position with viewport bounds checking
 */
const calculatePosition = (
  triggerRect: DOMRect,
  position: 'top' | 'bottom' | 'left' | 'right',
  tooltipWidth: number,
  tooltipHeight: number
): { top: number; left: number } => {
  let top = 0;
  let left = 0;

  // Calculate relative to viewport first
  switch (position) {
    case 'top':
      top = triggerRect.top - tooltipHeight - GAP;
      left = triggerRect.left + (triggerRect.width - tooltipWidth) / 2;
      break;
    case 'bottom':
      top = triggerRect.bottom + GAP;
      left = triggerRect.left + (triggerRect.width - tooltipWidth) / 2;
      break;
    case 'left':
      top = triggerRect.top + (triggerRect.height - tooltipHeight) / 2;
      left = triggerRect.left - tooltipWidth - GAP;
      break;
    case 'right':
      top = triggerRect.top + (triggerRect.height - tooltipHeight) / 2;
      left = triggerRect.right + GAP;
      break;
  }

  // Clamp to viewport bounds (left/right)
  const minLeft = PADDING;
  const maxLeft = window.innerWidth - tooltipWidth - PADDING;
  left = Math.max(minLeft, Math.min(maxLeft, left));

  // Clamp to viewport bounds (top)
  const minTop = PADDING;
  const maxTop = window.innerHeight - tooltipHeight - PADDING;
  top = Math.max(minTop, Math.min(maxTop, top));

  return { top, left };
};

/**
 * Tooltip component using Portal to avoid overflow issues
 * Renders tooltip content outside of scrollable containers
 */
export const Tooltip: React.FC<TooltipProps> = ({
  content,
  children,
  position = 'top',
  delay = 200,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [coords, setCoords] = useState({ top: 0, left: 0 });
  const triggerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const updatePosition = useCallback(() => {
    if (!triggerRef.current || !isVisible) return;

    const triggerRect = triggerRef.current.getBoundingClientRect();
    const tooltipWidth = tooltipRef.current?.offsetWidth ?? 200;
    const tooltipHeight = tooltipRef.current?.offsetHeight ?? 32;

    const newCoords = calculatePosition(
      triggerRect,
      position,
      tooltipWidth,
      tooltipHeight
    );

    setCoords(newCoords);
  }, [position, isVisible]);

  const handleMouseEnter = useCallback(() => {
    if (!triggerRef.current) return;

    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, delay);
  }, [delay]);

  const handleMouseLeave = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsVisible(false);
  }, []);

  // Update position when tooltip becomes visible or on scroll/resize
  useEffect(() => {
    if (!isVisible) return;

    // Initial position update
    updatePosition();

    const handleScroll = () => updatePosition();
    const handleResize = () => updatePosition();

    window.addEventListener('scroll', handleScroll, true);
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('scroll', handleScroll, true);
      window.removeEventListener('resize', handleResize);
    };
  }, [isVisible, updatePosition]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <>
      <div
        ref={triggerRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className='relative'
      >
        {children}
      </div>

      {isVisible &&
        createPortal(
          <div
            ref={tooltipRef}
            className="fixed px-3 py-2 text-xs font-semibold text-white bg-gray-900 rounded-md shadow-lg pointer-events-auto"
            style={{
              top: `${coords.top}px`,
              left: `${coords.left}px`,
            }}
          >
            {content}
            <div className={getArrowClasses(position)} />
          </div>,
          getTooltipContainer()
        )}
    </>
  );
};
