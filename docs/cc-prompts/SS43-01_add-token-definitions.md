# SS43-01: Add New Token Definitions to globals.css

**Context:** Design system token expansion (SS-43). Phase 1 design decisions are documented in `Design-System/Token-Expansion-Phase1.md` in the Obsidian vault. This prompt adds the new CSS custom properties and Tailwind theme mappings. No component changes yet — that's SS43-02.

## Task

Add new semantic tokens to `/src/app/globals.css` for text color tiers, surface tiers, and border tiers. Retain all existing tokens for shadcn compatibility.

## Changes to `:root`

Add these new variables in organized sections. Place them after the existing `/* Emphasis surface tokens */` block and before `/* Layout tokens */`:

```css
/* Text color tiers */
--foreground-secondary: 215 16% 47%;
--foreground-tertiary: 215 20% 65%;

/* Surface tiers */
--surface-page: 210 40% 98%;
--surface-raised: 0 0% 100%;
--surface-inset: 210 40% 98%;
--surface-emphasis: 186 85% 93%;
--surface-emphasis-neutral: 210 40% 96%;

/* Border tiers */
--border-default: 214 32% 91%;
--border-subtle: 214 32% 95%;
```

## Changes to `@theme inline`

Add these mappings after the existing `--color-emphasis-surface-neutral` line:

```css
/* Text color tier utilities */
--color-foreground-secondary: hsl(var(--foreground-secondary));
--color-foreground-tertiary: hsl(var(--foreground-tertiary));

/* Surface tier utilities */
--color-surface-page: hsl(var(--surface-page));
--color-surface-raised: hsl(var(--surface-raised));
--color-surface-inset: hsl(var(--surface-inset));
--color-surface-emphasis: hsl(var(--surface-emphasis));
--color-surface-emphasis-neutral: hsl(var(--surface-emphasis-neutral));

/* Border tier utilities */
--color-border-default: hsl(var(--border-default));
--color-border-subtle: hsl(var(--border-subtle));
```

## Do NOT

- Remove or modify any existing token values
- Remove `--muted-foreground`, `--background`, `--card`, `--border`, `--emphasis-surface`, or `--emphasis-surface-neutral` — these are retained for shadcn primitive compatibility
- Touch any component files — migration is SS43-02

## Verification

After changes, run `npm run build` to confirm no CSS compilation errors. The app should look identical — no visual changes from adding unused tokens.
