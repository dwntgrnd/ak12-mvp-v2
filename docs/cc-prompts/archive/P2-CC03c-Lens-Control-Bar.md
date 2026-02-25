# P2-CC03c — Lens Control Bar

**Scope:** Build the lens control bar component. Move product selection into a dedicated bar. Wire up fit indicator. Conditional visibility by mode.

**Before starting:** Read `CLAUDE.md` and the P2 spec at `Specs/P2-Spec-01_Unified-View-Architecture.md` (Obsidian vault). Focus on §3.6 (Lens Control Bar) and §3.3 (View States).

**Depends on:** CC03b (mode bar) complete.

---

## Context

The lens control bar is the third layer in the unified view. It provides the product selector and fit indicator for ephemeral exploration of district-product alignment. Currently, product lens state is managed via the `useProductLens` hook (a client-side singleton) and the lens is activated either via URL param (`?productId=`) or indirectly. The lens has no dedicated UI surface — it only manifests as a breadcrumb bar indicator and augmented content. This prompt gives it a proper home.

The lens bar is **only visible in District Intelligence mode**. It is hidden when viewing a saved playbook.

---

## Deliverables

### 1. Create `LensControlBar` component

Create `src/components/district-profile/lens-control-bar.tsx`.

**Layout:**

```
┌──────────────────────────────────────────────────────────────────┐
│  [Product selector dropdown/combobox]          [Fit indicator]   │
└──────────────────────────────────────────────────────────────────┘
```

**Product selector:**
- Multi-product selection. Rep selects one or more products from the Solutions catalog.
- Use the existing `useLibraryReadiness` hook to get the product list (`ProductLensSummary[]`).
- Use the existing `useProductLens` hook to get/set the active product.
- **MVP simplification:** The current `useProductLens` hook supports a single product (`activeProduct: ProductLensSummary | null`). Keep it single-select for now. Multi-select is a future enhancement.
- Component: Combobox or Select with product names. When no product is selected, show placeholder text like "Select a product to explore fit…"
- Clearing the selection deactivates the lens.

**Fit indicator:**
- Displayed when a product is selected and a match summary is available.
- Shows the qualitative tier: Strong Fit / Moderate Fit / Limited Fit.
- Use `matchTierColors` from `src/lib/design-tokens.ts` for badge styling.
- Also show the `matchSummary.headline` text below the badge as a one-line summary.
- When no product is selected or no match data: show nothing in the fit indicator area.

**Props interface:**
```typescript
interface LensControlBarProps {
  districtId: string;
  matchSummary?: MatchSummary | null;
}
```

The component reads product lens state from the `useProductLens` hook (not via props). The `matchSummary` is passed from the parent because it requires the districtId + productId to fetch.

**Styling guidance:**
- Background: `bg-surface-inset` or `bg-surface-page` — visually recessed compared to the mode bar above.
- Border: `border-b border-border-subtle` (lighter than mode bar's border).
- Height: compact. Single row when collapsed, but may grow slightly with headline text.
- Contained within the page's `max-w-layout`.
- When lens is inactive (no product selected): the bar still renders with just the product selector. It should not disappear and reappear — the selector is always visible in District Intelligence mode.

**Inactive vs active states:**
- **Inactive** (no product selected): Only the product selector is visible with placeholder. Fit indicator area is empty.
- **Active** (product selected): Product selector shows the selected product. Fit indicator shows tier badge + headline.

### 2. Wire `LensControlBar` into district page

Update `src/app/(dashboard)/districts/[districtId]/page.tsx`:

- Replace the `id="lens-bar-slot"` placeholder with `<LensControlBar />`.
- Pass `districtId` and `matchSummary`.
- The existing `matchSummary` fetch logic in the district page can stay where it is — just pass the result down.
- Remove the `?productId=` URL param seeding logic from the district page. The lens bar's product selector is now the canonical way to activate the lens. (If you want to preserve deep-link capability, keep the URL param seeding but have it trigger the lens via the hook, which the lens bar will then reflect.)

### 3. Hide lens bar on playbook pages

The lens bar must NOT render on the nested playbook page (`districts/[districtId]/playbooks/[playbookId]/page.tsx`). This is straightforward — simply don't include the `LensControlBar` component in the playbook page's layout. The mode bar renders on both; the lens bar renders only on the district page.

### 4. Remove lens indicator duplication from breadcrumb bar

The `top-nav.tsx` currently shows a product lens indicator in the breadcrumb bar (the cyan dot + product name + dismiss button). With the lens control bar now being the primary lens UI, this breadcrumb indicator is **redundant for district pages** but still useful as a global awareness indicator when navigating away from the district.

**For now: keep the breadcrumb lens indicator.** It serves a different purpose (global awareness vs local control). No changes to `top-nav.tsx` in this prompt.

### 5. Update CLAUDE.md

Add to the App Shell section or create a new "Unified View Layers" section:

```markdown
### Unified View Layers (District Page)

The district page (`districts/[districtId]/page.tsx`) renders four stacked layers:

1. **PersistentDataStrip** — District name, metrics, contact info, save toggle. Always visible.
2. **ModeBar** — "District Intelligence" + saved playbook modes. Action buttons. Always visible.
3. **LensControlBar** — Product selector + fit indicator. **District Intelligence mode only.** Hidden on playbook pages.
4. **Tab area** — ResearchTabs (district mode) or playbook tabs (playbook mode).

Breadcrumb system uses `setBreadcrumbs(BreadcrumbSegment[])` from `useAppShell()`. The old `setBreadcrumbOverride` / `breadcrumbOverride` API is removed.
```

Also update the Key File References table to include the new components.

### 6. Update barrel export

In `src/components/district-profile/index.ts`, add:
```typescript
export { LensControlBar } from './lens-control-bar';
```

---

## What NOT to change

- Do not modify `PersistentDataStrip` (CC03a)
- Do not modify `ModeBar` (CC03b)
- Do not modify `ResearchTabs` or tab content components
- Do not modify breadcrumb rendering in `top-nav.tsx`
- Do not modify the `useProductLens` hook internals (single-product is fine for MVP)
- Do not modify routing

---

## Verification checklist

- [ ] `npm run build` compiles clean
- [ ] District page renders all four layers: data strip → mode bar → **lens control bar** → research tabs
- [ ] Product selector shows available products from Solutions catalog
- [ ] Selecting a product activates the lens (breadcrumb indicator also reflects it)
- [ ] Fit indicator shows tier badge + headline when product is selected and match data loads
- [ ] Clearing the product deactivates the lens
- [ ] Lens control bar is NOT visible on the nested playbook page
- [ ] Lens control bar IS visible on the district page (even when no product is selected — shows selector with placeholder)
- [ ] CLAUDE.md updated with unified view layers documentation and breadcrumb API change
- [ ] No TypeScript errors
