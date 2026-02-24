# SS51-02: Lens Indicator in ContentUtilityBar

**Session:** SS-51
**Depends on:** SS51-01 (`useProductLens` hook)
**Spec reference:** Spec 16 §5.3 (Lens Indicator)

---

## Context

When a product lens is active, a persistent visual indicator must appear across all dashboard pages so the rep never forgets they're viewing matching data. The indicator lives in the `ContentUtilityBar` — the contextual bar below the topbar that already holds breadcrumbs and page actions.

**Placement:** Left zone, after the breadcrumb. It's ambient context, not a page action.

---

## Requirements

### Modify: `src/components/layout/content-utility-bar.tsx`

1. Import `useProductLens` from `@/hooks/use-product-lens`.
2. In the left zone `<div>`, after the `<Breadcrumb>` component, conditionally render the lens indicator when `isLensActive` is true.

**Lens indicator markup:**

```
[separator dot] · [product icon or colored dot] [product name] [× dismiss button]
```

Specific rendering:

- A `·` text separator between breadcrumb and indicator (same style as breadcrumb separators).
- A small colored dot (`bg-brand-blue`, `w-2 h-2 rounded-full`) as a visual anchor.
- Product name in `text-sm font-medium text-foreground`.
- A dismiss button: `X` icon (lucide), `w-3.5 h-3.5`, with `hover:bg-surface-emphasis-neutral rounded-full p-0.5` treatment. Calls `clearProduct()`.
- `aria-label="Active product lens: [product name]. Click to dismiss."` on the dismiss button.
- The entire indicator group wrapped in a `flex items-center gap-1.5` container.

**When lens is NOT active:** Nothing renders. No empty placeholder, no "Apply lens" prompt. The content-utility-bar behaves exactly as it does today.

### Do NOT:

- Add the lens selector (product picker) to this bar. That stays on discovery and saved districts pages.
- Modify the topbar, sidebar, or any other layout component.
- Change any page-level components.

---

## Verification

1. `npm run build` passes.
2. With no lens active, the content-utility-bar renders identically to its current state.
3. When lens is active (testable by calling `setProduct()` in a dev console or temporary test), the indicator appears after the breadcrumb on every dashboard page.
4. Clicking dismiss clears the lens (indicator disappears).
5. Keyboard accessible: dismiss button is focusable and activates with Enter/Space.

---

## Files

| Action | File |
|--------|------|
| Modify | `src/components/layout/content-utility-bar.tsx` |
