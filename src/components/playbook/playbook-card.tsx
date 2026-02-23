'use client';

import Link from 'next/link';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { fitCategoryColors, type FitCategoryKey } from '@/lib/design-tokens';

interface PlaybookCardProps {
  playbook: {
    playbookId: string;
    districtName: string;
    fitAssessment: { fitScore: number; fitRationale: string };
    productNames: string[];
    generatedAt: string;
    overallStatus: 'generating' | 'complete' | 'partial' | 'failed';
  };
}

function getFitCategory(fitScore: number): FitCategoryKey {
  if (fitScore >= 7) return 'strong';
  if (fitScore >= 4) return 'moderate';
  return 'low';
}

function formatProducts(productNames: string[]): string {
  if (productNames.length <= 2) {
    return productNames.join(' · ');
  }
  return `${productNames.slice(0, 2).join(' · ')} · +${productNames.length - 2} more`;
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function PlaybookCard({ playbook }: PlaybookCardProps) {
  const fitCategory = getFitCategory(playbook.fitAssessment.fitScore);
  const fitColors = fitCategoryColors[fitCategory];
  const dateFormatted = formatDate(playbook.generatedAt);
  const productsFormatted = formatProducts(playbook.productNames);

  const ariaLabel = `${playbook.districtName}, ${fitColors.label}, ${playbook.productNames.length} product${playbook.productNames.length !== 1 ? 's' : ''}, ${playbook.overallStatus === 'failed' ? 'error' : playbook.overallStatus}, ${dateFormatted}`;

  return (
    <Link
      href={`/playbooks/${playbook.playbookId}`}
      className="relative block rounded-lg border bg-card p-5 hover:shadow-md transition-shadow cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7000]"
      aria-label={ariaLabel}
    >
      {/* Status badge — top-right, only for non-complete statuses */}
      {playbook.overallStatus === 'generating' && (
        <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 text-xs font-medium text-[#FF7000]">
          <span
            className="inline-block h-2 w-2 rounded-full bg-[#FF7000] motion-safe:animate-pulse"
            aria-hidden="true"
          />
          Generating
        </span>
      )}
      {playbook.overallStatus === 'failed' && (
        <span className="absolute top-4 right-4 inline-flex items-center gap-1.5 text-xs font-medium text-red-500">
          <span
            className="inline-block h-2 w-2 rounded-full bg-red-500"
            aria-hidden="true"
          />
          Error
        </span>
      )}

      {/* District name */}
      <h3 className="text-lg font-semibold text-foreground truncate mb-2 pr-24">
        {playbook.districtName}
      </h3>

      {/* Fit badge */}
      <div className="mb-3">
        <Badge
          variant="outline"
          className={cn(
            fitColors.bg,
            fitColors.text,
            fitColors.border,
            'text-xs font-medium'
          )}
        >
          {fitColors.label}
        </Badge>
      </div>

      {/* Products */}
      <p className="text-sm text-foreground-secondary mb-2">
        {productsFormatted}
      </p>

      {/* Date */}
      <p className="text-xs text-foreground-secondary">
        {dateFormatted}
      </p>
    </Link>
  );
}
