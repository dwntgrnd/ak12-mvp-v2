# Roadmap: AlchemyK12 MVP v2

## Overview

Build a sales intelligence platform for K-12 EdTech publishers in seven phases. Foundation and auth/data layers establish the platform, then four feature verticals deliver discovery, district management, product catalog, and AI playbooks. Final phase adds user management capabilities.

## Phases

**Phase Numbering:**
- Integer phases (1, 2, 3): Planned milestone work
- Decimal phases (2.1, 2.2): Urgent insertions (marked with INSERTED)

Decimal phases appear between their surrounding integers in numeric order.

- [x] **Phase 1: Foundation & Shell** - Project scaffold, design system, navigation, service contracts
- [x] **Phase 2: Auth & Data Layer** - Clerk authentication, Prisma + PostgreSQL, seed data
- [x] **Phase 3: Discovery & District Profiles** - Search California districts, view detailed profiles
- [x] **Phase 4: District Management** - Save/bookmark and exclude districts with reasons
- [ ] **Phase 5: Solutions Library** - Product catalog with admin CRUD and asset management
- [ ] **Phase 6: Playbooks** - AI-generated district-specific playbooks with editing
- [ ] **Phase 7: User Management** - Invite, deactivate, reactivate users with role assignment

## Phase Details

### Phase 1: Foundation & Shell
**Goal**: Project scaffold exists with design system, navigation structure, and typed service interfaces ready for implementation
**Depends on**: Nothing (first phase)
**Requirements**: None (infrastructure phase)
**Success Criteria** (what must be TRUE):
  1. Next.js 15 app runs locally with TypeScript strict mode and Tailwind CSS v4
  2. Sidebar navigation renders with all planned routes (even if stub pages)
  3. Design tokens (colors, spacing, typography) applied consistently via Tailwind config
  4. Service interfaces and types defined for all 6 services (36 methods total)
  5. Health check endpoint responds successfully
**Plans**: 3 plans

Plans:

- [x] 01-01-PLAN.md — Project scaffold + design token system
- [x] 01-02-PLAN.md — Service interfaces & types (36 methods)
- [x] 01-03-PLAN.md — App shell, sidebar navigation & health check

### Phase 2: Auth & Data Layer
**Goal**: Users can authenticate and data layer is operational with seeded California district data
**Depends on**: Phase 1
**Requirements**: AUTH-01, AUTH-02, AUTH-03
**Success Criteria** (what must be TRUE):
  1. User can sign in with email and password via Clerk
  2. User session persists across browser refresh
  3. PostgreSQL database exists with Prisma schema for all entities
  4. Database contains seeded California district data (demographics, proficiency, funding)
  5. System health check endpoint reports database connectivity
**Plans**: 3 plans

Plans:
- [x] 02-01-PLAN.md — Prisma + PostgreSQL schema for all entities
- [x] 02-02-PLAN.md — Clerk authentication integration
- [x] 02-03-PLAN.md — California district seed data + health check DB wiring

### Phase 3: Discovery & District Profiles
**Goal**: Users can search California districts and view comprehensive district profiles
**Depends on**: Phase 2
**Requirements**: DISC-01, DISC-02, DISC-03, DISC-04, DISC-05, DIST-01, DIST-02, DIST-03, DIST-04
**Success Criteria** (what must be TRUE):
  1. User can search districts by name or keyword and see paginated results
  2. User can filter districts by demographics, enrollment, and location
  3. Available filter facets display dynamically based on data
  4. User can select products and see fit assessment (strong/moderate/low) for each district
  5. User can click a district and view full profile with demographics, proficiency, and funding data
  6. District profile renders all available data fields dynamically
**Plans**: 3 plans

Plans:

- [x] 03-01-PLAN.md — District service layer + API routes (search, filters, detail, fit assessment)
- [x] 03-02-PLAN.md — Discovery search UI (search bar, filter sidebar, result cards, pagination)
- [x] 03-03-PLAN.md — District profile page (demographics, proficiency, funding, fit assessment)

### Phase 4: District Management
**Goal**: Users can save districts for territory building and exclude districts with categorized reasons
**Depends on**: Phase 3
**Requirements**: DMGT-01, DMGT-02, DMGT-03, DMGT-04, DMGT-05, DMGT-06
**Success Criteria** (what must be TRUE):
  1. User can bookmark a district from search results or profile view
  2. User can view all saved districts in a dedicated list
  3. User can remove districts from saved list
  4. User can exclude a district and select a categorized reason (e.g., "Not in territory", "Already has solution")
  5. User can view all excluded districts with their exclusion reasons
  6. User can restore an excluded district back to active status
**Plans**: 2 plans

Plans:

- [x] 04-01-PLAN.md — District management service layer & API routes (save, exclude, restore)
- [x] 04-02-PLAN.md — District management UI (save/exclude buttons, exclusion modal, saved/excluded page)

### Phase 5: Solutions Library
**Goal**: Publisher admins can manage product catalog with full CRUD and asset uploads
**Depends on**: Phase 4
**Requirements**: PROD-01, PROD-02, PROD-03, PROD-04, PROD-05, PROD-06
**Success Criteria** (what must be TRUE):
  1. User can view product catalog with filtering by grade range and subject area
  2. User can click a product and view full detail with metadata and assets
  3. Admin can create new product with grade range, subject area, description, and metadata
  4. Admin can edit existing product details
  5. Admin can soft-delete products (hidden but recoverable)
  6. Admin can upload product assets (PDFs, images) and associate with products
**Plans**: 3 plans

Plans:

- [ ] 05-01-PLAN.md — Product service layer & API routes (CRUD + asset upload)
- [ ] 05-02-PLAN.md — Product catalog UI & product detail page
- [ ] 05-03-PLAN.md — Admin product management UI (create, edit, delete, upload)

### Phase 6: Playbooks
**Goal**: Users can generate, view, edit, and manage AI-powered district playbooks
**Depends on**: Phase 5
**Requirements**: PLAY-01, PLAY-02, PLAY-03, PLAY-04, PLAY-05, PLAY-06, PLAY-07, PLAY-08
**Success Criteria** (what must be TRUE):
  1. User can generate a playbook for a district with selected products
  2. User can view playbook generation progress with section-level status updates
  3. User can view completed playbook with all sections (talking points, fit rationale, etc.)
  4. User can edit individual playbook sections inline
  5. User can regenerate individual sections without affecting rest of playbook
  6. User can view all playbooks with filtering by fit category (strong/moderate/low)
  7. User can view existing playbooks for a specific district before creating new one
  8. User can delete playbooks they no longer need
**Plans**: TBD

Plans:
- [ ] TBD during planning

### Phase 7: User Management
**Goal**: Publisher admins can invite users, assign roles, and manage user lifecycle
**Depends on**: Phase 6
**Requirements**: USER-01, USER-02, USER-03, USER-04
**Success Criteria** (what must be TRUE):
  1. Admin can invite new users via email with role assignment (publisher-admin or publisher-rep)
  2. Admin can view users list showing email, role, and status (active/invited/deactivated)
  3. Admin can deactivate active users (blocks login, preserves data)
  4. Admin can reactivate deactivated users (restores login access)
**Plans**: TBD

Plans:
- [ ] TBD during planning

## Progress

**Execution Order:**
Phases execute in numeric order: 1 → 2 → 3 → 4 → 5 → 6 → 7

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation & Shell | 3/3 | ✓ Complete | 2026-02-12 |
| 2. Auth & Data Layer | 3/3 | ✓ Complete | 2026-02-12 |
| 3. Discovery & District Profiles | 3/3 | ✓ Complete | 2026-02-12 |
| 4. District Management | 2/2 | ✓ Complete | 2026-02-12 |
| 5. Solutions Library | 0/3 | Planning complete | - |
| 6. Playbooks | 0/TBD | Not started | - |
| 7. User Management | 0/TBD | Not started | - |
