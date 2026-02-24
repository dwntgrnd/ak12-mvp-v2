# P2-CC01 — App Shell: Top Nav Replaces Sidebar

**Reference spec:** `Specs/P2-Spec-01_Unified-View-Architecture.md` (Section 2.1 — App Shell)  
**Sequence:** CC01 of 3 (CC01 → CC02 → CC03)  
**Created:** 2026-02-24 (P2-S04)

---

## Goal

Replace the P1 left sidebar + content-utility-bar layout with a single sticky top navigation bar. The unified district view needs full viewport width — a 240-280px sidebar steals space every stacked layer needs. This is structural scaffolding only: functional nav, search placeholder, breadcrumbs, user menu. No content changes to any page.

---

## What Changes

### New files

- `src/components/layout/top-nav.tsx` — The new sticky top nav bar component
- `src/components/layout/app-shell-context.tsx` — Replaces `sidebar-context.tsx`. Retains `breadcrumbOverride`, `setBreadcrumbOverride`, `pageActions`, `setPageActions`. Drops all sidebar collapse state (`sidebarCollapsed`, `toggleSidebar`, `setSidebarCollapsed`). Rename the hook to `useAppShell()`.

### Modified files

- `src/app/(dashboard)/layout.tsx` — Remove `Sidebar` import, remove `SidebarProvider` (replace with `AppShellProvider`), remove `ContentUtilityBar`. Replace two-column flex layout (sidebar + content) with single full-width column below top nav. Remove `max-w-[1400px]` constraint on main content wrapper — pages now own their own max-width if they need one.
- `src/app/(dashboard)/districts/[districtId]/page.tsx` — Change `useSidebar()` → `useAppShell()` for `setBreadcrumbOverride`. No other changes.
- `src/app/globals.css` — Remove `--sidebar-width` and `--sidebar-width-collapsed` variables. Remove `--utility-bar-height`. Keep `--topbar-height` (update value if the two-row nav approach changes the combined height).
- Any other file that imports from `sidebar-context` — find all with `grep -r "useSidebar\|sidebar-context" src/` and update to `useAppShell` / `app-shell-context`.

### Files to soft-deprecate (remove from import chain, do NOT delete)

- `src/components/layout/sidebar.tsx`
- `src/components/layout/sidebar-context.tsx`
- `src/components/layout/sidebar-nav-item.tsx`
- `src/components/layout/content-utility-bar.tsx`

Don't delete these yet — remove them from the dashboard layout import chain only. Dead import cleanup is a follow-up.

---

## Top Nav Specification

```
┌──────────────────────────────────────────────────────────────────┐
│  [Logo]    [🔍 Search districts...]    Disc  Saved  PB  Sol  [👤] │
└──────────────────────────────────────────────────────────────────┘
│  Discovery > [District Name]                    [lens indicator] │
└──────────────────────────────────────────────────────────────────┘
```

Two rows — primary nav bar + breadcrumb bar.

### Row 1: Primary nav bar

**Structure (left → center → right):**

1. **Logo (left):** Brand mark — `AlchemyK12` with orange accent on `K12`. Use existing topbar markup as reference. Clicking logo navigates to `/discovery`.

2. **District search (left-center):** Pill-shaped input placeholder, approximately 200px collapsed width. Text: "Search districts..." with a `Search` lucide icon. **For CC01, this is a visual placeholder only — no functional search, no dropdown, no typeahead.** Clicking it does nothing beyond default focus styling. Functional search is a later CC prompt.

3. **Nav items (center):** Four items — Discovery (`/discovery`), Saved Districts (`/saved`), Playbooks (`/playbooks`), Solutions (`/solutions`). Active state: bottom border indicator + foreground text color. Inactive: `text-sidebar-foreground/70`. Use `Link` from `next/link`.

4. **User menu (right):** Avatar circle (keep existing style — initials on `warning` background). Clicking opens a shadcn `DropdownMenu` with three items:
   - Admin (links to `/admin`) — **only visible** when user role is `publisher-admin` or `super-admin` (fetch from `/api/users/me`, same pattern as current sidebar)
   - Settings (placeholder, no route — disabled or console.log)
   - Logout (placeholder, no route — disabled or console.log)

**Active nav detection logic** (migrated from sidebar):
```
Discovery:  pathname === '/discovery' || pathname.startsWith('/districts')
Saved:      pathname.startsWith('/saved')
Playbooks:  pathname.startsWith('/playbooks')
Solutions:  pathname.startsWith('/solutions')
```

### Row 2: Breadcrumb bar

A secondary slim bar below the primary nav bar. Same dark background, smaller text (`text-sm` or `--font-size-caption`), left-aligned.

**Left side:** Breadcrumbs — migrate logic from `content-utility-bar.tsx` (`useBreadcrumbs` function). Same route-based logic:
- `/districts/*` → `Discovery > [breadcrumbOverride ?? 'District']`
- `/solutions/*` detail → `Solutions Library > [breadcrumbOverride ?? 'Product']`
- Top-level routes → single label (Discovery, Saved Districts, etc.)

**Right side:** Product lens indicator — migrate from `content-utility-bar.tsx`. When `useProductLens().isLensActive` is true, show the active product name with colored dot and dismiss button. Same existing markup pattern.

**Center:** `pageActions` slot — if `useAppShell().pageActions` is set, render it here.

**Height:** approximately `2rem` (32px). Update `--topbar-height` to reflect combined height of both rows (e.g., `5.5rem` for 56px + 32px = 88px). All content padding uses `var(--topbar-height)`.

### Visual tokens

- Background (both rows): `bg-topbar` (maps to `--topbar-bg`, the dark navy `213 47% 17%`)
- Text: `text-sidebar-foreground` for primary, `text-sidebar-foreground/70` for inactive
- Position: `fixed top-0 left-0 right-0 z-50`
- Border: `border-b border-white/10` on the bottom of row 2 (not between rows)
- Nav active indicator: `border-b-2 border-[hsl(var(--brand-blue))]` on the active nav item

---

## Dashboard Layout After Changes

```tsx
// Target structure (conceptual — adapt to actual imports)
<AppShellProvider>
  <TooltipProvider>
    <div className="min-h-screen">
      <TopNav />
      <main style={{ paddingTop: 'var(--topbar-height)' }}>
        {children}
      </main>
    </div>
  </TooltipProvider>
</AppShellProvider>
```

Pages now render full-width. Each page is responsible for its own `max-w-*` and `px-*` if needed. The dashboard layout no longer constrains content width.

---

## AppShellContext API

```ts
interface AppShellContextValue {
  // Breadcrumb override — pages set this to show the current entity name
  breadcrumbOverride: string | null;
  setBreadcrumbOverride: (label: string | null) => void;
  // Page actions — pages inject action buttons into the top nav area
  pageActions: React.ReactNode | null;
  setPageActions: (node: React.ReactNode | null) => void;
}
```

No sidebar state. No collapse toggle. No localStorage persistence for sidebar.

The provider and hook:
- `AppShellProvider` wraps the dashboard layout
- `useAppShell()` is the consuming hook (throws if used outside provider)

---

## Acceptance Criteria

1. All four nav items render in the top bar and navigate correctly
2. Active nav state visually indicates the current section (including Discovery active when on `/districts/*`)
3. Breadcrumbs display correctly for all existing routes (Discovery, Saved, Solutions, Playbooks, district detail, product detail)
4. Breadcrumb override works — navigating to a district shows the district name in the breadcrumb
5. Product lens indicator appears in breadcrumb bar when lens is active (existing `useProductLens` hook)
6. User menu dropdown shows Admin link conditionally based on user role
7. No sidebar visible. Full viewport width available for content.
8. District search input is visible as a styled placeholder (no functionality)
9. Existing pages render correctly with no layout breakage — spot-check: Discovery, Saved Districts, a district detail page, Solutions, Playbooks, Admin
10. No TypeScript errors, no console errors on navigation between pages

---

## What NOT To Do

- Do not implement search functionality (visual placeholder only)
- Do not modify any page content or components — only layout/shell
- Do not delete the old sidebar files — just remove them from the import chain
- Do not change route file locations or names
- Do not touch anything in `/src/components/district-profile/`, `/src/components/playbook/`, or `/src/components/solutions/`
- Do not add new CSS color values — use existing design tokens and CSS variables only
