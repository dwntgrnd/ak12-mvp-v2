# Phase 10-2 — Renderer Integration with Shared District Result Card

**Created:** 2026-02-20 · SS-33
**Depends on:** Phase 10-1 (Shared District Result Card component must exist and compile)
**Spec references:** Spec 14 §1.2 (Content Slot Usage by Context), §2 (Link Affordances), Spec 09 §5 (Affordance Standards)

---

## Objective

Wire the `DiscoveryResultCard` component (built in Phase 10-1) into all multi-entity renderers. Refactor Ranked List, Card Set, and Narrative Brief key signals to use the shared card. Add linked district names to the Comparison Table. Delete the now-redundant `DiscoveryDistrictCard`. 

---

## Design Decisions (Resolved)

1. **Card Set layout changes from 2-column grid to single-column stacked list** for query results. Per Spec 14 §1.4: all query result contexts use single-column stacked list. Grid is reserved for non-query contexts (saved districts, future).

2. **Narrative Brief key signals keep 2×2 grid layout** — but signals with a `districtId` render as `DiscoveryResultCard` instances (inset variant) instead of plain metric tiles. Signals without `districtId` continue rendering as plain tiles. The grid layout serves the "landscape overview" purpose.

3. **Comparison Table entity names become navigable links** — both in desktop column headers and mobile stacked cards. These are `<a>` tags (not cards), since the table is its own container and individual cells are not card-like click targets.

4. **Ranked List outer card wrapper stays** — the white card with title, ranking criterion, synthesis. Individual entry cards inside it use `DiscoveryResultCard` with `variant="inset"`.

---

## 1. Ranked List Renderer

**File:** `src/components/discovery/renderers/ranked-list-renderer.tsx`

### Changes

Replace the inline card `<div>` for each entry with `<DiscoveryResultCard>`. The entry's metrics become children of the card's content slot.

**Before** (current inline card per entry):
```tsx
<div role="listitem" tabIndex={0} onClick={handleClick} ...>
  <div className="flex items-center gap-3">
    <div className="w-7 h-7 rounded-full ..."><span>{entry.rank}</span></div>
    <span>{entry.name}</span>
  </div>
  <div className="mt-2 flex items-baseline gap-2">
    <span>{entry.primaryMetric.label}</span>
    <span>{entry.primaryMetric.value}</span>
  </div>
  {/* secondary metrics... */}
  {/* confidence note... */}
</div>
```

**After** (using DiscoveryResultCard):
```tsx
<DiscoveryResultCard
  key={entry.districtId}
  districtId={entry.districtId}
  name={entry.name}
  variant="inset"
  rank={entry.rank}
>
  {/* Content slot: metrics */}
  <div className="mt-2 flex items-baseline gap-2">
    <span className="text-overline font-[500] leading-[1.4] tracking-[0.05em] uppercase text-slate-400">
      {entry.primaryMetric.label}
    </span>
    <span className="text-body font-[600] leading-[1.6] text-foreground">
      {entry.primaryMetric.value}
    </span>
  </div>
  {entry.secondaryMetrics && entry.secondaryMetrics.length > 0 && (
    <p className="mt-1 text-caption font-[500] leading-[1.5] tracking-[0.025em] text-muted-foreground">
      {entry.secondaryMetrics.map((m, i) => (
        <span key={i}>
          {i > 0 && <span className="mx-1.5">·</span>}
          {m.label}: {m.value}
        </span>
      ))}
    </p>
  )}
  {entry.confidenceNote && (
    <div className="mt-1.5">
      <TransparencyNote note={entry.confidenceNote} level={entry.confidence} />
    </div>
  )}
</DiscoveryResultCard>
```

### Additional Changes

- Remove `'use client'` directive IF the only client-side code was `useRouter` for `handleClick`/`handleKeyDown` — `DiscoveryResultCard` handles navigation internally. However, keep `'use client'` if it's still needed for other reasons.
- Remove the `useRouter` import and all per-entry `handleClick`/`handleKeyDown` functions.
- Import `DiscoveryResultCard` from `@/components/discovery/discovery-result-card`.
- The outer card wrapper (white card with title, ranking criterion, synthesis) remains unchanged.

---

## 2. Card Set Renderer

**File:** `src/components/discovery/renderers/card-set-renderer.tsx`

### Changes

Replace `DiscoveryDistrictCard` with `DiscoveryResultCard`. Change layout from 2-column grid to single-column stacked list.

**Before:**
```tsx
import { DiscoveryDistrictCard } from './discovery-district-card';
// ...
<div className="grid grid-cols-1 md:grid-cols-2 gap-3 ..." role="list">
  {districts.map((entry) => (
    <DiscoveryDistrictCard key={entry.districtId} entry={entry} />
  ))}
</div>
```

**After:**
```tsx
import { DiscoveryResultCard } from '@/components/discovery/discovery-result-card';
import { TransparencyNote } from './transparency-note';
import { formatNumber } from '@/lib/utils/format';
// ...
<div className="flex flex-col gap-3 ..." role="list" aria-label="Districts matching your query">
  {districts.map((entry) => (
    <DiscoveryResultCard
      key={entry.districtId}
      districtId={entry.districtId}
      name={entry.name}
      location={entry.location}
      enrollment={entry.enrollment}
      variant="inset"
    >
      {/* Content slot: key metric emphasis surface */}
      {entry.keyMetric && (
        <div className="bg-[#E0F9FC] rounded-md p-3 mt-3 flex items-baseline gap-2">
          <span className="text-overline font-[500] leading-[1.4] tracking-[0.05em] uppercase text-slate-400">
            {entry.keyMetric.label}
          </span>
          <span className="text-body font-[600] leading-[1.6] text-foreground">
            {entry.keyMetric.value}
          </span>
        </div>
      )}
      {entry.confidence >= 3 && (
        <div className="mt-2">
          <TransparencyNote note="Limited data coverage" level={entry.confidence} />
        </div>
      )}
    </DiscoveryResultCard>
  ))}
</div>
```

### Key Differences from Before

- Layout: `flex flex-col gap-3` instead of `grid grid-cols-1 md:grid-cols-2 gap-3`
- Card Set entries now use the shared card, which provides district name linking, hover/focus states, and keyboard navigation
- Location and enrollment are handled by the shared card's identity zone rather than being rendered manually
- Remove `DiscoveryDistrictCard` import

---

## 3. Brief Renderer — Key Signals Grid

**File:** `src/components/discovery/renderers/brief-renderer.tsx`

### Changes

Key signals with a `districtId` field render as `DiscoveryResultCard` instances. Key signals without `districtId` render as plain metric tiles (current behavior preserved).

**In the key signals section**, replace the current uniform rendering:

**Before:**
```tsx
{content.keySignals.map((signal, i) => (
  <div key={i}>
    <p className="text-overline ...">{signal.label}</p>
    <p className="mt-1 text-body font-[600] ...">{signal.value}</p>
    {signal.detail && <p className="mt-0.5 text-caption ...">{signal.detail}</p>}
  </div>
))}
```

**After:**
```tsx
{content.keySignals.map((signal, i) => {
  // District-linked signal → render as navigable card
  if (signal.districtId) {
    return (
      <DiscoveryResultCard
        key={signal.districtId}
        districtId={signal.districtId}
        name={signal.label}
        location={signal.location}
        enrollment={signal.enrollment}
        variant="inset"
      >
        {/* Content slot: activity signal + detail */}
        <p className="mt-1 text-body font-[600] leading-[1.6] text-foreground">
          {signal.value}
        </p>
        {signal.detail && (
          <p className="mt-0.5 text-caption font-[500] leading-[1.5] text-slate-500">
            {signal.detail}
          </p>
        )}
      </DiscoveryResultCard>
    );
  }

  // Plain metric tile (no district context)
  return (
    <div key={i}>
      <p className="text-overline font-[500] leading-[1.4] tracking-[0.05em] uppercase text-slate-400">
        {signal.label}
      </p>
      <p className="mt-1 text-body font-[600] leading-[1.6] text-foreground">
        {signal.value}
      </p>
      {signal.detail && (
        <p className="mt-0.5 text-caption font-[500] leading-[1.5] text-slate-500">
          {signal.detail}
        </p>
      )}
    </div>
  );
})}
```

### Grid Layout Preserved

The 2×2 grid container (`grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4`) stays the same. District cards render inside the grid cells. The inset variant (no border, no shadow) fits cleanly within the grid without visual disruption.

### Import Addition

Add to the top of the file:
```tsx
import { DiscoveryResultCard } from '@/components/discovery/discovery-result-card';
```

The `'use client'` directive is already present on this file — no change needed.

---

## 4. Comparison Table — Linked Entity Names

**File:** `src/components/discovery/renderers/comparison-table-renderer.tsx`

### Changes

Entity names in column headers (desktop) and entity title text (mobile) become navigable links to district profile pages. These are `<a>` tags, not cards — the table/stacked layout is its own container.

### 4A. Desktop Table Column Headers

**Before:**
```tsx
<span className="text-body font-[600] leading-[1.4] text-foreground">
  {entity.name}
</span>
```

**After:**
```tsx
{entity.districtId ? (
  <a
    href={`/districts/${entity.districtId}`}
    className="text-body font-[600] leading-[1.4] text-primary hover:underline hover:decoration-primary/60 underline-offset-2 transition-colors"
    onClick={(e) => {
      e.preventDefault();
      router.push(`/districts/${entity.districtId}`);
    }}
  >
    {entity.name}
  </a>
) : (
  <span className="text-body font-[600] leading-[1.4] text-foreground">
    {entity.name}
  </span>
)}
```

### 4B. Mobile Stacked Cards — Entity Name

**Before:**
```tsx
<p className="text-body font-[600] leading-[1.4] text-foreground">
  {entity.name}
</p>
```

**After:**
```tsx
{entity.districtId ? (
  <a
    href={`/districts/${entity.districtId}`}
    className="text-body font-[600] leading-[1.4] text-primary hover:underline hover:decoration-primary/60 underline-offset-2 transition-colors block"
    onClick={(e) => {
      e.preventDefault();
      router.push(`/districts/${entity.districtId}`);
    }}
  >
    {entity.name}
  </a>
) : (
  <p className="text-body font-[600] leading-[1.4] text-foreground">
    {entity.name}
  </p>
)}
```

### 4C. Add Router Import

The file needs `'use client'` directive (if not already present) and `useRouter`:

```tsx
'use client';

import { useRouter } from 'next/navigation';
// ... existing imports
```

Add `const router = useRouter();` at the top of the component function body.

### Link Styling Reference (Spec 09 §5)

- Color: `text-primary` (cyan)
- Hover: underline with `decoration-primary/60`, transition to full opacity
- Offset: `underline-offset-2`
- No visited state differentiation
- No external link icon (internal navigation)

---

## 5. Delete Redundant Component

After all renderers are updated:

- **Delete** `src/components/discovery/renderers/discovery-district-card.tsx`
- **Remove** the `DiscoveryDistrictCard` export from `src/components/discovery/index.ts`

This file is fully replaced by `DiscoveryResultCard`. No other files should reference it after the Card Set renderer is updated.

---

## 6. What This Prompt Does NOT Do

- Does **not** add "View district profile →" action links to single-entity formats — that's Phase 10-3
- Does **not** add district name linking in Brief headers or Direct Answer — that's Phase 10-3
- Does **not** implement the product lens selector or pass product relevance — that's Phase 10-4
- Does **not** modify the format router or discovery results layout
- Does **not** modify the existing `district-card.tsx` (parent-level component used elsewhere)

---

## 7. Verification

After implementation, verify all eight scripted scenarios in the browser:

### Ranked List (S7 — "rank sacramento math decline")
- [ ] Each entry shows as a `DiscoveryResultCard` with rank badge, district name as interactive text, metrics in content slot
- [ ] Cards use inset variant (slate-50 bg, no border/shadow)
- [ ] Clicking any card navigates to district profile
- [ ] Keyboard: Tab through cards, Enter navigates
- [ ] Confidence notes render correctly on entries that have them

### Card Set (S8 — "sacramento county districts english learner")
- [ ] Layout is single-column stacked list, NOT 2-column grid
- [ ] Each card shows district name, location, enrollment in identity zone
- [ ] Key metric emphasis surface (EL Population) renders in content slot
- [ ] Cards use inset variant
- [ ] Clicking navigates to district profile

### Narrative Brief (S1 — "large districts sacramento math evaluations")
- [ ] Key signals with districtId render as `DiscoveryResultCard` instances in the 2×2 grid
- [ ] Cards show district name (linked), location, enrollment in identity zone
- [ ] Activity signal and detail render in content slot
- [ ] Cards use inset variant within the white outer card
- [ ] Clicking any district card navigates to profile

### Narrative Brief — Plumas (S6 — "plumas county math")
- [ ] Key signals WITHOUT districtId render as plain metric tiles (no cards)
- [ ] This scenario has no district-linked key signals — verify no cards render, just tiles

### Comparison Table (S4 — "compare elk grove twin rivers math")
- [ ] Desktop: entity names in column headers are cyan links
- [ ] Clicking entity name link navigates to district profile
- [ ] Mobile: entity names in stacked cards are cyan links
- [ ] Hover: underline appears on entity name links

### Intelligence Brief (S3 — "twin rivers math curriculum ready change")
- [ ] Key signals without districtId render as plain metric tiles (current behavior preserved)
- [ ] No changes expected visually for this format in this phase

### Direct Answer (S2 — "fresno enrollment")
- [ ] No changes expected in this phase

### Recovery (S5 — "oregon districts el support")
- [ ] No changes expected in this phase

### Deletion Verification
- [ ] `discovery-district-card.tsx` deleted
- [ ] `npm run build` passes with no references to `DiscoveryDistrictCard`
