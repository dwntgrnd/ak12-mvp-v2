# P2-CC14b: Preview Mode + Generation Flow Rewiring

**Created:** 2026-02-25  
**Spec:** P2-Spec-02 (Unified Page Architecture), Sections 2.2, 3.3, 4.1, 4.3, 5.3–5.5  
**Session:** P2-S10  
**Depends on:** CC14a (committed)  
**Risk:** Medium. Generation flow rewiring — behavioral changes to an existing state machine's UI surface.

---

## Objective

Add Preview as the fourth visual mode in ModeBar. Move Save/Discard actions from `PlaybookPreviewBanner` into the ModeBar right region. Apply Preview-specific visual treatment. Remove `PlaybookPreviewBanner` and its component file. The generation state machine logic in the district page is NOT modified — only where its UI renders.

---

## Context

### Current generation flow (after CC14a)
1. User clicks "Generate Playbook" in ModeBar (Lens mode) → `handleGeneratePlaybook` fires
2. `generationState.status` transitions: `idle` → `generating` → `preview`
3. During generating/preview, `isPreviewActive` is `true` (passed to ModeBar, disables lens picker)
4. `PlaybookPreviewBanner` appears below ModeBar (in `modeBarZone`) during `preview` status — has name input + Save/Discard buttons
5. `PlaybookPreviewTabs` replace `ResearchTabs` in tab zone during generating/preview
6. Save calls `handleSavePlaybook(name)` → clears lens → navigates to playbook route
7. Discard calls `handleDiscardPlaybook()` → deletes playbook → returns to lens mode

### What CC14b changes
- ModeBar gains a fourth mode: `preview` (between `lens` and `playbook` in the derivation)
- ModeBar renders Save/Discard in right region during Preview — no name input (auto-generated default per resolved spec decision)
- `PlaybookPreviewBanner` is removed entirely
- `handleSavePlaybook` signature simplified — no longer takes a name parameter, uses `generationState.defaultName` internally
- `PlaybookPreviewTabs` continues to render in tab zone (no change to tab content)

---

## Tasks

### 1. Update ModeBar — add Preview mode

**File:** `src/components/district-profile/mode-bar.tsx`

**New props needed (add to existing interface):**

```tsx
// Add to ModeBarProps:
generationStatus?: 'idle' | 'generating' | 'preview';  // generation state for Preview mode
onSavePlaybook?: () => void;     // Save action for Preview mode
onDiscardPlaybook?: () => void;  // Discard action for Preview mode
```

**Updated mode derivation:**

```tsx
let mode: ModeKey | 'preview';
if (activePlaybookId) {
  mode = 'playbook';
} else if (isPreviewActive && (generationStatus === 'generating' || generationStatus === 'preview')) {
  mode = 'preview';
} else if (isLensActive) {
  mode = 'lens';
} else {
  mode = 'neutral';
}
```

Note: `'preview'` is not currently in the `ModeKey` type. Either extend the type or handle preview separately. Recommended: extend `modeColors` in design-tokens to include `preview`, then `ModeKey` includes it automatically.

**Preview mode — Left region (Mode Indicator):**
- Generating sub-state (`generationStatus === 'generating'`): Label "Generating Preview…" with an animated indicator (spinner icon or pulsing badge). Use `Loader2` icon from lucide-react with `animate-spin`.
- Review sub-state (`generationStatus === 'preview'`): Label "Preview: [Product Name]" with an "Unsaved" badge. Badge uses warm/amber treatment.

**Preview mode — Center (Lens Picker):**
- Hidden or disabled. Same as current `isPreviewActive` behavior (already disabled in CC14a).

**Preview mode — Right region (Actions):**
- Generating sub-state: Save button disabled, Discard button enabled (user can cancel during generation).
- Review sub-state: **Save** button (primary, `size="sm"`) and **Discard** button (`variant="ghost"`, `size="sm"`). No name input — Save uses the auto-generated default name.
- Save calls `onSavePlaybook`. Discard calls `onDiscardPlaybook`.

**Preview mode — Visual treatment:**

Add to the container div's className:
```tsx
mode === 'preview' && 'border-b-2 border-dashed border-[#FFC205]/50 bg-[#FFC205]/5'
```

The dashed border conveys impermanence. The warm gold/amber tone distinguishes it from the teal (Lens) and green (Playbook) treatments.

### 2. Add Preview to design tokens

**File:** `src/lib/design-tokens.ts`

Add `preview` to `modeColors`:

```tsx
preview: {
  bg: 'bg-[#FFC205]/5',
  border: 'border-[#FFC205]/50',
  text: 'text-[#92710A]',  // darkened gold for contrast
  label: 'Preview',
},
```

The `ModeKey` type (derived from `keyof typeof modeColors`) will automatically include `'preview'`.

### 3. Update district profile page — wire Preview mode

**File:** `src/app/(dashboard)/districts/[districtId]/page.tsx`

**3a. Simplify `handleSavePlaybook`:**

Change the signature from `(name: string) => void` to `() => void`. Remove the `name` parameter. The function already has access to `generationState.defaultName` — in MVP it doesn't use the name anyway (the `void name` line confirms this). The simplified version:

```tsx
const handleSavePlaybook = useCallback(() => {
  const { playbookId } = generationState;
  if (!playbookId) return;
  clearProduct();
  setGenerationState(INITIAL_GENERATION_STATE);
  router.push(`/districts/${districtId}/playbooks/${playbookId}`);
}, [generationState, clearProduct, districtId, router]);
```

**3b. Update ModeBar props:**

Add new props:
```tsx
<ModeBar
  districtId={districtId}
  districtName={district.name}
  matchSummary={matchSummary}
  onGeneratePlaybook={handleGeneratePlaybook}
  isPreviewActive={isPreviewActive}
  generationStatus={generationState.status}
  onSavePlaybook={handleSavePlaybook}
  onDiscardPlaybook={handleDiscardPlaybook}
/>
```

**3c. Remove `PlaybookPreviewBanner` from modeBarZone:**

The `modeBarZone` slot becomes just the ModeBar — no more conditional banner:

```tsx
modeBarZone={
  <ModeBar
    districtId={districtId}
    districtName={district.name}
    matchSummary={matchSummary}
    onGeneratePlaybook={handleGeneratePlaybook}
    isPreviewActive={isPreviewActive}
    generationStatus={generationState.status}
    onSavePlaybook={handleSavePlaybook}
    onDiscardPlaybook={handleDiscardPlaybook}
  />
}
```

**3d. Remove `PlaybookPreviewBanner` import.**

**3e. Tab zone rendering — no change.** The existing conditional (`generationState.status === 'idle' ? ResearchTabs : PlaybookPreviewTabs`) continues to work correctly. Preview mode's tab content is already handled.

### 4. Delete `PlaybookPreviewBanner` component

**File:** `src/components/district-profile/playbook-preview-banner.tsx` — **DELETE**

**File:** `src/components/district-profile/index.ts` — Remove `PlaybookPreviewBanner` export

### 5. Update barrel exports

**File:** `src/components/district-profile/index.ts`

Remove: `PlaybookPreviewBanner`

Keep: `PlaybookPreviewTabs` (still used in district page tab zone for Preview mode content rendering)

---

## Files Modified

| File | Action |
|------|--------|
| `src/components/district-profile/mode-bar.tsx` | Add Preview mode (fourth mode), Save/Discard in right region |
| `src/lib/design-tokens.ts` | Add `preview` to `modeColors` |
| `src/app/(dashboard)/districts/[districtId]/page.tsx` | Simplify save handler, add new ModeBar props, remove PlaybookPreviewBanner |
| `src/components/district-profile/index.ts` | Remove PlaybookPreviewBanner export |
| `src/components/district-profile/playbook-preview-banner.tsx` | **DELETE** |

## Files NOT Modified

| File | Reason |
|------|--------|
| `src/components/district-profile/playbook-preview-tabs.tsx` | Still used for Preview mode tab content. Will be unified into shared tab container in a future pass if warranted. |
| `src/app/(dashboard)/districts/[districtId]/playbooks/[playbookId]/page.tsx` | No change — Playbook mode is already handled by CC14a |
| Generation state machine logic | NOT modified. Only the UI rendering surface changes. |
| `src/components/district-profile/unified-district-layout.tsx` | No change |
| All tab content components | No change |

---

## Verification Checklist

**Preview mode — Generating sub-state:**
- [ ] Click "Generate Playbook" from Lens mode
- [ ] ModeBar immediately transitions to Preview treatment (dashed amber border, warm background)
- [ ] Mode indicator shows "Generating Preview…" with spinner
- [ ] Lens picker is disabled
- [ ] Save button is disabled, Discard button is enabled
- [ ] Tab zone switches to PlaybookPreviewTabs with skeleton states
- [ ] `PlaybookPreviewBanner` does NOT appear anywhere

**Preview mode — Review sub-state (generation complete):**
- [ ] Mode indicator changes to "Preview: [Product Name]" with "Unsaved" badge
- [ ] Spinner stops
- [ ] Save button becomes enabled
- [ ] Discard button remains enabled
- [ ] Tab zone shows populated playbook content (read-only, no inline editing)

**Save flow:**
- [ ] Click Save → navigates to `/districts/[districtId]/playbooks/[playbookId]`
- [ ] Lens is cleared
- [ ] Playbook page renders in Playbook mode (green treatment from CC14a)
- [ ] ModeBar shows "Playbook: [Product Names]"

**Discard flow:**
- [ ] Click Discard → returns to Lens mode
- [ ] ModeBar returns to teal/blue Lens treatment
- [ ] Lens picker re-enables with same product selected
- [ ] Tab zone returns to ResearchTabs with lens augmentation
- [ ] No playbook persisted (or deleted if MVP had already persisted it)

**Discard during generation:**
- [ ] Click Discard while still in generating sub-state
- [ ] Generation aborts, returns to Lens mode cleanly
- [ ] No errors in console

**Visual treatment verification:**
- [ ] Preview mode is visually distinct from Neutral, Lens, and Playbook
- [ ] Dashed border conveys impermanence (not solid like Lens/Playbook)
- [ ] Amber/gold tone is warm and distinct from teal (Lens) and green (Playbook)
- [ ] Mode indicator text meets WCAG AA contrast on amber background wash
- [ ] Four modes form a clear visual progression: none → teal → amber-dashed → green

**Regression checks:**
- [ ] Neutral mode still works (no lens, Mode Bar default treatment)
- [ ] Lens switching still works (select/clear product)
- [ ] Playbook route still renders correctly with green treatment
- [ ] Breadcrumbs unaffected
- [ ] No TypeScript compilation errors
- [ ] No console errors

---

## Design System Compliance

- Preview mode uses `brand-gold` (#FFC205) from existing brand palette — no new colors invented
- Text contrast color (#92710A) needs WCAG AA verification against `bg-[#FFC205]/5` — use token editor at `/dev` to validate
- Dashed border pattern (`border-dashed`) is a standard Tailwind utility — no custom CSS needed
- Save/Discard buttons use existing `Button` variants (primary + ghost)
- `Loader2` spinner icon is already used in `PlaybookPreviewTabs` — consistent pattern

---

## Service Contract Impact

None. No service interfaces modified. The save and discard flows use the same API calls as before — only the UI trigger location has moved from `PlaybookPreviewBanner` to `ModeBar`.

No Appendix D entry required.
