---
phase: 03-discovery-district-profiles
plan: 01
subsystem: discovery-backend
tags: [api, service-layer, district-search, fit-assessment]

dependency_graph:
  requires:
    - 02-auth-data-layer-01 (Prisma schema with District model)
    - 02-auth-data-layer-03 (Seeded district data)
    - 01-foundation-shell-02 (Service type contracts)
  provides:
    - District search API with pagination and filters
    - Dynamic filter facets (county, enrollment range)
    - District profile retrieval
    - Product-district fit assessment API
  affects:
    - 03-02 (Discovery Search UI will consume these APIs)
    - 03-03 (District Profile Page will consume detail and fit APIs)

tech_stack:
  added:
    - Prisma queries (findMany, findUnique, groupBy, aggregate)
    - Next.js 15 async params pattern for dynamic routes
  patterns:
    - Service-first architecture: Business logic in service layer, routes delegate
    - Error codes for machine-readable error handling (DISTRICT_NOT_FOUND, PRODUCT_NOT_FOUND)
    - Heuristic fit scoring: Proficiency levels + product characteristics + enrollment size

key_files:
  created:
    - src/services/district-service.ts (268 lines)
    - src/app/api/districts/route.ts
    - src/app/api/districts/filters/route.ts
    - src/app/api/districts/[districtId]/route.ts
    - src/app/api/districts/[districtId]/fit/route.ts
  modified: []

decisions:
  - key: Fit assessment algorithm
    choice: Simple heuristic scoring based on proficiency average, product target challenges, and enrollment size
    rationale: MVP approach - provides useful categorization without ML complexity. Can be enhanced in later phases.
    alternatives_considered:
      - ML-based scoring (overkill for MVP)
      - Manual scoring rules per product (not scalable)

  - key: Filter facet computation
    choice: Dynamic facets computed from actual database data using Prisma groupBy and aggregate
    rationale: Ensures filters always reflect current data state. County options sorted by count (most common first).
    alternatives_considered:
      - Static hardcoded filters (would become stale)
      - Client-side facet computation (too expensive)

  - key: Exclusion filtering deferred
    choice: includeExcluded parameter accepted but not yet enforced
    rationale: User context (needed for exclusion filtering) comes in Phase 4. Service contract ready, implementation deferred.
    alternatives_considered:
      - Implement with hardcoded userId (wrong abstraction)
      - Remove parameter entirely (would require API breaking change later)

metrics:
  tasks_completed: 2
  duration: 2min 3s
  files_created: 5
  completed_at: 2026-02-12T14:19:28Z
---

# Phase 03 Plan 01: District Service & API Routes Summary

**One-liner:** Implemented district search, filtering, profile retrieval, and heuristic product-district fit assessment with 4 API endpoints and service layer.

## What Was Built

Created the complete district data backend for the Discovery feature:

1. **District Service Module** (`district-service.ts`):
   - `searchDistricts()`: Paginated search with name query and filters (county, enrollment range)
   - `getDistrict()`: Full district profile with demographics, proficiency, funding
   - `getAvailableFilters()`: Dynamic facets derived from database (county list with counts, enrollment min/max)
   - `getDistrictFitAssessment()`: Heuristic scoring comparing district proficiency to product characteristics

2. **Four API Route Handlers**:
   - `GET /api/districts`: Search endpoint with query params (q, county, enrollmentMin/Max, page, pageSize)
   - `GET /api/districts/filters`: Returns county multi-select and enrollment range facets
   - `GET /api/districts/[districtId]`: Returns full DistrictProfile
   - `GET /api/districts/[districtId]/fit?productIds=...`: Returns FitAssessment (strong/moderate/low)

## Deviations from Plan

None - plan executed exactly as written.

## Technical Implementation

**Service Layer Patterns:**
- All database queries isolated in service module
- Prisma `groupBy` for county aggregation (dynamic facet counts)
- Prisma `aggregate` for enrollment min/max (range facet bounds)
- Parallel queries (`Promise.all`) for search results + total count
- Error objects with `code` property for machine-readable error handling

**Fit Assessment Logic:**
- Calculate average proficiency across Math, ELA, Science
- Check product `targetChallenges` for intervention vs enrichment signals
- Scoring rules:
  - Low proficiency (<35%) + intervention products = "strong"
  - High proficiency (>50%) + enrichment products = "strong"
  - Large districts (>50K enrollment) = "moderate"
  - Mid-sized (>10K) = "moderate"
  - Small districts = "low"
- Rationale string explains scoring to user (enrollment size + proficiency + product match)

**API Route Patterns:**
- Next.js 15 async params: `const { districtId } = await params`
- Query param parsing from `request.nextUrl.searchParams`
- HTTP status codes: 200 (success), 400 (bad request), 404 (not found), 500 (server error)
- Error code mapping: `DISTRICT_NOT_FOUND` → 404, `PRODUCT_NOT_FOUND` → 404

## Validation

All verification criteria passed:
- ✓ TypeScript compilation succeeds (`npx tsc --noEmit`)
- ✓ `district-service.ts` exports all four functions
- ✓ All four API routes exist at correct paths
- ✓ Each route exports GET function
- ✓ No circular imports

## What's Next

**Immediate Next Steps:**
- Plan 03-02: Discovery Search UI (consumes search and filters endpoints)
- Plan 03-03: District Profile Page (consumes detail and fit endpoints)

**Dependencies Satisfied:**
- Phase 3 frontend can now be built (all 4 required APIs operational)
- Fit assessment ready for playbook generation (Phase 5)

**Known Limitations:**
- Exclusion filtering deferred to Phase 4 (requires user context)
- Fit assessment uses simple heuristics (can be enhanced with ML in future)
- No authentication on routes yet (will be added in Phase 4 when middleware wired)

## Files Created

| Path | Purpose | Lines |
|------|---------|-------|
| `src/services/district-service.ts` | Service layer with all district data operations | 268 |
| `src/app/api/districts/route.ts` | Search API endpoint | ~60 |
| `src/app/api/districts/filters/route.ts` | Filter facets API endpoint | ~18 |
| `src/app/api/districts/[districtId]/route.ts` | District detail API endpoint | ~30 |
| `src/app/api/districts/[districtId]/fit/route.ts` | Fit assessment API endpoint | ~49 |

## Commits

| Commit | Message |
|--------|---------|
| b278ac0 | feat(03-discovery-district-profiles-01): implement district service module |
| d9c0a36 | feat(03-discovery-district-profiles-01): create district API route handlers |

## Self-Check: PASSED

Verifying all claimed artifacts exist:

**Files created:**
- ✓ FOUND: src/services/district-service.ts
- ✓ FOUND: src/app/api/districts/route.ts
- ✓ FOUND: src/app/api/districts/filters/route.ts
- ✓ FOUND: src/app/api/districts/[districtId]/route.ts
- ✓ FOUND: src/app/api/districts/[districtId]/fit/route.ts

**Commits exist:**
- ✓ FOUND: b278ac0
- ✓ FOUND: d9c0a36

**Service exports verified:**
- ✓ searchDistricts (line 17)
- ✓ getDistrict (line 104)
- ✓ getAvailableFilters (line 139)
- ✓ getDistrictFitAssessment (line 192)

All claims verified.
