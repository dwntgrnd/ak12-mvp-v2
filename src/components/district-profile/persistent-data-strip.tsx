'use client';

import { Bookmark } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useSavedDistricts } from '@/hooks/use-saved-districts';
import type { DistrictProfile } from '@/services/types/district';
import type { MatchSummary } from '@/services/types/common';
import type { DistrictYearData } from '@/services/providers/mock/fixtures/districts';
import { formatNumber } from '@/lib/utils/format';
import { calculateTrend, getTrendDisplay } from '@/lib/utils/trends';
import { matchTierColors } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

interface PersistentDataStripProps {
  district: DistrictProfile;
  yearData: DistrictYearData[];
  matchSummary?: MatchSummary | null;
  activeProductName?: string;
  activeSubject?: string | null;
}

const SUBJECT_METRIC_MAP: Record<string, string[]> = {
  'Mathematics': ['Math Proficiency'],
  'English Language Arts': ['ELA Proficiency'],
};

const trendSentimentClasses = {
  positive: 'text-success',
  negative: 'text-destructive',
  neutral: 'text-foreground-secondary',
} as const;

export function PersistentDataStrip({
  district,
  yearData,
  matchSummary,
  activeProductName,
  activeSubject,
}: PersistentDataStripProps) {
  const { isSaved: checkIsSaved, saveDistrict, removeSavedDistrict } = useSavedDistricts();
  const isSaved = checkIsSaved(district.districtId);

  const promotedMetrics = activeSubject
    ? new Set(SUBJECT_METRIC_MAP[activeSubject] ?? [])
    : new Set<string>();

  // --- Derived metric computations ---
  const enrollmentTrend = calculateTrend(yearData.map((y) => y.totalEnrollment));
  const elaTrend = calculateTrend(yearData.map((y) => y.elaProficiency));
  const mathTrend = calculateTrend(yearData.map((y) => y.mathProficiency));

  const frpmPercentages = yearData.map((y) =>
    y.frpmCount != null && y.totalEnrollment != null && y.totalEnrollment > 0
      ? (y.frpmCount / y.totalEnrollment) * 100
      : null
  );
  const frpmTrend = calculateTrend(frpmPercentages);

  const spedPercentages = yearData.map((y) =>
    y.spedCount != null && y.totalEnrollment != null && y.totalEnrollment > 0
      ? (y.spedCount / y.totalEnrollment) * 100
      : null
  );
  const spedTrend = calculateTrend(spedPercentages);

  const currentFrpmPct =
    district.frpmCount != null && district.totalEnrollment > 0
      ? ((district.frpmCount / district.totalEnrollment) * 100).toFixed(1)
      : null;

  const currentSpedPct =
    district.spedCount != null && district.totalEnrollment > 0
      ? ((district.spedCount / district.totalEnrollment) * 100).toFixed(1)
      : null;

  // --- Contact info segments ---
  const hasSuperintendent = district.superintendentFirstName && district.superintendentLastName;
  const hasContactInfo =
    hasSuperintendent || !!district.phone || !!(district.street && district.city && district.zip);

  type ContactSegment = { key: string; node: React.ReactNode };
  const contactSegments: ContactSegment[] = [];

  if (hasSuperintendent) {
    contactSegments.push({
      key: 'supt',
      node: (
        <span>
          Supt. {district.superintendentFirstName} {district.superintendentLastName}
        </span>
      ),
    });
  }
  if (district.phone) {
    contactSegments.push({
      key: 'phone',
      node: (
        <a
          href={`tel:${district.phone}`}
          className="hover:text-foreground transition-colors"
        >
          {district.phone}
        </a>
      ),
    });
  }
  if (district.street && district.city && district.zip) {
    contactSegments.push({
      key: 'addr',
      node: (
        <span>
          {district.street}, {district.city}, CA {district.zip}
        </span>
      ),
    });
  }

  // --- Metrics strip ---
  interface MetricItem {
    label: string;
    value: string;
    trendDisplay: ReturnType<typeof getTrendDisplay>;
    neutral: boolean;
  }

  const metrics: MetricItem[] = [];

  if (district.lowGrade != null && district.highGrade != null) {
    metrics.push({
      label: 'Grades Served',
      value: `${district.lowGrade}–${district.highGrade}`,
      trendDisplay: null,
      neutral: false,
    });
  }

  metrics.push({
    label: 'Enrollment',
    value: formatNumber(district.totalEnrollment),
    trendDisplay: getTrendDisplay(enrollmentTrend, { format: 'percent' }),
    neutral: false,
  });

  if (district.elaProficiency != null) {
    metrics.push({
      label: 'ELA Proficiency',
      value: `${district.elaProficiency}%`,
      trendDisplay: getTrendDisplay(elaTrend, { format: 'points' }),
      neutral: false,
    });
  }

  if (district.mathProficiency != null) {
    metrics.push({
      label: 'Math Proficiency',
      value: `${district.mathProficiency}%`,
      trendDisplay: getTrendDisplay(mathTrend, { format: 'points' }),
      neutral: false,
    });
  }

  if (currentFrpmPct != null) {
    metrics.push({
      label: 'FRPM',
      value: `${currentFrpmPct}%`,
      trendDisplay: getTrendDisplay(frpmTrend, { format: 'points' }),
      neutral: true,
    });
  }

  if (currentSpedPct != null) {
    metrics.push({
      label: 'SPED',
      value: `${currentSpedPct}%`,
      trendDisplay: getTrendDisplay(spedTrend, { format: 'points' }),
      neutral: true,
    });
  }

  return (
    <div className="pb-5 border-b border-border-default">
      {/* Two-column upper region */}
      <div className="flex items-start justify-between gap-6">
        {/* Left column — identity */}
        <div className="min-w-0 flex-1">
          {/* Row A — Name + Save Toggle */}
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-2xl font-bold tracking-[-0.01em] text-foreground leading-[1.2]">
              {district.name}
            </h1>
            <button
              onClick={() => isSaved ? removeSavedDistrict(district.districtId) : saveDistrict(district.districtId)}
              aria-pressed={isSaved}
              aria-label={isSaved ? 'Remove saved district' : 'Save district'}
              className={cn(
                'flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium transition-colors',
                'hover:bg-surface-inset',
                isSaved ? 'text-foreground' : 'text-foreground-secondary'
              )}
            >
              <Bookmark className={cn('h-5 w-5', isSaved && 'fill-current text-brand-orange')} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
          {/* Row B — Contact Info */}
          {hasContactInfo && (
            <p className="mt-1.5 text-caption font-medium text-foreground-secondary tracking-[0.025em]">
              {contactSegments.map((seg, i) => (
                <span key={seg.key}>
                  {i > 0 && <span className="mx-1.5 select-none">·</span>}
                  {seg.node}
                </span>
              ))}
            </p>
          )}
        </div>

        {/* Right column — mode context */}
        {matchSummary && (
          <div className="shrink-0 text-right">
            <Badge
              className={`${matchTierColors[matchSummary.overallTier].bg} ${matchTierColors[matchSummary.overallTier].text} ${matchTierColors[matchSummary.overallTier].border} border`}
              variant="outline"
            >
              {matchTierColors[matchSummary.overallTier].label}
            </Badge>
            <p className="mt-1 text-sm text-foreground-secondary">
              {matchSummary.headline}
            </p>
          </div>
        )}
      </div>

      {/* Row C — Metrics Strip */}
      <div
        role="list"
        className="mt-3 pt-3 border-t border-border-subtle flex flex-col sm:grid sm:grid-cols-2 md:flex md:flex-row md:items-start"
      >
        {metrics.map((metric, i) => {
          const isPromoted = promotedMetrics.has(metric.label);
          return (
          <div
            key={metric.label}
            role="listitem"
            className={cn(
              'flex flex-col gap-0.5 py-2 sm:py-1.5 md:py-0 md:px-4 md:first:pl-0',
              i < metrics.length - 1 && 'md:border-r md:border-border-subtle',
              isPromoted && 'bg-primary/5 rounded-md md:py-1 md:-my-1'
            )}
          >
            <span className={cn(
              'text-overline font-medium uppercase tracking-[0.05em]',
              isPromoted ? 'text-primary' : 'text-foreground-tertiary'
            )}>
              {metric.label}
            </span>
            <div className="flex items-baseline gap-1">
              <span className={cn(
                'text-[20px] font-bold leading-none',
                isPromoted ? 'text-primary' : 'text-foreground'
              )}>
                {metric.value}
              </span>
              {metric.trendDisplay && (
                <span
                  className={cn(
                    'text-caption font-medium',
                    metric.neutral
                      ? trendSentimentClasses.neutral
                      : trendSentimentClasses[metric.trendDisplay.sentiment]
                  )}
                >
                  {metric.trendDisplay.symbol} {metric.trendDisplay.displayValue}
                </span>
              )}
            </div>
          </div>
          );
        })}
      </div>
    </div>
  );
}
