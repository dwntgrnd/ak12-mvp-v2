# SS51-07: Solutions Library — Product List Page

**Session:** SS-51
**Depends on:** None (uses existing mock provider + API routes)
**Spec reference:** Guiding Principle — Product Knowledge pillar

---

## Context

The Solutions Library is the product catalog surface. Currently a stub page with one line of placeholder text. The mock provider and API routes for product data are fully functional — this prompt builds the list page UI that connects to them.

**Design intent:** More than wireframes, less than final polish. Establish visual hierarchy, subject-area differentiation, and navigation connections. The page should feel like a real product catalog with enough visual fidelity to demonstrate the concept in a walkthrough.

---

## Requirements

### Modify: `src/app/(dashboard)/solutions/page.tsx`

Replace the stub with a client component that fetches and displays product cards.

**Data fetching:**

```typescript
'use client';

import { useState, useEffect } from 'react';
```

Fetch from `/api/products` on mount. The response is `PaginatedResponse<ProductSummary>` — extract `items`. Handle loading, error, and empty states.

**Page structure:**

```
Page title: "Solutions Library"
Subtitle: "Your product catalog — the foundation for matching and playbook generation."

[Loading: 2-column grid of skeleton cards, height ~180px]
[Empty: centered icon (Package), heading, description, no CTA (product creation is an admin flow, not for this prompt)]
[Loaded: 2-column card grid]
```

**Product card design:**

Each card is a clickable `Link` to `/solutions/${product.productId}`.

Layout (top to bottom within card):
1. **Subject area badge** — top of card. Use colored badge treatment:
   - Mathematics → `bg-brand-blue/10 text-brand-blue border-brand-blue/30`
   - English Language Arts → `bg-brand-green/10 text-brand-green border-brand-green/30`
   - Other subjects → `bg-surface-emphasis-neutral text-foreground-secondary border-border` (neutral fallback)
   - Badge variant: `outline`, `text-xs font-medium`
2. **Product name** — `text-lg font-semibold text-foreground tracking-[-0.01em]` (prominent, primary hierarchy)
3. **Grade range** — `text-sm text-foreground-secondary` formatted as "Grades 2–8" or "Grades 6–12"
4. **Description** — `text-sm text-foreground-secondary leading-relaxed` (truncated from ProductSummary, already ~150 chars)
5. **Footer separator** — `border-t border-border-subtle mt-3 pt-3`
6. **Playbook count** — `text-xs text-foreground-tertiary`. Fetched separately (see below). Format: "3 playbooks" or "No playbooks yet". Use FileText icon inline at 14px.

**Card container styling:**
```
rounded-lg border border-border bg-card p-5
hover:shadow-md hover:border-border-default transition-all duration-150
focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
```

**Grid:** `grid grid-cols-1 md:grid-cols-2 gap-6`

**Playbook count fetching:**

Fetch `/api/playbooks` once on mount. Build a map of `productId → playbook count` by iterating through all playbook summaries and counting how many times each product ID appears in `productIds[]`. Pass counts to cards.

This is a lightweight client-side aggregation. With seed data (4 playbooks, 2 products), performance is not a concern. When the real backend exists, this becomes a dedicated endpoint.

```typescript
// Build product → playbook count map
const playbookCountMap: Record<string, number> = {};
playbookItems.forEach((pb) => {
  pb.productIds.forEach((pid: string) => {
    playbookCountMap[pid] = (playbookCountMap[pid] || 0) + 1;
  });
});
```

**Accessibility:**
- Each card has `aria-label` combining product name, subject, grade range, and playbook count.
- Grid uses `role="list"` with cards as `role="listitem"`.

### Do NOT:

- Add search, filter, or sort controls. Two products don't warrant it — these are additive when the library grows.
- Add CRUD actions (create, edit, delete buttons). Product management UX is a design decision deferred to the reconception session.
- Create new shared components. Use existing primitives (Badge, Skeleton, Link) composed inline. If a `ProductCard` component emerges as reusable after the detail page is built, it can be extracted in a follow-up.

---

## Verification

1. `npm run build` passes.
2. Navigating to `/solutions` shows two product cards with correct data.
3. Each card shows subject badge (colored appropriately), name, grade range, description, and playbook count.
4. Clicking a card navigates to `/solutions/[productId]` (will 404 until SS51-08 is executed — that's expected).
5. Loading state shows skeleton grid.
6. Cards have hover elevation and focus indicators.

---

## Files

| Action | File |
|--------|------|
| Modify | `src/app/(dashboard)/solutions/page.tsx` |
