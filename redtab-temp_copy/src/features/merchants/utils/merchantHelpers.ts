import type { Merchant } from '@/types';

/**
 * Extract category name from merchant or supplier, handling both string and object formats
 * Supports any object with a 'name' property or plain strings
 * @param category - Can be a string or object with { name: string }
 * @returns Category name or undefined
 */
export const getCategoryName = (category: Merchant['category'] | string | { name: string } | undefined): string | undefined => {
  if (typeof category === 'string') {
    return category;
  }
  if (category && typeof category === 'object' && 'name' in category) {
    return (category as { name: string }).name;
  }
  return undefined;
};
