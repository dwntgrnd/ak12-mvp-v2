# P2-CC06: Playbook Generation Flow — Inline Preview with Save/Discard

**Session:** P2-S07
**Spec reference:** P2-Spec-01 §5.1 (Generation Flow), §3.3 (View States), §5.2 (Lifecycle Rules)
**Depends on:** CC04a/b (tab mapping), CC05 (lens augmentation)
**Risk:** High — cross-cutting state management change across district page, mode bar, and tab area

---

## Objective

Replace the P1 `GeneratePlaybookSheet` modal with an inline generation flow within the unified district view. When a rep triggers "Generate Playbook" with an active lens, the system generates a playbook, shows a preview in the tab area with a save/discard banner, and either commits (navigate to saved playbook route) or discards (return to lens-active district view).

---

## 1. View State Machine

Add a `viewState` to the district page that governs what renders in the tab area and banner zone.

### States

| State | Trigger | Mode Bar | Lens Bar | Tab Area | Banner |
|---|---|---|---|---|---|
| `district` | Default / lens cleared | DI active | Visible, inactive | 4 district tabs (ResearchTabs) | None |
| `district-lens` | Product selected in lens | DI active | Visible, active | 4 district tabs, augmented | None |
| `generating` | "Generate Playbook" clicked | DI active | Hidden | 6 playbook tab headers + skeleton content | Inline progress message |
| `preview` | Generation completes | DI active | Hidden | 6 playbook tabs with content (read-only) | Preview banner with name field + save/discard |

### Transitions

```
district ──[select product]──► district-lens
district-lens ──[clear product]──► district
district-lens ──[click Generate]──► generating
generating ──[all sections complete]──► preview
generating ──[generation fails]──► district-lens (toast error, lens preserved)
preview ──[click Save]──► navigate to /districts/[id]/playbooks/[newId]
preview ──[click Discard]──► district-lens (delete preview playbook, restore lens)
```

### Implementation

The district page already derives `district` vs `district-lens` from `useProductLens().isLensActive`. Add two new pieces of state:

```typescript
// New state on district page
const [generationState, setGenerationState] = useState<{
  status: 'idle' | 'generating' | 'preview';
  playbookId: string | null;      // ID of the generated preview playbook
  playbookData: Playbook | null;  // Full playbook data for preview rendering
  defaultName: string;            // Pre-filled name for save
}>({
  status: 'idle',
  playbookId: null,
  playbookData: null,
  defaultName: '',
});
```

The effective `viewState` is derived:
- `generationState.status === 'generating'` → `generating`
- `generationState.status === 'preview'` → `preview`
- `isLensActive && generationState.status === 'idle'` → `district-lens`
- `!isLensActive && generationState.status === 'idle'` → `district`

---

## 2. Generation Trigger

### Current behavior
The ModeBar has an `onGeneratePlaybook` callback that currently opens the `GeneratePlaybookSheet` modal.

### New behavior
The `onGeneratePlaybook` callback on the district page:

1. Sets `generationState.status = 'generating'`
2. Calls `POST /api/playbooks/generate` with `{ districtId, productIds: [activeProduct.productId] }`
3. Receives `{ playbookId }` in response
4. Begins polling `GET /api/playbooks/[playbookId]/status` every 2 seconds
5. When `overallStatus === 'complete'`:
   - Fetches full playbook via `GET /api/playbooks/[playbookId]`
   - Generates default name: `${district.name} · ${activeProduct.name} · ${formatDate(new Date())}`
   - Sets `generationState = { status: 'preview', playbookId, playbookData, defaultName }`
6. When `overallStatus === 'failed'`:
   - Calls `DELETE /api/playbooks/[playbookId]` to clean up
   - Sets `generationState` back to idle
   - Shows error toast: "Playbook generation failed. Please try again."
   - Lens remains active (user returns to `district-lens` state)

### Guard conditions
The "Generate Playbook" button should be disabled when:
- `!isLensActive` (no products selected)
- `generationState.status !== 'idle'` (already generating or previewing)

---

## 3. New Component: PlaybookPreviewBanner

**File:** `src/components/district-profile/playbook-preview-banner.tsx`

A fixed banner rendered above the tab area during `preview` state.

### Props

```typescript
interface PlaybookPreviewBannerProps {
  defaultName: string;
  onSave: (name: string) => void;
  onDiscard: () => void;
  saving?: boolean;  // disable buttons during save
}
```

### Layout

```
┌─────────────────────────────────────────────────────────────────────┐
│  ⚠ Playbook Preview — not yet saved                                │
│                                                                     │
│  Name: [_________________________District · Product · Feb 24, 2026] │
│                                                            [Discard] [Save Playbook] │
└─────────────────────────────────────────────────────────────────────┘
```

### Visual treatment
- Background: `bg-surface-warning/10` or a subtle amber/yellow tint (use `rgba(251,191,36,0.08)` — warm yellow at 8% opacity)
- Left border: 3px `border-l-warning` (amber)
- Consistent with the lens augmentation callout pattern but visually distinct (augmentation = orange, preview = amber/warning)
- Padding: `p-4`
- Name field: standard `BrandInput` or shadcn `Input`, full width minus label, pre-filled with `defaultName`
- Save button: `Button` default (primary), "Save Playbook"
- Discard button: `Button variant="ghost"`, "Discard"
- `⚠` indicator: Lucide `AlertTriangle` icon, `text-warning`, `h-4 w-4`

### Accessibility
- Banner has `role="status"` and `aria-live="polite"`
- Name input has `aria-label="Playbook name"`
- Save button has focus ring, is the primary action
- Discard is a secondary action, no destructive styling (it's low-stakes — the playbook was just generated)

---

## 4. New Component: PlaybookPreviewTabs

**File:** `src/components/district-profile/playbook-preview-tabs.tsx`

Renders 6 playbook tabs during `generating` and `preview` states. This is a simplified version of the playbook detail page's tab rendering — read-only, no inline editing, no regeneration.

### Props

```typescript
interface PlaybookPreviewTabsProps {
  playbook: Playbook | null;  // null during generating state
  isGenerating: boolean;       // true = show skeletons inside tabs
}
```

### Tab config
Reuse the same `TAB_CONFIG` from the playbook detail page:

```typescript
const PREVIEW_TAB_CONFIG = [
  { sectionType: 'key_themes', label: 'Key Themes' },
  { sectionType: 'stakeholder_talking_points', label: 'Stakeholder Talking Points' },
  { sectionType: 'product_fit_data', label: 'Product Fit / Data' },
  { sectionType: 'handling_objections', label: 'Handling Objections' },
  { sectionType: 'competition', label: 'Competition' },
  { sectionType: 'news', label: 'News' },
] as const;
```

### Behavior

**When `isGenerating === true` (and `playbook === null`):**
- Render all 6 tab headers (not clickable, or first tab selected)
- Tab content area shows skeleton blocks: 3-4 `Skeleton` elements of varying widths to simulate paragraphs
- Above the tab list, render a small inline progress message: `Loader2` spinner + "Generating playbook…" in `text-foreground-secondary text-sm`

**When `isGenerating === false` (and `playbook` is populated):**
- Render all 6 tab headers, first tab active by default
- Each tab content renders the section's `content` as plain text (split on `\n\n` for paragraphs, rendered as `<p>` elements with `space-y-3`)
- No `InlineEditableBlock` — preview is read-only
- No `PlaybookSection` wrapper — no regenerate button, no status dots
- Simple, clean content rendering

### Styling
- Same tab styling as `ResearchTabs` (consistent `-mb-px border-b-2` pattern)
- Content area: `pt-4` padding, `text-sm text-foreground` for body text
- Section content paragraphs: `space-y-3`

---

## 5. District Page Changes

**File:** `src/app/(dashboard)/districts/[districtId]/page.tsx`

### Remove
- `GeneratePlaybookSheet` import and JSX
- `playbookOpen` / `setPlaybookOpen` state

### Add
- `generationState` (see §1)
- `handleGeneratePlaybook` async function (see §2)
- `handleSavePlaybook` async function (see §6)
- `handleDiscardPlaybook` async function (see §7)

### Conditional rendering in the loaded state

```tsx
{/* Layer 3 — Lens Control Bar (hidden during generating/preview) */}
{generationState.status === 'idle' && (
  <LensControlBar districtId={districtId} matchSummary={matchSummary} />
)}

{/* Preview Banner (visible during preview only) */}
{generationState.status === 'preview' && (
  <PlaybookPreviewBanner
    defaultName={generationState.defaultName}
    onSave={handleSavePlaybook}
    onDiscard={handleDiscardPlaybook}
  />
)}

{/* Layer 4 — Tab Area */}
<div className="mt-8">
  {generationState.status === 'idle' ? (
    <ResearchTabs
      districtId={districtId}
      yearData={yearData}
      isLensActive={isLensActive}
      matchSummary={matchSummary}
      activeProductName={activeProduct?.name}
    />
  ) : (
    <PlaybookPreviewTabs
      playbook={generationState.playbookData}
      isGenerating={generationState.status === 'generating'}
    />
  )}
</div>
```

---

## 6. Save Flow

`handleSavePlaybook(name: string)`:

1. The playbook already exists server-side (created by `generatePlaybook`). For MVP, "save" is the act of committing it to the user's visible library. The mock service already persists on generation, so save = acknowledge + navigate.
2. Clear the lens: `clearProduct()` (from `useProductLens`)
3. Reset generation state: `setGenerationState({ status: 'idle', playbookId: null, playbookData: null, defaultName: '' })`
4. Navigate to the saved playbook: `router.push(/districts/${districtId}/playbooks/${generationState.playbookId})`

**Note for future backend work:** The MVP conflates generation with persistence. A real backend should separate "generate preview" (temporary) from "save to library" (permanent). The naming step would be part of the save API call. Flag this in a code comment.

---

## 7. Discard Flow

`handleDiscardPlaybook()`:

1. Call `DELETE /api/playbooks/${generationState.playbookId}` to clean up the generated artifact
2. Reset generation state to idle
3. Lens remains active (do NOT call `clearProduct`) — the user returns to `district-lens` state with their product selection intact

---

## 8. ModeBar Updates

**File:** `src/components/district-profile/mode-bar.tsx`

### New prop

```typescript
interface ModeBarProps {
  // ... existing props
  isPreviewActive?: boolean;  // true during generating or preview state
}
```

### Behavior when `isPreviewActive === true`
- Show a non-clickable indicator after "District Intelligence": a `Badge variant="secondary"` reading "Preview" with a subtle pulse animation during generation, solid during preview
- Disable the "Generate Playbook" / "View Playbook" / "Find Similar" action buttons (the rep is mid-flow)
- Existing playbook mode links remain visible but dimmed (`opacity-50 pointer-events-none`) — the rep shouldn't navigate away during preview without explicitly saving or discarding

---

## 9. Files to Create

| File | Type | Purpose |
|---|---|---|
| `src/components/district-profile/playbook-preview-banner.tsx` | New component | Preview banner with name field, save/discard |
| `src/components/district-profile/playbook-preview-tabs.tsx` | New component | 6-tab preview rendering (skeleton + content) |

## 10. Files to Modify

| File | Change |
|---|---|
| `src/app/(dashboard)/districts/[districtId]/page.tsx` | Add generation state machine, replace modal with inline flow, conditional tab/banner rendering |
| `src/components/district-profile/mode-bar.tsx` | Add `isPreviewActive` prop, preview indicator badge, button disable logic |
| `src/components/district-profile/index.ts` | Export new components |

## 11. Files to Leave Alone (for now)

| File | Reason |
|---|---|
| `src/components/playbook/generate-playbook-sheet.tsx` | Do NOT delete yet. It's still imported by other routes (e.g., demo pages). Remove the import and JSX from the district page only. Deletion is a cleanup task. |
| `src/components/district-profile/lens-control-bar.tsx` | No changes. Visibility controlled by district page conditional rendering. |
| `src/components/district-profile/research-tabs.tsx` | No changes. Rendered when `generationState.status === 'idle'`. |
| Playbook detail page | No changes. The preview flow generates and navigates to this page on save. |

---

## 12. Acceptance Criteria

### Generation trigger
- [ ] Clicking "Generate Playbook" on ModeBar (with active lens) starts generation
- [ ] Button is disabled when no lens is active
- [ ] Button is disabled when already generating or previewing
- [ ] Tab area switches from 4 district tabs to 6 playbook tab headers with skeleton content
- [ ] Lens control bar is hidden during generation
- [ ] Progress indicator visible ("Generating playbook…" with spinner)

### Preview state
- [ ] When generation completes, skeleton content is replaced with actual playbook content
- [ ] Preview banner appears above tab area with pre-filled name field
- [ ] Default name follows format: `[District Name] · [Product Name] · [Mon DD, YYYY]`
- [ ] Name field is editable
- [ ] All 6 tabs are navigable and display content
- [ ] Content is read-only (no inline editing)
- [ ] ModeBar shows "Preview" badge indicator
- [ ] ModeBar action buttons are disabled
- [ ] Existing playbook mode links are dimmed/disabled

### Save flow
- [ ] Clicking "Save Playbook" reads the name field value
- [ ] Lens deactivates (product cleared)
- [ ] Navigation to `/districts/[districtId]/playbooks/[newPlaybookId]`
- [ ] New playbook appears in ModeBar on the playbook detail page
- [ ] Generation state resets to idle

### Discard flow
- [ ] Clicking "Discard" deletes the preview playbook via API
- [ ] Tab area reverts to 4 district tabs with lens augmentation
- [ ] Lens remains active with the same product selection
- [ ] Lens control bar reappears
- [ ] Generation state resets to idle
- [ ] No navigation occurs

### Error handling
- [ ] If generation API call fails, show error toast and return to district-lens state
- [ ] If polling detects `overallStatus === 'failed'`, clean up and return to district-lens with toast
- [ ] If discard delete call fails, still reset UI state (fire-and-forget delete)

---

## 13. Verification Steps

After implementation, verify manually:

1. Navigate to a demo district (e.g., LAUSD: `/districts/0000000000000000000000001`)
2. Select a product in the lens control bar
3. Confirm lens augmentation blocks appear in district tabs
4. Click "Generate Playbook" in the mode bar
5. Observe: lens bar hides, tabs switch to 6 playbook headers with skeletons, spinner visible
6. Wait for generation to complete (~9-12 seconds for 6 sections in mock)
7. Observe: skeletons replaced with content, preview banner appears with name field
8. Navigate through all 6 preview tabs — confirm content renders
9. Edit the name field, then click "Save Playbook"
10. Observe: navigation to playbook detail page, playbook in mode bar, lens inactive
11. Click "District Intelligence" in mode bar to return to district view
12. Repeat steps 2-6, then click "Discard" instead of Save
13. Observe: return to lens-active district view, augmentation blocks visible, same product selected

---

## 14. Service Contract Note

**Flag for backend discussion:** The current `generatePlaybook` API creates and immediately persists the playbook. The P2 flow treats generation as producing a "preview" that the user may discard. In the mock, discard = delete. A real backend should separate:
- `POST /api/playbooks/preview` — generates a temporary preview (not in user's library)
- `POST /api/playbooks/[previewId]/save` — commits the preview with a name to the library
- Preview auto-expires after N minutes if not saved

Add a `// TODO: P2 backend — separate preview generation from save` comment near the save handler.
