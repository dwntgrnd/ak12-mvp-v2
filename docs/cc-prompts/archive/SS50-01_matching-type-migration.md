# SS50-01: Matching Type Migration — Replace FitAssessment + ProductAlignment

**Spec reference:** `Specs/16_Product-District-Matching-System.md` (Sections 3, 4)
**Session:** SS-50
**Scope:** Type definitions, design tokens, interface updates. No UI changes. No mock data changes (that's SS50-02).

---

## Goal

Replace the dual matching type system (`FitAssessment` + `ProductAlignment`) with the unified `MatchTier` / `MatchSummary` / `ProductDistrictMatch` model defined in Spec 16.

---

## Step 1: Add new matching types to `src/services/types/common.ts`

Add the following types. Keep all existing types in `common.ts` — only `FitAssessment` will be deprecated in Step 3.

```typescript
// ---- Product-District Matching (Spec 16) ----

export type MatchTier = 'strong' | 'moderate' | 'limited';

export type AlignmentDimensionKey =
  | 'academic_need'
  | 'demographic_fit'
  | 'strategic_priority'
  | 'budget_readiness';

export interface AlignmentDimension {
  dimension: AlignmentDimensionKey;
  tier: MatchTier;
  signals: string[];
  productConnection: string;
}

export interface MatchSummary {
  overallTier: MatchTier;
  primaryConnection: string;
  dimensionCount: number;
  strongDimensionCount: number;
  confidence: 'high' | 'moderate' | 'low';
}

export interface ProductDistrictMatch {
  productId: string;
  districtId: string;
  summary: MatchSummary;
  dimensions: AlignmentDimension[];
  synthesis: string;
  assessedAt: string;
  dataSourcesUsed: string[];
}

// Future state — multi-product solution assessment (Spec 16 §3.2)
export interface SolutionMatch {
  districtId: string;
  products: ProductDistrictMatch[];
  combinedTier: MatchTier;
  coverageSummary: string;
  gaps: string[];
  solutionSynthesis: string;
}
```

## Step 2: Update `ProductAlignment` in `src/services/types/discovery.ts`

Replace the `ProductAlignment` interface and its deprecated alias with a re-export from `common.ts`:

**Remove** (find and delete):
```typescript
export interface ProductAlignment {
  level: 'strong' | 'moderate' | 'limited';
  signals: string[];
  primaryConnection: string;
}

/** @deprecated Use ProductAlignment instead */
export type ProductRelevance = ProductAlignment;
```

**Replace with:**
```typescript
// ProductAlignment is replaced by MatchSummary (Spec 16).
// During migration, discovery fixtures still use this shape.
// TODO(SS50-02): Migrate fixtures to MatchSummary, then remove this.
export interface ProductAlignment {
  level: MatchTier;
  signals: string[];
  primaryConnection: string;
}

/** @deprecated Use MatchSummary from common.ts instead */
export type ProductRelevance = ProductAlignment;
```

Add the import at the top of discovery.ts:
```typescript
import type { MatchTier } from './common';
```

**Rationale:** This is a two-step migration. This prompt makes `ProductAlignment.level` use the `MatchTier` type for consistency. SS50-02 will replace `ProductAlignment` usage in fixtures and discovery response types with `MatchSummary`, and the interface can then be fully removed.

## Step 3: Deprecate `FitAssessment` in `src/services/types/common.ts`

Add a deprecation notice to the existing `FitAssessment`. Do NOT delete it yet — consuming code still references it.

```typescript
/**
 * @deprecated Use MatchSummary (display) or ProductDistrictMatch (full detail) instead.
 * Spec 16 replaces numeric fitScore with qualitative MatchTier.
 * Will be removed after SS50-02 migrates all consumers.
 */
export interface FitAssessment {
  fitScore: number;
  fitRationale: string;
}
```

## Step 4: Update consuming types

### `src/services/types/district.ts`

Add `matchSummary` field alongside existing `fitAssessment` (both optional during migration):

```typescript
import type { FitAssessment, MatchSummary } from './common';
```

In `DistrictProfile`, add below the existing `fitAssessment` field:
```typescript
  /** @deprecated Use matchSummary instead */
  fitAssessment?: FitAssessment;
  matchSummary?: MatchSummary;
```

### `src/services/types/playbook.ts`

Add `matchSummary` field alongside existing `fitAssessment` on both types:

```typescript
import type { FitAssessment, ContentSource, SectionStatus, MatchSummary } from './common';
```

In `PlaybookSummary`, add below `fitAssessment`:
```typescript
  /** @deprecated Use matchSummary instead */
  fitAssessment: FitAssessment;
  matchSummary?: MatchSummary;
```

In `Playbook`, add below `fitAssessment`:
```typescript
  /** @deprecated Use matchSummary instead */
  fitAssessment: FitAssessment;
  matchSummary?: MatchSummary;
```

**Note:** `fitAssessment` stays required (not optional) on playbook types during migration because the mock playbook fixtures still populate it. SS50-02 will flip `matchSummary` to required and make `fitAssessment` optional.

## Step 5: Update `IDistrictService` interface

In `src/services/interfaces/district-service.ts`:

Add new import:
```typescript
import type { PaginatedRequest, PaginatedResponse, FitAssessment, MatchSummary } from '../types/common';
```

Add a new method below `getDistrictFitAssessment`:
```typescript
  // Authorization: publisher-admin, publisher-rep
  // Errors: DISTRICT_NOT_FOUND, PRODUCT_NOT_FOUND
  // Returns lightweight match summary for display on cards and identity bars.
  // Batch: accepts array of districtIds for list rendering.
  getMatchSummaries(productId: string, districtIds: string[]): Promise<Record<string, MatchSummary>>;
```

Deprecate the old method:
```typescript
  /** @deprecated Use getMatchSummaries instead. Will be removed after SS50-02. */
  getDistrictFitAssessment(districtId: string, productIds: string[]): Promise<FitAssessment>;
```

## Step 6: Update design tokens

In `src/lib/design-tokens.ts`:

**Rename** `fitCategoryColors` to `matchTierColors` and change the `low` key to `limited`. Update the labels:

```typescript
// Match tier semantic colors (Spec 16)
export const matchTierColors = {
  strong: {
    bg: 'bg-success/10',
    text: 'text-success',
    border: 'border-success',
    label: 'Strong Fit',
  },
  moderate: {
    bg: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning',
    label: 'Moderate Fit',
  },
  limited: {
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    border: 'border-destructive',
    label: 'Limited Fit',
  },
} as const;

export type MatchTierKey = keyof typeof matchTierColors;

/** @deprecated Use matchTierColors and MatchTierKey instead */
export const fitCategoryColors = matchTierColors;
/** @deprecated Use MatchTierKey instead */
export type FitCategoryKey = MatchTierKey;
```

## Step 7: Export new types from barrel

In `src/services/types/` — if there's an `index.ts` barrel file, add exports for the new types. If no barrel exists, skip this step.

---

## Verification

After all changes:

1. Run `npm run build` — should compile with zero new errors (deprecated types are still present, consumers still work)
2. Grep for `MatchSummary` — should appear in `common.ts`, `district.ts`, `playbook.ts`, `district-service.ts`
3. Grep for `matchTierColors` — should appear in `design-tokens.ts`
4. Grep for `@deprecated` — should annotate `FitAssessment`, `fitCategoryColors`, `FitCategoryKey`, `getDistrictFitAssessment`, `ProductRelevance`
5. No UI components should be changed by this prompt

---

## Files Modified

| File | Changes |
|---|---|
| `src/services/types/common.ts` | Add `MatchTier`, `AlignmentDimensionKey`, `AlignmentDimension`, `MatchSummary`, `ProductDistrictMatch`, `SolutionMatch`. Deprecate `FitAssessment`. |
| `src/services/types/discovery.ts` | Import `MatchTier`, update `ProductAlignment.level` type, keep deprecation notice |
| `src/services/types/district.ts` | Add `matchSummary?: MatchSummary` to `DistrictProfile` |
| `src/services/types/playbook.ts` | Add `matchSummary?: MatchSummary` to `PlaybookSummary` and `Playbook` |
| `src/services/interfaces/district-service.ts` | Add `getMatchSummaries` method, deprecate `getDistrictFitAssessment` |
| `src/lib/design-tokens.ts` | Rename `fitCategoryColors` → `matchTierColors`, rename `low` → `limited`, add deprecated aliases |
