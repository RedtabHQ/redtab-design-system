import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Utility function to merge class names with Tailwind conflict resolution.
 * Uses clsx for conditional/array/object class inputs, and tailwind-merge
 * to resolve conflicting Tailwind classes (last definition wins).
 *
 * @param inputs - Class values (strings, conditionals, arrays, objects)
 * @returns Merged class name string with conflicts resolved
 *
 * @example
 * cn('text-lg', isActive && 'text-blue-500', 'font-bold')
 * // => 'text-lg text-blue-500 font-bold' (if isActive is true)
 * // => 'text-lg font-bold' (if isActive is false)
 *
 * cn('text-red-500', 'text-blue-500')
 * // => 'text-blue-500' (conflict resolved, last wins)
 */
export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}