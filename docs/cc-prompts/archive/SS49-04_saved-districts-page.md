# SS49-04: Build Saved Districts Page

**Source:** SS-49 Saved Districts audit
**Scope:** Replace 1 file, add 1 config preset
**Depends on:** SS49-01 (API route + `useSavedDistricts` hook)

---

## Problem

The Saved Districts page (`src/app/(dashboard)/saved/page.tsx`) is an empty shell — a single `<p>` tag. It needs to display the user's saved districts as a filterable, sortable list using existing shared infrastructure.

## Changes

### 1. Add config preset to `src/components/shared/list-context-config.ts`

Add a new `SAVED_DISTRICTS_CONFIG` preset after the existing `CARD_SET_CONFIG`:

```typescript
export const SAVED_DISTRICTS_CONFIG: ListContextConfig = {
  columns: [
    { key: 'name', label: 'District', minWidth: 'min-w-0', sortable: true },
    ...SHARED_METRIC_COLUMNS,
  ],
  availableFilters: SHARED_FILTERS,
  showLocalFilter: false,
  showColumnHeaders: false,
  searchPlaceholder: 'Search saved districts...',
  sortOptions: [
    { key: 'savedAt', label: 'Date Saved' },
    ...SHARED_SORT_OPTIONS,
  ],
};
```

Note: `savedAt` sort option is specific to this context. The sort utility function (`sortBySnapshotField` in `src/lib/utils/sort-utils.ts`) may not handle `savedAt` — see "Sort by savedAt" section below.

### 2. Replace `src/app/(dashboard)/saved/page.tsx`

Full rewrite. Requirements:

**Data:**
- Import and use `useSavedDistricts` hook for data + save/remove actions
- Districts come as `SavedDistrict[]` (each has `.snapshot: DistrictSnapshot` and `.savedAt: string`)

**Layout:**
- Page title: `<h1>` "Saved Districts" with `text-2xl font-bold text-foreground`
- Below title: result count text (e.g., "3 districts" or "2 of 5 districts" when filtered)
- Use `DistrictListingsContainer` with `SAVED_DISTRICTS_CONFIG` for search/sort/filter toolbar
- Render `DistrictListCard` for each saved district, using `snapshot` prop from `SavedDistrict`
- Pass `isSaved={true}` always (they're all saved on this page)
- Pass `onRemoveSaved={removeSavedDistrict}` from the hook
- Do NOT pass `onSave` — districts on this page are already saved
- Pass `onGeneratePlaybook` — use same pattern as Discovery page (open `GeneratePlaybookSheet`, check library readiness first)

**States:**
- **Loading:** Show skeleton grid (3-4 skeleton cards) while hook hydrates
- **Empty (no saved districts):** Centered empty state with:
  - Bookmark icon (from lucide-react, `h-12 w-12 text-foreground-tertiary`)
  - Heading: "No saved districts yet"
  - Description: "Save districts from Discovery or district profiles to track them here."
  - CTA button: "Go to Discovery" linking to `/discovery`
- **Empty after filter/search:** "No districts match your search" with clear filters action

**Sort by `savedAt`:**
- The existing `sortBySnapshotField` utility in `src/lib/utils/sort-utils.ts` operates on snapshot fields. It won't know about `savedAt`.
- For this page, add a local sort handler: if `activeSort.key === 'savedAt'`, sort by `savedAt` ISO string (string comparison works for ISO dates). For all other keys, delegate to `sortBySnapshotField`.
- Default sort on page load: `savedAt` descending (most recently saved first). Set initial `activeSort` to `{ key: 'savedAt', direction: 'desc' }`.

**Playbook integration:**
- Include `GeneratePlaybookSheet` and `LibraryRequiredDialog` (same pattern as Discovery page)
- `handleGeneratePlaybook` checks `readiness.hasProducts` before opening sheet
- Import `useLibraryReadiness` for the products check

**Component imports needed:**
- `useSavedDistricts` from `@/hooks/use-saved-districts`
- `useLibraryReadiness` from `@/hooks/use-library-readiness`
- `DistrictListCard` from `@/components/shared/district-list-card`
- `DistrictListingsContainer` from `@/components/shared/district-listings-container`
- `SAVED_DISTRICTS_CONFIG` from `@/components/shared/list-context-config`
- `GeneratePlaybookSheet` from `@/components/playbook/generate-playbook-sheet`
- `LibraryRequiredDialog` from `@/components/shared/library-required-dialog`
- `Button` from `@/components/ui/button`
- `Skeleton` from `@/components/ui/skeleton`
- `Bookmark` from `lucide-react`
- `sortBySnapshotField`, `filterBySnapshot` from `@/lib/utils/sort-utils`
- Type `ActiveSort` from `@/components/shared/list-context-config`

Add `'use client'` directive — this page uses hooks.

## Verification

1. `npm run build` passes
2. Navigate to `/saved` — shows empty state with Bookmark icon and "Go to Discovery" CTA
3. Save a district from Discovery or district profile
4. Navigate to `/saved` — district appears with snapshot data in card format
5. Search filters the list
6. Sort by "Date Saved" works (most recent first by default)
7. Click "Saved" (remove) on a card — district disappears from list, count updates
8. "Create Playbook" button on cards works (opens sheet or shows library dialog)
9. Empty state returns when all districts are removed
