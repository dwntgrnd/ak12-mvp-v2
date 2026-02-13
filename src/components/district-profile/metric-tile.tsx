import { cn } from '@/lib/utils';
import type { TrendResult } from '@/lib/utils/trends';
import { getTrendDisplay } from '@/lib/utils/trends';

interface MetricTileProps {
  label: string;
  value: string;
  trend?: TrendResult | null;
  trendOptions?: {
    invertSentiment?: boolean;
    format?: 'percent' | 'points' | 'number';
  };
  /** If true, trend uses neutral color regardless of direction (e.g. FRPM/SPED) */
  neutralTrend?: boolean;
}

const sentimentClasses = {
  positive: 'text-success',
  negative: 'text-destructive',
  neutral: 'text-muted-foreground',
} as const;

export function MetricTile({ label, value, trend, trendOptions, neutralTrend }: MetricTileProps) {
  const trendDisplay = getTrendDisplay(trend ?? null, trendOptions);

  return (
    <dl className="rounded-lg border bg-card p-3">
      <dt className="text-xs text-muted-foreground">{label}</dt>
      <dd className="mt-1 flex items-baseline gap-1.5">
        <span className="text-lg font-semibold">{value}</span>
        {trendDisplay && (
          <span
            className={cn(
              'text-xs font-medium',
              neutralTrend
                ? sentimentClasses.neutral
                : sentimentClasses[trendDisplay.sentiment]
            )}
          >
            {trendDisplay.symbol} {trendDisplay.displayValue}
          </span>
        )}
      </dd>
    </dl>
  );
}
