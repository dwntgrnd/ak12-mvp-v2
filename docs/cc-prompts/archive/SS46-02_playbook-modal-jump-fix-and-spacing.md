# SS46-02: Playbook Modal — Fix Dialog Jump and Spacing Pass

**Session:** SS-46
**Scope:** Two issues — structural fix for modal jumping, visual spacing improvements
**Files to modify:**
- `src/components/playbook/generate-playbook-sheet.tsx`
- `src/components/playbook/district-search-combobox.tsx`
- `src/components/playbook/product-selection-card.tsx`

**No new files. No new dependencies. No service contract changes.**

---

## Problem 1: Modal Jumps When District Search Results Appear

The Dialog is vertically centered (default shadcn behavior). When the district search CommandList populates results, the dialog's total height changes, causing it to re-center and visually jump. This is jarring and must be fixed.

### Fix

**In `district-search-combobox.tsx`:**

Add a fixed `max-h` and `overflow-y-auto` to the CommandList so search results scroll within a constrained area instead of expanding the dialog height:

```tsx
<CommandList className="max-h-[200px] overflow-y-auto">
```

200px fits approximately 4 district results before scrolling. This means the CommandList's rendered height is bounded — whether there are 0 results, 3 results, or 15 results, the dialog height stays stable.

**Important:** The loading skeletons, error state, empty state, and pre-search hint that render inside CommandList should also fit within this constraint. Verify that none of them exceed 200px. If the error or empty state messages are taller than 200px, reduce their vertical padding (e.g., change `py-6` to `py-4`).

**Additionally, in `generate-playbook-sheet.tsx`:**

Anchor the dialog to the top of the viewport instead of center to further reduce perceived movement. Add `align-start` positioning by updating the DialogContent className:

```
Before: className="max-w-lg max-h-[85vh] flex flex-col p-0 gap-0"
After:  className="max-w-lg max-h-[85vh] flex flex-col p-0 gap-0 top-[10vh] translate-y-0"
```

This positions the dialog at 10% from the top of the viewport. If shadcn's Dialog uses Radix positioning that doesn't respond to `top`/`translate-y`, an alternative approach: add `items-start pt-[10vh]` to the Dialog overlay/portal wrapper. Check how the project's `dialog.tsx` in `components/ui/` handles positioning — the override needs to target whatever centers the dialog vertically.

**The CommandList constraint is the critical fix.** The top-anchoring is a secondary improvement. If top-anchoring is complex to implement, skip it — the CommandList constraint alone solves the jumping.

---

## Problem 2: Spacing — Everything Needs More Room to Breathe

The modal content is visually crowded. Apply these spacing adjustments systematically.

### generate-playbook-sheet.tsx

**Header area — add separation after description:**
The visible DialogDescription runs directly into the first section label. Add bottom margin or padding to create clear separation between the orienting text and the interactive content.

```
DialogHeader: change from "px-6 pt-6 pb-2 shrink-0"
                       to "px-6 pt-6 pb-5 shrink-0"
```

This gives 20px below the header block before the scrollable content begins.

**Section labels — add space below each label:**
The question-format labels ("Which products are you presenting?") need more breathing room before the first interactive element below them.

```
Section label <p> tags: change from "... mb-2"
                               to "... mb-3"
```

This increases the gap between the label and the first card/input from 8px to 12px.

**Section gap — increase space between Products and District sections:**
The `space-y-8` (32px) between sections isn't creating enough visual separation given the density of the product cards above.

```
Change: space-y-8 (32px)
    To: space-y-10 (40px)
```

**Footer — increase internal spacing and add stronger top border separation:**
The footer elements (summary, alert, buttons) are compressed. Increase the footer's internal spacing and top padding:

```
Footer div: change from "shrink-0 border-t px-6 py-4 space-y-3"
                    to "shrink-0 border-t px-6 py-5 space-y-4"
```

This adds 4px more vertical padding and increases element-to-element gap within the footer from 12px to 16px.

### product-selection-card.tsx

**Card internal padding — increase vertical breathing room:**
```
Change: "... px-4 py-3 ..."
    To: "... px-4 py-4 ..."
```

This gives each product card 16px vertical padding instead of 12px, making the cards feel less compressed.

**Product name truncation:**
The product name is truncating ("myPersp...") because `truncate` combined with flex siblings (badge + grade range) doesn't leave enough room. Change the name span to allow wrapping rather than truncating:

```
Before: className="font-semibold text-foreground flex-grow truncate text-sm"
After:  className="font-semibold text-foreground flex-grow text-sm min-w-0 break-words"
```

Alternatively, if single-line is important for visual consistency, increase the modal width slightly or move the grade range below the name on narrow widths. The simplest fix is allowing the name to wrap to a second line — product names are important and shouldn't be hidden.

**Card list gap — increase space between cards:**
Verify that the product card list uses `space-y-3` (12px) as specified in SS46-01. If it still feels tight after the card padding increase, bump to `space-y-4` (16px). Use judgment — the goal is that each card reads as a distinct, comfortable interactive target.

### district-search-combobox.tsx

**Reduce internal padding on states that live inside the now-constrained CommandList:**

If loading skeletons, error, or empty states previously used `py-6` or `py-8` for generous vertical padding, reduce to `py-4` to fit comfortably within the 200px max-height:

```
Error state: py-6 → py-4
Empty state (CommandEmpty): verify it fits within 200px
Pre-search hint: py-6 → py-4
```

---

## Verification Checklist

After applying all changes:

**Modal stability:**
- [ ] Open modal, click "Change" on district, type a search query — dialog does NOT jump or shift position as results appear
- [ ] Search results scroll within the CommandList area when more than ~4 results
- [ ] Loading skeletons display within the constrained area without overflow
- [ ] Error and empty states display within the constrained area
- [ ] Dialog position remains stable across all state transitions (loading → results → selection → resolved card)

**Spacing and breathing room:**
- [ ] Clear visual gap between header description text and first section label
- [ ] Section labels have comfortable space before their content
- [ ] Product cards feel like distinct, individual interactive elements (not stacked tightly)
- [ ] Product names are not truncating — full names are visible (wrapping if needed)
- [ ] Clear visual separation between Products section and District section
- [ ] Footer elements (summary, alerts, buttons) have comfortable spacing
- [ ] Overall modal feels spacious and intentional, not cramped

**No regressions:**
- [ ] All three entry points still work (district view, product view, cold start)
- [ ] Product selection/deselection works
- [ ] District search, selection, and "Change" flow works
- [ ] Duplicate notice still appears when applicable
- [ ] Generate button enables/disables correctly
- [ ] All accessibility attributes remain intact (aria-live, roles, focus management)
- [ ] Modal scrolls properly when content exceeds viewport (max-h-[85vh] still works)
