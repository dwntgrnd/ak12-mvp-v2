# P2-CC02 — Route Scaffolding

**Scope:** Nested playbook route, 301 redirect, breadcrumb system upgrade, card link updates.

**Before starting:** Read `CLAUDE.md` and the P2 spec at `Specs/P2-Spec-01_Unified-View-Architecture.md` (Obsidian vault — path in CLAUDE.md Key File References).

---

## Four deliverables, in order:

### 1. Nested playbook route

Create `src/app/(dashboard)/districts/[districtId]/playbooks/[playbookId]/page.tsx`.

For now, this is a **thin wrapper** that renders the existing playbook detail content within the district URL context. It does NOT yet implement the unified view layers (data strip, mode bar) — that's CC03.

Implementation:
- Copy the rendering logic from the current `/playbooks/[playbookId]/page.tsx` into the new nested route
- Extract `districtId` and `playbookId` from `params`
- The page should set breadcrumbs via the updated `useAppShell()` (see deliverable 3)
- Validate that `playbook.districtId` matches the URL's `districtId`. If mismatch, redirect to the correct nested URL
- Keep all existing playbook functionality (tabs, inline edit, regeneration, delete, polling)
- On delete, navigate to `/districts/[districtId]` instead of `/playbooks`
- Replace the "Back to Playbooks" link with breadcrumb navigation (the breadcrumb bar handles this now)

### 2. Redirect from standalone playbook route

Replace the content of `src/app/(dashboard)/playbooks/[playbookId]/page.tsx` with a redirect page:

- Fetch the playbook from `/api/playbooks/[playbookId]` to get `districtId`
- Use `router.replace()` to send the user to `/districts/[districtId]/playbooks/[playbookId]`
- Show a brief loading state while fetching
- If the playbook is not found, show the existing error state (not found message with link back to `/playbooks`)
- This is a permanent redirect conceptually — `router.replace()` avoids a back-button loop

### 3. Breadcrumb system upgrade

Update `AppShellContext` to support structured breadcrumb data instead of a single string override.

**New type:**

```typescript
interface BreadcrumbSegment {
  label: string;
  href?: string; // If provided, segment is a link. If omitted, it's the current page (terminal).
}
```

**Update `src/components/layout/app-shell-context.tsx`:**
- Replace `breadcrumbOverride: string | null` with `breadcrumbs: BreadcrumbSegment[] | null`
- Replace `setBreadcrumbOverride` with `setBreadcrumbs`
- Export the `BreadcrumbSegment` type

**Update `src/components/layout/top-nav.tsx` breadcrumb rendering:**
- When `breadcrumbs` is provided (not null), render those segments directly instead of computing from pathname
- When `breadcrumbs` is null, fall back to the existing pathname-based `useBreadcrumbs()` logic (preserves behavior for pages that haven't migrated)
- Render linked segments as `BreadcrumbLink`, terminal segment (no `href`) as `BreadcrumbPage`
- Separators between each segment

**Update district page** (`src/app/(dashboard)/districts/[districtId]/page.tsx`):
- Change from `setBreadcrumbOverride(district.name)` to:
  ```typescript
  setBreadcrumbs([
    { label: 'Discovery', href: '/discovery' },
    { label: district.name }
  ]);
  ```
- Cleanup: `return () => setBreadcrumbs(null);`

**Nested playbook page** sets:
```typescript
setBreadcrumbs([
  { label: districtName, href: `/districts/${districtId}` },
  { label: playbookName }
]);
```

Note: For MVP, the parent link is always structural (Discovery for districts, district name for playbooks). Origin-aware breadcrumbs are a future enhancement.

### 4. Update playbook card links

In `src/components/playbook/playbook-card.tsx`:
- Change the link from `/playbooks/${playbook.playbookId}` to `/districts/${playbook.districtId}/playbooks/${playbook.playbookId}`
- Add `districtId: string` to the component's `PlaybookCardProps` playbook interface

In `src/app/(dashboard)/playbooks/page.tsx`:
- Add `districtId: string` to the local `PlaybookListItem` type
- Map `districtId` through from the API response (it's already on `PlaybookSummary`)
- Pass it to `PlaybookCard`

---

## Verification checklist

After implementation:
- [ ] `npm run build` compiles clean
- [ ] Navigating to `/districts/[districtId]/playbooks/[playbookId]` renders playbook content
- [ ] Navigating to `/playbooks/[playbookId]` redirects to nested route
- [ ] Breadcrumb on district page: `Discovery > [District Name]`
- [ ] Breadcrumb on nested playbook page: `[District Name] > [Playbook Name]` where district name is a link
- [ ] Playbook cards on `/playbooks` link to nested route
- [ ] Delete from nested playbook navigates to `/districts/[districtId]`
- [ ] Pages that don't set `setBreadcrumbs()` still render breadcrumbs via pathname fallback
- [ ] Product lens indicator in breadcrumb bar still works
- [ ] No TypeScript errors or `any` casts introduced
