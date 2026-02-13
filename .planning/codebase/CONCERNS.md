# Codebase Concerns

**Analysis Date:** 2026-02-13

## Missing Service Implementations

**All service implementations removed from codebase:**
- Files deleted: `src/services/district-service.ts`, `src/services/playbook-service.ts`, `src/services/product-service.ts`, `src/services/user-service.ts`
- Impact: Service interfaces exist (`src/services/interfaces/*.ts`) but NO implementations exist. All service methods are unimplemented.
- Risk: This is a critical blocker - the entire backend API layer is missing. Any frontend call to fetch data will fail.
- Files affected: `src/services/index.ts` exports interfaces only
- Status: Service interfaces are well-designed with clear authorization and error specifications, but implementations must be written before application is functional

**Why this matters:**
- The application has a complete service interface layer (`IDistrictService`, `IPlaybookService`, `IProductService`, `IUserService`, `ITenantService`, `IAuthService`, `IConfigService`)
- These interfaces define contracts for district discovery, playbook generation, product management, and user administration
- Without implementations, API route handlers will have nothing to call

## Missing API Route Handlers

**API routes directory completely removed:**
- No `src/app/api` directory exists
- Files deleted: All API routes for districts, playbooks, products, users, and health checks
- Impact: Frontend pages have no backend endpoints to call
- Symptoms: Any data fetching in components will fail (e.g., sidebar role fetching at `src/components/layout/sidebar.tsx:26`)
- Files affected: Sidebar component calls `/api/users/me` endpoint that doesn't exist (lines 26-32)

**Specific missing endpoints:**
- `GET /api/users/me` - Required by sidebar to fetch user role for admin gating (line 26 of `src/components/layout/sidebar.tsx`)
- District endpoints - searchDistricts, getDistrict, getDistrictFitAssessment, saveDistrict, excludeDistrict, etc.
- Playbook endpoints - generatePlaybook, getPlaybookStatus, getPlaybook, updatePlaybookSection, etc.
- Product endpoints - getProducts, getProduct, createProduct, updateProduct, etc.
- User/admin endpoints - inviteUser, getUsers, deactivateUser, reactivateUser

## Empty Page Components

**Placeholder pages with no functionality:**
- `src/app/(dashboard)/discovery/page.tsx` - Discovery & Targeting page is empty stub (8 lines)
- `src/app/(dashboard)/districts/[districtId]/page.tsx` - District Profile page is empty stub (8 lines)
- `src/app/(dashboard)/playbooks/page.tsx` - Playbooks page is empty stub (8 lines)
- `src/app/(dashboard)/solutions/page.tsx` - Solutions Library page is empty stub (8 lines)
- `src/app/(dashboard)/saved/page.tsx` - Saved Districts page is empty stub (8 lines)
- `src/app/(dashboard)/admin/page.tsx` - Admin page is empty stub (8 lines)
- Impact: These pages have titles/descriptions but no actual functionality. Users will see empty pages.

**Also deleted:**
- `src/components/admin/invite-user-form.tsx`, `src/components/admin/users-list.tsx` - admin components removed
- `src/components/discovery/*` - All discovery UI components removed (filter-sidebar, district-result-card, search-bar, pagination)
- `src/components/district/*` - All district detail components removed (fit-assessment-panel, exclude-modal, etc.)
- `src/components/playbooks/*` - All playbook UI components removed (playbook-card, generation-status, product-selector, etc.)
- `src/components/solutions/*` - All solutions/products UI components removed (product-form, product-card, etc.)

## Auth Layer Risk

**Clerk integration used but incomplete:**
- Clerk middleware configured (`src/middleware.ts`) for route protection
- Clerk provider wraps app (`src/app/layout.tsx`)
- Sidebar fetches role from `/api/users/me` which doesn't exist
- Impact: User role gating logic at lines 23-45 of `src/components/layout/sidebar.tsx` will fail silently and leave `userRole` as `null`, preventing admin nav from showing
- Risk: Falls back to "safe default" of `null` (line 31), which hides admin features even for admins

**Current flow breaks at:**
1. User logs in via Clerk (works)
2. Sidebar component mounts and tries to fetch role (fails - endpoint missing)
3. Role fetch catches error and sets `userRole` to `null` (safe fallback)
4. Admin nav never displays because `showAdminNav` condition (line 45) is never true

## Database Schema vs Service Contracts

**Mismatch in product model:**
- Schema (`prisma/schema.prisma` line 159-180) has `gradeFrom: Int` and `gradeTo: Int`
- Service type (`src/services/types/product.ts` line 10) expects `gradeRange: GradeRange`
- `GradeRange` interface is `{ gradeFrom: number; gradeTo: number; }` (`src/services/types/controlled-vocabulary.ts` line 5-8)
- This difference is minor but indicates service layer was designed without checking schema

**Hard-coded SQL file path in seed:**
- `prisma/seed.ts` line 7: `const SQL_FILE = '/Users/dorenberge/WorkInProgress/AK12_dev/alchemyk12_complete_data.sql';`
- This absolute local path is hardcoded
- Impact: Seed script will fail in any other environment (CI/CD, other machines, production)
- Fix: Use environment variable or relative path

## Test Coverage Gap

**No tests exist:**
- No test files found in codebase
- No test framework configured (no jest.config.js, vitest.config.ts, etc.)
- No testing dependencies in package.json
- Impact: Zero visibility into code quality or regressions. Service interfaces and types are untested.
- Risk: When service implementations are written, there's no test harness ready

## Client-Server Data Flow Uncertainty

**TypeScript types don't match Prisma schema:**
- Playbook service expects `sections: PlaybookSection[]` (`src/services/types/playbook.ts` line 25) but schema stores `sections Json` (line 191)
- Playbook service returns `productNames: string[]` (line 22) which matches schema `productNames String[]` (line 187) - this one is OK
- Product service expects `assets: ProductAsset[]` (line 16 of types/product.ts) but schema stores `assets Json` (line 171)
- Risk: JSON serialization/deserialization logic is undefined. When service fetches data from DB, it must transform JSON fields into typed arrays, but this logic doesn't exist

**Fit assessment denormalization:**
- Service contracts show `fitScore: Int?` and `fitRationale: String?` on Playbook model (schema lines 188-189)
- Service type expects full `FitAssessment` object with `fitScore: number` and `fitRationale: string` (types/common.ts lines 26-28)
- No logic shown for how fit assessments are calculated or persisted

## Session/Auth Data Flow

**Sidebar uses fetch without auth context:**
- Sidebar calls `fetch('/api/users/me')` without headers (line 26 of `src/components/layout/sidebar.tsx`)
- Clerk token is client-side only via `useUser()` hook (line 6 shows `useUser` imported)
- When service layer is implemented, `/api/users/me` endpoint must extract Clerk token from request and validate it
- Current code doesn't show how Clerk auth is passed to backend

## Environment Configuration Gaps

**Missing environment variables:**
- `.env` file not shown (properly ignored in .gitignore)
- Required variables not documented: `DATABASE_URL`, `CLERK_*` keys, etc.
- Seed script requires hardcoded path (line 7 of prisma/seed.ts)
- Impact: Onboarding new developers is unclear without env documentation

**Prisma connection pooling not configured:**
- For Next.js with serverless functions, connection pooling is recommended
- Current `src/lib/prisma.ts` creates raw `PrismaClient()` with no pooling configuration
- Risk: In production (serverless), database connection exhaustion could occur under load

## Data Validation Gaps

**Product asset uploads undefined:**
- Service interface defines `getProductAssetUploadUrl()` and `confirmProductAssetUpload()` (product-service.ts lines 37-43)
- S3 pre-signed URL generation logic is undefined
- Asset confirmation logic (after client S3 upload) is undefined
- Files deleted that may have had this logic: `src/components/solutions/product-form.tsx` (likely had upload form)

## Playbook Generation Async Without Polling Guidance

**Playbook generation is async:**
- Service interface: `generatePlaybook()` returns immediately with `{ playbookId: string }` (playbook-service.ts line 17)
- Client must poll `getPlaybookStatus()` for progress (comment line 16)
- No polling logic shown in any component
- No polling configuration (retry count, interval) defined
- Risk: Frontend won't know when playbook generation fails or how long to poll

## Authorization Not Enforced in Schema

**Schema lacks user/tenant isolation:**
- `SavedDistrict` and `ExcludedDistrict` have `tenantId` and `userId` but no foreign key constraints (schema lines 123-157)
- `Playbook` has `createdBy` (line 193) but no enforcement that users can only view own playbooks (service interface line 23 says "own playbooks")
- `Product` has `createdBy` (line 173) but no constraint on who can modify
- Impact: Authorization must be enforced entirely in service layer. If a bug exists in service authorization checks, database constraints won't catch it.

**Risk: If service implementations are written carelessly, tenants could see each other's data**

## Tenant Data Isolation Design

**Tenant context is application-level, not schema-level:**
- Service interfaces use `ServiceContext` with `userId`, `tenantId`, `userRole` (common.ts lines 36-41)
- Service implementations must manually filter all queries by `tenantId`
- No database-level row-level security (RLS) policies
- Impact: Every service method must include `where: { tenantId }` or similar. Easy to forget.

## Seed Data and Test Data

**Seed script loads production district data:**
- `prisma/seed.ts` loads master districts, schools, and district info from SQL dump (lines 310-319)
- These are production data from California schools
- No factory functions or builders for creating test records
- Impact: Can't easily create isolated test scenarios without polluting production schema

## Logging and Observability

**No logging framework configured:**
- No winston, pino, or structured logging setup
- Error handling has no logging (service interfaces document errors but don't show logging)
- Seed script logs progress (lines 276, 322, 346, 352, 358, 364, 370) but uses `console.log` only
- Runtime errors in service layer will have no logging destination
- Impact: Production debugging will be difficult

**Error handling in sidebar is silent:**
- Sidebar catches fetch error and sets role to `null` (line 30 of sidebar.tsx)
- No logging, no error reporting
- If role fetch fails in production, there's no visibility

## Controlled Vocabulary Incomplete

**Subject areas hardcoded in seed, but no other vocabularies:**
- 13 subject areas seeded (prisma/seed.ts lines 225-239)
- Grade exclusion/filters undefined - service expects grade filtering but how grades are represented is unclear
- County filters undefined
- District characteristics filters undefined
- Impact: District search filters at `IDistrictService.getAvailableFilters()` return value is undefined - what do the facets look like?

## Missing Error Handling Patterns

**Service interfaces document error types:**
- `INVALID_FILTER`, `DISTRICT_NOT_FOUND`, `PRODUCT_NOT_FOUND`, `GENERATION_LIMIT_REACHED`, etc. documented in interfaces
- No error handling utilities or error factory functions shown
- No error boundary components in React code
- Impact: Services can't be implemented until error handling pattern is established

## Next.js Version Risk

**Next.js 16 (very new):**
- `package.json` specifies `"next": "16.1.6"` (line 17)
- This is cutting-edge (released early 2024, only a few months old at v16)
- App Router is being used (src/app directory structure)
- Risk: Fewer third-party library versions tested with Next.js 16. Potential compatibility issues.
- Recommendation: Consider using LTS or stable version unless 16-specific features are required

## Type Safety Gaps in Component Props

**Components with minimal type safety:**
- Sidebar awaits user loading but has no error state beyond null check
- District/Playbook pages receive `districtId` and `playbookId` as `string` from URL but don't validate format (UUID, etc.)
- No zod/yup validation on API request types
- Impact: Invalid IDs passed to pages will silently fail when service calls are made

## Dependency Risks

**No pinned versions in package.json:**
- Uses `^` (caret) for most dependencies, allowing minor version updates
- `@prisma/client ^5.20.0` could update to `5.21.0` or later, potentially with breaking changes
- `@clerk/nextjs ^6.37.3` similarly unpinned
- Impact: `npm install` on different days/machines could install different versions, causing "works on my machine" issues

**Missing dev dependencies:**
- No TypeScript strict mode enforcer (could use `@typescript-eslint/strict-type-checked`)
- No pre-commit hooks (husky, lint-staged)
- No automated security scanning

## Build and Deployment

**No CI/CD pipeline shown:**
- No GitHub Actions, GitLab CI, or other CI configuration
- No deployment target documented (Vercel, Heroku, self-hosted?)
- `next build` will likely fail because service implementations missing

---

**Summary of Critical Blockers:**

1. **Service implementations completely missing** - All `src/services/*.ts` implementations deleted. Interfaces exist but no code.
2. **API routes completely missing** - No `src/app/api` directory. Frontend has nothing to call.
3. **Empty placeholder pages** - Discovery, playbooks, solutions, admin pages are stubs with no functionality.
4. **Sidebar role fetch fails silently** - Admin nav won't display because `/api/users/me` endpoint doesn't exist.
5. **No test coverage** - Zero tests. No test framework configured.
6. **Seed script path hardcoded** - Won't work outside specific local machine.

**Recommended Next Steps:**
- Implement all service interfaces in `src/services/*.ts` (starting with the interface contracts)
- Create API route handlers in `src/app/api` to delegate to services
- Implement page components and connect them to service calls
- Add Jest/Vitest and write unit tests for services
- Fix seed script to use environment-based paths
- Add structured logging throughout application
- Add pre-commit hooks and CI/CD pipeline

*Concerns audit: 2026-02-13*
