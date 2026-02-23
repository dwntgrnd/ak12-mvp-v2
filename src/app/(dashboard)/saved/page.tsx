'use client';

import { useState, useMemo, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useSavedDistricts } from '@/hooks/use-saved-districts';
import { useLibraryReadiness } from '@/hooks/use-library-readiness';
import { DistrictListCard } from '@/components/shared/district-list-card';
import { DistrictListingsContainer } from '@/components/shared/district-listings-container';
import { SAVED_DISTRICTS_CONFIG, type ActiveSort } from '@/components/shared/list-context-config';
import { GeneratePlaybookSheet } from '@/components/playbook/generate-playbook-sheet';
import { LibraryRequiredDialog } from '@/components/shared/library-required-dialog';
import { sortBySnapshotField, filterBySnapshot } from '@/lib/utils/sort-utils';

export default function SavedDistrictsPage() {
  const router = useRouter();

  // Search, sort, filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState<ActiveSort | null>({ key: 'savedAt', direction: 'desc' });
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});

  // Playbook sheet state
  const [playbookOpen, setPlaybookOpen] = useState(false);
  const [playbookDistrictId, setPlaybookDistrictId] = useState<string | null>(null);

  // Library required dialog state
  const [showLibraryDialog, setShowLibraryDialog] = useState(false);

  // Hooks
  const { savedDistricts, removeSavedDistrict, loading } = useSavedDistricts();
  const readiness = useLibraryReadiness();

  // Enrich with top-level `name` for HasSnapshot compatibility
  const enriched = useMemo(
    () => savedDistricts.map((sd) => ({ ...sd, name: sd.snapshot.name })),
    [savedDistricts],
  );

  // Data pipeline: search → filter → sort
  const processed = useMemo(() => {
    let result = enriched;

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
    if (activeSort?.key === 'savedAt') {
      const dir = activeSort.direction === 'asc' ? 1 : -1;
      result = [...result].sort((a, b) => dir * a.savedAt.localeCompare(b.savedAt));
    } else {
      result = sortBySnapshotField(result, activeSort);
    }

    return result;
  }, [enriched, searchQuery, filterValues, activeSort]);

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

  // Resolve playbook district info
  const playbookDistrictInfo = useMemo(() => {
    if (!playbookDistrictId) return undefined;
    const sd = savedDistricts.find((d) => d.districtId === playbookDistrictId);
    if (!sd) return undefined;
    return {
      districtId: sd.districtId,
      districtName: sd.snapshot.name,
      location: `${sd.snapshot.city}, ${sd.snapshot.state}`,
      enrollment: sd.snapshot.totalEnrollment,
    };
  }, [savedDistricts, playbookDistrictId]);

  // Has any filters/search active — determines empty state variant
  const hasActiveFilters = searchQuery.length > 0 || Object.values(filterValues).some((v) => v.length > 0);

  // Loading state
  if (loading) {
    return (
      <div className="mx-auto max-w-content px-6 py-8">
        <h1 className="text-2xl font-bold tracking-[-0.01em] text-foreground">Saved Districts</h1>
        <div className="mt-6">
          <DistrictListingsContainer
            config={SAVED_DISTRICTS_CONFIG}
            resultCount={0}
            searchQuery=""
            onSearchChange={() => {}}
            activeSort={null}
            onSortChange={() => {}}
            filterValues={{}}
            onFilterChange={() => {}}
            onClearAllFilters={() => {}}
            loading
            skeletonRows={4}
          >
            {null}
          </DistrictListingsContainer>
        </div>
      </div>
    );
  }

  // Empty state — no saved districts at all
  if (savedDistricts.length === 0 && !hasActiveFilters) {
    return (
      <div className="mx-auto max-w-content px-6 py-8">
        <h1 className="text-2xl font-bold tracking-[-0.01em] text-foreground">Saved Districts</h1>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 py-16">
          <Bookmark className="h-12 w-12 text-foreground-tertiary" />
          <h2 className="text-lg font-semibold tracking-[-0.01em] text-foreground">No saved districts yet</h2>
          <p className="text-sm text-foreground-secondary">
            Save districts from Discovery or district profiles to track them here.
          </p>
          <Button variant="outline" className="mt-3" onClick={() => router.push('/discovery')}>
            Go to Discovery
          </Button>
        </div>
      </div>
    );
  }

  // Main list view
  return (
    <>
      <div className="mx-auto max-w-content px-6 py-8">
        <h1 className="text-2xl font-bold tracking-[-0.01em] text-foreground">Saved Districts</h1>
        <div className="mt-6">
          <DistrictListingsContainer
            config={SAVED_DISTRICTS_CONFIG}
            resultCount={processed.length}
            totalCount={savedDistricts.length}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeSort={activeSort}
            onSortChange={setActiveSort}
            filterValues={filterValues}
            onFilterChange={handleFilterChange}
            onClearAllFilters={handleClearAllFilters}
            emptyTitle="No districts match your search"
          >
            {processed.map((entry) => (
              <DistrictListCard
                key={entry.districtId}
                snapshot={entry.snapshot}
                variant="inset"
                isSaved
                onRemoveSaved={removeSavedDistrict}
                onGeneratePlaybook={handleGeneratePlaybook}
              />
            ))}
          </DistrictListingsContainer>
        </div>
      </div>

      <GeneratePlaybookSheet
        open={playbookOpen}
        onOpenChange={setPlaybookOpen}
        initialDistrict={playbookDistrictInfo}
      />

      <LibraryRequiredDialog
        open={showLibraryDialog}
        onOpenChange={setShowLibraryDialog}
      />
    </>
  );
}
