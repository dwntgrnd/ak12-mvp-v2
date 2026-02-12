---
phase: 02-auth-data-layer
plan: 03
subsystem: database-seeding
tags: [database, seed-data, health-check, district-data]
completed: 2026-02-12
duration: 5min 43s

dependency_graph:
  requires:
    - 02-01-PLAN.md (Prisma schema and client)
  provides:
    - Seeded California district data for search/discovery (Phase 3)
    - Database connectivity health check (AUTH-03)
    - Development tenant and admin user
  affects:
    - Phase 3 (district search/discovery features)
    - Monitoring/ops (health check endpoint)

tech_stack:
  added:
    - tsx: TypeScript execution for seed scripts
  patterns:
    - Prisma seed scripts with upsert for idempotency
    - Lightweight SELECT 1 health checks for database connectivity
    - JSONB fields for flexible district data (demographics, proficiency, funding)

key_files:
  created:
    - prisma/seed.ts: California district seed data (25 districts)
  modified:
    - package.json: Added prisma.seed configuration and tsx dependency
    - src/app/api/health/route.ts: Upgraded with database connectivity check

key_decisions:
  - Used upsert pattern with compound unique constraint (name + county) for idempotent seeding
  - Lightweight SELECT 1 query for health check (minimal overhead)
  - Return 503 when DB is down (standard for unhealthy service), 200 when ok
  - Health check returns "degraded" status when DB is unreachable (API still responding)
  - Version bumped to 0.2.0 to reflect Phase 2 additions

metrics:
  tasks_completed: 2
  files_created: 1
  files_modified: 3
  commits: 2
---

# Phase 2 Plan 3: Database Seeding & Health Check Summary

**One-liner:** Seeded 25 California districts with demographics/proficiency/funding data and upgraded health check with database connectivity monitoring.

## What Was Built

**Task 1: California District Seed Script**
- Created `prisma/seed.ts` with 25 real California school districts
- Each district includes realistic data:
  - Demographics (ethnic/racial percentages as JSONB)
  - Proficiency (Math, ELA, Science percentages as JSONB)
  - Funding (per-pupil spending, total budget, Title I, LCFF as JSONB)
- Seeded default tenant (EduVision Publishing) and admin user (admin@eduvision.com)
- Used upsert pattern with compound unique constraint [name, county] for idempotency
- Configured package.json with `prisma.seed` command
- Installed tsx as dev dependency for running TypeScript seed scripts

**Task 2: Health Check with Database Connectivity**
- Upgraded `/api/health` endpoint to check database connectivity
- Uses lightweight `SELECT 1` query for minimal overhead
- Measures and reports database latency in milliseconds
- Returns:
  - 200 status with `status: "ok"` when database is connected
  - 503 status with `status: "degraded"` when database is unreachable
- Bumped version to 0.2.0 to reflect Phase 2 additions
- Fulfills AUTH-03 requirement and Phase 2 success criterion #5

## Districts Seeded

25 California school districts covering diverse demographics and performance levels:

**Large Urban:**
- Los Angeles Unified (422K enrollment)
- San Diego Unified (98K)
- Fresno Unified (72K)
- Long Beach Unified (70K)

**Mid-Size:**
- Elk Grove Unified (63K)
- Corona-Norco Unified (51K)
- San Francisco Unified (49K)
- San Bernardino City Unified (47K)
- Capistrano Unified (47K)

**High Performing:**
- Irvine Unified (68.9% Math proficiency)
- Poway Unified (56.8% Math proficiency)
- Clovis Unified (51.3% Math proficiency)

**Challenging Demographics:**
- Compton Unified (18.5% Math proficiency, high poverty)
- Santa Ana Unified (94.3% Hispanic/Latino)
- San Bernardino City Unified (85.7% Hispanic/Latino)

This diverse dataset enables Phase 3 search/discovery features to demonstrate real-world use cases.

## Deviations from Plan

None - plan executed exactly as written.

## Technical Implementation

**Seed Script Pattern:**
```typescript
// Idempotent upsert using compound unique constraint
await prisma.district.upsert({
  where: { name_county: { name: district.name, county: district.county } },
  update: district,
  create: district,
});
```

**Health Check Pattern:**
```typescript
// Lightweight connectivity check with latency measurement
try {
  const start = Date.now();
  await prisma.$queryRaw(Prisma.sql`SELECT 1`);
  dbLatencyMs = Date.now() - start;
  dbStatus = 'ok';
} catch {
  dbStatus = 'down';
}
```

**Key Decisions:**
1. **Idempotent seeding:** Safe to run multiple times without duplicating data
2. **Compound unique constraint:** Uses [name, county] to prevent duplicates (e.g., "Springfield" exists in multiple counties)
3. **SELECT 1 vs table query:** Minimal overhead for health checks (doesn't lock tables or query actual data)
4. **Degraded vs down status:** Returns "degraded" when DB is unreachable (API itself is still responding)
5. **503 status code:** Standard HTTP status for unhealthy service (enables monitoring tools to detect issues)

## Success Criteria Met

- [x] 25 California districts seeded with demographics, proficiency, and funding data
- [x] Default tenant and admin user seeded for development
- [x] Seed script is idempotent (safe to run multiple times)
- [x] Health check endpoint reports database connectivity (AUTH-03)
- [x] Health check returns 200 when DB is up, 503 when DB is down

## Phase 2 Impact

This plan completes Phase 2's data layer requirements:

**Phase 2 Success Criteria:**
1. ✅ Prisma schema with all models (02-01)
2. ✅ Clerk authentication integrated (02-02)
3. ✅ Database connectivity verified via health check (02-03)
4. ✅ Seed data available for Phase 3 development (02-03)

**Ready for Phase 3:**
- District data available for search/filtering features
- Demographics enable audience-targeting scenarios
- Proficiency enables performance-based recommendations
- Funding enables budget-aware product suggestions

## Commits

- `8cb8089`: feat(02-auth-data-layer-03): create California district seed script
- `31a2dac`: feat(02-auth-data-layer-03): upgrade health check with database connectivity

## Self-Check: PASSED

**Files exist:**
```
✓ FOUND: prisma/seed.ts
✓ FOUND: src/app/api/health/route.ts
✓ FOUND: package.json
```

**Commits exist:**
```
✓ FOUND: 8cb8089
✓ FOUND: 31a2dac
```

**Verification:**
```
✓ TypeScript compiles without errors
✓ prisma/seed.ts contains 25 districts
✓ package.json has prisma.seed configuration
✓ Health check imports prisma client
```
