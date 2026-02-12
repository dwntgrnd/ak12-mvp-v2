---
phase: 07-user-management
plan: 02
subsystem: user-management
tags:
  - frontend
  - ui
  - admin
  - user-management
  - role-based-access
dependency_graph:
  requires:
    - GET /api/users
    - POST /api/users/invite
    - PATCH /api/users/[userId]/deactivate
    - PATCH /api/users/[userId]/reactivate
    - TenantUser type
    - InviteUserRequest type
  provides:
    - Admin page at /admin with user management UI
    - UsersList component
    - InviteUserForm component
    - Role-based admin nav gating in sidebar
    - GET /api/users/me (lightweight role endpoint)
  affects:
    - Sidebar navigation (admin nav now role-gated)
    - Admin user experience (complete user management interface)
tech_stack:
  added:
    - Client-side user management UI with fetch pattern
    - Key-based refresh pattern for list updates
    - Role-based navigation gating via client-side fetch
  patterns:
    - Key-based refresh: parent increments key to force child re-mount
    - Optimistic UI updates: local state mutations on deactivate/reactivate
    - Status badge color coding (active/pending/deactivated)
    - Confirmation dialogs for destructive actions
    - Client-side role fetch for navigation gating
key_files:
  created:
    - src/components/admin/users-list.tsx
    - src/components/admin/invite-user-form.tsx
    - src/app/api/users/me/route.ts
  modified:
    - src/app/(dashboard)/admin/page.tsx
    - src/components/layout/sidebar.tsx
decisions:
  - decision: "Key-based refresh pattern for list updates after invite"
    rationale: "Simple, reliable pattern that forces UsersList to re-mount and re-fetch data when key changes"
    impact: "Parent component manages refresh state, child components remain simple"
  - decision: "Client-side role fetch in sidebar via /api/users/me endpoint"
    rationale: "Sidebar is client component using Clerk hooks; role lives in local DB. Lightweight endpoint avoids coupling to Clerk metadata"
    impact: "One extra API call on sidebar mount; safe default (null) hides admin nav while loading"
  - decision: "Status badge color coding: green (active), yellow (pending), red (deactivated)"
    rationale: "Visual consistency with common UI patterns; immediate status recognition"
    impact: "Users can quickly scan user list and identify status at a glance"
  - decision: "Confirmation dialog for deactivate action only"
    rationale: "Deactivation is destructive (user loses access); reactivation is safe recovery"
    impact: "Prevents accidental user lockouts while allowing quick reactivation"
metrics:
  duration: "2min 10s"
  completed: "2026-02-12"
---

# Phase 7 Plan 02: Admin User Management UI & Sidebar Role Gating Summary

**Admin interface with users list, invite form, and role-based admin nav gating**

## What Was Built

### Admin User Management Interface

**src/app/(dashboard)/admin/page.tsx** - Full admin page with user management:
- Replaced stub page with complete user management interface
- Key-based refresh pattern: maintains `refreshKey` state, passed to UsersList as key prop
- InviteUserForm calls `onSuccess` callback to increment key and trigger list refresh
- Two-column layout on large screens: invite form (left), users list (right)
- Stacked layout on small screens for mobile responsiveness

**src/components/admin/users-list.tsx** - Users table component:
- Fetches from GET /api/users on mount via useEffect
- Table with 5 columns: Name, Email, Role, Status, Actions
- Status badges with color coding:
  - Active: green badge (bg-green-100 text-green-800)
  - Pending: yellow badge (bg-yellow-100 text-yellow-800)
  - Deactivated: red badge (bg-red-100 text-red-800)
- Role display: "Admin" for publisher-admin, "Rep" for publisher-rep
- Action buttons:
  - Active users: "Deactivate" button (red, with confirmation dialog)
  - Deactivated users: "Reactivate" button (green, no confirmation)
  - Pending users: no action buttons (dash placeholder)
- Optimistic UI: updates local state on successful deactivate/reactivate
- Loading state: "Loading users..." message
- Error state: displays error message
- Empty state: "No users found" message

**src/components/admin/invite-user-form.tsx** - Invite form component:
- Three form fields: Email (email input), Display Name (text input), Role (select dropdown)
- Role options: "Sales Rep" (publisher-rep), "Admin" (publisher-admin)
- Default role: publisher-rep
- Submit handler POSTs to /api/users/invite
- Success: clears form and calls onSuccess callback to refresh list
- Error handling:
  - 409 Conflict: "A user with this email already exists"
  - Other errors: displays error message from API
- Submit button loading state: "Send Invite" → "Inviting..."
- Styled as card with rounded-lg border and padding

### Sidebar Role-Based Gating

**src/app/api/users/me/route.ts** - Lightweight role endpoint:
- GET endpoint that calls getCurrentUser() and returns `{ role: user.role }`
- On auth error: returns `{ role: null }` with 200 status (safe default, doesn't break sidebar)
- Minimal overhead: only returns role field, not full user object

**src/components/layout/sidebar.tsx** - Role-based admin nav:
- Added useState hook: `userRole` state (string | null)
- Added useEffect hook: fetches from GET /api/users/me on mount, sets userRole
- Replaced `const showAdminNav = true` with `const showAdminNav = userRole === 'publisher-admin' || userRole === 'super-admin'`
- Removed TODO comment: "TODO: Gate admin nav based on user role from local DB (Phase 7)"
- Safe default: while role is null (loading), admin nav is hidden
- Admin nav appears only after role loads and matches admin roles

## Deviations from Plan

None - plan executed exactly as written.

## Key Decisions Made

### 1. Key-Based Refresh Pattern
**Decision:** Parent component manages refreshKey state, passes to UsersList as key prop
**Rationale:** Simple, reliable pattern that forces component re-mount and re-fetch when key changes. No need for ref forwarding or complex callback chains.
**Impact:** InviteUserForm calls onSuccess → parent increments refreshKey → UsersList remounts and fetches fresh data

### 2. Client-Side Role Fetch in Sidebar
**Decision:** Create /api/users/me endpoint and fetch role client-side in sidebar
**Rationale:** Sidebar is client component using Clerk's useUser() hook. Role lives in local DB, not Clerk. Lightweight endpoint avoids coupling to Clerk metadata or server component conversion.
**Impact:** One extra API call on sidebar mount; minimal overhead. Safe default (null) hides admin nav while loading, preventing unauthorized access flash.

### 3. Status Badge Color Coding
**Decision:** Green (active), yellow (pending), red (deactivated)
**Rationale:** Visual consistency with common UI patterns; red = blocked, yellow = waiting, green = good. Immediate status recognition without reading text.
**Impact:** Users can quickly scan user list and identify status at a glance; reduces cognitive load

### 4. Confirmation Dialog for Deactivate Only
**Decision:** Show window.confirm for deactivate action, but not for reactivate
**Rationale:** Deactivation is destructive (user loses access immediately); reactivation is safe recovery action
**Impact:** Prevents accidental user lockouts while allowing quick reactivation. Admin can fix mistakes easily.

## Task Breakdown

### Task 1: Build Admin Users Management Page with List and Invite Form
**Duration:** ~1m 5s
**Files created:**
- src/components/admin/users-list.tsx (215 lines)
- src/components/admin/invite-user-form.tsx (120 lines)
- src/app/(dashboard)/admin/page.tsx (32 lines, replaced stub)

Implemented:
- UsersList component with table display, status badges, action buttons
- Fetch from GET /api/users on mount
- Deactivate action: confirmation dialog → PATCH /api/users/{userId}/deactivate → update local state
- Reactivate action: PATCH /api/users/{userId}/reactivate → update local state
- InviteUserForm with email, displayName, role fields
- POST to /api/users/invite on submit
- Form validation and error handling (duplicate email shows specific message)
- Admin page with key-based refresh pattern

**Commit:** `03206cd` - feat(07-02): build admin users management UI with list and invite form

### Task 2: Gate Sidebar Admin Nav by User Role from Database
**Duration:** ~1m 5s
**Files created:**
- src/app/api/users/me/route.ts (20 lines)

**Files modified:**
- src/components/layout/sidebar.tsx

Implemented:
- /api/users/me endpoint: calls getCurrentUser(), returns { role } or { role: null } on error
- Sidebar: added userRole state, useEffect to fetch role on mount
- Updated showAdminNav logic: checks for publisher-admin or super-admin
- Removed hardcoded `showAdminNav = true` and Phase 7 TODO comment
- Admin nav now conditionally renders based on database role

**Commit:** `60e26bf` - feat(07-02): gate sidebar admin nav by database role

## Verification Results

✓ TypeScript compilation passes with zero errors
✓ /admin page renders UsersList and InviteUserForm components
✓ UsersList fetches from GET /api/users
✓ InviteUserForm POSTs to /api/users/invite
✓ Deactivate button calls PATCH /api/users/[userId]/deactivate
✓ Reactivate button calls PATCH /api/users/[userId]/reactivate
✓ Sidebar admin nav gated by role (not hardcoded true)
✓ Phase 7 TODO comment removed from sidebar
✓ /api/users/me endpoint exists and returns role

## Technical Implementation Notes

### Key-Based Refresh Pattern
Parent component maintains `refreshKey` state. When InviteUserForm succeeds, it calls `onSuccess()` callback which increments the key. UsersList receives the key as its `key` prop, forcing React to unmount and remount the component, triggering a fresh data fetch.

```typescript
const [refreshKey, setRefreshKey] = useState(0);
const handleInviteSuccess = () => setRefreshKey((prev) => prev + 1);

// In render:
<InviteUserForm onSuccess={handleInviteSuccess} />
<UsersList key={refreshKey} />
```

### Optimistic UI Updates
After successful deactivate/reactivate API calls, component updates local state array using map:
```typescript
setUsers((prev) =>
  prev.map((u) => (u.userId === updatedUser.userId ? updatedUser : u))
);
```

No full list refetch needed; immediate UI feedback.

### Role-Based Navigation Gating
Sidebar fetches role on mount via lightweight endpoint. While role is null (loading or unauthenticated), admin nav is hidden. Once role loads, admin nav appears only for publisher-admin or super-admin users.

Safe default: unauthorized users never see admin nav, even during initial load.

### Status Badge Component Logic
Status badges use Tailwind utility classes for color coding. Badge color and text determined by switch statement on status value:
- `active` → bg-green-100 text-green-800
- `pending` → bg-yellow-100 text-yellow-800
- `deactivated` → bg-red-100 text-red-800

Consistent with existing UI patterns in the app (fit badges, section status indicators).

### Confirmation Dialog Pattern
`window.confirm()` used for destructive actions. Returns boolean; action proceeds only if true. Simple, native, accessible. No modal component needed for MVP.

## Self-Check: PASSED

**Files created:**
- ✓ src/components/admin/users-list.tsx exists
- ✓ src/components/admin/invite-user-form.tsx exists
- ✓ src/app/api/users/me/route.ts exists

**Files modified:**
- ✓ src/app/(dashboard)/admin/page.tsx updated (stub replaced)
- ✓ src/components/layout/sidebar.tsx updated (role gating implemented)

**Commits exist:**
- ✓ 03206cd: feat(07-02): build admin users management UI with list and invite form
- ✓ 60e26bf: feat(07-02): gate sidebar admin nav by database role

All claims verified.
