export interface TrendResult {
  direction: 'up' | 'down' | 'stable';
  delta: number;        // absolute change (latest - earliest)
  deltaPercent: number; // percentage change
}

/**
 * Calculate trend across a series of values.
 * Returns null if fewer than 2 non-null values.
 * "Stable" threshold: ±2% change.
 */
export function calculateTrend(values: (number | null | undefined)[]): TrendResult | null {
  const valid = values.filter((v): v is number => v != null);
  if (valid.length < 2) return null;

  const earliest = valid[0];
  const latest = valid[valid.length - 1];
  const delta = latest - earliest;
  const deltaPercent = earliest !== 0 ? (delta / earliest) * 100 : 0;

  let direction: TrendResult['direction'];
  if (Math.abs(deltaPercent) < 2) {
    direction = 'stable';
  } else {
    direction = delta > 0 ? 'up' : 'down';
  }

  return { direction, delta, deltaPercent };
}

/**
 * Format a trend for display.
 * `invertSentiment` flips the color logic (e.g., absenteeism: down is good).
 */
export function getTrendDisplay(
  trend: TrendResult | null,
  options?: { invertSentiment?: boolean; format?: 'percent' | 'points' | 'number' }
) {
  if (!trend) return null;

  const { direction, delta, deltaPercent } = trend;
  const format = options?.format ?? 'percent';
  const invert = options?.invertSentiment ?? false;

  const symbol = direction === 'up' ? '▲' : direction === 'down' ? '▼' : '—';

  let displayValue: string;
  if (format === 'percent') {
    displayValue = `${Math.abs(deltaPercent).toFixed(1)}%`;
  } else if (format === 'points') {
    displayValue = `${Math.abs(delta).toFixed(1)}`;
  } else {
    displayValue = Math.abs(delta).toLocaleString();
  }

  // Determine sentiment: is this trend good or bad?
  let sentiment: 'positive' | 'negative' | 'neutral';
  if (direction === 'stable') {
    sentiment = 'neutral';
  } else if (invert) {
    sentiment = direction === 'down' ? 'positive' : 'negative';
  } else {
    sentiment = direction === 'up' ? 'positive' : 'negative';
  }

  return { symbol, displayValue, sentiment, direction };
}
