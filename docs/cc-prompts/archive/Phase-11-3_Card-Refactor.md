# CC Prompt: Phase 11-3 — DistrictListCard Refactor (Snapshot-Driven Rendering)

**Purpose:** Refactor DistrictListCard to render from DistrictSnapshot instead of individual props. Update all consumers.  
**Prerequisite:** Phase 11-1 (types) and Phase 11-2 (mock providers) must be complete.  
**Spec reference:** `/docs/specs/15_District-List-Experience-Specification.md` §4 (Information Hierarchy), §5 (Action Model), §6 (Structured Row Layout)

---

## Context

The `DistrictListCard` currently accepts ~15 individual props. After Phase 11-1/11-2, the data now arrives as a `DistrictSnapshot` object. The card needs to derive its display from the snapshot, simplifying the interface and ensuring consistency across all six list contexts.

## Tasks

### 1. Redesign DistrictListCard Props Interface

Replace individual identity/metric props with a single `snapshot` prop:

```typescript
interface DistrictListCardProps {
  // Core data — single source of truth
  snapshot: DistrictSnapshot;
  
  // Display configuration
  variant?: 'surface' | 'inset';
  rank?: number;
  
  // Contextual data layers (on top of snapshot)
  productAlignment?: ProductAlignment;    // REPLACES productRelevance
  fitAssessment?: FitAssessment;          // keep if audit says still used
  fitLoading?: boolean;
  
  // AI-generated metrics (override/supplement snapshot metrics)
  additionalMetrics?: Array<{ label: string; value: string }>;
  activeSortMetric?: string;
  
  // Query context — determines which academic metric to show
  academicMetricOverride?: 'math' | 'ela';  // default: 'ela'
  
  // Actions
  isSaved?: boolean;
  onSave?: (districtId: string) => void;
  onRemoveSaved?: (districtId: string) => void;
  onGeneratePlaybook?: (districtId: string) => void;
  
  // Escape hatch
  children?: React.ReactNode;
}
```

### 2. Implement Tier 1 — Identity Zone (Row 1)

Derive all identity display from `snapshot`:

- **District name:** `snapshot.name` — styled as link color
- **Location:** `${snapshot.city}, ${snapshot.county}`
- **Grade band:** Derive display string from `snapshot.lowGrade` + `snapshot.highGrade`:
  - "K" + "12" → "K–12"
  - "K" + "8" → "K–8"  
  - "9" + "12" → "9–12"
  - etc.
- **District type badge:** Show ONLY when `snapshot.docType !== 'Unified'`. Render as a small Badge with the docType text. This is a constraint signal — Unified is the default assumption.

### 3. Implement Tier 2 — Metrics Strip (Row 2)

Build the metrics strip from snapshot fields in fixed order:

```typescript
const metricsStrip = [
  { label: 'Enrollment', value: formatNumber(snapshot.totalEnrollment) },
  { label: 'FRPM', value: `${snapshot.frpmPercent}%` },
  { label: 'ELL', value: `${snapshot.ellPercent}%` },
  { 
    label: academicMetricOverride === 'math' ? 'Math Prof.' : 'ELA Prof.',
    value: `${academicMetricOverride === 'math' ? snapshot.mathProficiency : snapshot.elaProficiency}%`
  },
];
```

If `additionalMetrics` are provided (from AI response), append them after the snapshot metrics.

### 4. Implement Tier 3 — Product Alignment (Conditional)

When `productAlignment` is present:

- Render alignment level badge: `strong` (green), `moderate` (amber), `limited` (slate)
- Render `primaryConnection` text next to the badge (truncated with ellipsis at ~200px)
- Use the same visual pattern as the current `ProductRelevance` rendering but with the new field names

### 5. Update All Consumers

Reference the code audit (Phase 11-0) for the full consumer list. For each consumer of `DistrictListCard`:

**`ranked-list-renderer.tsx`:**
- Pass `snapshot={entry.snapshot}` instead of individual `districtId`, `name` props
- Pass `productAlignment={productRelevanceMap?.[entry.districtId]}` (renamed from productRelevance)
- Keep `rank`, `additionalMetrics` (from entry.primaryMetric + secondaryMetrics), `activeSortMetric`

**`card-set-renderer.tsx`:**
- Pass `snapshot={entry.snapshot}` instead of individual props
- Pass `productAlignment={productRelevanceMap?.[entry.districtId]}`
- Keep `additionalMetrics` (from entry.keyMetric)

**Any other consumers identified in the audit** — apply the same pattern.

### 6. Update ProductLensSelector

In `/src/components/discovery/product-lens-selector.tsx`:

- Update the products prop type from `Array<{ productId: string; name: string }>` to `ProductLensSummary[]`
- The component currently only uses `productId` and `name`, so the additional fields (`category`, `targetGradeBands`) are available but not displayed yet
- This is a non-breaking change — just widen the accepted type

### 7. Update ProductRelevanceBadge (if it exists)

If `/src/components/discovery/product-relevance-badge.tsx` is a standalone component:
- Rename to `product-alignment-badge.tsx`
- Update props to accept `ProductAlignment` instead of `ProductRelevance`
- If the audit shows this component is unused (alignment is rendered inline in the card), delete it

### 8. Handle the `metrics` Prop Migration

The current card accepts a generic `metrics` array that consumers populate differently. In the new design:
- Snapshot-derived metrics (Enrollment, FRPM, ELL, Academic) are ALWAYS shown from snapshot — no prop needed
- AI-generated metrics that are ADDITIONAL to snapshot data go in `additionalMetrics`
- The `metrics` prop is removed. If any consumer passes metrics that duplicate snapshot data (e.g., enrollment), those are now redundant.

## Verification

After all changes:
1. Run `npx tsc --noEmit` — should compile cleanly
2. Run `npm run build` — should build successfully
3. Run `npm run dev` and verify:
   - Navigate to discovery, try a ranked list query (e.g., "top math districts in LA County")
   - Verify card renders: name, location, grade band, enrollment, FRPM%, ELL%, proficiency
   - Verify product alignment badge appears when lens is active
   - Verify card click navigates to district profile
   - Verify save button works
   - Verify playbook CTA works
4. Check the browser console for any runtime errors

## What NOT to Do

- Do not implement column header sort yet (Phase 11-4)
- Do not implement the filter sheet/popover yet (Phase 11-4)
- Do not implement library readiness progressive disclosure yet (Phase 11-5)
- Do not change the DistrictListingsContainer layout structure yet
- Preserve backward compatibility — if a consumer can't be updated immediately, keep the old prop interface working alongside the new one temporarily
