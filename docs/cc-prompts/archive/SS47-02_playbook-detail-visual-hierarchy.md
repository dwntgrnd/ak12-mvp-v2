# SS47-02: Playbook Detail Page — Visual Hierarchy and Surface Treatment

**Session:** SS-47
**Scope:** Visual treatment pass on the playbook detail page. Applies existing design tokens, adds shadow token scale, and restructures component surfaces for proper hierarchy.
**Files:** `playbook-context-card.tsx`, `playbook-section.tsx`, playbook detail `page.tsx`, `globals.css`

---

## Context

The playbook detail page renders with near-flat visual hierarchy. Surface tiers, typography color differentiation, and spatial grouping are underutilized. The design token system has the vocabulary to solve this — surface tiers (`surface-raised`, `surface-inset`, `surface-emphasis`), text color tiers (`foreground`, `foreground-secondary`, `foreground-tertiary`), border tiers (`border-default`, `border-subtle`), and the typography scale. The page doesn't use them effectively.

This prompt applies existing tokens and adds a shadow scale to bring the page up to the standard the design system was built to support.

---

## Change 0: Add Shadow Token Scale

Add a 3-level shadow scale to the design system. These are global tokens, not playbook-specific.

### In `globals.css` — add to `:root` block:

```css
/* Elevation shadow tokens */
--shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
--shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05);
--shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.07), 0 4px 6px -4px rgb(0 0 0 / 0.05);
```

### In `globals.css` — add to `@theme inline` block:

```css
--shadow-sm: var(--shadow-sm);
--shadow-md: var(--shadow-md);
--shadow-lg: var(--shadow-lg);
```

### In `src/lib/design-tokens.ts` — add shadow token documentation:

```typescript
// Elevation shadow scale
export const shadowTokens = {
  sm: 'shadow-sm',   // subtle lift — cards, context panels
  md: 'shadow-md',   // moderate elevation — modals, sheets, dropdowns
  lg: 'shadow-lg',   // high elevation — overlays, popovers
} as const;
```

**Usage guidance:** `shadow-sm` for cards and panels that sit above the page surface. `shadow-md` for modals and overlays. `shadow-lg` reserved for high-priority floating elements. Most UI elements should use `shadow-sm` or no shadow. Overuse of shadows flattens the hierarchy just as much as underuse.

---

## Change 1: PlaybookContextCard — Structured Information Surface

**File:** `src/components/shared/playbook-context-card.tsx`

### Outer container

Replace:
```
className="border border-border rounded-lg"
```

With:
```
className="bg-surface-raised border border-border-default rounded-lg shadow-sm"
```

### Collapsed trigger row — add key metrics inline

The collapsed state currently shows only district name and product badges. Add enrollment and fit score so the card has informational value when collapsed.

In the `CollapsibleTrigger`, after the product badges div, add a metrics summary:

```tsx
<div className="flex items-center gap-4 text-sm text-foreground-secondary ml-auto mr-2">
  {districtEnrollment != null && (
    <span>{formatNumber(districtEnrollment)} students</span>
  )}
  {fitScore != null && (
    <span className={cn(
      'font-medium',
      fitScore >= 7 ? 'text-success' : fitScore >= 4 ? 'text-warning' : 'text-destructive'
    )}>
      {fitScore}/10 fit
    </span>
  )}
</div>
```

These should be visible in the collapsed row, between the product badges and the chevron. They collapse/hide on small screens if needed (`hidden md:flex`).

### Expanded interior — two-column structure with divider

The two-column grid (`grid-cols-1 md:grid-cols-2`) needs a visible divider on desktop.

Replace the grid container:
```tsx
<div className="px-4 pb-4 pt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
```

With:
```tsx
<div className="px-5 pb-5 pt-3 border-t border-border-subtle">
  <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-6">
```

Add a divider element between the two columns:
```tsx
{/* District column */}
<div>...</div>

{/* Vertical divider — hidden on mobile */}
<div className="hidden md:block bg-border-subtle" />

{/* Products column */}
<div className="space-y-4">...</div>
```

Close the outer wrapper div.

### District metrics — structured formatting

Replace the current inline `Label: **value**` metric format with a structured layout.

Replace the metrics grid inside the district column:
```tsx
<div className="mt-2 grid grid-cols-2 gap-2 text-sm">
  {districtEnrollment != null && (
    <div>
      <span className="text-foreground-secondary">Enrollment:</span>{' '}
      <span className="font-medium">{formatNumber(districtEnrollment)}</span>
    </div>
  )}
  ...
</div>
```

With:
```tsx
<div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2">
  {districtEnrollment != null && (
    <div>
      <span className="text-overline font-medium uppercase tracking-[0.05em] text-foreground-tertiary">
        Enrollment
      </span>
      <p className="text-sm font-semibold text-foreground">{formatNumber(districtEnrollment)}</p>
    </div>
  )}
  {elaProficiency != null && (
    <div>
      <span className="text-overline font-medium uppercase tracking-[0.05em] text-foreground-tertiary">
        ELA Proficiency
      </span>
      <p className="text-sm font-semibold text-foreground">{elaProficiency}%</p>
    </div>
  )}
  {mathProficiency != null && (
    <div>
      <span className="text-overline font-medium uppercase tracking-[0.05em] text-foreground-tertiary">
        Math Proficiency
      </span>
      <p className="text-sm font-semibold text-foreground">{mathProficiency}%</p>
    </div>
  )}
  {frpmRate != null && (
    <div>
      <span className="text-overline font-medium uppercase tracking-[0.05em] text-foreground-tertiary">
        FRPM
      </span>
      <p className="text-sm font-semibold text-foreground">{frpmRate}%</p>
    </div>
  )}
</div>
```

### Fit score — semantic color treatment

Replace the plain fit score display:
```tsx
{fitScore != null && (
  <div className="mt-2 text-sm">
    <span className="text-foreground-secondary">Fit Score:</span>{' '}
    <span className="font-medium">{fitScore}/10</span>
    ...
  </div>
)}
```

With:
```tsx
{fitScore != null && (
  <div className="mt-3">
    <span className="text-overline font-medium uppercase tracking-[0.05em] text-foreground-tertiary">
      Fit Score
    </span>
    <p className={cn(
      'text-sm font-semibold',
      fitScore >= 7 ? 'text-success' : fitScore >= 4 ? 'text-warning' : 'text-destructive'
    )}>
      {fitScore}/10
    </p>
    {fitRationale && (
      <p className="mt-0.5 text-xs text-foreground-secondary">{fitRationale}</p>
    )}
  </div>
)}
```

### Product entries — tighten and differentiate

Product name: `text-sm font-semibold text-foreground` (was `font-medium`)
Product metadata (subject · grades): keep `text-sm text-foreground-secondary`
Product description: change to `text-xs text-foreground-secondary` (reduce size to create hierarchy from the name)

---

## Change 2: Tabs — Underline Style

**File:** `src/app/(dashboard)/playbooks/[playbookId]/page.tsx`

Replace the TabsList and TabsTrigger styling.

### TabsList

Replace:
```tsx
<TabsList className="w-full justify-start overflow-x-auto">
```

With:
```tsx
<TabsList className="h-auto w-full justify-start gap-0 rounded-none border-b border-border bg-transparent p-0 overflow-x-auto">
```

### TabsTrigger

Replace:
```tsx
<TabsTrigger key={sectionType} value={sectionType} className="gap-1.5">
```

With:
```tsx
<TabsTrigger
  key={sectionType}
  value={sectionType}
  className="-mb-px gap-1.5 rounded-none border-b-2 border-transparent bg-transparent px-4 py-2.5 text-sm font-medium text-foreground-secondary shadow-none transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-foreground data-[state=active]:shadow-none"
>
```

### StatusDot visibility

Modify StatusDot to return `null` when status is `'complete'`:

```tsx
function StatusDot({ status }: { status: SectionStatus }) {
  switch (status) {
    case 'pending':
      return <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground" />;
    case 'generating':
      return <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />;
    case 'error':
      return <span className="inline-block h-2 w-2 rounded-full bg-destructive" />;
    case 'complete':
    default:
      return null;
  }
}
```

---

## Change 3: PlaybookSection — Content Surface Container

**File:** `src/components/shared/playbook-section.tsx`

### Wrap content in a surface card

The section header stays outside the card. The content and metadata footer move inside.

Replace the content and footer area (the section below the header div) with:

```tsx
{/* Content surface */}
<div className="bg-surface-raised border border-border-subtle rounded-lg p-5 shadow-sm">
  {/* Content area */}
  {status === 'pending' && <SkeletonContent animated={false} />}
  {status === 'generating' && <SkeletonContent animated={true} />}
  {status === 'error' && errorMessage && (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription>{errorMessage}</AlertDescription>
    </Alert>
  )}
  {status === 'complete' && children}

  {/* Metadata footer — inside card */}
  {status === 'complete' && (
    <div className="text-xs text-foreground-tertiary mt-5 pt-3 border-t border-border-subtle">
      {isEdited && lastEditedAt
        ? `Edited ${formatDate(lastEditedAt)}`
        : generatedAt
          ? `Generated ${formatDate(generatedAt)}`
          : null}
    </div>
  )}
</div>
```

Note changes to the metadata footer:
- `text-sm` → `text-xs` (reduce prominence)
- `text-foreground-secondary` → `text-foreground-tertiary` (further reduce prominence)
- `mt-6 pt-4 border-t border-border` → `mt-5 pt-3 border-t border-border-subtle` (softer separator)

### Section header spacing

Add spacing between the section header and the content card:

```tsx
<div className="flex items-center justify-between mb-3">
```

(Currently `mb-4` — `mb-3` tightens the label-to-card relationship.)

---

## Change 4: Content Block Spacing and Sub-Section Grouping

**File:** `src/app/(dashboard)/playbooks/[playbookId]/page.tsx`

### Increase block spacing

In the TabsContent render, replace:
```tsx
<div className="space-y-1">
  {contentBlocks.map((block, blockIdx) => (
```

With:
```tsx
<div className="space-y-4">
  {contentBlocks.map((block, blockIdx) => (
```

### Add sub-section containers for content blocks

Wrap each InlineEditableBlock in a surface container to create visual rhythm:

```tsx
<div className="space-y-4">
  {contentBlocks.map((block, blockIdx) => (
    <div
      key={`${section.sectionId}-block-${blockIdx}`}
      className="bg-surface-inset rounded-md p-4"
    >
      <InlineEditableBlock
        value={block}
        onSave={(newValue) =>
          handleSaveBlock(section.sectionId, blockIdx, newValue)
        }
        aria-label={`Edit ${label} content block ${blockIdx + 1}`}
      />
    </div>
  ))}
</div>
```

This creates a repeating card rhythm within each section — each paragraph/sub-section is visually distinct and scannable. Matches the inset surface pattern used for detail content elsewhere in the platform.

---

## Change 5: Page Header Typography

**File:** `src/app/(dashboard)/playbooks/[playbookId]/page.tsx`

### Page title

Currently `text-2xl font-semibold text-foreground`. This is correct for the token scale. No change needed.

### Generated timestamp

Currently `text-sm text-foreground-secondary`. Reduce to:
```
text-xs text-foreground-tertiary
```

This pushes metadata further down the hierarchy and lets the status badge and title dominate.

### Back link

Currently `text-sm text-foreground-secondary`. This is fine — it's a navigation element, not metadata.

---

## Execution Order

1. Change 0 — shadow tokens (globals.css + design-tokens.ts)
2. Change 1 — PlaybookContextCard
3. Change 2 — tab style
4. Change 3 — PlaybookSection surface
5. Change 4 — content block spacing
6. Change 5 — page header typography

Build and verify after each change. Changes 3 and 4 will have the largest visual impact.

---

## Verification Checklist

- [ ] Shadow tokens registered: `shadow-sm`, `shadow-md`, `shadow-lg` available as Tailwind utilities
- [ ] Context card has white background, subtle border, and shadow-sm
- [ ] Context card collapsed row shows enrollment count and fit score with semantic color
- [ ] Context card expanded has visible vertical divider between district and product columns (desktop)
- [ ] District metrics use overline label pattern (uppercase, tertiary color, bold value below)
- [ ] Fit score value uses semantic color (green ≥7, amber 4-6, red <4)
- [ ] Tabs are underline style: transparent background, border-b-2 active indicator
- [ ] No status dots visible on tabs when all sections are complete
- [ ] Status dots visible on tabs for pending/generating/error sections
- [ ] Section content is wrapped in a white card with subtle border and shadow-sm
- [ ] Section heading sits above the content card, not inside it
- [ ] Metadata footer is inside the content card, smaller text, tertiary color
- [ ] Content blocks are spaced with `space-y-4` (not `space-y-1`)
- [ ] Each content block is wrapped in `bg-surface-inset` container
- [ ] Generated timestamp is `text-xs text-foreground-tertiary`
- [ ] No hardcoded color values — all use token classes
- [ ] `npm run build` passes with no TypeScript errors
- [ ] Page renders correctly at mobile (375px), tablet (768px), and desktop (1280px) widths
