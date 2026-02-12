---
phase: 02-auth-data-layer
plan: 01
subsystem: data-layer
tags:
  - prisma
  - database
  - orm
  - postgresql
  - schema
dependency_graph:
  requires:
    - "01-02 (Service Type System)"
  provides:
    - "Database schema for all entities"
    - "Prisma client singleton"
    - "Type-safe database access"
  affects:
    - "All future data access patterns"
    - "Authentication system (User model)"
    - "All feature verticals"
tech_stack:
  added:
    - name: Prisma ORM
      version: 5.20.0
      purpose: Type-safe database ORM with PostgreSQL
      note: "v5.20.0 chosen for Node 18.6.0 compatibility (v7+ requires Node 20+)"
    - name: PostgreSQL
      version: "14+"
      purpose: Primary relational database
  patterns:
    - "Singleton pattern for Prisma client (Next.js best practice)"
    - "snake_case database naming with camelCase TypeScript via @map"
    - "JSONB for flexible district data schemas"
    - "UUID primary keys for all entities"
key_files:
  created:
    - path: prisma/schema.prisma
      purpose: Complete database schema for all 9 models
      lines: 192
    - path: src/lib/prisma.ts
      purpose: Prisma client singleton for server-side use
      lines: 11
  modified:
    - path: .env.example
      change: Added DATABASE_URL documentation with examples
decisions:
  - what: Use Prisma 5.20.0 instead of latest (7.4.0)
    why: Node 18.6.0 compatibility - Prisma 7+ requires Node 20.19+
    impact: Stable ORM with all needed features, upgrade path available when Node version updated
    alternatives: ["Upgrade Node.js", "Use different ORM"]
  - what: No Prisma enums - use String fields with TypeScript validation
    why: Single source of truth in controlled-vocabulary.ts (const arrays)
    impact: Application-level validation, easier to extend vocabulary
    alternatives: ["Prisma enum types (would duplicate definitions)"]
  - what: JSONB for district demographics/proficiency/funding
    why: Flexible schema per PROJECT.md decision - data varies by source
    impact: Can handle varied data structures without schema migrations
    alternatives: ["Strict relational tables (inflexible)"]
metrics:
  duration: "5min 0s"
  tasks_completed: 2
  files_created: 2
  files_modified: 1
  lines_added: 203
  completed_at: "2026-02-12T12:43:54Z"
---

# Phase 02 Plan 01: Prisma ORM Setup & Database Schema

**One-liner:** Complete PostgreSQL database schema with 9 models (Tenant, User, Product, District, Playbook entities) using Prisma 5.20.0 with type-safe client and singleton pattern for Next.js.

## Overview

Established the data persistence layer for AlchemyK12 MVP. Defined all database models matching the TypeScript service types from Phase 1, ensuring type safety from database to application layer. All future features (discovery, management, solutions, playbooks) depend on these models.

## Execution Summary

**Pattern:** Fully autonomous (no checkpoints)
**Tasks completed:** 2 of 2
**Status:** Complete

### Task Completion

| Task | Name                                  | Status | Commit  | Files                     |
| ---- | ------------------------------------- | ------ | ------- | ------------------------- |
| 1    | Install Prisma and create schema      | ✓      | b75aa86* | prisma/schema.prisma, .env.example |
| 2    | Create singleton client and migration | ✓      | b68056e | src/lib/prisma.ts         |

**Note:** Task 1's schema work was completed in commit b75aa86 as part of plan 02-02 (Clerk), which was executed before this plan. Task 2 created the missing Prisma client singleton. This SUMMARY documents the schema definition work even though it occurred in a different plan.

## What Was Built

### Database Schema (9 Models)

**Core Tenant & User Models:**
- **Tenant** - Multi-tenant organizations with unique organization names
- **User** - Publisher users with Clerk integration (clerkId), roles, and status tracking

**Product Models:**
- **Product** - Publisher products with grade ranges, subject areas, features, messaging
- **ProductAsset** - File attachments for products (PDFs, images, etc.)

**District Models:**
- **District** - School districts with JSONB for demographics/proficiency/funding (flexible schema)
- **SavedDistrict** - User's saved districts with unique constraint per user
- **ExcludedDistrict** - User's excluded districts with category and optional notes

**Playbook Models:**
- **Playbook** - Generated sales playbooks for district/product combinations
- **PlaybookSection** - Individual sections within playbooks with AI generation status

### Key Features

- **UUID primary keys** on all models via `@default(uuid())`
- **Automatic timestamps** - createdAt/updatedAt on all models
- **snake_case database naming** with camelCase TypeScript via @map directives
- **Proper foreign key relations** - Tenant→User, User→SavedDistrict, District→Playbook, etc.
- **Unique constraints** - [userId, districtId] on SavedDistrict/ExcludedDistrict, [name, county] on District
- **JSONB fields** for flexible district data (demographics, proficiency, funding)
- **Soft delete support** - isDeleted flag on Product model

### Prisma Client Integration

Created `src/lib/prisma.ts` with singleton pattern:
- Prevents multiple client instances during Next.js hot reload
- Attaches to globalThis in development mode
- Creates fresh instance in production (serverless-friendly)

## Deviations from Plan

### Execution Order Deviation

**Context:** Plan 02-02 (Clerk Authentication) was executed before Plan 02-01 (Prisma Setup), and the Prisma schema was created as part of 02-02.

**Impact:**
- Schema definition work (Task 1) was completed in commit b75aa86 rather than as part of this plan
- Task 2 (Prisma client singleton) was still needed and completed as planned
- No technical issues - schema is correct and complete

**Handled by:** Executing Task 2 as planned, documenting the situation in this SUMMARY

### Auto-fixed Issues

None. Plan executed as designed aside from execution order noted above.

## Database Migration Status

**Migration not run** - DATABASE_URL requires user configuration. The plan explicitly allows this:
- Schema validates successfully (`npx prisma validate`)
- Prisma client generates successfully (`npx prisma generate`)
- TypeScript compiles without errors
- .env.example documents DATABASE_URL with examples for Local/Neon/Supabase

**User action required:** Configure PostgreSQL database and run `npx prisma migrate dev --name init`

## Verification Results

All success criteria met:

- ✓ `npx prisma validate` exits 0
- ✓ `npx prisma generate` exits 0
- ✓ `npx tsc --noEmit` exits 0
- ✓ prisma/schema.prisma contains all 9 models
- ✓ src/lib/prisma.ts exports singleton client
- ✓ .env.example documents DATABASE_URL

**Model count:** 9 models defined
**Relations count:** 7 relation definitions (Tenant↔User, User↔SavedDistrict, User↔ExcludedDistrict, User↔Playbook, Product↔ProductAsset, District↔SavedDistrict, District↔Playbook)
**Unique constraints:** 3 (Tenant.organizationName, SavedDistrict[userId,districtId], ExcludedDistrict[userId,districtId], District[name,county])

## Dependencies Met

**From Phase 01-02 (Service Type System):**
- ✓ Used TenantSummary, TenantUser, UserProfile types to define Tenant and User models
- ✓ Used Product, ProductAsset types for Product models
- ✓ Used DistrictProfile, SavedDistrict, ExcludedDistrict types for District models
- ✓ Used Playbook, PlaybookSection types for Playbook models
- ✓ Referenced GRADE_RANGES, SUBJECT_AREAS, EXCLUSION_CATEGORIES from controlled-vocabulary.ts

**Provides for future plans:**
- Type-safe database access for all entities
- User model with clerkId for authentication integration
- Product and District models for discovery/management features
- Playbook models for AI generation features

## Next Steps

**For users:**
1. Set up PostgreSQL database (local or cloud: Neon, Supabase, etc.)
2. Update DATABASE_URL in .env file
3. Run `npx prisma migrate dev --name init` to create tables
4. Verify migration: `npx prisma studio` to browse database

**For next plans (02-02, 02-03):**
- Plan 02-02 (Clerk): Integrate Clerk authentication with User model (already completed)
- Plan 02-03 (Seed): Create database seed scripts for development data
- Can now build service implementations that persist data via Prisma client

## Self-Check

Verifying all claimed artifacts exist:

**Files:**
- ✓ FOUND: prisma/schema.prisma (6860 bytes)
- ✓ FOUND: src/lib/prisma.ts (328 bytes)
- ✓ FOUND: .env.example contains DATABASE_URL

**Commits:**
- ✓ FOUND: b75aa86 (schema created in 02-02 plan)
- ✓ FOUND: b68056e (singleton client created in this execution)

**Exports:**
- ✓ VERIFIED: src/lib/prisma.ts exports named `prisma` constant
- ✓ VERIFIED: Prisma client imports successfully in TypeScript

**Schema validation:**
- ✓ VERIFIED: 9 models present (Tenant, User, Product, ProductAsset, District, SavedDistrict, ExcludedDistrict, Playbook, PlaybookSection)
- ✓ VERIFIED: All models have id, createdAt, updatedAt fields
- ✓ VERIFIED: All models use @@map for snake_case table names

## Self-Check: PASSED

All claims verified. Schema is complete, client is functional, TypeScript compiles successfully.
