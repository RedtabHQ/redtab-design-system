/**
 * Date formatting utilities using date-fns and date-fns-tz
 * Provides locale-aware formatting helpers across the application.
 */

import { format, parseISO, isValid, differenceInMonths } from 'date-fns';
import type { Locale } from 'date-fns';
import { enUS, vi as viLocale } from 'date-fns/locale';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';
import i18n, { DEFAULT_LANGUAGE, type SupportedLanguage } from '@/lib/i18n';

/**
 * Standard datetime format (locale-aware)
 */
export const STANDARD_DATETIME_FORMAT = 'Pp';

/**
 * Standard date format (locale-aware)
 */
export const STANDARD_DATE_FORMAT = 'P';

/**
 * Standard time format (locale-aware)
 */
export const STANDARD_TIME_FORMAT = 'p';

/**
 * Default timezone (you can configure this based on your needs)
 */
export const DEFAULT_TIMEZONE = 'Asia/Kathmandu';

const defaultLocale: Locale = enUS;

const LOCALE_MAP: Record<SupportedLanguage, Locale> = {
  en: enUS,
  vi: viLocale,
  ne: defaultLocale,
};

type LanguageInput = SupportedLanguage | string | undefined;

const getDateLocale = (language?: LanguageInput): Locale => {
  const rawLanguage = (
    typeof language === 'string'
      ? language
      : language ?? i18n.language ?? DEFAULT_LANGUAGE
  ).split('-')[0] as SupportedLanguage;

  return LOCALE_MAP[rawLanguage] || LOCALE_MAP[DEFAULT_LANGUAGE];
};

interface FormatLocalizedOptions {
  timezone?: string;
  language?: LanguageInput;
}

const parseDateInput = (
  date: string | Date | number
): Date | null => {
  try {
    if (typeof date === 'string') {
      const isoDate = parseISO(date);
      if (isValid(isoDate)) {
        return isoDate;
      }
      const fallbackDate = new Date(date);
      return isValid(fallbackDate) ? fallbackDate : null;
    }

    const dateObj = new Date(date);
    return isValid(dateObj) ? dateObj : null;
  } catch {
    const fallback = new Date(date);
    return isValid(fallback) ? fallback : null;
  }
};

/**
 * Generic localized formatter using date-fns patterns
 */
export function formatLocalized(
  date: string | Date | number | null | undefined,
  pattern: string,
  options: FormatLocalizedOptions = {}
): string {
  if (!date) return '';

  try {
    const dateObj = parseDateInput(date);

    if (!dateObj) {
      console.warn('Invalid date provided to formatLocalized:', date);
      return '';
    }

    const timezone = options.timezone ?? DEFAULT_TIMEZONE;
    const zonedDate = toZonedTime(dateObj, timezone);
    const locale = getDateLocale(options.language);

    return format(zonedDate, pattern, { locale });
  } catch (error) {
    console.error('Error formatting localized date:', error);
    return '';
  }
}

/**
 * Format a date to standard datetime format using locale-aware tokens
 * @param date - Date string, Date object, or timestamp
 * @param timezone - Timezone to use (default: UTC)
 * @param language - Optional locale override (e.g., 'vi')
 * @returns Formatted datetime string
 */
export function formatDateTime(
  date: string | Date | number | null | undefined,
  timezone: string = DEFAULT_TIMEZONE,
  language?: LanguageInput
): string {
  return formatLocalized(date, STANDARD_DATETIME_FORMAT, { timezone, language });
}

/**
 * Format a date to standard date format using locale-aware tokens
 * @param date - Date string, Date object, or timestamp
 * @param timezone - Timezone to use (default: UTC)
 * @param language - Optional locale override
 * @returns Formatted date string
 */
export function formatDate(
  date: string | Date | number | null | undefined,
  timezone: string = DEFAULT_TIMEZONE,
  language?: LanguageInput
): string {
  return formatLocalized(date, STANDARD_DATE_FORMAT, { timezone, language });
}

/**
 * Format a date to standard time format using locale-aware tokens
 * @param date - Date string, Date object, or timestamp
 * @param timezone - Timezone to use (default: UTC)
 * @param language - Optional locale override
 * @returns Formatted time string
 */
export function formatTime(
  date: string | Date | number | null | undefined,
  timezone: string = DEFAULT_TIMEZONE,
  language?: LanguageInput
): string {
  return formatLocalized(date, STANDARD_TIME_FORMAT, { timezone, language });
}

/**
 * Format a date for CSV export (same as standard datetime format)
 * @param date - Date string, Date object, or timestamp
 * @returns Formatted datetime string for CSV
 */
export function formatDateForCSV(
  date: string | Date | number | null | undefined
): string {
  return formatDateTime(date);
}

/**
 * Convert a local date to UTC
 * @param date - Date string, Date object, or timestamp
 * @param timezone - Source timezone
 * @returns Date object in UTC
 */
export function toUTC(
  date: string | Date | number,
  timezone: string = DEFAULT_TIMEZONE
): Date {
  const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);
  return fromZonedTime(dateObj, timezone);
}

/**
 * Format timestamp for audit logs (same as standard datetime format)
 * @param timestamp - Date string, Date object, or timestamp
 * @returns Formatted datetime string
 */
export function formatTimestamp(
  timestamp: string | Date | number | null | undefined
): string {
  return formatDateTime(timestamp);
}

/**
 * Calculate months elapsed from a given date to now
 * @param date - Date string, Date object, or timestamp
 * @returns Number of months elapsed, or null if date is invalid
 */
export function calculateMonthsFromDate(
  date: string | Date | number | null | undefined
): number | null {
  if (!date) return null;

  try {
    const dateObj = typeof date === 'string' ? parseISO(date) : new Date(date);

    if (!isValid(dateObj)) {
      return null;
    }

    return differenceInMonths(new Date(), dateObj);
  } catch {
    return null;
  }
}

/**
 * Calculate platform months for a merchant based on verifiedAt or onboardingDate
 * @param verifiedAt - Date when merchant was verified
 * @param onboardingDate - Date when merchant was onboarded (fallback)
 * @returns Number of months on platform
 */
export function calculatePlatformMonths(
  verifiedAt: string | Date | null | undefined,
  onboardingDate: string | Date | null | undefined
): number | null {
  // Prefer verifiedAt, fallback to onboardingDate
  const referenceDate = verifiedAt || onboardingDate;
  return calculateMonthsFromDate(referenceDate);
}
