'use client';

import { useRouter } from 'next/navigation';
import { Bookmark, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { useDistrictPlaybookStatus } from '@/hooks/use-district-playbook-status';
import { fitCategoryColors, type FitCategoryKey } from '@/lib/design-tokens';
import { formatNumber } from '@/lib/utils/format';
import { cn } from '@/lib/utils';
import type { FitAssessment } from '@/services/types/common';
import type { ProductAlignment } from '@/services/types/discovery';
import type { DistrictSnapshot } from '@/services/types/district';

interface DistrictListCardProps {
  snapshot: DistrictSnapshot;
  variant?: 'surface' | 'inset';
  rank?: number;
  productAlignment?: ProductAlignment;
  fitAssessment?: FitAssessment;
  fitLoading?: boolean;
  additionalMetrics?: Array<{ label: string; value: string }>;
  activeSortMetric?: string;
  academicMetricOverride?: 'math' | 'ela';
  isSaved?: boolean;
  onSave?: (districtId: string) => void;
  onRemoveSaved?: (districtId: string) => void;
  onGeneratePlaybook?: (districtId: string) => void;
  children?: React.ReactNode;
}

const alignmentBadgeClass: Record<ProductAlignment['level'], string> = {
  strong: 'text-success bg-success/10',
  moderate: 'text-warning bg-warning/10',
  limited: 'text-foreground-secondary bg-surface-emphasis-neutral',
};

function getFitCategory(fitScore: number): FitCategoryKey {
  if (fitScore >= 7) return 'strong';
  if (fitScore >= 4) return 'moderate';
  return 'low';
}

function formatGradeBand(low: string, high: string): string {
  return `${low}\u2013${high}`;
}

export function DistrictListCard({
  snapshot,
  variant = 'surface',
  rank,
  productAlignment,
  fitAssessment,
  fitLoading,
  additionalMetrics,
  activeSortMetric,
  academicMetricOverride = 'ela',
  isSaved,
  onSave,
  onRemoveSaved,
  onGeneratePlaybook,
  children,
}: DistrictListCardProps) {
  const router = useRouter();
  const { districtId, name } = snapshot;
  const { loading: playbookLoading, existingPlaybookId } = useDistrictPlaybookStatus(districtId);

  const location = `${snapshot.city}, ${snapshot.county}`;
  const gradeBand = formatGradeBand(snapshot.lowGrade, snapshot.highGrade);
  const showDocType = snapshot.docType !== 'Unified';

  // Metrics strip — fixed order from snapshot
  const stripMetrics: Array<{ label: string; value: string }> = [
    { label: 'Enrollment', value: formatNumber(snapshot.totalEnrollment) },
    { label: 'FRPM', value: `${snapshot.frpmPercent}%` },
    { label: 'ELL', value: `${snapshot.ellPercent}%` },
    {
      label: academicMetricOverride === 'math' ? 'Math Prof.' : 'ELA Prof.',
      value: `${academicMetricOverride === 'math' ? snapshot.mathProficiency : snapshot.elaProficiency}%`,
    },
  ];

  // Append AI-generated additional metrics
  if (additionalMetrics) {
    stripMetrics.push(...additionalMetrics);
  }

  const metaParts = [location, gradeBand].filter(Boolean);

  const ariaLabel = [
    rank != null ? `Rank ${rank}.` : null,
    name,
    ...metaParts,
    `${formatNumber(snapshot.totalEnrollment)} students`,
    fitAssessment
      ? fitCategoryColors[getFitCategory(fitAssessment.fitScore)].label
      : null,
    productAlignment ? `${productAlignment.level} alignment` : null,
  ]
    .filter(Boolean)
    .join(' \u00b7 ');

  function handleClick() {
    router.push(`/districts/${districtId}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      router.push(`/districts/${districtId}`);
    }
  }

  const fitCategory = fitAssessment
    ? getFitCategory(fitAssessment.fitScore)
    : null;
  const fitColors = fitCategory ? fitCategoryColors[fitCategory] : null;

  return (
    <article
      role="listitem"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'cursor-pointer px-4 py-2.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        variant === 'inset'
          ? 'bg-surface-inset border border-border-subtle rounded-md hover:bg-surface-inset hover:border-border-default transition-colors duration-150'
          : 'bg-surface-raised border border-border rounded-lg shadow-sm hover:shadow-md hover:border-border-default transition-shadow duration-150',
      )}
    >
      {/* Row 1 — Identity + Actions */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {rank != null && (
            <div className="w-6 h-6 rounded-full bg-surface-emphasis-neutral flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-foreground">
                {rank}
              </span>
            </div>
          )}
          <div className="flex items-baseline gap-1.5 min-w-0 flex-1">
            <span className="text-sm font-semibold text-district-link truncate shrink-0">
              {name}
            </span>
            {metaParts.length > 0 && (
              <span className="text-xs text-foreground-secondary truncate">
                <span className="mx-1 select-none">&middot;</span>
                {metaParts.join(' \u00b7 ')}
              </span>
            )}
            {showDocType && (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4 font-medium text-foreground-secondary border-border shrink-0"
              >
                {snapshot.docType}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {fitLoading && !fitAssessment && (
            <Skeleton className="h-5 w-20" />
          )}
          {fitAssessment && fitColors && (
            <Badge
              className={`${fitColors.bg} ${fitColors.text} ${fitColors.border} border`}
              variant="outline"
            >
              {fitColors.label}
            </Badge>
          )}

          {(onSave || onRemoveSaved) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                isSaved
                  ? onRemoveSaved?.(districtId)
                  : onSave?.(districtId);
              }}
              aria-pressed={isSaved}
              aria-label={
                isSaved ? 'Remove saved district' : 'Save district'
              }
              className={cn(
                'flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium transition-colors',
                'hover:bg-muted/50',
                isSaved ? 'text-foreground' : 'text-foreground-secondary',
              )}
            >
              <Bookmark
                className={cn('h-4 w-4', isSaved && 'fill-current')}
              />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          )}

          {playbookLoading ? (
            <Skeleton className="h-6 w-24" />
          ) : existingPlaybookId ? (
            <Button
              variant="outlineBrand"
              size="sm"
              className="h-auto py-1 px-2.5 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/playbooks/${existingPlaybookId}`);
              }}
            >
              View Playbook
              <ArrowRight className="h-3 w-3" />
            </Button>
          ) : onGeneratePlaybook ? (
            <Button
              size="sm"
              className="h-auto py-1 px-2.5 text-xs"
              onClick={(e) => {
                e.stopPropagation();
                onGeneratePlaybook(districtId);
              }}
            >
              Create Playbook
              <ArrowRight className="h-3 w-3" />
            </Button>
          ) : null}
        </div>
      </div>

      {/* Row 2 — Self-contained metrics strip */}
      <div className="mt-2 pt-2 border-t border-border-subtle">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-start">
            {stripMetrics.map((m, i) => {
              const isActive =
                activeSortMetric != null &&
                m.label.toLowerCase() === activeSortMetric.toLowerCase();
              return (
                <div
                  key={i}
                  className={cn(
                    'flex flex-col',
                    i > 0 && 'border-l border-border-subtle pl-4',
                    i < stripMetrics.length - 1 && 'pr-4',
                    isActive && 'bg-primary/5 rounded-sm px-3 -mx-1',
                  )}
                >
                  <span
                    className={cn(
                      'text-[10px] font-medium uppercase tracking-wider leading-tight',
                      isActive
                        ? 'text-primary'
                        : 'text-foreground-tertiary',
                    )}
                  >
                    {m.label}
                  </span>
                  <span className="text-sm font-bold text-foreground">
                    {m.value}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Product alignment — right side of metrics row */}
          {productAlignment && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                  alignmentBadgeClass[productAlignment.level],
                )}
              >
                {productAlignment.level}
              </span>
              {productAlignment.primaryConnection && (
                <span className="text-xs text-foreground-secondary truncate max-w-[200px]">
                  {productAlignment.primaryConnection}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {children && <div className="mt-1">{children}</div>}
    </article>
  );
}
