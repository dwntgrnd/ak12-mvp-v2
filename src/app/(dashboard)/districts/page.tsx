'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { useSavedDistricts } from '@/hooks/use-saved-districts';
import { useLibraryReadiness } from '@/hooks/use-library-readiness';
import { useProductLens } from '@/hooks/use-product-lens';
import { ProductLensSelector } from '@/components/discovery/product-lens-selector';
import { DistrictListCard } from '@/components/shared/district-list-card';
import { DistrictListingsContainer } from '@/components/shared/district-listings-container';
import {
  BROWSE_DISTRICTS_CONFIG,
  buildListContextConfig,
  type ActiveSort,
} from '@/components/shared/list-context-config';
import { GeneratePlaybookSheet } from '@/components/playbook/generate-playbook-sheet';
import { LibraryRequiredDialog } from '@/components/shared/library-required-dialog';
import { sortBySnapshotField, filterBySnapshot } from '@/lib/utils/sort-utils';
import { getDistrictService } from '@/services';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { DistrictSnapshot } from '@/services/types/district';
import type { MatchSummary } from '@/services/types/common';

const PAGE_SIZE = 25;

interface BrowseItem {
  districtId: string;
  snapshot: DistrictSnapshot;
  name: string;
}

export default function BrowseDistrictsPage() {
  // All districts
  const [allDistricts, setAllDistricts] = useState<BrowseItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Search, sort, filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState<ActiveSort | null>({ key: 'name', direction: 'asc' });
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  // Playbook sheet state
  const [playbookOpen, setPlaybookOpen] = useState(false);
  const [playbookDistrictId, setPlaybookDistrictId] = useState<string | null>(null);

  // Library required dialog state
  const [showLibraryDialog, setShowLibraryDialog] = useState(false);

  // Hooks
  const { savedDistrictIds, saveDistrict, removeSavedDistrict, isSaved } = useSavedDistricts();
  const readiness = useLibraryReadiness();
  const { activeProduct, setProduct, clearProduct } = useProductLens();
  const productLensId = activeProduct?.productId;

  // Match summaries for active lens
  const [matchSummaries, setMatchSummaries] = useState<Record<string, MatchSummary>>({});

  // Fetch all districts on mount
  useEffect(() => {
    let cancelled = false;
    fetch('/api/districts/browse')
      .then((res) => res.json())
      .then((data) => {
        if (cancelled) return;
        const items: BrowseItem[] = (data.items as DistrictSnapshot[]).map((snapshot) => ({
          districtId: snapshot.districtId,
          snapshot,
          name: snapshot.name,
        }));
        setAllDistricts(items);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  // Fetch match summaries when lens + districts change
  useEffect(() => {
    if (!productLensId || allDistricts.length === 0) {
      setMatchSummaries({});
      return;
    }
    const districtIds = allDistricts.map((d) => d.districtId);
    let cancelled = false;
    getDistrictService()
      .then((s) => s.getMatchSummaries(productLensId, districtIds))
      .then((result) => { if (!cancelled) setMatchSummaries(result); })
      .catch(() => { if (!cancelled) setMatchSummaries({}); });
    return () => { cancelled = true; };
  }, [productLensId, allDistricts]);

  // Dynamic list config with lens awareness
  const listConfig = useMemo(
    () => buildListContextConfig(BROWSE_DISTRICTS_CONFIG, {
      hasProducts: readiness.hasProducts,
      productLensActive: !!productLensId,
    }),
    [readiness.hasProducts, productLensId],
  );

  // Product lens change handler
  const handleProductLensChange = useCallback((productId: string | undefined) => {
    if (!productId) { clearProduct(); return; }
    const product = readiness.products.find((p) => p.productId === productId);
    if (product) setProduct(product);
  }, [readiness.products, setProduct, clearProduct]);

  // Product lens slot
  const productLensSlot = readiness.hasProducts ? (
    <ProductLensSelector
      products={readiness.products.map((p) => ({ productId: p.productId, name: p.name }))}
      selectedProductId={productLensId}
      onProductChange={handleProductLensChange}
      variant="compact"
    />
  ) : undefined;

  // Data pipeline: search -> filter -> sort
  const processed = useMemo(() => {
    let result = allDistricts;

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

    // Sort
    if (activeSort?.key === 'productFit') {
      const tierOrder: Record<string, number> = { strong: 0, moderate: 1, limited: 2 };
      const dir = activeSort.direction === 'asc' ? 1 : -1;
      result = [...result].sort((a, b) => {
        const aTier = matchSummaries[a.districtId]?.overallTier;
        const bTier = matchSummaries[b.districtId]?.overallTier;
        const aVal = aTier ? tierOrder[aTier] : 999;
        const bVal = bTier ? tierOrder[bTier] : 999;
        return dir * (aVal - bVal);
      });
    } else {
      result = sortBySnapshotField(result, activeSort);
    }

    return result;
  }, [allDistricts, searchQuery, filterValues, activeSort, matchSummaries]);

  // Reset page when filters/search/sort change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, filterValues, activeSort]);

  // Pagination derived values
  const totalPages = Math.max(1, Math.ceil(processed.length / PAGE_SIZE));
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return processed.slice(start, start + PAGE_SIZE);
  }, [processed, currentPage]);

  const handleFilterChange = useCallback((filterId: string, values: string[]) => {
    setFilterValues((prev) => ({ ...prev, [filterId]: values }));
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setFilterValues({});
  }, []);

  const handleGeneratePlaybook = useCallback((districtId: string) => {
    if (!readiness.hasProducts) {
      setShowLibraryDialog(true);
      return;
    }
    setPlaybookDistrictId(districtId);
    setPlaybookOpen(true);
  }, [readiness.hasProducts]);

  const handleSave = useCallback((districtId: string) => {
    saveDistrict(districtId);
  }, [saveDistrict]);

  const handleRemoveSaved = useCallback((districtId: string) => {
    removeSavedDistrict(districtId);
  }, [removeSavedDistrict]);

  // Resolve playbook district info
  const playbookDistrictInfo = useMemo(() => {
    if (!playbookDistrictId) return undefined;
    const d = allDistricts.find((item) => item.districtId === playbookDistrictId);
    if (!d) return undefined;
    return {
      districtId: d.districtId,
      districtName: d.snapshot.name,
      location: `${d.snapshot.city}, ${d.snapshot.state}`,
      enrollment: d.snapshot.totalEnrollment,
    };
  }, [allDistricts, playbookDistrictId]);

  // Pagination footer
  const paginationFooter = totalPages > 1 ? (
    <div className="flex items-center justify-between pt-2">
      <p className="text-xs text-foreground-secondary">
        Showing {((currentPage - 1) * PAGE_SIZE) + 1}–{Math.min(currentPage * PAGE_SIZE, processed.length)} of {processed.length} districts
      </p>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={page === currentPage ? 'default' : 'ghost'}
            size="sm"
            onClick={() => setCurrentPage(page)}
            className="min-w-[32px]"
            aria-label={`Page ${page}`}
            aria-current={page === currentPage ? 'page' : undefined}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  ) : null;

  // Loading state
  if (loading) {
    return (
      <DistrictListingsContainer
        config={listConfig}
        resultCount={0}
        searchQuery=""
        onSearchChange={() => {}}
        activeSort={null}
        onSortChange={() => {}}
        filterValues={{}}
        onFilterChange={() => {}}
        onClearAllFilters={() => {}}
        productLensSlot={productLensSlot}
        loading
        skeletonRows={6}
      >
        {null}
      </DistrictListingsContainer>
    );
  }

  return (
    <>
      <h1 className="text-2xl font-bold tracking-[-0.01em] text-foreground">Browse Districts</h1>
      <div className="mt-6">
        <DistrictListingsContainer
          config={listConfig}
          resultCount={processed.length}
          totalCount={allDistricts.length}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          activeSort={activeSort}
          onSortChange={setActiveSort}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          onClearAllFilters={handleClearAllFilters}
          productLensSlot={productLensSlot}
          footer={paginationFooter}
          emptyTitle="No districts match your search"
        >
          {paginatedItems.map((entry) => (
            <DistrictListCard
              key={entry.districtId}
              snapshot={entry.snapshot}
              variant="inset"
              matchSummary={matchSummaries[entry.districtId]}
              isSaved={isSaved(entry.districtId)}
              onSave={handleSave}
              onRemoveSaved={handleRemoveSaved}
              onGeneratePlaybook={handleGeneratePlaybook}
            />
          ))}
        </DistrictListingsContainer>
      </div>

      <GeneratePlaybookSheet
        open={playbookOpen}
        onOpenChange={setPlaybookOpen}
        initialDistrict={playbookDistrictInfo}
        initialProductIds={productLensId ? [productLensId] : undefined}
      />

      <LibraryRequiredDialog
        open={showLibraryDialog}
        onOpenChange={setShowLibraryDialog}
      />
    </>
  );
}
