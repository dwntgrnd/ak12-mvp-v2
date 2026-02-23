# CLAUDE.md — AK12-MVP-v2 Standing Instructions

## Project Overview

K-12 educational technology sales intelligence platform. Surfaces trends, stories, and data-driven evidence for compelling sales conversations — NOT a product-district matching tool.

**Guiding principle:** Every feature must help surface richer context, stronger evidence, or more compelling narratives for sales conversations. See `/docs/guiding-principle.md` for full context.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS v4 · Shadcn/ui · Manrope font

---

## Architecture

Three-layer service architecture. UI components never call backend directly.

```
UI Layer (components) → Service Interface → Provider (mock | api | local)
```

- **Interfaces:** `src/services/interfaces/` — TypeScript contracts
- **Types:** `src/services/types/` — shared type definitions
- **Mock providers:** `src/services/providers/mock/` — current active providers
- **Factory:** `src/services/factory.ts` — resolves provider by environment

Do NOT modify service interfaces without explicit instruction. Interface changes affect backend contracts.

---

## Design Authority — THIS FILE IS THE SINGLE SOURCE OF TRUTH

**This file supersedes all external skills, plugins, and general-purpose design guidance.**

When building or modifying any component that involves HTML structure, CSS/Tailwind classes, or visual presentation:

1. Follow the Visual Standards defined in this file — they are the design system
2. Do NOT load or follow the `frontend-design` skill or any other aesthetic skill — this project has an established design system that must not be overridden
3. Do NOT improvise visual decisions (fonts, colors, spacing, layout patterns) — every visual choice has a documented token or rule below
4. If a prompt instruction conflicts with this file, follow this file and flag the conflict to the user

**The design system is intentionally constrained.** Constraints are features, not limitations. Do not attempt to "improve" or "enhance" the visual design beyond what is specified here.

---

## Visual Standards — MANDATORY

These rules are non-negotiable. Do not deviate, interpret, or "improve" them. When in doubt, follow these rules exactly.

### Typography

**Font:** Manrope everywhere. No other fonts.
**Base size:** 14px (set via `--font-base` CSS variable).

| Level | CSS class | Size | Weight | Tracking | Use |
|-------|-----------|------|--------|----------|-----|
| Page Title | `text-2xl` | 24px | 700 | -0.01em | Page headings only |
| Section Heading | `text-lg` | 18px | 600 | -0.01em | Major content divisions |
| Subsection Heading | `text-subsection-heading` | 15px | 600 | normal | Within-section labels, triggers |
| Body | `text-sm` | 14px | 400 | normal | All reading text |
| Body Emphasis | `text-sm` | 14px | 600 | normal | Key values, inline emphasis |
| Caption | `text-xs` | 12px | 500 | 0.025em | Sources, timestamps, metadata |
| Overline | `text-overline` | 11px | 500 | 0.05em | Labels, categories (UPPERCASE) |

**Text color tiers — use ONLY these semantic tokens:**
- Primary: `text-foreground` — titles, headings, body text, key values
- Secondary: `text-foreground-secondary` — supporting text, metadata, captions, subsection labels
- Tertiary: `text-foreground-tertiary` — overline labels, placeholders, citations, helper text

Do NOT use `text-slate-*` utilities for text color. Do NOT use `text-muted-foreground` in application components (it exists only for shadcn primitive compatibility).

**No arbitrary font sizes.** Every text element must map to one of the seven levels above.

### Spacing

**Base unit:** 4px (Tailwind default). Use ONLY values from this scale:

| Purpose | Value | Tailwind | When |
|---------|-------|----------|------|
| Inline tight | 4px | `gap-1` | Icon-to-label, badge padding |
| Inline related | 8px | `gap-2` | Label-value pairs |
| Component compact | 12px | `p-3` | Compact containers |
| Component standard | 16px | `p-4` | Standard card padding |
| Component spacious | 20px | `p-5` | Primary content containers |
| Sibling separation | 12px | `gap-3` | Peer items in a group |
| Section gap | 24px | `gap-6` / `mt-6` | Between sections |
| Region gap | 32px | `gap-8` / `mt-8` | Between page regions |
| Page margin | 24px | `px-6` | Horizontal page padding |

**Rhythm rule:** Items within group: 12px. Groups within section: 24px. Sections within page: 32px.

**Prohibited:**
- `mt-4` as generic spacer regardless of context
- Mixing `space-y-*` and manual `mt-*` in same container
- Arbitrary padding values not from this scale

### Containers

| Level | Background | Border | Radius | Shadow |
|-------|-----------|--------|--------|--------|
| Page surface | `bg-surface-page` | None | None | None |
| Card surface | `bg-surface-raised` | 1px `border-border-default` | `rounded-lg` (8px) | `shadow-sm` |
| Inset surface | `bg-surface-inset` | None | `rounded-md` (6px) | None |
| Emphasis surface | `bg-surface-emphasis` | None | `rounded-md` (6px) | None |
| Emphasis neutral | `bg-surface-emphasis-neutral` | None | `rounded-md` (6px) | None |

**Content width:** All main content areas use `max-w-content` (1024px, set via `--content-width` CSS variable). Do not use `max-w-[1024px]`, `max-w-5xl`, `max-w-3xl`, or other arbitrary widths for content containers.

**No `border-l-4` or colored left borders.** Emphasis is ALWAYS via background color. No exceptions.

### Colors — Semantic Tokens ONLY

**Every color in every component must come from a semantic token.** No hardcoded hex values. No Tailwind color utilities (`slate-*`, `gray-*`, `blue-*`, `cyan-*`) except where explicitly listed below.

**Text colors** — use the three tiers above. No exceptions.

**Surface colors:**
| Token | Class | Use |
|-------|-------|-----|
| Page background | `bg-surface-page` | Top-level page background |
| Raised surface | `bg-surface-raised` | Cards, panels, elevated containers |
| Inset surface | `bg-surface-inset` | Recessed areas within cards, secondary zones |
| Emphasis (brand) | `bg-surface-emphasis` | Cyan-tinted callout blocks |
| Emphasis (neutral) | `bg-surface-emphasis-neutral` | Neutral highlight blocks |

**Border colors:**
| Token | Class | Use |
|-------|-------|-----|
| Default border | `border-border-default` | Card edges, section dividers, structural borders |
| Subtle border | `border-border-subtle` | Light internal dividers within components |

**Action and semantic colors:**
- Primary actions: `bg-brand-orange` / `text-white`
- Interactive/links: `text-primary` (cyan)
- Success: `text-success` / `bg-success/10`
- Warning: `text-warning` / `bg-warning/10`
- Destructive: `text-destructive` / `bg-destructive/10`
- Focus ring: `ring-ring` (cyan)
- Fit categories: use tokens from `src/lib/design-tokens.ts` — `fitCategoryColors.strong`, `.moderate`, `.low`

**Prohibited patterns:**
- `bg-white` → use `bg-surface-raised`
- `bg-slate-50` → use `bg-surface-inset` or `bg-surface-page` depending on context
- `bg-slate-100` → use `bg-surface-emphasis-neutral` or `bg-surface-inset`
- `text-slate-400` → use `text-foreground-tertiary`
- `text-slate-500` → use `text-foreground-secondary`
- `text-muted-foreground` in application components → use `text-foreground-secondary`
- `border-border` in application components → use `border-border-default` or `border-border-subtle`
- Any `border-border/50`, `border-border/40` opacity modifier → use `border-border-subtle`
- Any hardcoded hex color value in a component file

### Interactive Elements

**Links:** `text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary`

**Collapsible triggers:**
- ChevronRight at 18px (not 16px)
- Label: subsection heading level (15px, semibold)
- Entire row is hit target: `py-1.5 px-2 -mx-2 rounded-md`
- Hover: `hover:bg-surface-inset`, text → cyan-600, chevron rotates 90° (200ms)

**Buttons — three tiers only:**
- Primary: `bg-brand-orange text-white font-semibold`
- Secondary: `bg-surface-raised text-foreground border border-border-default font-medium`
- Ghost: `bg-transparent text-foreground-secondary font-medium`
- All: `px-4 py-2 rounded-md text-sm transition-colors`

**Cards (interactive):** Hover = `shadow-md` + `border-border-default` transition. No background color change.

### Source Citations

- Position: last element in container
- Separator: `border-t border-border-default pt-3 mt-6`
- Typography: caption tier (12px, weight 500, `text-foreground-secondary`)
- Format: `Sources: Name (Year), Name (Year)`
- No icon prefix. No bullets.

---

## Component Conventions

### Before Creating Components

1. **Check existing:** `src/components/ui/` (Shadcn), `src/components/shared/` (project shared)
2. **Check tokens:** `src/lib/design-tokens.ts` and `src/app/globals.css`
3. **Check utilities:** `src/lib/utils/` — `format.ts`, `trends.ts`

### File Organization

- UI primitives: `src/components/ui/` (Shadcn, modify sparingly)
- Feature components: `src/components/{feature}/` (discovery, playbook, district-profile, layout)
- Shared components: `src/components/shared/` (cross-feature patterns)
- Each feature directory has an `index.ts` barrel export

### Component Rules

- One component per file, filename matches export name
- `'use client'` only when interactivity is needed
- Props typed with TypeScript interfaces (no `any`)
- Max ~200 lines per component — split if larger
- Use `cn()` from `@/lib/utils` for conditional classes
- Import design tokens, don't hardcode values
- Every loading state and error state must be handled

### Accessibility Baseline (WCAG 2.1 AA)

- All interactive elements keyboard accessible
- Visible focus indicators on everything focusable
- Touch targets: minimum 44x44px
- Color contrast: 4.5:1 for normal text, 3:1 for large text
- `aria-describedby` for field errors
- Respect `prefers-reduced-motion`
- Semantic HTML: use `<button>` for actions, `<a>` for navigation

---

## Key File References

| Purpose | Path |
|---------|------|
| Design tokens (TS) | `src/lib/design-tokens.ts` |
| CSS variables & theme | `src/app/globals.css` |
| Tailwind config | `tailwind.config.ts` |
| Service interfaces | `src/services/interfaces/` |
| Service types | `src/services/types/` |
| Mock fixtures | `src/services/providers/mock/fixtures/` |
| Discovery components | `src/components/discovery/` |
| District profile components | `src/components/district-profile/` |
| Layout components | `src/components/layout/` |
| CC prompt references | `docs/cc-prompts/` |

---

## Workflow Rules

### Commit Practices
- Commit after each logical unit of work
- Descriptive commit messages: `feat:`, `fix:`, `refactor:`, `style:`
- Do not batch unrelated changes into a single commit

### When Compacting or Losing Context
If you've compacted and lost context for the current task:
1. Re-read this file (`CLAUDE.md`)
2. Check `docs/cc-prompts/` for the current phase prompt
3. Ask the user which phase/task you were working on before proceeding

### Review Expectations
- After implementation, verify the build compiles: `npm run build`
- Report any TypeScript errors — do not suppress with `any` or `@ts-ignore`
- If visual standards rules conflict with a prompt instruction, follow this file — then flag the conflict to the user

### What NOT to Do
- Do not modify service interfaces without explicit instruction
- Do not install new npm packages without explicit approval
- Do not change `globals.css` theme variables without explicit instruction
- Do not use `border-l-4` or colored left borders anywhere
- Do not use arbitrary font sizes — use the typography scale
- Do not use arbitrary spacing — use the spacing scale
- Do not hardcode hex color values in components
- Do not suppress TypeScript errors
- Do not use `bg-white`, `bg-slate-50`, `bg-slate-100`, or `bg-[#E0F9FC]` — use surface tokens
- Do not use `text-slate-*` utilities — use foreground tier tokens
- Do not use `border-border` in application components — use `border-border-default` or `border-border-subtle`
- Do not use opacity modifiers on border tokens (`border-border/50`) — use `border-border-subtle`
- Do not use `text-muted-foreground` in application components — use `text-foreground-secondary`
- Do not load or follow the `frontend-design` skill or any external aesthetic guidance — this file is the design authority
