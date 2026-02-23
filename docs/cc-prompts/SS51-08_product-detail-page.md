# SS51-08: Product Detail Page

**Session:** SS-51
**Depends on:** SS51-07 (list page provides navigation to this route)
**Spec reference:** Guiding Principle — Product Knowledge pillar

---

## Context

Product detail page — the full profile for a single product. Displays all product attributes in a scannable, visually differentiated layout. Connects to related playbooks that reference this product, closing the navigation loop between product catalog and field activity.

**Design intent:** Four content sections with distinct visual treatments so a rep scanning the page can quickly locate the type of information they need. Not a uniform list wall — each section communicates its purpose through design language.

---

## Requirements

### Create: `src/app/(dashboard)/solutions/[productId]/page.tsx`

Client component that fetches a full `Product` from `/api/products/[productId]` and related playbooks from `/api/playbooks`.

**Data fetching:**

1. Fetch product: `GET /api/products/${productId}` → `Product` type.
2. Fetch playbooks: `GET /api/playbooks` → `PaginatedResponse<PlaybookSummary>`. Filter client-side: `items.filter(pb => pb.productIds.includes(productId))`.
3. Set breadcrumb override: `setBreadcrumbOverride(product.name)` using `useSidebar()` pattern (same as district profile page).
4. Handle loading, error (general + not-found), states.

**Page structure (top to bottom):**

#### Zone 1 — Identity Section

Constrained to `max-w-content mx-auto`. Bottom border to separate from content.

```
[Subject Area Badge]  [Grade Range Badge]
[Product Name — H1]
[Full Description — body text]
```

- Subject area badge: Same colored treatment as list page cards (Math → brand-blue tint, ELA → brand-green tint).
- Grade range badge: Neutral variant, `text-xs`. Format: "Grades 2–8".
- Product name: `text-2xl font-bold tracking-[-0.01em] text-foreground`.
- Description: `text-sm text-foreground-secondary leading-relaxed mt-2`. Full text (not truncated).
- Container: `pb-6 border-b border-border`.

#### Zone 2 — Content Sections

Four sections in a 2-column grid on desktop (`grid grid-cols-1 lg:grid-cols-2 gap-6`), single column on mobile. Each section is a card with its own visual treatment.

**Section 1: Key Features** (what this product does)

Visual treatment: Green accent. Check icons.

```
Container: rounded-lg border border-border bg-card p-5
Header: "Key Features" — text-sm font-semibold uppercase tracking-wider text-foreground-tertiary mb-3
Items: Each item is a flex row:
  - Check icon (lucide Check): h-4 w-4 text-success shrink-0 mt-0.5
  - Text: text-sm text-foreground leading-relaxed
  - Gap between icon and text: gap-2.5
  - Gap between items: space-y-2.5
```

If `keyFeatures` is empty or undefined, do not render this section.

**Section 2: Target Challenges** (what problems this product solves)

Visual treatment: Amber/warm accent. Target-oriented.

```
Container: rounded-lg border border-border bg-card p-5
Header: "Target Challenges" — text-sm font-semibold uppercase tracking-wider text-foreground-tertiary mb-3
Items: Each item is a flex row:
  - Crosshair icon (lucide Crosshair): h-4 w-4 text-warning shrink-0 mt-0.5
  - Text: text-sm text-foreground leading-relaxed
  - Gap: gap-2.5
  - Gap between items: space-y-2.5
```

If `targetChallenges` is empty or undefined, do not render this section.

**Section 3: Competitive Differentiators** (why this product, not competitors)

Visual treatment: Brand-accented left border. Stronger visual weight — these are selling points.

```
Container: rounded-lg border border-border bg-card p-5 border-l-4 border-l-brand-blue
Header: "Competitive Differentiators" — text-sm font-semibold uppercase tracking-wider text-foreground-tertiary mb-3
Items: Each item:
  - Text: text-sm font-medium text-foreground leading-relaxed
  - Between items: space-y-3
  - Each item wrapped in a subtle bg: bg-surface-inset rounded-md px-3 py-2
```

If `competitiveDifferentiators` is empty or undefined, do not render this section.

**Section 4: Approved Messaging** (quotable talking points)

Visual treatment: Blockquote style. Conversational, quotable.

```
Container: rounded-lg border border-border bg-card p-5
Header: "Approved Messaging" — text-sm font-semibold uppercase tracking-wider text-foreground-tertiary mb-3
Items: Each item is a blockquote:
  - Container: pl-4 border-l-2 border-brand-orange/40
  - Text: text-sm text-foreground leading-relaxed italic
  - Between items: space-y-4
```

If `approvedMessaging` is empty or undefined, do not render this section.

**Grid behavior:** If only 1-2 sections have content, the grid still works — items fill left-to-right. If all 4 are present (our mock data has all 4 for both products), it's a clean 2×2 grid on desktop.

#### Zone 3 — Related Playbooks

Below the content sections grid. Full width within `max-w-content`.

```
Section header: "Related Playbooks" — text-lg font-semibold text-foreground mb-4
Separator: mt-8 pt-6 border-t border-border (separates from content grid)
```

**If playbooks exist for this product:**

Render using the existing `PlaybookCard` component in a grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`.

Import `PlaybookCard` from `@/components/playbook/playbook-card`. The card already handles district name, fit badge, product names, date, and status.

Map the filtered playbook summaries to the shape `PlaybookCard` expects:

```typescript
interface PlaybookCardPlaybook {
  playbookId: string;
  districtName: string;
  fitAssessment: { fitScore: number; fitRationale: string };
  productNames: string[];
  generatedAt: string;
  overallStatus: 'generating' | 'complete' | 'partial' | 'failed';
}
```

Derive `overallStatus` from `sectionStatuses` using the same logic as the playbooks page:

```typescript
function deriveOverallStatus(sectionStatuses: Record<string, string>): 'generating' | 'complete' | 'partial' | 'failed' {
  const statuses = Object.values(sectionStatuses);
  if (statuses.some(s => s === 'generating')) return 'generating';
  if (statuses.some(s => s === 'error')) return 'failed';
  if (statuses.every(s => s === 'complete')) return 'complete';
  return 'partial';
}
```

**If no playbooks exist for this product:**

Render a subtle empty state (not a full empty state pattern — this is a secondary section):

```
<p className="text-sm text-foreground-secondary">
  No playbooks have been generated with this product yet.
</p>
```

#### Loading State

Full-page loading skeleton:
- Identity zone: badge skeleton (w-24 h-5), name skeleton (w-64 h-7), description skeleton (w-full h-16)
- Content grid: 4 skeleton cards (h-40 each) in 2×2 grid
- Related playbooks: section header skeleton + 2 card skeletons

#### Not Found State

```
Centered: "Product not found"
Subtitle: "This product may have been removed or doesn't exist."
Button: "Back to Solutions Library" → Link to /solutions
```

#### Error State

```
Centered: "Something went wrong"
Subtitle: error message
Button: "Retry" with RefreshCw icon
```

### Modify: `src/components/layout/content-utility-bar.tsx`

Add breadcrumb support for the solutions detail route in the `useBreadcrumbs` function:

```typescript
if (pathname.startsWith('/solutions/') && pathname !== '/solutions') {
  return {
    parent: { label: 'Solutions Library', href: '/solutions' },
    current: breadcrumbOverride ?? 'Product',
  };
}
```

Add this **before** the `routeMap` lookup (similar to the existing `/districts/` check).

---

## Verification

1. `npm run build` passes.
2. Navigating from solutions list → clicking EnvisionMath card → lands on `/solutions/prod-001` showing full product profile.
3. Breadcrumb reads "Solutions Library > EnvisionMath".
4. Four content sections render with distinct visual treatments: green checks (features), amber crosshairs (challenges), blue left-border cards (differentiators), orange-bordered blockquotes (messaging).
5. Related playbooks section shows playbook cards for districts that have playbooks referencing this product.
6. Clicking a playbook card navigates to the playbook detail page.
7. Back navigation via breadcrumb returns to solutions list.
8. Both products (EnvisionMath, myPerspectives) render correctly with their respective data.
9. Loading skeleton displays during fetch.
10. Invalid product ID shows not-found state with back link.

---

## Files

| Action | File |
|--------|------|
| Create | `src/app/(dashboard)/solutions/[productId]/page.tsx` |
| Modify | `src/components/layout/content-utility-bar.tsx` |
