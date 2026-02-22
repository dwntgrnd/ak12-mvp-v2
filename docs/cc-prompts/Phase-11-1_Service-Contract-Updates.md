# CC Prompt: Phase 11-1 — Service Contract Updates (Types + DistrictSnapshot)

**Purpose:** Add new types and modify existing types per Spec 15 §10.  
**Prerequisite:** Phase 11-0 code audit must be complete. Reference audit findings at `/docs/audits/phase-11-code-audit.md` before starting.  
**Spec reference:** `/docs/specs/15_District-List-Experience-Specification.md` §3, §8, §9, §10

---

## Context

Spec 15 defines three new types and modifies several existing ones to support the district list as a platform primitive. This prompt handles ONLY the type definitions and service contract changes — no component changes, no fixture changes.

## Tasks

### 1. Add DistrictSnapshot Type

Add to `/src/services/types/district.ts`:

```typescript
/**
 * Lightweight district shape for list contexts.
 * Guaranteed baseline data for district cards — AI-generated content layers on top.
 * See Spec 15 §3 for design rationale.
 */
export interface DistrictSnapshot {
  districtId: string;
  name: string;
  city: string;
  county: string;
  state: string;
  docType: string;         // "Unified", "Elementary", "High School"
  lowGrade: string;        // e.g., "K", "7", "9"
  highGrade: string;       // e.g., "6", "8", "12"
  totalEnrollment: number;
  frpmPercent: number;     // 0–100
  ellPercent: number;      // 0–100
  elaProficiency: number;  // 0–100
  mathProficiency: number; // 0–100
}
```

### 2. Add ProductAlignment Type

Add to `/src/services/types/discovery.ts` (replacing `ProductRelevance`):

```typescript
/**
 * Qualitative product-district alignment. NOT a numeric score.
 * Expressed as level + evidence signals.
 * See Spec 15 §8 — Guiding Principle alignment.
 */
export interface ProductAlignment {
  level: 'strong' | 'moderate' | 'limited';
  signals: string[];
  primaryConnection: string;
}
```

### 3. Add ProductLensSummary Type

Add to `/src/services/types/product.ts`:

```typescript
/**
 * Minimal product shape for lens selector UI.
 * Lighter than ProductSummary — no description, asset count, etc.
 */
export interface ProductLensSummary {
  productId: string;
  name: string;
  category: string;         // "Math Intervention", "ELL Platform", etc.
  targetGradeBands: string[];
}
```

### 4. Add LibraryReadinessResponse Type

Add to `/src/services/types/product.ts`:

```typescript
/**
 * Lightweight check: does the user's org have products?
 * Used for progressive disclosure (Spec 15 §9), not full library fetch.
 */
export interface LibraryReadinessResponse {
  hasProducts: boolean;
  productCount: number;
  products: ProductLensSummary[];
}
```

### 5. Modify RankedListEntry

In `/src/services/types/discovery.ts`, add `snapshot` to `RankedListEntry`:

```typescript
export interface RankedListEntry {
  rank: number;
  districtId: string;
  name: string;
  snapshot: DistrictSnapshot;       // NEW — import from district.ts
  primaryMetric: { label: string; value: string };
  secondaryMetrics?: { label: string; value: string }[];
  confidence: ConfidenceLevel;
  confidenceNote?: string;
}
```

### 6. Modify CardSetEntry

In `/src/services/types/discovery.ts`, add `snapshot` to `CardSetEntry`:

```typescript
export interface CardSetEntry {
  districtId: string;
  name: string;
  snapshot: DistrictSnapshot;       // NEW
  location: string;                 // kept for backward compat
  enrollment?: number;              // kept for backward compat
  keyMetric?: { label: string; value: string };
  confidence: ConfidenceLevel;
}
```

### 7. Modify SavedDistrict

In `/src/services/types/district.ts`, replace individual fields with snapshot:

```typescript
export interface SavedDistrict {
  districtId: string;
  snapshot: DistrictSnapshot;
  savedAt: string;           // ISO 8601
}
```

Remove the now-redundant `name`, `state`, `location`, `enrollment` fields. Fix any compilation errors this creates.

### 8. Handle ProductRelevance → ProductAlignment Migration

Based on the code audit findings:
1. Replace the `ProductRelevance` interface with `ProductAlignment` in `discovery.ts`
2. Update `productRelevanceMap` in `DiscoveryQueryResponse` to use `Record<string, ProductAlignment>`
3. Update all imports across the codebase that reference `ProductRelevance` to use `ProductAlignment`
4. The key field rename is `alignmentLevel` → `level` and removal of `productName`
5. Addition of `primaryConnection` field

### 9. Export All New Types

Ensure all new types are exported from their respective files and from the barrel export if one exists.

## Verification

After all changes:
1. Run `npx tsc --noEmit` — expect compilation errors in components and mock providers (these are expected; they'll be fixed in subsequent prompts)
2. List all files with compilation errors — this becomes the work list for Phase 11-2 and 11-3
3. Do NOT fix component or fixture compilation errors in this prompt — only fix type files

## What NOT to Do

- Do not modify any component files
- Do not modify any mock provider or fixture files
- Do not add any new files beyond the type changes
- Do not remove `FitAssessment` yet — audit findings determine whether it's still needed
