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
  isSaved,
  onSave,
  onRemoveSaved,
  onGeneratePlaybook,
  children,
}: DistrictListCardProps) {
  const router = useRouter();

  const metaParts = [
    location,
    enrollment != null ? `${formatNumber(enrollment)} students` : null,
    gradesServed,
  ].filter(Boolean);

  const ariaLabel = [
    rank != null ? `Rank ${rank}.` : null,
    name,
    ...metaParts,
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

  const hasRow2 = !!(metrics?.length || productRelevance || (fitLoading && !fitAssessment));

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
          ? 'bg-slate-50 rounded-md hover:bg-slate-100 transition-colors duration-150'
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
              className="flex items-center gap-0.5 text-xs text-muted-foreground font-medium hover:text-primary transition-colors"
            >
              Playbook
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Row 2 — Metrics + Product Relevance (conditional) */}
      {hasRow2 && (
        <div className="mt-0.5 flex items-center justify-between gap-2">
          {/* Left: inline metrics */}
          <div className="flex items-baseline gap-1 min-w-0 truncate">
            {metrics?.map((m, i) => (
              <span key={i} className="inline-flex items-baseline">
                {i > 0 && <span className="mx-1.5 text-xs text-muted-foreground select-none">&middot;</span>}
                <span className="text-xs text-muted-foreground">{m.label}:</span>
                <span className="text-xs font-semibold text-foreground ml-1">{m.value}</span>
              </span>
            ))}
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
      )}

      {/* Children slot — escape hatch (TransparencyNote only) */}
      {children && <div className="mt-1">{children}</div>}
    </article>
  );
}
