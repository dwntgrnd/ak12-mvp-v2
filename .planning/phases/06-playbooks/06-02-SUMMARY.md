---
phase: 06-playbooks
plan: 02
subsystem: playbooks
tags: [frontend, ui, components, filtering, generation-tracking]
dependency_graph:
  requires: [playbook-api, playbook-types, controlled-vocabulary]
  provides: [playbook-list-ui, playbook-detail-ui]
  affects: [playbook-generation-flow]
tech_stack:
  added: []
  patterns: [polling-with-auto-reload, client-side-filtering, optimistic-ui, status-indicators]
key_files:
  created:
    - src/components/playbooks/playbook-card.tsx
    - src/components/playbooks/playbook-filters.tsx
    - src/components/playbooks/generation-status.tsx
    - src/components/playbooks/playbook-section.tsx
  modified:
    - src/app/(dashboard)/playbooks/page.tsx
    - src/app/(dashboard)/playbooks/[playbookId]/page.tsx
    - src/services/types/controlled-vocabulary.ts
decisions:
  - Polling every 2s with auto-reload on completion for generation status
  - Client-side list page with fetch-on-filter-change pattern
  - Optimistic UI update for delete operations
  - Section status dots show 6 section statuses at a glance
  - Color-coded fit badges (green/yellow/red) for visual assessment
metrics:
  duration: 3min 17s
  tasks_completed: 2
  files_created: 4
  files_modified: 3
  commits: 2
  completed_at: "2026-02-12T16:12:31Z"
---

# Phase 06 Plan 02: Playbook List & Detail UI Summary

**One-liner**: Full playbook browsing and viewing experience with fit category filtering, generation progress polling, and all 6 sections rendered with content source badges.

## What Was Built

Implemented the complete playbook UI layer for browsing and viewing playbooks, including list page with filtering, detail page with generation tracking, and all necessary component infrastructure. Users can now filter playbooks by fit category, monitor generation progress with per-section status indicators, and view completed playbooks with all 6 sections fully rendered.

### Playbook List Page (page.tsx)

**Client-side page** with filtering and optimistic delete:
- Fetches playbooks from GET /api/playbooks with fitCategory query param
- PlaybookFilters component with 4 buttons (All/Strong/Moderate/Low)
- Grid layout matching solutions page (1 col mobile, 2 md, 3 lg)
- Empty state: "No playbooks yet. Generate your first playbook..."
- Delete handler with window.confirm and optimistic UI update
- Loading and error states

### PlaybookCard Component (playbook-card.tsx)

**Card component** for list items:
- Clickable link to /playbooks/{playbookId}
- District name as title, product names as comma-joined subtitle
- Color-coded fit category badges (green=strong, yellow=moderate, red=low)
- Formatted date (generatedAt)
- Section status dots: 6 small circles showing status for each section (green=complete, yellow=generating, gray=pending, red=error)
- Delete button (X icon) in top-right with confirmation and event propagation stopped

### PlaybookFilters Component (playbook-filters.tsx)

**Filter controls** for fit categories:
- 4 buttons: All, Strong, Moderate, Low
- Active filter gets primary styling (bg-primary text-primary-foreground)
- Inactive filters get outline styling (border with hover effects)
- Clicking "All" clears fitCategory filter
- Clicking category sets fitCategory filter

### Playbook Detail Page ([playbookId]/page.tsx)

**Client-side page** with generation tracking:
- Unwraps params promise in useEffect (Next.js 15 pattern)
- Fetches playbook detail and status in parallel on mount
- Back navigation link to /playbooks with ArrowLeft icon
- Header: district name, product badges, fit category badge, formatted date
- Delete button in header (same pattern as admin actions)
- Fit rationale displayed in info card below header
- Conditional rendering based on overallStatus:
  - If 'generating': show GenerationStatus component
  - If 'complete' or 'partial': show all sections with PlaybookSection components
- Section order: key_themes, product_fit, objections, stakeholders, district_data, fit_assessment

### GenerationStatus Component (generation-status.tsx)

**Polling component** for generation progress:
- Accepts playbookId and initialStatus props
- Polls GET /api/playbooks/{playbookId}/status every 2 seconds while overallStatus is 'generating'
- Renders progress card with:
  - "Generating playbook..." header
  - Overall status text
  - List of sections with status icons:
    - Loader2 (spinning) for generating
    - CheckCircle2 (green) for complete
    - Clock (gray) for pending
    - XCircle (red) for error
- When generation completes (overallStatus becomes 'complete' or 'partial'):
  - Stop polling
  - Call window.location.reload() to show full content
- Cleanup interval on unmount

### PlaybookSection Component (playbook-section.tsx)

**Section renderer** for playbook content:
- Accepts section and playbookId props
- Renders based on status:
  - 'error': red error message with errorMessage
  - 'pending' or 'generating': skeleton loading state (animated gray bars)
  - 'complete': full content with badges
- Complete rendering:
  - Section label as header
  - Content source badge (verbatim=blue, constrained=purple, synthesis=green, hybrid=orange)
  - "Edited" badge if isEdited is true
  - Content rendered with whitespace-pre-wrap for preserving line breaks
- Clean card layout matching detail page pattern

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 3 - Blocking Issue] Added FIT_CATEGORIES to controlled-vocabulary**
- **Found during:** Task 1 (PlaybookFilters implementation)
- **Issue:** FIT_CATEGORIES constant not defined in controlled-vocabulary.ts, blocking filter component compilation
- **Fix:** Added FIT_CATEGORIES array ('strong', 'moderate', 'low') and FitCategory type to controlled-vocabulary.ts following existing pattern
- **Files modified:** src/services/types/controlled-vocabulary.ts
- **Commit:** b1cb075

This was a missing critical dependency for the filter component to function. The const array pattern matches the existing GRADE_RANGES and SUBJECT_AREAS, ensuring compile-time type safety per project conventions.

## Verification Results

**TypeScript compilation**:
```bash
npx tsc --noEmit
# No errors after both tasks
```

**Task 1 checklist**:
- [x] PlaybookFilters component with All/Strong/Moderate/Low buttons
- [x] Active filter gets primary styling, inactive get outline
- [x] PlaybookCard component with district name, product names, fit badge
- [x] Section status dots showing 6 section statuses
- [x] Delete button with confirmation and event propagation stopped
- [x] Playbooks list page with filtering and grid layout
- [x] Empty state, loading state, error state
- [x] Delete handler with optimistic UI update

**Task 2 checklist**:
- [x] GenerationStatus component with polling every 2s
- [x] Polling stops and reloads when generation completes
- [x] PlaybookSection component with status-based rendering
- [x] Error, pending/generating, and complete states all handled
- [x] Content source badges and edited indicators
- [x] Playbook detail page fetches playbook and status in parallel
- [x] Back navigation, delete button, fit rationale display
- [x] Conditional rendering: GenerationStatus while generating, sections when complete
- [x] Sections rendered in specified order

## Self-Check: PASSED

**Created files verified**:
```bash
[ -f "src/components/playbooks/playbook-card.tsx" ] && echo "FOUND"
[ -f "src/components/playbooks/playbook-filters.tsx" ] && echo "FOUND"
[ -f "src/components/playbooks/generation-status.tsx" ] && echo "FOUND"
[ -f "src/components/playbooks/playbook-section.tsx" ] && echo "FOUND"
# All 4 files exist
```

**Modified files verified**:
```bash
[ -f "src/app/(dashboard)/playbooks/page.tsx" ] && echo "FOUND"
[ -f "src/app/(dashboard)/playbooks/[playbookId]/page.tsx" ] && echo "FOUND"
[ -f "src/services/types/controlled-vocabulary.ts" ] && echo "FOUND"
# All 3 files exist and modified
```

**Commits verified**:
```bash
git log --oneline -3
# c7c39bd feat(06-02): create playbook detail page with sections and generation status
# b1cb075 feat(06-02): create playbook list page with filtering and cards
# Both commits FOUND
```

## Technical Decisions

**Polling with auto-reload pattern**:
Chose simple polling every 2 seconds with window.location.reload() on completion instead of complex client-side state updates. This ensures the UI always reflects the latest server state and simplifies the generation status component. The reload happens only once when all sections complete, providing a clean transition from "generating" to "complete" view.

**Client-side list page vs server component**:
Made the list page 'use client' to enable filtering without page reloads. This matches the solutions page pattern and provides immediate feedback when clicking filter buttons. The detail page is also client-side to handle polling and optimistic delete navigation.

**Section status dots for at-a-glance progress**:
Added 6 small colored dots to each playbook card showing the status of all sections. This provides instant visual feedback about generation progress without needing to click into the detail page. Color mapping: green=complete, yellow=generating, gray=pending, red=error.

**Optimistic UI for delete**:
Delete operations immediately remove the playbook from local state arrays (list page and navigation from detail page) without refetching. This follows the Phase 4 pattern established for district saves/excludes and provides instant feedback.

**Content source badges for transparency**:
Each completed section shows its content source (verbatim/constrained/synthesis/hybrid) with distinct colors. This provides users with transparency about how the AI generated each section, which will be important when Plan 03 adds editing (users know if they're editing verbatim vs synthesized content).

## What's Next

This plan completes the playbook viewing experience. Plan 03 will add:
- Section editing with inline text area
- Section regeneration for failed/error sections
- Edit history and revert functionality
- Manual section content updates via PATCH API

The UI is now fully functional for browsing, filtering, viewing, and deleting playbooks. Generation progress is tracked in real-time, and completed playbooks display all 6 sections with proper formatting.
