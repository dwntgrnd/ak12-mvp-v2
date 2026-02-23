# SS43-03: Update CLAUDE.md — Token Enforcement and Skill Override

**Prerequisite:** SS43-01 and SS43-02 must be complete (new tokens exist and components are migrated).

**Scope:** Modify `CLAUDE.md` only. No component or CSS changes.

---

## Task

Update `CLAUDE.md` to enforce the expanded semantic token system and prevent external design skills from overriding project standards. Three changes:

### Change 1: Add "Design Authority" section after Architecture, before Visual Standards

Insert this new section immediately before the `## Visual Standards — MANDATORY` heading:

```markdown
---

## Design Authority — THIS FILE IS THE SINGLE SOURCE OF TRUTH

**This file supersedes all external skills, plugins, and general-purpose design guidance.**

When building or modifying any component that involves HTML structure, CSS/Tailwind classes, or visual presentation:

1. Follow the Visual Standards defined in this file — they are the design system
2. Do NOT load or follow the `frontend-design` skill or any other aesthetic skill — this project has an established design system that must not be overridden
3. Do NOT improvise visual decisions (fonts, colors, spacing, layout patterns) — every visual choice has a documented token or rule below
4. If a prompt instruction conflicts with this file, follow this file and flag the conflict to the user

**The design system is intentionally constrained.** Constraints are features, not limitations. Do not attempt to "improve" or "enhance" the visual design beyond what is specified here.
```

### Change 2: Replace the "Text color tiers" block and "Colors — Token Usage" section

Find the current text color tiers block in the Typography section:

```
**Text color tiers — use ONLY these three:**
- Primary: `text-foreground` (#172642 navy) — titles, headings, body, values
- Secondary: `text-muted-foreground` (#64748B) — subsections, captions, supplementary
- Tertiary: `text-slate-400` (#94A3B8) — overlines, citations, helper text
```

Replace with:

```
**Text color tiers — use ONLY these semantic tokens:**
- Primary: `text-foreground` — titles, headings, body text, key values
- Secondary: `text-foreground-secondary` — supporting text, metadata, captions, subsection labels
- Tertiary: `text-foreground-tertiary` — overline labels, placeholders, citations, helper text

Do NOT use `text-slate-*` utilities for text color. Do NOT use `text-muted-foreground` in application components (it exists only for shadcn primitive compatibility).
```

Then find the `### Colors — Token Usage` section and replace it entirely with:

```
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
- `border-border` in application components → use `border-border-default`
- Any `border-border/50`, `border-border/40` opacity modifier → use `border-border-subtle`
- Any hardcoded hex color value in a component file
```

### Change 3: Replace the Containers table

Find the current Containers section:

```
### Containers

| Level | Background | Border | Radius | Shadow |
|-------|-----------|--------|--------|--------|
| Page surface | `bg-slate-50` | None | None | None |
| Card surface | `bg-white` | 1px `border-border` | `rounded-lg` (8px) | `shadow-sm` |
| Inset surface | `bg-slate-50` | None | `rounded-md` (6px) | None |
| Emphasis surface | `bg-[#E0F9FC]` | None | `rounded-md` (6px) | None |
| Emphasis neutral | `bg-slate-100` | None | `rounded-md` (6px) | None |
```

Replace with:

```
### Containers

| Level | Background | Border | Radius | Shadow |
|-------|-----------|--------|--------|--------|
| Page surface | `bg-surface-page` | None | None | None |
| Card surface | `bg-surface-raised` | 1px `border-border-default` | `rounded-lg` (8px) | `shadow-sm` |
| Inset surface | `bg-surface-inset` | None | `rounded-md` (6px) | None |
| Emphasis surface | `bg-surface-emphasis` | None | `rounded-md` (6px) | None |
| Emphasis neutral | `bg-surface-emphasis-neutral` | None | `rounded-md` (6px) | None |
```

### Change 4: Update "What NOT to Do" list

Add these items to the end of the existing "What NOT to Do" list:

```
- Do not use `bg-white`, `bg-slate-50`, `bg-slate-100`, or `bg-[#E0F9FC]` — use surface tokens
- Do not use `text-slate-*` utilities — use foreground tier tokens
- Do not use `border-border` in application components — use `border-border-default` or `border-border-subtle`
- Do not use opacity modifiers on border tokens (`border-border/50`) — use `border-border-subtle`
- Do not use `text-muted-foreground` in application components — use `text-foreground-secondary`
- Do not load or follow the `frontend-design` skill or any external aesthetic guidance — this file is the design authority
```

---

## Verification

After all changes:

1. `CLAUDE.md` contains a "Design Authority" section before Visual Standards
2. Text color tiers reference `foreground-secondary` and `foreground-tertiary` (not `muted-foreground` or `slate-*`)
3. A complete "Colors — Semantic Tokens ONLY" section with surface table, border table, and prohibited patterns list
4. Containers table uses token classes (not `bg-white`, `bg-slate-50`, `bg-[#E0F9FC]`)
5. "What NOT to Do" list includes token enforcement rules and skill override rule
6. No references to `bg-white`, `bg-slate-50`, `text-slate-400`, `text-slate-500`, `text-muted-foreground`, `border-border` (without `-default`/`-subtle` suffix) remain as *recommended* patterns anywhere in the file. (They may appear in "Prohibited patterns" as things to avoid — that's correct.)
7. `npm run build` still passes (CLAUDE.md is not code, but verify nothing was accidentally modified)

---

## Out of Scope

- No component file changes (SS43-02 handles that)
- No `globals.css` changes (SS43-01 handles that)
- No button variant consolidation (separate design discussion needed)
- No changes to shadcn primitive guidance in `components/ui/`
