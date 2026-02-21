# CC Prompt: Relocate Product Lens Selector

## Context
The product lens selector currently appears in the results header bar next to the compact search input (`discovery-results-layout.tsx`). We want to move it so it only appears contextually on result formats that contain district lists — not as a persistent top-level control.

## What to Change

### 1. Remove ProductLensSelector from `discovery-results-layout.tsx`
- Remove the `ProductLensSelector` import and rendering from the header bar
- Keep the `products`, `productLensId`, and `onProductLensChange` props flowing through — they still need to reach the format router
- The compact search input should take the full width of its row (remove the `flex-1` constraint that was sharing space with the lens)

### 2. Pass lens controls through DiscoveryFormatRouter to list-based renderers
- `DiscoveryFormatRouter` already receives `productRelevanceMap`. It now also needs `products`, `productLensId`, and `onProductLensChange` so it can pass them to renderers that should show the selector.
- Update the `DiscoveryFormatRouterProps` interface and the switch cases accordingly.

### 3. Add ProductLensSelector to these renderers (district list formats):
- **`RankedListRenderer`** — above the ranked entries
- **`CardSetRenderer`** — above the card grid
- **`BriefRenderer`** (narrative_brief and intelligence_brief) — only if keySignals contain district entries. Place above the key signals section.
- **`ComparisonTableRenderer`** — above the comparison table

In each case, render the `ProductLensSelector` with `variant="compact"` only when `products.length > 0`. Position it as a right-aligned control above the content, with a small label like "View through:" or just the selector alone.

### 4. Do NOT add ProductLensSelector to:
- `DirectAnswerCard` (single district, nothing to sort)
- `RecoveryRenderer` (no results to augment)
- `DiscoveryEntryState` (pre-query, no context)

### 5. Behavior unchanged
- `productLensId` state still lives in `page.tsx`
- Selecting a lens still triggers a re-query with the lens ID (existing behavior)
- `productRelevanceMap` still flows through the format router
- `ProductRelevanceBadge` rendering on district entries unchanged

## Files to modify
- `src/components/discovery/discovery-results-layout.tsx` — remove lens from header
- `src/components/discovery/discovery-format-router.tsx` — pass lens controls through
- `src/components/discovery/renderers/ranked-list-renderer.tsx` — add lens selector
- `src/components/discovery/renderers/card-set-renderer.tsx` — add lens selector
- `src/components/discovery/renderers/brief-renderer.tsx` — add lens selector (conditional)
- `src/components/discovery/renderers/comparison-table-renderer.tsx` — add lens selector
- `src/app/(dashboard)/discovery/page.tsx` — update props passed to results layout and format router

## Files unchanged
- `src/components/discovery/product-lens-selector.tsx` — component itself is fine
- `src/components/discovery/product-relevance-badge.tsx` — unchanged
- `src/services/providers/mock/fixtures/discovery.ts` — mock data unchanged
- `src/services/providers/mock/mock-discovery-service.ts` — service unchanged

## Verify
- [ ] Entry state: clean input, no lens selector visible
- [ ] Results with ranked list: lens selector appears above entries
- [ ] Results with card set: lens selector appears above cards
- [ ] Results with narrative/intelligence brief: lens appears above key signals (when signals have district entries)
- [ ] Results with comparison table: lens appears above table
- [ ] Results with direct answer: no lens selector
- [ ] Results with recovery: no lens selector
- [ ] Selecting a lens re-queries and shows ProductRelevanceBadge on district entries
- [ ] Clearing lens re-queries without lens augmentation
