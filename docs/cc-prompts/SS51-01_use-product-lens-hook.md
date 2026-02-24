# SS51-01: `useProductLens` Hook — Session-Level Singleton

**Session:** SS-51
**Depends on:** SS50-03 (matching type corrections — verified)
**Spec reference:** Spec 16 §5 (Product Lens UX)

---

## Context

The product lens is the user action that activates matching visibility across the platform. When a rep selects a product, every applicable surface gains match tier badges and connection text. This hook is the single source of truth for which product (if any) is currently active.

**Pattern reference:** `src/hooks/use-saved-districts.ts` — module-level singleton with `useSyncExternalStore`. The product lens hook follows the same architecture: shared cache, listener-based reactivity, SSR-safe snapshots.

**Key difference from `useSavedDistricts`:** No server persistence. No optimistic updates. No API calls for state changes. The hook is pure client-side session state. It only calls an API (`getMatchSummaries`) indirectly — consuming surfaces call the service when they detect the lens is active. The hook itself just holds the active product selection.

---

## Requirements

### Create: `src/hooks/use-product-lens.ts`

**Module-level singleton state:**

```typescript
interface ProductLensCache {
  activeProduct: ProductLensSummary | null;
}
```

- `activeProduct` — the currently selected product, or `null` if no lens is active.
- No `loading` state — the hook doesn't fetch anything itself.

**Exported hook interface:**

```typescript
interface UseProductLensReturn {
  activeProduct: ProductLensSummary | null;
  isLensActive: boolean;                    // convenience: activeProduct !== null
  setProduct: (product: ProductLensSummary) => void;
  clearProduct: () => void;
}
```

**Implementation notes:**

1. Use `useSyncExternalStore` with module-level `cache`, `listeners`, `subscribe`, `getSnapshot`, `getServerSnapshot` — same pattern as `use-saved-districts.ts`.
2. `setProduct(product)` — sets `cache.activeProduct = product`, calls `notify()`.
3. `clearProduct()` — sets `cache.activeProduct = null`, calls `notify()`.
4. `getServerSnapshot` returns `{ activeProduct: null }` — no lens during SSR.
5. No persistence. No localStorage. No cookies. Session memory only (resets on page reload per Spec 16 §7).

**URL param seeding:**

The hook does NOT read URL params itself. That responsibility belongs to consuming pages (specifically the district profile page in SS51-06). The hook is a dumb state container. Seeding logic stays in the components that know about routing.

### Do NOT create:

- No API route. No fetch calls. No mock provider changes.
- No modifications to any existing files.

---

## Verification

1. `npm run build` passes with zero errors.
2. The hook file exports `useProductLens` and `UseProductLensReturn`.
3. Importing and calling `useProductLens()` in a client component returns the correct interface shape.
4. Multiple components importing `useProductLens()` share the same state (singleton behavior).

---

## Files

| Action | File |
|--------|------|
| Create | `src/hooks/use-product-lens.ts` |
