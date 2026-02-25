# P2-CC13: Structural Refactoring — Unified Three-Zone Layout

**Created:** 2026-02-25  
**Spec:** P2-Spec-02 (Unified Page Architecture), Section 7 — CC13  
**Session:** P2-S10  
**Risk:** Highest of the CC13-15 sequence. Touches routing, shared layout, and data fetching on both district routes.

---

## Objective

Establish the shared three-zone page architecture for all district-context views. Both `/districts/[districtId]` (district profile) and `/districts/[districtId]/playbooks/[playbookId]` (playbook detail) must render within an identical structural layout: Zone 1 (Identity), Zone 2 (Mode Bar stub), Zone 3 (Tab Content). No functional changes to state management, generation flow, or tab content components.

**This is CSS/structure only. Do not modify state machines, callbacks, data flow logic, or tab content components.**

---

## Context

### Current state — District profile page (`/districts/[districtId]/page.tsx`)
- Renders `PersistentDataStrip` (Zone 1 equivalent) ✓
- Renders `ModeBar` (will be redesigned in CC14, stub here)
- Renders `LensControlBar` (will be absorbed in CC14, leave in place for now)
- Renders `ResearchTabs` or `PlaybookPreviewTabs` conditional on generation state
- Handles generation flow, lens state, match summaries
- Fetches district data + year-over-year data

### Current state — Playbook detail page (`/districts/[districtId]/playbooks/[playbookId]/page.tsx`)
- Renders `ModeBar` ✓
- Renders custom page header (h1 with district—product, status badge, delete button) — **REMOVE**
- Renders `PlaybookContextCard` (collapsible district/product info) — **REMOVE**
- Renders inline `Tabs` with playbook sections
- Fetches playbook, district, and product data
- Does NOT fetch year-over-year data — **ADD** (needed for `PersistentDataStrip` trend arrows)

---

## Tasks

### 1. Create `UnifiedDistrictLayout` component

**File:** `src/components/district-profile/unified-district-layout.tsx`

A wrapper component that enforces the three-zone structure. This is a layout component, not a data-fetching component. It receives children/slots for each zone.

```tsx
interface UnifiedDistrictLayoutProps {
  identityZone: React.ReactNode;  // Zone 1 — PersistentDataStrip
  modeBarZone: React.ReactNode;   // Zone 2 — ModeBar (stub now, redesigned in CC14)
  children: React.ReactNode;       // Zone 3 — Tab content area
}
```

Layout structure:
- Zone 1: renders `identityZone` prop
- Zone 2: renders `modeBarZone` prop with consistent spacing (`mt-4`)
- Zone 3: renders `children` with consistent spacing (`mt-8`)
- No max-width constraint (inherits from dashboard layout's `max-w-layout`)

### 2. Refactor district profile page to use `UnifiedDistrictLayout`

**File:** `src/app/(dashboard)/districts/[districtId]/page.tsx`

Wrap the existing rendered content in `UnifiedDistrictLayout`:
- `identityZone` → `PersistentDataStrip` (as-is, no changes)
- `modeBarZone` → existing `ModeBar` + `LensControlBar` (as-is for now — CC14 redesigns these)
- `children` → existing tab rendering (ResearchTabs / PlaybookPreviewTabs conditional + PlaybookPreviewBanner)

**Do not change any props, state, callbacks, or conditional logic.** The page should render identically to its current state. The only change is that the three zones are wrapped in the shared layout component.

### 3. Refactor playbook detail page to use `UnifiedDistrictLayout`

**File:** `src/app/(dashboard)/districts/[districtId]/playbooks/[playbookId]/page.tsx`

**3a. Add year-over-year data fetch:**
Add a fetch for `/api/districts/${districtId}/years` in the initial data load effect, parallel with the existing district fetch. Store in `yearData` state (same pattern as district profile page).

**3b. Add `PersistentDataStrip` as Zone 1:**
Import and render `PersistentDataStrip` with:
- `district` — already fetched
- `yearData` — newly fetched
- `matchSummary` — derive from playbook's `fitAssessment` if available, or pass `null`. (The playbook page doesn't currently fetch match summaries. For CC13, pass `null` — CC14 can enhance this.)
- `activeProductName` — `playbook.productNames[0]`

**3c. Remove `PlaybookContextCard`:**
Delete the entire `PlaybookContextCard` render block. The district identity is now in Zone 1. Product context will be in the Mode Bar (CC14).

**3d. Remove custom page header:**
Delete the page header block containing:
- The h1 (`{playbook.districtName} — {playbook.productNames.join(', ')}`)
- The `OverallStatusBadge`
- The timestamp
- The delete button + AlertDialog

These will be redistributed in CC14 (status → Mode Bar) and CC15 (delete → Workflow Drawer). For CC13, the `ModeBar` already shows the playbook name context. The delete functionality is temporarily inaccessible — acceptable for a structural refactoring step that will be followed immediately by CC14.

**Note on temporary delete accessibility:** If losing delete access during the CC13→CC14 gap is unacceptable, keep the delete button as a minimal standalone element below the Mode Bar, clearly marked with a `// TODO: CC15 — moves to Workflow Drawer` comment. Prefer the clean removal if the gap is short.

**3e. Wrap in `UnifiedDistrictLayout`:**
- `identityZone` → `PersistentDataStrip`
- `modeBarZone` → existing `ModeBar` (as-is)
- `children` → existing `Tabs` rendering (the playbook tab sections)

**3f. Remove `max-w-content` class** from the playbook page's root div. Width is now managed by the dashboard layout's `max-w-layout` via the shared structure.

### 4. Update barrel export

**File:** `src/components/district-profile/index.ts`

Add: `export { UnifiedDistrictLayout } from './unified-district-layout';`

### 5. Clean up unused imports

After removing `PlaybookContextCard` from the playbook page:
- Remove import of `PlaybookContextCard` from `@/components/shared/playbook-context-card`
- Remove imports for `AlertDialog` and related components (if delete button is fully removed)
- Remove imports for `Trash2` icon (if delete button is fully removed)
- Remove `contextProducts`, `contextProductsFallback`, `displayProducts` variable blocks
- Remove `OverallStatusBadge` local component (if header is fully removed)
- Remove `formatTimestamp` helper (if header is fully removed)

Do NOT delete the `PlaybookContextCard` component file itself yet — it may be referenced elsewhere. Just remove the import and usage from the playbook page.

### 6. Verify loading and error states

Both pages have loading skeletons and error states. Ensure these still render correctly within the `UnifiedDistrictLayout` wrapper:
- District page: existing skeleton block should map to the three zones
- Playbook page: the existing skeleton should be updated to include a `PersistentDataStrip` skeleton in Zone 1 (use the same skeleton pattern as the district page's loading state)

---

## Files Modified

| File | Action |
|------|--------|
| `src/components/district-profile/unified-district-layout.tsx` | **NEW** — shared layout wrapper |
| `src/components/district-profile/index.ts` | Add export |
| `src/app/(dashboard)/districts/[districtId]/page.tsx` | Wrap in UnifiedDistrictLayout |
| `src/app/(dashboard)/districts/[districtId]/playbooks/[playbookId]/page.tsx` | Major refactor: add yearData fetch, add PersistentDataStrip, remove PlaybookContextCard, remove page header, wrap in UnifiedDistrictLayout |

## Files NOT Modified (confirm no changes)

| File | Reason |
|------|--------|
| `src/components/district-profile/persistent-data-strip.tsx` | No prop changes needed |
| `src/components/district-profile/mode-bar.tsx` | Redesigned in CC14, not CC13 |
| `src/components/district-profile/lens-control-bar.tsx` | Absorbed in CC14, not CC13 |
| `src/components/district-profile/research-tabs.tsx` | Tab content — no change |
| `src/components/district-profile/playbook-preview-banner.tsx` | Removed in CC14, not CC13 |
| `src/components/district-profile/playbook-preview-tabs.tsx` | Removed in CC14, not CC13 |
| All tab content components | No change |
| `src/components/shared/playbook-section.tsx` | No change |
| `src/components/shared/inline-editable-block.tsx` | No change |

---

## Verification Checklist

After implementation, verify in browser:

**District profile page (`/districts/[districtId]`):**
- [ ] PersistentDataStrip renders in Zone 1 with district name, metrics, trends — identical to current
- [ ] ModeBar renders in Zone 2 — identical to current
- [ ] LensControlBar renders below ModeBar — identical to current
- [ ] ResearchTabs render in Zone 3 — identical to current
- [ ] Lens activation works (select product → augmentation blocks appear)
- [ ] Generation flow works (generate → preview banner → preview tabs)
- [ ] Loading skeleton renders three-zone structure
- [ ] Error state renders correctly
- [ ] 404 state renders correctly

**Playbook detail page (`/districts/[districtId]/playbooks/[playbookId]`):**
- [ ] PersistentDataStrip renders in Zone 1 with district name, metrics, trend arrows (from newly fetched yearData)
- [ ] ModeBar renders in Zone 2 (showing playbook context)
- [ ] PlaybookContextCard is GONE
- [ ] Custom page header (h1, status badge, timestamp) is GONE
- [ ] Playbook tabs render in Zone 3 with all six sections
- [ ] Tab switching works
- [ ] Inline editing works (click block → edit → save)
- [ ] Section regeneration works
- [ ] Loading skeleton renders three-zone structure
- [ ] Error state renders correctly
- [ ] Breadcrumbs still show correctly

**Cross-route consistency:**
- [ ] Zone 1 top edge is at the same vertical position on both pages
- [ ] Zone 3 top edge is at the same vertical position on both pages (no vertical shift between routes)
- [ ] No visible layout jump when navigating between district and playbook routes

---

## Design System Compliance

- No new design tokens required
- No hardcoded colors, spacing, or shadows
- Use existing spacing patterns from the district page (`mt-4` for mode bar, `mt-8` for tab zone)
- `UnifiedDistrictLayout` is a structural component — no visual styling beyond spacing

---

## Service Contract Impact

None. No service interfaces are modified. The only data change is adding a year-over-year fetch to the playbook page, using the existing `/api/districts/[districtId]/years` endpoint that's already contracted.

No Appendix D entry required.
