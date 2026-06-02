/**
 * Currency constants for the RPL application
 */

/**
 * Default currency for global/HQ view (when no market segment selected)
 */
export const DEFAULT_GLOBAL_CURRENCY = 'USD';

/**
 * Default currency symbol for global/HQ view
 */
export const DEFAULT_GLOBAL_CURRENCY_SYMBOL = '$';

/**
 * Locale for currency formatting (Vietnamese locale uses spaces as thousand separators)
 */
export const DEFAULT_CURRENCY_LOCALE = 'vi-VN';

/**
 * Threshold for abbreviated currency display (e.g., 1.2k instead of 1200)
 */
export const CURRENCY_ABBREVIATION_THRESHOLD = 1000;

/**
 * Threshold for compact currency display (e.g., 1.2M instead of 1200000)
 */
export const CURRENCY_COMPACT_THRESHOLD = 1000000;

/**
 * Mapping of ISO 4217 currency codes to symbols
 * Used to display correct currency symbols when currency data comes from contracts/transactions
 * instead of market segment context
 */
export const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: '$',
  EUR: '€',
  INR: '₹',
  NPR: '₨',
  GBP: '£',
  THB: '฿',
  VND: '₫',
};

/**
 * Get currency symbol for a given currency code
 * Falls back to currency code itself if no symbol mapping exists
 */
export function getCurrencySymbol(currencyCode?: string): string {
  if (!currencyCode) return DEFAULT_GLOBAL_CURRENCY_SYMBOL;
  return CURRENCY_SYMBOLS[currencyCode] || currencyCode;
}
