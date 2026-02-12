# AlchemyK12 MVP v2

## What This Is

A sales intelligence platform for K-12 EdTech publishers. Sales reps search California school districts, assess product-district fit, generate AI-powered playbooks for outreach, and manage their territory. Publisher admins manage product catalogs and users. Shipped as v0.1 MVP with 7 phases covering discovery, territory management, solutions, playbooks, and user management.

## Core Value

Sales reps can find the right districts for their products and walk into meetings with district-specific talking points — turning cold outreach into informed conversations.

## Requirements

### Validated

- ✓ District discovery with search and filtering across California districts — v0.1
- ✓ District profiles with demographics, proficiency, and funding data — v0.1
- ✓ Product-district fit assessment (strong/moderate/low) driven by heuristic algorithm — v0.1
- ✓ Solutions library for publishers to manage their product catalog — v0.1
- ✓ AI-generated playbooks with district-specific talking points — v0.1 (mock AI)
- ✓ Saved/bookmarked districts for territory building — v0.1
- ✓ District exclusion with categorized reasons — v0.1
- ✓ Multi-tenant architecture (publisher orgs as tenants) — v0.1
- ✓ Role-based access (super-admin, publisher-admin, publisher-rep) — v0.1
- ✓ User management (invite, deactivate, reactivate) — v0.1

### Active

- [ ] Real AI integration for playbook generation (replace mock generator)
- [ ] Cloud storage for product assets (replace metadata-only upload)
- [ ] Server-side admin page route protection
- [ ] Excluded districts filtered from discovery results
- [ ] Tenant management UI for super-admins

### Out of Scope

- Real-time chat/messaging — not core to the intelligence workflow
- Mobile app — web-first, desktop reps are the primary users
- States beyond California — MVP scoped to CA districts only; expand after validation
- Automated outreach/email — this is intelligence, not CRM
- Analytics/reporting dashboards — defer until usage patterns emerge
- Offline mode — real-time data access is core to the workflow

## Context

- **Shipped:** v0.1 MVP on 2026-02-12
- **Codebase:** 8,264 LOC TypeScript across 160 files
- **Tech stack:** Next.js 15, TypeScript strict, Tailwind CSS v4, Clerk auth, Prisma + PostgreSQL
- **Data:** 25 seeded California districts with demographics, proficiency, and funding JSONB data
- **Architecture:** UI components → API routes → service functions → Prisma (direct, no interface indirection)
- **Service contracts:** 6 services implemented (Auth, Tenant, User, Product, District, Playbook)
- **Known issue:** Node.js 18.6.0 below Next.js requirement (>=20.9.0) — dev server cannot start until upgraded
- **Tech debt:** Mock AI generator, metadata-only asset upload, admin page lacks server-side guard
- **Reference vault:** Obsidian at `/Users/dorenberge/WorkInProgress/UI-Projects-Vault/Projects/AK12-MVP-v2/`

## Constraints

- **Tech stack:** Next.js 15, TypeScript strict, Tailwind CSS v4, shadcn/ui, App Router
- **Auth:** Clerk
- **Database:** PostgreSQL via Prisma 5.20.0
- **Hosting:** Vercel (deployment target)
- **Design:** Brand token system — dark navy sidebar, cyan primary action color, HSL CSS variables
- **Node.js:** Requires >=20.9.0 for dev server (current environment has 18.6.0)

## Key Decisions

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Three-layer architecture with service interfaces | Decouple UI from data providers; enables local dev first, AWS swap later | ✓ Good — interfaces defined in Phase 1, implementations use direct Prisma calls |
| Service context derived from auth token, not passed per-call | Simpler API surface; tenant scoping is implicit | ✓ Good — getCurrentUser() resolves at API boundary, tenantId passed to service functions |
| Playbook generation is async with polling | AI generation takes time; progressive delivery improves UX | ✓ Good — fire-and-forget with 2s polling, section-level status updates |
| District data stored as JSONB | Flexible schema for varying district data fields across states | ✓ Good — demographics/proficiency/funding render dynamically from JSONB |
| Controlled vocabulary validated on write | Prevents invalid data; enums defined in code as source of truth | ✓ Good — const array pattern with derived TypeScript types |
| Prisma 5.20.0 (not v7+) | Node 18.6.0 compatibility | ⚠️ Revisit — upgrade when Node.js upgraded to >=20.9.0 |
| Mock AI generator for playbooks | Real AI integration deferred for MVP speed | ⚠️ Revisit — replace with OpenAI/Anthropic API in next milestone |
| Clerk pre-built SignIn/SignUp components | Faster implementation, consistent UI | ✓ Good — minimal auth code, handles all flows |
| Soft delete pattern for products | Preserve data integrity, allow recovery | ✓ Good — isDeleted flag with filtered queries |
| TenantId-first parameter pattern | Enforce multi-tenant isolation at service layer | ✓ Good — all service functions scoped by tenant |

---
*Last updated: 2026-02-12 after v0.1 milestone*
