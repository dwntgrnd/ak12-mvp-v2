---
phase: 07-user-management
plan: 01
subsystem: user-management
tags:
  - backend
  - api
  - service-layer
  - user-management
  - admin
dependency_graph:
  requires:
    - auth-utils (getCurrentUser)
    - prisma (User model)
    - user types (TenantUser, InviteUserRequest)
  provides:
    - userService.inviteUser
    - userService.getUsers
    - userService.deactivateUser
    - userService.reactivateUser
    - GET /api/users
    - POST /api/users/invite
    - PATCH /api/users/[userId]/deactivate
    - PATCH /api/users/[userId]/reactivate
  affects:
    - Future user management UI (Phase 7 Plan 2)
tech_stack:
  added:
    - User management service layer with tenant scoping
    - Admin-only user management API endpoints
  patterns:
    - TenantId-first parameter pattern for multi-tenant isolation
    - Error code to HTTP status mapping
    - Next.js 15 dynamic params pattern (await params)
    - Admin role authorization guards on all endpoints
    - Validation guards (self-deactivation, last-admin, duplicate email)
key_files:
  created:
    - src/services/user-service.ts
    - src/app/api/users/route.ts
    - src/app/api/users/invite/route.ts
    - src/app/api/users/[userId]/deactivate/route.ts
    - src/app/api/users/[userId]/reactivate/route.ts
  modified: []
decisions:
  - decision: "Placeholder clerkId pattern uses pending_{uuid} format for invited users"
    rationale: "Real Clerk ID will be set when user accepts invite and completes signup - actual Clerk invitation flow is out of MVP scope"
    impact: "Allows user records to exist before Clerk onboarding is complete"
  - decision: "Last-admin check only counts active admins, not pending or deactivated"
    rationale: "Prevents edge case where tenant loses all active admins due to deactivation"
    impact: "Ensures tenant always has at least one active admin"
  - decision: "Self-deactivation explicitly prevented with dedicated error code"
    rationale: "Prevents accidental account lockout"
    impact: "Admins must use another admin account to deactivate their own"
metrics:
  duration: "1min 50s"
  completed: "2026-02-12"
---

# Phase 7 Plan 01: User Management Service & API Summary

**User management backend with invite, list, deactivate, and reactivate operations enforcing admin authorization and tenant scoping**

## What Was Built

### Service Layer

**src/services/user-service.ts** - User management service with 4 functions:
- `inviteUser(tenantId, adminUserId, request)` - Creates User with status 'pending' and placeholder clerkId `pending_{uuid}`
- `getUsers(tenantId)` - Returns all tenant users ordered by createdAt
- `deactivateUser(tenantId, adminUserId, targetUserId)` - Deactivates user with self-deactivation and last-admin guards
- `reactivateUser(tenantId, targetUserId)` - Reactivates deactivated user

All functions use tenant-scoped queries and proper error codes:
- `DUPLICATE_EMAIL` - Email already in use within tenant
- `USER_NOT_FOUND` - User not found or not in admin's tenant
- `CANNOT_DEACTIVATE_SELF` - Prevented self-deactivation attempt
- `LAST_ADMIN` - Cannot deactivate last active admin
- `USER_NOT_DEACTIVATED` - User must be deactivated to reactivate

### API Routes

All routes enforce publisher-admin or super-admin authorization via getCurrentUser() role check.

**GET /api/users** (src/app/api/users/route.ts)
- Lists all users in authenticated admin's tenant
- Returns: `{ users: TenantUser[] }`
- Status: 200 success, 401 unauthorized, 403 forbidden

**POST /api/users/invite** (src/app/api/users/invite/route.ts)
- Invites new user to tenant with email, displayName, role
- Validates required fields and role values
- Creates User with status 'pending'
- Returns: `TenantUser` object
- Status: 201 created, 400 validation error, 401 unauthorized, 403 forbidden, 409 duplicate email

**PATCH /api/users/[userId]/deactivate** (src/app/api/users/[userId]/deactivate/route.ts)
- Deactivates user by ID
- Prevents self-deactivation and last-admin removal
- Returns: Updated `TenantUser` object
- Status: 200 success, 400 validation error, 401 unauthorized, 403 forbidden, 404 not found

**PATCH /api/users/[userId]/reactivate** (src/app/api/users/[userId]/reactivate/route.ts)
- Reactivates deactivated user by ID
- Validates user is currently deactivated
- Returns: Updated `TenantUser` object
- Status: 200 success, 400 validation error, 401 unauthorized, 403 forbidden, 404 not found

## Deviations from Plan

None - plan executed exactly as written.

## Key Decisions Made

### 1. Placeholder Clerk ID Format
**Decision:** Use `pending_{uuid}` pattern for invited users
**Rationale:** Real Clerk ID will be assigned when user accepts invite and completes Clerk signup. This allows user records to exist in database before Clerk onboarding completes.
**Impact:** Future invitation flow will need to update clerkId field when user completes signup.

### 2. Active Admin Guard
**Decision:** Last-admin check only counts users with status='active', not pending or deactivated
**Rationale:** Prevents scenario where tenant loses all active admins through deactivation, even if pending/deactivated admins exist
**Impact:** Ensures tenant always has at least one active, logged-in admin

### 3. Self-Deactivation Prevention
**Decision:** Explicit check for targetUserId === adminUserId with dedicated error code
**Rationale:** Prevents accidental self-lockout by admin
**Impact:** Admins must use another admin account to deactivate their own

## Task Breakdown

### Task 1: Create User Management Service Functions
**Duration:** ~45s
**Files created:** src/services/user-service.ts (164 lines)

Implemented:
- `inviteUser` - Creates pending user with placeholder clerkId, validates email uniqueness within tenant
- `getUsers` - Retrieves tenant-scoped user list
- `deactivateUser` - Validates not self, not last admin, then sets status to 'deactivated'
- `reactivateUser` - Validates user is deactivated, then sets status to 'active'
- `mapToTenantUser` helper - Converts Prisma User to TenantUser type

All functions follow tenantId-first parameter pattern from product-service and district-service.

**Commit:** `9152ef1` - feat(07-01): implement user management service functions

### Task 2: Create User Management API Routes
**Duration:** ~1m 5s
**Files created:**
- src/app/api/users/route.ts (40 lines)
- src/app/api/users/invite/route.ts (82 lines)
- src/app/api/users/[userId]/deactivate/route.ts (67 lines)
- src/app/api/users/[userId]/reactivate/route.ts (59 lines)

Implemented:
- GET /api/users with admin auth guard
- POST /api/users/invite with field validation and admin auth guard
- PATCH /api/users/[userId]/deactivate with Next.js 15 dynamic params pattern
- PATCH /api/users/[userId]/reactivate with Next.js 15 dynamic params pattern

All routes use:
- `getCurrentUser()` at API boundary
- Admin role check (publisher-admin or super-admin)
- Error code to HTTP status mapping
- Consistent error response format

**Commit:** `10c8dbd` - feat(07-01): add user management API routes

## Verification Results

✓ TypeScript compilation passes with zero errors
✓ User service exports all 4 functions: inviteUser, getUsers, deactivateUser, reactivateUser
✓ All 4 API route files exist with correct method exports (GET, POST, PATCH, PATCH)
✓ Admin role check present in all 4 routes
✓ Error codes mapped to correct HTTP statuses:
  - DUPLICATE_EMAIL → 409 Conflict
  - INVALID_EMAIL → 400 Bad Request
  - USER_NOT_FOUND → 404 Not Found
  - CANNOT_DEACTIVATE_SELF → 400 Bad Request
  - LAST_ADMIN → 400 Bad Request
  - USER_NOT_DEACTIVATED → 400 Bad Request
  - UNAUTHENTICATED → 401 Unauthorized

## Technical Implementation Notes

### Tenant Scoping
All service functions accept `tenantId` as first parameter and enforce tenant isolation via Prisma queries. This prevents cross-tenant data access.

### Error Handling Pattern
Following established pattern from district-service.ts:
```typescript
const error: any = new Error(message);
error.code = 'ERROR_CODE';
throw error;
```

API routes map error codes to HTTP statuses for consistent error responses.

### Next.js 15 Dynamic Params
Dynamic route parameters are accessed via `const { userId } = await params;` (params is a Promise). This follows Next.js 15 App Router conventions.

### Admin Authorization
All routes check `user.role !== 'publisher-admin' && user.role !== 'super-admin'` and return 403 Forbidden if check fails. This ensures only admins can manage users.

### Validation Guards
Service layer enforces business rules:
- Email uniqueness within tenant (not globally)
- Self-deactivation prevention
- Last active admin protection
- Reactivation only for deactivated users

## Self-Check: PASSED

**Files created:**
- ✓ src/services/user-service.ts exists
- ✓ src/app/api/users/route.ts exists
- ✓ src/app/api/users/invite/route.ts exists
- ✓ src/app/api/users/[userId]/deactivate/route.ts exists
- ✓ src/app/api/users/[userId]/reactivate/route.ts exists

**Commits exist:**
- ✓ 9152ef1: feat(07-01): implement user management service functions
- ✓ 10c8dbd: feat(07-01): add user management API routes

All claims verified.
