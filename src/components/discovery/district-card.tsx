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
import type { FitAssessment } from '@/services/types/common';

interface DistrictCardProps {
  district: {
    districtId: string;
    name: string;
    location: string;
    county: string;
    enrollment: number;
  };
  fitAssessment?: FitAssessment;
  fitLoading?: boolean;
  selectedProductId?: string;
  selectedProductName?: string;
  isSaved?: boolean;
  onSave?: (districtId: string) => void;
  onRemoveSaved?: (districtId: string) => void;
  onGeneratePlaybook?: (
    district: { districtId: string; name: string; location: string; enrollment: number },
    productId: string,
  ) => void;
}

function getFitCategory(fitScore: number): FitCategoryKey {
  if (fitScore >= 7) return 'strong';
  if (fitScore >= 4) return 'moderate';
  return 'low';
}

export function DistrictCard({
  district,
  fitAssessment,
  fitLoading,
  selectedProductId,
  isSaved,
  onSave,
  onRemoveSaved,
  onGeneratePlaybook,
}: DistrictCardProps) {
  const router = useRouter();

  function handleCardClick() {
    router.push(`/districts/${district.districtId}`);
  }

  function buildAriaLabel(): string {
    const parts = [
      district.name,
      district.location,
      `enrollment ${formatNumber(district.enrollment)}`,
    ];
    if (fitAssessment) {
      const category = getFitCategory(fitAssessment.fitScore);
      parts.push(fitCategoryColors[category].label);
    }
    return parts.join(', ');
  }

  const fitCategory = fitAssessment ? getFitCategory(fitAssessment.fitScore) : null;
  const fitColors = fitCategory ? fitCategoryColors[fitCategory] : null;

  return (
    <article
      role="listitem"
      className="rounded-lg border bg-card p-4 md:p-5 hover:bg-muted/50 transition-colors cursor-pointer relative focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7000]"
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter') handleCardClick();
      }}
      tabIndex={0}
      aria-label={buildAriaLabel()}
    >
      {/* Row 1: Name + Enrollment (desktop) + Overflow */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-3">
            <h3 className="text-base font-semibold text-foreground truncate">
              {district.name}
            </h3>
            <span className="hidden md:block text-sm text-muted-foreground whitespace-nowrap">
              Enrollment: {formatNumber(district.enrollment)}
            </span>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">
            {district.location} &middot; {district.county} County
          </p>
          {/* Enrollment on mobile */}
          <p className="block md:hidden text-sm text-muted-foreground mt-0.5">
            Enrollment: {formatNumber(district.enrollment)}
          </p>
        </div>

        {/* Overflow menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0"
              onClick={(e) => e.stopPropagation()}
              aria-label={`Actions for ${district.name}`}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuItem
              onClick={() => router.push(`/districts/${district.districtId}`)}
            >
              View Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                isSaved
                  ? onRemoveSaved?.(district.districtId)
                  : onSave?.(district.districtId)
              }
            >
              {isSaved ? 'Remove from Saved' : 'Save District'}
            </DropdownMenuItem>
            {selectedProductId && (
              <DropdownMenuItem
                onClick={() =>
                  onGeneratePlaybook?.(
                    {
                      districtId: district.districtId,
                      name: district.name,
                      location: district.location,
                      enrollment: district.enrollment,
                    },
                    selectedProductId,
                  )
                }
              >
                Generate Playbook
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Fit row — conditional */}
      {fitLoading && !fitAssessment && (
        <div className="mt-2">
          <Skeleton className="h-5 w-48" />
        </div>
      )}
      {fitAssessment && fitColors && (
        <div className="mt-2 flex items-center gap-2 min-w-0">
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
    </article>
  );
}
