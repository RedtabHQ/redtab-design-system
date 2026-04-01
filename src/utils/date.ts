type DateFormat = 'short' | 'long' | 'iso' | 'relative';

/**
 * Formats a `Date` or ISO date string according to the given format.
 *
 * - `'short'`    → locale-aware short date, e.g. "4/1/2026"
 * - `'long'`     → locale-aware long date, e.g. "April 1, 2026"
 * - `'iso'`      → ISO 8601 date portion, e.g. "2026-04-01"
 * - `'relative'` → human-readable relative string via `timeAgo`
 *
 * Defaults to `'short'` when no format is provided.
 */
export function formatDate(date: Date | string, format: DateFormat = 'short'): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  switch (format) {
    case 'long':
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

    case 'iso':
      // Produces YYYY-MM-DD in local time to avoid UTC date shifting.
      return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, '0'),
        String(d.getDate()).padStart(2, '0'),
      ].join('-');

    case 'relative':
      return timeAgo(d);

    case 'short':
    default:
      return d.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
      });
  }
}

/**
 * Returns `true` when the given date falls on today's calendar date
 * (compared in local time).
 */
export function isToday(date: Date): boolean {
  const now = new Date();
  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

/**
 * Returns `true` when the given date is within the last `days` calendar days
 * from now (inclusive of today).
 */
export function isWithinDays(date: Date, days: number): boolean {
  const now = new Date();
  const cutoff = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
  return date >= cutoff && date <= now;
}

/**
 * Returns a human-readable relative time string such as:
 * "just now", "2 minutes ago", "1 hour ago", "3 days ago", "2 months ago", "1 year ago".
 */
export function timeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);

  if (diffSeconds < 30) return 'just now';

  const intervals: [number, string][] = [
    [365 * 24 * 60 * 60, 'year'],
    [30 * 24 * 60 * 60, 'month'],
    [7 * 24 * 60 * 60, 'week'],
    [24 * 60 * 60, 'day'],
    [60 * 60, 'hour'],
    [60, 'minute'],
    [1, 'second'],
  ];

  for (const [seconds, label] of intervals) {
    const count = Math.floor(diffSeconds / seconds);
    if (count >= 1) {
      return `${count} ${label}${count !== 1 ? 's' : ''} ago`;
    }
  }

  return 'just now';
}
