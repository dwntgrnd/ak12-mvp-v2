# SS51-03: DistrictListCard `matchSummary` Prop

**Session:** SS-51
**Depends on:** SS50-03 (matching types verified)
**Spec reference:** Spec 16 §6.2 (Discovery Cards)

---

## Context

`DistrictListCard` currently renders two types of product-context badges: `fitAssessment` (deprecated, numeric) and `productAlignment` (discovery-specific). We're adding a third prop — `matchSummary` — which uses the new unified `MatchSummary` type from Spec 16. All three props coexist during transition. `matchSummary` takes visual precedence when present.

---

## Requirements

### Modify: `src/components/shared/district-list-card.tsx`

**1. Add prop:**

```typescript
import type { MatchSummary } from '@/services/types/common';
import { matchTierColors } from '@/lib/design-tokens';

// In DistrictListCardProps interface:
matchSummary?: MatchSummary;
```

**2. Rendering logic — Row 1, actions zone (right side):**

The badge rendering priority in the actions zone (where `fitAssessment` badge currently renders):

1. If `matchSummary` is present → render match tier badge using `matchTierColors[matchSummary.overallTier]`. **Do not render `fitAssessment` badge.**
2. Else if `fitAssessment` is present → render existing `fitAssessment` badge (no change to current behavior).
3. Else if `fitLoading` → render existing skeleton.

Match tier badge markup (same visual pattern as existing `fitAssessment` badge):

```tsx
<Badge
  className={`${matchTierColors[matchSummary.overallTier].bg} ${matchTierColors[matchSummary.overallTier].text} ${matchTierColors[matchSummary.overallTier].border} border`}
  variant="outline"
>
  {matchTierColors[matchSummary.overallTier].label}
</Badge>
```

**3. Rendering logic — Row 2, metrics strip:**

The `productAlignment` rendering in the right side of the metrics row currently shows `level` badge + `primaryConnection` text.

When `matchSummary` is present, render the headline instead:

- If `matchSummary` is present → render `matchSummary.headline` as secondary text in the right side of the metrics row. Use the same positioning and styling as the current `productAlignment.primaryConnection` text. **Do not render the `productAlignment` section.**
- Else if `productAlignment` is present → render existing `productAlignment` display (no change).

The headline text should be:
```tsx
<span className="text-xs text-foreground-secondary truncate max-w-[280px]">
  {matchSummary.headline}
</span>
```

No tier badge in the metrics row — the badge is in Row 1 only. The metrics row just shows the headline text.

**4. Aria label update:**

Add `matchSummary` to the aria label construction:

```typescript
matchSummary
  ? `${matchTierColors[matchSummary.overallTier].label} — ${matchSummary.headline}`
  : fitAssessment
    ? fitCategoryColors[getFitCategory(fitAssessment.fitScore)].label
    : null,
```

**5. Do NOT:**

- Remove `fitAssessment`, `fitLoading`, or `productAlignment` props. They remain for backward compatibility.
- Change any rendering when `matchSummary` is not provided — existing behavior is preserved exactly.
- Add any loading state for `matchSummary`. Loading is managed by the parent surface that fetches match data.

---

## Verification

1. `npm run build` passes.
2. Existing discovery ranked list and card set renderers (which pass `productAlignment` but not `matchSummary`) render identically to current behavior.
3. Saved districts page (which passes neither) renders identically.
4. When a `matchSummary` prop is provided, the tier badge appears in Row 1 and the headline appears in the metrics row.
5. When both `matchSummary` and `fitAssessment` are provided, only `matchSummary` badge renders.

---

## Files

| Action | File |
|--------|------|
| Modify | `src/components/shared/district-list-card.tsx` |
