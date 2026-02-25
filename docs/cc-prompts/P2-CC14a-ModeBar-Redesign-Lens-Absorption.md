# P2-CC14a: Mode Bar Redesign + LensControlBar Absorption

**Created:** 2026-02-25  
**Spec:** P2-Spec-02 (Unified Page Architecture), Sections 2.2, 3.1–3.4, 4.1  
**Session:** P2-S10  
**Depends on:** CC13 (committed)  
**Risk:** Medium. Component redesign + removal of LensControlBar. Does NOT touch generation flow.

---

## Objective

Redesign `ModeBar` from a tab-style navigation component into a persistent state indicator with integrated lens picker. Absorb `LensControlBar` into the redesigned Mode Bar. Support three of the four visual modes (Neutral, Lens, Playbook). Preview mode is deferred to CC14b.

**This prompt does NOT modify generation flow, PlaybookPreviewBanner, PlaybookPreviewTabs, or any generation state logic.**

---

## Context

### Current ModeBar behavior
- Renders as a tab-style navigation bar with links to district route + playbook routes
- Fetches district playbooks via `useDistrictPlaybooks` hook
- Right side has "Find Similar Districts" and conditional "Generate Playbook" / "View Playbook" buttons
- Receives `activeMode: 'district' | string` (playbookId) to highlight active tab
- Has `isPreviewActive` prop that disables playbook links and shows preview badge

### Current LensControlBar behavior
- Renders below ModeBar on district page only
- Contains product selector dropdown (Select component) with `useProductLens` and `useLibraryReadiness` hooks
- Shows fit indicator (match tier badge + headline) when lens is active
- Hidden during generation (conditional render in district page based on `generationState.status === 'idle'`)

### What the redesigned ModeBar must do
- **Left region:** Show current mode as a state indicator (not tab navigation)
- **Center-left:** Contain the lens picker (absorbed from LensControlBar)
- **Right region:** Show context-sensitive actions per mode
- **Visual treatment:** Distinct appearance per mode (Neutral, Lens, Playbook)
- **Self-contained:** ModeBar owns lens picker state display and mode derivation internally via hooks

---

## Tasks

### 1. Redesign `ModeBar` component

**File:** `src/components/district-profile/mode-bar.tsx` — full rewrite

**New interface:**

```tsx
interface ModeBarProps {
  districtId: string;
  districtName: string;
  // Mode derivation inputs
  activePlaybookId?: string;           // truthy → Playbook mode
  activePlaybookName?: string;         // display name for playbook mode
  activePlaybookStatus?: string;       // 'complete' | 'partial' | 'generating'
  // Generation flow (passed through, used in CC14b)
  isPreviewActive?: boolean;           // CC14b will use this for Preview mode
  onGeneratePlaybook?: () => void;     // CC14b wires this to Preview trigger
  // Match context
  matchSummary?: MatchSummary | null;
  // Playbook management (CC15)
  onManagePlaybook?: () => void;       // CC15 wires this to Workflow Drawer
}
```

**Mode derivation logic** (inside the component):

```
const { isLensActive, activeProduct } = useProductLens();

let mode: 'neutral' | 'lens' | 'playbook';
if (activePlaybookId) {
  mode = 'playbook';
} else if (isLensActive) {
  mode = 'lens';
} else {
  mode = 'neutral';
}
```

Note: Preview mode (`isPreviewActive`) is acknowledged in the interface but NOT handled in CC14a. It will fall through to the lens or neutral branch. CC14b adds the fourth mode.

**Layout structure:**

```
┌──────────────────────────────────────────────────────────────┐
│  [Mode Indicator]  [Lens Picker ▾]  [Fit Badge]  [Actions]  │
└──────────────────────────────────────────────────────────────┘
```

Height: `h-12` (48px). Single row. `flex items-center justify-between`. Border-bottom for all modes.

**Left region — Mode Indicator:**

- **Neutral:** Text "District Intelligence" in `text-sm font-semibold text-foreground`.
- **Lens:** Text "[Product Name] Lens" in `text-sm font-semibold` with mode accent color. Include a dismiss button (× icon, `h-4 w-4`) that calls `clearProduct()` from `useProductLens`. The dismiss button returns to Neutral.
- **Playbook:** Text "Playbook: [activePlaybookName]" in `text-sm font-semibold` with playbook accent color. Include a link back to district route ("← District" or a small "Back to District" link).

**Center — Lens Picker:**

Move the lens picker from `LensControlBar` into the Mode Bar. Use `useProductLens` and `useLibraryReadiness` hooks (same as current LensControlBar).

- **Neutral and Lens modes:** Render the product Select dropdown. Trigger width: `w-56` (slightly narrower than current `w-72` to fit within Mode Bar). Same `handleValueChange` logic with `__clear__` sentinel.
- **Playbook mode:** Hide the lens picker entirely. The playbook has a fixed product context.

**Center-right — Fit Indicator:**

When lens is active and `matchSummary` is provided, show the match tier badge and headline (same rendering as current LensControlBar right side). In Neutral or Playbook mode, hide this.

**Right region — Actions:**

- **Neutral:** "Generate Playbook" button, disabled (no lens active). Use `Button` size="sm".
- **Lens:** "Generate Playbook" button, enabled. Calls `onGeneratePlaybook`. Label: "Generate [Product Name] Playbook" if space allows, otherwise "Generate Playbook".
- **Playbook:** "Manage Playbook" button. Calls `onManagePlaybook`. Use `Button` variant="outline" size="sm". (CC15 wires this to the Workflow Drawer. For now, the callback can be a no-op or undefined.)

**"Find Similar Districts" button:** Remove from Mode Bar. This is a secondary action that doesn't belong in the primary mode indicator. It can be relocated in a future iteration (possibly in the Identity Zone or as a contextual action). Removing it reduces Mode Bar clutter and keeps focus on mode state.

### 2. Visual mode treatments

Add mode-specific visual treatments to the Mode Bar container div.

**Neutral mode:**
- Background: default (`bg-transparent` or `bg-background`)
- Border-bottom: `border-b border-border-default`
- No accent color

**Lens mode:**
- Background: subtle accent wash — `bg-brand-blue/5` (very light teal tint using brand blue)
- Border-bottom: `border-b-2 border-brand-blue/40`
- Mode indicator text uses `text-brand-blue` (or a semantic alias if one exists)

**Playbook mode:**
- Background: subtle accent wash — `bg-brand-green/5` (very light green tint)
- Border-bottom: `border-b-2 border-brand-green/40`
- Mode indicator text uses `text-brand-green` (or adjust if contrast is insufficient — verify against WCAG AA on the background)

**Accessibility check:** Verify that mode indicator text colors meet WCAG 2.1 AA contrast ratio (4.5:1 for normal text) against the background wash. If `brand-blue` or `brand-green` are too light on their respective wash backgrounds, use `brand-deepBlue` or a darker variant. The token editor at `/dev` can help test this in real-time.

**Token additions** (add to `src/lib/design-tokens.ts`):

```tsx
export const modeColors = {
  neutral: {
    bg: '',
    border: 'border-border-default',
    text: 'text-foreground',
    label: 'District Intelligence',
  },
  lens: {
    bg: 'bg-[#03C4D4]/5',
    border: 'border-[#03C4D4]/40',
    text: 'text-[#1E698F]',  // deepBlue for contrast
    label: 'Lens',
  },
  playbook: {
    bg: 'bg-[#00DE9C]/5',
    border: 'border-[#00DE9C]/40',
    text: 'text-[#0A7A5A]',  // darker green for contrast — derive or hardcode
    label: 'Playbook',
  },
} as const;

export type ModeKey = keyof typeof modeColors;
```

**Note:** These are starting values. Use the token editor at `/dev` to validate contrast and feel. The exact hex values for text colors may need adjustment. Prefer semantic aliases if they exist in the CSS custom properties; fall back to direct hex if not.

### 3. Update district profile page

**File:** `src/app/(dashboard)/districts/[districtId]/page.tsx`

**Changes:**
- Remove `LensControlBar` from the `modeBarZone` slot in `UnifiedDistrictLayout`
- Remove `LensControlBar` import
- Update `ModeBar` props to new interface:
  - Remove: `activeMode`, `activeProductName` (ModeBar now derives these internally via hooks)
  - Add: `matchSummary={matchSummary}`, `onGeneratePlaybook={handleGeneratePlaybook}`
  - Keep: `districtId`, `districtName`, `isPreviewActive` (CC14b uses this)
- The `LensControlBar`'s conditional hide during generation (`generationState.status === 'idle'`) is no longer needed — the Mode Bar handles lens picker visibility internally based on mode

**Important:** Keep `PlaybookPreviewBanner` in the `modeBarZone` for now. CC14b removes it. The district page should still render:
```tsx
modeBarZone={
  <>
    <ModeBar
      districtId={districtId}
      districtName={district.name}
      matchSummary={matchSummary}
      onGeneratePlaybook={handleGeneratePlaybook}
      isPreviewActive={isPreviewActive}
    />
    {generationState.status === 'preview' && (
      <PlaybookPreviewBanner ... />
    )}
  </>
}
```

### 4. Update playbook detail page

**File:** `src/app/(dashboard)/districts/[districtId]/playbooks/[playbookId]/page.tsx`

**Changes:**
- Update `ModeBar` props to new interface:
  - Remove: `activeMode`, `onGeneratePlaybook`, `activeProductName`
  - Add: `activePlaybookId={playbookId}`, `activePlaybookName={playbook.productNames.join(' · ')}`, `activePlaybookStatus={overallStatus}`
  - Keep: `districtId`, `districtName`

### 5. Remove `LensControlBar` component

**File:** `src/components/district-profile/lens-control-bar.tsx` — **DELETE**

**File:** `src/components/district-profile/index.ts` — Remove `LensControlBar` export

### 6. Remove `DistrictIdentityBar` component (cleanup)

This P1 component is exported but unused (superseded by `PersistentDataStrip`). Clean it up now.

**File:** `src/components/district-profile/district-identity-bar.tsx` — **DELETE**

**File:** `src/components/district-profile/index.ts` — Remove `DistrictIdentityBar` export

### 7. Update barrel exports

**File:** `src/components/district-profile/index.ts`

After removals, the export list should include:
- `PersistentDataStrip`
- `DistrictChart`
- `ResearchTabs`
- `ResearchBrief`
- `ModeBar`
- `GoalsFundingTab`
- `AcademicPerformanceTab`
- `CompetitiveIntelTab`
- `NewsStubTab`
- `SourceCitation`
- `LensAugmentationBlock`
- `PlaybookPreviewBanner` (removed in CC14b)
- `PlaybookPreviewTabs` (removed in CC14b)
- `UnifiedDistrictLayout`

Removed:
- `LensControlBar`
- `DistrictIdentityBar`

---

## Files Modified

| File | Action |
|------|--------|
| `src/components/district-profile/mode-bar.tsx` | **REWRITE** — redesigned Mode Bar |
| `src/lib/design-tokens.ts` | Add `modeColors` token object |
| `src/app/(dashboard)/districts/[districtId]/page.tsx` | Update ModeBar props, remove LensControlBar usage |
| `src/app/(dashboard)/districts/[districtId]/playbooks/[playbookId]/page.tsx` | Update ModeBar props |
| `src/components/district-profile/index.ts` | Remove LensControlBar + DistrictIdentityBar exports |
| `src/components/district-profile/lens-control-bar.tsx` | **DELETE** |
| `src/components/district-profile/district-identity-bar.tsx` | **DELETE** |

## Files NOT Modified

| File | Reason |
|------|--------|
| `src/components/district-profile/playbook-preview-banner.tsx` | Removed in CC14b |
| `src/components/district-profile/playbook-preview-tabs.tsx` | Removed in CC14b |
| `src/components/district-profile/unified-district-layout.tsx` | No change |
| `src/components/district-profile/persistent-data-strip.tsx` | No change |
| All tab content components | No change |
| Generation state logic in district page | No change — CC14b handles this |

---

## Verification Checklist

**District profile page — Neutral mode (`/districts/[districtId]`, no lens active):**
- [ ] Mode Bar shows "District Intelligence" label, no accent treatment
- [ ] Lens picker dropdown is visible and functional in Mode Bar
- [ ] "Generate Playbook" button is visible but disabled (no lens)
- [ ] No LensControlBar rendered anywhere (it's gone)
- [ ] Selecting a product in lens picker → transitions to Lens mode

**District profile page — Lens mode (product selected):**
- [ ] Mode Bar shows "[Product Name] Lens" with teal/blue accent treatment
- [ ] Mode Bar background has subtle teal wash
- [ ] Dismiss button (×) clears lens → returns to Neutral
- [ ] "Generate Playbook" button is enabled
- [ ] Fit indicator (match tier badge + headline) appears in Mode Bar when match data exists
- [ ] Lens picker shows current product selected, allows switching

**District profile page — Generation flow (existing, not modified):**
- [ ] Clicking "Generate Playbook" triggers generation (same as before)
- [ ] PlaybookPreviewBanner still appears below Mode Bar during preview state
- [ ] PlaybookPreviewTabs still render in tab zone during generation/preview
- [ ] Save navigates to playbook route
- [ ] Discard returns to lens mode

**Playbook detail page — Playbook mode (`/districts/[districtId]/playbooks/[playbookId]`):**
- [ ] Mode Bar shows "Playbook: [Product Names]" with green accent treatment
- [ ] Mode Bar background has subtle green wash
- [ ] Lens picker is hidden
- [ ] "Manage Playbook" button is visible (no-op for now, CC15 wires it)
- [ ] Link back to district route is visible and functional
- [ ] Tab content renders correctly (all six playbook sections)
- [ ] Inline editing still works

**Visual treatment verification:**
- [ ] Three modes are visually distinct from each other
- [ ] Mode indicator text passes WCAG AA contrast against its background
- [ ] Mode transitions (Neutral ↔ Lens) are immediate with no layout shift
- [ ] Mode Bar height stays consistent (48px) across all modes

**Regression checks:**
- [ ] Breadcrumbs still work on both routes
- [ ] Year-over-year trend arrows display on playbook page (CC13 addition)
- [ ] No console errors or TypeScript compilation errors

---

## Design System Compliance

- New `modeColors` token object follows the same pattern as `matchTierColors`
- No hardcoded colors in component JSX — all colors reference tokens or Tailwind classes from tokens
- Lens picker reuses existing shadcn `Select` component — no new primitives
- Mode indicator uses existing `Badge` component for status badges in Playbook mode
- Dismiss button (×) uses `lucide-react` `X` icon, consistent with existing patterns

---

## Service Contract Impact

None. No service interfaces modified. ModeBar now calls `useProductLens` and `useLibraryReadiness` hooks directly (same hooks that LensControlBar used). No new API calls introduced.

No Appendix D entry required.
