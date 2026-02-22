'use client';

import { useState, useMemo } from 'react';
import { DistrictListCard } from '@/components/shared/district-list-card';
import { TransparencyNote } from './transparency-note';
import { ProductLensSelector } from '@/components/discovery/product-lens-selector';
import { ListingsToolbar } from '@/components/shared/listings-toolbar';
import type { CardSetContent, ResponseConfidence, ProductAlignment, CardSetEntry } from '@/services/types/discovery';
import { formatNumber } from '@/lib/utils/format';

interface CardSetRendererProps {
  content: CardSetContent;
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
  { value: 'original', label: 'Default Order' },
  { value: 'name-asc', label: 'Name: A \u2192 Z' },
  { value: 'enrollment-desc', label: 'Enrollment: High \u2192 Low' },
  { value: 'enrollment-asc', label: 'Enrollment: Low \u2192 High' },
];

function sortEntries(entries: CardSetEntry[], sort: string): CardSetEntry[] {
  if (sort === 'original') return entries;
  const sorted = [...entries];
  switch (sort) {
    case 'name-asc':
      return sorted.sort((a, b) => a.name.localeCompare(b.name));
    case 'enrollment-desc':
      return sorted.sort((a, b) => b.snapshot.totalEnrollment - a.snapshot.totalEnrollment);
    case 'enrollment-asc':
      return sorted.sort((a, b) => a.snapshot.totalEnrollment - b.snapshot.totalEnrollment);
    default:
      return sorted;
  }
}

export function CardSetRenderer({ content, productRelevanceMap, products, productLensId, onProductLensChange, activeSortMetric, savedDistricts, onSaveDistrict, onRemoveSaved, onGeneratePlaybook }: CardSetRendererProps) {
  const { overview, districts } = content;

  const [searchQuery, setSearchQuery] = useState('');
  const [sortValue, setSortValue] = useState('original');

  const filtered = useMemo(() => {
    let result = districts;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.snapshot.city.toLowerCase().includes(q) ||
          d.snapshot.county.toLowerCase().includes(q),
      );
    }
    return sortEntries(result, sortValue);
  }, [districts, searchQuery, sortValue]);

  const derivedSortMetric =
    activeSortMetric ?? (sortValue.startsWith('enrollment') ? 'Enrollment' : undefined);

  return (
    <div className="bg-white border border-border rounded-lg shadow-sm">
      {/* Overview text + product lens */}
      {(overview || products.length > 0) && (
        <div className="p-5 pb-0">
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
        </div>
      )}

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
        {filtered.length !== districts.length && <> of {formatNumber(districts.length)}</>}
        {' '}{filtered.length === 1 ? 'district' : 'districts'}
      </div>

      {/* District list */}
      <div className="p-5">
        {filtered.length === 0 ? (
          <p className="py-8 text-center text-sm text-muted-foreground">
            No districts match your filter.
          </p>
        ) : (
          <div className="flex flex-col gap-2" role="list" aria-label="Districts matching your query">
            {filtered.map((entry) => (
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
          </div>
        )}
      </div>
    </div>
  );
}
