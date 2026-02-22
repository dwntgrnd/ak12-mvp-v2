# CC Prompt: Data Quality Validation Pass

**Session:** SS-41  
**Prompt:** 1 of 2  
**Priority:** Execute before SS41-02 (the district additions depend on clean validation logic)

---

## Objective

Fix data quality bugs in the snapshot builder and district fixtures that cause nonsensical percentage values on discovery cards and incorrect badge rendering on district profiles.

## Problem Summary

1. **`ellPercentage` stores raw counts, not percentages.** In the CDE source data, the 2023-24 year rows populated `ellPercentage` with the same value as `totalEll` (raw student counts). Earlier years have `ellPercentage: null`. This means Elk Grove shows "10539%" for ELL instead of ~16.6%.

2. **`frpmEnrollment` contains implausible values.** The FRPM percentage should be `frpmCount / totalEnrollment * 100`, but `frpmEnrollment` contains small numbers (often 1, 2, 18, etc.) that appear to be a different CDE field (possibly FRPM reporting enrollment counts or a data extraction artifact). Dividing `frpmCount` by these tiny denominators produces values like "182589%".

3. **`docType` string comparison bug.** The `DistrictSnapshot.docType` field is used for badge rendering. The fixture data stores `"Unified School District"`, `"Elementary School District"`, `"High School District"`, but comparison code expects short forms like `"Unified"`. This causes incorrect badge display.

## Changes Required

### 1. Fix `snapshot-builder.ts` — `buildSnapshot()`

**`ellPercent` calculation:**
Replace the current pass-through:
```ts
ellPercent: district.ellPercentage ?? 0,
```
With a validated calculation:
```ts
ellPercent: calculateEllPercent(district),
```

Add helper function:
```ts
function calculateEllPercent(district: DistrictProfile): number {
  // If ellPercentage looks like a real percentage (0-100), use it
  if (district.ellPercentage != null && district.ellPercentage > 0 && district.ellPercentage <= 100) {
    return Math.round(district.ellPercentage * 10) / 10;
  }
  // Otherwise derive from totalEll / totalEnrollment
  if (district.totalEll != null && district.totalEnrollment > 0) {
    return Math.round((district.totalEll / district.totalEnrollment) * 1000) / 10;
  }
  return 0;
}
```

**`frpmPercent` calculation:**
Replace the current `calculateFrpmPercent` function entirely:
```ts
function calculateFrpmPercent(district: DistrictProfile): number {
  // Derive from frpmCount / totalEnrollment (the reliable denominator)
  if (district.frpmCount != null && district.totalEnrollment > 0) {
    const pct = (district.frpmCount / district.totalEnrollment) * 100;
    // Clamp to 0-100 as safety
    return Math.round(Math.min(100, Math.max(0, pct)) * 10) / 10;
  }
  return 0;
}
```
**Rationale:** `frpmEnrollment` is unreliable across all 50 districts. `totalEnrollment` is the correct denominator — FRPM count / total enrollment gives the poverty rate percentage.

**`docType` normalization:**
Add normalization in `buildSnapshot()`:
```ts
docType: normalizeDocType(district.docType),
```

Add helper:
```ts
function normalizeDocType(raw?: string): string {
  if (!raw) return 'Unified';
  if (raw.includes('Elementary')) return 'Elementary';
  if (raw.includes('High')) return 'High School';
  return 'Unified';
}
```

### 2. Verify no other consumers of `frpmEnrollment` or raw `ellPercentage`

Search the codebase for:
- References to `frpmEnrollment` — if any component uses it directly, apply the same fix
- References to `ellPercentage` — ensure all consumers go through the snapshot builder or apply the same guard
- References to `docType` with exact string matching — ensure `.includes()` pattern is used

### 3. Add data quality assertions (optional but recommended)

In `snapshot-builder.ts`, add a development-only console warning if derived values look suspicious:
```ts
if (process.env.NODE_ENV === 'development') {
  if (snapshot.frpmPercent > 100 || snapshot.ellPercent > 100) {
    console.warn(`[snapshot-builder] Suspicious percentages for ${district.name}: FRPM=${snapshot.frpmPercent}%, ELL=${snapshot.ellPercent}%`);
  }
}
```

## Verification

After changes, run the dev server and check:
1. Navigate to discovery → run "large districts in sacramento with math evaluations"
2. Elk Grove card should show reasonable percentages (ELL ~16.6%, FRPM ~51.7%)
3. All cards in results should show percentages between 0-100
4. Elk Grove badge should say "Unified" not "Unified School District"
5. Navigate to Elk Grove district profile → identity bar should show correct docType badge
6. Spot-check 3-4 other districts from the fixture set for reasonable values

## Files Modified

- `/src/services/providers/mock/snapshot-builder.ts` — primary changes
- Potentially any component that directly reads `frpmEnrollment`, `ellPercentage`, or compares `docType` with exact strings

## Do NOT Modify

- `/src/services/providers/mock/fixtures/districts.ts` — the raw fixture data stays as-is (it reflects CDE source reality). Validation happens at the transformation layer.
- Discovery fixtures — no changes needed
- District profile page — should inherit correct data through the API chain
