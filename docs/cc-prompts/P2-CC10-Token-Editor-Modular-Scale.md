# P2-CC10: Token Editor — Modular Type Scale Controls

**Session:** P2-S08
**Depends on:** CC09 (token editor must be built and working)
**Risk:** Low — adds one control group to the existing editor. No changes to app components.
**Touches:** `src/components/dev/token-editor/` only

---

## Objective

Add a modular type scale control group to the token editor. Two controls — **base size** (slider) and **scale ratio** (dropdown) — that recalculate all `--font-size-*` CSS variables using the formula `size = base × ratio^step`. Every text element on the page reflows in real time as the user adjusts either control.

---

## 1. Scale Mathematics

The modular scale formula:

```
fontSize(step) = baseSize × ratio^step
```

### Step mapping (derived from current globals.css):

| CSS Variable | Step | Current multiplier | Role |
|---|---|---|---|
| `--font-size-overline` | -2 | 0.786× | Overline labels |
| `--font-size-caption` | -1 | 0.857× | Captions, fine print |
| `--font-size-subsection-sm` | -0.5 | 0.929× | Small subsection text |
| `--font-size-body` | 0 | 1.0× | Body text (= base) |
| `--font-size-subsection-heading` | 0.5 | 1.071× | Subsection headings |
| `--font-size-section-heading` | 1.5 | 1.286× | Section headings |
| `--font-size-page-title` | 3 | 1.714× | Page titles |

Note: Steps are not all integers. The current scale doesn't follow a strict ratio — the steps above are approximations. When the user selects a ratio, recalculate each variable using its assigned step and the chosen ratio. The result replaces the current `calc()` values at runtime.

### Available ratios:

```typescript
const SCALE_RATIOS = [
  { label: '1.067 — Minor Second', value: 1.067 },
  { label: '1.125 — Major Second', value: 1.125 },
  { label: '1.200 — Minor Third', value: 1.2 },
  { label: '1.250 — Major Third', value: 1.25 },
  { label: '1.333 — Perfect Fourth', value: 1.333 },
  { label: '1.414 — Augmented Fourth', value: 1.414 },
  { label: '1.500 — Perfect Fifth', value: 1.5 },
  { label: '1.618 — Golden Ratio', value: 1.618 },
] as const;
```

### Calculation:

```typescript
function calculateScale(base: number, ratio: number, step: number): string {
  const px = Math.round(base * Math.pow(ratio, step) * 100) / 100;
  return `${px}px`;
}
```

When either base or ratio changes, recalculate ALL font-size variables:

```typescript
const FONT_STEPS: { cssVar: string; step: number; label: string }[] = [
  { cssVar: '--font-size-overline', step: -2, label: 'Overline' },
  { cssVar: '--font-size-caption', step: -1, label: 'Caption' },
  { cssVar: '--font-size-subsection-sm', step: -0.5, label: 'Subsection Sm' },
  { cssVar: '--font-size-body', step: 0, label: 'Body' },
  { cssVar: '--font-size-subsection-heading', step: 0.5, label: 'Subsection' },
  { cssVar: '--font-size-section-heading', step: 1.5, label: 'Section Heading' },
  { cssVar: '--font-size-page-title', step: 3, label: 'Page Title' },
];
```

Also update `--font-base` when the base slider changes.

---

## 2. UI Controls

### Add a new section to TokenEditorControls

Place this ABOVE the existing Typography Scale group (or replace it). The section should be visually distinct — it's a compound control, not individual token sliders.

### Layout:

```
┌─────────────────────────────────────┐
│ MODULAR TYPE SCALE                  │
├─────────────────────────────────────┤
│ Base Size                           │
│ [====●===========] 16px             │
│                                     │
│ Scale Ratio                         │
│ [▼ 1.250 — Major Third           ] │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Preview                         │ │
│ │                                 │ │
│ │ Page Title          27.4px  +3  │ │
│ │ Section Heading     20.0px +1.5 │ │
│ │ Subsection          17.1px +0.5 │ │
│ │ Body                16.0px   0  │ │
│ │ Subsection Sm       14.9px -0.5 │ │
│ │ Caption             12.8px  -1  │ │
│ │ Overline            10.2px  -2  │ │
│ └─────────────────────────────────┘ │
└─────────────────────────────────────┘
```

### Base size slider:
- Range: 12px to 22px
- Step: 0.5px
- Shows current value in px
- Default: read from `--font-base` on mount

### Scale ratio dropdown:
- `<select>` with the ratios from §1
- Default: detect closest match to current scale (compare current `--font-size-page-title` computed value against each ratio's prediction for step 3)

### Preview panel:
- Renders each type step as a single line of sample text at its computed size
- Text uses the app's font (Manrope via `var(--font-manrope)`) — this IS a design preview, not a dev tool display
- Each line shows: the role label (left), computed px value (right), step number (far right, muted)
- Lines are rendered at their actual computed font size — the preview IS the specimen
- Update in real time as base or ratio changes

---

## 3. Interaction with Existing Token Editor

### Change tracking:
Each recalculated `--font-size-*` variable gets tracked as an individual change in the existing `useTokenEditor` hook. The diff output will show all modified font sizes, not just "ratio changed."

### Reset behavior:
"Reset All" restores all font sizes to their original computed values. Per-token reset on individual font size tokens also works (reverts that one size while keeping the rest of the scale).

### Diff output format:
The diff should include a comment indicating the scale parameters:

```
/* Modular scale: base 16px, ratio 1.25 (Major Third) */
--font-base: 16px;
--font-size-overline: 10.24px;
--font-size-caption: 12.8px;
--font-size-subsection-sm: 14.31px;
--font-size-body: 16px;
--font-size-subsection-heading: 17.89px;
--font-size-section-heading: 24.41px;
--font-size-page-title: 31.25px;
```

This gives CC the exact values to write into globals.css, plus the generating parameters as a comment for documentation.

---

## 4. Integration with token-registry.ts

Remove the individual `--font-base` entry from the Typography Scale group in the token registry (if it exists as a standalone control). The modular scale compound control replaces it. Keep any non-font-size typography tokens (like `--font-manrope` if present) as standalone controls.

If using auto-detect registry (CC11), the font-size variables should be flagged as "managed by modular scale" and excluded from individual control rendering.

---

## 5. Detached Window Support

The modular scale controls must work in the detached window. Base and ratio changes broadcast via the existing `BroadcastChannel` as individual `token-change` messages for each affected CSS variable. The parent page updates all font sizes in real time.

---

## 6. Verification

- [ ] Base size slider recalculates all 7 font-size variables in real time
- [ ] Ratio dropdown recalculates all 7 font-size variables in real time
- [ ] Preview panel renders sample text at actual computed sizes
- [ ] Preview updates instantly as controls change
- [ ] Page content (real app) reflows as scale changes
- [ ] Change tracking shows individual font-size modifications in diff output
- [ ] Diff includes scale parameters as a comment
- [ ] Reset All restores original font sizes
- [ ] Detached window broadcasts scale changes to parent
- [ ] Default ratio detection correctly identifies the closest match to current scale
- [ ] No type errors: `npx tsc --noEmit`
