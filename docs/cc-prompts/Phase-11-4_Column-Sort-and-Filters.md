# CC Prompt: Phase 11-4 — Column Header Sort + Declarative Filter Architecture

**Purpose:** Implement structured row layout with column-header sorting and declarative filter system per Spec 15 §6–§7.  
**Prerequisite:** Phase 11-3 (card refactor) must be complete.  
**Spec reference:** `/docs/specs/15_District-List-Experience-Specification.md` §6 (Structured Row Layout), §7 (List Management)

---

## Context

The current list management uses a `Select` dropdown for sorting and inline `Select` dropdowns for filtering. Spec 15 defines a structured row layout where column headers ARE the sort targets, and filters live in a Sheet/Popover triggered by a filter button.

This is the most significant visual change in Phase 11 — it transforms the list from card-stack to column-aligned rows with sort-on-header interaction.

## Tasks

### 1. Create ColumnHeaderBar Component

Create `/src/components/shared/column-header-bar.tsx`:

A horizontal bar that sits above the district list, with clickable column headers aligned to the metrics strip positions in the card below.

```typescript
interface ColumnDefinition {
  key: string;            // matches sort key
  label: string;          // display text
  width?: string;         // Tailwind width class for alignment
  sortable?: boolean;     // default true
}

interface ColumnHeaderBarProps {
  columns: ColumnDefinition[];
  activeSort: { key: string; direction: 'asc' | 'desc' } | null;
  onSort: (key: string) => void;  // toggles: asc → desc → null
  className?: string;
}
```

**Visual design:**
- Height: compact (py-1.5 or py-2)
- Background: `bg-slate-50` with bottom border
- Text: `text-overline` style (uppercase, small, tracked) consistent with Spec 09
- Active sort column: text-foreground with directional arrow (↑ or ↓)
- Inactive sortable columns: text-muted-foreground, subtle hover state
- Click interaction: first click = ascending, second = descending, third = clear sort (return to default)

**Column layout must align with the card's metrics strip.** The header columns and the card metric columns should visually line up. Use consistent width classes or a CSS grid that both the header and card respect.

### 2. Create FilterSheet Component

Create `/src/components/shared/filter-sheet.tsx`:

A Sheet (mobile) or Popover (desktop responsive) that contains filter controls.

```typescript
interface FilterSheetProps {
  filters: FilterDefinition[];     // reuse from ListingsToolbar
  filterValues: Record<string, string | string[] | undefined>;
  onFilterChange: (filterId: string, value: string | string[] | undefined) => void;
  onClearAll: () => void;
  activeFilterCount: number;
}
```

**Filter types to support:**
- Multi-select checkbox groups (Grade Band, District Type, Alignment Level)
- Preset bracket select (Enrollment Range)

**Trigger button:** A "Filters" button with active count badge, positioned in the toolbar area.

### 3. Create ListContextConfig Type

Add to a new file `/src/components/shared/list-context-config.ts`:

```typescript
import type { ColumnDefinition } from './column-header-bar';
import type { FilterDefinition } from './listings-toolbar';

export interface SortOption {
  key: string;
  label: string;
  defaultDirection: 'asc' | 'desc';
}

export interface ListContextConfig {
  defaultSort: SortOption | null;       // null = original order
  columns: ColumnDefinition[];          // for header bar
  availableFilters: FilterDefinition[];
  showSearch: boolean;                  // full search for directory contexts
  showLocalFilter: boolean;             // name filter for discovery contexts
  showColumnHeaders: boolean;           // false for compact views
}
```

### 4. Define Context-Specific Configurations

Create preset configs:

**Discovery Ranked List:**
```typescript
{
  defaultSort: null,  // original rank order
  columns: [
    { key: 'rank', label: '#', width: 'w-8', sortable: false },
    { key: 'name', label: 'District', width: 'flex-1' },
    { key: 'enrollment', label: 'Enrollment', width: 'w-24' },
    { key: 'frpm', label: 'FRPM %', width: 'w-20' },
    { key: 'ell', label: 'ELL %', width: 'w-20' },
    { key: 'academic', label: 'ELA Prof.', width: 'w-24' },
  ],
  availableFilters: [
    { id: 'gradeBand', label: 'Grade Band', type: 'multi-checkbox', options: [...] },
    { id: 'districtType', label: 'District Type', type: 'multi-checkbox', options: [...] },
    { id: 'enrollmentRange', label: 'Enrollment', type: 'bracket-select', options: [...] },
  ],
  showSearch: false,
  showLocalFilter: true,
  showColumnHeaders: true,
}
```

**Discovery Card Set:** Same columns, same filters, `defaultSort: null` (original order).

**Saved Districts:** Add `savedAt` column, default sort by saved date.

**District Directory:** `showSearch: true`, `showLocalFilter: false`, add county filter.

### 5. Update DistrictListingsContainer

Modify `/src/components/shared/district-listings-container.tsx` to:

- Accept a `ListContextConfig` prop
- Render `ColumnHeaderBar` above the list when `config.showColumnHeaders` is true
- Render filter button + `FilterSheet` when filters are available
- Manage sort state internally: active sort key + direction
- Pass sort state down so `ColumnHeaderBar` can render indicators
- Pass sort state up (or manage via callback) so the parent can sort the data

Remove the sort `Select` from the toolbar. The toolbar retains: search/local filter input + filter button + count strip.

### 6. Update Renderers

**`ranked-list-renderer.tsx`:**
- Remove the inline `ListingsToolbar` usage (it currently has its own toolbar with sort dropdown)
- Remove the inline count strip
- Use `DistrictListingsContainer` with the ranked list `ListContextConfig`
- Pass entries as children — the container handles toolbar, headers, count strip

**`card-set-renderer.tsx`:**
- Same transformation — remove inline toolbar/count, use container with config

This consolidation means the renderers become much simpler — they map entries to cards and pass them to the container, which handles all list management UI.

### 7. Sort Implementation

Sort logic for snapshot fields:

```typescript
function sortByColumn(entries: Array<{ snapshot: DistrictSnapshot; [key: string]: any }>, key: string, direction: 'asc' | 'desc') {
  const sorted = [...entries];
  const dir = direction === 'asc' ? 1 : -1;
  
  sorted.sort((a, b) => {
    switch (key) {
      case 'name': return dir * a.snapshot.name.localeCompare(b.snapshot.name);
      case 'enrollment': return dir * (a.snapshot.totalEnrollment - b.snapshot.totalEnrollment);
      case 'frpm': return dir * (a.snapshot.frpmPercent - b.snapshot.frpmPercent);
      case 'ell': return dir * (a.snapshot.ellPercent - b.snapshot.ellPercent);
      case 'academic': return dir * (a.snapshot.elaProficiency - b.snapshot.elaProficiency);
      // math variant when academicMetricOverride is 'math'
      default: return 0;
    }
  });
  
  return sorted;
}
```

### 8. Active Sort Visual Feedback on Card

When a column header sort is active, the corresponding metric in each card's Tier 2 strip should receive subtle emphasis. The `activeSortMetric` prop already exists on `DistrictListCard` — ensure the column `key` maps to the metric label the card uses for highlighting.

## Verification

After all changes:
1. `npm run build` — clean build
2. Discovery ranked list: click column headers, verify sort toggles (asc/desc/clear)
3. Discovery ranked list: open filter sheet, apply grade band filter, verify active filter chip appears
4. Discovery card set: same sort/filter behavior
5. Verify the column headers visually align with the card metrics strip
6. Verify keyboard accessibility: Tab to column headers, Enter/Space to sort
7. Check that rank column does NOT sort (it's the original AI ranking, not a sortable dimension)

## Visual Standards

Reference Spec 09 for:
- Column header typography: overline style (uppercase, small, tracked)
- Emphasis surface for active sort column
- Filter sheet styling consistent with intelligence briefing aesthetic
- No left-border accent treatments on any new components
