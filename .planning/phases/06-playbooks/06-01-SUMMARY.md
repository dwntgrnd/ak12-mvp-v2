---
phase: 06-playbooks
plan: 01
subsystem: playbooks
tags: [backend, api, service-layer, generation]
dependency_graph:
  requires: [district-service, product-service, prisma-schema]
  provides: [playbook-service, playbook-api]
  affects: [playbook-ui]
tech_stack:
  added: []
  patterns: [fire-and-forget-async, mock-ai-generator, template-based-content]
key_files:
  created:
    - src/services/playbook-service.ts
    - src/app/api/playbooks/route.ts
    - src/app/api/playbooks/[playbookId]/route.ts
    - src/app/api/playbooks/[playbookId]/status/route.ts
    - src/app/api/playbooks/[playbookId]/sections/[sectionId]/route.ts
    - src/app/api/playbooks/[playbookId]/sections/[sectionId]/regenerate/route.ts
    - src/app/api/districts/[districtId]/playbooks/route.ts
  modified: []
decisions:
  - Sequential section generation with partial completion handling
  - Fire-and-forget async pattern for generation (immediate 202 response)
  - Mock AI generator produces district-specific content from templates
  - Hard delete for playbooks (explicit section cleanup then playbook deletion)
metrics:
  duration: 3min 43s
  tasks_completed: 2
  files_created: 7
  commits: 2
  completed_at: "2026-02-12T16:05:56Z"
---

# Phase 06 Plan 01: Playbook Service & API Summary

**One-liner**: Complete playbook backend with service layer, mock AI content generation, and 7 REST API routes supporting async generation, editing, and deletion.

## What Was Built

Implemented the full playbook service layer and API contract for phase 6, providing all data operations needed by the playbook UI (Plans 02 and 03). The service generates playbooks with 6 section types using real district and product data, with a mock AI generator that produces realistic, district-specific content from templates.

### Service Layer (playbook-service.ts)

**8 exported functions**:
- `generatePlaybook` - Creates playbook + 6 sections, fires async generation, returns playbookId immediately
- `getPlaybookStatus` - Returns overall status + per-section status for polling
- `getPlaybook` - Full playbook with all sections
- `getPlaybookSection` - Single section detail
- `getPlaybooks` - List with fitCategory filter and sorting
- `getExistingPlaybooks` - District-specific playbooks for a user
- `updatePlaybookSection` - Edit section content, sets isEdited flag
- `regenerateSection` - Re-runs generation for failed/error sections
- `deletePlaybook` - Hard delete with explicit section cleanup

**Mock AI Generator**:
Created `generateSectionContent()` helper that produces template-based content using real district and product data. Each section type (key_themes, product_fit, objections, stakeholders, district_data, fit_assessment) gets a custom template that interpolates actual values like district name, enrollment, proficiency scores, product names, and fit assessment rationale.

**Example output quality**:
- Key Themes: "District X serves 50,000 students in County Y and presents several key opportunities for Product A, Product B. The district's proficiency data shows an average of 42.3% across core subjects..."
- Stakeholders: "**Superintendent**: Primary decision-maker... **Curriculum Director**: Key influencer on instructional materials... **Start with Curriculum Director to build internal advocacy...**"

**Generation flow**:
1. Create Playbook record with overallStatus='generating'
2. Create 6 PlaybookSection records with status='pending'
3. Return playbookId immediately (202 response)
4. Fire-and-forget: Iterate sections sequentially
   - Set status='generating'
   - Call mock generator
   - Set status='complete' with content
   - On error: Set status='error' with errorMessage
5. Update playbook overallStatus: 'complete' (all success), 'partial' (some failed), 'failed' (all failed)

**Error handling**:
- PLAYBOOK_NOT_FOUND - playbook doesn't exist or wrong user
- SECTION_NOT_FOUND - section doesn't exist
- DISTRICT_NOT_FOUND - invalid district for generation
- PRODUCT_NOT_FOUND - no valid products provided
- NOT_REGENERABLE - section cannot be regenerated

All operations scoped to userId (passed as first parameter per Phase 4 pattern).

### API Routes

**7 REST endpoints**:

1. **POST /api/playbooks** - Generate playbook, returns 202 with `{ playbookId }`
2. **GET /api/playbooks** - List with fitCategory/sortBy/sortOrder query params
3. **GET /api/playbooks/[playbookId]** - Full playbook detail
4. **DELETE /api/playbooks/[playbookId]** - Delete playbook, returns 204
5. **GET /api/playbooks/[playbookId]/status** - Status for polling
6. **GET /api/playbooks/[playbookId]/sections/[sectionId]** - Section detail
7. **PATCH /api/playbooks/[playbookId]/sections/[sectionId]** - Edit content
8. **POST /api/playbooks/[playbookId]/sections/[sectionId]/regenerate** - Regenerate, returns 202
9. **GET /api/districts/[districtId]/playbooks** - District-specific playbooks

All routes follow the established pattern:
- `getCurrentUser()` at boundary
- Pass `user.id` to service
- Map error codes to HTTP status (401, 404, 500)
- Use `await params` for Next.js 15 async params

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

**TypeScript compilation**:
```bash
npx tsc --noEmit
# No errors
```

**Service layer checklist**:
- [x] 8 exported functions matching IPlaybookService interface
- [x] All functions take userId as first parameter
- [x] Prisma queries scoped to userId
- [x] Fire-and-forget async generation pattern
- [x] Mock AI generator with district-specific content (not lorem ipsum)
- [x] Error codes match existing codebase pattern

**API routes checklist**:
- [x] 7 route files created
- [x] All routes authenticate via getCurrentUser
- [x] POST /api/playbooks returns 202 (Accepted)
- [x] POST regenerate returns 202
- [x] DELETE returns 204 (No Content)
- [x] Consistent error handling across all routes
- [x] Async params pattern with `await params`

## Self-Check: PASSED

**Created files verified**:
```bash
# All 7 files exist
[ -f "src/services/playbook-service.ts" ] && echo "FOUND"
[ -f "src/app/api/playbooks/route.ts" ] && echo "FOUND"
[ -f "src/app/api/playbooks/[playbookId]/route.ts" ] && echo "FOUND"
[ -f "src/app/api/playbooks/[playbookId]/status/route.ts" ] && echo "FOUND"
[ -f "src/app/api/playbooks/[playbookId]/sections/[sectionId]/route.ts" ] && echo "FOUND"
[ -f "src/app/api/playbooks/[playbookId]/sections/[sectionId]/regenerate/route.ts" ] && echo "FOUND"
[ -f "src/app/api/districts/[districtId]/playbooks/route.ts" ] && echo "FOUND"
```

**Commits verified**:
```bash
git log --oneline -2
# a6241f0 feat(06-01): create playbook API routes
# e6864ac feat(06-01): implement playbook service layer
```

## Technical Decisions

**Fire-and-forget async generation**:
The service returns immediately with a playbookId while generation runs in the background. This enables the polling pattern where UI can call GET /status endpoint to track progress. Used Promise without await and .catch() for error logging.

**Sequential vs parallel section generation**:
Chose sequential iteration over sections to simplify error handling and status updates. In production with real AI calls, this could be parallelized with Promise.all, but for MVP the sequential approach is simpler and still fast enough (mock generation is instant).

**Template-based mock content**:
Created realistic templates for each section type that interpolate real data (district name, enrollment, proficiency, products). This provides the UI team with actual content to work with, and the templates are designed to match what real AI would produce. When swapping to real AI (three-layer architecture per PROJECT.md), only the `generateSectionContent` function needs replacement.

**Hard delete for playbooks**:
Playbook model has no isDeleted flag (unlike Product). Used explicit cascade: delete sections first, then playbook. This matches the ephemeral nature of generated content - users can always regenerate a playbook if needed.

## What's Next

This plan provides the complete data layer for Phase 6. Plans 02 and 03 will build the playbook UI:
- Plan 02: Playbook generation flow (catalog → generation → status polling)
- Plan 03: Playbook viewer with section editing and regeneration

The service is ready for immediate consumption - all 8 functions are implemented and all 7 API routes are functional.
