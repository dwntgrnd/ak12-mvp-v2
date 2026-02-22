# CC Prompt: Phase 11-2 — Mock Provider Updates (Snapshot Integration)

**Purpose:** Update mock providers and fixtures to construct DistrictSnapshot and ProductAlignment data per Spec 15 §10–§11.  
**Prerequisite:** Phase 11-1 (type changes) must be complete.  
**Spec reference:** `/docs/specs/15_District-List-Experience-Specification.md` §3, §8, §10, §11

---

## Context

Phase 11-1 added `DistrictSnapshot` to `RankedListEntry`, `CardSetEntry`, and `SavedDistrict`. Phase 11-1 also replaced `ProductRelevance` with `ProductAlignment`. The mock providers and fixtures now have compilation errors because they don't construct these new fields. This prompt fixes them.

## Tasks

### 1. Create DistrictSnapshot Builder Utility

Create a utility function in `/src/services/providers/mock/` (e.g., `snapshot-builder.ts`) that constructs a `DistrictSnapshot` from the existing district fixture data:

```typescript
import type { DistrictSnapshot } from '@/services/types/district';

/**
 * Build a DistrictSnapshot from district fixture data.
 * Calculates derived fields (frpmPercent, ellPercent) from raw counts.
 */
export function buildSnapshot(district: /* fixture type */): DistrictSnapshot {
  return {
    districtId: district.districtId,
    name: district.name,
    city: district.city ?? '',
    county: district.county,
    state: district.state,
    docType: district.docType ?? 'Unified',
    lowGrade: district.lowGrade ?? 'K',
    highGrade: district.highGrade ?? '12',
    totalEnrollment: district.totalEnrollment,
    frpmPercent: calculateFrpmPercent(district),
    ellPercent: district.ellPercentage ?? 0,
    elaProficiency: district.elaProficiency ?? 0,
    mathProficiency: district.mathProficiency ?? 0,
  };
}

function calculateFrpmPercent(district: /* fixture type */): number {
  if (district.frpmCount != null && district.frpmEnrollment != null && district.frpmEnrollment > 0) {
    return Math.round((district.frpmCount / district.frpmEnrollment) * 100);
  }
  return 0;
}
```

Adapt the fixture type signature to match the actual data shape in `/src/services/providers/mock/fixtures/districts.ts`. Reference the code audit findings for any data gaps.

### 2. Update Mock Discovery Service

In `/src/services/providers/mock/mock-discovery-service.ts`:

- When building `RankedListEntry` objects: look up the district from fixtures by `districtId` and construct a `snapshot` using the builder utility
- When building `CardSetEntry` objects: same approach
- When building `productRelevanceMap`: construct `ProductAlignment` objects instead of `ProductRelevance` objects
  - Map `alignmentLevel` → `level` (drop 'unknown' — use undefined/omit instead)
  - Add `primaryConnection` field with a brief one-line summary
  - Remove `productName` from each entry

### 3. Update Discovery Fixtures

In `/src/services/providers/mock/fixtures/discovery.ts`:

- If fixtures contain hardcoded `ProductRelevance` data, update to `ProductAlignment` shape
- If fixtures contain hardcoded `RankedListEntry` or `CardSetEntry` objects, add `snapshot` placeholder (the mock service should ideally construct snapshots dynamically from district fixtures, not hardcode them)

### 4. Update Mock District Service

In `/src/services/providers/mock/mock-district-service.ts`:

- If `SavedDistrict` objects are constructed, update to use `snapshot: DistrictSnapshot` instead of individual fields
- Use the snapshot builder utility for consistency

### 5. Add Library Readiness Endpoint

In `/src/services/providers/mock/mock-product-service.ts`:

Add a method that returns `LibraryReadinessResponse`:

```typescript
async getLibraryReadiness(): Promise<LibraryReadinessResponse> {
  const products = /* existing product fixture data */;
  return {
    hasProducts: products.length > 0,
    productCount: products.length,
    products: products.map(p => ({
      productId: p.productId,
      name: p.name,
      category: p.subjectArea,  // or derive a display category
      targetGradeBands: [/* derive from gradeRange */],
    })),
  };
}
```

Add the corresponding method to the `ProductService` interface if it doesn't exist.

### 6. Handle Missing Fixture Data

Based on the code audit (Phase 11-0), some districts may be missing FRPM, ELL, or proficiency data. For any district missing data:
- Use `0` as the fallback for percentage fields
- Log a comment in the fixture noting the gap for future data enrichment
- Do NOT skip the snapshot — every district gets a snapshot, even with zeros

## Verification

After all changes:
1. Run `npx tsc --noEmit` — expect remaining errors only in component files (Phase 11-3)
2. If any mock service tests exist, run them
3. List remaining compilation errors — they should all be in `/src/components/` files

## What NOT to Do

- Do not modify any component files
- Do not modify type definition files (those were done in Phase 11-1)
- Do not change the discovery response format routing — only the data shapes within responses
