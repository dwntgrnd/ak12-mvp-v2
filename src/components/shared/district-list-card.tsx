'use client';

import { useRouter } from 'next/navigation';
import { Bookmark, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { fitCategoryColors, type FitCategoryKey } from '@/lib/design-tokens';
import { formatNumber } from '@/lib/utils/format';
import { cn } from '@/lib/utils';
import type { FitAssessment } from '@/services/types/common';
import type { ProductAlignment } from '@/services/types/discovery';
import type { DistrictSnapshot } from '@/services/types/district';

interface DistrictListCardProps {
  // Core data — single source of truth
  snapshot: DistrictSnapshot;

  // Display configuration
  variant?: 'surface' | 'inset';
  rank?: number;

  // Contextual data layers (on top of snapshot)
  productAlignment?: ProductAlignment;
  fitAssessment?: FitAssessment;
  fitLoading?: boolean;

  // AI-generated metrics (override/supplement snapshot metrics)
  additionalMetrics?: Array<{ label: string; value: string }>;
  activeSortMetric?: string;

  // Query context — determines which academic metric to show
  academicMetricOverride?: 'math' | 'ela';

  // Actions
  isSaved?: boolean;
  onSave?: (districtId: string) => void;
  onRemoveSaved?: (districtId: string) => void;
  onGeneratePlaybook?: (districtId: string) => void;

  // Escape hatch
  children?: React.ReactNode;
}

const alignmentBadgeClass: Record<ProductAlignment['level'], string> = {
  strong: 'text-success bg-success/10',
  moderate: 'text-warning bg-warning/10',
  limited: 'text-slate-500 bg-slate-100',
};

function getFitCategory(fitScore: number): FitCategoryKey {
  if (fitScore >= 7) return 'strong';
  if (fitScore >= 4) return 'moderate';
  return 'low';
}

/** Derive a human-readable grade band string from lowGrade + highGrade */
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

  // Tier 1 — Identity zone
  const location = `${snapshot.city}, ${snapshot.county}`;
  const gradeBand = formatGradeBand(snapshot.lowGrade, snapshot.highGrade);
  const showDocType = snapshot.docType !== 'Unified';

  // Tier 2 — Metrics strip (fixed order from snapshot)
  const stripMetrics: Array<{ label: string; value: string }> = [
    { label: 'Enrollment', value: formatNumber(snapshot.totalEnrollment) },
    { label: 'FRPM', value: `${snapshot.frpmPercent}%` },
    { label: 'ELL', value: `${snapshot.ellPercent}%` },
    {
      label: academicMetricOverride === 'math' ? 'Math Prof.' : 'ELA Prof.',
      value: `${academicMetricOverride === 'math' ? snapshot.mathProficiency : snapshot.elaProficiency}%`,
    },
  ];

  // Append AI-generated additional metrics after snapshot metrics
  if (additionalMetrics) {
    stripMetrics.push(...additionalMetrics);
  }

  // Row 1 meta parts
  const metaParts = [location, gradeBand].filter(Boolean);

  const ariaLabel = [
    rank != null ? `Rank ${rank}.` : null,
    name,
    ...metaParts,
    `${formatNumber(snapshot.totalEnrollment)} students`,
    fitAssessment ? fitCategoryColors[getFitCategory(fitAssessment.fitScore)].label : null,
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

  const fitCategory = fitAssessment ? getFitCategory(fitAssessment.fitScore) : null;
  const fitColors = fitCategory ? fitCategoryColors[fitCategory] : null;

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
                {metaParts.join(' \u00b7 ')}
              </span>
            )}
            {showDocType && (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4 font-medium text-muted-foreground border-border shrink-0"
              >
                {snapshot.docType}
              </Badge>
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

      {/* Row 2 — Mini Stats Strip + Product Alignment (always shown — snapshot guarantees data) */}
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

          {/* Right: product alignment */}
          {productAlignment && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span
                className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${alignmentBadgeClass[productAlignment.level]}`}
              >
                {productAlignment.level}
              </span>
              {productAlignment.primaryConnection && (
                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {productAlignment.primaryConnection}
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Children slot — escape hatch (TransparencyNote only) */}
      {children && <div className="mt-1">{children}</div>}
    </article>
  );
}
