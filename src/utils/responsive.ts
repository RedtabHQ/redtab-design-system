/**
 * Standard Tailwind-compatible breakpoint values in pixels.
 */
export const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  '2xl': 1536,
} as const;

/**
 * Returns a CSS media query string for the given breakpoint.
 * Example: `mediaQuery('md')` → `'(min-width: 768px)'`
 */
export function mediaQuery(breakpoint: keyof typeof breakpoints): string {
  return `(min-width: ${breakpoints[breakpoint]}px)`;
}

/**
 * Returns `true` when the current viewport matches the given breakpoint's
 * minimum width. SSR-safe: always returns `false` when `window` is unavailable.
 */
export function isBreakpoint(breakpoint: keyof typeof breakpoints): boolean {
  if (typeof window === 'undefined') return false;
  return window.matchMedia(mediaQuery(breakpoint)).matches;
}
