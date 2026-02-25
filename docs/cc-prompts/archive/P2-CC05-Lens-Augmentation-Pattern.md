# P2-CC05: Lens Augmentation Pattern

**Purpose:** Implement the lens augmentation visual pattern — when a product is selected in the lens bar, inject a contextual callout block at the top of each district tab showing product-relevant alignment signals  
**Depends on:** CC04a (district tab mapping — tabs must match P2 spec)  
**Spec reference:** `Specs/P2-Spec-01_Unified-View-Architecture.md` §3.6 (lens behavior), §4.1 (lens augmentation)  
**Session:** P2-S06  
**Design decision:** Pattern A — injected callout block above existing tab content, with subtle brand-tinted surface

---

## Context

When the rep activates the lens (selects a product in the `LensControlBar`), the district tabs should be augmented with product-relevant context. The spec states: "When the lens is active, district tab content is augmented with product-relevant signals and context. The tab structure does not change. Augmented content is visually distinguished from base content."

The data source for augmentation is the `MatchSummary` object, which the district page already fetches when the lens is active (stored in `matchSummary` state). `MatchSummary` contains `dimensions: AlignmentDimension[]`, where each dimension has a `key`, `tier`, `signals[]`, and `productConnection` string.

The augmentation block appears conditionally at the top of each tab's content area when `isLensActive` is true. When the lens is cleared, the blocks disappear and tabs return to their base state.

---

## Deliverables

### 1. Create `LensAugmentationBlock` component

**File:** `src/components/district-profile/lens-augmentation-block.tsx`

A reusable component that renders a product-context callout block. Used inside each district tab when the lens is active.

**Props:**

```typescript
interface LensAugmentationBlockProps {
  productName: string;
  dimensions: AlignmentDimension[];  // filtered to relevant dimensions for this tab
}
```

**Visual structure:**

```
┌──────────────────────────────────────────────────────────┐
│ 🔍 [ProductName] lens                                   │  ← header row
│                                                          │
│ [productConnection from first dimension]                 │  ← primary connection text
│                                                          │
│ • [signal 1]                                             │  ← evidence signals
│ • [signal 2]                                             │
│ • [signal 3]                                             │
└──────────────────────────────────────────────────────────┘
```

**Visual treatment:**

- Background: a subtle brand-tinted surface. Use a custom utility class or inline style: `bg-brand-orange` at very low opacity. Specifically, apply `rgba(240, 134, 50, 0.06)` as the background (brand orange `#F08632` at 6% opacity). This is light enough to read as "product context" without competing with content.
  - Implementation: use a Tailwind arbitrary value `bg-[rgba(240,134,50,0.06)]` or add a semantic token. Prefer the arbitrary value for now — a semantic token can be extracted later during design system cleanup.
- Left border: 3px solid brand orange `border-l-[3px] border-l-brand-orange`. Check if `border-l-brand-orange` resolves in the Tailwind config. If not, use the hex value: `border-l-[#F08632]`.
- Rounded corners: `rounded-md` (right side only if left border is full-height, or all corners).
- Padding: `p-4`
- Margin bottom: `mb-6` to separate from the tab content below.

**Header row:**
- Search icon (`Search` from lucide-react), 14px, `text-foreground-secondary`
- Product name in `text-sm font-semibold text-foreground`
- The word "lens" in `text-sm text-foreground-secondary` after the product name

**Product connection:**
- `text-sm leading-relaxed text-foreground` — the `productConnection` string from the first (primary) dimension. If multiple dimensions are provided, show only the first dimension's `productConnection` as the lead text.

**Signals list:**
- Gather all `signals` arrays from all provided dimensions, deduplicate, and render as a compact list.
- Each signal: `text-sm text-foreground-secondary` with a small bullet or dash prefix.
- If no signals exist, omit the signals section entirely.

**Empty state:** If `dimensions` array is empty, render a softer fallback:

```tsx
<p className="text-sm text-foreground-tertiary">
  No specific alignment data available for this view. Explore other tabs for product-relevant signals.
</p>
```

**Full component:**

```tsx
'use client';

import { Search } from 'lucide-react';
import type { AlignmentDimension } from '@/services/types/common';

interface LensAugmentationBlockProps {
  productName: string;
  dimensions: AlignmentDimension[];
}

export function LensAugmentationBlock({ productName, dimensions }: LensAugmentationBlockProps) {
  if (dimensions.length === 0) {
    return (
      <div className="mb-6 rounded-md border-l-[3px] border-l-[#F08632] bg-[rgba(240,134,50,0.06)] p-4">
        <div className="flex items-center gap-1.5">
          <Search className="h-3.5 w-3.5 text-foreground-secondary" />
          <span className="text-sm font-semibold text-foreground">{productName}</span>
          <span className="text-sm text-foreground-secondary">lens</span>
        </div>
        <p className="mt-2 text-sm text-foreground-tertiary">
          No specific alignment data available for this view. Explore other tabs for product-relevant signals.
        </p>
      </div>
    );
  }

  const primaryConnection = dimensions[0].productConnection;
  const allSignals = [...new Set(dimensions.flatMap((d) => d.signals))];

  return (
    <div className="mb-6 rounded-md border-l-[3px] border-l-[#F08632] bg-[rgba(240,134,50,0.06)] p-4">
      <div className="flex items-center gap-1.5">
        <Search className="h-3.5 w-3.5 text-foreground-secondary" />
        <span className="text-sm font-semibold text-foreground">{productName}</span>
        <span className="text-sm text-foreground-secondary">lens</span>
      </div>
      <p className="mt-2 text-sm leading-relaxed text-foreground">
        {primaryConnection}
      </p>
      {allSignals.length > 0 && (
        <ul className="mt-3 space-y-1">
          {allSignals.map((signal, i) => (
            <li key={i} className="flex items-start gap-2 text-sm text-foreground-secondary">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground-tertiary" />
              {signal}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
```

### 2. Define tab-to-dimension mapping

**File:** `src/components/district-profile/research-tabs.tsx` (or a co-located constant)

Create a mapping from tab keys to relevant `AlignmentDimensionKey` values:

```typescript
import type { AlignmentDimensionKey } from '@/services/types/common';

const TAB_DIMENSION_MAP: Record<string, AlignmentDimensionKey[]> = {
  goalsFunding: ['goals_priorities', 'budget_capacity'],
  academicPerformance: ['academic_need', 'student_population'],
  districtTrends: ['student_population'],
  news: [],  // no augmentation for news stub
};
```

### 3. Update `ResearchTabs` to accept and render lens augmentation

**File:** `src/components/district-profile/research-tabs.tsx`

**3a. Add props for lens state:**

```typescript
import type { MatchSummary } from '@/services/types/common';

interface ResearchTabsProps {
  districtId: string;
  yearData?: DistrictYearData[];
  isLensActive?: boolean;
  matchSummary?: MatchSummary | null;
  activeProductName?: string;
}
```

**3b. Inside each `TabsContent`, conditionally render `LensAugmentationBlock` above the existing content:**

For each tab, filter the `matchSummary.dimensions` to only include dimensions whose `key` appears in `TAB_DIMENSION_MAP[tab.key]`:

```tsx
{availableTabs.map((tab) => {
  // Resolve lens augmentation dimensions for this tab
  const relevantDimensionKeys = TAB_DIMENSION_MAP[tab.key] ?? [];
  const augmentationDimensions = (isLensActive && matchSummary)
    ? matchSummary.dimensions.filter((d) => relevantDimensionKeys.includes(d.key))
    : [];

  return (
    <TabsContent key={tab.key} value={tab.key}>
      {/* Lens augmentation block — shown when lens is active */}
      {isLensActive && activeProductName && relevantDimensionKeys.length > 0 && (
        <div className="pt-4">
          <LensAugmentationBlock
            productName={activeProductName}
            dimensions={augmentationDimensions}
          />
        </div>
      )}

      {/* Base tab content */}
      {tab.key === 'goalsFunding' && intel && <GoalsFundingTab intel={intel} />}
      {tab.key === 'academicPerformance' && intel && <AcademicPerformanceTab intel={intel} />}
      {tab.key === 'districtTrends' && yearData && (
        <div className="pt-4">
          <DistrictChart yearData={yearData} />
        </div>
      )}
      {tab.key === 'news' && <NewsStubTab />}
    </TabsContent>
  );
})}
```

**3c. Add imports:**

```typescript
import { LensAugmentationBlock } from './lens-augmentation-block';
import type { AlignmentDimensionKey } from '@/services/types/common';
```

### 4. Update district page to pass lens props to `ResearchTabs`

**File:** `src/app/(dashboard)/districts/[districtId]/page.tsx`

The district page already has `isLensActive`, `matchSummary`, and `activeProduct` in state. Pass them through:

Change:

```tsx
<ResearchTabs districtId={districtId} yearData={yearData} />
```

To:

```tsx
<ResearchTabs
  districtId={districtId}
  yearData={yearData}
  isLensActive={isLensActive}
  matchSummary={matchSummary}
  activeProductName={activeProduct?.name}
/>
```

### 5. Update barrel export

**File:** `src/components/district-profile/index.ts`

Add `LensAugmentationBlock` to exports.

---

## Files Modified

| File | Change |
|---|---|
| `src/components/district-profile/lens-augmentation-block.tsx` | **NEW** — callout block component |
| `src/components/district-profile/research-tabs.tsx` | Add lens props, dimension mapping, conditional rendering of augmentation blocks |
| `src/app/(dashboard)/districts/[districtId]/page.tsx` | Pass `isLensActive`, `matchSummary`, `activeProductName` to `ResearchTabs` |
| `src/components/district-profile/index.ts` | Add `LensAugmentationBlock` export |

---

## Verification

### Lens inactive (baseline)

1. Navigate to any district page
2. Confirm no augmentation blocks visible in any tab
3. Click through all 4 tabs — content renders as normal

### Lens active

4. Select a product in the lens bar dropdown
5. Confirm augmentation block appears at the top of **Goals & Funding** tab
   - Should show product name + "lens" in header
   - Should show product connection text
   - Should show signal bullets
   - Should have subtle orange-tinted background with left border accent
6. Click **Academic Performance** tab — confirm augmentation block appears with different signals (student_population / academic_need dimensions)
7. Click **District Trends** tab — confirm augmentation block appears (student_population dimension)
8. Click **News** tab — confirm NO augmentation block (news has no dimension mapping)

### Lens deactivation

9. Clear the product selection in the lens bar
10. Confirm all augmentation blocks disappear immediately
11. Tab content returns to base state with no visual artifacts

### Visual verification

12. Augmentation block background is subtly orange-tinted, not white, not strongly colored
13. Left border is visible brand orange
14. Text is readable against the tinted background
15. Block has clear visual separation from the tab content below (mb-6 gap)
16. Block does not cause jarring layout shift — content pushes down smoothly

### Edge cases

17. If a dimension has no signals, the signals list should not render (no empty `<ul>`)
18. If the `matchSummary` has no dimensions matching a tab's keys, the empty state fallback should render
19. Confirm no TypeScript errors (`npx tsc --noEmit`)
20. Confirm no console errors in browser

---

## Acceptance Criteria

- [ ] `LensAugmentationBlock` component created with brand-tinted visual treatment
- [ ] Augmentation blocks appear in district tabs when lens is active
- [ ] Augmentation blocks disappear when lens is cleared
- [ ] Each tab shows only its relevant alignment dimensions (per TAB_DIMENSION_MAP)
- [ ] News tab shows no augmentation block
- [ ] Empty state fallback renders when no matching dimensions exist
- [ ] Visual treatment: subtle orange tint background, orange left border, readable text
- [ ] No layout artifacts when toggling lens on/off
- [ ] Design tokens used — no hardcoded colors except the brand orange arbitrary values documented in the prompt
- [ ] Zero TypeScript compilation errors
- [ ] Zero runtime console errors
