# CC Prompt: Phase 11-0 — Code Audit (District List Experience Prerequisite)

**Purpose:** Audit the discovery workflow codebase for dead code, redundant types, unused imports, and fixture data gaps before implementing Spec 15 (District List Experience). This audit prevents building on cruft.

**Spec reference:** `docs/specs/15_District-List-Experience-Specification.md` §11 (Implementation Notes)

---

## Context

We're about to implement a significant refactor of how district lists render across the platform. Before building, we need a clean foundation. This audit identifies what to remove, what to rename, and what fixture gaps exist.

## Audit Tasks

### 1. Type Redundancy Audit

**Files to examine:**
- `/src/services/types/discovery.ts`
- `/src/services/types/district.ts`
- `/src/services/types/common.ts`

**Check for:**
- `ProductRelevance` type in `discovery.ts` — will be replaced by `ProductAlignment`. Document all files that import or reference `ProductRelevance`. List them.
- `FitAssessment` type in `common.ts` — is it still used by any component or service? If only used by `district-list-card.tsx`, document for potential removal.
- `fitCategoryColors` and `getFitCategory` in `district-list-card.tsx` — are these used anywhere else, or only internally? If only internal to the card, they'll be refactored.
- `DistrictSummary` in `district.ts` — is it used? It overlaps conceptually with the incoming `DistrictSnapshot`.

**Output:** A list of types with their import locations and a recommendation (keep, deprecate, remove, replace).

### 2. Component Usage Audit

**Files to examine:**
- `/src/components/shared/district-list-card.tsx`
- `/src/components/shared/listings-toolbar.tsx`
- `/src/components/shared/district-listings-container.tsx`
- `/src/components/discovery/product-lens-selector.tsx`
- `/src/components/discovery/product-relevance-badge.tsx`
- All files in `/src/components/discovery/renderers/`

**Check for:**
- Which components import `DistrictListCard`? List all consumers.
- Which components import `ListingsToolbar`? List all consumers.
- Which components import `DistrictListingsContainer`? List all consumers.
- Is `product-relevance-badge.tsx` used by any component? If not, flag for removal.
- In `ranked-list-renderer.tsx` and `card-set-renderer.tsx`: do they each implement their own sort/filter/count strip, or do they use the shared container? (Current code review suggests they have inline implementations that duplicate `DistrictListingsContainer` patterns.)
- Are there any discovery renderer components that are unused (not routed to by `discovery-format-router.tsx`)?

**Output:** Component dependency graph (text format) and list of candidates for removal or consolidation.

### 3. Props Interface Audit

**File:** `/src/components/shared/district-list-card.tsx`

The card currently accepts ~15 individual props (districtId, name, location, enrollment, gradesServed, variant, rank, fitAssessment, fitLoading, productRelevance, metrics, activeSortMetric, isSaved, onSave, onRemoveSaved, onGeneratePlaybook, children).

**Check:**
- Which of these props are actually passed by each consumer? Create a matrix: consumer × prop showing which props each consumer actually passes.
- Are any props never passed by any consumer? Flag for removal.
- Which props will be replaced by `DistrictSnapshot` (name, location, enrollment, gradesServed → all derivable from snapshot)?

**Output:** Props usage matrix and snapshot migration plan.

### 4. Fixture Data Gap Check

**File:** `/src/services/providers/mock/fixtures/districts.ts`

**Check:**
- Do all 50 district fixtures have these fields populated: `frpmCount`, `frpmEnrollment` (needed to calculate FRPM %), `totalEll` (or `ellPercentage`), `elaProficiency`, `mathProficiency`?
- If any districts are missing these fields, list which districts and which fields are null/undefined.
- Can `frpmPercent` be reliably calculated from `frpmCount / frpmEnrollment * 100` for all districts?

**Output:** Table of fixture data completeness for DistrictSnapshot-required fields.

### 5. Discovery Fixture Audit

**File:** `/src/services/providers/mock/fixtures/discovery.ts`

**Check:**
- Do `RankedListEntry` objects in the mock discovery fixtures already carry enough data to construct a `DistrictSnapshot`?
- Do `CardSetEntry` objects carry enough data?
- How does the mock discovery service (`mock-discovery-service.ts`) build response entries? Does it reference the district fixtures, or does it use hardcoded data?

**Output:** Assessment of how much fixture restructuring is needed for snapshot integration.

### 6. Import Cleanup Candidates

Run a grep/search across the entire `/src/` directory for:
- Imports of `ProductRelevance` (to be replaced)
- Imports of `FitAssessment` (to be evaluated)
- Imports of `DistrictSummary` (to be evaluated)
- Imports of `fitCategoryColors` from `design-tokens.ts` (to be evaluated)
- Any unused imports flagged by TypeScript/ESLint

**Output:** File-by-file list of imports that will change during the refactor.

## Deliverable Format

Create a single markdown file at `/docs/audits/phase-11-code-audit.md` with:
1. Summary of findings
2. Detailed results for each audit task (1–6 above)
3. Recommended action items (remove, replace, refactor) with file paths
4. Any blockers or surprises that affect implementation sequencing

Do NOT make any code changes. This is a read-only audit. Changes come in subsequent CC prompts.
