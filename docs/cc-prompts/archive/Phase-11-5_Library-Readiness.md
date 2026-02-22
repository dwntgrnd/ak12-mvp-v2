# CC Prompt: Phase 11-5 — Library Readiness State + Progressive Disclosure

**Purpose:** Implement library readiness binary gate and progressive disclosure across three touchpoints per Spec 15 §9.  
**Prerequisite:** Phase 11-3 (card refactor) must be complete. Phase 11-4 (column sort/filters) should be complete but is not strictly required.  
**Spec reference:** `/docs/specs/15_District-List-Experience-Specification.md` §8, §9

---

## Context

The product lens and alignment-based features should only appear when the user's Solutions Library has products. This prompt implements the binary gate (`hasProducts`) and wires progressive disclosure at three touchpoints.

## Tasks

### 1. Create Library Readiness Hook

Create `/src/hooks/use-library-readiness.ts`:

```typescript
import { useState, useEffect } from 'react';
import type { LibraryReadinessResponse, ProductLensSummary } from '@/services/types/product';

interface LibraryReadiness {
  hasProducts: boolean;
  productCount: number;
  products: ProductLensSummary[];
  loading: boolean;
}

export function useLibraryReadiness(): LibraryReadiness {
  // Fetch from ProductService.getLibraryReadiness()
  // Cache result — this doesn't change within a session
  // Return loading state while fetching
}
```

The hook calls the mock product service endpoint created in Phase 11-2. It should cache the result (SWR, React Query, or simple state + ref) since library state doesn't change mid-session.

### 2. Touchpoint 1 — Discovery Input Area

In the discovery entry state / discovery input area:

**When `hasProducts === true`:**
- Render the `ProductLensSelector` component as a query enhancement
- Pass `products` from the readiness response
- Selector is OPTIONAL — "No product lens" is the default state

**When `hasProducts === false`:**
- Do NOT render the `ProductLensSelector`
- Do NOT render a "No products" warning or placeholder
- The input area is clean discovery — no negative state messaging
- No visual gap where the selector would have been

**Implementation:** Wrap the `ProductLensSelector` render in a simple conditional:
```tsx
{readiness.hasProducts && (
  <ProductLensSelector
    products={readiness.products}
    selectedProductId={productLensId}
    onProductChange={setProductLensId}
  />
)}
```

### 3. Touchpoint 2 — Results Listing Toolbar

When configuring the `ListContextConfig` for discovery results:

**When `hasProducts === true` AND a product lens is active:**
- Add alignment-level filter to `availableFilters` array
- Add alignment sort to column header options
- Product alignment badges appear on cards (this is already handled by the card — if alignment data is in the response, it renders)

**When `hasProducts === false` OR no lens active:**
- Alignment filter and sort options simply don't exist
- Fewer toolbar options — no gap, no placeholder
- Cards render without alignment data (snapshot metrics only)

**Implementation:** Build the `ListContextConfig` dynamically based on readiness + active lens:

```typescript
const config = buildListContextConfig({
  context: 'discovery-ranked-list',
  hasProducts: readiness.hasProducts,
  productLensActive: !!productLensId,
});
```

### 4. Touchpoint 3 — Playbook Generation CTA

**When `hasProducts === true`:**
- Playbook CTA functions normally (existing behavior)

**When `hasProducts === false`:**
- Playbook CTA click triggers a blocking AlertDialog:
  - **Title:** "Product Library Required"
  - **Body:** "Playbook generation creates product-specific talking points, objection handling, and proof-of-fit evidence. Add at least one product to your Solutions Library to generate playbooks."
  - **Primary action:** "Go to Solutions Library" → navigates to `/solutions-library`
  - **Secondary action:** "Cancel" → dismisses dialog
- The CTA button itself is NOT disabled — it looks clickable. The blocking dialog explains WHY and provides a path forward.

**Implementation:** In `DistrictListCard`, wrap the playbook CTA handler:

```typescript
function handlePlaybookClick(e: React.MouseEvent) {
  e.stopPropagation();
  if (!hasProducts) {
    setShowLibraryDialog(true);
    return;
  }
  onGeneratePlaybook?.(snapshot.districtId);
}
```

The `hasProducts` boolean is passed to the card either via prop or via React context from a higher-level provider.

### 5. Create LibraryRequiredDialog Component

Create `/src/components/shared/library-required-dialog.tsx`:

A reusable AlertDialog for the playbook generation gate. Simple, focused, no marketing fluff.

```typescript
interface LibraryRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}
```

Uses Shadcn AlertDialog. Copy consistent with the design principle: "The platform must feel complete and valuable at every library readiness state."

### 6. Context Provider (Optional)

If multiple components need the `hasProducts` state (input area, toolbar config, card), consider a `LibraryReadinessProvider` at the discovery page layout level:

```tsx
<LibraryReadinessProvider>
  <DiscoveryPage />
</LibraryReadinessProvider>
```

This avoids prop-drilling the readiness state through multiple layers. The hook handles caching, but a context provider ensures a single fetch.

Evaluate whether this is needed or if passing props is simpler for the current component tree depth.

## Verification

After all changes:
1. `npm run build` — clean build

**Test with products in library (default mock state):**
2. Discovery page: product lens selector visible
3. Select a product lens, run a query → alignment badges appear on result cards
4. Filter sheet includes alignment level filter
5. Column headers include alignment sort
6. Playbook CTA works normally

**Test with empty library (toggle mock to return empty):**
7. Discovery page: NO product lens selector visible, no gap
8. Run a query → cards render cleanly with snapshot metrics only, no alignment data
9. Filter sheet does NOT include alignment filter
10. Column headers do NOT include alignment sort
11. Click Playbook CTA → blocking dialog appears with "Go to Solutions Library" link
12. Click "Go to Solutions Library" → navigates to `/solutions-library`
13. Click "Cancel" → dialog dismisses, returns to list

**To toggle the mock empty state:** Temporarily modify the mock product service to return `hasProducts: false, productCount: 0, products: []`. Add a comment noting this is a testing toggle.

## What NOT to Do

- Do not add encouragement/nudge messaging to the discovery results page
- Do not disable the Playbook CTA when library is empty — it triggers the dialog instead
- Do not add a "building your library" progress indicator
- Do not interrupt active search or results scanning with library-related messaging
