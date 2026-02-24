# SS51-04: Discovery Page — Lens Migration to `useProductLens`

**Session:** SS-51
**Depends on:** SS51-01 (hook), SS51-03 (card prop)
**Spec reference:** Spec 16 §6.2 (Discovery Cards)

---

## Context

The discovery page currently manages product lens state locally via `useState<string | undefined>` (`productLensId`). This prompt migrates it to the shared `useProductLens` hook so the lens selection persists across page navigation and is visible in the ContentUtilityBar indicator.

Additionally, when a lens is active and results contain districts, the page fetches `MatchSummary` data via `getMatchSummaries` and passes it to `DistrictListCard` instances.

---

## Requirements

### Modify: `src/app/(dashboard)/discovery/page.tsx`

**1. Replace local lens state with hook:**

Remove:
```typescript
const [productLensId, setProductLensId] = useState<string | undefined>(undefined);
```

Add:
```typescript
import { useProductLens } from '@/hooks/use-product-lens';

const { activeProduct, setProduct, clearProduct } = useProductLens();
const productLensId = activeProduct?.productId;
```

**2. Update lens change handler:**

The `ProductLensSelector` and discovery renderers currently call `onProductLensChange(productId: string | undefined)`. We need an adapter that converts a `productId` string to a `ProductLensSummary` for the hook.

Add a handler:
```typescript
const handleProductLensChange = useCallback((productId: string | undefined) => {
  if (!productId) {
    clearProduct();
    return;
  }
  const product = readiness.products.find(p => p.productId === productId);
  if (product) {
    setProduct(product);
  }
}, [readiness.products, setProduct, clearProduct]);
```

Replace all `onProductLensChange={setProductLensId}` with `onProductLensChange={handleProductLensChange}`.

**3. Add match summary fetching:**

When the lens is active and a query response contains district IDs, fetch match summaries.

Add state:
```typescript
const [matchSummaries, setMatchSummaries] = useState<Record<string, MatchSummary>>({});
const [matchLoading, setMatchLoading] = useState(false);
```

Add an effect that triggers when `productLensId` changes or when `response` changes:
```typescript
useEffect(() => {
  if (!productLensId || !response) {
    setMatchSummaries({});
    return;
  }

  const districtIds = extractDistrictIds(response);
  if (districtIds.length === 0) {
    setMatchSummaries({});
    return;
  }

  setMatchLoading(true);
  getDistrictService()
    .then(service => service.getMatchSummaries(productLensId, districtIds))
    .then(summaries => {
      setMatchSummaries(summaries);
      setMatchLoading(false);
    })
    .catch(() => {
      setMatchSummaries({});
      setMatchLoading(false);
    });
}, [productLensId, response]);
```

Add the helper function (can be in the same file, below the component):
```typescript
function extractDistrictIds(response: DiscoveryQueryResponse): string[] {
  const { content } = response;
  if (content.format === 'ranked_list') {
    return content.data.entries.map(e => e.districtId);
  }
  if (content.format === 'card_set') {
    return content.data.districts.map(d => d.districtId);
  }
  return [];
}
```

Import `getDistrictService` from `@/services` and `MatchSummary` from `@/services/types/common`.

**4. Thread match summaries to results layout:**

Add `matchSummaries` and `matchLoading` props to `DiscoveryResultsLayout`:
```tsx
<DiscoveryResultsLayout
  // ... existing props
  matchSummaries={matchSummaries}
  matchLoading={matchLoading}
/>
```

### Modify: `src/components/discovery/discovery-results-layout.tsx`

Add to interface:
```typescript
matchSummaries?: Record<string, MatchSummary>;
matchLoading?: boolean;
```

Thread to `DiscoveryFormatRouter`:
```tsx
<DiscoveryFormatRouter
  // ... existing props
  matchSummaries={matchSummaries}
  matchLoading={matchLoading}
/>
```

### Modify: `src/components/discovery/discovery-format-router.tsx`

Add to interface:
```typescript
import type { MatchSummary } from '@/services/types/common';

matchSummaries?: Record<string, MatchSummary>;
matchLoading?: boolean;
```

Thread to `RankedListRenderer` and `CardSetRenderer`:
```tsx
matchSummaries={matchSummaries}
matchLoading={matchLoading}
```

### Modify: `src/components/discovery/renderers/ranked-list-renderer.tsx`

Add to interface:
```typescript
matchSummaries?: Record<string, MatchSummary>;
matchLoading?: boolean;
```

In the `DistrictListCard` rendering, add:
```tsx
<DistrictListCard
  // ... existing props
  matchSummary={matchSummaries?.[entry.districtId]}
/>
```

### Modify: `src/components/discovery/renderers/card-set-renderer.tsx`

Same changes as ranked-list-renderer — add `matchSummaries` to interface and thread to `DistrictListCard`:
```tsx
<DistrictListCard
  // ... existing props
  matchSummary={matchSummaries?.[d.districtId]}
/>
```

**5. Comment for `productLensId` in query submission:**

The existing `handleQuerySubmit` passes `productLensId` to the discovery service query. Keep this behavior — the discovery service may use the product context to influence result ranking. The `productLensId` derivation (`activeProduct?.productId`) handles this automatically.

**6. Preserve existing behavior:**

- The `productLensId` intentionally does NOT reset on `handleClearResults` — this is already documented in the current code comment. The hook-based lens persists across query clears by design.
- `initialProductIds` on `GeneratePlaybookSheet` continues to use `productLensId ? [productLensId] : undefined`.

---

## Verification

1. `npm run build` passes.
2. Selecting a product in the lens selector on a ranked_list or card_set result updates the ContentUtilityBar indicator (from SS51-02).
3. Navigating away from discovery and back preserves the lens selection.
4. When lens is active on a district list result, match tier badges appear on district cards.
5. Clearing the lens removes badges from cards and clears the indicator.
6. Discovery queries still pass `productLensId` to the service.
7. "Generate Playbook" still pre-selects the lens product.

---

## Files

| Action | File |
|--------|------|
| Modify | `src/app/(dashboard)/discovery/page.tsx` |
| Modify | `src/components/discovery/discovery-results-layout.tsx` |
| Modify | `src/components/discovery/discovery-format-router.tsx` |
| Modify | `src/components/discovery/renderers/ranked-list-renderer.tsx` |
| Modify | `src/components/discovery/renderers/card-set-renderer.tsx` |
