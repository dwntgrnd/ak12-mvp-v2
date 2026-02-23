# SS45-01: Design System Living Style Guide Page

**Priority:** Execute first  
**Dependencies:** SS43-01 and SS43-02 completed (token definitions and migration)  
**Estimated scope:** Single page with 6 tab sections, ~600-800 lines total

---

## Objective

Create a living design system style guide at `/dev/design-system` that renders the full token inventory from `globals.css` and `design-tokens.ts` using actual CSS variables and real UI components. This page serves as both a developer reference and a source for Figma Code-to-Canvas capture.

## Key Principles

- **Single source of truth:** Every color, size, and spacing value must reference CSS custom properties or imports from `design-tokens.ts` — zero hardcoded values
- **Real components:** Use actual `Button`, `Badge`, `Tabs`, `Input` components from `@/components/ui/` wherever possible
- **Figma capture ready:** Include the Figma HTML-to-Design capture script (same pattern as `/palette-ref/page.tsx`)
- **Standalone route:** Lives outside `(dashboard)` route group — no sidebar/topbar chrome

## Route Structure

```
src/app/dev/design-system/
  page.tsx          — main page (client component)
  _components/      — tab section components (keeps page.tsx clean)
    colors-tab.tsx
    typography-tab.tsx
    buttons-tab.tsx
    surfaces-tab.tsx
    spacing-tab.tsx
    components-tab.tsx
```

## Implementation Details

### Page Shell (`page.tsx`)

- `'use client'` directive
- Import `Script` from `next/script` — load `https://mcp.figma.com/mcp/html-to-design/capture.js` via `strategy="afterInteractive"` (enables Figma Code-to-Canvas capture)
- Use `Tabs`, `TabsList`, `TabsTrigger`, `TabsContent` from `@/components/ui/tabs`
- Six tabs: Colors, Typography, Buttons, Surfaces, Spacing, Components
- Page header: dark bar using `bg-topbar` with `text-sidebar-foreground`, displays "AK12-MVP-v2 Design System" title with cyan dot accent (`bg-sidebar-active`), date stamp
- Footer: token counts, source file references
- Max width: `max-w-5xl mx-auto`
- Background: `bg-background` (uses CSS var)

### Colors Tab (`colors-tab.tsx`)

**Swatch component:**
- Renders a color square with the CSS variable name, HSL value, and computed hex
- HSL-to-hex conversion utility (inline helper function)
- Text color adapts based on lightness (light bg → dark text, dark bg → light text)

**Sections:**

1. **Core tokens** — `--background`, `--foreground`, `--card`, `--card-foreground`, `--popover`, `--popover-foreground`
2. **Brand tokens** — `--primary`, `--primary-foreground`, `--brand-orange`, `--district-link`
3. **Semantic tokens** — `--destructive`, `--success`, `--warning` (each with foreground)
4. **Neutral tokens** — `--secondary`, `--muted`, `--muted-foreground`, `--accent`, `--border`, `--input`, `--ring`
5. **Text color tiers** — `--foreground`, `--foreground-secondary`, `--foreground-tertiary` rendered as sample sentences on white background, each with WCAG contrast ratio badge (compute ratio inline, show "AA", "AA Large", or "Fail")
6. **Sidebar & navigation** — `--sidebar-bg`, `--topbar-bg`, `--sidebar-fg`, `--sidebar-hover`, `--sidebar-active` with a mini sidebar preview (same layout as the artifact reference)
7. **Fit categories** — Strong/Moderate/Low fit badges using `fitCategoryColors` from `design-tokens.ts`

**Token value source:** Define a `TOKEN_MAP` constant that lists each token name and its HSL value string. This is the one place where HSL values are duplicated from `globals.css` — necessary because CSS custom properties can't be read at build time in a server-safe way. Add a comment: `// Keep in sync with globals.css :root block`

### Typography Tab (`typography-tab.tsx`)

**Sections:**

1. **Typeface** — State "Manrope" as heading + body font, reference `--font-heading` and `--font-body`
2. **Scale** — Render each level at its actual computed size using inline `style={{ fontSize: 'var(--font-size-page-title)' }}` etc. Show token name, computed px at base 16, ratio, and Tailwind class mapping
   - Page Title: `--font-size-page-title` / `text-page-title` / `text-2xl`
   - Section Heading: `--font-size-section-heading` / `text-section-heading` / `text-lg`
   - Subsection Heading: `--font-size-subsection-heading` / `text-subsection-heading`
   - Body: `--font-size-body` / `text-body` / `text-sm`
   - Subsection Sm: `--font-size-subsection-sm` / `text-subsection-sm`
   - Caption: `--font-size-caption` / `text-caption` / `text-xs`
   - Overline: `--font-size-overline` / `text-overline`
3. **Font weights** — Regular (400), Medium (500), Semibold (600), Bold (700) with usage notes
4. **Text tiers in context** — A realistic district card snippet using all three text color tiers

### Buttons Tab (`buttons-tab.tsx`)

**Use the actual `Button` component** from `@/components/ui/button` with real variant and size props.

**Sections:**

1. **All variants** — For each variant (`default`, `outlineBrand`, `outline`, `ghost`, `destructive`, `link`):
   - Variant name as monospace label with description
   - Render at `sm`, `default`, and `lg` sizes
   - Render disabled state
2. **Focus ring** — Show a button with simulated focus ring, note that all focus uses `ring-ring` token
3. **Contextual usage** — A district identity bar mockup showing `default` (Generate Playbook), `outlineBrand` (View Playbook), and `outline` (Find Similar) together using real `Button` components

### Surfaces Tab (`surfaces-tab.tsx`)

**Sections:**

1. **Surface tier swatches** — `--surface-page`, `--surface-raised`, `--surface-inset`, `--surface-emphasis`, `--surface-emphasis-neutral`
2. **Nested hierarchy demo** — Concentric containers showing page → raised (card) → inset and emphasis variants. Use actual CSS variable references: `style={{ backgroundColor: 'hsl(var(--surface-page))' }}` etc.
3. **Border tiers** — `--border-default` and `--border-subtle` with sample containers
4. **Border radius** — Visual scale: none, sm (4px), md/--radius (8px), lg (12px), full (9999px)
5. **Layout tokens** — Table showing `--topbar-height`, `--utility-bar-height`, `--sidebar-width`, `--sidebar-width-collapsed`, `--content-width` with values

### Spacing Tab (`spacing-tab.tsx`)

**Sections:**

1. **Tailwind spacing scale** — Visual bars at Tailwind increments (1/4px through 16/64px), colored with `bg-primary` at reduced opacity
2. **Gestalt proximity demo** — Form fields showing label-to-input gap (tight, ~6px) vs field-to-field gap (loose, ~16px) using real `Input` component from `@/components/ui/input`

### Components Tab (`components-tab.tsx`)

**Sections:**

1. **Card composition** — A district list card with fit badge, emphasis surface, and button row. Use real `Button` and `Badge` components where possible
2. **Alert/status states** — Success, Warning, Error, Info alert rows (styled inline, not using Alert component unless it supports these variants)
3. **Badge variants** — Active, Pending, Draft, Archived, Error, K-12, Elementary — using `Badge` component with custom className overrides for color
4. **Input states** — Default, Focused (simulated), Error, Disabled using real `Input` component with appropriate styling

## Cleanup

After this page is verified working:
- The existing `/palette-ref` route can be deprecated (don't delete yet — leave it for reference)
- Add a comment at the top of `/palette-ref/page.tsx`: `// DEPRECATED: Superseded by /dev/design-system — see SS45-01`

## What NOT to Do

- Do NOT use the `frontend-design` skill — this page must match the established design system exactly
- Do NOT hardcode any color hex values in component styles — use CSS variables via `hsl(var(--token-name))` or Tailwind token classes
- Do NOT import from external icon libraries — use inline SVG or text only for this reference page
- Do NOT add this route to the sidebar navigation — it's a dev-only tool
- Do NOT create a separate layout.tsx for `/dev/` — the root layout is sufficient

## Verification

- [ ] Page loads at `http://localhost:3000/dev/design-system`
- [ ] All six tabs render and switch correctly
- [ ] Colors match what's rendered in the main app (visually compare a sidebar, a button, a card)
- [ ] Button variants render using real `Button` component with correct visual output
- [ ] Typography sizes match the token scale (page title visibly larger than section heading, etc.)
- [ ] Surface hierarchy shows clear visual differentiation between tiers
- [ ] No TypeScript errors, no console warnings
- [ ] Figma capture script loads (check Network tab for `capture.js`)
