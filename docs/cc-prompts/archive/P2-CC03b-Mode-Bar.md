# P2-CC03b — Mode Bar

**Scope:** Build the mode bar component. Fetch district playbooks, render mode entries, wire navigation. Relocate action buttons.

**Before starting:** Read `CLAUDE.md` and the P2 spec at `Specs/P2-Spec-01_Unified-View-Architecture.md` (Obsidian vault). Focus on §3.5 (Mode Bar) and §3.3 (View States).

**Depends on:** CC03a (layout shell + data strip) complete.

---

## Context

The mode bar is the second layer in the unified view. It shows the available "modes" for the current district: "District Intelligence" (always present, always first) plus one entry per saved playbook. Clicking a mode navigates to the corresponding route. The bar also houses action buttons displaced from the identity bar in CC03a.

---

## Deliverables

### 1. Create `ModeBar` component

Create `src/components/district-profile/mode-bar.tsx`.

**Data fetching:**
- Use the existing `useDistrictPlaybookStatus` hook (`src/hooks/use-district-playbook-status.ts`) — but it currently only returns `existingPlaybookId` (most recent) and `existingCount`. The mode bar needs a **list** of all playbooks for the district (name + ID).
- Extend the hook or create a new `useDistrictPlaybooks` hook that calls `/api/districts/[districtId]/playbooks` and returns the full list: `{ playbookId, productNames, generatedAt }[]`. The existing API already returns this data.

**Mode bar layout:**

```
┌────────────────────────────────────────────────────────────────────┐
│  [District Intelligence]  [Playbook 1]  [Playbook 2]  │  [Actions]│
└────────────────────────────────────────────────────────────────────┘
```

- **Left side:** Mode entries as horizontal tabs/pills.
  - "District Intelligence" — always first. Links to `/districts/[districtId]`.
  - Each saved playbook — labeled by product names (e.g., "MathPro · ReadingPlus"). Links to `/districts/[districtId]/playbooks/[playbookId]`.
  - Active state: visual indicator on the currently active mode based on the current URL.
- **Right side:** Action buttons (relocated from identity bar):
  - "Find Similar Districts" (`variant="outlineBrand"`)
  - "Generate Playbook" / "View Playbook" (primary action — `variant="default"`)

**Props interface:**
```typescript
interface ModeBarProps {
  districtId: string;
  districtName: string;
  activeMode: 'district' | string; // 'district' or a playbookId
  onGeneratePlaybook: () => void;
  activeProductName?: string;
}
```

**Active mode detection:**
- The parent page determines the active mode from the URL and passes it as a prop.
- District page passes `activeMode="district"`.
- Nested playbook page passes `activeMode={playbookId}`.

**Styling guidance:**
- Background: `bg-surface-raised` or `bg-surface-page` — visually distinct from the data strip above and tab area below.
- Border: `border-b border-border-default` to separate from content below.
- Mode entries: use a tab-like pattern. Active mode gets `border-b-2 border-primary` or equivalent active indicator. Inactive modes use `text-foreground-secondary`.
- Height: compact — similar to a tab bar, not a full toolbar. The mode bar should not be tall.
- Contained within `max-w-layout` to match content width (the parent page layout already provides this).

**Loading state:** While playbooks are loading, show "District Intelligence" immediately (it's always present) with a small skeleton for the playbook slots.

**Empty state:** If no playbooks exist, only "District Intelligence" shows. No empty message needed.

**MVP cap:** If a district has many playbooks, show up to 5 in the bar. Overflow handling is deferred (backlog item B-12).

### 2. Wire `ModeBar` into district page

Update `src/app/(dashboard)/districts/[districtId]/page.tsx`:

- Replace the `id="mode-bar-slot"` placeholder with `<ModeBar />`.
- Pass the required props. `activeMode="district"` for the district page.
- Move the `GeneratePlaybookSheet` trigger and "Find Similar Districts" logic into the mode bar (or keep the sheet in the page and pass `onGeneratePlaybook` down).
- Remove the temporarily parked buttons from CC03a (wherever they were placed).

### 3. Wire `ModeBar` into nested playbook page

Update `src/app/(dashboard)/districts/[districtId]/playbooks/[playbookId]/page.tsx`:

- Add `<ModeBar />` between the data strip and the playbook tabs.
- Pass `activeMode={playbookId}`.
- This requires the nested playbook page to also render a `PersistentDataStrip` at the top — it currently renders the full P1 playbook detail layout. **For this prompt, add the ModeBar only.** The full unified layout for the playbook page (data strip + mode bar + playbook tabs) is a follow-up if the nested page doesn't already have the data strip.

**If the nested playbook page still uses the old full-page layout from CC02:** Don't restructure the entire page in this prompt. Just insert the ModeBar above the existing playbook content. The playbook page will be fully unified in a later pass.

### 4. Update barrel export

In `src/components/district-profile/index.ts`, add:
```typescript
export { ModeBar } from './mode-bar';
```

### 5. Clean up `useDistrictPlaybookStatus` or create new hook

If you create a new `useDistrictPlaybooks` hook:
- Place it in `src/hooks/use-district-playbooks.ts`
- Return type: `{ loading: boolean; playbooks: Array<{ playbookId: string; productNames: string[]; generatedAt: string }> }`
- The existing `useDistrictPlaybookStatus` can remain for now (other components may use it). Consolidation is a future cleanup.

---

## What NOT to change

- Do not modify `PersistentDataStrip` (built in CC03a)
- Do not modify `ResearchTabs` or tab content components
- Do not modify breadcrumbs or routing (CC02 handles this)
- Do not modify the product lens hook

---

## Verification checklist

- [ ] `npm run build` compiles clean
- [ ] District page renders: data strip → **mode bar** → lens bar slot → research tabs
- [ ] Mode bar shows "District Intelligence" as active on the district page
- [ ] Mode bar shows saved playbooks for the district (if any exist)
- [ ] Clicking a playbook in the mode bar navigates to `/districts/[districtId]/playbooks/[playbookId]`
- [ ] Clicking "District Intelligence" from a playbook page navigates to `/districts/[districtId]`
- [ ] "Find Similar Districts" and "Generate Playbook" buttons are in the mode bar
- [ ] Active mode has visual indicator
- [ ] Mode bar loads without blocking the rest of the page (playbook list loading is independent)
- [ ] No TypeScript errors
