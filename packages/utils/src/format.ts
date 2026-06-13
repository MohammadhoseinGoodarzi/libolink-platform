const RELATIVE_TIME_DIVISIONS: ReadonlyArray<{
  amount: number;
  unit: Intl.RelativeTimeFormatUnit;
}> = [
  { amount: 60, unit: 'seconds' },
  { amount: 60, unit: 'minutes' },
  { amount: 24, unit: 'hours' },
  { amount: 7, unit: 'days' },
  { amount: 4.34524, unit: 'weeks' },
  { amount: 12, unit: 'months' },
  { amount: Number.POSITIVE_INFINITY, unit: 'years' },
];

function toDate(value: Date | string | number): Date {
  return value instanceof Date ? value : new Date(value);
}

export function formatDate(date: Date | string | number, locale = 'en-US'): string {
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(toDate(date));
}

export function formatNumber(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale).format(value);
}

export function formatCompactNumber(value: number, locale = 'en-US'): string {
  return new Intl.NumberFormat(locale, {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
}

export function formatRelativeTime(
  date: Date | string | number,
  now: Date | number = Date.now(),
  locale = 'en-US',
): string {
  const reference = typeof now === 'number' ? now : now.getTime();
  let duration = (toDate(date).getTime() - reference) / 1000;
  const formatter = new Intl.RelativeTimeFormat(locale, { numeric: 'auto' });
  for (const division of RELATIVE_TIME_DIVISIONS) {
    if (Math.abs(duration) < division.amount) {
      return formatter.format(Math.round(duration), division.unit);
    }
    duration /= division.amount;
  }
  return formatter.format(Math.round(duration), 'years');
}

export function truncate(text: string, maxLength: number, ellipsis = '…'): string {
  if (text.length <= maxLength) {
    return text;
  }
  return `${text.slice(0, Math.max(0, maxLength - ellipsis.length)).trimEnd()}${ellipsis}`;
}
