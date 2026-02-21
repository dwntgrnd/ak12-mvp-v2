'use client';

import { useRouter } from 'next/navigation';
import { Bookmark, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { fitCategoryColors, type FitCategoryKey } from '@/lib/design-tokens';
import { formatNumber } from '@/lib/utils/format';
import { cn } from '@/lib/utils';
import type { FitAssessment } from '@/services/types/common';
import type { ProductRelevance } from '@/services/types/discovery';

interface DistrictListCardProps {
  districtId: string;
  name: string;
  location?: string;
  enrollment?: number;
  gradesServed?: string;
  variant?: 'surface' | 'inset';
  rank?: number;
  fitAssessment?: FitAssessment;
  fitLoading?: boolean;
  productRelevance?: ProductRelevance;
  metrics?: Array<{ label: string; value: string }>;
  activeSortMetric?: string;
  isSaved?: boolean;
  onSave?: (districtId: string) => void;
  onRemoveSaved?: (districtId: string) => void;
  onGeneratePlaybook?: (districtId: string) => void;
  children?: React.ReactNode;
}

const alignmentBadgeClass: Record<ProductRelevance['alignmentLevel'], string> = {
  strong: 'text-success bg-success/10',
  moderate: 'text-warning bg-warning/10',
  limited: 'text-slate-500 bg-slate-100',
  unknown: 'text-slate-500 bg-slate-100',
};

function getFitCategory(fitScore: number): FitCategoryKey {
  if (fitScore >= 7) return 'strong';
  if (fitScore >= 4) return 'moderate';
  return 'low';
}

export function DistrictListCard({
  districtId,
  name,
  location,
  enrollment,
  gradesServed,
  variant = 'surface',
  rank,
  fitAssessment,
  fitLoading,
  productRelevance,
  metrics,
  activeSortMetric,
  isSaved,
  onSave,
  onRemoveSaved,
  onGeneratePlaybook,
  children,
}: DistrictListCardProps) {
  const router = useRouter();

  // Build the stats strip metrics — prepend enrollment if provided and not already in metrics
  const enrollmentAlreadyInMetrics = metrics?.some(
    (m) => m.label.toLowerCase() === 'enrollment'
  );
  const stripMetrics: Array<{ label: string; value: string }> = [];
  if (enrollment != null && !enrollmentAlreadyInMetrics) {
    stripMetrics.push({ label: 'Enrollment', value: formatNumber(enrollment) });
  }
  if (metrics) {
    stripMetrics.push(...metrics);
  }

  // Row 1 meta — location only (enrollment moved to stats strip)
  const metaParts = [location, gradesServed].filter(Boolean);

  const ariaLabel = [
    rank != null ? `Rank ${rank}.` : null,
    name,
    ...metaParts,
    enrollment != null ? `${formatNumber(enrollment)} students` : null,
    fitAssessment ? fitCategoryColors[getFitCategory(fitAssessment.fitScore)].label : null,
    productRelevance ? `${productRelevance.alignmentLevel} alignment` : null,
  ]
    .filter(Boolean)
    .join(' · ');

  function handleClick() {
    router.push(`/districts/${districtId}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      router.push(`/districts/${districtId}`);
    }
  }

  const fitCategory = fitAssessment ? getFitCategory(fitAssessment.fitScore) : null;
  const fitColors = fitCategory ? fitCategoryColors[fitCategory] : null;

  const hasStatsStrip = stripMetrics.length > 0 || productRelevance || (fitLoading && !fitAssessment);

  return (
    <article
      role="listitem"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'cursor-pointer px-4 py-2.5 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7000]',
        variant === 'inset'
          ? 'bg-slate-50 border border-border/50 rounded-md hover:bg-slate-100 hover:border-slate-300 transition-colors duration-150'
          : 'bg-white border border-border rounded-lg shadow-sm hover:shadow-md hover:border-slate-300 transition-shadow duration-150'
      )}
    >
      {/* Row 1 — Identity + Fit + Actions */}
      <div className="flex items-center justify-between gap-2">
        {/* Left zone: rank + name + meta */}
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {rank != null && (
            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-foreground">{rank}</span>
            </div>
          )}
          <div className="flex items-baseline gap-1.5 min-w-0 flex-1">
            <span className="text-sm font-semibold text-district-link truncate shrink-0">
              {name}
            </span>
            {metaParts.length > 0 && (
              <span className="text-xs text-muted-foreground truncate">
                <span className="mx-1 select-none">&middot;</span>
                {metaParts.join(' · ')}
              </span>
            )}
          </div>
        </div>

        {/* Right zone: fit badge + save + playbook */}
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
                isSaved ? onRemoveSaved?.(districtId) : onSave?.(districtId);
              }}
              aria-pressed={isSaved}
              aria-label={isSaved ? 'Remove saved district' : 'Save district'}
              className={cn(
                'flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium transition-colors',
                'hover:bg-muted/50',
                isSaved ? 'text-foreground' : 'text-muted-foreground'
              )}
            >
              <Bookmark className={cn('h-4 w-4', isSaved && 'fill-current')} />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          )}

          {onGeneratePlaybook && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onGeneratePlaybook(districtId);
              }}
              className="flex items-center gap-1 bg-brand-orange text-white text-xs font-medium px-2.5 py-1 rounded-md hover:bg-brand-orange/90 transition-colors"
            >
              Playbook
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Row 2 — Mini Stats Strip + Product Relevance (conditional) */}
      {hasStatsStrip && (
        <div className="mt-2 pt-2 border-t border-border/50">
          <div className="flex items-center justify-between gap-2">
            {/* Left: stats strip columns */}
            <div className="flex items-start min-w-0">
              {stripMetrics.map((m, i) => {
                const isActive = activeSortMetric != null &&
                  m.label.toLowerCase() === activeSortMetric.toLowerCase();
                return (
                  <div
                    key={i}
                    className={cn(
                      'flex flex-col',
                      i > 0 && 'border-l border-border pl-3',
                      i === 0 ? '' : '',
                      i < stripMetrics.length - 1 && 'pr-3',
                      isActive && 'bg-primary/5 rounded-sm px-2 -mx-0.5'
                    )}
                  >
                    <span
                      className={cn(
                        'text-overline',
                        isActive ? 'text-primary' : 'text-muted-foreground/70'
                      )}
                    >
                      {m.label}
                    </span>
                    <span className="text-sm font-bold text-foreground">{m.value}</span>
                  </div>
                );
              })}
            </div>

            {/* Right: product relevance */}
            {productRelevance && (
              <div className="flex items-center gap-1.5 shrink-0">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${alignmentBadgeClass[productRelevance.alignmentLevel]}`}
                >
                  {productRelevance.alignmentLevel}
                </span>
                {productRelevance.signals[0] && (
                  <span className="text-xs text-muted-foreground truncate max-w-[180px]">
                    {productRelevance.signals[0]}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Children slot — escape hatch (TransparencyNote only) */}
      {children && <div className="mt-1">{children}</div>}
    </article>
  );
}
