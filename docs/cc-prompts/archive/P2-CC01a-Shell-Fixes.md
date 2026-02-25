# P2-CC01a — App Shell Fixes: Remove Search, Restore Content Containment

**Follows:** P2-CC01 (App Shell: Top Nav Replaces Sidebar)  
**Reference spec:** `Specs/P2-Spec-01_Unified-View-Architecture.md` (Section 2.1)  
**Created:** 2026-02-24 (P2-S04)

---

## Goal

Two structural fixes to the app shell built in CC01:

1. **Remove district search from the top nav bar.** Search does not belong in the global nav. It is a contextual feature scoped to the discovery/district/playbook flow and will be implemented as a persistent bar below the top nav in a later CC prompt. For now, remove it entirely — the top nav should contain only: Logo (left), four nav items (center), user menu (right).

2. **Restore content containment.** Add a shared content wrapper in the dashboard layout with consistent padding and a max-width token. All pages should render within this container.

---

## Changes

### 1. Top nav — remove search

In `src/components/layout/top-nav.tsx`:
- Remove the search input placeholder (the pill-shaped "Search districts..." element)
- The nav bar should now be: Logo left, nav items centered, user menu right
- This simplifies the layout and removes the crowding

### 2. Content containment — add layout token and wrapper

**Add a CSS custom property** in `src/app/globals.css` under the layout tokens section:

```css
--content-max-width: 87.5rem; /* 1400px */
```

**Add a Tailwind utility** so pages and the layout can reference it. In `src/app/globals.css` inside the `@theme inline` block (or equivalent Tailwind v4 config), register:

```css
--max-width-content: var(--content-max-width);
```

This enables usage as `max-w-content` in Tailwind classes.

**Update the dashboard layout** (`src/app/(dashboard)/layout.tsx`):

Wrap `{children}` in a content container with consistent spacing:

```tsx
<main style={{ paddingTop: 'var(--topbar-height)' }}>
  <div className="max-w-content mx-auto px-6 py-6">
    {children}
  </div>
</main>
```

This restores the containment pattern from P1 but uses a design token instead of the hardcoded `max-w-[1400px]`.

**Note:** Check if the existing `--content-width: 900px` variable in globals.css is still used anywhere. That was a narrower P1 content column token. If it's still referenced by components (e.g., `max-w-content` classes on the district page), either rename it to `--content-width-narrow` to avoid collision, or audit and remove if unused. The new `--content-max-width` is the layout-level container width.

### 3. Remove per-page max-width if redundant

If any pages (e.g., the district detail page) have their own `max-w-content` or `max-w-[1400px]` wrappers that are now redundant with the layout container, remove them to avoid double-constraining. The layout wrapper is the single source of content containment.

---

## Acceptance Criteria

1. Top nav has three zones only: logo, nav items, user menu. No search input.
2. All pages render within a centered container with `max-w-content` (1400px), `px-6` horizontal padding, `py-6` vertical padding
3. Content no longer bleeds to viewport edges on any page
4. `max-w-content` resolves to `--content-max-width` (87.5rem / 1400px) via a design token, not a hardcoded Tailwind arbitrary value
5. No layout breakage on any existing page
6. No TypeScript errors

## What NOT To Do

- Do not add search functionality or a search placeholder anywhere — search will be handled in a future CC prompt as a contextual bar
- Do not modify page-level components — only layout and top-nav
- Do not change the top nav height or breadcrumb bar
