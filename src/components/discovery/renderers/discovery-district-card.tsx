'use client';

import { useRouter } from 'next/navigation';
import { TransparencyNote } from './transparency-note';
import { formatNumber } from '@/lib/utils/format';
import type { CardSetEntry } from '@/services/types/discovery';

interface DiscoveryDistrictCardProps {
  entry: CardSetEntry;
}

export function DiscoveryDistrictCard({ entry }: DiscoveryDistrictCardProps) {
  const router = useRouter();

  const handleClick = () => router.push(`/districts/${entry.districtId}`);
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleClick();
  };

  const ariaLabel = entry.keyMetric
    ? `${entry.name}, ${entry.location}, ${entry.keyMetric.label}: ${entry.keyMetric.value}`
    : `${entry.name}, ${entry.location}`;

  return (
    <div
      role="listitem"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label={ariaLabel}
      className="bg-slate-50 rounded-md p-4 cursor-pointer hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
    >
      {/* District name */}
      <p className="text-[14px] font-[600] leading-[1.6] text-foreground">{entry.name}</p>

      {/* Location */}
      <p className="text-[12px] font-[500] leading-[1.5] tracking-[0.025em] text-muted-foreground">
        {entry.location}
      </p>

      {/* Key metric emphasis surface */}
      {entry.keyMetric && (
        <div className="bg-[#E0F9FC] rounded-md p-3 mt-3 flex items-baseline gap-2">
          <span className="text-[11px] font-[500] leading-[1.4] tracking-[0.05em] uppercase text-slate-400">
            {entry.keyMetric.label}
          </span>
          <span className="text-[14px] font-[600] leading-[1.6] text-foreground">
            {entry.keyMetric.value}
          </span>
        </div>
      )}

      {/* Enrollment */}
      {entry.enrollment !== undefined && (
        <p className="mt-2 text-[12px] font-[500] leading-[1.5] tracking-[0.025em] text-muted-foreground">
          Enrollment: {formatNumber(entry.enrollment)}
        </p>
      )}

      {/* Confidence note for level >= 3 */}
      {entry.confidence >= 3 && (
        <TransparencyNote note="Limited data coverage" level={entry.confidence} />
      )}
    </div>
  );
}
