# R1 — Fix ProductLensSelector Empty State

**Scope:** Single file change  
**File:** `/src/components/discovery/product-lens-selector.tsx`  
**Spec reference:** Spec 15A (District List Utility Bar Revision) — Product Lens Selector section

---

## Problem

The product lens selector's empty/default state displays "No product lens" as a SelectItem. This is negative framing — it describes what's absent rather than inviting action.

Additionally, the component renders a separate dismissible Badge chip next to the Select when a product is chosen. This is redundant — the Select trigger already shows the selected product name.

## Changes Required

### 1. Remove the "No product lens" SelectItem

Replace:
```tsx
<SelectItem value="__none__">No product lens</SelectItem>
```

With placeholder text on the SelectTrigger. The Select should show "Product lens" as placeholder when no product is selected. When a product IS selected, the trigger shows the product name (this is default Select behavior).

Use the Shadcn Select's `placeholder` prop on `SelectValue`:
```tsx
<SelectValue placeholder="Product lens" />
```

Keep the `__none__` value handling in `onValueChange` so the user can deselect by choosing a "Clear selection" option or via a small × icon. The simplest approach: add a clear button inside the trigger area (visible only when a product is selected) that calls `onProductChange(undefined)`.

### 2. Remove the Badge chip

Delete the entire `{selectedProduct && ( <Badge ...> )}` block. The Select trigger is sufficient to communicate the active lens.

### 3. Adjust width

Change the trigger width from `w-56` / `w-48` to `w-auto min-w-[160px]` so it sizes to content without being overly wide or narrow.

### 4. Add aria-label

Ensure the SelectTrigger has `aria-label="Select product lens"`.

## Expected Result

- Empty state: Select trigger shows "Product lens" in placeholder style
- Selected state: Select trigger shows the product name (e.g., "MathBridge Pro")
- No separate Badge chip
- Selecting any product updates the trigger label
- A mechanism to clear selection exists (either a "Clear" option in the dropdown, or × in the trigger)

## Files to touch

- `/src/components/discovery/product-lens-selector.tsx` — ONLY this file

## Verification

1. Navigate to discovery page
2. Run a query that returns a ranked list or card set (e.g., "districts with math initiatives")
3. Confirm product lens selector shows "Product lens" placeholder (not "No product lens")
4. Select a product — confirm trigger updates to show product name
5. Clear selection — confirm it returns to placeholder
6. No Badge chip visible in any state
