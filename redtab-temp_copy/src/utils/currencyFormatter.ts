/**
 * Currency formatting utilities using Intl.NumberFormat
 * Provides consistent currency formatting across the application
 */

import {
  DEFAULT_GLOBAL_CURRENCY,
  DEFAULT_GLOBAL_CURRENCY_SYMBOL,
  DEFAULT_CURRENCY_LOCALE,
  CURRENCY_ABBREVIATION_THRESHOLD,
  CURRENCY_COMPACT_THRESHOLD,
} from '@/constants/currency';


/**
 * Format a number with K/M abbreviations
 * @param num - The number to format
 * @returns Formatted string (e.g., "123.46K", "1.23M")
 */
const prettyNumber = (num: number): string => {
  const absNum = Math.abs(num);
  const sign = num < 0 ? '-' : '';

  if (absNum >= 1000000) {
    return `${sign}${(absNum / 1000000).toLocaleString(DEFAULT_CURRENCY_LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}M`;
  }
  if (absNum >= 1000) {
    return `${sign}${(absNum / 1000).toLocaleString(DEFAULT_CURRENCY_LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}K`;
  }
  return new Intl.NumberFormat(DEFAULT_CURRENCY_LOCALE, {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
};

/**
 * Format a currency amount with locale support
 * @param amount - The amount to format
 * @param currency - ISO 4217 currency code (default: USD)
 * @param symbol - Currency symbol to display (default: $)
 * @param pretty - Use abbreviated format (K/M) for large numbers (default: false)
 * @returns Formatted currency string (e.g., "$1,234.56" or "$123.46K")
 *
 * @example
 * ```typescript
 * formatCurrency(1234.56, 'USD', '$') // "$1,234.56"
 * formatCurrency(123456, 'USD', '$', true) // "$123.46K"
 * formatCurrency(1234567, 'USD', '$', true) // "$1.23M"
 * formatCurrency(null) // ""
 * ```
 */
export function formatCurrency(
  amount: number | null | undefined,
  currency: string = DEFAULT_GLOBAL_CURRENCY,
  symbol?: string,
  pretty?: boolean,
): string {
  if (amount === null || amount === undefined) return '';

  try {
    if (pretty) {
      return `${symbol || currency} ${prettyNumber(amount)}`;
    }

    const formatted = new Intl.NumberFormat(DEFAULT_CURRENCY_LOCALE, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);

    return `${symbol || currency} ${formatted}`;
  } catch (error) {
    console.error('Error formatting currency:', error);
    return `${symbol || currency} ${amount.toLocaleString(DEFAULT_CURRENCY_LOCALE, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  }
}

/**
 * Format a currency amount without decimal places (locale-safe, no .split hack)
 */
export function formatCurrencyWhole(
  amount: number | null | undefined,
  currency: string = DEFAULT_GLOBAL_CURRENCY,
  symbol?: string
): string {
  if (amount === null || amount === undefined) return '';

  try {
    const formatted = new Intl.NumberFormat(DEFAULT_CURRENCY_LOCALE, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

    return `${symbol || currency} ${formatted}`;
  } catch {
    return `${symbol || currency} ${Math.round(amount)}`;
  }
}

/**
 * Format a currency amount with K/M abbreviations
 * @param amount - The amount to format
 * @param currency - ISO 4217 currency code (default: USD)
 * @param symbol - Currency symbol to display (default: $)
 * @returns Formatted currency string with abbreviation (e.g., "$1.2k", "$5.3M")
 *
 * @example
 * ```typescript
 * formatCurrencyAbbreviated(1234, 'USD', '$') // "$1.2k"
 * formatCurrencyAbbreviated(1234567, 'USD', '$') // "$1.2M"
 * formatCurrencyAbbreviated(123, 'USD', '$') // "$123.00"
 * formatCurrencyAbbreviated(null) // ""
 * ```
 */
export function formatCurrencyAbbreviated(
  amount: number | null | undefined,
  currency: string = DEFAULT_GLOBAL_CURRENCY,
  symbol: string = DEFAULT_GLOBAL_CURRENCY_SYMBOL
): string {
  if (amount === null || amount === undefined) return '';

  try {
    const absAmount = Math.abs(amount);
    const sign = amount < 0 ? '-' : '';

    if (absAmount >= CURRENCY_COMPACT_THRESHOLD) {
      return `${sign}${symbol} ${(absAmount / CURRENCY_COMPACT_THRESHOLD).toLocaleString(DEFAULT_CURRENCY_LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}M`;
    } else if (absAmount >= CURRENCY_ABBREVIATION_THRESHOLD) {
      return `${sign}${symbol} ${(absAmount / CURRENCY_ABBREVIATION_THRESHOLD).toLocaleString(DEFAULT_CURRENCY_LOCALE, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}k`;
    }

    return formatCurrency(amount, currency, symbol);
  } catch (error) {
    console.error('Error formatting abbreviated currency:', error);
    return formatCurrency(amount, currency, symbol);
  }
}

/**
 * Format a currency amount using Intl.NumberFormat with compact notation
 * @param amount - The amount to format
 * @param currency - ISO 4217 currency code (default: USD)
 * @param symbol - Currency symbol to display (default: $)
 * @returns Formatted currency string with compact notation (e.g., "$1.2M", "$1.3B")
 *
 * @example
 * ```typescript
 * formatCurrencyCompact(1234567, 'USD', '$') // "$1.2M"
 * formatCurrencyCompact(1234567890, 'USD', '$') // "$1.2B"
 * formatCurrencyCompact(null) // ""
 * ```
 */
export function formatCurrencyCompact(
  amount: number | null | undefined,
  currency: string = DEFAULT_GLOBAL_CURRENCY,
  symbol: string = DEFAULT_GLOBAL_CURRENCY_SYMBOL
): string {
  if (amount === null || amount === undefined) return '';

  try {
    const formatter = new Intl.NumberFormat(DEFAULT_CURRENCY_LOCALE, {
      notation: 'compact',
      compactDisplay: 'short',
      maximumFractionDigits: 1,
    });

    return `${symbol}${formatter.format(amount)}`;
  } catch (error) {
    console.error('Error formatting compact currency:', error);
    return formatCurrencyAbbreviated(amount, currency, symbol);
  }
}

/**
 * Format numbers in a text string that are followed by a currency code (e.g., "500000 NPR")
 * Leaves non-currency numbers (like days, counts) untouched
 * @param text - The text containing amounts to format
 * @returns Text with formatted currency amounts
 *
 * @example
 * ```typescript
 * formatAmountsInText("Disbursed 500000 NPR on 2026-01-10") // "Disbursed 500.000 NPR on 2026-01-10"
 * formatAmountsInText("Drawdown amount: 500000 NPR") // "Drawdown amount: 500.000 NPR"
 * formatAmountsInText("Tenure extended from 30 to 45 days") // unchanged
 * ```
 */
export function formatAmountsInText(text: string): string {
  if (!text) return '';

  return text.replace(/(\d+(?:\.\d+)?)\s+([A-Z]{3})\b/g, (match, amount, code) => {
    const num = parseFloat(amount);
    if (isNaN(num)) return match;
    const formatted = new Intl.NumberFormat(DEFAULT_CURRENCY_LOCALE, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(num);
    return `${formatted} ${code}`;
  });
}

/**
 * Format a currency amount for CSV export
 * @param amount - The amount to format
 * @param currency - ISO 4217 currency code (default: USD)
 * @param symbol - Currency symbol to display (default: $)
 * @returns Formatted currency string suitable for CSV (e.g., "$1,234.56")
 *
 * @example
 * ```typescript
 * formatCurrencyForCSV(1234.56, 'USD', '$') // "$1,234.56"
 * formatCurrencyForCSV(1234.56) // "$1,234.56"
 * ```
 */
export function formatCurrencyForCSV(
  amount: number | null | undefined,
  currency: string = DEFAULT_GLOBAL_CURRENCY,
  symbol: string = DEFAULT_GLOBAL_CURRENCY_SYMBOL
): string {
  return formatCurrency(amount, currency, symbol);
}
