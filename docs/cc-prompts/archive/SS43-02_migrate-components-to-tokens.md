# SS43-02: Migrate Components to Semantic Tokens

**Context:** Design system token expansion (SS-43). SS43-01 added new token definitions to `globals.css`. This prompt migrates all application components to use the new semantic tokens instead of hardcoded values. Reference spec: `Design-System/Token-Expansion-Phase1.md` in Obsidian vault.

**IMPORTANT:** Do NOT modify files in `/src/components/ui/` — those are shadcn primitives that use the original token names by design.

## Scope

All files in:
- `/src/components/discovery/` (all files including `/renderers/`)
- `/src/components/district-profile/` (all files)
- `/src/components/layout/` (all files)
- `/src/components/playbook/` (all files)
- `/src/components/shared/` (all files)
- `/src/app/(dashboard)/` (all page.tsx and layout.tsx files)
- `/src/app/palette-ref/page.tsx`
- `/src/lib/design-tokens.ts`

## Migration Rules

Apply these replacements across all in-scope files. Each rule is a find-and-replace — context is provided to help disambiguate edge cases.

### 1. Text Color Tiers

| Find | Replace | Notes |
|---|---|---|
| `text-slate-400` | `text-foreground-tertiary` | Low-contrast labels, overlines |
| `text-slate-500` | `text-foreground-secondary` | Supporting text, metadata |
| `text-muted-foreground/70` | `text-foreground-tertiary` | Was opacity hack for tertiary |
| `text-muted-foreground` | `text-foreground-secondary` | Medium-contrast text — BUT only in application components, not in shadcn `ui/` |

**Edge case:** If `text-muted-foreground` appears on an element that functions as a label/overline/placeholder (visually lighter than supporting text), use `text-foreground-tertiary` instead.

### 2. Surface Tiers

| Find | Replace | Notes |
|---|---|---|
| `bg-white` | `bg-surface-raised` | Cards, panels sitting on page background |
| `bg-slate-50` | `bg-surface-inset` | Recessed areas within cards |
| `bg-slate-100` | `bg-surface-emphasis-neutral` | If used as a highlight; or `bg-surface-inset` if used as simple recession — check context |
| `bg-emphasis-surface` | `bg-surface-emphasis` | Rename only (same value) |
| `bg-emphasis-surface-neutral` | `bg-surface-emphasis-neutral` | Rename only (same value) |
| `hover:bg-slate-50` | `hover:bg-surface-inset` | Hover states |
| `hover:bg-slate-100` | `hover:bg-surface-inset` | Hover states |
| `hover:bg-orange-50` | Leave as-is for now | Part of button variant consolidation (SS43-03) |

**Edge case for `bg-white`:** If `bg-white` is used inside a component that itself sits on a white card (i.e., nested white-on-white), this is likely correct — the component is at the same elevation as its parent. Still replace with `bg-surface-raised` for token consistency.

### 3. Border Tiers

| Find | Replace | Notes |
|---|---|---|
| `border-slate-200` | `border-border-default` | Structural borders |
| `border-slate-300` | `border-border-default` | Used in hover states typically |
| `border-border/50` | `border-border-subtle` | Light internal dividers |
| `border-border/40` | `border-border-subtle` | Light internal dividers |
| `border-border/60` | `border-border-subtle` | Internal dividers — slightly heavier but same semantic role |
| `hover:border-slate-300` | `hover:border-border-default` | Hover state for card borders |

**Do NOT replace:**
- `border-border` → keep as-is (it's already the default tier, shadcn convention)
- `border-primary/30` → not a tier issue, it's interactive styling (deferred to SS43-03)
- `border-brand-orange` → brand token, correct as-is
- Any borders inside `/src/components/ui/` files

### 4. Typography Weight Normalization

| Find | Replace |
|---|---|
| `font-[400]` | `font-normal` |
| `font-[500]` | `font-medium` |
| `font-[600]` | `font-semibold` |
| `font-[700]` | `font-bold` |

These are exact equivalents. Apply globally across all in-scope files.

### 5. design-tokens.ts Update

In `/src/lib/design-tokens.ts`, the `fitCategoryColors` object uses semantic token classes (`bg-success/10`, `text-success`, etc.) which are already correct. No changes needed to this file unless you find hardcoded slate values — specifically check the `alignmentBadgeClass` or similar maps if they exist in other files.

Check `district-list-card.tsx` — it has:
```typescript
const alignmentBadgeClass: Record<ProductAlignment['level'], string> = {
  strong: 'text-success bg-success/10',
  moderate: 'text-warning bg-warning/10',
  limited: 'text-slate-500 bg-slate-100',
};
```
Replace `limited` value with: `'text-foreground-secondary bg-surface-emphasis-neutral'`

### 6. Focus Outline Standardization

Where you see `focus-visible:outline-[#FF7000]`, leave as-is — this is the brand focus color and should eventually become a token, but is out of scope for this migration.

## Verification

After all replacements:

1. Run `npm run build` — must compile with zero errors
2. Run `npm run lint` — fix any lint warnings introduced
3. Visually spot-check these pages (they exercise the most token-heavy components):
   - `/discovery` — run a query, check brief renderer and card renderers
   - `/districts/{any-district-id}` — check identity bar and research tabs
   - `/playbooks` — check playbook cards
   - `/saved` — check district list cards

The app should look **identical** to before migration. If any visual change is apparent, the wrong token was applied — revert that specific replacement and flag it.

## Out of Scope (deferred to SS43-03)

- Brand-orange button variant extraction (inline `bg-brand-orange` / `border-brand-orange` styling)
- Interactive border patterns (`border-primary/30`)
- `hover:bg-orange-50` consolidation
- Focus outline tokenization
- Removing legacy alias tokens from globals.css (that's Phase 3 after verification)
