import { subDays, startOfYear, endOfDay, startOfDay } from 'date-fns';
import { fromZonedTime } from 'date-fns-tz';

export type DateRangeType = 'LAST_7_DAYS' | 'LAST_30_DAYS' | 'LAST_90_DAYS' | 'YTD' | 'ALL_TIME';

export interface DateRangeParams {
  startDate?: string;
  endDate?: string;
  timezone?: string;
}

export function getDateRangeParams(range: DateRangeType, timezone: string): DateRangeParams {
  if (range === 'ALL_TIME') return {};

  const now = new Date();

  // End: end of today in user's local timezone → UTC
  const endLocal = endOfDay(now);
  const endUTC = fromZonedTime(endLocal, timezone);

  const toUTCAwareISO = (date: Date): string =>
    fromZonedTime(startOfDay(date), timezone).toISOString();

  switch (range) {
    case 'LAST_7_DAYS':
      return {
        startDate: toUTCAwareISO(subDays(now, 6)),
        endDate: endUTC.toISOString(),
        timezone,
      };
    case 'LAST_30_DAYS':
      return {
        startDate: toUTCAwareISO(subDays(now, 29)),
        endDate: endUTC.toISOString(),
        timezone,
      };
    case 'LAST_90_DAYS':
      return {
        startDate: toUTCAwareISO(subDays(now, 89)),
        endDate: endUTC.toISOString(),
        timezone,
      };
    case 'YTD':
      return {
        startDate: toUTCAwareISO(startOfYear(now)),
        endDate: endUTC.toISOString(),
        timezone,
      };
    default:
      const _exhaustive: never = range;
      return _exhaustive;
  }
}
