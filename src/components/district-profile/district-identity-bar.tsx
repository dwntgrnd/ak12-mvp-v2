'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDistrictPlaybookStatus } from '@/hooks/use-district-playbook-status';
import type { DistrictProfile } from '@/services/types/district';
import type { DistrictYearData } from '@/services/providers/mock/fixtures/districts';
import { formatNumber } from '@/lib/utils/format';
import { calculateTrend, getTrendDisplay } from '@/lib/utils/trends';
import { cn } from '@/lib/utils';

interface DistrictIdentityBarProps {
  district: DistrictProfile;
  yearData: DistrictYearData[];
  productId?: string;
  onGeneratePlaybook: () => void;
}

const trendSentimentClasses = {
  positive: 'text-success',
  negative: 'text-destructive',
  neutral: 'text-muted-foreground',
} as const;

export function DistrictIdentityBar({
  district,
  yearData,
  onGeneratePlaybook,
}: DistrictIdentityBarProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { loading: playbookLoading, existingPlaybookId } = useDistrictPlaybookStatus(district.districtId);

  async function handleToggleSave() {
    if (isSaving) return;
    setIsSaving(true);

    const wasSaved = isSaved;
    setIsSaved(!wasSaved);

    try {
      const res = await fetch(`/api/districts/${district.districtId}/save`, {
        method: wasSaved ? 'DELETE' : 'POST',
      });
      if (!res.ok) setIsSaved(wasSaved);
    } catch {
      setIsSaved(wasSaved);
    } finally {
      setIsSaving(false);
    }
  }

  // --- Derived metric computations (moved from key-metrics-grid.tsx) ---
  const enrollmentTrend = calculateTrend(yearData.map((y) => y.totalEnrollment));
  const elaTrend = calculateTrend(yearData.map((y) => y.elaProficiency));

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
    <div className="pb-5 border-b border-border">
      {/* Row A — Name + Save Toggle + Action Buttons */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <h1 className="text-2xl font-bold tracking-[-0.01em] text-foreground leading-[1.2]">
            {district.name}
          </h1>
          <button
            onClick={handleToggleSave}
            disabled={isSaving}
            aria-pressed={isSaved}
            aria-label={isSaved ? 'Remove saved district' : 'Save district'}
            className={cn(
              'flex shrink-0 items-center gap-1.5 rounded-md px-2 py-1 text-sm font-medium transition-colors',
              'hover:bg-muted/50 disabled:opacity-50',
              isSaved ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            <Bookmark className={cn('h-5 w-5', isSaved && 'fill-current')} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>

        {/* Button group */}
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            className="border-[1.5px] border-brand-orange text-brand-orange hover:bg-orange-50 hover:text-brand-orange"
            onClick={() => router.push('/discovery')}
          >
            Find Similar
          </Button>
          {playbookLoading ? (
            <Skeleton className="h-9 w-32" />
          ) : existingPlaybookId ? (
            <Button
              variant="outline"
              className="border-[1.5px] border-brand-orange text-brand-orange hover:bg-orange-50 hover:text-brand-orange"
              onClick={() => router.push(`/playbooks/${existingPlaybookId}`)}
            >
              View Playbook
            </Button>
          ) : (
            <Button
              className="bg-brand-orange text-white hover:bg-brand-orange/90"
              onClick={onGeneratePlaybook}
            >
              Create Playbook
            </Button>
          )}
        </div>
      </div>

      {/* Row B — Contact Info */}
      {hasContactInfo && (
        <p className="mt-1.5 text-caption font-medium text-muted-foreground tracking-[0.025em]">
          {contactSegments.map((seg, i) => (
            <span key={seg.key}>
              {i > 0 && <span className="mx-1.5 select-none">·</span>}
              {seg.node}
            </span>
          ))}
        </p>
      )}

      {/* Row C — Metrics Strip */}
      <div
        role="list"
        className="mt-3 pt-3 border-t border-border flex flex-col sm:grid sm:grid-cols-2 md:flex md:flex-row md:items-start"
      >
        {metrics.map((metric, i) => (
          <div
            key={metric.label}
            role="listitem"
            className={cn(
              'flex flex-col gap-0.5 py-2 sm:py-1.5 md:py-0 md:px-4 md:first:pl-0',
              i < metrics.length - 1 && 'md:border-r md:border-border'
            )}
          >
            <span className="text-overline font-medium uppercase tracking-[0.05em] text-muted-foreground/70">
              {metric.label}
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-[20px] font-bold leading-none text-foreground">
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
        ))}
      </div>
    </div>
  );
}
