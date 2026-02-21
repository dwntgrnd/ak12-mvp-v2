import { DistrictListCard } from '@/components/shared/district-list-card';
import { TransparencyNote } from './transparency-note';
import { ProductLensSelector } from '@/components/discovery/product-lens-selector';
import type { CardSetContent, ResponseConfidence, ProductRelevance } from '@/services/types/discovery';

interface CardSetRendererProps {
  content: CardSetContent;
  confidence: ResponseConfidence;
  productRelevanceMap?: Record<string, ProductRelevance>;
  products: Array<{ productId: string; name: string }>;
  productLensId: string | undefined;
  onProductLensChange: (productId: string | undefined) => void;
  savedDistricts?: Set<string>;
  onSaveDistrict?: (districtId: string) => void;
  onRemoveSaved?: (districtId: string) => void;
  onGeneratePlaybook?: (districtId: string) => void;
}

export function CardSetRenderer({ content, productRelevanceMap, products, productLensId, onProductLensChange, savedDistricts, onSaveDistrict, onRemoveSaved, onGeneratePlaybook }: CardSetRendererProps) {
  const { overview, districts } = content;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
      {/* Overview text */}
      {overview && (
        <p className="text-body font-[400] leading-[1.6] text-foreground">{overview}</p>
      )}

      {/* Product lens selector */}
      {products.length > 0 && (
        <div className={`flex justify-end ${overview ? 'mt-4' : ''}`}>
          <ProductLensSelector
            products={products}
            selectedProductId={productLensId}
            onProductChange={onProductLensChange}
            variant="compact"
          />
        </div>
      )}

      {/* Single-column stacked list */}
      <div
        className={`flex flex-col gap-3 ${overview || products.length > 0 ? 'mt-4' : ''}`}
        role="list"
        aria-label="Districts matching your query"
      >
        {districts.map((entry) => (
          <DistrictListCard
            key={entry.districtId}
            districtId={entry.districtId}
            name={entry.name}
            location={entry.location}
            enrollment={entry.enrollment}
            variant="inset"
            productRelevance={productRelevanceMap?.[entry.districtId]}
            isSaved={savedDistricts?.has(entry.districtId)}
            onSave={onSaveDistrict}
            onRemoveSaved={onRemoveSaved}
            onGeneratePlaybook={onGeneratePlaybook}
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
          </DistrictListCard>
        ))}
      </div>
    </div>
  );
}
