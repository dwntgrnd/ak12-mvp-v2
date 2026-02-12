---
phase: 04-district-management
plan: 01
subsystem: api, database
tags: [prisma, clerk, next.js, district-management, user-context]

# Dependency graph
requires:
  - phase: 02-auth-data-layer
    provides: Clerk authentication, Prisma User model with clerkId mapping, SavedDistrict and ExcludedDistrict models
  - phase: 03-discovery-district-profiles
    provides: District service with getDistrict function, error-with-code pattern
provides:
  - User resolution utility (getCurrentUser) that bridges Clerk auth to internal User model
  - 6 district management service functions for save/exclude/restore operations
  - 5 API endpoints scoped to authenticated user for district territory management
affects: [05-product-catalog, 06-playbook-generation]

# Tech tracking
tech-stack:
  added: []
  patterns: [getCurrentUser pattern for auth resolution, ownership-scoped Prisma queries, P2002/P2025 Prisma error handling]

key-files:
  created:
    - src/lib/auth-utils.ts
    - src/app/api/districts/saved/route.ts
    - src/app/api/districts/[districtId]/save/route.ts
    - src/app/api/districts/[districtId]/exclude/route.ts
    - src/app/api/districts/[districtId]/restore/route.ts
  modified:
    - src/services/district-service.ts

key-decisions:
  - "getCurrentUser resolves at API boundary, service functions accept userId as first parameter"
  - "P2002 unique constraint violations handled gracefully (return existing for saves, error for excludes)"
  - "excludeDistrict automatically removes from saved_districts as cleanup"
  - "All operations scoped to authenticated user via userId filtering"

patterns-established:
  - "Auth resolution pattern: API routes call getCurrentUser() → extract user.id → pass to service layer"
  - "Service error codes map to HTTP status: UNAUTHENTICATED/USER_NOT_FOUND → 401, DISTRICT_NOT_FOUND/NOT_SAVED/NOT_EXCLUDED → 404, ALREADY_EXCLUDED → 409, INVALID_CATEGORY → 400"
  - "Prisma P2002 (unique violation) and P2025 (record not found) errors translated to domain error codes"

# Metrics
duration: 2min 33s
completed: 2026-02-12
---

# Phase 04 Plan 01: District Management Service Layer & API Routes Summary

**User-scoped district management with save/exclude/restore operations using Clerk auth resolution and Prisma unique constraints**

## Performance

- **Duration:** 2min 33s
- **Started:** 2026-02-12T14:46:29Z
- **Completed:** 2026-02-12T14:49:02Z
- **Tasks:** 2
- **Files modified:** 6

## Accomplishments
- Created getCurrentUser() utility bridging Clerk session to internal User record
- Implemented 6 service functions for district management (save, unsave, exclude, restore, list operations)
- Built 5 API endpoints with proper auth resolution, input validation, and HTTP status mapping
- All operations properly scoped to authenticated user via userId filtering

## Task Commits

Each task was committed atomically:

1. **Task 1: Create user resolution utility** - `1b848ca` (feat)
2. **Task 2: Implement district management service functions and API routes** - `1167b2b` (feat)

## Files Created/Modified
- `src/lib/auth-utils.ts` - getCurrentUser() resolves Clerk auth to User(id, tenantId, role)
- `src/services/district-service.ts` - Added 6 district management functions with Prisma queries
- `src/app/api/districts/saved/route.ts` - GET endpoint for user's saved districts
- `src/app/api/districts/[districtId]/save/route.ts` - POST/DELETE for save/unsave operations
- `src/app/api/districts/[districtId]/exclude/route.ts` - POST to exclude with categorized reason
- `src/app/api/districts/[districtId]/restore/route.ts` - POST to restore excluded district

## Decisions Made
- **Service layer accepts userId:** Service functions take userId as first parameter rather than resolving auth internally. This keeps auth resolution at the API boundary and makes service layer testable.
- **Graceful P2002 handling for saves:** If user tries to save an already-saved district, return the existing record instead of throwing an error (idempotent operation).
- **Strict P2002 handling for excludes:** If user tries to exclude an already-excluded district, throw ALREADY_EXCLUDED error (409 Conflict) since user should be aware of existing exclusion.
- **Automatic cleanup in excludeDistrict:** When a district is excluded, automatically remove it from saved_districts if present (silent operation, no error if not saved).

## Deviations from Plan

None - plan executed exactly as written.

## Issues Encountered

None - all TypeScript compiled cleanly on first verification.

## User Setup Required

None - no external service configuration required.

## Next Phase Readiness
- District management backend complete and ready for UI integration
- All 5 endpoints properly authenticated and scoped to user context
- Error handling covers all edge cases (not found, already exists, invalid input)
- Ready for Phase 04 Plan 02: District Management UI Components

## Self-Check: PASSED

All created files exist:

- src/lib/auth-utils.ts ✓
- src/app/api/districts/saved/route.ts ✓
- src/app/api/districts/[districtId]/save/route.ts ✓
- src/app/api/districts/[districtId]/exclude/route.ts ✓
- src/app/api/districts/[districtId]/restore/route.ts ✓

All commits exist:

- 1b848ca (Task 1) ✓
- 1167b2b (Task 2) ✓

---
*Phase: 04-district-management*
*Completed: 2026-02-12*
