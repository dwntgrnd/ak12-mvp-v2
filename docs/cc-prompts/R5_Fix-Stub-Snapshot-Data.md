# R5 — Fix Stub Snapshot Data (FRPM, ELL, Proficiency)

**Scope:** 1 file  
**File:** `/src/services/providers/mock/fixtures/discovery.ts`  
**Spec reference:** Spec 15 §3 (DistrictSnapshot), Spec 15A — utility bar filters require non-zero data to demonstrate filtering

---

## Problem

Four districts used in discovery scenarios are built via `buildStubSnapshot()` which hardcodes `0` for `frpmPercent`, `ellPercent`, `elaProficiency`, and `mathProficiency`. These districts render in ranked lists and card sets with `0%` across all demographic and academic metrics — visually broken and undermining the demo.

**Affected districts:**
- Twin Rivers USD (`twin-rivers-usd`)
- Sacramento City USD (`sacramento-city-usd`)
- Natomas USD (`natomas-usd`)
- Plumas County OE (`plumas-county-oe`)

The two districts pulled from `MOCK_DISTRICTS` (Elk Grove, Fresno) have real CDE data and render correctly.

## Root Cause

`buildStubSnapshot()` in `snapshot-builder.ts` uses `0` as the default for all percentage fields. The `snapshotFor()` function in `discovery.ts` passes only `districtId`, `name`, `city`, `county`, `state`, and `enrollment` to the stub builder — no demographic or academic data.

## Fix Approach

Expand the stub data in `discovery.ts` to include realistic values that are **consistent with the narrative content** already in the scenario fixtures. Do NOT change `snapshot-builder.ts` — its `0` default is correct for truly unknown districts. The fix goes in the fixture data that feeds the stubs.

### Updated Stubs in `discovery.ts`

Replace the `stubs` Record inside `snapshotFor()` with expanded data. Also update `buildStubSnapshot()` call sites OR (simpler) inline-build full `DistrictSnapshot` objects for these four districts instead of using `buildStubSnapshot`.

**Option A (recommended — clearest):** Replace the stubs block with direct `DistrictSnapshot` construction:

```typescript
function snapshotFor(districtId: string): DistrictSnapshot {
  const d = MOCK_DISTRICTS.find((m) => m.districtId === districtId);
  if (d) return buildSnapshot(d);

  // Stub snapshots for scenario districts not in MOCK_DISTRICTS.
  // Values are fabricated but consistent with scenario narrative content.
  const stubs: Record<string, DistrictSnapshot> = {
    [ID_TWIN_RIVERS]: {
      districtId: ID_TWIN_RIVERS,
      name: 'Twin Rivers USD',
      city: 'North Highlands',
      county: 'Sacramento',
      state: 'CA',
      docType: 'Unified',
      lowGrade: 'K',
      highGrade: '12',
      totalEnrollment: 27100,
      frpmPercent: 78,
      ellPercent: 22,
      elaProficiency: 36,
      mathProficiency: 31,
    },
    [ID_SACRAMENTO_CITY]: {
      districtId: ID_SACRAMENTO_CITY,
      name: 'Sacramento City USD',
      city: 'Sacramento',
      county: 'Sacramento',
      state: 'CA',
      docType: 'Unified',
      lowGrade: 'K',
      highGrade: '12',
      totalEnrollment: 42500,
      frpmPercent: 71,
      ellPercent: 20,
      elaProficiency: 34,
      mathProficiency: 30,
    },
    [ID_NATOMAS]: {
      districtId: ID_NATOMAS,
      name: 'Natomas USD',
      city: 'Sacramento',
      county: 'Sacramento',
      state: 'CA',
      docType: 'Unified',
      lowGrade: 'K',
      highGrade: '12',
      totalEnrollment: 14200,
      frpmPercent: 55,
      ellPercent: 17,
      elaProficiency: 42,
      mathProficiency: 35,
    },
    [ID_PLUMAS_COUNTY]: {
      districtId: ID_PLUMAS_COUNTY,
      name: 'Plumas County Office of Education',
      city: 'Quincy',
      county: 'Plumas',
      state: 'CA',
      docType: 'Unified',
      lowGrade: 'K',
      highGrade: '12',
      totalEnrollment: 1012,
      frpmPercent: 61,
      ellPercent: 8,
      elaProficiency: 41,
      mathProficiency: 23,
    },
  };

  if (stubs[districtId]) return stubs[districtId];

  // Fallback
  return buildStubSnapshot({ districtId, name: 'Unknown District', city: '', county: '', state: 'CA', enrollment: 0 });
}
```

### Value Source Notes

These values are fabricated for demo purposes but internally consistent with scenario narrative text:

| District | FRPM% | ELL% | ELA Prof | Math Prof | Narrative Cross-Check |
|----------|-------|------|----------|-----------|----------------------|
| Twin Rivers | 78% | 22% | 36% | 31% | S3: "31.2%" math prof, S7: "31.2%", S8: "21.5% EL" |
| Sacramento City | 71% | 20% | 34% | 30% | S1: "29.1%" math prof, S7: "29.8%", S8: "19.7% EL" |
| Natomas | 55% | 17% | 42% | 35% | S7: "35.1%" math prof, S8: "16.8% EL" |
| Plumas County | 61% | 8% | 41% | 23% | S6: "22.8%" math prof, "61% FRPM", "8.4% EL" |

**Note:** Some scenario narrative values don't match perfectly (e.g., Twin Rivers S8 says "21.5% EL" but snapshot uses 22%). Minor differences are acceptable — the snapshot is the canonical card value, narrative text is AI-generated prose. Perfect alignment between these is a future polish concern, not an R5 blocker. If you want exact match, use the narrative values: Twin Rivers ELL=21, Sacramento City ELL=20, Natomas ELL=17, Plumas ELL=8.

### Import Cleanup

After this change, `buildStubSnapshot` is only used in the fallback path. The import can stay — it's still needed for the unknown-district fallback. No other changes needed.

## Verification

1. Run `npm run build` — no type errors
2. Navigate to discovery, query "districts with math initiatives" (Scenario 9 — card set)
3. Confirm: All four district cards show non-zero FRPM%, ELL%, and academic proficiency values
4. Query "steepest math score declines" (Scenario 7 — ranked list)
5. Confirm: All four ranked districts show non-zero metrics
6. Confirm: Filter dropdowns (Grade Band, Type, Size) produce meaningful results when applied
