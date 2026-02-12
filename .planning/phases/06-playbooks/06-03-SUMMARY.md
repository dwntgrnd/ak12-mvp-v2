---
phase: 06-playbooks
plan: 03
subsystem: playbooks
tags: [frontend, ui, components, inline-editing, generation-trigger, district-integration]
dependency_graph:
  requires: [playbook-api, playbook-section-component, district-profile-page, product-api]
  provides: [section-editing-ui, section-regeneration-ui, district-playbook-generation]
  affects: [playbook-workflow, district-profile]
tech_stack:
  added: []
  patterns: [inline-editing, polling-regeneration, modal-pattern, product-selection, optimistic-callbacks]
key_files:
  created:
    - src/components/playbooks/product-selector.tsx
    - src/components/playbooks/existing-playbooks-panel.tsx
    - src/components/playbooks/generate-playbook-button.tsx
  modified:
    - src/components/playbooks/playbook-section.tsx
    - src/app/(dashboard)/playbooks/[playbookId]/page.tsx
    - src/app/(dashboard)/districts/[districtId]/page.tsx
decisions:
  - Inline edit mode with textarea auto-sizing (min 10 rows, max 30 rows based on content)
  - Section regeneration polls every 2s until status becomes complete or error
  - Parent callback pattern for section updates (onSectionUpdate prop)
  - ExistingPlaybooksPanel returns null when no playbooks (clean UI)
  - Modal pattern for generation (fixed overlay with centered card, click outside to close)
  - Product selector fetches all tenant products on mount
  - Generate button redirects to playbook detail immediately after POST (202 response)
metrics:
  duration: 3min 5s
  tasks_completed: 2
  files_created: 3
  files_modified: 3
  commits: 2
  completed_at: "2026-02-12T16:19:25Z"
---

# Phase 06 Plan 03: Section Editing & District Generation Summary

**One-liner**: Complete playbook editing workflow with inline section editing, section regeneration with polling, and playbook generation from district profiles with product selector modal.

## What Was Built

Implemented the final piece of the playbook feature: inline section editing and regeneration capabilities, plus integration with district profiles for seamless playbook generation. Users can now refine playbooks section-by-section and generate new playbooks directly from district pages with product selection.

### Enhanced PlaybookSection Component

**Edit mode functionality**:
- "Edit" button below section content enters inline edit mode
- Textarea pre-filled with current content, auto-sized based on line count (min 10 rows, max 30)
- "Save" and "Cancel" buttons for edit actions
- Save calls PATCH /api/playbooks/{playbookId}/sections/{sectionId} with updated content
- On successful save: updates local state, exits edit mode, notifies parent via callback
- Loading state during save operation with disabled buttons

**Regeneration functionality**:
- "Regenerate" button shown when section.retryable is true
- Calls POST /api/playbooks/{playbookId}/sections/{sectionId}/regenerate
- Sets local section status to 'generating' immediately
- Polls GET /api/playbooks/{playbookId}/sections/{sectionId} every 2 seconds
- Stops polling when status becomes 'complete' or 'error'
- Updates section content and notifies parent via callback
- Loading spinner during regeneration
- Also available for sections in 'error' state

**Parent callback integration**:
- New prop: onSectionUpdate?: (sectionId: string, updatedSection: PlaybookSection) => void
- Parent page (playbook detail) maintains sections array in state
- When section is edited or regenerated, parent updates its local state
- Ensures UI consistency across all section components

### Playbook Detail Page Updates

**Section state management**:
- Added handleSectionUpdate callback function
- Updates local playbook.sections array when section changes
- Passes callback to all PlaybookSection components
- Maintains section rendering order: key_themes, product_fit, objections, stakeholders, district_data, fit_assessment

### ProductSelector Component (src/components/playbooks/product-selector.tsx)

**Product selection interface**:
- Client component accepting selectedIds and onSelectionChange props
- Fetches products from GET /api/products on mount
- Renders as checklist with checkbox rows
- Each row shows: product name + grade range badge (blue) + subject area badge (purple)
- Clicking checkbox toggles selection (adds/removes from selectedIds array)
- Loading state: "Loading products..."
- Error state: displays error message
- Empty state: "No products available"
- Max height 80 with overflow scroll for long lists

### ExistingPlaybooksPanel Component (src/components/playbooks/existing-playbooks-panel.tsx)

**District playbooks display**:
- Client component accepting districtId prop
- Fetches playbooks from GET /api/districts/{districtId}/playbooks on mount
- Returns null if no playbooks exist (clean UI - no empty state clutter)
- Header: "Existing Playbooks (count)" when playbooks exist
- Each playbook rendered as clickable card with:
  - Product names (comma-separated)
  - Fit category badge (green/yellow/red)
  - Generated date (formatted as "Mon DD, YYYY")
  - Link to /playbooks/{playbookId}
- Hover effect: shadow increase on card
- Silently fails if API returns error (returns null)

### GeneratePlaybookButton Component (src/components/playbooks/generate-playbook-button.tsx)

**Modal-based generation flow**:
- Client component accepting districtId and districtName props
- Primary button: "Generate Playbook"
- Click opens modal overlay:
  - Fixed overlay with black/50 background
  - Centered white card with max-width 2xl
  - Click outside to close (unless generating)
  - Modal header: "Generate Playbook for {districtName}" with X button
- Modal content:
  - ProductSelector component
  - Label: "Select Products (at least 1 required)"
  - Error display area for API errors
- Modal footer:
  - "Cancel" button (outline) - closes modal
  - "Generate" button (primary) - disabled if no products selected
  - Loading state: shows spinner and "Generating..." text
- On Generate click:
  - POST to /api/playbooks with { districtId, productIds }
  - Expects 202 response with { playbookId }
  - Redirects to /playbooks/{playbookId} using router.push()
  - Error handling: displays error message in modal

### District Profile Page Integration

**New Playbooks section**:
- Added below Fit Assessment Panel
- Card container with header and content
- Header: "Playbooks" title + GeneratePlaybookButton
- Body: ExistingPlaybooksPanel component
- Both components are client components embedded in server component page
- Pass districtId and districtName as props from server component

**Component hierarchy**:
```
DistrictProfilePage (server component)
  └─ Playbooks section (div)
      ├─ GeneratePlaybookButton (client component)
      └─ ExistingPlaybooksPanel (client component)
```

This pattern allows client interactivity (fetching, modals, state) within a server-rendered page.

## Deviations from Plan

None - plan executed exactly as written.

## Verification Results

**TypeScript compilation**:
```bash
npx tsc --noEmit
# No errors after both tasks
```

**Task 1 verification**:
- [x] PlaybookSection supports inline editing with textarea and save/cancel
- [x] Section regeneration with polling every 2s until complete/error
- [x] onSectionUpdate callback prop implemented
- [x] Parent page receives section updates and updates local state
- [x] Edit and Regenerate buttons shown below section content
- [x] Loading states for both save and regenerate operations
- [x] Error handling for API failures

**Task 2 verification**:
- [x] ProductSelector fetches and renders tenant products as checkboxes
- [x] Product badges show grade range and subject area
- [x] ExistingPlaybooksPanel shows prior playbooks with links to detail pages
- [x] ExistingPlaybooksPanel returns null when no playbooks exist
- [x] GeneratePlaybookButton opens modal with product selector
- [x] Modal requires at least 1 product selected
- [x] Generate triggers POST /api/playbooks and redirects to detail page
- [x] District profile page has new Playbooks section
- [x] Client components properly embedded in server component

**Overall verification**:
- [x] Inline editing: click Edit, modify in textarea, Save persists via API, Cancel reverts
- [x] Section regeneration: click Regenerate, section shows generating state, polls until complete
- [x] Generate Playbook button on district profile: opens modal, select products, generates, redirects
- [x] Existing playbooks panel shows prior playbooks for the current district
- [x] TypeScript compilation succeeds

## Self-Check: PASSED

**Created files verified**:
```bash
[ -f "src/components/playbooks/product-selector.tsx" ] && echo "FOUND"
[ -f "src/components/playbooks/existing-playbooks-panel.tsx" ] && echo "FOUND"
[ -f "src/components/playbooks/generate-playbook-button.tsx" ] && echo "FOUND"
# All 3 files exist
```

**Modified files verified**:
```bash
[ -f "src/components/playbooks/playbook-section.tsx" ] && echo "FOUND"
[ -f "src/app/(dashboard)/playbooks/[playbookId]/page.tsx" ] && echo "FOUND"
[ -f "src/app/(dashboard)/districts/[districtId]/page.tsx" ] && echo "FOUND"
# All 3 files exist and modified
```

**Commits verified**:
```bash
git log --oneline -2
# 3f5264b feat(06-03): add playbook generation from district profile
# ad930d0 feat(06-03): add inline section editing and regeneration
# Both commits FOUND
```

## Technical Decisions

**Inline editing with textarea auto-sizing**:
Chose textarea with dynamic rows calculation (based on content line count) instead of content-editable divs. This provides better UX for editing multi-line content while maintaining the look of the original section. Min 10 rows ensures editing area is visible, max 30 rows prevents overly tall textareas that require scrolling.

**Polling pattern for regeneration**:
Used simple setInterval polling every 2 seconds instead of WebSocket or SSE. This matches the existing pattern from GenerationStatus component (Plan 02) and is simpler to implement. 5-minute timeout prevents infinite polling. The polling stops when status becomes 'complete' or 'error', updating the section content immediately.

**Parent callback pattern for state synchronization**:
Instead of having each PlaybookSection component independently manage its state, the parent page maintains the authoritative sections array. When a section is edited or regenerated, it notifies the parent via onSectionUpdate callback. This ensures all section components see consistent data and prevents stale state issues.

**ExistingPlaybooksPanel returns null when empty**:
Chose to return null instead of showing "No playbooks yet" message. This keeps the district profile page clean - the panel only appears when there's something to show. The Generate Playbook button is always visible, so users know how to create playbooks.

**Modal pattern for generation flow**:
Used fixed overlay with centered card pattern (matching ExcludeModal from Phase 4). Click-outside-to-close provides good UX. Modal prevents interaction with underlying page during generation setup. Disabled close actions during API call prevents race conditions.

**Product selector as reusable component**:
Separated product selection into its own component (ProductSelector) instead of embedding it directly in the modal. This makes the component reusable for other generation flows (e.g., bulk generation, scheduled generation in future phases). The controlled component pattern (selectedIds prop + onSelectionChange callback) gives parent full control.

**Immediate redirect after generation**:
After POST /api/playbooks returns 202 with playbookId, immediately redirect to the playbook detail page. This provides instant feedback and lets users see the generation progress. The detail page's GenerationStatus component handles polling, so the modal doesn't need to manage that flow.

## What's Next

This completes Phase 6 (Playbooks). The playbook feature is now fully functional:
- Backend: Service layer with mock AI generation (Plan 01)
- UI: List/detail pages with filtering and status tracking (Plan 02)
- Editing: Inline section editing and regeneration (Plan 03)
- Integration: Generation from district profiles (Plan 03)

Next phase (Phase 7) will likely focus on:
- Admin features (user management, tenant settings)
- Real AI integration (replacing mock generator)
- Analytics and reporting
- Production readiness (logging, monitoring, error tracking)

The playbook workflow is complete: Users can discover districts → assess fit → generate playbooks → refine sections → share with team. All core user stories (PLAY-01 through PLAY-07) are implemented.


## Self-Check Results

All claims verified:
- Created files: 3/3 FOUND
- Modified files: 3/3 FOUND  
- Commits: 2/2 FOUND (ad930d0, 3f5264b)

**Self-Check: PASSED**
