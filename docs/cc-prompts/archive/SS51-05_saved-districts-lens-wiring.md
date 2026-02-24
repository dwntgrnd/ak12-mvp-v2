# SS51-05: Saved Districts — Lens Wiring

**Session:** SS-51
**Depends on:** SS51-01 (hook), SS51-03 (card prop)
**Spec reference:** Spec 16 §6.4 (Saved Districts)

---

## Context

Saved districts currently has no product lens awareness. When a lens is active (set from discovery or any other surface), this page should fetch live match summaries for the displayed districts and render tier badges on cards. It also gains a `ProductLensSelector` in its toolbar and tier-based sort/filter options.

---

## Requirements

### Modify: `src/app/(dashboard)/saved/page.tsx`

**1. Add lens hook and match fetching:**

```typescript
import { useProductLens } from '@/hooks/use-product-lens';
import { ProductLensSelector } from '@/components/discovery/product-lens-selector';
import { getDistrictService } from '@/services';
import type { MatchSummary } from '@/services/types/common';

const { activeProduct, setProduct, clearProduct } = useProductLens();
const productLensId = activeProduct?.productId;

const [matchSummaries, setMatchSummaries] = useState<Record<string, MatchSummary>>({});
```

**2. Fetch match summaries when lens is active:**

Add an effect — when `productLensId` changes or `savedDistricts` changes, fetch match summaries for all saved district IDs:

```typescript
useEffect(() => {
  if (!productLensId || savedDistricts.length === 0) {
    setMatchSummaries({});
    return;
  }

  const districtIds = savedDistricts.map(sd => sd.districtId);
  
  getDistrictService()
    .then(service => service.getMatchSummaries(productLensId, districtIds))
    .then(summaries => setMatchSummaries(summaries))
    .catch(() => setMatchSummaries({}));
}, [productLensId, savedDistricts]);
```

**3. Add lens change handler:**

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

**4. Add `ProductLensSelector` to the page:**

Place the lens selector between the page title and the `DistrictListingsContainer`. Render only when `readiness.hasProducts` is true:

```tsx
{readiness.hasProducts && (
  <div className="mt-4 flex items-center gap-3">
    <span className="text-sm text-foreground-secondary">Product lens:</span>
    <ProductLensSelector
      products={readiness.products.map(p => ({ productId: p.productId, name: p.name }))}
      selectedProductId={productLensId}
      onProductChange={handleProductLensChange}
      variant="compact"
    />
  </div>
)}
```

**5. Thread match summaries to cards:**

In the `DistrictListCard` rendering within the main list view:

```tsx
<DistrictListCard
  key={entry.districtId}
  snapshot={entry.snapshot}
  variant="inset"
  isSaved
  onRemoveSaved={removeSavedDistrict}
  onGeneratePlaybook={handleGeneratePlaybook}
  matchSummary={matchSummaries[entry.districtId]}
/>
```

**6. Add tier-based sort option:**

The `SAVED_DISTRICTS_CONFIG` in `list-context-config.ts` defines available sort options. When a lens is active, add a "Match Tier" sort option.

### Modify: `src/components/shared/list-context-config.ts`

Add a `matchTier` sort key to `SAVED_DISTRICTS_CONFIG.sortOptions` (or make it conditional). The simplest approach: add it as a static option that's always present but only meaningful when match data exists.

```typescript
{ key: 'matchTier', label: 'Match Tier', direction: 'desc' as const },
```

### Modify: `src/app/(dashboard)/saved/page.tsx` — sort logic

In the `processed` useMemo pipeline, add tier-based sorting:

```typescript
if (activeSort?.key === 'matchTier') {
  const tierOrder: Record<string, number> = { strong: 0, moderate: 1, limited: 2 };
  const dir = activeSort.direction === 'asc' ? 1 : -1;
  result = [...result].sort((a, b) => {
    const aTier = matchSummaries[a.districtId]?.overallTier;
    const bTier = matchSummaries[b.districtId]?.overallTier;
    const aVal = aTier ? tierOrder[aTier] : 999;
    const bVal = bTier ? tierOrder[bTier] : 999;
    return dir * (aVal - bVal);
  });
}
```

Insert this before the existing `sortBySnapshotField` call, with an early return so both don't execute.

**7. Pre-select lens product in playbook generation:**

Update `GeneratePlaybookSheet` to include the lens product:

```tsx
<GeneratePlaybookSheet
  open={playbookOpen}
  onOpenChange={setPlaybookOpen}
  initialDistrict={playbookDistrictInfo}
  initialProductIds={productLensId ? [productLensId] : undefined}
/>
```

---

## Verification

1. `npm run build` passes.
2. Saved districts page renders identically when no lens is active.
3. Selecting a product lens shows tier badges on saved district cards.
4. The ContentUtilityBar lens indicator reflects the selection.
5. Sorting by "Match Tier" groups strong → moderate → limited.
6. Removing a saved district while lens is active doesn't break match summary state.
7. "Generate Playbook" pre-selects the lens product.
8. Navigating to saved districts from discovery preserves the lens (shared hook state).

---

## Files

| Action | File |
|--------|------|
| Modify | `src/app/(dashboard)/saved/page.tsx` |
| Modify | `src/components/shared/list-context-config.ts` (add matchTier sort option) |
