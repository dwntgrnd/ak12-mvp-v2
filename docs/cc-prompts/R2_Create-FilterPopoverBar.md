# R2 — Create FilterPopoverBar (Replace FilterSheet)

**Scope:** Create 1 new file, delete 1 file  
**New file:** `/src/components/shared/filter-popover-bar.tsx`  
**Delete:** `/src/components/shared/filter-sheet.tsx`  
**Spec reference:** Spec 15A — Utility Bar Design, Filter Dropdowns, Active Filter Pills

---

## Problem

The current `FilterSheet` renders a full right-side Sheet (slide-in panel with dark overlay) for 3 filter categories with ~12 total options. This is disproportionate — a popover-weight interaction given sheet-weight UI. Additionally, the Enrollment Range items render as plain text without any selection affordance (no checkboxes, no highlight), inconsistent with the other filter sections.

## What to Build

A `FilterPopoverBar` component that renders a horizontal row of filter trigger buttons, each opening an anchored Popover with filter options inside.

### Component API

```tsx
interface FilterPopoverBarProps {
  filters: SheetFilterDefinition[];  // reuse existing type from list-context-config.ts
  filterValues: Record<string, string[]>;
  onFilterChange: (filterId: string, values: string[]) => void;
  onClearAll: () => void;
  resultCount: number;
  totalCount?: number;
  /** Slot for product lens selector — renders as leftmost control */
  productLensSlot?: React.ReactNode;
  /** Slot for local search input — renders before filter buttons, only for directory browse */
  searchSlot?: React.ReactNode;
  className?: string;
}
```

### Layout

Single horizontal row using flex:

```
[productLensSlot] [searchSlot?] [Filter1 ▾] [Filter2 ▾] [Filter3 ▾]    {count} districts
```

- `productLensSlot` renders at the far left (if provided)
- `searchSlot` renders next (if provided — only for directory browse)
- Filter buttons render in order of the `filters` array
- Result count is right-aligned (`ml-auto`)

Below this row, conditionally render a pills row when any filters are active.

### Filter Trigger Button

Each filter gets an outline/secondary `Button` that opens a `Popover`:

```tsx
<Popover>
  <PopoverTrigger asChild>
    <Button variant="outline" size="sm" className="...">
      <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5" />  // only on first filter, or omit icon entirely
      {filter.label}
      {activeCount > 0 && (
        <span className="ml-1.5 flex items-center justify-center h-4 min-w-[16px] rounded-full bg-primary text-white text-[10px] font-semibold">
          {activeCount}
        </span>
      )}
    </Button>
  </PopoverTrigger>
  <PopoverContent align="start" className="w-auto min-w-[200px] p-3">
    {/* filter options */}
  </PopoverContent>
</Popover>
```

Do NOT use `SlidersHorizontal` icon on every button. Use no icon on individual filter buttons — the button label is sufficient. The filter icon was appropriate on the single "Filters" trigger; it's redundant when each button already names its category.

### Popover Content — Multi-Checkbox Type

For filters where `type === 'multi-checkbox'` (Grade Band, District Type, Alignment Level):

```tsx
<fieldset>
  <legend className="sr-only">{filter.label}</legend>
  <div className="flex flex-col gap-2">
    {filter.options.map((opt) => (
      <label key={opt.value} className="flex items-center gap-2 cursor-pointer text-sm">
        <Checkbox
          checked={values.includes(opt.value)}
          onCheckedChange={(checked) => {
            // add or remove from values array
          }}
        />
        {opt.label}
      </label>
    ))}
  </div>
</fieldset>
```

### Popover Content — Bracket-Select Type

For filters where `type === 'bracket-select'` (Enrollment Range):

Render as a list of selectable items with clear active state. Only one bracket can be active at a time (single-select). Use styled buttons with background highlight when selected:

```tsx
<fieldset>
  <legend className="sr-only">{filter.label}</legend>
  <div className="flex flex-col gap-1">
    {filter.options.map((opt) => {
      const isSelected = values.includes(opt.value);
      return (
        <button
          key={opt.value}
          type="button"
          onClick={() => onChange(isSelected ? [] : [opt.value])}
          className={cn(
            'text-left text-sm px-3 py-1.5 rounded-md transition-colors',
            isSelected
              ? 'bg-primary/10 text-primary font-medium'
              : 'text-foreground hover:bg-slate-50',
          )}
        >
          {opt.label}
        </button>
      );
    })}
  </div>
</fieldset>
```

This pattern already exists in the current `filter-sheet.tsx` for bracket-select — preserve it.

### Active Filter Pills Row

Below the button row, render a pills row when ANY filter has active selections:

```tsx
{hasActiveFilters && (
  <div className="flex flex-wrap items-center gap-2 mt-2">
    {pills.map((pill) => (
      <span key={`${pill.filterId}-${pill.value}`} className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-foreground">
        {pill.label}
        <button onClick={() => removePill(pill)} className="..." aria-label={`Remove ${pill.label} filter`}>
          <X className="h-3 w-3" />
        </button>
      </span>
    ))}
    {pillCount >= 2 && (
      <button onClick={onClearAll} className="text-xs text-muted-foreground hover:text-foreground underline ...">
        Clear all
      </button>
    )}
  </div>
)}
```

### Result Count

Right-aligned in the main row:

```tsx
<div className="ml-auto text-xs font-medium text-muted-foreground whitespace-nowrap">
  {isFiltered ? (
    <><span className="text-foreground font-semibold">{formatNumber(resultCount)}</span> of {formatNumber(totalCount)} districts</>
  ) : (
    <><span className="text-foreground font-semibold">{formatNumber(resultCount)}</span> {resultCount === 1 ? 'district' : 'districts'}</>
  )}
</div>
```

## Imports Required

```tsx
import { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils/format';
import type { SheetFilterDefinition } from './list-context-config';
```

## Delete

Delete `/src/components/shared/filter-sheet.tsx` entirely. Its exports (`FilterTriggerButton`, `FilterSheet`) will be replaced by `FilterPopoverBar`.

Do NOT update imports in other files yet — that happens in R3.

## Verification

This component won't be wired in until R3, but you can verify it compiles:
1. Create the file
2. Run `npx tsc --noEmit` to check for type errors
3. Confirm no circular dependencies
