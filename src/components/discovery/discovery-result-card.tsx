'use client';

import { useRouter } from 'next/navigation';
import { formatNumber } from '@/lib/utils/format';
import type { ProductRelevance } from '@/services/types/discovery';

interface DiscoveryResultCardProps {
  districtId: string;
  name: string;
  location?: string;
  enrollment?: number;
  variant?: 'surface' | 'inset';
  rank?: number;
  productRelevance?: ProductRelevance;
  children?: React.ReactNode;
}

const alignmentBadgeClass: Record<ProductRelevance['alignmentLevel'], string> = {
  strong:   'text-success bg-success/10',
  moderate: 'text-warning bg-warning/10',
  limited:  'text-slate-500 bg-slate-100',
  unknown:  'text-slate-500 bg-slate-100',
};

export function DiscoveryResultCard({
  districtId,
  name,
  location,
  enrollment,
  variant = 'surface',
  rank,
  productRelevance,
  children,
}: DiscoveryResultCardProps) {
  const router = useRouter();

  const variantClass =
    variant === 'inset'
      ? 'bg-slate-50 rounded-md hover:bg-slate-100 transition-colors duration-150'
      : 'bg-white border border-slate-200 rounded-lg shadow-sm hover:shadow-md hover:border-slate-300 transition-shadow duration-150';

  const ariaLabel = [
    rank != null ? `Rank ${rank}.` : null,
    name,
    location,
    enrollment != null ? `${formatNumber(enrollment)} students` : null,
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

  return (
    <article
      role="listitem"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={`cursor-pointer p-4 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7000] ${variantClass}`}
    >
      {rank != null && (
        <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center mb-2">
          <span className="text-caption font-[600] text-foreground">{rank}</span>
        </div>
      )}

      <div>
        <div className="text-subsection-heading font-semibold text-district-link leading-snug">{name}</div>
        {location && (
          <div className="text-caption text-muted-foreground mt-0.5">{location}</div>
        )}
        {enrollment != null && (
          <div className="text-caption text-muted-foreground">
            {formatNumber(enrollment)} students
          </div>
        )}
      </div>

      {children && <div className="mt-3">{children}</div>}

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
    </article>
  );
}
