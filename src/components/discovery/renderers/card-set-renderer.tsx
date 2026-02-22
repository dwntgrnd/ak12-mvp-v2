'use client';

import { useState, useMemo, useCallback } from 'react';
import { DistrictListCard } from '@/components/shared/district-list-card';
import { TransparencyNote } from './transparency-note';
import { DistrictListingsContainer } from '@/components/shared/district-listings-container';
import { ProductLensSelector } from '@/components/discovery/product-lens-selector';
import { CARD_SET_CONFIG, buildListContextConfig, type ActiveSort } from '@/components/shared/list-context-config';
import { sortBySnapshotField, filterBySnapshot, mapSortKeyToLabel } from '@/lib/utils/sort-utils';
import type { CardSetContent, ResponseConfidence, ProductAlignment } from '@/services/types/discovery';

interface CardSetRendererProps {
  content: CardSetContent;
  confidence: ResponseConfidence;
  productRelevanceMap?: Record<string, ProductAlignment>;
  products: Array<{ productId: string; name: string }>;
  productLensId: string | undefined;
  onProductLensChange: (productId: string | undefined) => void;
  hasProducts: boolean;
  activeSortMetric?: string;
  savedDistricts?: Set<string>;
  onSaveDistrict?: (districtId: string) => void;
  onRemoveSaved?: (districtId: string) => void;
  onGeneratePlaybook?: (districtId: string) => void;
}

export function CardSetRenderer({
  content,
  productRelevanceMap,
  products,
  productLensId,
  onProductLensChange,
  hasProducts,
  activeSortMetric,
  savedDistricts,
  onSaveDistrict,
  onRemoveSaved,
  onGeneratePlaybook,
}: CardSetRendererProps) {
  const { overview, districts } = content;

  const listConfig = useMemo(
    () => buildListContextConfig(CARD_SET_CONFIG, { hasProducts, productLensActive: !!productLensId }),
    [hasProducts, productLensId],
  );

  // State: search, sort, filters
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState<ActiveSort | null>(null);
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});

  const activeFilterCount = useMemo(
    () => Object.values(filterValues).reduce((sum, v) => sum + v.length, 0),
    [filterValues],
  );

  const handleFilterChange = useCallback((filterId: string, values: string[]) => {
    setFilterValues((prev) => ({ ...prev, [filterId]: values }));
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setFilterValues({});
  }, []);

  // Enrich entries with productAlignment for sort/filter utilities
  const enrichedDistricts = useMemo(
    () => districts.map((d) => ({ ...d, productAlignment: productRelevanceMap?.[d.districtId] })),
    [districts, productRelevanceMap],
  );

  // Data transformation pipeline
  const processed = useMemo(() => {
    let result = enrichedDistricts;

    // Text search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.snapshot.city.toLowerCase().includes(q) ||
          d.snapshot.county.toLowerCase().includes(q),
      );
    }

    // Filters
    result = filterBySnapshot(result, filterValues);

    // Sort (null = original API order)
    result = sortBySnapshotField(result, activeSort);

    return result;
  }, [enrichedDistricts, searchQuery, filterValues, activeSort]);

  const derivedSortMetric =
    activeSortMetric ?? (activeSort ? mapSortKeyToLabel(activeSort.key) : undefined);

  // Header slot
  const header = (
    <>
      {overview && (
        <p className="text-sm leading-[1.6] text-foreground">{overview}</p>
      )}
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
    </>
  );

  const showHeader = overview || products.length > 0;

  return (
    <DistrictListingsContainer
      config={listConfig}
      header={showHeader ? header : undefined}
      resultCount={processed.length}
      totalCount={districts.length}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      activeSort={activeSort}
      onSortChange={setActiveSort}
      filterValues={filterValues}
      onFilterChange={handleFilterChange}
      onClearAllFilters={handleClearAllFilters}
      activeFilterCount={activeFilterCount}
    >
      {processed.map((entry) => (
        <DistrictListCard
          key={entry.districtId}
          snapshot={entry.snapshot}
          variant="inset"
          additionalMetrics={entry.keyMetric ? [entry.keyMetric] : undefined}
          activeSortMetric={derivedSortMetric}
          productAlignment={productRelevanceMap?.[entry.districtId]}
          isSaved={savedDistricts?.has(entry.districtId)}
          onSave={onSaveDistrict}
          onRemoveSaved={onRemoveSaved}
          onGeneratePlaybook={onGeneratePlaybook}
        >
          {entry.confidence >= 3 && (
            <TransparencyNote note="Limited data coverage" level={entry.confidence} />
          )}
        </DistrictListCard>
      ))}
    </DistrictListingsContainer>
  );
}
