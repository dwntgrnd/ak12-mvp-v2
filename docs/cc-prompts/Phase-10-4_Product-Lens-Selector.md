# Phase 10-4 — Product Lens Selector

**Created:** 2026-02-20 · SS-33
**Depends on:** Phase 10-1 (shared card + ProductRelevance type), Phase 10-2 (renderer integration), Phase 10-3 (single-entity links)
**Spec references:** Spec 14 §3 (Product Lens Selector), Spec 09 §5 (Affordance Standards)

---

## Objective

Add a persistent product lens selector to the discovery experience. When a rep selects a product, all discovery results are augmented with product relevance signals. When no product is selected, results render as they do today. The lens persists across queries and is explicitly cleared by the user.

This is a mock implementation: relevance indicators are static fixtures, not computed from real matching logic.

---

## Design Decisions (Resolved)

1. **Product lens augments, never filters.** Selecting a math product while asking about Sacramento districts shows all Sacramento intelligence, plus math alignment signals per district. Removing the lens removes the signals — results return to base state.

2. **Label is "Product lens"** as the Select label. Active state shows a chip with the product name and × clear action.

3. **Relevance data lives on the response envelope**, not on individual entity types. A `productRelevanceMap` keyed by `districtId` is added to `DiscoveryQueryResponse`. Renderers look up relevance per district and pass it to `DiscoveryResultCard`. This avoids modifying every entity type.

4. **Position:** companion to the search input. In entry state, below the input. In results state, inline with the compact input bar.

5. **Static mock relevance** uses pre-defined alignment levels per district × product combination, not computed logic. Switching products changes the values to prove the lens works.

---

## 1. Type Changes

### 1A. Add `productRelevanceMap` to Response Envelope

In `src/services/types/discovery.ts`, update `DiscoveryQueryResponse`:

```typescript
export interface DiscoveryQueryResponse {
  queryId: string;
  originalQuery: string;
  intent: QueryIntent;
  content: DiscoveryResponseContent;
  confidence: ResponseConfidence;
  followUpChips: FollowUpChip[];
  sources: DiscoverySource[];
  generatedAt: string;
  productRelevanceMap?: Record<string, ProductRelevance>; // NEW — keyed by districtId
}
```

The `ProductRelevance` type was already added in Phase 10-1. Confirm it exists:

```typescript
export interface ProductRelevance {
  alignmentLevel: 'strong' | 'moderate' | 'limited' | 'unknown';
  signals: string[];
  productName: string;
}
```

### 1B. Export `ProductRelevance` from Service Index

Confirm `ProductRelevance` is exported from `src/services/index.ts`. If not, add it to the discovery type exports block.

---

## 2. Static Relevance Fixtures

### 2A. Add Relevance Map to Discovery Fixtures

In `src/services/providers/mock/fixtures/discovery.ts`, add a new exported constant after the existing `DISCOVERY_FALLBACK_RESPONSE`:

```typescript
// ============================================================
// E. Product Relevance Maps (Static Mock)
// Per-product relevance indicators keyed by districtId.
// Used when productLensId is present in the query request.
// ============================================================

import type { ProductRelevance } from '../../../types/discovery';

export const PRODUCT_RELEVANCE_MAPS: Record<string, Record<string, ProductRelevance>> = {
  // EnvisionMath (prod-001) — math curriculum, K-8
  'prod-001': {
    [ID_ELK_GROVE]: {
      alignmentLevel: 'strong',
      signals: ['Active K-8 math curriculum review matches product grade range', 'LCAP Goal 2 math priority aligns with product focus'],
      productName: 'EnvisionMath',
    },
    [ID_TWIN_RIVERS]: {
      alignmentLevel: 'strong',
      signals: ['$4.2M math materials budget allocated', 'Current Go Math! adoption aging — replacement cycle active'],
      productName: 'EnvisionMath',
    },
    [ID_SACRAMENTO_CITY]: {
      alignmentLevel: 'moderate',
      signals: ['LCAP math priority present but no active RFP', 'Math proficiency 29.1% indicates need'],
      productName: 'EnvisionMath',
    },
    [ID_NATOMAS]: {
      alignmentLevel: 'limited',
      signals: ['Math decline noted but no budget allocation or formal evaluation'],
      productName: 'EnvisionMath',
    },
    [ID_FRESNO]: {
      alignmentLevel: 'moderate',
      signals: ['Large district with math needs but evaluation status unknown'],
      productName: 'EnvisionMath',
    },
    [ID_PLUMAS_COUNTY]: {
      alignmentLevel: 'limited',
      signals: ['Small rural district — math proficiency below average but limited LCAP data'],
      productName: 'EnvisionMath',
    },
  },
  // myPerspectives (prod-002) — ELA curriculum, 6-12
  'prod-002': {
    [ID_ELK_GROVE]: {
      alignmentLevel: 'limited',
      signals: ['No active ELA evaluation signals detected'],
      productName: 'myPerspectives',
    },
    [ID_TWIN_RIVERS]: {
      alignmentLevel: 'unknown',
      signals: ['Insufficient data to assess ELA alignment'],
      productName: 'myPerspectives',
    },
    [ID_SACRAMENTO_CITY]: {
      alignmentLevel: 'moderate',
      signals: ['ELA proficiency gaps present', 'Diverse student population aligns with product strengths'],
      productName: 'myPerspectives',
    },
    [ID_NATOMAS]: {
      alignmentLevel: 'limited',
      signals: ['No ELA-specific evaluation activity detected'],
      productName: 'myPerspectives',
    },
    [ID_FRESNO]: {
      alignmentLevel: 'strong',
      signals: ['High EL population benefits from culturally responsive texts', 'District has active ELA initiatives'],
      productName: 'myPerspectives',
    },
    [ID_PLUMAS_COUNTY]: {
      alignmentLevel: 'unknown',
      signals: ['Insufficient data for ELA assessment'],
      productName: 'myPerspectives',
    },
  },
};
```

This gives distinctly different relevance profiles per product — demonstrating that switching the lens changes the augmentation.

---

## 3. Mock Service Update

### 3A. Augment Query Response with Relevance

In `src/services/providers/mock/mock-discovery-service.ts`, update the `query` method:

Import the new fixture:
```typescript
import {
  DISCOVERY_DIRECTORY,
  DISCOVERY_COVERAGE,
  DISCOVERY_SCENARIOS,
  DISCOVERY_FALLBACK_RESPONSE,
  PRODUCT_RELEVANCE_MAPS,
} from './fixtures/discovery';
```

After constructing the response (either from `bestMatch` or fallback), check for `productLensId` and augment:

```typescript
async query(request: DiscoveryQueryRequest): Promise<DiscoveryQueryResponse> {
  // ... existing keyword matching logic ...

  const baseResponse = bestMatch
    ? { ...bestMatch.response, queryId: freshQueryId(), originalQuery: request.query }
    : { ...DISCOVERY_FALLBACK_RESPONSE, queryId: freshQueryId(), originalQuery: request.query };

  // Augment with product relevance if lens is active
  if (request.productLensId && PRODUCT_RELEVANCE_MAPS[request.productLensId]) {
    return {
      ...baseResponse,
      productRelevanceMap: PRODUCT_RELEVANCE_MAPS[request.productLensId],
    };
  }

  return baseResponse;
}
```

This is the only service change. The relevance map flows through the response to the UI layer.

---

## 4. Product Lens Selector Component

### 4A. File Location

`src/components/discovery/product-lens-selector.tsx`

### 4B. Props Interface

```typescript
interface ProductLensSelectorProps {
  products: Array<{ productId: string; name: string }>;
  selectedProductId: string | undefined;
  onProductChange: (productId: string | undefined) => void;
  variant?: 'full' | 'compact';
}
```

### 4C. Component Behavior

**When no products exist:** component returns `null` — no rendering, no placeholder, no empty dropdown.

**When products exist, no selection:** renders a Select with label "Product lens" and placeholder "None". Options list the product names.

**When a product is selected:** renders the Select (showing selected product name) PLUS a chip/badge to the right showing the product name with a × clear button. The chip provides a persistent visual indicator that a lens is active.

### 4D. Component Structure

```tsx
'use client';

import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface ProductLensSelectorProps {
  products: Array<{ productId: string; name: string }>;
  selectedProductId: string | undefined;
  onProductChange: (productId: string | undefined) => void;
  variant?: 'full' | 'compact';
}

export function ProductLensSelector({
  products,
  selectedProductId,
  onProductChange,
  variant = 'full',
}: ProductLensSelectorProps) {
  if (products.length === 0) return null;

  const selectedProduct = products.find((p) => p.productId === selectedProductId);

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedProductId ?? '__none__'}
        onValueChange={(value) =>
          onProductChange(value === '__none__' ? undefined : value)
        }
      >
        <SelectTrigger
          className={variant === 'full' ? 'w-56' : 'w-48'}
          aria-label="Product lens"
        >
          <SelectValue placeholder="Product lens" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none__">No product lens</SelectItem>
          {products.map((p) => (
            <SelectItem key={p.productId} value={p.productId}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Active lens chip — visible indicator with clear action */}
      {selectedProduct && (
        <Badge
          variant="secondary"
          className="pl-2.5 pr-1.5 py-1 gap-1 text-xs font-medium bg-[#E0F9FC] text-foreground border-0 hover:bg-[#CFFAFE] transition-colors"
        >
          {selectedProduct.name}
          <button
            type="button"
            onClick={() => onProductChange(undefined)}
            className="ml-0.5 rounded-full p-0.5 hover:bg-slate-200/60 transition-colors"
            aria-label={`Remove ${selectedProduct.name} product lens`}
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      )}
    </div>
  );
}
```

### 4E. Visual Details

- Select trigger: standard Shadcn Select styling
- Active chip: uses the emphasis surface color (`bg-[#E0F9FC]`) to tie it visually to the augmented content in results. Hover: slightly more saturated (`bg-[#CFFAFE]`). No border.
- Clear button (×): 12px X icon inside the chip. Hover: subtle bg change.
- The chip is NOT redundant with the Select — it serves as a persistent at-a-glance indicator that a lens is active, especially when the user's attention is on the results below.

---

## 5. Page-Level State Wiring

### 5A. Discovery Page

**File:** `src/app/(dashboard)/discovery/page.tsx`

Add product lens state and product loading:

```typescript
import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DiscoveryEntryState } from '@/components/discovery/discovery-entry-state';
import { DiscoveryLoadingState } from '@/components/discovery/discovery-loading-state';
import { DiscoveryResultsLayout } from '@/components/discovery/discovery-results-layout';
import { getDiscoveryService, getProductService } from '@/services';
import type { IDiscoveryService, IProductService } from '@/services';
import type { DiscoveryQueryResponse, ProductSummary } from '@/services/types/discovery';
```

Add state:
```typescript
const [productLensId, setProductLensId] = useState<string | undefined>(undefined);
const [products, setProducts] = useState<Array<{ productId: string; name: string }>>([]);
const productServiceRef = useRef<IProductService | null>(null);
```

Load products on mount:
```typescript
useEffect(() => {
  async function loadProducts() {
    try {
      if (!productServiceRef.current) {
        productServiceRef.current = await getProductService();
      }
      const result = await productServiceRef.current.getProducts();
      setProducts(result.items.map((p) => ({ productId: p.productId, name: p.name })));
    } catch {
      // Products not available — lens won't render
      setProducts([]);
    }
  }
  loadProducts();
}, []);
```

Update `handleQuerySubmit` to pass `productLensId`:
```typescript
async function handleQuerySubmit(query: string) {
  setActiveQuery(query);
  setPageState('loading');
  setError(null);
  setResponse(null);

  try {
    const service = await getService();
    const result = await service.query({
      query,
      productLensId: productLensId,  // NEW — pass lens to service
    });
    setResponse(result);
    setPageState('results');
  } catch (err: unknown) {
    // ... existing error handling ...
  }
}
```

Pass products and lens state to child components:
```typescript
{pageState === 'entry' && (
  <DiscoveryEntryState
    onQuerySubmit={handleQuerySubmit}
    onDirectNavigation={handleDirectNavigation}
    products={products}
    productLensId={productLensId}
    onProductLensChange={setProductLensId}
  />
)}

{pageState === 'results' && (
  <DiscoveryResultsLayout
    query={activeQuery}
    response={response}
    error={error}
    onNewQuery={handleQuerySubmit}
    onDirectNavigation={handleDirectNavigation}
    onClearResults={handleClearResults}
    products={products}
    productLensId={productLensId}
    onProductLensChange={setProductLensId}
  />
)}
```

Note: `handleClearResults` should NOT clear the product lens — the lens persists even when results are cleared. Only the explicit × on the chip clears it.

### 5B. Update Import for Product Types

The page needs `ProductSummary` or just the subset shape. Since we only need `{ productId, name }`, the mapped array is sufficient. No new type imports needed beyond `getProductService` and `IProductService`.

Actually, check if `IProductService` is already importable from `@/services`. If `getProductService` is exported from the factory, import it. If not, import from `@/services/factory` directly.

---

## 6. Entry State Updates

**File:** `src/components/discovery/discovery-entry-state.tsx`

Add props for product lens:

```typescript
interface DiscoveryEntryStateProps {
  onQuerySubmit: (query: string) => void;
  onDirectNavigation: (districtId: string) => void;
  products: Array<{ productId: string; name: string }>;
  productLensId: string | undefined;
  onProductLensChange: (productId: string | undefined) => void;
}
```

Add the ProductLensSelector below the input, above the helper text:

```tsx
{/* Input */}
<div className="mt-6">
  <DiscoveryInput
    variant="full"
    onSubmit={onQuerySubmit}
    onDirectNavigation={onDirectNavigation}
  />
</div>

{/* Product lens selector — below input, centered */}
{products.length > 0 && (
  <div className="mt-3 flex justify-center">
    <ProductLensSelector
      products={products}
      selectedProductId={productLensId}
      onProductChange={onProductLensChange}
      variant="full"
    />
  </div>
)}

{/* Helper text */}
```

Import:
```tsx
import { ProductLensSelector } from './product-lens-selector';
```

---

## 7. Results Layout Updates

**File:** `src/components/discovery/discovery-results-layout.tsx`

### 7A. Add Props

```typescript
interface DiscoveryResultsLayoutProps {
  query: string;
  response: DiscoveryQueryResponse | null;
  error?: string | null;
  onNewQuery: (query: string) => void;
  onDirectNavigation: (districtId: string) => void;
  onClearResults: () => void;
  products: Array<{ productId: string; name: string }>;
  productLensId: string | undefined;
  onProductLensChange: (productId: string | undefined) => void;
}
```

### 7B. Add Lens Selector Inline with Compact Input

Position the product lens selector on the same row as the compact input bar:

```tsx
{/* Compact input bar + product lens — full width row */}
<div className="flex items-center gap-3 w-full">
  <div className="flex-1">
    <DiscoveryInput
      variant="compact"
      initialValue={query}
      onSubmit={onNewQuery}
      onDirectNavigation={onDirectNavigation}
      onClear={onClearResults}
    />
  </div>
  {products.length > 0 && (
    <ProductLensSelector
      products={products}
      selectedProductId={productLensId}
      onProductChange={onProductLensChange}
      variant="compact"
    />
  )}
</div>
```

### 7C. Pass Response to Format Router (Already Done)

The format router already receives the full response object. The `productRelevanceMap` is on the response and flows through. Individual renderers will need to access it — see §8.

---

## 8. Renderer Updates — Pass Product Relevance to Cards

Each renderer that uses `DiscoveryResultCard` needs to receive and pass through `productRelevanceMap`.

### 8A. Format Router — Pass `productRelevanceMap`

Update `DiscoveryFormatRouter` to extract `productRelevanceMap` from the response and pass it to renderers that use district cards:

```typescript
export function DiscoveryFormatRouter({ response, onNewQuery }: DiscoveryFormatRouterProps) {
  const { content, confidence } = response;
  const relevanceMap = response.productRelevanceMap;

  switch (content.format) {
    case 'narrative_brief':
      return <BriefRenderer content={content.data} confidence={confidence} format="narrative_brief" productRelevanceMap={relevanceMap} />;
    case 'intelligence_brief':
      return <BriefRenderer content={content.data} confidence={confidence} format="intelligence_brief" productRelevanceMap={relevanceMap} />;
    case 'direct_answer_card':
      return <DirectAnswerCard content={content.data} confidence={confidence} productRelevanceMap={relevanceMap} />;
    case 'ranked_list':
      return <RankedListRenderer content={content.data} confidence={confidence} productRelevanceMap={relevanceMap} />;
    case 'card_set':
      return <CardSetRenderer content={content.data} confidence={confidence} productRelevanceMap={relevanceMap} />;
    case 'comparison_table':
      return <ComparisonTableRenderer content={content.data} confidence={confidence} productRelevanceMap={relevanceMap} />;
    case 'recovery':
      return <RecoveryRenderer content={content.data} onRedirectQuery={onNewQuery} />;
    default:
      return null;
  }
}
```

### 8B. Ranked List Renderer

Add prop:
```typescript
interface RankedListRendererProps {
  content: RankedListContent;
  confidence: ResponseConfidence;
  productRelevanceMap?: Record<string, ProductRelevance>;
}
```

Pass to each card:
```tsx
<DiscoveryResultCard
  key={entry.districtId}
  districtId={entry.districtId}
  name={entry.name}
  variant="inset"
  rank={entry.rank}
  productRelevance={productRelevanceMap?.[entry.districtId]}
>
```

### 8C. Card Set Renderer

Add prop:
```typescript
interface CardSetRendererProps {
  content: CardSetContent;
  confidence: ResponseConfidence;
  productRelevanceMap?: Record<string, ProductRelevance>;
}
```

Pass to each card:
```tsx
<DiscoveryResultCard
  key={entry.districtId}
  districtId={entry.districtId}
  name={entry.name}
  location={entry.location}
  enrollment={entry.enrollment}
  variant="inset"
  productRelevance={productRelevanceMap?.[entry.districtId]}
>
```

### 8D. Brief Renderer

Add prop:
```typescript
interface BriefRendererProps {
  content: BriefContent;
  confidence: ResponseConfidence;
  format: 'narrative_brief' | 'intelligence_brief';
  productRelevanceMap?: Record<string, ProductRelevance>;
}
```

Pass to district-linked key signal cards:
```tsx
if (signal.districtId) {
  return (
    <DiscoveryResultCard
      key={signal.districtId}
      districtId={signal.districtId}
      name={signal.label}
      location={signal.location}
      enrollment={signal.enrollment}
      variant="inset"
      productRelevance={productRelevanceMap?.[signal.districtId]}
    >
```

### 8E. Direct Answer Card

Add prop:
```typescript
interface DirectAnswerCardProps {
  content: DirectAnswerContent;
  confidence: ResponseConfidence;
  productRelevanceMap?: Record<string, ProductRelevance>;
}
```

When the direct answer has a `districtId` AND relevance exists, render a product relevance indicator below the action link:

```tsx
{/* Product relevance — when lens active and district has relevance */}
{content.districtId && productRelevanceMap?.[content.districtId] && (
  <div className="mt-3 flex items-center justify-center gap-2">
    <ProductRelevanceBadge relevance={productRelevanceMap[content.districtId]} />
  </div>
)}
```

See §9 for the `ProductRelevanceBadge` helper.

### 8F. Comparison Table Renderer

Add prop:
```typescript
interface ComparisonTableRendererProps {
  content: ComparisonContent;
  confidence: ResponseConfidence;
  productRelevanceMap?: Record<string, ProductRelevance>;
}
```

For comparison tables, add a product relevance row at the bottom of the table when relevance data exists for any entity:

**Desktop — add a table row after the last dimension:**
```tsx
{/* Product relevance row — conditional */}
{productRelevanceMap && entities.some((e) => e.districtId && productRelevanceMap[e.districtId]) && (
  <tr className="border-t border-slate-200">
    <th scope="row" className="py-3 pr-4 text-left text-caption font-[500] leading-[1.5] tracking-[0.025em] text-muted-foreground align-top">
      Product Alignment
    </th>
    {entities.map((entity) => {
      const relevance = entity.districtId ? productRelevanceMap[entity.districtId] : undefined;
      return (
        <td key={entity.entityId} className="py-3 pl-4 align-top">
          {relevance ? (
            <ProductRelevanceBadge relevance={relevance} />
          ) : (
            <span className="text-slate-300">—</span>
          )}
        </td>
      );
    })}
  </tr>
)}
```

**Mobile — add relevance at the bottom of each entity card:**
```tsx
{/* Product relevance — conditional */}
{entity.districtId && productRelevanceMap?.[entity.districtId] && (
  <div className="mt-3 pt-3 border-t border-slate-100">
    <p className="text-overline font-[500] leading-[1.4] tracking-[0.05em] uppercase text-slate-400">
      Product Alignment
    </p>
    <div className="mt-1">
      <ProductRelevanceBadge relevance={productRelevanceMap[entity.districtId]} />
    </div>
  </div>
)}
```

### 8G. Import `ProductRelevance` Type

All updated renderers need:
```typescript
import type { ProductRelevance } from '@/services/types/discovery';
```

---

## 9. Product Relevance Badge Helper

### 9A. File Location

`src/components/discovery/product-relevance-badge.tsx`

### 9B. Component

A small display component that renders the alignment level as a badge + first signal as text.

```tsx
import { Badge } from '@/components/ui/badge';
import type { ProductRelevance } from '@/services/types/discovery';

const ALIGNMENT_STYLES: Record<ProductRelevance['alignmentLevel'], { bg: string; text: string; label: string }> = {
  strong:   { bg: 'bg-green-50',  text: 'text-green-700',  label: 'Strong alignment' },
  moderate: { bg: 'bg-amber-50',  text: 'text-amber-700',  label: 'Moderate alignment' },
  limited:  { bg: 'bg-slate-100', text: 'text-slate-600',  label: 'Limited alignment' },
  unknown:  { bg: 'bg-slate-50',  text: 'text-slate-400',  label: 'Insufficient data' },
};

interface ProductRelevanceBadgeProps {
  relevance: ProductRelevance;
}

export function ProductRelevanceBadge({ relevance }: ProductRelevanceBadgeProps) {
  const style = ALIGNMENT_STYLES[relevance.alignmentLevel];

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className={`${style.bg} ${style.text} border-0 text-xs font-medium`}
      >
        {style.label}
      </Badge>
      {relevance.signals[0] && (
        <span className="text-caption font-[500] leading-[1.5] tracking-[0.025em] text-muted-foreground truncate">
          {relevance.signals[0]}
        </span>
      )}
    </div>
  );
}
```

### 9C. Export

Add to `src/components/discovery/index.ts`:
```typescript
export { ProductLensSelector } from './product-lens-selector';
export { ProductRelevanceBadge } from './product-relevance-badge';
```

---

## 10. What This Prompt Does NOT Do

- Does **not** implement real matching logic — all relevance is static fixtures
- Does **not** modify district profile page or playbook views
- Does **not** add product-specific follow-up chips (future enhancement)
- Does **not** persist lens selection across page navigation (resets on page remount — acceptable for prototype)

---

## 11. Verification

### Product Lens Selector

- [ ] Entry state: product lens selector appears below the search input when products load
- [ ] Selector shows "No product lens" default + 2 product options (EnvisionMath, myPerspectives)
- [ ] Selecting a product shows a cyan chip with the product name and × clear button
- [ ] Clearing via × returns to "No product lens" state
- [ ] Results state: product lens appears inline to the right of the compact input bar
- [ ] Lens selection persists when executing a new query
- [ ] Lens selection persists when navigating between follow-up chip queries
- [ ] `handleClearResults` does NOT reset the product lens

### Product Relevance in Results — EnvisionMath Lens

Run S1 ("large districts sacramento math evaluations") with EnvisionMath selected:
- [ ] Each district card in the key signals grid shows a product relevance zone
- [ ] Elk Grove: "Strong alignment" badge + signal text
- [ ] Twin Rivers: "Strong alignment" badge
- [ ] Sacramento City: "Moderate alignment" badge
- [ ] Natomas: "Limited alignment" badge

Run S7 ("rank sacramento math decline") with EnvisionMath selected:
- [ ] Each ranked list entry card shows product relevance zone
- [ ] Different alignment levels per district

Run S8 ("sacramento county districts english learner") with EnvisionMath selected:
- [ ] Card set entries show product relevance zones

Run S4 ("compare elk grove twin rivers math") with EnvisionMath selected:
- [ ] Comparison table shows "Product Alignment" row with badges per entity
- [ ] Desktop: alignment badges in table cells
- [ ] Mobile: alignment section at bottom of each stacked card

Run S2 ("fresno enrollment") with EnvisionMath selected:
- [ ] Product relevance indicator appears below the action link

### Product Switching

- [ ] Switch from EnvisionMath to myPerspectives
- [ ] Re-run S1 — relevance indicators change (Elk Grove goes from "Strong" to "Limited")
- [ ] Chip text changes from "EnvisionMath" to "myPerspectives"

### Lens Off

- [ ] Clear the lens via × chip button
- [ ] Re-run any scenario — no product relevance zones render
- [ ] Cards return to exact pre-lens appearance
- [ ] No empty gaps or placeholders where relevance zones were

### Recovery and Edge Cases

- [ ] S5 Recovery scenario with lens active: no relevance rendering (no district entities)
- [ ] S3 Intelligence Brief with lens active: no relevance in key signals (they're metric tiles without districtId), but relevance badge could appear if subjectDistrictId matches — check if this is desired or should be skipped
- [ ] S6 Plumas with lens active: same as S3 — subject district may get relevance but metric tiles stay as tiles

### Build

- [ ] `npm run build` passes with all changes
