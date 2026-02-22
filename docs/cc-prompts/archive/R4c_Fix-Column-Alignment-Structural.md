# R4c — Fix Column Alignment (Structural Rewrite)

**Scope:** 2 files  
**Files:** `/src/components/shared/column-header-bar.tsx`, `/src/components/shared/district-list-card.tsx`  
**Replaces:** R4b (which did not solve the alignment problem)

---

## Why R4b Failed

R4b added shared fixed widths (`METRIC_COL_WIDTHS`) to both the header and card, but didn't fix the root structural problem:

- **Header:** Uses `flex` with identity as `flex-1`. Metric columns are `shrink-0` with fixed widths. Because `flex-1` absorbs all remaining space, metric columns pack to the **right edge**.
- **Card Row 2:** Metrics are inside a LEFT-aligned `flex items-start` container nested inside a `justify-between` wrapper. Metrics pack from the **left edge**.

Shared widths don't help when one group is right-aligned and the other is left-aligned. They occupy opposite sides of the container.

## The Correct Fix

The card's Row 2 must use the **same flex structure** as the header bar: an identity zone with `flex-1` on the left, followed by metric columns with fixed widths that align right. No separate left-packed metrics container.

### Approach: Unified Row Layout

Both header and card Row 2 use this identical flex structure:

```
[identity: flex-1] [metric1: w-fixed] [metric2: w-fixed] [metric3: w-fixed] [metric4: w-fixed]
```

In the header, the identity zone shows "District" label.
In the card Row 2, the identity zone is empty (or holds product alignment info).

This way the four metric columns occupy the exact same horizontal positions in both rows.

---

## Changes to `column-header-bar.tsx`

The header bar is already close to correct. Adjust to ensure consistency:

### 1. Remove `pl-3` padding from metric columns

Currently metric columns have `pl-3` which shifts them relative to the card metrics. Remove this — let the fixed widths alone control positioning. If visual spacing is needed, use consistent padding inside both header and card metric cells.

### 2. Ensure metric columns use `text-left` (not `text-right`)

The previous right-alignment was the original bug. Since card metric values are left-aligned within their cells, headers must also be left-aligned.

Updated metric column classes:
```tsx
// For sortable metric columns:
className={cn(
  'text-overline flex items-center gap-0.5 transition-colors duration-150 shrink-0',
  'hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm',
  isActive ? 'text-foreground' : 'text-muted-foreground',
  widthClass,
  // NO pl-3, NO text-right, NO justify-end
)}
```

### 3. Ensure the root container has NO gap

The root flex should use `gap-0` (or omit `gap` entirely). Spacing comes from the fixed column widths, not from inter-element gaps.

```tsx
<div
  className="flex items-center bg-slate-50 border-b border-border py-1.5 px-4"
  role="row"
  aria-label="Column headers"
>
```

This is already correct (no gap class). Keep it.

---

## Changes to `district-list-card.tsx`

This is the main fix. Card Row 2 must be restructured.

### Current Row 2 structure (BROKEN):
```tsx
<div className="flex items-center justify-between gap-2">
  {/* Left: metrics strip — packs LEFT */}
  <div className="flex items-start min-w-0">
    {stripMetrics.map(...)}
  </div>
  {/* Right: product alignment */}
  {productAlignment && (...)}
</div>
```

### New Row 2 structure (CORRECT):
```tsx
<div className="flex items-start">
  {/* Identity zone — absorbs space, matches header "District" column */}
  <div className="flex-1 min-w-0">
    {/* Product alignment lives here if present */}
    {productAlignment && (
      <div className="flex items-center gap-1.5">
        <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${alignmentBadgeClass[productAlignment.level]}`}>
          {productAlignment.level}
        </span>
        {productAlignment.primaryConnection && (
          <span className="text-xs text-muted-foreground truncate">
            {productAlignment.primaryConnection}
          </span>
        )}
      </div>
    )}
  </div>

  {/* Metric columns — same fixed widths as header, same position */}
  {stripMetrics.slice(0, 4).map((m, i) => {
    const isActive = activeSortMetric != null &&
      m.label.toLowerCase() === activeSortMetric.toLowerCase();
    const colW = i < METRIC_COL_WIDTHS.length ? METRIC_COL_WIDTHS[i] : 'w-[80px]';
    return (
      <div
        key={i}
        className={cn(
          'flex flex-col shrink-0',
          colW,
          isActive && 'bg-primary/5 rounded-sm',
        )}
      >
        <span className={cn(
          'text-overline',
          isActive ? 'text-primary' : 'text-muted-foreground/70'
        )}>
          {m.label}
        </span>
        <span className="text-sm font-bold text-foreground">{m.value}</span>
      </div>
    );
  })}
</div>
```

### Key differences from current code:

1. **No nested metrics container.** Metrics are siblings of the identity zone in the same flex row — exactly like the header.
2. **No `justify-between`.** Identity zone uses `flex-1`, metrics use `shrink-0` with fixed widths. Metrics naturally push right.
3. **No `border-l` dividers between metrics.** The column alignment itself provides visual structure. If dividers are desired, add them back AFTER confirming alignment works — but they add complexity to the spacing and are not essential.
4. **No `pl-3` / `pr-3` on metrics.** Widths handle spacing. If values look too cramped, add small internal padding (`px-1`) consistently to both header and card.
5. **Product alignment moves to the identity zone** (left side, under the district name), not the right side of the metrics strip. This prevents it from pushing metrics off-position.
6. **Only render the first 4 metrics** in the aligned columns (Enrollment, FRPM, ELL, Academic). The 5th metric (`additionalMetrics` from AI — like "EL Population") should NOT be in the aligned columns. Render additional metrics separately below the aligned row, or drop them from this context.

### Handle `additionalMetrics` (5th+ metric)

Currently the card renders AI-generated `additionalMetrics` (like "EL Population: 24.3%") in the same metrics strip. These DON'T have corresponding column headers and break alignment.

**Fix:** Do not include `additionalMetrics` in the aligned metrics row. Either:
- (A) Drop them entirely from the card (they're AI-generated supplementary data, not canonical snapshot fields)
- (B) Render them in a separate line below the aligned metrics row

Option A is simplest and cleanest. The "EL Population" metric is duplicative — it's the same as the "ELL" column from the snapshot. Remove the `additionalMetrics` append from `stripMetrics`:

```tsx
// DELETE this block:
// if (additionalMetrics) {
//   stripMetrics.push(...additionalMetrics);
// }
```

If the `additionalMetrics` prop is needed for future use, keep the prop interface but don't render it in the aligned row. Add a TODO comment.

---

## Updated `METRIC_COL_WIDTHS`

The current widths may be too tight for "Enrollment" to show without truncation. The header shows "Enrollme..." which means 88px is not enough.

In `list-context-config.ts`, increase the Enrollment width:

```typescript
export const METRIC_COL_WIDTHS = [
  'w-[100px]',  // Enrollment — needs room for label + "63,518"
  'w-[64px]',   // FRPM
  'w-[56px]',   // ELL
  'w-[80px]',   // Academic (ELA/Math Prof.)
] as const;
```

---

## Summary of All Changes

### `list-context-config.ts`
- Update `METRIC_COL_WIDTHS[0]` from `'w-[88px]'` to `'w-[100px]'`

### `column-header-bar.tsx`
- Remove `pl-3` paddingClass from metric columns (line with `const paddingClass`)
- Ensure NO `text-right` or `justify-end` on any column

### `district-list-card.tsx`
- Restructure Row 2 from nested `justify-between` to flat flex with `flex-1` identity zone + `shrink-0` metric columns
- Move product alignment into the identity zone (left)
- Remove `border-l` dividers between metric columns
- Remove `additionalMetrics` from the aligned strip (stop appending to `stripMetrics`)
- Use `METRIC_COL_WIDTHS` on each metric column with `shrink-0`

---

## Verification

1. `npm run build` — no errors
2. Navigate to discovery, query "Sacramento county districts english learner"
3. **Critical check:** "Enrollment" header text sits directly above "Enrollment" label in each card
4. **Critical check:** "FRPM" header sits above "FRPM" label in each card
5. **Critical check:** "ELL" header sits above "ELL" label
6. **Critical check:** "ELA Prof." header sits above "ELA Prof." label
7. No "EL Population" column visible in cards (removed from aligned strip)
8. "Enrollment" header is NOT truncated
9. Click sort headers — verify sort still works
10. If product alignment data exists (apply product lens), confirm it renders in the identity zone, not disrupting metric column positions
