# SS50-02: Mock Provider — Implement getMatchSummaries and Migrate Fixtures

**Spec reference:** `Specs/16_Product-District-Matching-System.md` (Sections 3, 6)
**Depends on:** SS50-01 (type migration must be complete and building)
**Session:** SS-50
**Scope:** Mock provider implementation, fixture data migration. No UI changes.

---

## Goal

Implement the `getMatchSummaries` method on the mock district service and update playbook seed fixtures to populate `matchSummary`. This provides the data layer for all downstream UI work (lens wiring, badge rendering, etc.).

---

## Step 1: Implement `getMatchSummaries` in mock district service

In `src/services/providers/mock/mock-district-service.ts`:

Add imports:
```typescript
import type { PaginatedRequest, PaginatedResponse, FitAssessment, MatchSummary, MatchTier, AlignmentDimension, AlignmentDimensionKey } from '../../types/common';
```

Add the `getMatchSummaries` method to the `mockDistrictService` object. This method should:

1. Accept `productId: string` and `districtIds: string[]`
2. Return `Record<string, MatchSummary>` keyed by districtId
3. Use the existing `PRODUCT_RELEVANCE_MAPS` from discovery fixtures as the data source — these already contain per-product-per-district alignment data with `level`, `signals`, and `primaryConnection`
4. Map from `ProductAlignment` → `MatchSummary`:
   - `overallTier` = `ProductAlignment.level` (already `'strong' | 'moderate' | 'limited'`)
   - `primaryConnection` = `ProductAlignment.primaryConnection`
   - `dimensionCount` = 4 (all four dimensions assessed in mock)
   - `strongDimensionCount` = derive from tier: strong→3, moderate→2, limited→1
   - `confidence` = `'high'` for districts in `DISCOVERY_COVERAGE` with overallLevel ≤ 2, `'moderate'` for level 3, `'low'` for level ≥ 4
5. For districts not found in `PRODUCT_RELEVANCE_MAPS` for the given product, omit from the result (don't throw)
6. Simulate 100-200ms delay

Import `PRODUCT_RELEVANCE_MAPS` from `./fixtures/discovery` and `DISCOVERY_COVERAGE` from `./fixtures/discovery`.

```typescript
async getMatchSummaries(productId: string, districtIds: string[]): Promise<Record<string, MatchSummary>> {
    await delay(100 + Math.floor(Math.random() * 100));

    const productMap = PRODUCT_RELEVANCE_MAPS[productId];
    if (!productMap) return {};

    const result: Record<string, MatchSummary> = {};

    for (const districtId of districtIds) {
      const alignment = productMap[districtId];
      if (!alignment) continue;

      const coverage = DISCOVERY_COVERAGE[districtId];
      const coverageLevel = coverage?.overallLevel ?? 5;

      result[districtId] = {
        overallTier: alignment.level,
        primaryConnection: alignment.primaryConnection,
        dimensionCount: 4,
        strongDimensionCount: alignment.level === 'strong' ? 3 : alignment.level === 'moderate' ? 2 : 1,
        confidence: coverageLevel <= 2 ? 'high' : coverageLevel <= 3 ? 'moderate' : 'low',
      };
    }

    return result;
  },
```

## Step 2: Update playbook seed fixtures with `matchSummary`

In `src/services/providers/mock/fixtures/playbooks.ts`:

Add import:
```typescript
import type { MatchSummary } from '../../../types/common';
```

For each playbook in `SEED_PLAYBOOKS`, add a `matchSummary` field derived from the existing `fitAssessment`. Mapping:

| fitScore | overallTier | primaryConnection (derive from fitRationale) |
|---|---|---|
| 0–3 | `'limited'` | Extract key phrase from fitRationale |
| 4–6 | `'moderate'` | Extract key phrase from fitRationale |
| 7–10 | `'strong'` | Extract key phrase from fitRationale |

Concrete values for each seed playbook:

**pb-seed-004** (Fresno, fitScore 2):
```typescript
matchSummary: {
  overallTier: 'limited',
  primaryConnection: 'District recently adopted a competing math program with a 5-year contract',
  dimensionCount: 4,
  strongDimensionCount: 0,
  confidence: 'high',
},
```

**pb-seed-005** (San Diego, fitScore 7):
```typescript
matchSummary: {
  overallTier: 'strong',
  primaryConnection: 'Strong alignment with district STEM and literacy initiatives',
  dimensionCount: 4,
  strongDimensionCount: 3,
  confidence: 'moderate',
},
```

**pb-seed-006** (Oakland, fitScore 6):
```typescript
matchSummary: {
  overallTier: 'moderate',
  primaryConnection: 'Strong ELA needs but budget constraints limit near-term adoption',
  dimensionCount: 4,
  strongDimensionCount: 2,
  confidence: 'moderate',
},
```

**pb-seed-007** (Long Beach, fitScore 8):
```typescript
matchSummary: {
  overallTier: 'strong',
  primaryConnection: 'District piloting new math curriculum and evaluating ELA supplements',
  dimensionCount: 4,
  strongDimensionCount: 3,
  confidence: 'high',
},
```

## Step 3: Update mock playbook service generation

In `src/services/providers/mock/mock-playbook-service.ts`:

When generating new playbooks (in the `generatePlaybook` method), also compute and assign `matchSummary` alongside the existing `fitAssessment` computation. Use the same tier-mapping logic:

```typescript
const matchSummary: MatchSummary = {
  overallTier: fitScore >= 7 ? 'strong' : fitScore >= 4 ? 'moderate' : 'limited',
  primaryConnection: fitRationale,
  dimensionCount: 4,
  strongDimensionCount: fitScore >= 7 ? 3 : fitScore >= 4 ? 2 : fitScore >= 2 ? 1 : 0,
  confidence: 'moderate',
};
```

Add the `matchSummary` to the stored playbook object wherever `fitAssessment` is assigned.

Add import:
```typescript
import type { MatchSummary } from '../../types/common';
```

---

## Verification

After all changes:

1. Run `npm run build` — should compile with zero errors
2. Open the app, navigate to an existing playbook — should still render (fitAssessment still present)
3. Verify in browser devtools or console: call `getMatchSummaries('prod-001', ['a2671310-4656-4e43-a91a-7688536f1764'])` — should return a `MatchSummary` for Elk Grove with `overallTier: 'strong'`
4. No UI changes visible — this is data layer only

---

## Files Modified

| File | Changes |
|---|---|
| `src/services/providers/mock/mock-district-service.ts` | Add `getMatchSummaries` implementation, add imports for `PRODUCT_RELEVANCE_MAPS` and `DISCOVERY_COVERAGE` |
| `src/services/providers/mock/fixtures/playbooks.ts` | Add `matchSummary` to all 4 seed playbooks |
| `src/services/providers/mock/mock-playbook-service.ts` | Add `matchSummary` computation in `generatePlaybook` |
