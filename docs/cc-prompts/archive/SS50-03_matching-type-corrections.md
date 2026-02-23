# SS50-03: Matching Type Corrections — Batch Signature, Plural Signals, SolutionMatch

**Spec reference:** `Specs/16_Product-District-Matching-System.md` (Sections 3, 8)
**Depends on:** SS50-01 and SS50-02 (both complete)
**Session:** SS-50
**Scope:** Three targeted corrections to align implementation with Spec 16. No UI changes.

---

## Context

SS50-01 and SS50-02 were executed successfully but diverged from the spec in three areas that will cause issues in upcoming lens wiring work. This prompt corrects them.

---

## Correction 1: `AlignmentDimension.signal` → `signals` (plural)

In `src/services/types/common.ts`, change the `AlignmentDimension` interface:

**Current:**
```typescript
export interface AlignmentDimension {
  key: AlignmentDimensionKey;
  tier: MatchTier;
  signal: string;            // one-sentence evidence
}
```

**Replace with:**
```typescript
export interface AlignmentDimension {
  key: AlignmentDimensionKey;
  tier: MatchTier;
  signals: string[];          // evidence statements for this dimension
  productConnection: string;  // how the product relates to this dimension
}
```

**Then update all consumers of `.signal` → `.signals[0]` or populate as arrays:**

### `src/services/providers/mock/mock-district-service.ts`

In the `getMatchSummaries` method, update every `AlignmentDimension` literal. Each current `signal: "..."` becomes `signals: ["..."], productConnection: "..."`. Use the existing signal text for `signals[0]` and derive a short product connection statement.

Example for the Elk Grove + prod-001 path:
```typescript
{
  key: 'goals_priorities',
  tier: overallTier,
  signals: [alignment.signals[0]],
  productConnection: 'Product focus areas align with district strategic goals.',
},
```

For the fallback hash-based path, same pattern:
```typescript
{
  key: 'goals_priorities',
  tier: overallTier,
  signals: [`District ${productName} goals ${overallTier === 'limited' ? 'do not closely ' : ''}align with product focus.`],
  productConnection: `Product addresses district ${productName} priorities.`,
},
```

### `src/services/providers/mock/fixtures/playbooks.ts`

Update every `AlignmentDimension` in the four seed playbooks. Each `signal: "..."` becomes `signals: ["..."], productConnection: "..."`.

For example, pb-seed-004:
```typescript
{ key: 'competitive_landscape', tier: 'limited', signals: ['Competing math program adopted with a 5-year contract.'], productConnection: 'Product competes directly with current adoption.' },
{ key: 'goals_priorities', tier: 'moderate', signals: ['Large district with math needs but evaluation timing unclear.'], productConnection: 'Product addresses math intervention needs.' },
```

Apply the same pattern to pb-seed-005, pb-seed-006, pb-seed-007 — each dimension gets `signals` (array) and `productConnection` (string).

### `src/services/providers/mock/mock-playbook-service.ts`

In the `generatePlaybook` method, update the dimension literals:
```typescript
dimensions: [
  { key: 'goals_priorities', tier: overallTier, signals: [`District priorities align with ${productLabel} focus areas.`], productConnection: `${productLabel} directly addresses stated district goals.` },
  { key: 'student_population', tier: 'moderate', signals: ['Student demographics suggest moderate opportunity.'], productConnection: 'Product target population overlaps with district demographics.' },
],
```

---

## Correction 2: `getMatchSummaries` batch signature

The current signature accepts a single districtId. The spec requires a batch pattern for efficient list rendering (discovery cards, saved districts).

### `src/services/interfaces/district-service.ts`

**Current:**
```typescript
  getMatchSummaries(districtId: string, productIds: string[]): Promise<MatchSummary>;
```

**Replace with:**
```typescript
  // Batch: returns match summaries for multiple districts against a single product.
  // Used by discovery, saved districts, and other list surfaces.
  // Districts not found or without matching data are omitted from the result.
  getMatchSummaries(productId: string, districtIds: string[]): Promise<Record<string, MatchSummary>>;
```

Note the parameter change: `productId` (singular) + `districtIds` (plural array), returns a `Record` keyed by districtId. This matches the lens model — single product lens active, multiple districts displayed.

### `src/services/providers/mock/mock-district-service.ts`

Replace the entire `getMatchSummaries` method. The new implementation iterates over the `districtIds` array and builds a `Record<string, MatchSummary>`:

```typescript
  async getMatchSummaries(productId: string, districtIds: string[]): Promise<Record<string, MatchSummary>> {
    await delay(100 + Math.floor(Math.random() * 100));

    const productMap = PRODUCT_RELEVANCE_MAPS[productId];
    const result: Record<string, MatchSummary> = {};

    for (const districtId of districtIds) {
      const district = MOCK_DISTRICTS.find((d) => d.districtId === districtId);
      if (!district) continue;

      const alignment = productMap?.[districtId];

      if (alignment) {
        const coverage = DISCOVERY_COVERAGE[districtId];
        const overallTier: MatchTier = alignment.level;

        const dimensions: AlignmentDimension[] = [
          {
            key: 'goals_priorities',
            tier: overallTier,
            signals: [alignment.signals[0]],
            productConnection: 'Product focus areas align with district strategic goals.',
          },
          {
            key: 'student_population',
            tier: overallTier === 'limited' ? 'limited' : 'moderate',
            signals: [`${district.totalEnrollment.toLocaleString()} students enrolled across ${district.name}.`],
            productConnection: 'Product target population overlaps with district demographics.',
          },
          {
            key: 'budget_capacity',
            tier: coverage?.categories.find((c) => c.category === 'budget_funding')?.level === 1 ? 'strong' : 'moderate',
            signals: [alignment.signals.length > 1 ? alignment.signals[1] : 'Budget data available through LCAP filings.'],
            productConnection: 'Product price point aligns with available funding sources.',
          },
        ];

        const competitiveCoverage = coverage?.categories.find((c) => c.category === 'competitive_landscape');
        if (competitiveCoverage && competitiveCoverage.level <= 3) {
          dimensions.push({
            key: 'competitive_landscape',
            tier: competitiveCoverage.level === 1 ? 'strong' : competitiveCoverage.level === 2 ? 'moderate' : 'limited',
            signals: [competitiveCoverage.note || 'Competitive landscape data available.'],
            productConnection: 'Product positioning relative to current vendor landscape.',
          });
        }

        result[districtId] = {
          overallTier,
          headline: alignment.primaryConnection,
          dimensions,
          topSignals: alignment.signals,
        };
      } else {
        // Fallback: deterministic hash for districts not in PRODUCT_RELEVANCE_MAPS
        const hashInput = `${districtId}:${productId}`;
        let hash = 0;
        for (let i = 0; i < hashInput.length; i++) {
          const char = hashInput.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash |= 0;
        }
        const fitScore = Math.abs(hash) % 11;
        const overallTier: MatchTier = fitScore >= 7 ? 'strong' : fitScore >= 4 ? 'moderate' : 'limited';
        const productName = productId === 'prod-001' ? 'mathematics' : 'ELA';

        result[districtId] = {
          overallTier,
          headline: `${overallTier === 'strong' ? 'Strong' : overallTier === 'moderate' ? 'Moderate' : 'Limited'} alignment with district ${productName} priorities`,
          dimensions: [
            { key: 'goals_priorities', tier: overallTier, signals: [`District ${productName} goals ${overallTier === 'limited' ? 'do not closely ' : ''}align with product focus.`], productConnection: `Product addresses district ${productName} priorities.` },
            { key: 'student_population', tier: 'moderate', signals: ['Student demographics suggest moderate opportunity.'], productConnection: 'Product target population overlaps with district demographics.' },
          ],
          topSignals: [
            `District prioritizes ${productName} improvement in strategic plan.`,
            `${district.totalEnrollment.toLocaleString()} students enrolled.`,
          ],
        };
      }
    }

    return result;
  },
```

---

## Correction 3: `SolutionMatch` cross-product container

The current `SolutionMatch` is a per-product wrapper. The spec defines it as a cross-product container with combined assessment and gap analysis.

### `src/services/types/common.ts`

**Current:**
```typescript
export interface SolutionMatch {
  productId: string;
  productName: string;
  summary: MatchSummary;
}
```

**Replace with:**
```typescript
/** Multi-product solution assessment — future state (Spec 16 §3.2) */
export interface SolutionMatch {
  districtId: string;
  products: ProductDistrictMatch[];
  combinedTier: MatchTier;
  coverageSummary: string;
  gaps: string[];
  solutionSynthesis: string;
}
```

No consumers reference `SolutionMatch` yet, so this is a clean replacement with no cascade.

---

## Verification

1. `npm run build` — zero errors
2. Grep `signals:` in mock-district-service.ts — should find array syntax `signals: [...]` not `signal: "..."`
3. Grep `getMatchSummaries` in district-service.ts — signature should be `(productId: string, districtIds: string[]): Promise<Record<string, MatchSummary>>`
4. Grep `SolutionMatch` in common.ts — should have `products: ProductDistrictMatch[]`, `combinedTier`, `gaps`, `solutionSynthesis`
5. No UI changes

---

## Files Modified

| File | Changes |
|---|---|
| `src/services/types/common.ts` | `AlignmentDimension`: `signal` → `signals: string[]` + add `productConnection`. `SolutionMatch`: replace with cross-product container. |
| `src/services/interfaces/district-service.ts` | `getMatchSummaries` signature: `(productId, districtIds[]) → Record<string, MatchSummary>` |
| `src/services/providers/mock/mock-district-service.ts` | Rewrite `getMatchSummaries` for batch pattern, update dimension literals |
| `src/services/providers/mock/fixtures/playbooks.ts` | Update all dimension literals in seed playbooks: `signal` → `signals[]` + `productConnection` |
| `src/services/providers/mock/mock-playbook-service.ts` | Update dimension literals in `generatePlaybook` |
