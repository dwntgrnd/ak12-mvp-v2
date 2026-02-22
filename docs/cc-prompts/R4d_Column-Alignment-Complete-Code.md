# R4d — Column Alignment: Complete Code Replacement

**Scope:** 3 files — exact code provided, no interpretation needed  
**Files:**  
- `/src/components/shared/list-context-config.ts` (minor update)  
- `/src/components/shared/column-header-bar.tsx` (full replacement)  
- `/src/components/shared/district-list-card.tsx` (full replacement)

**IMPORTANT:** This prompt provides the COMPLETE file contents for the two component files. Do not interpret, adapt, or "improve" — copy these files exactly. The previous three attempts at this fix failed because prose descriptions of flex behavior were misinterpreted. This time the code is provided verbatim.

---

## Root Cause (for context — do not act on this, just read)

The column header bar and card metrics never aligned because:
1. Header bar has `px-4` (16px inset from container edge)
2. Cards sit inside a `p-4` wrapper AND have their own `px-4` — so card content is inset 32px from the container edge (16px extra)
3. Even with matching flex structures, the 16px offset means columns can't align

The fix: remove the per-card `px-4` padding and let the list wrapper's `p-4` handle horizontal spacing. Then both header and cards share the same 16px inset from the container edge.

---

## File 1: `list-context-config.ts` — ONE change

Find this block:

```typescript
export const METRIC_COL_WIDTHS = [
  'w-[88px]',   // Enrollment (needs room for "63,518")
  'w-[64px]',   // FRPM
  'w-[56px]',   // ELL
  'w-[80px]',   // Academic (ELA/Math Prof.)
] as const;
```

Replace with:

```typescript
export const METRIC_COL_WIDTHS = [
  'w-[100px]',  // Enrollment — fits "63,518" and header label
  'w-[72px]',   // FRPM — fits "182589%" (data bug, but don't truncate)
  'w-[56px]',   // ELL
  'w-[80px]',   // Academic (ELA/Math Prof.)
] as const;
```

No other changes to this file.

---

## File 2: `column-header-bar.tsx` — FULL REPLACEMENT

Replace the ENTIRE file contents with:

```tsx
'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ColumnDefinition, ActiveSort } from './list-context-config';
import { METRIC_COL_WIDTHS } from './list-context-config';

interface ColumnHeaderBarProps {
  columns: ColumnDefinition[];
  activeSort: ActiveSort | null;
  onSortChange: (sort: ActiveSort | null) => void;
}

function getNextSort(
  key: string,
  current: ActiveSort | null,
): ActiveSort | null {
  if (!current || current.key !== key) return { key, direction: 'asc' };
  if (current.direction === 'asc') return { key, direction: 'desc' };
  return null;
}

function getAriaSortValue(
  key: string,
  activeSort: ActiveSort | null,
): 'ascending' | 'descending' | 'none' {
  if (!activeSort || activeSort.key !== key) return 'none';
  return activeSort.direction === 'asc' ? 'ascending' : 'descending';
}

export function ColumnHeaderBar({
  columns,
  activeSort,
  onSortChange,
}: ColumnHeaderBarProps) {
  // Separate identity columns (rank, name) from metric columns
  const identityCols = columns.filter(
    (c) => c.key === 'rank' || c.key === 'name',
  );
  const metricCols = columns.filter(
    (c) => c.key !== 'rank' && c.key !== 'name',
  );

  return (
    <div
      className="flex items-center bg-slate-50 border-y border-border py-1.5 px-4"
      role="row"
      aria-label="Column headers"
    >
      {/* Identity columns — take remaining space */}
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {identityCols.map((col) => {
          const isActive = activeSort?.key === col.key;

          if (!col.sortable) {
            return (
              <span
                key={col.key}
                className="text-overline text-muted-foreground"
                role="columnheader"
                aria-sort="none"
              >
                {col.label}
              </span>
            );
          }

          return (
            <button
              key={col.key}
              type="button"
              onClick={() =>
                onSortChange(getNextSort(col.key, activeSort))
              }
              className={cn(
                'text-overline flex items-center gap-0.5 rounded-sm transition-colors',
                'hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
                isActive ? 'text-foreground' : 'text-muted-foreground',
              )}
              role="columnheader"
              aria-sort={getAriaSortValue(col.key, activeSort)}
            >
              <span>{col.label}</span>
              {isActive && activeSort && (
                activeSort.direction === 'asc' ? (
                  <ArrowUp className="h-3 w-3 shrink-0" />
                ) : (
                  <ArrowDown className="h-3 w-3 shrink-0" />
                )
              )}
            </button>
          );
        })}
      </div>

      {/* Metric columns — fixed widths, left-aligned text */}
      {metricCols.map((col, i) => {
        const isActive = activeSort?.key === col.key;
        const widthClass =
          i < METRIC_COL_WIDTHS.length
            ? METRIC_COL_WIDTHS[i]
            : 'w-[80px]';

        return (
          <button
            key={col.key}
            type="button"
            onClick={() =>
              onSortChange(getNextSort(col.key, activeSort))
            }
            className={cn(
              'text-overline flex items-center gap-0.5 shrink-0 rounded-sm transition-colors',
              'hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring',
              isActive ? 'text-foreground' : 'text-muted-foreground',
              widthClass,
            )}
            role="columnheader"
            aria-sort={getAriaSortValue(col.key, activeSort)}
          >
            <span className="truncate">{col.label}</span>
            {isActive && activeSort && (
              activeSort.direction === 'asc' ? (
                <ArrowUp className="h-3 w-3 shrink-0" />
              ) : (
                <ArrowDown className="h-3 w-3 shrink-0" />
              )
            )}
          </button>
        );
      })}
    </div>
  );
}
```

---

## File 3: `district-list-card.tsx` — FULL REPLACEMENT

Replace the ENTIRE file contents with:

```tsx
'use client';

import { useRouter } from 'next/navigation';
import { Bookmark, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { fitCategoryColors, type FitCategoryKey } from '@/lib/design-tokens';
import { formatNumber } from '@/lib/utils/format';
import { cn } from '@/lib/utils';
import type { FitAssessment } from '@/services/types/common';
import type { ProductAlignment } from '@/services/types/discovery';
import type { DistrictSnapshot } from '@/services/types/district';
import { METRIC_COL_WIDTHS } from './list-context-config';

interface DistrictListCardProps {
  snapshot: DistrictSnapshot;
  variant?: 'surface' | 'inset';
  rank?: number;
  productAlignment?: ProductAlignment;
  fitAssessment?: FitAssessment;
  fitLoading?: boolean;
  additionalMetrics?: Array<{ label: string; value: string }>;
  activeSortMetric?: string;
  academicMetricOverride?: 'math' | 'ela';
  isSaved?: boolean;
  onSave?: (districtId: string) => void;
  onRemoveSaved?: (districtId: string) => void;
  onGeneratePlaybook?: (districtId: string) => void;
  children?: React.ReactNode;
}

const alignmentBadgeClass: Record<ProductAlignment['level'], string> = {
  strong: 'text-success bg-success/10',
  moderate: 'text-warning bg-warning/10',
  limited: 'text-slate-500 bg-slate-100',
};

function getFitCategory(fitScore: number): FitCategoryKey {
  if (fitScore >= 7) return 'strong';
  if (fitScore >= 4) return 'moderate';
  return 'low';
}

function formatGradeBand(low: string, high: string): string {
  return `${low}\u2013${high}`;
}

export function DistrictListCard({
  snapshot,
  variant = 'surface',
  rank,
  productAlignment,
  fitAssessment,
  fitLoading,
  activeSortMetric,
  academicMetricOverride = 'ela',
  isSaved,
  onSave,
  onRemoveSaved,
  onGeneratePlaybook,
  children,
}: DistrictListCardProps) {
  const router = useRouter();
  const { districtId, name } = snapshot;

  const location = `${snapshot.city}, ${snapshot.county}`;
  const gradeBand = formatGradeBand(snapshot.lowGrade, snapshot.highGrade);
  const showDocType = snapshot.docType !== 'Unified';

  // Four canonical metrics — one per column header
  const metrics = [
    { label: 'Enrollment', value: formatNumber(snapshot.totalEnrollment) },
    { label: 'FRPM', value: `${snapshot.frpmPercent}%` },
    { label: 'ELL', value: `${snapshot.ellPercent}%` },
    {
      label: academicMetricOverride === 'math' ? 'Math Prof.' : 'ELA Prof.',
      value: `${academicMetricOverride === 'math' ? snapshot.mathProficiency : snapshot.elaProficiency}%`,
    },
  ];

  const metaParts = [location, gradeBand].filter(Boolean);

  const ariaLabel = [
    rank != null ? `Rank ${rank}.` : null,
    name,
    ...metaParts,
    `${formatNumber(snapshot.totalEnrollment)} students`,
    fitAssessment
      ? fitCategoryColors[getFitCategory(fitAssessment.fitScore)].label
      : null,
    productAlignment ? `${productAlignment.level} alignment` : null,
  ]
    .filter(Boolean)
    .join(' \u00b7 ');

  function handleClick() {
    router.push(`/districts/${districtId}`);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      router.push(`/districts/${districtId}`);
    }
  }

  const fitCategory = fitAssessment
    ? getFitCategory(fitAssessment.fitScore)
    : null;
  const fitColors = fitCategory ? fitCategoryColors[fitCategory] : null;

  /*
   * LAYOUT NOTE — critical for column alignment:
   *
   * This card renders inside DistrictListingsContainer which provides
   * a list wrapper with `p-4`. The ColumnHeaderBar above uses `px-4`.
   * For metrics to align, this card must NOT add its own horizontal
   * padding. Instead it uses the same `px-4` as the header bar.
   *
   * The card surface (border, bg, rounded corners) wraps the full
   * width. Internal content uses the shared px-4 to match the header.
   *
   * Row 1: [identity: flex-1] [actions: shrink-0]
   * Row 2: [identity: flex-1] [metric0: w-fixed] [metric1] [metric2] [metric3]
   *
   * Row 2 mirrors the header bar's flex structure exactly.
   */

  return (
    <article
      role="listitem"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'cursor-pointer focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7000]',
        variant === 'inset'
          ? 'bg-slate-50 border border-border/50 rounded-md hover:bg-slate-100 hover:border-slate-300 transition-colors duration-150'
          : 'bg-white border border-border rounded-lg shadow-sm hover:shadow-md hover:border-slate-300 transition-shadow duration-150',
      )}
    >
      {/* Row 1 — Identity + Actions — uses px-4 to match header */}
      <div className="flex items-center justify-between gap-2 px-4 pt-2.5">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          {rank != null && (
            <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center shrink-0">
              <span className="text-xs font-semibold text-foreground">
                {rank}
              </span>
            </div>
          )}
          <div className="flex items-baseline gap-1.5 min-w-0 flex-1">
            <span className="text-sm font-semibold text-district-link truncate shrink-0">
              {name}
            </span>
            {metaParts.length > 0 && (
              <span className="text-xs text-muted-foreground truncate">
                <span className="mx-1 select-none">&middot;</span>
                {metaParts.join(' \u00b7 ')}
              </span>
            )}
            {showDocType && (
              <Badge
                variant="outline"
                className="text-[10px] px-1.5 py-0 h-4 font-medium text-muted-foreground border-border shrink-0"
              >
                {snapshot.docType}
              </Badge>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {fitLoading && !fitAssessment && <Skeleton className="h-5 w-20" />}
          {fitAssessment && fitColors && (
            <Badge
              className={`${fitColors.bg} ${fitColors.text} ${fitColors.border} border`}
              variant="outline"
            >
              {fitColors.label}
            </Badge>
          )}

          {(onSave || onRemoveSaved) && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                isSaved
                  ? onRemoveSaved?.(districtId)
                  : onSave?.(districtId);
              }}
              aria-pressed={isSaved}
              aria-label={
                isSaved ? 'Remove saved district' : 'Save district'
              }
              className={cn(
                'flex items-center gap-1 rounded-md px-1.5 py-1 text-xs font-medium transition-colors',
                'hover:bg-muted/50',
                isSaved ? 'text-foreground' : 'text-muted-foreground',
              )}
            >
              <Bookmark
                className={cn('h-4 w-4', isSaved && 'fill-current')}
              />
              <span>{isSaved ? 'Saved' : 'Save'}</span>
            </button>
          )}

          {onGeneratePlaybook && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onGeneratePlaybook(districtId);
              }}
              className="flex items-center gap-1 bg-brand-orange text-white text-xs font-medium px-2.5 py-1 rounded-md hover:bg-brand-orange/90 transition-colors"
            >
              Playbook
              <ArrowRight className="h-3 w-3" />
            </button>
          )}
        </div>
      </div>

      {/* Row 2 — Metrics aligned to column headers */}
      {/* Uses px-4 + same flex structure as ColumnHeaderBar: */}
      {/* [flex-1 identity zone] [shrink-0 metric] [shrink-0 metric] ... */}
      <div className="flex items-start px-4 pt-2 pb-2.5 mt-1 border-t border-border/50">
        {/* Identity zone — absorbs remaining space (matches header "District" col) */}
        <div className="flex-1 min-w-0">
          {productAlignment && (
            <div className="flex items-center gap-1.5">
              <span
                className={cn(
                  'inline-flex items-center px-2 py-0.5 rounded text-xs font-medium',
                  alignmentBadgeClass[productAlignment.level],
                )}
              >
                {productAlignment.level}
              </span>
              {productAlignment.primaryConnection && (
                <span className="text-xs text-muted-foreground truncate max-w-[200px]">
                  {productAlignment.primaryConnection}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Metric columns — fixed widths matching header exactly */}
        {metrics.map((m, i) => {
          const isActive =
            activeSortMetric != null &&
            m.label.toLowerCase() === activeSortMetric.toLowerCase();
          const widthClass =
            i < METRIC_COL_WIDTHS.length
              ? METRIC_COL_WIDTHS[i]
              : 'w-[80px]';

          return (
            <div
              key={i}
              className={cn(
                'flex flex-col shrink-0',
                widthClass,
                isActive && 'bg-primary/5 rounded-sm',
              )}
            >
              <span
                className={cn(
                  'text-overline',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground/70',
                )}
              >
                {m.label}
              </span>
              <span className="text-sm font-bold text-foreground">
                {m.value}
              </span>
            </div>
          );
        })}
      </div>

      {children && <div className="mt-1 px-4 pb-2">{children}</div>}
    </article>
  );
}
```

---

## What Changed and Why

### Padding model
The card previously used `px-4` on the `<article>` element, meaning content was inset 16px from the card edge. But the card itself sits inside a `p-4` list wrapper, adding another 16px. Total inset from container: 32px. The header bar only has 16px (`px-4`).

**Fix:** Remove padding from the `<article>` wrapper. Apply `px-4` to each internal row (`Row 1`, `Row 2`, `children`). This way the card border/bg is flush with the list wrapper, but content aligns at the same 16px inset as the header.

BUT WAIT — the card has its own border and rounded corners. It needs to be visually distinct from the wrapper. So we keep the card as a bordered surface, but internal content uses `px-4` — exactly matching the header's `px-4`.

Since the card sits inside a `p-4` wrapper, the card edge is already inset 16px from the container. The card's internal `px-4` adds another 16px. The header's `px-4` only adds 16px from the container. So there's STILL a 16px offset.

**The real fix:** Change the list wrapper from `p-4` to `px-0 py-4` so cards sit flush horizontally with the header bar. Then the card's `px-4` matches the header's `px-4`.

### Container change needed

In `district-listings-container.tsx`, change the list content wrapper:

```tsx
// FIND:
<div className="p-4">

// REPLACE WITH:
<div className="py-3">
```

This removes horizontal padding from the list wrapper. Cards now sit flush with the container horizontally. The card's own `px-4` provides horizontal inset — matching the header's `px-4` exactly.

### Row 2 structure
Mirrors the header: `[flex-1 identity] [shrink-0 metric] [shrink-0 metric] [shrink-0 metric] [shrink-0 metric]`. No nested containers, no justify-between.

### Metric labels in cards
Kept. Column headers label the columns, but the card metrics also show labels. This provides redundancy for scanning. The labels use `text-overline` (same as headers) which is very small — they don't add clutter.

### additionalMetrics removed from aligned strip
The 5th metric (AI-generated, like "EL Population") is dropped from the aligned row. It has no column header and breaks alignment. The prop still exists on the interface but is not destructured or rendered.

---

## File 4: `district-listings-container.tsx` — ONE change

Find:
```tsx
<div className="p-4">
```

(This is the div wrapping loading skeleton, empty state, and list content — around line 193)

Replace with:
```tsx
<div className="py-3 px-4">
```

Wait — that would re-add horizontal padding. Let me think...

The cards have `px-4` internally. The header has `px-4`. If the list wrapper has `px-4` too, then cards are doubly inset. But if the list wrapper has `px-0`, then card borders touch the container edge, which looks wrong — the card surface needs visual margin from the container border.

**Correct approach:** The list wrapper should have small horizontal padding — just enough for the card borders to not touch the container. Use `px-2`:

Find:
```tsx
{/* List content */}
<div className="p-4">
```

Replace with:
```tsx
{/* List content */}
<div className="py-3 px-2">
```

Then the card's `px-4` provides 16px internal padding, and the 8px wrapper padding gives visual margin. The header's `px-4` = 16px. The card content inset = 8px (wrapper) + 16px (card) = 24px. Still an 8px offset.

**Actually correct approach:** Make the header bar also aware of the wrapper padding. Change the header bar to `px-6` (24px) to match 8px wrapper + 16px card. No — this is getting silly.

**Simplest correct approach:** Remove card-level horizontal padding entirely. Let the wrapper control all horizontal spacing. Cards become full-width within the wrapper, with content flush to card edges. The wrapper `p-4` provides all horizontal inset. Cards have no internal px.

But then card borders sit at the wrapper edge, and content is flush with card borders — no internal padding looks bad.

**FINAL approach — the one that actually works:**

Set the list wrapper to `py-3 px-0`. Remove the gap between container edge and cards. Give cards `mx-4 px-4` — the `mx-4` provides visual margin from the container, and `px-4` provides internal content padding. The header already has `px-4` from the container edge. Card content is at 16px (mx) + 16px (px) = 32px. Header is at 16px. Still misaligned.

OK. The cleanest solution: **the header bar also needs to account for card margin.** Both header and card content should land at the same absolute horizontal position. The only way is:

1. Header bar uses `px-4` = 16px inset from container  
2. List wrapper uses `px-0` = cards are flush with container  
3. Cards use `px-4` = 16px inset from container (matching header)  
4. Cards get their visual separation via gap between cards, not horizontal margin  

This means card borders touch the container left/right edges. The card still has rounded corners and border, so it's visually distinct. It just sits edge-to-edge within the container — which is actually a clean, modern look.

**Updated container change:**

Find:
```tsx
<div className="p-4">
```

Replace with:
```tsx
<div className="py-3">
```

No horizontal padding on the wrapper. Cards expand to full container width. Card internal `px-4` = header `px-4` = aligned.

---

## Summary of All File Changes

1. **`list-context-config.ts`** — Update `METRIC_COL_WIDTHS[0]` to `'w-[100px]'` and `[1]` to `'w-[72px]'`
2. **`column-header-bar.tsx`** — Full file replacement (provided above)
3. **`district-list-card.tsx`** — Full file replacement (provided above)
4. **`district-listings-container.tsx`** — Change `<div className="p-4">` to `<div className="py-3">`

---

## Verification

1. `npm run build` — no errors
2. Query "Sacramento county districts english learner"
3. **CRITICAL:** Visually confirm "Enrollment" header aligns with "Enrollment" in each card
4. **CRITICAL:** "FRPM", "ELL", "ELA Prof." headers each align with their card counterparts
5. Cards render full-width within the container (no horizontal gap between card border and container border)
6. Card content has comfortable internal padding
7. Sort clicking still works on all column headers
8. Product alignment (if visible via lens) renders in the identity zone, not displacing metrics
