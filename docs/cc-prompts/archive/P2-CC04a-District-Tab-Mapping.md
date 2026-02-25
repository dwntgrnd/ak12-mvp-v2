# P2-CC04a: District Tab Mapping

**Purpose:** Align district intelligence tabs to P2-Spec-01 §4.1  
**Depends on:** CC03a–CC03c (unified view shell built)  
**Spec reference:** `Specs/P2-Spec-01_Unified-View-Architecture.md` §4.1  
**Session:** P2-S06

---

## Context

The district intelligence tabs in `ResearchTabs` still reflect the P1 tab set. The P2 spec defines four district tabs: Goals & Funding, Academic Performance, District Trends, and News. The current codebase has "Competitive Intel" as a district tab (which belongs only in playbook content per P2) and is missing the "News" tab.

The `CompetitiveIntelTab` component and its fixture data are retained — they serve as data sources for playbook generation. They are simply no longer rendered as a standalone district tab.

---

## Deliverables

### 1. Update `IntelligenceCategory` type

**File:** `src/services/types/district-intelligence.ts`

Change the `IntelligenceCategory` union from:

```typescript
export type IntelligenceCategory =
  | 'goalsFunding'
  | 'academicPerformance'
  | 'competitiveIntel';
```

To:

```typescript
export type IntelligenceCategory =
  | 'goalsFunding'
  | 'academicPerformance';
```

Remove `'competitiveIntel'` from the union. This type controls which tabs render based on available data. Competitive intel data types (`CompetitorEntry`, etc.) remain unchanged — they're still used by playbook generation.

### 2. Update `getAvailableCategories` fixture function

**File:** `src/services/providers/mock/fixtures/district-intelligence.ts`

Find the `getAvailableCategories` function and remove `'competitiveIntel'` from any returned arrays. The function should only return `'goalsFunding'` and/or `'academicPerformance'` based on data availability.

### 3. Update `ResearchTabs` component

**File:** `src/components/district-profile/research-tabs.tsx`

**3a. Update TAB_CONFIG** — remove Competitive Intel, add News:

```typescript
import { Target, BarChart3, TrendingUp, Newspaper } from 'lucide-react';

// ...

interface TabConfig {
  key: IntelligenceCategory | 'districtTrends' | 'news';
  label: string;
  icon: LucideIcon;
}

const TAB_CONFIG: TabConfig[] = [
  { key: 'goalsFunding', label: 'Goals & Funding', icon: Target },
  { key: 'academicPerformance', label: 'Academic Performance', icon: BarChart3 },
  { key: 'districtTrends', label: 'District Trends', icon: TrendingUp },
  { key: 'news', label: 'News', icon: Newspaper },
];
```

**3b. Update tab filtering logic** in the `useMemo` block. The current logic filters intelligence tabs by `getAvailableCategories`, then conditionally appends District Trends. Update to:

- Intelligence tabs (`goalsFunding`, `academicPerformance`) — filtered by `getAvailableCategories` as before
- District Trends — conditionally appended if `yearData` exists (existing behavior)
- News — always appended (it's a stub, always shown)

```typescript
const { intel, availableTabs } = useMemo(() => {
  const data = getDistrictIntelligence(districtId);
  const categories = getAvailableCategories(districtId);

  // Intelligence tabs filtered by available categories
  const intelligenceTabs = TAB_CONFIG.filter(
    (t) =>
      t.key !== 'districtTrends' &&
      t.key !== 'news' &&
      categories.includes(t.key as IntelligenceCategory)
  );

  // District Trends tab — conditional on yearData
  const hasTrendsData = yearData != null && yearData.length > 0;
  const trendTab = hasTrendsData
    ? [TAB_CONFIG.find((t) => t.key === 'districtTrends')!]
    : [];

  // News tab — always present (stub for now)
  const newsTab = [TAB_CONFIG.find((t) => t.key === 'news')!];

  return {
    intel: data,
    availableTabs: [...intelligenceTabs, ...trendTab, ...newsTab],
  };
}, [districtId, yearData]);
```

**3c. Update TabsContent rendering** — remove the `competitiveIntel` case, add `news`:

```tsx
{tab.key === 'goalsFunding' && intel && <GoalsFundingTab intel={intel} />}
{tab.key === 'academicPerformance' && intel && <AcademicPerformanceTab intel={intel} />}
{tab.key === 'districtTrends' && yearData && (
  <div className="pt-4">
    <DistrictChart yearData={yearData} />
  </div>
)}
{tab.key === 'news' && <NewsStubTab />}
```

**3d. Remove the import** of `CompetitiveIntelTab` from this file. The component file itself stays in the codebase.

### 4. Create `NewsStubTab` component

**File:** `src/components/district-profile/news-stub-tab.tsx`

Simple empty state component. Use design tokens, match the visual language of other tab content areas.

```tsx
'use client';

import { Newspaper } from 'lucide-react';

export function NewsStubTab() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="mb-4 rounded-full bg-surface-secondary p-3">
        <Newspaper className="h-6 w-6 text-foreground-tertiary" />
      </div>
      <h3 className="text-sm font-semibold text-foreground-secondary">
        News
      </h3>
      <p className="mt-1 max-w-xs text-sm text-foreground-tertiary">
        District news and recent developments will appear here when data sources are connected.
      </p>
    </div>
  );
}
```

Verify that `bg-surface-secondary`, `text-foreground-tertiary`, and `text-foreground-secondary` exist in the project's design tokens / Tailwind config. If not, use the closest equivalent from `design-tokens.ts`. Do NOT hardcode colors.

### 5. Update barrel export

**File:** `src/components/district-profile/index.ts`

Add `NewsStubTab` to the exports. Keep `CompetitiveIntelTab` exported — it may be consumed by playbook generation logic later.

### 6. Import `NewsStubTab` in `ResearchTabs`

Add the import at the top of `research-tabs.tsx`:

```typescript
import { NewsStubTab } from './news-stub-tab';
```

---

## Files Modified

| File | Change |
|---|---|
| `src/services/types/district-intelligence.ts` | Remove `'competitiveIntel'` from `IntelligenceCategory` union |
| `src/services/providers/mock/fixtures/district-intelligence.ts` | Remove `'competitiveIntel'` from `getAvailableCategories` return values |
| `src/components/district-profile/research-tabs.tsx` | Update TAB_CONFIG, tab filtering, tab rendering, imports |
| `src/components/district-profile/news-stub-tab.tsx` | NEW — empty state stub |
| `src/components/district-profile/index.ts` | Add `NewsStubTab` export |

## Files NOT Modified (intentionally)

| File | Reason |
|---|---|
| `src/components/district-profile/competitive-intel-tab.tsx` | Retained as data source component for playbook generation |
| `src/services/types/district-intelligence.ts` (CompetitorEntry, etc.) | Competitive intel data types still used by playbook service |
| `src/services/providers/mock/fixtures/district-intelligence.ts` (competitive data) | Fixture data retained for playbook content generation |

---

## Verification

1. Navigate to any district page (e.g., `/districts/b8cd9b23-4f2f-470d-b1e5-126e7ff2a928`)
2. Confirm four tabs visible: **Goals & Funding**, **Academic Performance**, **District Trends**, **News**
3. Confirm "Competitive Intel" tab is NOT present
4. Click Goals & Funding — content renders as before
5. Click Academic Performance — content renders as before
6. Click District Trends — chart renders as before (if yearData exists)
7. Click News — empty state renders with icon, heading, and placeholder text
8. Confirm no TypeScript errors (`npx tsc --noEmit`)
9. Confirm no console errors in browser

---

## Acceptance Criteria

- [ ] `IntelligenceCategory` no longer includes `'competitiveIntel'`
- [ ] `ResearchTabs` renders exactly 4 tabs matching spec §4.1 order
- [ ] Competitive Intel tab is gone from district view
- [ ] News tab shows stub empty state
- [ ] No TypeScript compilation errors
- [ ] No runtime console errors
- [ ] `competitive-intel-tab.tsx` file still exists in codebase
- [ ] Design tokens used for all colors/spacing in `NewsStubTab` (no hardcoded values)
