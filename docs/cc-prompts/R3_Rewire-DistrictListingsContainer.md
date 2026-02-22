# R3 — Rewire DistrictListingsContainer

**Scope:** Modify 1 file, update 2 renderer files  
**Primary file:** `/src/components/shared/district-listings-container.tsx`  
**Secondary files:** `/src/components/discovery/renderers/ranked-list-renderer.tsx`, `/src/components/discovery/renderers/card-set-renderer.tsx`  
**Spec reference:** Spec 15A — Utility Bar Design, §8 Amendment (Product Lens Placement)

---

## Problem

The current `DistrictListingsContainer` has three issues:

1. It renders a local search input (`showLocalFilter` conditional) that creates a redundant text field in discovery contexts
2. It imports and uses `FilterTriggerButton` + `FilterSheet` — both being replaced by `FilterPopoverBar` (R2)
3. It renders a separate `ResultCount` strip between column headers and list content — the count should be in the utility bar row
4. The product lens selector is placed in the renderer's `header` slot, disconnected from filter controls

## Changes to `district-listings-container.tsx`

### Remove

1. Remove the `Search`, `Input` imports and the entire local search input block (the `{config.showLocalFilter && (...)}` section with the search input and FilterTriggerButton)
2. Remove `FilterTriggerButton` and `FilterSheet` imports
3. Remove the `FilterSheet` rendering at the bottom of the component
4. Remove the `filterSheetOpen` state variable
5. Remove the separate `ResultCount` component and its rendering strip
6. Remove the `FilterPills` internal component (pills are now inside `FilterPopoverBar`)

### Add

1. Import `FilterPopoverBar` from `./filter-popover-bar`
2. Add a new prop: `productLensSlot?: React.ReactNode`
3. Add a new optional prop: `searchSlot?: React.ReactNode` (for future directory browse)

### New Utility Bar Section

Replace the removed search input block and result count strip with:

```tsx
{/* Utility bar: product lens + filters + count */}
<div className="px-5 pt-4 pb-3">
  <FilterPopoverBar
    filters={config.availableFilters}
    filterValues={filterValues}
    onFilterChange={onFilterChange}
    onClearAll={handleClearAll}
    resultCount={resultCount}
    totalCount={totalCount}
    productLensSlot={productLensSlot}
    searchSlot={config.showLocalFilter ? (
      <div className="relative w-60">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder={config.searchPlaceholder}
          aria-label={config.searchPlaceholder}
          className="pl-8 pr-8"
        />
        {searchQuery && (
          <button
            type="button"
            onClick={() => onSearchChange('')}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    ) : undefined}
  />
</div>
```

### Updated `handleClearAll`

Keep the existing behavior — clears search query AND all filter values.

### Props Changes

Add to the interface:
```typescript
/** Product lens selector — rendered as leftmost utility bar control */
productLensSlot?: React.ReactNode;
```

Remove `activeFilterCount` prop — the `FilterPopoverBar` calculates this internally from `filterValues`.

### Component Structure After Changes

```tsx
<div className={cn('w-full', className)}>
  <div className="bg-white border border-border rounded-lg shadow-sm">
    {/* Header slot (title, ranking criterion — NO product lens) */}
    {header && <div className="p-5 pb-0">{header}</div>}

    {/* Utility bar: product lens + filters + result count */}
    <div className="px-5 pt-4 pb-3">
      <FilterPopoverBar ... />
    </div>

    {/* Column header bar */}
    {config.showColumnHeaders && (
      <ColumnHeaderBar ... />
    )}

    {/* List content */}
    <div className="p-4">
      {loading && <ListingSkeleton ... />}
      {showEmpty && <EmptyState ... />}
      {!loading && !showEmpty && (
        <div className="flex flex-col gap-2" role="list" ...>
          {children}
        </div>
      )}
    </div>

    {/* Footer slot (synthesis) */}
    {footer && <div className="px-5 pb-5">{footer}</div>}
  </div>
</div>
```

Note: No FilterSheet at the bottom. No separate result count strip.

## Changes to Renderers

### `ranked-list-renderer.tsx`

1. Move `ProductLensSelector` out of the `header` JSX block
2. Pass it as the `productLensSlot` prop to `DistrictListingsContainer`:

```tsx
const productLensSlot = products.length > 0 ? (
  <ProductLensSelector
    products={products}
    selectedProductId={productLensId}
    onProductChange={onProductLensChange}
    variant="compact"
  />
) : undefined;

// In the header, remove the ProductLensSelector div:
const header = (
  <>
    <h2 className="text-lg font-semibold ...">{title}</h2>
    <p className="mt-1 text-xs ...">{rankingCriterion}</p>
    {/* NO ProductLensSelector here anymore */}
  </>
);

// Pass to container:
<DistrictListingsContainer
  config={listConfig}
  header={header}
  productLensSlot={productLensSlot}
  // ... rest of props
/>
```

3. Remove `activeFilterCount` prop (no longer needed by container)

### `card-set-renderer.tsx`

Apply the same changes as ranked-list-renderer — move ProductLensSelector to `productLensSlot` prop, remove from header.

## Verification

1. Run `npm run build` — no type errors
2. Navigate to discovery page
3. Query "districts with math initiatives"
4. Confirm: NO "Filter districts..." text input visible
5. Confirm: Product lens selector appears in the same row as filter buttons (utility bar)
6. Confirm: Filter buttons appear in the utility bar
7. Confirm: Result count appears right-aligned in the utility bar
8. Confirm: No separate result count strip between column headers and cards
9. Confirm: Clicking a filter button opens a Popover (not a Sheet)
10. Confirm: Header slot contains only title and ranking criterion
