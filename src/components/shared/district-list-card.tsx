'use client';

import { useRouter } from 'next/navigation';
import { MoreVertical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
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
  isSaved,
  onSave,
  onRemoveSaved,
  onGeneratePlaybook,
  children,
}: DistrictListCardProps) {
  const router = useRouter();

  const hasActions = !!(onSave || onRemoveSaved || onGeneratePlaybook);

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

  return (
    <article
      role="listitem"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'cursor-pointer p-4 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7000]',
        variant === 'inset'
          ? 'bg-slate-50 rounded-md hover:bg-slate-100 transition-colors duration-150'
          : 'bg-white border border-border rounded-lg shadow-sm hover:shadow-md hover:border-slate-300 transition-shadow duration-150'
      )}
    >
      {/* Zone 1 — Identity */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0 flex-1">
          {rank != null && (
            <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
              <span className="text-caption font-[600] text-foreground">{rank}</span>
            </div>
          )}
          <div className="min-w-0">
            <div className="text-subsection-heading font-semibold text-district-link leading-snug">
              {name}
            </div>
            {metaParts.length > 0 && (
              <div className="text-caption text-muted-foreground mt-0.5">
                {metaParts.join(' · ')}
              </div>
            )}
          </div>
        </div>

        {hasActions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 shrink-0"
                onClick={(e) => e.stopPropagation()}
                aria-label={`Actions for ${name}`}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
              <DropdownMenuItem
                onClick={() => router.push(`/districts/${districtId}`)}
              >
                View Profile
              </DropdownMenuItem>
              {(onSave || onRemoveSaved) && (
                <DropdownMenuItem
                  onClick={() =>
                    isSaved
                      ? onRemoveSaved?.(districtId)
                      : onSave?.(districtId)
                  }
                >
                  {isSaved ? 'Remove from Saved' : 'Save District'}
                </DropdownMenuItem>
              )}
              {onGeneratePlaybook && (
                <DropdownMenuItem onClick={() => onGeneratePlaybook(districtId)}>
                  Generate Playbook
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>

      {/* Zone 2 — Fit Assessment (conditional) */}
      {fitLoading && !fitAssessment && (
        <div className="mt-3">
          <Skeleton className="h-5 w-48" />
        </div>
      )}
      {fitAssessment && fitColors && (
        <div className="mt-3 flex items-center gap-2 min-w-0">
          <Badge
            className={`${fitColors.bg} ${fitColors.text} ${fitColors.border} border shrink-0`}
            variant="outline"
          >
            {fitColors.label}
          </Badge>
          <span className="text-sm text-muted-foreground truncate">
            {fitAssessment.fitRationale}
          </span>
        </div>
      )}

      {/* Zone 3 — Product Relevance (conditional) */}
      {productRelevance && (
        <div className="mt-3 flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2 py-0.5 rounded text-caption font-medium ${alignmentBadgeClass[productRelevance.alignmentLevel]}`}
          >
            {productRelevance.alignmentLevel}
          </span>
          {productRelevance.signals[0] && (
            <span className="text-caption text-muted-foreground truncate">
              {productRelevance.signals[0]}
            </span>
          )}
        </div>
      )}

      {/* Zone 4 — Children slot (conditional) */}
      {children && <div className="mt-3">{children}</div>}
    </article>
  );
}
