import { TransparencyNote } from './transparency-note';
import { DiscoveryResultCard } from '@/components/discovery/discovery-result-card';
import { ProductRelevanceBadge } from '@/components/discovery/product-relevance-badge';
import type { RankedListContent, ResponseConfidence, ProductRelevance } from '@/services/types/discovery';

interface RankedListRendererProps {
  content: RankedListContent;
  confidence: ResponseConfidence;
  productRelevanceMap?: Record<string, ProductRelevance>;
}

export function RankedListRenderer({ content, productRelevanceMap }: RankedListRendererProps) {
  const { title, rankingCriterion, entries, synthesis } = content;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
      {/* Title */}
      <h2 className="text-section-heading font-[600] leading-[1.3] tracking-[-0.01em] text-foreground">
        {title}
      </h2>

      {/* Ranking criterion subtitle */}
      <p className="mt-1 text-caption font-[500] leading-[1.5] tracking-[0.025em] text-muted-foreground">
        Ranked by: {rankingCriterion}
      </p>

      {/* Entries list */}
      <div className="mt-6 space-y-3" role="list" aria-label={title}>
        {entries.map((entry) => (
          <DiscoveryResultCard
            key={entry.districtId}
            districtId={entry.districtId}
            name={entry.name}
            variant="inset"
            rank={entry.rank}
            productRelevance={productRelevanceMap?.[entry.districtId]}
          >
            {/* Content slot: metrics */}
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-overline font-[500] leading-[1.4] tracking-[0.05em] uppercase text-slate-400">
                {entry.primaryMetric.label}
              </span>
              <span className="text-body font-[600] leading-[1.6] text-foreground">
                {entry.primaryMetric.value}
              </span>
            </div>
            {entry.secondaryMetrics && entry.secondaryMetrics.length > 0 && (
              <p className="mt-1 text-caption font-[500] leading-[1.5] tracking-[0.025em] text-muted-foreground">
                {entry.secondaryMetrics.map((m, i) => (
                  <span key={i}>
                    {i > 0 && <span className="mx-1.5">·</span>}
                    {m.label}: {m.value}
                  </span>
                ))}
              </p>
            )}
            {entry.confidenceNote && (
              <div className="mt-1.5">
                <TransparencyNote note={entry.confidenceNote} level={entry.confidence} />
              </div>
            )}
          </DiscoveryResultCard>
        ))}
      </div>

      {/* Synthesis */}
      {synthesis && (
        <div className="mt-6 bg-slate-50 rounded-md p-4">
          <p className="text-overline font-[500] leading-[1.4] tracking-[0.05em] uppercase text-slate-400 mb-2">
            SYNTHESIS
          </p>
          <p className="text-body font-[400] leading-[1.6] text-foreground">{synthesis}</p>
        </div>
      )}
    </div>
  );
}
