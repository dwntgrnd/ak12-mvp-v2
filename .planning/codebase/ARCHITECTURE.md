# Architecture

**Analysis Date:** 2026-02-13

## Pattern Overview

**Overall:** Layered Next.js application with Service-Oriented Architecture (SOA)

**Key Characteristics:**
- Next.js 16 App Router with strict routing layout
- Service layer abstractions via TypeScript interfaces
- Prisma ORM for database access
- Clerk for authentication and multi-tenant identity management
- Component-driven UI with React 19

## Layers

**Presentation Layer (Pages & Components):**
- Purpose: Render user-facing pages and UI components
- Location: `src/app/` (page routes), `src/components/` (reusable UI)
- Contains: Next.js page components (`.tsx`), layout wrappers, UI component implementations
- Depends on: Service layer via interfaces, UI component library
- Used by: End users via browser

**Service Layer (Business Logic):**
- Purpose: Define service contracts and provide cross-domain type definitions
- Location: `src/services/` (interfaces and types only at this layer)
- Contains: TypeScript interfaces (`src/services/interfaces/`), shared domain types (`src/services/types/`)
- Depends on: Type definitions, common utilities
- Used by: Pages, components, and future implementations

**Data Layer (Database):**
- Purpose: Define and manage data persistence
- Location: `prisma/schema.prisma`
- Contains: Prisma models (master data, application data), migrations
- Depends on: PostgreSQL database (via DATABASE_URL)
- Used by: Service implementations (not yet present in this MVP)

**Infrastructure Layer:**
- Purpose: Cross-cutting utilities and configuration
- Location: `src/lib/` (utilities, design tokens, Prisma client singleton)
- Contains: Prisma client initialization, design tokens, utility functions
- Depends on: External libraries (Prisma, styling)
- Used by: All layers

## Data Flow

**Discovery & Targeting Flow:**

1. User navigates to `/discovery` → `src/app/(dashboard)/discovery/page.tsx` renders
2. Page calls service methods from `IDistrictService` interface
3. Service methods (not yet implemented) would query Prisma for `MasterDistrict` data
4. Filtered/paginated `DistrictSummary[]` returned to component
5. Component renders `DistrictProfile` with demographics, proficiency, funding data
6. User can trigger `FitAssessment` for selected products

**Playbook Generation Flow:**

1. User initiates playbook generation from district + product selection
2. Frontend calls `IPlaybookService.generatePlaybook()` → returns async `playbookId`
3. Service method stores `Playbook` record in database with `status: 'generating'`
4. Frontend polls `IPlaybookService.getPlaybookStatus()` for progress
5. Backend generates AI sections (via external LLM, not yet implemented)
6. Service updates `Playbook.sections` JSON field and status to `'complete'`
7. User can view playbook, edit sections, or trigger `regenerateSection()`

**State Management:**
- Client-side state: Component `useState` for UI state (filters, pagination)
- Server state: Prisma database for persistent data
- Auth state: Clerk managed (stored in browser session/cookies)
- Service context: Per-request tenant/user info passed through service methods

## Key Abstractions

**Service Interfaces:**
- Purpose: Define contracts for domain operations without implementation details
- Examples: `IAuthService`, `IDistrictService`, `IProductService`, `IPlaybookService`, `IUserService`, `IConfigService`, `ITenantService`
- Pattern: TypeScript interfaces with documented authorization, error codes, and async behavior

**Domain Types:**
- Purpose: Represent business entities and operations
- Examples: `DistrictSummary`, `DistrictProfile`, `Product`, `Playbook`, `PlaybookSection`, `FitAssessment`
- Pattern: TypeScript `interface` with required fields, optional extensions via `Record<string, unknown>`

**Service Context:**
- Purpose: Thread per-request authorization and tenant isolation
- Definition: `ServiceContext` interface in `src/services/types/common.ts`
- Contains: `userId`, `tenantId`, `userRole`, `organizationName`
- Usage: Implicitly passed through service method chains (scopes all queries to tenant)

## Entry Points

**Root Entry:**
- Location: `src/app/page.tsx`
- Triggers: Browser navigates to `/`
- Responsibilities: Redirects to `/discovery` (main dashboard entry)

**Auth Entry:**
- Location: `src/app/(auth)/login/[[...sign-in]]/page.tsx`
- Triggers: Non-authenticated user or Clerk sign-in modal
- Responsibilities: Clerk auth flow, post-login redirect to dashboard

**Dashboard Entry:**
- Location: `src/app/(dashboard)/layout.tsx`
- Triggers: Authenticated user accessing `/discovery`, `/saved`, `/solutions`, `/playbooks`, or `/admin`
- Responsibilities: Renders sidebar navigation, enforces role-based admin link visibility

**Pages (by feature):**
- Discovery: `src/app/(dashboard)/discovery/page.tsx` - Search and filter districts
- Saved: `src/app/(dashboard)/saved/page.tsx` - View saved district bookmarks
- Solutions: `src/app/(dashboard)/solutions/page.tsx` - Manage product catalog
- Playbooks: `src/app/(dashboard)/playbooks/page.tsx` - View AI-generated playbooks
- Playbook detail: `src/app/(dashboard)/playbooks/[playbookId]/page.tsx` - View/edit single playbook
- District detail: `src/app/(dashboard)/districts/[districtId]/page.tsx` - View district profile with fit assessment
- Admin: `src/app/(dashboard)/admin/page.tsx` - Organization and user management

## Error Handling

**Strategy:** Explicit error codes in service responses

**Patterns:**
- Service methods throw or return `ServiceError` interface with `code`, `message`, `field` (for validation), `retryable` boolean
- Common error codes: `INVALID_FILTER`, `DISTRICT_NOT_FOUND`, `PRODUCT_NOT_FOUND`, `PLAYBOOK_NOT_FOUND`, `DUPLICATE_PRODUCT_NAME`, `VALIDATION_ERROR`, `GENERATION_LIMIT_REACHED`
- Authorization errors: Methods document required roles (e.g., "publisher-admin", "publisher-rep", "super-admin")
- Frontend handles errors by displaying user-friendly messages based on error code

## Cross-Cutting Concerns

**Logging:** Not yet implemented (placeholder for future observability)

**Validation:** Zod schemas expected in implementation layer (not present in current MVP interfaces)

**Authentication:**
- Clerk manages session via `@clerk/nextjs` integration
- `<ClerkProvider>` wraps application in `src/app/layout.tsx`
- Protected routes in dashboard require Clerk authentication (enforced by Clerk middleware, not yet visible in code)
- Role-based access shown in `Sidebar` component via `/api/users/me` fetch

**Authorization:**
- Service interfaces document required roles for each method
- Implementation responsibility: Enforce role checks and tenant isolation in service implementations
- Sidebar conditionally shows admin nav: `userRole === 'publisher-admin' || userRole === 'super-admin'`

**Multi-Tenancy:**
- Isolation enforced via `tenantId` in `ServiceContext`
- Database schema includes `tenantId` on application tables (`SavedDistrict`, `ExcludedDistrict`, `Product`, `Playbook`)
- Service implementations must filter all queries by context tenant ID

---

*Architecture analysis: 2026-02-13*
