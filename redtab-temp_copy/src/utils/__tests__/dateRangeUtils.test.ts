import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { getDateRangeParams, DateRangeType } from '../dateRangeUtils';
import { toZonedTime } from 'date-fns-tz';

describe('dateRangeUtils', () => {
  const TODAY = new Date('2026-03-24T12:00:00.000Z');
  const TIMEZONE = 'UTC';

  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(TODAY);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('getDateRangeParams', () => {
    it('should return 7-day range for LAST_7_DAYS', () => {
      const result = getDateRangeParams('LAST_7_DAYS', TIMEZONE);
      expect(result.startDate).toBeDefined();
      expect(result.endDate).toBeDefined();
      expect(result.timezone).toBe(TIMEZONE);

      const start = new Date(result.startDate!);
      const startLocal = toZonedTime(start, TIMEZONE);
      expect(startLocal.getHours()).toBe(0);
      expect(startLocal.getMinutes()).toBe(0);

      const end = new Date(result.endDate!);
      const endLocal = toZonedTime(end, TIMEZONE);
      expect(endLocal.getHours()).toBe(23);
      expect(endLocal.getMinutes()).toBe(59);
    });

    it('should return 30-day range for LAST_30_DAYS', () => {
      const result = getDateRangeParams('LAST_30_DAYS', TIMEZONE);
      expect(result.startDate).toBeDefined();
      expect(result.endDate).toBeDefined();
      expect(result.timezone).toBe(TIMEZONE);
    });

    it('should return 90-day range for LAST_90_DAYS', () => {
      const result = getDateRangeParams('LAST_90_DAYS', TIMEZONE);
      expect(result.startDate).toBeDefined();
      expect(result.endDate).toBeDefined();
      expect(result.timezone).toBe(TIMEZONE);
    });

    it('should return YTD range for YTD', () => {
      const result = getDateRangeParams('YTD', TIMEZONE);
      expect(result.startDate).toBeDefined();
      expect(result.endDate).toBeDefined();
      expect(result.timezone).toBe(TIMEZONE);

      // Start should be near the beginning of the year and well before today
      const start = new Date(result.startDate!);
      const end = new Date(result.endDate!);
      expect(start.getTime()).toBeLessThan(end.getTime());
      // YTD range should span at least 80 days (we're in late March)
      const diffDays = (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24);
      expect(diffDays).toBeGreaterThan(80);
    });

    it('should return empty object for ALL_TIME', () => {
      const result = getDateRangeParams('ALL_TIME', TIMEZONE);
      expect(result).toEqual({});
    });

    it('should return dates in ISO 8601 full format', () => {
      const result = getDateRangeParams('LAST_7_DAYS', TIMEZONE);
      expect(result.startDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(result.endDate).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
    });
  });
});
