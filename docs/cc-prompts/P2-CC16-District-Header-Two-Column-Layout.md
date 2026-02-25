# P2-CC16 — District Header: Two-Column Layout Restructure

**Goal:** Restructure `PersistentDataStrip` from a vertical stack into a two-column layout that eliminates layout shift across modes, uses full horizontal width, and provides a stable home for mode-contextual content (fit badge + match headline).

**Why:** Currently, when a product lens is applied, a conditional `matchSummary.headline` paragraph is inserted between the contact line and the metrics strip. This pushes all content below it down, creating visible layout shift when toggling modes. Additionally, the fit badge is rendered both in PersistentDataStrip (Row A) and ModeBar (center-right), creating redundancy. The right half of the header is entirely unused.

---

## Files to Modify

- `src/components/district-profile/persistent-data-strip.tsx` — primary restructure
- `src/components/district-profile/mode-bar.tsx` — remove duplicate fit badge + headline from lens mode center-right section

---

## Current Layout (vertical stack)

```
Row A: [Name] [Bookmark] [Fit Badge?]           ← badge conditionally appears
Row B: [Supt · Phone · Address]
Row B+: [matchSummary.headline]                  ← conditional, causes layout shift
──────────────────────────────────────────────────
Row C: [Grades | Enrollment | ELA | FRPM | SPED]
```

## Target Layout (two-column)

```
┌─ Left Column (identity) ───────┬─ Right Column (mode context) ──────┐
│ [Name] [Bookmark]              │ [Fit Badge]                        │
│ Supt · Phone · Address         │ matchSummary.headline (single line)│
├────────────────────────────────┴────────────────────────────────────┤
│ [Grades | Enrollment | ELA | FRPM | SPED]  (full-width, unchanged) │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Specification

### 1. Two-Column Upper Region

Replace the existing Row A / Row B / Row B+ vertical stack with a flex row containing two columns:

```
<div className="flex items-start justify-between gap-6">
  {/* Left column — identity */}
  <div className="min-w-0 flex-1">
    {/* Name + Bookmark row */}
    {/* Contact info row */}
  </div>
  
  {/* Right column — mode context */}
  <div className="shrink-0 text-right">
    {/* Fit badge */}
    {/* Match headline */}
  </div>
</div>
```

**Left column:**
- District name (`h1`) + Bookmark button — unchanged from current Row A
- Contact info line — unchanged from current Row B
- `min-w-0 flex-1` to take available space and allow text truncation if needed

**Right column:**
- `shrink-0 text-right` — right-aligned, does not collapse
- Width: let content determine width naturally. The fit badge and a single line of headline text won't need a fixed width.
- **Neutral mode:** Empty (renders nothing — the space is still allocated by the flex layout, so no height change)
- **Lens / Preview / Playbook modes:** Fit badge on top line, `matchSummary.headline` below it as a single line of text

### 2. Right Column Content

When `matchSummary` is present:

```tsx
<div className="shrink-0 text-right">
  <Badge
    className={`${matchTierColors[matchSummary.overallTier].bg} ${matchTierColors[matchSummary.overallTier].text} ${matchTierColors[matchSummary.overallTier].border} border`}
    variant="outline"
  >
    {matchTierColors[matchSummary.overallTier].label}
  </Badge>
  <p className="mt-1 text-sm text-foreground-secondary truncate max-w-[300px]">
    {matchSummary.headline}
  </p>
</div>
```

When `matchSummary` is null/undefined, render nothing in the right column. The left column alone determines the region height — which is stable because it always has name + contact info.

**Important:** The headline gets `truncate max-w-[300px]` to ensure single-line behavior. This is a safety constraint — adjust the max-width value if the available space is wider or narrower after implementation.

### 3. Remove Fit Badge + Headline from ModeBar

In `mode-bar.tsx`, remove the entire center-right section that currently renders in lens mode:

```tsx
// REMOVE this block (approximately lines 175-190 in current file):
{mode === 'lens' && matchSummary && (
  <div className="flex items-center gap-2 shrink-0">
    <span className={cn(...)}>
      {matchTierColors[matchSummary.overallTier].label}
    </span>
    <span className="text-sm text-foreground-secondary">
      {matchSummary.headline}
    </span>
  </div>
)}
```

Also remove the `matchSummary` prop from ModeBar if it's no longer used anywhere else in that component. Check before removing — it may be referenced in other mode conditions.

### 4. Remove Fit Badge from Row A

The fit badge currently also renders inline after the Bookmark button in PersistentDataStrip's Row A. Remove it from there — it now lives exclusively in the right column.

Remove:
```tsx
{matchSummary && (
  <Badge ...>
    {matchTierColors[matchSummary.overallTier].label}
  </Badge>
)}
```

from the `flex flex-wrap items-center gap-3` div that contains the name and bookmark.

### 5. Metrics Strip — No Changes

Row C (the metrics strip below the border) remains full-width and unchanged. No modifications needed.

---

## Prop Changes

**PersistentDataStrip** — no prop changes needed. It already receives `matchSummary` and `activeProductName`.

**ModeBar** — potentially remove `matchSummary` prop if no longer used after the center-right section removal. Verify by checking all references to `matchSummary` within the component before removing.

---

## Verification Checklist

After implementation, verify in the browser across all four modes:

- [ ] **Neutral mode:** Left column shows name + bookmark + contact. Right column is empty. Metrics strip renders below.
- [ ] **Lens mode:** Right column shows fit badge + headline. No vertical shift compared to Neutral — tab content stays in the same position.
- [ ] **Preview mode (generating):** Same as lens — right column content persists during generation.
- [ ] **Preview mode (preview ready):** Same as lens — fit assessment still visible.
- [ ] **Playbook mode** (`/districts/[id]/playbooks/[id]`): Verify fit badge + headline render in right column if matchSummary is available on that page. If matchSummary isn't passed to PersistentDataStrip on the playbook page, that's fine — the right column will be empty, consistent with Neutral.
- [ ] **Saved districts cards:** Confirm that any saved district listing that reuses PersistentDataStrip (or a variant) is NOT affected by this change. The right column simply won't render if no matchSummary is passed.
- [ ] **Responsive:** At narrow viewports (mobile), the two-column layout should stack gracefully. Add `flex-col sm:flex-row` if needed on the upper region flex container.
- [ ] **No duplicate fit badge:** Confirm the fit badge no longer appears in ModeBar's center-right section OR in PersistentDataStrip's name row. It should appear only in the right column.
- [ ] **Headline truncation:** With a long headline string, confirm it truncates to single line with ellipsis rather than wrapping.

---

## What NOT to Change

- ModeBar mode indicators (left section — "District Intelligence", "MathStream Lens", etc.)
- ModeBar actions (right section — Generate Playbook, Save/Discard, dropdown menu)
- ModeBar lens picker (center — Select component)
- ModeBar color treatments (border/background per mode)
- Metrics strip layout or content
- UnifiedDistrictLayout slot structure
