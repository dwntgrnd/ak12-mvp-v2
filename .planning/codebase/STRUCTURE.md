# Codebase Structure

**Analysis Date:** 2026-02-13

## Directory Layout

```
ak12-mvp-v2/
├── src/
│   ├── app/                    # Next.js App Router pages and layouts
│   │   ├── (auth)/             # Auth group (login, sign-up)
│   │   ├── (dashboard)/        # Dashboard group (protected routes)
│   │   ├── layout.tsx          # Root layout with ClerkProvider
│   │   ├── page.tsx            # Root redirect to /discovery
│   │   └── globals.css         # Tailwind directives
│   ├── components/             # Reusable React components
│   │   ├── layout/             # Navigation and layout components
│   │   ├── shared/             # Shared utility components
│   │   └── ui/                 # Base UI component library
│   ├── lib/                    # Utilities and infrastructure
│   │   ├── constants/          # Shared constants
│   │   ├── utils/              # Helper functions
│   │   ├── design-tokens.ts    # Tailwind/CSS token values
│   │   ├── prisma.ts           # Prisma client singleton
│   │   └── utils.ts            # Generic utilities (cn, clsx)
│   ├── services/               # Service layer (contracts & types)
│   │   ├── interfaces/         # Service interface definitions (IDistrictService, etc.)
│   │   ├── types/              # Domain type definitions
│   │   ├── providers/          # Future: service implementation factories
│   │   │   ├── api/            # Future: API service implementations
│   │   │   └── local/          # Future: local/mock implementations
│   │   └── index.ts            # Service export barrel
├── prisma/
│   ├── schema.prisma           # Database schema (Prisma models)
│   ├── seed.ts                 # Database seeding script
│   └── migrations/             # Database migration history
├── public/                     # Static assets (images, fonts, etc.)
├── .planning/                  # GSD planning documents (created by /gsd commands)
│   └── codebase/               # Codebase analysis documents
├── .next/                      # Next.js build output
├── .git/                       # Git repository
├── node_modules/               # Dependencies
├── package.json                # Project manifest
├── tsconfig.json               # TypeScript configuration
├── next.config.ts              # Next.js configuration
├── tailwind.config.ts          # Tailwind CSS configuration
├── postcss.config.js           # PostCSS configuration
├── .eslintrc.json              # ESLint configuration
├── .prettierrc                 # Prettier configuration
└── README.md                   # Project documentation
```

## Directory Purposes

**src/app:**
- Purpose: Next.js App Router pages and layout hierarchies
- Contains: Route segments (pages, layouts, groups), static assets (CSS)
- Key files: `page.tsx` for routes, `layout.tsx` for layout wrappers

**src/app/(auth):**
- Purpose: Authentication flows (login, sign-up)
- Contains: Auth page routes, auth layout wrapper
- Key files: `login/[[...sign-in]]/page.tsx`, `sign-up/[[...sign-up]]/page.tsx`

**src/app/(dashboard):**
- Purpose: Protected dashboard routes and features
- Contains: Feature pages (discovery, playbooks, solutions, admin), dynamic routes
- Key files: Multiple pages and dynamic route handlers for district/playbook details

**src/components:**
- Purpose: Reusable React components
- Contains: Layout components (Sidebar), shared UI patterns, base component library
- Key files: `layout/sidebar.tsx` (main navigation), component exports

**src/lib:**
- Purpose: Infrastructure, utilities, and configuration
- Contains: Prisma client, design tokens, helper functions, constants
- Key files: `prisma.ts` (database singleton), `design-tokens.ts` (theme values)

**src/services:**
- Purpose: Service layer contracts and type definitions
- Contains: TypeScript interfaces defining service contracts, domain types, enums
- Subdirectories:
  - `interfaces/`: Service interface definitions (not yet containing implementations)
  - `types/`: Shared domain types, request/response shapes
  - `providers/`: Directory structure for future implementation providers (currently empty)

**prisma/:**
- Purpose: Database schema and migrations
- Contains: Prisma schema definition, seed data, migration files
- Key files: `schema.prisma` (single source of truth for database structure)

**public/:**
- Purpose: Static assets served directly
- Contains: Images, icons, fonts, favicons

**node_modules/:**
- Purpose: Installed dependencies
- Generated: Yes (via npm install)
- Committed: No (listed in .gitignore)

**.next/:**
- Purpose: Next.js build output and development server cache
- Generated: Yes (via `npm run build` or `npm run dev`)
- Committed: No (listed in .gitignore)

## Key File Locations

**Entry Points:**
- `src/app/layout.tsx`: Root layout; wraps entire app with ClerkProvider
- `src/app/page.tsx`: Root page; redirects to `/discovery`
- `src/app/(auth)/layout.tsx`: Auth page wrapper
- `src/app/(dashboard)/layout.tsx`: Dashboard layout with Sidebar

**Configuration:**
- `tsconfig.json`: TypeScript compiler, path aliases (`@/*` → `src/*`)
- `next.config.ts`: Next.js configuration
- `tailwind.config.ts`: Tailwind CSS theme configuration
- `.eslintrc.json`: ESLint rules
- `prisma/schema.prisma`: Database schema and models

**Core Logic:**
- `src/services/interfaces/`: Service contracts (business logic definition)
  - `district-service.ts`: Search, save, exclude, fit assessment
  - `product-service.ts`: Product CRUD, asset management
  - `playbook-service.ts`: Playbook generation, polling, section editing
  - `user-service.ts`: User invitation, deactivation
  - `auth-service.ts`: Authentication and health checks
  - `config-service.ts`: Controlled vocabulary lookup
  - `tenant-service.ts`: Organization management (super-admin)

**Types:**
- `src/services/types/common.ts`: Shared types (`PaginatedResponse`, `ServiceError`, `ServiceContext`, `FitAssessment`)
- `src/services/types/district.ts`: `DistrictSummary`, `DistrictProfile`, `DistrictSearchRequest`
- `src/services/types/product.ts`: `Product`, `ProductSummary`, `ProductFilters`
- `src/services/types/playbook.ts`: `Playbook`, `PlaybookSection`, `PlaybookGenerationRequest`
- `src/services/types/user.ts`: `TenantUser`, `InviteUserRequest`

**Layout & UI:**
- `src/components/layout/sidebar.tsx`: Main navigation sidebar with role-based conditional rendering
- `src/lib/design-tokens.ts`: CSS custom properties for theming

**Database:**
- `src/lib/prisma.ts`: Prisma client singleton with dev-mode hot reload prevention

## Naming Conventions

**Files:**
- Page routes: `page.tsx` (Next.js convention)
- Layouts: `layout.tsx` (Next.js convention)
- Dynamic segments: `[paramName]/` (Next.js convention)
- Catch-all segments: `[[...slug]]/` (Next.js convention for optional segments)
- Components: `kebab-case.tsx` (e.g., `sidebar-nav-item.tsx`)
- Services: `kebab-case-service.ts` (e.g., `district-service.ts`)
- Types: `kebab-case.ts` (e.g., `district.ts`)
- Utilities: `kebab-case.ts` (e.g., `design-tokens.ts`)

**Directories:**
- Feature groups: `(group-name)` (Next.js layout groups)
- Feature areas: `kebab-case` (e.g., `components/layout/`, `services/interfaces/`)
- Dynamic parameters: `[paramName]` (Next.js convention)

**TypeScript:**
- Interfaces: `PascalCase`, prefixed with `I` for service contracts (e.g., `IDistrictService`)
- Types: `PascalCase` (e.g., `DistrictSummary`, `FitAssessment`)
- Enums: `PascalCase` (e.g., `UserRole`)
- Constants: `CONSTANT_CASE` (e.g., `EXCLUSION_CATEGORIES`)
- Functions: `camelCase` (e.g., `searchDistricts()`)

## Where to Add New Code

**New Feature (e.g., district comparison):**
- Primary code: `src/app/(dashboard)/districts/compare/page.tsx`
- Service interface: `src/services/interfaces/district-service.ts` (add new method)
- Service types: `src/services/types/district.ts` (add new return types if needed)
- Components: `src/components/district/` (create feature-specific components)
- Service implementation: `src/services/providers/api/district-service.ts` (future)

**New Component/Module:**
- Shared component: `src/components/shared/` or `src/components/ui/`
- Feature-specific component: `src/components/{feature-name}/` (e.g., `src/components/playbook/`)
- Implementation: Create `.tsx` file with default export
- Export from barrel: Add to `src/components/{feature-name}/index.ts` if multiple files

**New Service:**
- Interface: `src/services/interfaces/{service-name}-service.ts`
- Types: Add domain types to `src/services/types/{domain}.ts` or create new file
- Export: Add type/interface exports to `src/services/index.ts`
- Implementation: Create in `src/services/providers/api/{service-name}-service.ts` (future)

**Utilities:**
- Shared helpers: `src/lib/utils/` (create subdirectory if many files)
- Specific domain utilities: `src/lib/utils/{domain}.ts` (e.g., `src/lib/utils/district.ts`)
- Constants: `src/lib/constants/` (categorical constants organized in files)

**Types & Constants:**
- Domain types: `src/services/types/{domain}.ts`
- Shared types: `src/services/types/common.ts`
- Controlled vocabularies: `src/services/types/controlled-vocabulary.ts`
- UI constants: `src/lib/constants/`

## Special Directories

**src/services/providers:**
- Purpose: Contains pluggable service implementations (API or local mock)
- Generated: No
- Committed: Yes (but subdirectories currently empty)
- Note: Factory pattern for dependency injection. Currently `api/` and `local/` directories exist but are empty. Implementations to be added as features are built.

**.planning/codebase:**
- Purpose: Generated codebase analysis documents (ARCHITECTURE.md, STRUCTURE.md, etc.)
- Generated: Yes (by `/gsd:map-codebase` command)
- Committed: Yes
- Note: Consumed by `/gsd:plan-phase` and `/gsd:execute-phase` commands for context

**.next/**
- Purpose: Next.js build output and development server cache
- Generated: Yes
- Committed: No

**prisma/migrations/**
- Purpose: Database migration history
- Generated: Partially (auto-generated by Prisma, manual edits supported)
- Committed: Yes

---

*Structure analysis: 2026-02-13*
