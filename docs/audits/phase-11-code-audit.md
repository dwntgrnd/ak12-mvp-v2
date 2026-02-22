# Phase 11-0: Code Audit — District List Experience Prerequisite

**Date:** 2026-02-22
**Purpose:** Audit the discovery workflow codebase for dead code, redundant types, unused imports, and fixture data gaps before implementing Spec 15 (District List Experience).

---

## Summary of Findings

| Area | Key Finding | Risk |
|------|------------|------|
| Types | `ProductRelevance` imported in 8 files; replacement to `ProductAlignment` has wide blast radius | HIGH |
| Types | `FitAssessment` used in 6 files across services + components; NOT card-only | MEDIUM |
| Types | `DistrictSummary` used only in mock fixtures (1 file) | LOW |
| Components | `DistrictListingsContainer` used only in 1 demo page; renderers implement inline toolbars instead | MEDIUM |
| Components | `ProductRelevanceBadge` is active (2 consumers); do NOT remove | LOW |
| Code duplication | `getFitCategory()` defined identically in 3 separate files | HIGH |
| Props | `fitAssessment` and `fitLoading` props on DistrictListCard are never passed by any consumer | MEDIUM |
| Props | RankedListRenderer never passes `location`/`enrollment`/`gradesServed` | MEDIUM |
| Fixtures | `ellPercentage` null in ~50% of district year records | MEDIUM |
| Fixtures | `frpmEnrollment` has anomalous placeholder values (1-5) in early years | LOW |
| Discovery | RankedListEntry lacks `location` field entirely; cannot construct DistrictSnapshot without lookup | HIGH |
| Discovery | Discovery responses are static fixtures, NOT built from MOCK_DISTRICTS data | HIGH |

---

## 1. Type Redundancy Audit

### ProductRelevance (`src/services/types/discovery.ts`)

```typescript
export interface ProductRelevance {
  alignmentLevel: 'strong' | 'moderate' | 'limited' | 'unknown';
  signals: string[];
  productName: string;
}
```

**Imported by 8 files:**

| File | Usage |
|------|-------|
| `src/components/shared/district-list-card.tsx` | Optional prop in card interface |
| `src/components/discovery/product-relevance-badge.tsx` | Core component type |
| `src/components/discovery/discovery-format-router.tsx` | Record index type for productRelevanceMap |
| `src/components/discovery/renderers/brief-renderer.tsx` | Record index type for productRelevanceMap prop |
| `src/components/discovery/renderers/comparison-table-renderer.tsx` | Record index type, renders via ProductRelevanceBadge |
| `src/components/discovery/renderers/direct-answer-card.tsx` | Record index type for productRelevanceMap prop |
| `src/components/discovery/renderers/card-set-renderer.tsx` | Record index type for productRelevanceMap prop |
| `src/components/discovery/renderers/ranked-list-renderer.tsx` | Record index type for productRelevanceMap prop |

**Recommendation:** REPLACE with `ProductAlignment`. All 8 files must be updated. Wide blast radius — do in dedicated phase.

---

### FitAssessment (`src/services/types/common.ts`)

```typescript
export interface FitAssessment {
  fitScore: number;       // 0-10
  fitRationale: string;
}
```

**Imported by 6 files:**

| File | Usage |
|------|-------|
| `src/components/shared/district-list-card.tsx` | Optional prop |
| `src/app/(dashboard)/districts/[districtId]/page.tsx` | State type, displayed with badges |
| `src/services/types/playbook.ts` | PlaybookSummary + Playbook properties |
| `src/services/types/district.ts` | DistrictProfile.fitAssessment property |
| `src/services/interfaces/district-service.ts` | Return type for `getDistrictFitAssessment()` |
| `src/services/providers/mock/mock-district-service.ts` | Mock implementation return type |

**Recommendation:** KEEP. FitAssessment is NOT card-only — it's a core service type used in interfaces, playbook types, district profile, and district page. Cannot remove without service contract changes.

---

### DistrictSummary (`src/services/types/district.ts`)

```typescript
export interface DistrictSummary {
  districtId: string;
  name: string;
  state: string;
  location: string;
  enrollment: number;
}
```

**Imported by 1 file:**
- `src/services/providers/mock/fixtures/districts.ts` — used in `getMockDistrictSummaries()` helper

**Recommendation:** EVALUATE for replacement by `DistrictSnapshot`. Low blast radius (1 file). Can be deprecated once DistrictSnapshot is available.

---

### fitCategoryColors (`src/lib/design-tokens.ts`)

Imported by 3 files:
1. `src/components/shared/district-list-card.tsx`
2. `src/app/(dashboard)/districts/[districtId]/page.tsx`
3. `src/components/playbook/playbook-card.tsx`

**Recommendation:** KEEP in design-tokens.ts. This is the canonical location per project standards.

---

### getFitCategory — DUPLICATED 3x (Critical)

Identical function defined in 3 separate files:

```typescript
function getFitCategory(score: number): FitCategoryKey {
  if (score >= 7) return 'strong';
  if (score >= 4) return 'moderate';
  return 'low';
}
```

| File | Lines |
|------|-------|
| `src/components/shared/district-list-card.tsx` | 40-44 |
| `src/app/(dashboard)/districts/[districtId]/page.tsx` | 22-26 |
| `src/components/playbook/playbook-card.tsx` | 19-23 |

**Recommendation:** EXTRACT to `src/lib/design-tokens.ts` alongside `fitCategoryColors` (or `src/lib/utils/fit.ts`). Update all 3 consumers.

---

### ProductRelevanceBadge Styling Conflict

`district-list-card.tsx` defines inline `alignmentBadgeClass` (lines 33-38) that DUPLICATES the styling logic already in `product-relevance-badge.tsx` (`ALIGNMENT_STYLES`). These use different color tokens.

**Recommendation:** Reconcile during card refactor. Use a single canonical source.

---

## 2. Component Usage Audit

### Component Dependency Graph

```
DiscoveryFormatRouter
├── BriefRenderer ──────── → DistrictListCard, ProductRelevanceBadge (indirect)
├── DirectAnswerCard ───── → ProductRelevanceBadge
├── ComparisonTableRenderer → ProductRelevanceBadge
├── RankedListRenderer ──── → DistrictListCard, ListingsToolbar, ProductLensSelector
├── CardSetRenderer ──────── → DistrictListCard, ListingsToolbar, ProductLensSelector
└── RecoveryRenderer

DistrictListingsContainer ── → ListingsToolbar
                              (used only by demo/listings/container/page.tsx)
```

### Consumer Counts

| Component | Consumers | Files |
|-----------|-----------|-------|
| **DistrictListCard** | 4 | ranked-list-renderer, card-set-renderer, brief-renderer, demo page |
| **ListingsToolbar** | 4 | ranked-list-renderer, card-set-renderer, district-listings-container, demo page |
| **DistrictListingsContainer** | 1 | demo/listings/container/page.tsx only |
| **ProductRelevanceBadge** | 2 | comparison-table-renderer, direct-answer-card |
| **ProductLensSelector** | 2 | ranked-list-renderer, card-set-renderer |
| **TransparencyNote** | 4 | brief-renderer, card-set-renderer, ranked-list-renderer, comparison-table-renderer |

### Candidates for Consolidation

1. **DistrictListingsContainer** — Low usage (demo only). Renderers implement inline sort/filter/count strips using ListingsToolbar directly. Decision: either migrate renderers to use the container, or accept it as a demo/reference component.

2. **Inline sort/filter in renderers** — Both `ranked-list-renderer.tsx` and `card-set-renderer.tsx` implement their own `sortEntries()` functions, search state, and count strip inline. This duplicates logic that `DistrictListingsContainer` encapsulates.

### Unused Components

None found. All renderers in `/src/components/discovery/renderers/` are actively referenced by `discovery-format-router.tsx`:

| Format | Renderer |
|--------|----------|
| `narrative_brief` | BriefRenderer |
| `intelligence_brief` | BriefRenderer |
| `direct_answer_card` | DirectAnswerCard |
| `recovery` | RecoveryRenderer |
| `comparison_table` | ComparisonTableRenderer |
| `ranked_list` | RankedListRenderer |
| `card_set` | CardSetRenderer |

Utility component `transparency-note.tsx` is used by 4 renderers.

---

## 3. Props Interface Audit

### DistrictListCard Interface (17 props)

```typescript
interface DistrictListCardProps {
  districtId: string;                               // REQUIRED
  name: string;                                     // REQUIRED
  location?: string;                                // OPTIONAL
  enrollment?: number;                              // OPTIONAL
  gradesServed?: string;                            // OPTIONAL
  variant?: 'surface' | 'inset';                    // OPTIONAL
  rank?: number;                                    // OPTIONAL
  fitAssessment?: FitAssessment;                    // OPTIONAL
  fitLoading?: boolean;                             // OPTIONAL
  productRelevance?: ProductRelevance;              // OPTIONAL
  metrics?: Array<{ label: string; value: string }>;// OPTIONAL
  activeSortMetric?: string;                        // OPTIONAL
  isSaved?: boolean;                                // OPTIONAL
  onSave?: (districtId: string) => void;            // OPTIONAL
  onRemoveSaved?: (districtId: string) => void;     // OPTIONAL
  onGeneratePlaybook?: (districtId: string) => void;// OPTIONAL
  children?: React.ReactNode;                       // OPTIONAL
}
```

### Consumer × Prop Matrix

| Prop | RankedList | CardSet | Brief | Demo |
|------|:----------:|:-------:|:-----:|:----:|
| `districtId` | Y | Y | Y | Y |
| `name` | Y | Y | Y | Y |
| `location` | - | Y | Y | Y |
| `enrollment` | - | Y | Y | Y |
| `gradesServed` | - | - | - | Y |
| `variant` | Y | Y | Y | Y |
| `rank` | conditional | - | - | - |
| `fitAssessment` | **-** | **-** | **-** | **-** |
| `fitLoading` | **-** | **-** | **-** | **-** |
| `productRelevance` | Y | Y | Y | - |
| `metrics` | Y | Y | Y | Y |
| `activeSortMetric` | Y | Y | Y | Y |
| `isSaved` | Y | Y | Y | Y |
| `onSave` | Y | Y | Y | Y |
| `onRemoveSaved` | Y | Y | Y | Y |
| `onGeneratePlaybook` | Y | Y | Y | - |
| `children` | Y | Y | - | - |

### Props Never Passed

| Prop | Status | Recommendation |
|------|--------|----------------|
| `fitAssessment` | Never passed by any consumer | REMOVE or defer to DistrictSnapshot integration |
| `fitLoading` | Never passed by any consumer | REMOVE or defer to DistrictSnapshot integration |
| `gradesServed` | Only demo page | KEEP — will be populated from DistrictSnapshot |

### Snapshot Migration Plan

These props will be derivable from a `DistrictSnapshot` object:
- `name` → `snapshot.name`
- `location` → `snapshot.location`
- `enrollment` → `snapshot.enrollment`
- `gradesServed` → `snapshot.gradesServed`

The card interface can be simplified: replace individual props with `snapshot: DistrictSnapshot` plus card-specific props (`variant`, `rank`, `metrics`, `activeSortMetric`, action callbacks).

---

## 4. Fixture Data Gap Check

### District Fixtures (`src/services/providers/mock/fixtures/districts.ts`)

50 California districts, each with multi-year data (2021-2024). Data sourced from CDE.

### Field Completeness (DistrictSnapshot-Required Fields)

| Field | Populated | Gaps | Notes |
|-------|:---------:|------|-------|
| `frpmCount` | 100% | None | All records populated |
| `frpmEnrollment` | ~90% | Early years (2021-22) have placeholder values (1-5) | Use 2023-24+ data for calculation |
| `totalEll` | 100% | None | All records populated |
| `ellPercentage` | ~50% | Null in ~100 of ~200 year-records | Calculate from `totalEll / totalEnrollment * 100` |
| `elaProficiency` | 100% | None | All records populated |
| `mathProficiency` | 100% | None | All records populated |

### FRPM% Calculation Feasibility

- **Latest year (2024-25):** Reliable. All districts have reasonable `frpmEnrollment` values.
- **Early years (2021-22):** Unreliable. Some districts have `frpmEnrollment: 1` (placeholder).
- **Recommendation:** Use latest year data for DistrictSnapshot FRPM%. Guard against division by `frpmEnrollment < 100`.

### ELL% Calculation

- `ellPercentage` is frequently null. Calculate as `totalEll / totalEnrollment * 100` instead.
- `totalEll` and `totalEnrollment` are 100% populated — reliable calculation.

---

## 5. Discovery Fixture Audit

### Data Sufficiency for DistrictSnapshot

| Field | RankedListEntry | CardSetEntry |
|-------|:--------------:|:------------:|
| `name` | Y | Y |
| `districtId` | Y | Y |
| `location` | **NO** | Y |
| `enrollment` | In metrics (string) | Y (numeric) |
| `gradesServed` | **NO** | **NO** |
| `FRPM%` | **NO** | **NO** |
| `ELL%` | **NO** | In keyMetric (context-dependent) |
| `proficiency` | In metrics (context-dependent) | **NO** |

### Mock Discovery Service Data Flow

**Key finding:** Discovery responses are **static pre-staged fixtures**, NOT dynamically built from MOCK_DISTRICTS.

```
DISCOVERY_SCENARIOS[n].response → returned directly by mockDiscoveryService.query()
```

- District entries (RankedListEntry, CardSetEntry) have **hardcoded** names, metrics, enrollment values
- NO runtime lookup to MOCK_DISTRICTS for enrichment
- Only `DISCOVERY_DIRECTORY` is built from MOCK_DISTRICTS (for autocomplete)
- Data consistency risk: district data in scenarios can drift from MOCK_DISTRICTS

### Restructuring Assessment

**To support DistrictSnapshot in discovery results, two approaches:**

1. **Enrich at service layer:** Mock discovery service looks up MOCK_DISTRICTS by `districtId` to populate snapshot fields. Minimal fixture changes but requires service logic update.

2. **Enrich at fixture layer:** Add location/enrollment/grades to RankedListEntry type definition and update all scenario fixtures. More fixture work but simpler runtime.

**Recommendation:** Approach 1 (service-layer enrichment) is cleaner — keeps fixtures focused on narrative content while deriving structural data from the canonical district source.

---

## 6. Import Cleanup Candidates

### Files That Will Change During Refactor

| Import | Files Affected | Action |
|--------|---------------|--------|
| `ProductRelevance` | 8 files | Replace with `ProductAlignment` |
| `FitAssessment` | 6 files | Keep (service contract type) |
| `DistrictSummary` | 1 file | Replace with `DistrictSnapshot` |
| `fitCategoryColors` | 3 files | Keep (canonical design token) |
| `getFitCategory` (local fn) | 3 files | Extract to shared utility |
| `alignmentBadgeClass` (local) | 1 file | Reconcile with ProductRelevanceBadge |

### Detailed Import Change List

**ProductRelevance → ProductAlignment (8 files):**
- `src/components/shared/district-list-card.tsx` — line 11
- `src/components/discovery/product-relevance-badge.tsx` — line 2
- `src/components/discovery/discovery-format-router.tsx` — line 1
- `src/components/discovery/renderers/brief-renderer.tsx` — line 6
- `src/components/discovery/renderers/comparison-table-renderer.tsx` — line 8
- `src/components/discovery/renderers/direct-answer-card.tsx` — line 4
- `src/components/discovery/renderers/card-set-renderer.tsx` — line 8
- `src/components/discovery/renderers/ranked-list-renderer.tsx` — line 8

**getFitCategory → shared utility (3 files):**
- `src/components/shared/district-list-card.tsx` — lines 40-44
- `src/app/(dashboard)/districts/[districtId]/page.tsx` — lines 22-26
- `src/components/playbook/playbook-card.tsx` — lines 19-23

---

## Recommended Action Items

### Priority 1 — Before any Spec 15 work

1. **Extract `getFitCategory` to shared utility** — 3 files have identical copies. Move to `src/lib/design-tokens.ts` or `src/lib/utils/fit.ts`.

2. **Remove unused props** from DistrictListCard: `fitAssessment`, `fitLoading` — never passed by any consumer.

### Priority 2 — During service contract updates

3. **Define `DistrictSnapshot` type** in `src/services/types/district.ts`.

4. **Deprecate `DistrictSummary`** — replace with `DistrictSnapshot` (1 file impact).

5. **Define `ProductAlignment`** to replace `ProductRelevance` (8 files impact).

### Priority 3 — During card refactor

6. **Simplify DistrictListCard props** — replace individual district fields with `snapshot: DistrictSnapshot`.

7. **Reconcile alignment styling** — remove `alignmentBadgeClass` from district-list-card.tsx, use ProductRelevanceBadge pattern.

8. **Decide DistrictListingsContainer fate** — either migrate renderers to use it or accept it as demo-only.

### Priority 4 — During fixture updates

9. **Enrich mock discovery service** — add MOCK_DISTRICTS lookup for snapshot fields instead of adding data to static fixtures.

10. **Fix `ellPercentage` gaps** — compute from `totalEll / totalEnrollment * 100` rather than relying on null field.

11. **Guard `frpmEnrollment` calculation** — skip or clamp when `frpmEnrollment < 100`.

---

## Blockers and Surprises

1. **`FitAssessment` is NOT card-only.** It's embedded in service interfaces (`IDistrictService`), playbook types, and the district profile page. Cannot remove without service contract changes. This may affect sequencing if Spec 15 assumed it was localized.

2. **Discovery responses are fully static.** Mock discovery service returns pre-staged fixtures without consulting MOCK_DISTRICTS. Any DistrictSnapshot enrichment requires either fixture restructuring or service-layer lookup logic.

3. **RankedListEntry has no `location` field** at the type level. Adding it requires a type change in `src/services/types/discovery.ts`, which is a service interface adjacency.

4. **`ellPercentage` null in ~50% of records** is not a bug — it reflects CDE data gaps. Design must handle missing ELL data gracefully.
