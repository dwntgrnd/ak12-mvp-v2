# P2-CC12 — Discovery Input Simplification (P1 Query Pipeline Removal)

**Priority:** High — functional cleanup, discrete from layout refactoring  
**Commit message:** `refactor: simplify discovery to district-only search, remove P1 query pipeline`

---

## Context

In P1, the discovery input served dual purposes: (1) predictive district search with autocomplete, and (2) semantic/keyword query submission that routed through an agentic response pipeline with intent classification, confidence scoring, and multiple response formats. 

P2 eliminates the query pipeline entirely. The discovery input's sole function is **district lookup** — type, see autocomplete matches, select, navigate. There is no query submission, no intent parsing, no scenario matching, no results rendering.

Currently, when a user types a district name and presses Enter without clicking an autocomplete result, the input submits the text as a semantic query. This routes through `DISCOVERY_SCENARIOS` keyword matching, usually hits the fallback response, and renders a sparse or irrelevant result. This is confusing and broken for the P2 use case.

---

## Requirements

### 1. Simplify `DiscoveryInput` component

**File:** `src/components/discovery/discovery-input.tsx`

- **Remove** the `onSubmit` prop entirely
- **Change Enter key behavior:** If autocomplete dropdown is open and an item is highlighted → select it (existing behavior, keep). If dropdown is open with matches but nothing highlighted → select the first match. If no matches or dropdown closed → do nothing (no submission).
- **Remove** the submit button (orange ArrowRight button in full variant)
- **Update typewriter phrases** — remove all semantic query examples. Keep only district-search-oriented phrases:
  ```
  'Search for a district by name...',
  'Los Angeles Unified',
  'Try typing Fresno or Oakland...',
  'Find districts by name or city...',
  ```
- **Update aria-label** from "Search districts or ask a question" to "Search for a district"
- **Remove** the `onClear` prop (only used by compact variant in results layout, which is being removed)
- **Keep** the `variant` prop — `full` (entry state) and `compact` (may be reused in top bar) remain valid
- **Keep** all autocomplete functionality unchanged — `searchDirectory()`, debounce, dropdown, keyboard nav

### 2. Simplify `DiscoveryEntryState`

**File:** `src/components/discovery/discovery-entry-state.tsx`

- Remove `onQuerySubmit` prop
- Update subtitle copy — remove "ask a natural language question" language
- Update helper text — remove references to "natural language question", "explore trends", "compare districts". Focus on district search.
- Pass only `onDirectNavigation` to `DiscoveryInput`

### 3. Simplify discovery page

**File:** `src/app/(dashboard)/discovery/page.tsx`

- **Collapse from three-state machine to single state.** Remove `pageState`, `DiscoveryPageState` type, `loading`/`results` states.
- **Remove** all `query()` pipeline code: `handleQuerySubmit`, `activeQuery`, `response`, `error`, `serviceRef` (for discovery service query), `matchSummaries` fetch tied to query response, `extractDistrictIds`, `getDistrictInfoFromResponse`
- **Remove** `DiscoveryResultsLayout` and `DiscoveryLoadingState` imports and usage
- **Keep:** `handleDirectNavigation`, product lens state (`useProductLens`), library readiness, saved districts, `GeneratePlaybookSheet`, `LibraryRequiredDialog`
- **Keep the URL `?q=` handling** but change its behavior: if `?q=` is present, treat it as a pre-filled search value in the input (not a query submission). The autocomplete will fire naturally from the pre-filled value.
- **Remove** `handleClearResults` — no results to clear

### 4. Remove P1 query pipeline components

**Delete these files entirely:**

- `src/components/discovery/discovery-results-layout.tsx`
- `src/components/discovery/discovery-loading-state.tsx`
- `src/components/discovery/discovery-format-router.tsx`
- `src/components/discovery/discovery-toolbar.tsx`
- `src/components/discovery/follow-up-chips.tsx`
- `src/components/discovery/source-citations.tsx`
- `src/components/discovery/product-alignment-badge.tsx`
- `src/components/discovery/product-lens-selector.tsx`
- `src/components/discovery/renderers/` (entire directory — all 7 files)

### 5. Update barrel export

**File:** `src/components/discovery/index.ts`

Remove exports for all deleted components. Keep only:
- `DiscoveryEntryState`
- `DiscoveryInput`
- `DiscoveryAutocompleteDropdown` (internal, not currently exported — leave as-is)

### 6. Simplify discovery service interface

**File:** `src/services/interfaces/discovery-service.ts`

- **Remove** `query()` method from `IDiscoveryService`
- **Keep** `searchDirectory()` and `getCoverage()`

### 7. Simplify mock discovery service

**File:** `src/services/providers/mock/mock-discovery-service.ts`

- **Remove** `query()` implementation
- **Remove** imports of `DISCOVERY_SCENARIOS` and `DISCOVERY_FALLBACK_RESPONSE`
- **Keep** `searchDirectory()` and `getCoverage()` unchanged

### 8. Prune discovery fixtures

**File:** `src/services/providers/mock/fixtures/discovery.ts`

- **Remove** `DISCOVERY_SCENARIOS` (the 11 keyword-matched scenario responses — substantial bulk)
- **Remove** `DISCOVERY_FALLBACK_RESPONSE`
- **Keep:** `DISCOVERY_DIRECTORY`, `EXTRA_DIRECTORY_ENTRIES`, `DISCOVERY_COVERAGE`, `PRODUCT_RELEVANCE_MAPS`, all ID constants, `snapshotFor()` helper
- This should substantially reduce the file size (scenarios are the bulk of ~1327 lines)

### 9. Prune discovery types

**File:** `src/services/types/discovery.ts`

**Remove these types** (no longer referenced after component deletion):
- `QueryIntent`
- `ResponseFormat`
- `SectionConfidence`, `ResponseConfidence`
- `FollowUpChip`
- `DiscoverySource`
- `BriefSection`, `KeySignal`, `BriefContent`
- `DirectAnswerContent`
- `ComparisonCell`, `ComparisonEntity`, `ComparisonDimension`, `ComparisonContent`
- `CardSetEntry`, `CardSetContent`
- `RankedListEntry`, `RankedListContent`
- `RecoveryContent`
- `DiscoveryResponseContent` (the discriminated union)
- `DiscoveryQueryResponse`
- `DiscoveryQueryRequest`

**Keep these types** (still used by directory search and coverage):
- `ConfidenceLevel`, `CoverageCategory`, `CategoryCoverage`, `DistrictCoverage`
- `ProductAlignment` (used by `PRODUCT_RELEVANCE_MAPS`, referenced by `mock-district-service.ts`)
- `DirectoryEntry`, `DirectorySearchRequest`, `DirectorySearchResponse`

### 10. Prune services barrel export

**File:** `src/services/index.ts`

Remove all type exports for deleted types. Keep exports for retained types. The Discovery types section should shrink to:
```typescript
export type {
  ConfidenceLevel,
  CoverageCategory,
  CategoryCoverage,
  DistrictCoverage,
  ProductAlignment,
  DirectoryEntry,
  DirectorySearchRequest,
  DirectorySearchResponse,
} from './types/discovery';
```

### 11. Update `DiscoveryAutocompleteDropdown` empty state

**File:** `src/components/discovery/discovery-autocomplete-dropdown.tsx`

The current empty-state text says: `No matching districts. Press Enter to search.`

Change to: `No matching districts found.`

(Enter no longer submits a query, so the hint is misleading.)

---

## Verification

1. `npx tsc --noEmit` passes — no type errors from removed types or missing imports
2. Dev server starts without errors
3. Discovery page loads with search input, typewriter animates district-oriented phrases
4. Typing 2+ characters shows autocomplete dropdown with district matches
5. Clicking a match navigates to `/districts/[districtId]`
6. Pressing Enter with a highlighted match navigates to that district
7. Pressing Enter with no highlighted match selects the first match (if matches exist)
8. Pressing Enter with no matches does nothing
9. No submit button appears in the input
10. No reference to deleted components in any remaining file (grep for removed component names)
11. Product lens state still works on the discovery page (lens persists via hook singleton)

---

## Service Contract Update

After all code changes are complete and verification passes, update the Service Contracts document.

**File:** `/Users/dorenberge/WorkInProgress/UI-Projects-Vault/Projects/AK12-MVP-v2/Backend-Handoff/Service-Contracts-v3.md`

### 1. Update Service 2: DiscoveryService section

- **Remove** the entire `### query` subsection (from the heading through the content format table and discriminated union documentation)
- **Remove** the `🔗 AI Prompt Spec: See AI-Prompt-Specifications.md → Pipeline 4` cross-reference at the top of Service 2
- **Update** the Service 2 introductory text. Replace:
  ```
  **🔗 AI Prompt Spec:** See `AI-Prompt-Specifications.md` → Pipeline 4 (Discovery Query Interpretation)
  ```
  With:
  ```
  District directory search and coverage profiling. The P1 agentic query pipeline (`query()`) was removed in P2 — discovery is now district-only search via `searchDirectory()`.
  ```
- **Keep** `searchDirectory` and `getCoverage` subsections unchanged

### 2. Update AI Prompt Orchestration cross-references

In the "Planned — Not Yet Specified → AI Prompt Orchestration" section, update the bullet:
```
- `DiscoveryService.query()` → Pipeline 4
```
To:
```
- ~~`DiscoveryService.query()` → Pipeline 4~~ — Removed in P2. Discovery simplified to district directory search. Pipeline 4 deferred from MVP scope.
```

### 3. Append to Contract Changes Log

Append the following to the **Appendix D: Contract Changes Log** section (create this appendix if it doesn't exist — place it after Appendix C):

```markdown
## Appendix D: Contract Changes Log

Running changelog of service contract modifications. Referenced by session and CC prompt for traceability.

| Date | Change | Service | Method | CC Prompt | Session |
|------|--------|---------|--------|-----------|---------|
| 2026-02-25 | Removed | DiscoveryService | `query()` | P2-CC12 | P2-S09 |

**P2-CC12 — Discovery Input Simplification:**
- Removed `IDiscoveryService.query()` method from interface
- Removed all associated request/response types: `DiscoveryQueryRequest`, `DiscoveryQueryResponse`, `DiscoveryResponseContent` discriminated union, `QueryIntent`, `ResponseFormat`, all content format types (`BriefContent`, `DirectAnswerContent`, `ComparisonContent`, `CardSetContent`, `RankedListContent`, `RecoveryContent`), `ResponseConfidence`, `SectionConfidence`, `FollowUpChip`, `DiscoverySource`, `BriefSection`, `KeySignal`
- Removed mock provider implementation of `query()` and all `DISCOVERY_SCENARIOS` / `DISCOVERY_FALLBACK_RESPONSE` fixture data
- No impact on `searchDirectory()`, `getCoverage()`, `DISCOVERY_DIRECTORY`, `DISCOVERY_COVERAGE`, or `PRODUCT_RELEVANCE_MAPS`
- Pipeline 4 (Discovery Query Interpretation) in AI Prompt Specifications is deferred from MVP scope
```

---

## What NOT to change

- `DiscoveryInput` visual styling, focus glow, typewriter animation engine — keep all of this
- `DiscoveryAutocompleteDropdown` rendering, highlight logic, keyboard nav — keep
- `useProductLens`, `useLibraryReadiness`, `useSavedDistricts` hooks — untouched
- `GeneratePlaybookSheet`, `LibraryRequiredDialog` — untouched
- `mock-district-service.ts` `getMatchSummaries` — untouched (uses `PRODUCT_RELEVANCE_MAPS`)
- District profile page (`/districts/[districtId]/page.tsx`) — untouched
- No layout or visual changes — this is a functional code removal
