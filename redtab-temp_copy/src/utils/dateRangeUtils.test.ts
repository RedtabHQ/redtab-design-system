import { getDateRangeParams } from './dateRangeUtils';
import { fromZonedTime, toZonedTime } from 'date-fns-tz';

describe('getDateRangeParams', () => {
  it('returns UTC-aware ISO timestamps for LAST_7_DAYS in UTC+7', () => {
    const result = getDateRangeParams('LAST_7_DAYS', 'Asia/Ho_Chi_Minh');

    // startDate should be midnight local time in UTC
    const start = new Date(result.startDate!);
    const startLocal = toZonedTime(start, 'Asia/Ho_Chi_Minh');
    expect(startLocal.getHours()).toBe(0);
    expect(startLocal.getMinutes()).toBe(0);

    // endDate should be end of day local time in UTC
    const end = new Date(result.endDate!);
    const endLocal = toZonedTime(end, 'Asia/Ho_Chi_Minh');
    expect(endLocal.getHours()).toBe(23);
    expect(endLocal.getMinutes()).toBe(59);

    // timezone is included
    expect(result.timezone).toBe('Asia/Ho_Chi_Minh');
  });

  it('returns empty object for ALL_TIME', () => {
    const result = getDateRangeParams('ALL_TIME', 'Asia/Ho_Chi_Minh');
    expect(result).toEqual({});
  });

  it('returns UTC-aware ISO timestamps for Nepal UTC+5:45', () => {
    const result = getDateRangeParams('LAST_7_DAYS', 'Asia/Kathmandu');
    const start = new Date(result.startDate!);
    const startLocal = toZonedTime(start, 'Asia/Kathmandu');
    expect(startLocal.getHours()).toBe(0);
    expect(startLocal.getMinutes()).toBe(0);
    expect(result.timezone).toBe('Asia/Kathmandu');
  });
});
