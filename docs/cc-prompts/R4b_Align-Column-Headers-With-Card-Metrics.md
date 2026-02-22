# R4b — Align Column Headers with Card Metric Columns

**Scope:** 2 files  
**Files:** `/src/components/shared/column-header-bar.tsx`, `/src/components/shared/district-list-card.tsx`  
**Spec reference:** Spec 15 §6 (Structured Row Layout), Spec 15A — Column Headers acceptance criteria

---

## Problem

Column headers and card metrics don't align vertically. The header bar uses `flex` with `gap-6`, `text-right justify-end` on metric columns, and `flex-1` on the identity column. The card metrics strip uses a different flex container with `border-l` dividers, `pl-3`/`pr-3` padding, and left-aligned text. These two independent flex layouts cannot produce vertical alignment because they distribute space differently.

The visual result: sort labels like "Enrollment", "FRPM", "ELL", "ELA Prof." float right while the corresponding card values sit left — completely disconnected.

## Root Cause

The header and card metrics share `METRIC_MIN_WIDTHS` tokens but don't share a column structure. Min-widths set a floor, not a fixed column. The header's `gap-6` (24px) doesn't match the card's `pl-3 pr-3` (12px+12px) internal spacing. And text alignment is opposite (right vs left).

## Fix Strategy

Both components must use the **same fixed column widths and alignment**. The simplest approach: define explicit fixed widths for metric columns (not just min-widths), and use consistent left-alignment in both header and card.

### Step 1: Update shared column widths in `list-context-config.ts`

Replace `METRIC_MIN_WIDTHS` with fixed widths that both components reference:

```typescript
/** Fixed metric column widths — used by both ColumnHeaderBar and DistrictListCard */
export const METRIC_COL_WIDTHS = [
  'w-[88px]',   // Enrollment (needs room for "63,518")
  'w-[64px]',   // FRPM
  'w-[56px]',   // ELL
  'w-[80px]',   // Academic (ELA/Math Prof.)
] as const;
```

Keep `METRIC_MIN_WIDTHS` exported for backward compatibility but add `METRIC_COL_WIDTHS` as the new canonical reference.

### Step 2: Update `column-header-bar.tsx`

**Remove** `text-right justify-end` from metric columns. Headers should left-align to match the card values below them.

**Replace** `col.minWidth` usage with the corresponding fixed width from `METRIC_COL_WIDTHS` for metric columns. Keep `flex-1 min-w-0` for identity columns.

**Replace** `gap-6` with a smaller consistent gap that matches card internal spacing. Use `gap-0` and let each column's fixed width + consistent padding handle spacing.

Updated structure:

```tsx
export function ColumnHeaderBar({ columns, activeSort, onSortChange }: ColumnHeaderBarProps) {
  return (
    <div
      className="flex items-center bg-slate-50 border-b border-border py-1.5 px-4"
      role="row"
      aria-label="Column headers"
    >
      {columns.map((col, i) => {
        const isActive = activeSort?.key === col.key;
        const isIdentity = col.key === 'rank' || col.key === 'name';
        
        // Map metric columns to fixed widths
        const metricIndex = isIdentity ? -1 : columns.filter((c, j) => j < i && c.key !== 'rank' && c.key !== 'name').length;
        const widthClass = isIdentity 
          ? 'flex-1 min-w-0'
          : (metricIndex < METRIC_COL_WIDTHS.length ? METRIC_COL_WIDTHS[metricIndex] : col.minWidth);
        
        // Metric columns get left padding to match card border-l spacing
        const paddingClass = !isIdentity ? 'pl-3' : '';

        if (!col.sortable) {
          return (
            <div
              key={col.key}
              className={cn(
                'text-overline text-muted-foreground shrink-0',
                widthClass,
                paddingClass,
              )}
              role="columnheader"
              aria-sort="none"
            >
              {col.label}
            </div>
          );
        }

        return (
          <button
            key={col.key}
            type="button"
            onClick={() => onSortChange(getNextSort(col.key, activeSort))}
            className={cn(
              'text-overline flex items-center gap-0.5 transition-colors duration-150 shrink-0',
              'hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm',
              isActive ? 'text-foreground' : 'text-muted-foreground',
              widthClass,
              paddingClass,
            )}
            role="columnheader"
            aria-sort={getAriaSortValue(col.key, activeSort)}
          >
            <span className="truncate">{col.label}</span>
            {isActive && activeSort && (
              activeSort.direction === 'asc'
                ? <ArrowUp className="h-3 w-3 shrink-0" />
                : <ArrowDown className="h-3 w-3 shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
}
```

Key changes:
- Remove `gap-6` from root div
- Remove `text-right justify-end` from metric columns
- Add `shrink-0` to metric columns so they hold their width
- Use `METRIC_COL_WIDTHS` for fixed widths
- Add `pl-3` to metric columns to match card metric `pl-3`

### Step 3: Update `district-list-card.tsx`

The card metrics strip must use the same fixed widths. Replace `min-w` references with `METRIC_COL_WIDTHS`:

In the metrics strip `map`, change:

```tsx
// Before:
const minW = i < METRIC_MIN_WIDTHS.length ? METRIC_MIN_WIDTHS[i] : undefined;

// After:
const colW = i < METRIC_COL_WIDTHS.length ? METRIC_COL_WIDTHS[i] : undefined;
```

And apply `colW` instead of `minW` in the className. Keep `pl-3` and `border-l` divider styling as-is — this already matches what we're adding to the header.

Update the import:
```tsx
import { METRIC_COL_WIDTHS } from './list-context-config';
```

### Step 4: Ensure the card Row 2 metrics container starts at the same horizontal offset as the header metrics

The header bar uses `px-4` padding. The card uses `px-4` on the article, then the metrics strip is inside a `mt-2 pt-2 border-t` div with no additional left padding. 

**Critical:** The card's identity zone (Row 1) uses `flex-1` for the name, and the action buttons (Save, Playbook) sit on the right. The metrics strip (Row 2) starts at the left edge of the card content area. But the header bar starts the identity column at the same left edge.

For true column alignment, the metrics strip in the card must start at the same horizontal position as the metric columns in the header. Since the identity column is `flex-1` in both, and the metrics are `shrink-0` with fixed widths, they should align IF:

- Both containers use the same `px-4` padding (they do)
- The card metrics strip is NOT nested in a sub-container that shifts them left
- Both use the same column widths

Currently the card wraps metrics in `<div className="flex items-start min-w-0">` which is fine — it's a flex container that doesn't add offset.

**However**, the card metrics strip is on the LEFT side of a `justify-between` flex, with product alignment on the RIGHT. The header bar has no right-side element — metrics just sit after the identity `flex-1`.

This means the card's metrics are pushed left (flex-start) while the header's metrics get whatever space remains after the identity flex. These SHOULD be the same position because `flex-1` absorbs remaining space in both cases.

The alignment should work IF the `shrink-0` fixed-width columns are consistent. Test after implementation and adjust if needed.

## Import Updates

In `column-header-bar.tsx`:
```tsx
import { METRIC_COL_WIDTHS } from './list-context-config';
```

In `district-list-card.tsx`:
```tsx
// Change:
import { METRIC_MIN_WIDTHS } from './list-context-config';
// To:
import { METRIC_COL_WIDTHS } from './list-context-config';
```

## Verification

1. Run `npm run build`
2. Navigate to discovery, trigger a card set or ranked list
3. Visually confirm: "Enrollment" header sits directly above each card's Enrollment column
4. Confirm: "FRPM" header sits above FRPM values
5. Confirm: "ELL" header sits above ELL values
6. Confirm: "ELA Prof." header sits above ELA Prof. values
7. Click a sort header — confirm sort still works
8. Resize browser to check nothing collapses awkwardly at narrower widths
