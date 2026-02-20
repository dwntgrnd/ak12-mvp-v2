import { DiscoveryResultCard } from '@/components/discovery/discovery-result-card';
import { TransparencyNote } from './transparency-note';
import type { CardSetContent, ResponseConfidence, ProductRelevance } from '@/services/types/discovery';

interface CardSetRendererProps {
  content: CardSetContent;
  confidence: ResponseConfidence;
  productRelevanceMap?: Record<string, ProductRelevance>;
}

export function CardSetRenderer({ content, productRelevanceMap }: CardSetRendererProps) {
  const { overview, districts } = content;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
      {/* Overview text */}
      {overview && (
        <p className="text-body font-[400] leading-[1.6] text-foreground">{overview}</p>
      )}

      {/* Single-column stacked list */}
      <div
        className={`flex flex-col gap-3 ${overview ? 'mt-4' : ''}`}
        role="list"
        aria-label="Districts matching your query"
      >
        {districts.map((entry) => (
          <DiscoveryResultCard
            key={entry.districtId}
            districtId={entry.districtId}
            name={entry.name}
            location={entry.location}
            enrollment={entry.enrollment}
            variant="inset"
            productRelevance={productRelevanceMap?.[entry.districtId]}
          >
            {/* Content slot: key metric emphasis surface */}
            {entry.keyMetric && (
              <div className="bg-[#E0F9FC] rounded-md p-3 mt-3 flex items-baseline gap-2">
                <span className="text-overline font-[500] leading-[1.4] tracking-[0.05em] uppercase text-slate-400">
                  {entry.keyMetric.label}
                </span>
                <span className="text-body font-[600] leading-[1.6] text-foreground">
                  {entry.keyMetric.value}
                </span>
              </div>
            )}
            {entry.confidence >= 3 && (
              <div className="mt-2">
                <TransparencyNote note="Limited data coverage" level={entry.confidence} />
              </div>
            )}
          </DiscoveryResultCard>
        ))}
      </div>
    </div>
  );
}
