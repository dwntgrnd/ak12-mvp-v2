# AlchemyK12 MVP v2

## What This Is

A sales intelligence platform for K-12 EdTech publishers. Sales reps use it to search California school districts, assess product-district fit, and generate AI-powered playbooks for outreach. This is a new capability — no existing tool or workflow to replace.

## Core Value

Sales reps can find the right districts for their products and walk into meetings with district-specific talking points — turning cold outreach into informed conversations.

## Requirements

### Validated

<!-- Shipped and confirmed valuable. -->

(None yet — ship to validate)

### Active

<!-- Current scope. Building toward these. -->

- [ ] District discovery with search and filtering across California districts
- [ ] District profiles with demographics, proficiency, and funding data
- [ ] Product-district fit assessment (strong/moderate/low) driven by AI
- [ ] Solutions library for publishers to manage their product catalog
- [ ] AI-generated playbooks with district-specific talking points
- [ ] Saved/bookmarked districts for territory building
- [ ] District exclusion with categorized reasons
- [ ] Multi-tenant architecture (publisher orgs as tenants)
- [ ] Role-based access (super-admin, publisher-admin, publisher-rep)
- [ ] User management (invite, deactivate, reactivate)

### Out of Scope

<!-- Explicit boundaries. Includes reasoning to prevent re-adding. -->

- Real-time chat/messaging — not core to the intelligence workflow
- Mobile app — web-first, desktop reps are the primary users
- States beyond California — MVP scoped to CA districts only
- Automated outreach/email — this is intelligence, not CRM
- Analytics/reporting dashboards — defer until usage patterns emerge

## Context

- **Client:** AlchemyK12 (EdTech company)
- **Timeline:** 6-8 weeks, kickoff week of February 10, 2026
- **Users:** Individual sales reps at K-12 EdTech publishers, daily use
- **Domain:** California public school districts — demographics, test proficiency, funding data
- **Architecture:** Three-layer design — UI components → service interfaces → swappable providers (local Prisma first, AWS API later)
- **Service contracts:** 6 services, 36 methods defined (AuthService, TenantService, UserService, ProductService, DistrictService, PlaybookService)
- **Reference vault:** Obsidian at `/Users/dorenberge/WorkInProgress/UI-Projects-Vault/Projects/AK12-MVP-v2/`

## Constraints

- **Tech stack:** Next.js 15, TypeScript strict, Tailwind CSS v4, shadcn/ui, App Router
- **Auth:** Clerk (Phase 2)
- **Database:** PostgreSQL via Prisma (Phase 2)
- **Hosting:** Vercel (deployment target)
- **Design:** Brand token system from Figma — dark navy sidebar, cyan primary action color
- **Build phases:** Three phases — (1) Foundation & shell, (2) Auth & data, (3) First vertical slice

## Key Decisions

<!-- Decisions that constrain future work. Add throughout project lifecycle. -->

| Decision | Rationale | Outcome |
|----------|-----------|---------|
| Three-layer architecture with service interfaces | Decouple UI from data providers; enables local dev first, AWS swap later | — Pending |
| Service context derived from auth token, not passed per-call | Simpler API surface; tenant scoping is implicit | — Pending |
| Playbook generation is async (SSE preferred, polling fallback) | AI generation takes time; progressive delivery improves UX | — Pending |
| District data stored as JSONB | Flexible schema for varying district data fields across states | — Pending |
| Controlled vocabulary validated on write | Prevents invalid data; enums defined in code as source of truth | — Pending |

---
*Last updated: 2026-02-12 after initialization*
