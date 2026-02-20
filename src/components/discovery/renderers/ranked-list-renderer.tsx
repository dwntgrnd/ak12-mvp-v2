'use client';

import { useRouter } from 'next/navigation';
import { TransparencyNote } from './transparency-note';
import type { RankedListContent, ResponseConfidence } from '@/services/types/discovery';

interface RankedListRendererProps {
  content: RankedListContent;
  confidence: ResponseConfidence;
}

export function RankedListRenderer({ content }: RankedListRendererProps) {
  const router = useRouter();
  const { title, rankingCriterion, entries, synthesis } = content;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
      {/* Title */}
      <h2 className="text-[18px] font-[600] leading-[1.3] tracking-[-0.01em] text-foreground">
        {title}
      </h2>

      {/* Ranking criterion subtitle */}
      <p className="mt-1 text-[12px] font-[500] leading-[1.5] tracking-[0.025em] text-muted-foreground">
        Ranked by: {rankingCriterion}
      </p>

      {/* Entries list */}
      <div className="mt-6 space-y-3" role="list" aria-label={title}>
        {entries.map((entry) => {
          const handleClick = () => router.push(`/districts/${entry.districtId}`);
          const handleKeyDown = (e: React.KeyboardEvent) => {
            if (e.key === 'Enter') handleClick();
          };

          return (
            <div
              key={entry.districtId}
              role="listitem"
              tabIndex={0}
              onClick={handleClick}
              onKeyDown={handleKeyDown}
              aria-label={`Rank ${entry.rank}, ${entry.name}, ${entry.primaryMetric.label}: ${entry.primaryMetric.value}`}
              className="bg-slate-50 rounded-md p-4 cursor-pointer hover:bg-slate-100 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              {/* Top row: rank badge + district name */}
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
                  <span className="text-[12px] font-[600] text-foreground">{entry.rank}</span>
                </div>
                <span className="text-[14px] font-[600] leading-[1.6] text-foreground">
                  {entry.name}
                </span>
              </div>

              {/* Primary metric */}
              <div className="mt-2 flex items-baseline gap-2">
                <span className="text-[11px] font-[500] leading-[1.4] tracking-[0.05em] uppercase text-slate-400">
                  {entry.primaryMetric.label}
                </span>
                <span className="text-[14px] font-[600] leading-[1.6] text-foreground">
                  {entry.primaryMetric.value}
                </span>
              </div>

              {/* Secondary metrics */}
              {entry.secondaryMetrics && entry.secondaryMetrics.length > 0 && (
                <p className="mt-1 text-[12px] font-[500] leading-[1.5] tracking-[0.025em] text-muted-foreground">
                  {entry.secondaryMetrics.map((m, i) => (
                    <span key={i}>
                      {i > 0 && <span className="mx-1.5">·</span>}
                      {m.label}: {m.value}
                    </span>
                  ))}
                </p>
              )}

              {/* Confidence note */}
              {entry.confidenceNote && (
                <div className="mt-1.5">
                  <TransparencyNote note={entry.confidenceNote} level={entry.confidence} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Synthesis */}
      {synthesis && (
        <div className="mt-6 bg-slate-50 rounded-md p-4">
          <p className="text-[11px] font-[500] leading-[1.4] tracking-[0.05em] uppercase text-slate-400 mb-2">
            SYNTHESIS
          </p>
          <p className="text-[14px] font-[400] leading-[1.6] text-foreground">{synthesis}</p>
        </div>
      )}
    </div>
  );
}
