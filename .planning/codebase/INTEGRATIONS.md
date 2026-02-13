# External Integrations

**Analysis Date:** 2026-02-13

## APIs & External Services

**Clerk Authentication:**
- Service: Clerk (https://clerk.com) - User authentication and session management
  - SDK: `@clerk/nextjs` 6.37.3
  - Auth type: OAuth/JWT based
  - Public key env var: `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
  - Secret env var: `CLERK_SECRET_KEY`
  - Integration: Middleware at `src/middleware.ts` protects routes and extracts user context
  - Components: Sign-in at `src/app/(auth)/login/[[...sign-in]]/page.tsx`, Sign-up at `src/app/(auth)/sign-up/[[...sign-up]]/page.tsx`
  - Client hooks: `useUser()`, `UserButton()` in `src/components/layout/sidebar.tsx`

## Data Storage

**Databases:**
- PostgreSQL (primary)
  - Connection: `DATABASE_URL` environment variable
  - Format: `postgresql://user:password@host:port/dbname`
  - Supported hosts: Local, Neon (cloud), Supabase
  - Client: Prisma ORM (`@prisma/client`)

**Schema Location:**
- `prisma/schema.prisma` - Database schema with 11 models:
  - `MasterDistrict` - K-12 district master data
  - `DistrictInfo` - District metadata by academic year
  - `School` - School information
  - `SavedDistrict` - User's saved districts (user-scoped)
  - `ExcludedDistrict` - Excluded districts (tenant-scoped)
  - `Product` - EdTech solutions/products
  - `Playbook` - Generated playbooks for districts
  - `ControlledVocabulary` - Lookup values (grade ranges, subject areas)

**File Storage:**
- Not detected - Assets stored as JSON in database
  - `Product.assets` field stores asset metadata as JSON array
  - `ProductAsset` type in `src/services/types/product.ts`

**Caching:**
- None detected

## Authentication & Identity

**Auth Provider:**
- Clerk (https://clerk.com)
  - Implementation: Full OAuth/JWT integration via middleware
  - Session management: Automatic via Clerk SDK
  - User context: Extracted in `src/middleware.ts` and used in protected routes
  - Role mapping: User roles stored in database, fetched at `src/components/layout/sidebar.tsx` via `/api/users/me`

**User Roles (Database-stored):**
- `publisher-admin` - Admin permissions
- `publisher-rep` - Sales rep permissions
- `super-admin` - Super admin permissions

## Monitoring & Observability

**Error Tracking:**
- Not detected

**Logs:**
- Console logging only (standard Node.js `console` object)

**Health Checks:**
- Basic health endpoint: `GET /api/health` (public route, see `src/middleware.ts`)
- Returns: `{ status: 'ok' | 'degraded' | 'down'; timestamp: string }`

## CI/CD & Deployment

**Hosting:**
- Not detected in config files (Vercel is typical for Next.js)

**CI Pipeline:**
- Not detected

**Build Process:**
- `npm run build` - Next.js production build
- `npm run dev` - Development server with hot reload
- `npm run start` - Production server start

## Environment Configuration

**Required env vars:**
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` - Public Clerk key (must be public-accessible)
- `CLERK_SECRET_KEY` - Secret Clerk key (server-only)
- `NEXT_PUBLIC_CLERK_SIGN_IN_URL` - Route for sign-in page
- `NEXT_PUBLIC_CLERK_SIGN_UP_URL` - Route for sign-up page
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL` - Redirect after successful login
- `NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL` - Redirect after successful signup
- `DATABASE_URL` - PostgreSQL connection string

**Secrets location:**
- `.env` file (local development)
- Environment variables in hosting platform (production)
- See `.env.example` for template

**Public vs Private Keys:**
- Prefix `NEXT_PUBLIC_` indicates public (included in client bundle)
- No prefix indicates server-only (kept private)

## Webhooks & Callbacks

**Incoming:**
- None detected

**Outgoing:**
- None detected

## Service Integrations

**API Calls (Frontend to Backend):**
- Fetch endpoint: `GET /api/users/me` at `src/components/layout/sidebar.tsx:26`
  - Returns: `{ role: string }`
  - Used for: Role-based sidebar navigation gating

**Data Format:**
- JSON for all API responses
- Service interfaces defined in `src/services/interfaces/`

**Service Architecture:**
- Service interfaces define contracts (not implementations)
- Examples: `IDistrictService`, `IPlaybookService`, `IProductService` in `src/services/interfaces/`
- No concrete service implementations detected (may be in providers or deleted)

---

*Integration audit: 2026-02-13*
