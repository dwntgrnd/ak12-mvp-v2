import { DiscoveryDistrictCard } from './discovery-district-card';
import type { CardSetContent, ResponseConfidence } from '@/services/types/discovery';

interface CardSetRendererProps {
  content: CardSetContent;
  confidence: ResponseConfidence;
}

export function CardSetRenderer({ content }: CardSetRendererProps) {
  const { overview, districts } = content;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
      {/* Overview text */}
      {overview && (
        <p className="text-[14px] font-[400] leading-[1.6] text-foreground">{overview}</p>
      )}

      {/* Card grid */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${overview ? 'mt-4' : ''}`}
        role="list"
        aria-label="Districts matching your query"
      >
        {districts.map((entry) => (
          <DiscoveryDistrictCard key={entry.districtId} entry={entry} />
        ))}
      </div>
    </div>
  );
}
