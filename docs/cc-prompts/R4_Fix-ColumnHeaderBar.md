# R4 — Fix ColumnHeaderBar Spacing and Dynamic Labels

**Scope:** 2 files  
**Files:** `/src/components/shared/column-header-bar.tsx`, `/src/components/shared/list-context-config.ts`  
**Spec reference:** Spec 15A — Column Headers acceptance criteria

---

## Problem

Two issues visible in the current column header bar:

1. **Column labels run together.** "EnrollmentFRPM" appears as one word — there is no gap or padding between column header items. The flex container uses `gap-0.5` only for the internal arrow icon, but no gap between sibling column headers.

2. **"Academic" is vague.** The fourth metric column is labeled "Academic" but the card data below shows "Math Initiative" or "ELA Prof." depending on context. The column header should reflect the actual metric displayed.

## Changes to `column-header-bar.tsx`

### Fix spacing

The root flex container needs horizontal gap between column header items. Add `gap-4` (16px) or `gap-6` (24px) to the root `div`:

```tsx
<div
  className="flex items-center gap-6 bg-slate-50 border-b border-border py-1.5 px-4"
  role="row"
  aria-label="Column headers"
>
```

The `min-w` classes on each column header already provide minimum widths. Adding `gap-6` ensures visual separation between columns.

### Ensure identity column takes remaining space

The "District" column (key `name` or `rank` + `name`) should use `flex-1` so it absorbs available space, pushing metric columns to the right. The current code already has:

```tsx
isIdentity && 'flex-1 min-w-0',
```

Confirm this applies to both sortable and non-sortable identity columns. Currently the non-sortable branch (for `rank`) does NOT include `flex-1`:

```tsx
// Non-sortable branch — missing flex-1
<div
  key={col.key}
  className={cn('text-overline text-muted-foreground', col.minWidth)}
  ...
>
```

Fix: add identity check to non-sortable branch too:

```tsx
<div
  key={col.key}
  className={cn(
    'text-overline text-muted-foreground',
    col.minWidth,
    isIdentity && 'flex-1 min-w-0',
  )}
  ...
>
```

### Metric columns alignment

Metric columns should right-align their text to match numeric data alignment in the cards below. Add `text-right` to non-identity columns:

```tsx
!isIdentity && 'text-right',
```

Apply to both sortable and non-sortable branches.

## Changes to `list-context-config.ts`

### Dynamic academic column label

The shared metric columns currently define:

```typescript
{ key: 'academic', label: 'Academic', minWidth: METRIC_MIN_WIDTHS[3], sortable: true },
```

Change the label to be more specific. Since the column shows either ELA or Math proficiency depending on query context, the label should be set dynamically by the renderer, not hardcoded in the config.

**Approach:** Make the column definition accept a dynamic label override. Add a `labelOverride` mechanism:

Option A (simplest): Change the preset to use a more specific default:

```typescript
{ key: 'academic', label: 'ELA Prof.', minWidth: METRIC_MIN_WIDTHS[3], sortable: true },
```

Then in `buildListContextConfig`, allow the renderer to pass a `academicLabel` override:

```typescript
export function buildListContextConfig(
  base: ListContextConfig,
  options: { 
    hasProducts: boolean; 
    productLensActive: boolean;
    academicLabel?: string;  // NEW — e.g., "Math Prof." for math queries
  },
): ListContextConfig {
  let config = { ...base };
  
  // Override academic column label if provided
  if (options.academicLabel) {
    config = {
      ...config,
      columns: config.columns.map((col) =>
        col.key === 'academic' ? { ...col, label: options.academicLabel! } : col,
      ),
    };
  }

  if (!options.hasProducts || !options.productLensActive) return config;

  return {
    ...config,
    columns: [...config.columns, ALIGNMENT_COLUMN],
    availableFilters: [...config.availableFilters, ALIGNMENT_LEVEL_FILTER],
  };
}
```

Option B (future-proof): Add an optional `labelOverride` field to `ColumnDefinition`. This is overkill for MVP — go with Option A.

### Fix column label widths

The metric min-widths may be too narrow to display labels with proper spacing:

```typescript
export const METRIC_MIN_WIDTHS = [
  'min-w-[80px]',  // Enrollment (was 72px — needs room for "Enrollment" label)
  'min-w-[56px]',  // FRPM
  'min-w-[48px]',  // ELL
  'min-w-[72px]',  // Academic (ELA/Math Prof.)
] as const;
```

Adjust the first value from 72px to 80px to accommodate the full "Enrollment" label without truncation.

## Verification

1. Run `npm run build` — no type errors
2. Navigate to discovery results with a ranked list
3. Confirm: Column headers have clear visual gaps between them (no "EnrollmentFRPM" concatenation)
4. Confirm: "Academic" column now shows "ELA Prof." (default) or "Math Prof." (for math-related queries)
5. Confirm: Sort arrows still appear correctly next to active sort column
6. Confirm: Metric column headers right-align to match card metric values below them
