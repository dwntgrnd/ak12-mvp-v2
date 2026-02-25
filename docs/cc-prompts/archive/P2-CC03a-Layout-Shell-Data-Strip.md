# P2-CC03a — Layout Shell + Data Strip Refactor

**Scope:** Restructure the district page into the four-layer unified view skeleton. Refactor `DistrictIdentityBar` into a pure `PersistentDataStrip`.

**Before starting:** Read `CLAUDE.md` and the P2 spec at `Specs/P2-Spec-01_Unified-View-Architecture.md` (Obsidian vault). Focus on §3.2 (View Layers) and §3.4 (Persistent Data Strip).

**Depends on:** CC02 (route scaffolding) complete.

---

## Context

The current district page (`src/app/(dashboard)/districts/[districtId]/page.tsx`) renders two zones: an identity bar and research tabs. The P2 unified view requires four stacked layers: persistent data strip → mode bar → lens control bar → tab area. This prompt restructures the page layout and refactors the identity bar into a focused data strip. Mode bar and lens bar are placeholder slots for CC03b and CC03c.

---

## Deliverables

### 1. Refactor `DistrictIdentityBar` → `PersistentDataStrip`

Create `src/components/district-profile/persistent-data-strip.tsx`. This is a **narrower** version of the current identity bar — metrics display only.

**Keep in the data strip:**
- District name (h1)
- Save/bookmark toggle
- Contact info row (superintendent, phone, address)
- Metrics strip (grades served, enrollment, ELA proficiency, FRPM, SPED with trends)
- Match tier badge (when lens is active — passed as prop)

**Remove from the data strip (these move to mode bar and lens bar in CC03b/CC03c):**
- "Find Similar Districts" button
- "Generate Playbook" / "View Playbook" button
- The `useDistrictPlaybookStatus` hook call
- The `useRouter` import (no longer needed if buttons are removed)

**Props interface:**
```typescript
interface PersistentDataStripProps {
  district: DistrictProfile;
  yearData: DistrictYearData[];
  matchSummary?: MatchSummary | null;
  activeProductName?: string;
}
```

No `onGeneratePlaybook` callback — that moves to the mode bar / lens bar.

**Do NOT delete `district-identity-bar.tsx` yet.** The nested playbook page from CC02 may still reference it indirectly. Just stop importing it from the district page. It can be cleaned up later.

### 2. Restructure district page layout

Update `src/app/(dashboard)/districts/[districtId]/page.tsx` to render the four-layer structure:

```tsx
{/* Layer 1 — Persistent Data Strip */}
<PersistentDataStrip
  district={district}
  yearData={yearData}
  matchSummary={matchSummary}
  activeProductName={activeProduct?.name}
/>

{/* Layer 2 — Mode Bar (CC03b placeholder) */}
<div id="mode-bar-slot" />

{/* Layer 3 — Lens Control Bar (CC03c placeholder) */}
<div id="lens-bar-slot" />

{/* Layer 4 — Tab Area */}
<ResearchTabs districtId={districtId} yearData={yearData} />
```

The placeholder divs render nothing visible — they're structural markers for the next prompts. No `display:none` or `hidden` — just empty divs that take no space.

**Temporarily park the displaced buttons.** The "Generate Playbook" and "Find Similar Districts" buttons need to live somewhere until CC03b builds the mode bar. Options (pick whichever is simplest):
- Move them into the `pageActions` slot in the breadcrumb bar via `setPageActions()`
- Or place them in a temporary row between the data strip and mode bar slot

The goal is to not lose functionality during the transition. These buttons will move to their final homes in CC03b.

### 3. Update barrel export

In `src/components/district-profile/index.ts`, add:
```typescript
export { PersistentDataStrip } from './persistent-data-strip';
```

Keep the `DistrictIdentityBar` export — it's still referenced by the nested playbook page.

---

## What NOT to change

- Do not modify the nested playbook page (`districts/[districtId]/playbooks/[playbookId]/page.tsx`)
- Do not modify `ResearchTabs` or any tab content components
- Do not modify the product lens hook or app shell context
- Do not change routing or breadcrumbs

---

## Verification checklist

- [ ] `npm run build` compiles clean
- [ ] District page renders: data strip (name, metrics, contact, save toggle) → empty slots → research tabs
- [ ] "Generate Playbook" and "Find Similar Districts" buttons are still accessible somewhere on the page
- [ ] Match tier badge still appears when product lens is active
- [ ] Metrics trends still display correctly
- [ ] Save/bookmark toggle still works
- [ ] No visual regression on the research tabs area
- [ ] `DistrictIdentityBar` still exported and available (not broken for other consumers)
- [ ] No TypeScript errors
