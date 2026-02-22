'use client';

import { useState, useMemo } from 'react';
import { TransparencyNote } from './transparency-note';
import { DistrictListCard } from '@/components/shared/district-list-card';
import { ProductLensSelector } from '@/components/discovery/product-lens-selector';
import { ListingsToolbar } from '@/components/shared/listings-toolbar';
import type { RankedListContent, ResponseConfidence, ProductAlignment, RankedListEntry } from '@/services/types/discovery';
import { formatNumber } from '@/lib/utils/format';

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

const SORT_OPTIONS = [
  { value: 'rank', label: 'Original Rank' },
  { value: 'name-asc', label: 'Name: A \u2192 Z' },
  { value: 'enrollment-desc', label: 'Enrollment: High \u2192 Low' },
];

function sortEntries(entries: RankedListEntry[], sort: string): RankedListEntry[] {
  if (sort === 'rank') return entries;
  const sorted = [...entries];
  switch (sort) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'enrollment-desc':
      return sorted.sort((a, b) => b.snapshot.totalEnrollment - a.snapshot.totalEnrollment);
    default:
      return sorted;
  }
}

export function RankedListRenderer({ content, productRelevanceMap, products, productLensId, onProductLensChange, activeSortMetric, savedDistricts, onSaveDistrict, onRemoveSaved, onGeneratePlaybook }: RankedListRendererProps) {
  const { title, rankingCriterion, entries, synthesis } = content;

  const [searchQuery, setSearchQuery] = useState('');
  const [sortValue, setSortValue] = useState('rank');

  const filtered = useMemo(() => {
    let result = entries;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter((e) => e.name.toLowerCase().includes(q));
    }
    return sortEntries(result, sortValue);
  }, [entries, searchQuery, sortValue]);

  // Derive active sort metric from ranking criterion if not explicitly provided
  const sortMetric =
    activeSortMetric ??
    (sortValue === 'rank' ? rankingCriterion : undefined) ??
    (sortValue === 'enrollment-desc' ? 'Enrollment' : undefined);

  return (
    <div className="bg-white border border-border rounded-lg shadow-sm">
      {/* Header: title + ranking criterion + product lens */}
      <div className="p-5 pb-0">
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
      </div>

      {/* Toolbar */}
      <div className="px-5 pt-4 pb-3 border-b border-border/50">
        <ListingsToolbar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          searchPlaceholder="Filter districts..."
          filters={[]}
          filterValues={{}}
          onFilterChange={() => {}}
          sortOptions={SORT_OPTIONS}
          sortValue={sortValue}
          onSortChange={setSortValue}
        />
      </div>

      {/* Count strip */}
      <div className="px-5 py-2 text-xs font-medium text-muted-foreground border-b border-border/50 bg-slate-50/50">
        <span className="text-foreground font-semibold">{formatNumber(filtered.length)}</span>
        {filtered.length !== entries.length && <> of {formatNumber(entries.length)}</>}
        {' '}{filtered.length === 1 ? 'district' : 'districts'}
      </div>

      {/* Entries list */}
      <div className="p-5">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No districts match your filter.
          </p>
        ) : (
          <div className="flex flex-col gap-2" role="list" aria-label={title}>
            {filtered.map((entry) => (
              <DistrictListCard
                key={entry.districtId}
                snapshot={entry.snapshot}
                variant="inset"
                rank={sortValue === 'rank' ? entry.rank : undefined}
                additionalMetrics={[entry.primaryMetric, ...(entry.secondaryMetrics || [])]}
                activeSortMetric={sortMetric}
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
          </div>
        )}
      </div>

      {/* Synthesis */}
      {synthesis && (
        <div className="mx-5 mb-5 bg-slate-50 rounded-md p-4">
          <p className="text-overline font-medium leading-[1.4] tracking-[0.05em] uppercase text-slate-400 mb-2">
            SYNTHESIS
          </p>
          <p className="text-sm leading-[1.6] text-foreground">{synthesis}</p>
        </div>
      )}
    </div>
  );
}
