# SS51-09: Discovery Browse Mode

**Session:** SS-51
**Depends on:** None (additive to existing discovery page)
**Priority:** Top of stack — front of line per Doren's instruction

---

## Context

The discovery entry state currently has a single path: type a query. Reps who already know their territory and want to pull up a specific district quickly are forced through a natural language input when a traditional search/filter catalog would be faster.

**Solution:** Add a secondary "Browse all districts" link on the discovery entry state that transitions to a full district catalog using the existing `DistrictListingsContainer` + `DistrictListCard` components. No new route, no sidebar item — browse is a mode within discovery.

**Design intent:** Browse is visually subordinate to the query input. One text link below the helper text. The intelligence layer (query mode) remains the primary path; browse is the pragmatic alternative for territory-familiar reps.

---

## Requirements

### 1. Add mock browse method and API route

**Why:** `DistrictListCard` requires `DistrictSnapshot` (rich: enrollment, FRPM%, ELL%, proficiency, grades, docType). The existing `searchDistricts` returns `DistrictSummary` (lightweight: name, state, location, enrollment). Browse mode needs the full snapshot shape for all districts.

#### Add to mock district service: `src/services/providers/mock/mock-district-service.ts`

Add a `browseDistricts` method directly on the `mockDistrictService` object. This is **not** added to `IDistrictService` interface — it's a mock convenience until Service Contracts v3.0 formalizes it.

```typescript
async browseDistricts(): Promise<DistrictSnapshot[]> {
  await delay(400);
  return MOCK_DISTRICTS.map((d) => buildSnapshot(d));
}
```

Import `buildSnapshot` from `./snapshot-builder` and `DistrictSnapshot` from the types. Import `MOCK_DISTRICTS` if not already imported (it is).

#### Create API route: `src/app/api/districts/browse/route.ts`

```typescript
import { NextResponse } from 'next/server';
import { MOCK_DISTRICTS } from '@/services/providers/mock/fixtures/districts';
import { buildSnapshot } from '@/services/providers/mock/snapshot-builder';

export async function GET() {
  try {
    // Direct mock access — when real backend exists, this calls the service interface
    const snapshots = MOCK_DISTRICTS.map((d) => buildSnapshot(d));
    return NextResponse.json({ items: snapshots, totalCount: snapshots.length });
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Note:** This route imports mock fixtures directly — acceptable for MVP. When the real backend exists, it calls the service interface method that replaces this. The route itself stays, only the implementation changes.

---

### 2. Add browse list config: `src/components/shared/list-context-config.ts`

Add a new preset config after `SAVED_DISTRICTS_CONFIG`:

```typescript
export const BROWSE_ALL_CONFIG: ListContextConfig = {
  columns: [
    { key: 'name', label: 'District', minWidth: 'min-w-0', sortable: true },
    ...SHARED_METRIC_COLUMNS,
  ],
  availableFilters: SHARED_FILTERS,
  showLocalFilter: true,
  showColumnHeaders: false,
  searchPlaceholder: 'Search by name, city, or county...',
  sortOptions: [
    { key: 'name', label: 'District Name' },
    ...SHARED_SORT_OPTIONS.filter(o => o.key !== 'name'),
  ],
};
```

Export it alongside the other configs.

---

### 3. Modify discovery entry state: `src/components/discovery/discovery-entry-state.tsx`

Add a `onBrowseAll` callback prop and render a browse link below the helper text.

```typescript
interface DiscoveryEntryStateProps {
  onQuerySubmit: (query: string) => void;
  onDirectNavigation: (districtId: string) => void;
  onBrowseAll: () => void;  // NEW
}
```

Add this JSX after the existing helper `<p>` element:

```tsx
{/* Browse all link */}
<button
  onClick={onBrowseAll}
  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors"
>
  Browse all districts
  <ArrowRight className="h-3.5 w-3.5" />
</button>
```

Import `ArrowRight` from `lucide-react`.

**Visual hierarchy:** The link sits below the helper text, smaller and muted. It uses `text-foreground-secondary` (not brand color) to avoid competing with the input. The hover transitions to `text-foreground` for subtle interactivity feedback. No underline, no button chrome — it reads as a secondary action.

---

### 4. Create browse view component: `src/components/discovery/discovery-browse-view.tsx`

This component renders the full district catalog. Follow the saved districts page (`src/app/(dashboard)/saved/page.tsx`) as the structural template — same data pipeline pattern (fetch → search → filter → sort), same `DistrictListingsContainer` usage.

```typescript
'use client';

import { useState, useMemo, useCallback, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { DistrictListCard } from '@/components/shared/district-list-card';
import { DistrictListingsContainer } from '@/components/shared/district-listings-container';
import { ProductLensSelector } from '@/components/discovery/product-lens-selector';
import {
  BROWSE_ALL_CONFIG,
  buildListContextConfig,
  type ActiveSort,
} from '@/components/shared/list-context-config';
import { sortBySnapshotField, filterBySnapshot } from '@/lib/utils/sort-utils';
import { Skeleton } from '@/components/ui/skeleton';
import type { DistrictSnapshot } from '@/services/types/district';
import type { MatchSummary } from '@/services/types/common';
```

**Props:**

```typescript
interface DiscoveryBrowseViewProps {
  onBackToEntry: () => void;
  // Product lens (passed down from discovery page, same as results view)
  products: Array<{ productId: string; name: string }>;
  productLensId: string | undefined;
  onProductLensChange: (productId: string | undefined) => void;
  hasProducts: boolean;
  matchSummaries: Record<string, MatchSummary>;
  // Saved districts integration
  savedDistricts: Set<string>;
  onSaveDistrict: (districtId: string) => void;
  onRemoveSaved: (districtId: string) => void;
  onGeneratePlaybook: (districtId: string) => void;
}
```

**Internal state:**

```typescript
const [snapshots, setSnapshots] = useState<DistrictSnapshot[]>([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(false);
const [searchQuery, setSearchQuery] = useState('');
const [activeSort, setActiveSort] = useState<ActiveSort | null>({ key: 'name', direction: 'asc' });
const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
```

**Data fetching on mount:**

```typescript
useEffect(() => {
  setLoading(true);
  fetch('/api/districts/browse')
    .then((res) => res.json())
    .then((data) => {
      setSnapshots(data.items || []);
      setLoading(false);
    })
    .catch(() => {
      setError(true);
      setLoading(false);
    });
}, []);
```

**Data pipeline (same pattern as saved districts):**

1. Text search: filter `snapshots` by `name`, `city`, `county` (case-insensitive substring match)
2. Filter: apply `filterBySnapshot(result, filterValues)` from sort-utils
3. Sort: apply `sortBySnapshotField(result, activeSort)` from sort-utils — with one addition: if `activeSort.key === 'matchTier'`, sort by match tier (same logic as saved districts page)

**Dynamic list config:**

```typescript
const listConfig = useMemo(
  () => buildListContextConfig(BROWSE_ALL_CONFIG, {
    hasProducts,
    productLensActive: !!productLensId,
  }),
  [hasProducts, productLensId],
);
```

**Product lens slot:**

```typescript
const productLensSlot = hasProducts ? (
  <ProductLensSelector
    products={products}
    selectedProductId={productLensId}
    onProductChange={onProductLensChange}
    variant="compact"
  />
) : undefined;
```

**Layout:**

```tsx
<div className="mx-auto max-w-content px-6 py-8">
  {/* Back link */}
  <button
    onClick={onBackToEntry}
    className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-secondary hover:text-foreground transition-colors mb-4"
  >
    <ArrowLeft className="h-3.5 w-3.5" />
    Back to Discovery
  </button>

  {/* Title */}
  <h1 className="text-2xl font-bold tracking-[-0.01em] text-foreground">
    All Districts
  </h1>
  <p className="mt-1 text-sm text-foreground-secondary">
    Browse the full district catalog. Use search and filters to narrow results.
  </p>

  {/* Listings */}
  <div className="mt-6">
    <DistrictListingsContainer
      config={listConfig}
      resultCount={processed.length}
      totalCount={snapshots.length}
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      activeSort={activeSort}
      onSortChange={setActiveSort}
      filterValues={filterValues}
      onFilterChange={handleFilterChange}
      onClearAllFilters={handleClearAllFilters}
      productLensSlot={productLensSlot}
      loading={loading}
      skeletonRows={8}
      emptyTitle="No districts match your search"
      emptyDescription="Try adjusting your search terms or filters."
    >
      {processed.map((snapshot) => (
        <DistrictListCard
          key={snapshot.districtId}
          snapshot={snapshot}
          variant="inset"
          matchSummary={matchSummaries[snapshot.districtId]}
          isSaved={savedDistricts.has(snapshot.districtId)}
          onSave={onSaveDistrict}
          onRemoveSaved={onRemoveSaved}
          onGeneratePlaybook={onGeneratePlaybook}
        />
      ))}
    </DistrictListingsContainer>
  </div>
</div>
```

**Error state:** Same pattern as other pages — centered message with retry button.

---

### 5. Wire browse mode into discovery page: `src/app/(dashboard)/discovery/page.tsx`

#### Expand page state type:

```typescript
type DiscoveryPageState = 'entry' | 'loading' | 'results' | 'browse';
```

#### Add browse transition handler:

```typescript
function handleBrowseAll() {
  setPageState('browse');
}
```

#### Add match summary fetching for browse mode:

When `pageState === 'browse'` and lens is active, fetch match summaries for all browsed districts. Add a `browseDistrictIds` state that gets set when the browse view loads its snapshots. The simplest approach: let the browse view component manage its own match summary fetching internally (it already receives `productLensId` and can react to it).

**Actually, simplify:** The browse view should fetch match summaries itself when the lens changes, same pattern as saved districts. The discovery page passes `productLensId` and the browse view component handles the fetch internally.

Update the browse view component to include match summary fetching:

```typescript
// Inside DiscoveryBrowseView
const [localMatchSummaries, setLocalMatchSummaries] = useState<Record<string, MatchSummary>>({});

useEffect(() => {
  if (!productLensId || snapshots.length === 0) {
    setLocalMatchSummaries({});
    return;
  }
  const districtIds = snapshots.map(s => s.districtId);
  let cancelled = false;
  getDistrictService()
    .then(s => s.getMatchSummaries(productLensId, districtIds))
    .then(result => { if (!cancelled) setLocalMatchSummaries(result); })
    .catch(() => { if (!cancelled) setLocalMatchSummaries({}); });
  return () => { cancelled = true; };
}, [productLensId, snapshots]);
```

Then use `localMatchSummaries` for the card props instead of `matchSummaries` from props. **Remove `matchSummaries` from the props interface** — the browse view is self-contained for match data.

Import `getDistrictService` from `@/services`.

#### Update entry state rendering:

```tsx
{pageState === 'entry' && (
  <DiscoveryEntryState
    onQuerySubmit={handleQuerySubmit}
    onDirectNavigation={handleDirectNavigation}
    onBrowseAll={handleBrowseAll}
  />
)}
```

#### Add browse state rendering:

```tsx
{pageState === 'browse' && (
  <DiscoveryBrowseView
    onBackToEntry={handleClearResults}
    products={products}
    productLensId={productLensId}
    onProductLensChange={handleProductLensChange}
    hasProducts={readiness.hasProducts}
    savedDistricts={savedDistrictIds}
    onSaveDistrict={saveDistrict}
    onRemoveSaved={removeSavedDistrict}
    onGeneratePlaybook={handleGeneratePlaybook}
  />
)}
```

Import `DiscoveryBrowseView` from `@/components/discovery/discovery-browse-view`.

The `handleClearResults` function already resets to entry state — it works for browse → entry transition too.

---

### 6. Do NOT

- Add a sidebar navigation item for browse. It lives within discovery.
- Add a new top-level route. Browse is a page state, not a route.
- Add URL state (`?mode=browse`). Nice-to-have for deep linking but not needed for MVP. The entry state is always the default on page load.
- Modify `IDistrictService` interface. The browse endpoint is a mock shortcut. Service Contracts v3.0 will formalize it.
- Add column headers to the browse view. The `showColumnHeaders: false` in the config keeps it consistent with other list views.

---

## Verification

1. `npm run build` passes.
2. Discovery entry state shows "Browse all districts →" link below the helper text.
3. Clicking the link transitions to browse mode showing all districts (~50) in a scrollable list.
4. Search by name, city, or county filters the list in real time.
5. Sort dropdown works (name, enrollment, FRPM, ELL, academic).
6. Filter popovers work (grade band, district type, enrollment range).
7. "Back to Discovery" link returns to entry state.
8. Product lens integration: activating a lens shows match tier badges on browse cards.
9. Save/unsave toggle works on browse cards.
10. "Generate Playbook" button works on browse cards.
11. Clicking a district card navigates to `/districts/[districtId]` (same as all other list views).
12. Entry state input still works normally — typing a query transitions to loading → results as before.
13. The browse link is visually subordinate to the input (muted color, smaller than input).

---

## Files

| Action | File |
|--------|------|
| Modify | `src/services/providers/mock/mock-district-service.ts` |
| Create | `src/app/api/districts/browse/route.ts` |
| Modify | `src/components/shared/list-context-config.ts` |
| Modify | `src/components/discovery/discovery-entry-state.tsx` |
| Create | `src/components/discovery/discovery-browse-view.tsx` |
| Modify | `src/app/(dashboard)/discovery/page.tsx` |
