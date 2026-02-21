import { TransparencyNote } from './transparency-note';
import { DistrictListCard } from '@/components/shared/district-list-card';
import { ProductLensSelector } from '@/components/discovery/product-lens-selector';
import type { RankedListContent, ResponseConfidence, ProductRelevance } from '@/services/types/discovery';

interface RankedListRendererProps {
  content: RankedListContent;
  confidence: ResponseConfidence;
  productRelevanceMap?: Record<string, ProductRelevance>;
  products: Array<{ productId: string; name: string }>;
  productLensId: string | undefined;
  onProductLensChange: (productId: string | undefined) => void;
  activeSortMetric?: string;
  savedDistricts?: Set<string>;
  onSaveDistrict?: (districtId: string) => void;
  onRemoveSaved?: (districtId: string) => void;
  onGeneratePlaybook?: (districtId: string) => void;
}

export function RankedListRenderer({ content, productRelevanceMap, products, productLensId, onProductLensChange, activeSortMetric, savedDistricts, onSaveDistrict, onRemoveSaved, onGeneratePlaybook }: RankedListRendererProps) {
  const { title, rankingCriterion, entries, synthesis } = content;

  // Derive active sort metric from ranking criterion if not explicitly provided
  const sortMetric = activeSortMetric ?? rankingCriterion;

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

      {/* Product lens selector */}
      {products.length > 0 && (
        <div className="mt-4 flex justify-end">
          <ProductLensSelector
            products={products}
            selectedProductId={productLensId}
            onProductChange={onProductLensChange}
            variant="compact"
          />
        </div>
      )}

      {/* Entries list */}
      <div className="mt-4 flex flex-col gap-2" role="list" aria-label={title}>
        {entries.map((entry) => (
          <DistrictListCard
            key={entry.districtId}
            districtId={entry.districtId}
            name={entry.name}
            variant="inset"
            rank={entry.rank}
            metrics={[entry.primaryMetric, ...(entry.secondaryMetrics || [])]}
            activeSortMetric={sortMetric}
            productRelevance={productRelevanceMap?.[entry.districtId]}
            isSaved={savedDistricts?.has(entry.districtId)}
            onSave={onSaveDistrict}
            onRemoveSaved={onRemoveSaved}
            onGeneratePlaybook={onGeneratePlaybook}
          >
            {entry.confidenceNote && (
              <TransparencyNote note={entry.confidenceNote} level={entry.confidence} />
            )}
          </DistrictListCard>
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
