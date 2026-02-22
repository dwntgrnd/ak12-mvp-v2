'use client';

import { useState, useMemo, useCallback } from 'react';
import { TransparencyNote } from './transparency-note';
import { DistrictListCard } from '@/components/shared/district-list-card';
import { DistrictListingsContainer } from '@/components/shared/district-listings-container';
import { ProductLensSelector } from '@/components/discovery/product-lens-selector';
import { RANKED_LIST_CONFIG, type ActiveSort } from '@/components/shared/list-context-config';
import { sortBySnapshotField, filterBySnapshot, mapSortKeyToLabel } from '@/lib/utils/sort-utils';
import type { RankedListContent, ResponseConfidence, ProductAlignment } from '@/services/types/discovery';

interface RankedListRendererProps {
  content: RankedListContent;
  confidence: ResponseConfidence;
  productRelevanceMap?: Record<string, ProductAlignment>;
  products: Array<{ productId: string; name: string }>;
  productLensId: string | undefined;
  onProductLensChange: (productId: string | undefined) => void;
  activeSortMetric?: string;
  savedDistricts?: Set<string>;
  onSaveDistrict?: (districtId: string) => void;
  onRemoveSaved?: (districtId: string) => void;
  onGeneratePlaybook?: (districtId: string) => void;
}

export function RankedListRenderer({
  content,
  productRelevanceMap,
  products,
  productLensId,
  onProductLensChange,
  activeSortMetric,
  savedDistricts,
  onSaveDistrict,
  onRemoveSaved,
  onGeneratePlaybook,
}: RankedListRendererProps) {
  const { title, rankingCriterion, entries, synthesis } = content;

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

  // Data transformation pipeline
  const processed = useMemo(() => {
    let result = entries;

    // Text search
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((e) => e.name.toLowerCase().includes(q));
    }

    // Filters
    result = filterBySnapshot(result, filterValues);

    // Sort (null = original rank order)
    result = sortBySnapshotField(result, activeSort);

    return result;
  }, [entries, searchQuery, filterValues, activeSort]);

  // Derive active sort metric for card highlighting
  const derivedSortMetric =
    activeSortMetric ??
    (activeSort ? mapSortKeyToLabel(activeSort.key) : rankingCriterion);

  // Header slot
  const header = (
    <>
      <h2 className="text-lg font-semibold leading-[1.3] tracking-[-0.01em] text-foreground">
        {title}
      </h2>
      <p className="mt-1 text-xs font-medium leading-[1.5] tracking-[0.025em] text-muted-foreground">
        Ranked by: {rankingCriterion}
      </p>
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
    </>
  );

  // Footer slot (synthesis)
  const footer = synthesis ? (
    <div className="bg-slate-50 rounded-md p-4">
      <p className="text-overline font-medium leading-[1.4] tracking-[0.05em] uppercase text-slate-400 mb-2">
        SYNTHESIS
      </p>
      <p className="text-sm leading-[1.6] text-foreground">{synthesis}</p>
    </div>
  ) : undefined;

  return (
    <DistrictListingsContainer
      config={RANKED_LIST_CONFIG}
      header={header}
      footer={footer}
      resultCount={processed.length}
      totalCount={entries.length}
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
          rank={activeSort === null ? entry.rank : undefined}
          additionalMetrics={[entry.primaryMetric, ...(entry.secondaryMetrics || [])]}
          activeSortMetric={derivedSortMetric}
          productAlignment={productRelevanceMap?.[entry.districtId]}
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
    </DistrictListingsContainer>
  );
}
