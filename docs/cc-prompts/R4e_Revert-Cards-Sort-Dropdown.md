# R4e — Revert Card Layout, Replace Column Headers with Sort Dropdown

**Scope:** 4 files  
**Priority:** HIGH — current card layout is broken and unreadable  
**Replaces:** R4b, R4c, R4d (all failed to solve column alignment)

---

## Design Decision

**Column header alignment with card metrics is being deferred.** 

After four attempts, column-header-to-card-metric alignment via flex is structurally unsound for this card design. The cards have a two-row layout (identity + metrics) inside bordered surfaces with their own padding, nested inside a padded list wrapper. Getting two independent flex containers (header bar and card Row 2) to produce pixel-aligned columns requires either CSS Grid on a shared parent (significant refactor) or removing all intermediate padding layers (breaks card visual design).

**MVP solution:** Remove the column header bar. Restore the original self-contained card metrics strip (label+value pairs, left-aligned, with vertical dividers). Move sort controls into a dropdown Select in the utility bar. This pattern is used by Linear, Notion, Airtable — sort control in toolbar, cards self-contained.

**Future enhancement:** CSS Grid-based column alignment can be implemented as a Phase 12+ improvement when we refactor the list container architecture.

---

## File 1: `list-context-config.ts`

### Changes:
1. Set `showColumnHeaders: false` in both `RANKED_LIST_CONFIG` and `CARD_SET_CONFIG`
2. Add a `sortOptions` array to `ListContextConfig` for the dropdown
3. Keep `METRIC_COL_WIDTHS` and `METRIC_MIN_WIDTHS` exports (no breaking changes)

### Exact changes:

Add to the `ListContextConfig` interface:
```typescript
export interface ListContextConfig {
  columns: ColumnDefinition[];
  availableFilters: SheetFilterDefinition[];
  showLocalFilter: boolean;
  showColumnHeaders: boolean;
  searchPlaceholder: string;
  /** Sort options for dropdown when column headers are hidden */
  sortOptions: Array<{ key: string; label: string }>;
}
```

Add sort options to shared config:
```typescript
const SHARED_SORT_OPTIONS = [
  { key: 'name', label: 'District Name' },
  { key: 'enrollment', label: 'Enrollment' },
  { key: 'frpm', label: 'FRPM %' },
  { key: 'ell', label: 'ELL %' },
  { key: 'academic', label: 'Academic Proficiency' },
];
```

Update both presets:
```typescript
export const RANKED_LIST_CONFIG: ListContextConfig = {
  columns: [ /* keep existing */ ],
  availableFilters: SHARED_FILTERS,
  showLocalFilter: false,
  showColumnHeaders: false,    // ← CHANGED from true
  searchPlaceholder: '',
  sortOptions: SHARED_SORT_OPTIONS,
};

export const CARD_SET_CONFIG: ListContextConfig = {
  columns: [ /* keep existing */ ],
  availableFilters: SHARED_FILTERS,
  showLocalFilter: false,
  showColumnHeaders: false,    // ← CHANGED from true
  searchPlaceholder: '',
  sortOptions: SHARED_SORT_OPTIONS,
};
```

Update `buildListContextConfig` to extend `sortOptions` when product lens is active:
```typescript
export function buildListContextConfig(
  base: ListContextConfig,
  options: { hasProducts: boolean; productLensActive: boolean; academicLabel?: string },
): ListContextConfig {
  let columns = base.columns;
  let sortOptions = base.sortOptions;

  if (options.academicLabel) {
    columns = columns.map((col) =>
      col.key === 'academic' ? { ...col, label: options.academicLabel! } : col,
    );
    sortOptions = sortOptions.map((opt) =>
      opt.key === 'academic' ? { ...opt, label: options.academicLabel! } : opt,
    );
  }

  if (!options.hasProducts || !options.productLensActive) {
    return (columns !== base.columns || sortOptions !== base.sortOptions)
      ? { ...base, columns, sortOptions }
      : base;
  }

  return {
    ...base,
    columns: [...columns, ALIGNMENT_COLUMN],
    availableFilters: [...base.availableFilters, ALIGNMENT_LEVEL_FILTER],
    sortOptions: [...sortOptions, { key: 'alignment', label: 'Alignment' }],
  };
}
```

---

## File 2: `district-list-card.tsx` — FULL REPLACEMENT

Revert to the original self-contained card layout. The card renders its own labeled metrics strip with vertical dividers. No dependency on column header alignment.

Replace the ENTIRE file with:

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
  additionalMetrics,
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

  // Metrics strip — fixed order from snapshot
  const stripMetrics: Array<{ label: string; value: string }> = [
    { label: 'Enrollment', value: formatNumber(snapshot.totalEnrollment) },
    { label: 'FRPM', value: `${snapshot.frpmPercent}%` },
    { label: 'ELL', value: `${snapshot.ellPercent}%` },
    {
      label: academicMetricOverride === 'math' ? 'Math Prof.' : 'ELA Prof.',
      value: `${academicMetricOverride === 'math' ? snapshot.mathProficiency : snapshot.elaProficiency}%`,
    },
  ];

  // Append AI-generated additional metrics
  if (additionalMetrics) {
    stripMetrics.push(...additionalMetrics);
  }

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

  return (
    <article
      role="listitem"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className={cn(
        'cursor-pointer px-4 py-2.5 focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7000]',
        variant === 'inset'
          ? 'bg-slate-50 border border-border/50 rounded-md hover:bg-slate-100 hover:border-slate-300 transition-colors duration-150'
          : 'bg-white border border-border rounded-lg shadow-sm hover:shadow-md hover:border-slate-300 transition-shadow duration-150',
      )}
    >
      {/* Row 1 — Identity + Actions */}
      <div className="flex items-center justify-between gap-2">
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
          {fitLoading && !fitAssessment && (
            <Skeleton className="h-5 w-20" />
          )}
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

      {/* Row 2 — Self-contained metrics strip */}
      <div className="mt-2 pt-2 border-t border-border/50">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-start">
            {stripMetrics.map((m, i) => {
              const isActive =
                activeSortMetric != null &&
                m.label.toLowerCase() === activeSortMetric.toLowerCase();
              return (
                <div
                  key={i}
                  className={cn(
                    'flex flex-col',
                    i > 0 && 'border-l border-border/40 pl-4',
                    i < stripMetrics.length - 1 && 'pr-4',
                    isActive && 'bg-primary/5 rounded-sm px-3 -mx-1',
                  )}
                >
                  <span
                    className={cn(
                      'text-[10px] font-medium uppercase tracking-wider leading-tight',
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

          {/* Product alignment — right side of metrics row */}
          {productAlignment && (
            <div className="flex items-center gap-1.5 shrink-0">
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
      </div>

      {children && <div className="mt-1">{children}</div>}
    </article>
  );
}
```

---

## File 3: `filter-popover-bar.tsx` — Add sort dropdown slot

The sort dropdown needs to render in the utility bar. Add a `sortSlot` prop to `FilterPopoverBar`.

Add to the props interface:
```typescript
/** Slot for sort dropdown — renders after filter buttons */
sortSlot?: React.ReactNode;
```

In the main row JSX, add `{sortSlot}` after the filter buttons map and before the result count:

```tsx
{/* Main row */}
<div className="flex items-center gap-2 flex-wrap">
  {productLensSlot}
  {searchSlot}

  {filters.map((filter) => {
    const activeCount = (filterValues[filter.id] ?? []).length;
    return (
      <FilterPopover
        key={filter.id}
        filter={filter}
        values={filterValues[filter.id] ?? []}
        activeCount={activeCount}
        onChange={(values) => onFilterChange(filter.id, values)}
      />
    );
  })}

  {sortSlot}

  {/* Result count — right-aligned */}
  <div className="ml-auto text-xs font-medium text-muted-foreground whitespace-nowrap">
    {/* ... existing count code ... */}
  </div>
</div>
```

---

## File 4: `district-listings-container.tsx` — Add sort dropdown, revert list wrapper padding

### 4a. Revert list wrapper padding

Change the list content div back to `p-4`:

```tsx
{/* List content */}
<div className="p-4">
```

### 4b. Build sort dropdown from config

Add import:
```tsx
import { ArrowUpDown } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
```

After the `resolvedSearchSlot` definition, build the sort dropdown:

```tsx
// Build sort dropdown from config
const sortDropdown = config.sortOptions.length > 0 ? (
  <div className="flex items-center gap-1.5">
    <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
    <Select
      value={activeSort?.key ?? ''}
      onValueChange={(value) => {
        if (!value) {
          onSortChange(null);
        } else {
          // If already sorting by this key, toggle direction
          if (activeSort?.key === value) {
            onSortChange(
              activeSort.direction === 'asc'
                ? { key: value, direction: 'desc' }
                : null
            );
          } else {
            onSortChange({ key: value, direction: 'asc' });
          }
        }
      }}
    >
      <SelectTrigger className="h-8 text-xs font-medium border-border w-auto min-w-[140px]">
        <SelectValue placeholder="Sort by..." />
      </SelectTrigger>
      <SelectContent>
        {config.sortOptions.map((opt) => (
          <SelectItem key={opt.key} value={opt.key} className="text-xs">
            {opt.label}
            {activeSort?.key === opt.key && (
              <span className="ml-1 text-muted-foreground">
                {activeSort.direction === 'asc' ? '↑' : '↓'}
              </span>
            )}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  </div>
) : null;
```

### 4c. Pass sortSlot to FilterPopoverBar

```tsx
<FilterPopoverBar
  filters={config.availableFilters}
  filterValues={filterValues}
  onFilterChange={onFilterChange}
  onClearAll={handleClearAll}
  resultCount={resultCount}
  totalCount={totalCount}
  productLensSlot={productLensSlot}
  searchSlot={resolvedSearchSlot}
  sortSlot={sortDropdown}
/>
```

### 4d. Keep ColumnHeaderBar import but gate on config

The `ColumnHeaderBar` still renders when `config.showColumnHeaders` is true — just not for discovery contexts. Keep the conditional rendering:

```tsx
{config.showColumnHeaders && (
  <ColumnHeaderBar
    columns={config.columns}
    activeSort={activeSort}
    onSortChange={onSortChange}
  />
)}
```

Since both discovery configs now have `showColumnHeaders: false`, the header bar won't render. It's preserved for future contexts (directory browse) that may use it with a proper grid layout.

---

## Do NOT Change

- `column-header-bar.tsx` — keep the file, it's just not rendered in discovery
- Filter popover behavior — working correctly
- Any renderer files — they pass config to container, no changes needed

---

## Verification

1. `npm run build` — no TypeScript errors
2. Navigate to discovery, query "Sacramento county districts english learner"
3. **CRITICAL:** No column header bar visible above the cards
4. **CRITICAL:** Cards show self-contained metrics strip (Enrollment | FRPM | ELL | ELA Prof.) with vertical dividers, left-aligned, readable
5. Sort dropdown visible in utility bar between filter buttons and result count
6. Click sort dropdown → select "Enrollment" → cards reorder by enrollment
7. Click same sort option again → direction toggles (or clears)
8. Cards have comfortable padding and spacing — no content crammed to one side
9. "Unified School District" badge still shows on Elk Grove (data bug — separate fix)
10. Elk Grove FRPM shows "182589%" (data bug — separate fix)
