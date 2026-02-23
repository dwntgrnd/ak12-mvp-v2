# SS43-04: Button Variant Consolidation

**Prerequisite:** SS43-01 (token definitions) and SS43-02 (component migration) must be complete.  
**Related:** SS43-03 (CLAUDE.md update) will need a follow-up amendment to reflect the button tier changes made here.

**Scope:** Modify `button.tsx` variant definitions, migrate all components to use variants, standardize focus outlines. No new components.

---

## Task Overview

The shadcn `default` button variant (cyan primary) is unused in the application. Every primary CTA uses inline brand-orange classes. This prompt consolidates all brand-orange button patterns into proper variants and standardizes focus outlines to the system token.

---

## Part 1: Update Button Variants

**File:** `src/components/ui/button.tsx`

Replace the current `variants` object in the `cva` call with:

```typescript
variants: {
  variant: {
    default:
      "bg-brand-orange text-white shadow-sm hover:bg-brand-orange/90",
    destructive:
      "bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90",
    outline:
      "border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground",
    outlineBrand:
      "border-[1.5px] border-brand-orange text-brand-orange bg-transparent shadow-sm hover:bg-brand-orange/5 hover:text-brand-orange",
    secondary:
      "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80",
    ghost: "hover:bg-accent hover:text-accent-foreground",
    link: "text-primary underline-offset-4 hover:underline",
  },
```

No changes to the `size` variants or the component interface.

**Note:** The `secondary` variant is retained for shadcn compatibility even though it's not currently used in application components. Do not remove it.

---

## Part 2: Migrate Components to Button Variants

### generate-playbook-sheet.tsx

Find:
```tsx
<Button
  className="w-full h-12 bg-[#FF7000] hover:bg-[#E56400] text-white"
  disabled={!canGenerate}
```

Replace with:
```tsx
<Button
  className="w-full h-12"
  disabled={!canGenerate}
```

The `default` variant now provides the brand-orange styling. The `h-12` and `w-full` are layout overrides that stay.

### empty-playbooks-state.tsx

Find:
```tsx
<Button
  size="lg"
  className="bg-[#FF7000] hover:bg-[#FF7000]/90 text-white h-12 px-8 mt-6"
  onClick={onCreateClick}
>
```

Replace with:
```tsx
<Button
  size="lg"
  className="h-12 px-8 mt-6"
  onClick={onCreateClick}
>
```

### district-identity-bar.tsx

**"Find Similar" button** — find:
```tsx
<Button
  variant="outline"
  className="border-[1.5px] border-brand-orange text-brand-orange hover:bg-orange-50 hover:text-brand-orange"
  onClick={() => router.push('/discovery')}
>
  Find Similar
</Button>
```

Replace with:
```tsx
<Button
  variant="outlineBrand"
  onClick={() => router.push('/discovery')}
>
  Find Similar
</Button>
```

**"View Playbook" button** — find:
```tsx
<Button
  variant="outline"
  className="border-[1.5px] border-brand-orange text-brand-orange hover:bg-orange-50 hover:text-brand-orange"
  onClick={() => router.push(`/playbooks/${existingPlaybookId}`)}
>
  View Playbook
</Button>
```

Replace with:
```tsx
<Button
  variant="outlineBrand"
  onClick={() => router.push(`/playbooks/${existingPlaybookId}`)}
>
  View Playbook
</Button>
```

**"Create Playbook" button** — find:
```tsx
<Button
  className="bg-brand-orange text-white hover:bg-brand-orange/90"
  onClick={onGeneratePlaybook}
>
  Create Playbook
</Button>
```

Replace with:
```tsx
<Button
  onClick={onGeneratePlaybook}
>
  Create Playbook
</Button>
```

### district-list-card.tsx

**"View Playbook" raw button** — find:
```tsx
<button
  type="button"
  onClick={(e) => {
    e.stopPropagation();
    router.push(`/playbooks/${existingPlaybookId}`);
  }}
  className="flex items-center gap-1 border border-brand-orange text-brand-orange text-xs font-medium px-2.5 py-1 rounded-md hover:bg-orange-50 transition-colors"
>
  View Playbook
  <ArrowRight className="h-3 w-3" />
</button>
```

Replace with:
```tsx
<Button
  variant="outlineBrand"
  size="sm"
  className="h-auto py-1 px-2.5 text-xs"
  onClick={(e) => {
    e.stopPropagation();
    router.push(`/playbooks/${existingPlaybookId}`);
  }}
>
  View Playbook
  <ArrowRight className="h-3 w-3" />
</Button>
```

**"Create Playbook" raw button** — find:
```tsx
<button
  type="button"
  onClick={(e) => {
    e.stopPropagation();
    onGeneratePlaybook(districtId);
  }}
  className="flex items-center gap-1 bg-brand-orange text-white text-xs font-medium px-2.5 py-1 rounded-md hover:bg-brand-orange/90 transition-colors"
>
  Create Playbook
  <ArrowRight className="h-3 w-3" />
</button>
```

Replace with:
```tsx
<Button
  size="sm"
  className="h-auto py-1 px-2.5 text-xs"
  onClick={(e) => {
    e.stopPropagation();
    onGeneratePlaybook(districtId);
  }}
>
  Create Playbook
  <ArrowRight className="h-3 w-3" />
</Button>
```

**Note:** The `Button` component already renders as `<button>` with proper event handling. The `onClick` with `e.stopPropagation()` continues to work. Verify that click propagation to the parent `<article>` is still blocked after migration.

### product-selection-card.tsx

**Selected state border** — find:
```tsx
selected
  ? 'border-l-[3px] border-l-[#FF7000] border-y-border border-r-border bg-[#FF7000]/[0.04]'
  : 'border-border bg-background'
```

Replace with:
```tsx
selected
  ? 'border-l-[3px] border-l-brand-orange border-y-border-default border-r-border-default bg-brand-orange/[0.04]'
  : 'border-border-default bg-surface-raised'
```

**Note:** This is not a button variant change — it's a token migration for the selection accent. The `border-l-[3px]` left border is an intentional selection indicator on this interactive card, not a layout border, so it's acceptable here despite the general prohibition on colored left borders for layout.

### playbook-card.tsx

**Hardcoded #FF7000 references** — find all instances of `text-[#FF7000]`, `bg-[#FF7000]`, and `focus-visible:outline-[#FF7000]` and replace:

| Find | Replace |
|---|---|
| `text-[#FF7000]` | `text-brand-orange` |
| `bg-[#FF7000]` | `bg-brand-orange` |
| `focus-visible:outline-[#FF7000]` | `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` |

### district-list-card.tsx (focus outline)

Find:
```tsx
'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF7000]',
```

Replace with:
```tsx
'focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
```

---

## Part 3: Update CLAUDE.md Button Documentation

In CLAUDE.md, find the current button tier section:

```
**Buttons — three tiers only:**
- Primary: `bg-brand-orange text-white font-semibold`
- Secondary: `bg-white text-foreground border border-border font-medium`
- Ghost: `bg-transparent text-muted-foreground font-medium`
- All: `px-4 py-2 rounded-md text-sm transition-colors`
```

Replace with:

```
**Buttons — use only these variants (from `components/ui/button.tsx`):**
- `default` — brand-orange filled. Primary CTAs: Generate, Create, New, Submit.
- `outlineBrand` — brand-orange outline. Brand-prominent secondary: View Playbook, Find Similar.
- `outline` — neutral outline. Utility actions: filter triggers, Retry, Go to Solutions.
- `ghost` — transparent. Subtle actions: Cancel, sidebar toggle, toolbar controls.
- `destructive` — red filled. Destructive confirmations only.
- `link` — text link styled as button. Rare.

Do NOT apply brand-orange styling via className. Use the `default` or `outlineBrand` variant. If a button needs brand-orange, it should use a variant, not inline classes.
```

---

## Verification

1. `npm run build` passes with no TypeScript errors
2. No remaining `#FF7000` hex values in any component file (search entire `src/components/` directory)
3. No remaining `bg-[#FF7000]`, `hover:bg-[#E56400]`, `hover:bg-orange-50`, `border-brand-orange` as inline button styles (these should now come from variants)
4. No remaining `focus-visible:outline-[#FF7000]` anywhere — all focus outlines use `ring-ring`
5. Spot-check these pages visually:
   - `/playbooks` (empty state with "New Playbook" button)
   - `/playbooks` → click "New Playbook" (generate sheet with orange Generate button)
   - `/districts/[any]` (identity bar with Find Similar, View/Create Playbook buttons)
   - Any discovery results page with district list cards (View Playbook, Create Playbook mini-buttons)
6. Verify `district-list-card` click propagation: clicking "View Playbook" or "Create Playbook" buttons should NOT also trigger navigation to the district profile

---

## Out of Scope

- Discovery input submit arrow button (`bg-brand-orange` on a non-`<Button>` element) — this is a custom input affordance, not a standard button. Leave as-is for now.
- `hover:bg-muted/50` patterns on non-button interactive elements (save toggle, product selection card hover) — these are interaction states, not button variants.
- Focus ring color token value — `ring-ring` stays as the semantic token. If the actual color needs to change from cyan to something else, that's a `globals.css` variable change, not a component change.
