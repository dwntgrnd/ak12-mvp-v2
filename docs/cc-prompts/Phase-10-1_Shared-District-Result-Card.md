# Phase 10-1 — Shared District Result Card Component

**Created:** 2026-02-20 · SS-33
**Depends on:** Phase 9D (Tier 3 Format Renderers)
**Spec references:** Spec 14 (Discovery Results Card System §1), Spec 09 (Visual Standards §3, §5)

---

## Objective

Create a single shared `DiscoveryResultCard` component that will be used across all multi-entity discovery result formats (Ranked List, Card Set, Narrative Brief signal grid). This prompt builds the component only — renderer integration is Phase 10-2.

---

## Design Decisions (Resolved)

These decisions were made in the SS-33 design session. Do not deviate.

1. **Full-width stacked layout** — identity zone top, content slot below, product relevance zone bottom. No horizontal identity-left/content-right layout. Simplifies responsive (no layout shift at mobile) and gives content slots full width.

2. **Product relevance zone is a distinct zone below the content slot**, not integrated within it. Renderers do not need to know about product relevance. The shared card owns it. When no product context exists, the zone collapses to zero height with no gap.

3. **Every district reference in discovery results must navigate to the district profile page.** No dead ends. The card's primary job is to drive engagement with the district profile.

---

## 1. Type Changes

### 1A. Add optional `districtId` to `KeySignal`

In `src/services/types/discovery.ts`, update `KeySignal`:

```typescript
export interface KeySignal {
  label: string;
  value: string;
  detail?: string;
  districtId?: string;   // NEW — when present, signal renders as a district card
  location?: string;     // NEW — city, county text for card identity zone
  enrollment?: number;   // NEW — enrollment for card identity zone
}
```

When `districtId` is present on a `KeySignal`, the brief renderer should wrap it in a `DiscoveryResultCard` instead of rendering a plain metric tile. When absent, render as a plain metric tile (current behavior preserved).

### 1B. Add optional `subjectDistrictId` to `BriefContent`

```typescript
export interface BriefContent {
  leadInsight: string;
  keySignals: KeySignal[];
  sections: BriefSection[];
  subjectDistrictId?: string;   // NEW — identifies single-entity briefs
  subjectDistrictName?: string; // NEW — display name for link text
}
```

When present, the brief is about a single district. Used by renderers to add district name linking and "View district profile →" action link. When absent (multi-entity brief like S1), the brief relies on district cards in the key signals grid.

### 1C. Add `districtId` to `DirectAnswerContent`

```typescript
export interface DirectAnswerContent {
  value: string;
  valueUnit?: string;
  contextLine: string;
  districtId?: string;      // NEW — enables district profile navigation
  districtName?: string;    // NEW — display name for link text
}
```

### 1D. Add `ProductRelevance` type

Add to `src/services/types/discovery.ts`:

```typescript
export interface ProductRelevance {
  alignmentLevel: 'strong' | 'moderate' | 'limited' | 'unknown';
  signals: string[];      // e.g., ["LCAP math priority matches product focus"]
  productName: string;
}
```

This type is defined now but not wired into response types until Phase 10-4 (Product Lens).

### 1E. Add `productLensId` to `DiscoveryQueryRequest`

```typescript
export interface DiscoveryQueryRequest {
  query: string;
  productIds?: string[];
  productLensId?: string;   // NEW — optional, omitted when no lens active
}
```

---

## 2. Fixture Updates

### 2A. S1 Narrative Brief — Add `districtId` to Key Signals

Update S1's `keySignals` in `src/services/providers/mock/fixtures/discovery.ts`:

```typescript
keySignals: [
  {
    label: 'Elk Grove USD',
    value: 'Active K-8 math curriculum review',
    detail: 'RFP expected spring 2026',
    districtId: ID_ELK_GROVE,
    location: 'Elk Grove, CA · Sacramento County',
    enrollment: 59800,
  },
  {
    label: 'Twin Rivers USD',
    value: '$4.2M allocated for math materials',
    detail: 'Board approved evaluation timeline',
    districtId: ID_TWIN_RIVERS,
    location: 'North Highlands, CA · Sacramento County',
    enrollment: 27100,
  },
  {
    label: 'Sacramento City USD',
    value: 'Math proficiency 29.1% · LCAP Goal 2 priority',
    detail: 'LCAP prioritizes math intervention',
    districtId: ID_SACRAMENTO_CITY,
    location: 'Sacramento, CA · Sacramento County',
    enrollment: 42500,
  },
  {
    label: 'Natomas USD',
    value: 'Math proficiency trending down 4.2pp',
    detail: 'Exploring supplemental programs',
    districtId: ID_NATOMAS,
    location: 'Sacramento, CA · Sacramento County',
    enrollment: 14800,
  },
],
```

### 2B. S6 Narrative Brief (Plumas) — Add `subjectDistrictId`

Update S6's content data:

```typescript
data: {
  leadInsight: '...existing...',
  keySignals: [...existing — no districtId, these stay as metric tiles...],
  sections: [...existing...],
  subjectDistrictId: ID_PLUMAS_COUNTY,
  subjectDistrictName: 'Plumas County Office of Education',
},
```

### 2C. S3 Intelligence Brief — Add `subjectDistrictId`

Update S3's content data:

```typescript
data: {
  leadInsight: '...existing...',
  keySignals: [...existing — no districtId, these stay as metric tiles...],
  sections: [...existing...],
  subjectDistrictId: ID_TWIN_RIVERS,
  subjectDistrictName: 'Twin Rivers USD',
},
```

### 2D. S2 Direct Answer — Add `districtId`

Update S2's content data:

```typescript
data: {
  value: '71,673',
  valueUnit: 'students',
  contextLine: 'Fresno Unified School District · 2024-25 enrollment',
  districtId: ID_FRESNO,
  districtName: 'Fresno Unified School District',
},
```

---

## 3. Shared Component — `DiscoveryResultCard`

### 3A. File Location

`src/components/discovery/discovery-result-card.tsx`

### 3B. Props Interface

```typescript
interface DiscoveryResultCardProps {
  districtId: string;
  name: string;                        // District name — always the link text
  location?: string;                   // City, county — secondary text
  enrollment?: number;                 // Enrollment — tertiary metric
  variant?: 'surface' | 'inset';      // Visual treatment context
  rank?: number;                       // Rank badge — only for Ranked List
  productRelevance?: ProductRelevance; // Optional — renders only when present
  children?: React.ReactNode;          // Content slot — renderer-specific content
}
```

### 3C. Component Anatomy — Full-Width Stacked

```
┌─ Card container (article, role="listitem", tabIndex=0) ──────────┐
│                                                                    │
│  ┌─ [Rank Badge — conditional] ─┐                                 │
│  │  Numbered circle, 28px       │  Only when rank prop present    │
│  └──────────────────────────────┘                                 │
│                                                                    │
│  ┌─ Identity Zone (always present) ─────────────────────────────┐ │
│  │  District Name (body emphasis 14/600, primary interactive    │ │
│  │    color, cursor pointer — link to district profile)         │ │
│  │  Location (caption 12/500, text-muted-foreground)            │ │
│  │  Enrollment (caption 12/500, text-muted-foreground)          │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌─ Content Slot (children — conditional) ──────────────────────┐ │
│  │  Renderer-specific content passed as children                 │ │
│  │  When no children, zone does not render (no empty gap)        │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
│  ┌─ Product Relevance Zone (conditional) ───────────────────────┐ │
│  │  Badge: alignment level + single-line signal text             │ │
│  │  Only renders when productRelevance prop present              │ │
│  │  When absent: zero height, no gap                             │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                    │
└────────────────────────────────────────────────────────────────────┘
```

### 3D. Visual Treatments by Variant

**`variant="surface"` (default)** — standalone card in a results list:
- Background: `bg-white`
- Border: `border border-slate-200`
- Radius: `rounded-lg` (8px)
- Shadow: `shadow-sm`
- Hover: `shadow-md` transition 150ms + `border-slate-300`
- Per Spec 09 §5 Interactive Cards

**`variant="inset"`** — card inside another container (Narrative Brief, Ranked List outer card):
- Background: `bg-slate-50`
- Border: none
- Radius: `rounded-md` (6px)
- Shadow: none
- Hover: `bg-slate-100` transition 150ms

### 3E. Interaction Behavior

- **Click target**: entire card clickable → navigates to `/districts/${districtId}`
- **Hover**: per variant (shadow-md or bg-slate-100)
- **Focus**: `focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7000]` (matches existing pattern)
- **Keyboard**: `Enter` or `Space` activates navigation, `Tab` moves between cards
- **Cursor**: `cursor-pointer` on entire card
- **Touch target**: minimum 44px height (the card will naturally exceed this)
- **District name**: styled as interactive text (primary color, medium/semibold weight) but the entire card is the click target — the name is not a separate `<a>` tag to avoid nested interactive elements. The name just visually looks like a link to signal "this navigates somewhere."

### 3F. Rank Badge

When `rank` prop is present:
- Renders above the identity zone as a leading element
- Visual: `w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center`
- Number: `text-caption font-[600] text-foreground`
- Margin: `mb-2` below badge to identity zone

When absent: no space reserved.

### 3G. Product Relevance Zone

When `productRelevance` prop is present:
- Separator: `mt-3` gap above
- Layout: single row, flex, `items-center gap-2`
- Alignment badge: styled per alignment level — strong (green), moderate (amber), limited (slate), unknown (slate lighter)
- Signal text: first signal from the `signals` array, caption tier (12/500), `text-muted-foreground`, `truncate` for overflow
- Product name: not shown in the zone (it's shown in the lens selector globally)

When absent: the zone does not render. No margin, no gap, no placeholder.

### 3H. Accessibility

- `role="listitem"` on the card (parent container provides `role="list"`)
- `tabIndex={0}` for keyboard navigation
- `aria-label` built from: name, location, enrollment, rank if present, alignment level if present
- District name link styling is visual only (not a nested `<a>`) to avoid nested interactive elements — the `<article>` with `tabIndex` and `onClick` is the interactive element

---

## 4. Export and Registration

- Export `DiscoveryResultCard` from `src/components/discovery/index.ts`
- Export `ProductRelevance` type from `src/services/types/discovery.ts`

---

## 5. What This Prompt Does NOT Do

- Does **not** modify any existing renderers — that's Phase 10-2
- Does **not** delete `discovery-district-card.tsx` or modify `ranked-list-renderer.tsx` — that's Phase 10-2
- Does **not** wire district links into single-entity formats — that's Phase 10-3
- Does **not** implement the product lens selector — that's Phase 10-4
- Does **not** pass `productRelevance` to cards from any fixture — Phase 10-4

---

## 6. Verification

After implementation, verify:

1. **Type compilation**: `npm run build` passes with all type changes
2. **Component renders in isolation**: create a temporary test usage in any discovery renderer to confirm the card renders with identity zone + content children + rank badge
3. **Both variants render correctly**: surface (white, border, shadow) and inset (slate-50, no border)
4. **Keyboard navigation**: Tab to card, Enter activates navigation
5. **Hover states**: shadow-md lift (surface) or bg-slate-100 (inset)
6. **Empty states**: no content slot children → card renders identity only, no empty gap. No productRelevance → no zone, no gap.
7. **Fixture updates**: all four scenarios (S1, S2, S3, S6) updated with new fields, `npm run build` passes
