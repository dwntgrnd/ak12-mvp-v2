# CC Prompt: Add 4 Scenario Districts to Fixtures

**Session:** SS-41  
**Prompt:** 2 of 2  
**Depends on:** SS41-01 (data quality validation must be in place first)

---

## Objective

Add Twin Rivers USD, Sacramento City USD, Natomas USD, and Plumas County OE as full `DistrictFixtureEntry` records in the district fixtures, then update all discovery references to use the new UUIDs. This eliminates dead-end navigation when users click district cards from discovery results.

## Current State

Discovery scenarios reference 6 California districts. Two (Elk Grove, Fresno) exist in `DISTRICT_FIXTURES` with real CDE data. Four are stub string IDs (`'twin-rivers-usd'`, `'sacramento-city-usd'`, `'natomas-usd'`, `'plumas-county-oe'`) that cause "District not found" errors when users click through to district profiles.

## Changes Required

### 1. Add 4 districts to `DISTRICT_FIXTURES` in `/src/services/providers/mock/fixtures/districts.ts`

Generate a UUID for each district (use `crypto.randomUUID()` or any valid v4 UUID). Create `DistrictFixtureEntry` records with the structure matching existing entries. Each needs a `district` object and a `years` array with 3 academic years (2021-2022, 2022-2023, 2023-2024).

**Important:** The data below is synthetic but calibrated to match what the discovery scenarios already claim about these districts. The discovery narrative content references specific values (e.g., Twin Rivers enrollment 27,100, math proficiency 31.2%). The fixture data must be internally consistent with those claims. Use the most recent year (2023-2024) as the anchor and work backwards to create plausible trends.

#### Twin Rivers USD

```
district:
  name: "Twin Rivers Unified"
  cdsCode: "34674390000000"
  code: "67439"
  street: "5115 Dudley Boulevard"
  city: "McClellan"
  state: "CA"
  zip: "95652-1050"
  county: "Sacramento"
  phone: "(916) 566-1600"
  website: "http://www.twinriversusd.org"
  docType: "Unified School District"
  superintendentFirstName: "Olivia"    (synthetic — matches discovery scenario S3 stakeholder)
  superintendentLastName: "Harrison"
  latitude: 38.667
  longitude: -121.393
  ncesDistrictId: "0639780"
  statusType: "Active"

years (3 entries, most recent matching scenario claims):
  2023-2024:
    totalEnrollment: 27100
    lowGrade: "K", highGrade: "12"
    ellPercentage: 5962     (raw count — will be correctly derived by fixed snapshot-builder)
    totalEll: 5962          (22% of 27100)
    frpmCount: 21138        (78% of 27100)
    frpmEnrollment: 18      (CDE artifact — irrelevant after SS41-01 fix)
    spedCount: 3523
    chronicAbsenteeismRate: 22.8
    elaProficiency: 36.0
    mathProficiency: 31.2   (matches scenario: "31.2% — down 5.1pp over 2 years")

  2022-2023:
    totalEnrollment: 27450
    ellPercentage: null, totalEll: 5930
    frpmCount: 21100, frpmEnrollment: 22
    spedCount: 3380
    chronicAbsenteeismRate: null
    elaProficiency: 37.8
    mathProficiency: 33.5

  2021-2022:
    totalEnrollment: 27800
    ellPercentage: null, totalEll: 5838
    frpmCount: 21228, frpmEnrollment: 450
    spedCount: null
    chronicAbsenteeismRate: null
    elaProficiency: 39.2
    mathProficiency: 36.3   (31.2 + 5.1 = 36.3 — validates "down 5.1pp over 2 years")
```

#### Sacramento City USD

```
district:
  name: "Sacramento City Unified"
  cdsCode: "34674300000000"
  code: "67430"
  street: "5735 47th Avenue"
  city: "Sacramento"
  state: "CA"
  zip: "95824-4499"
  county: "Sacramento"
  phone: "(916) 643-7400"
  website: "http://www.scusd.edu"
  docType: "Unified School District"
  superintendentFirstName: "Jorge"
  superintendentLastName: "Aguilar"
  latitude: 38.525
  longitude: -121.440
  ncesDistrictId: "0633990"
  statusType: "Active"

years:
  2023-2024:
    totalEnrollment: 42500
    lowGrade: "K", highGrade: "12"
    ellPercentage: 8500, totalEll: 8500    (20% of 42500)
    frpmCount: 30175       (71% of 42500)
    frpmEnrollment: 52
    spedCount: 5525
    chronicAbsenteeismRate: 27.3
    elaProficiency: 34.0
    mathProficiency: 29.8  (matches scenario S7: "29.8%")

  2022-2023:
    totalEnrollment: 43200
    ellPercentage: null, totalEll: 8640
    frpmCount: 30672, frpmEnrollment: 48
    spedCount: 5410
    chronicAbsenteeismRate: null
    elaProficiency: 35.6
    mathProficiency: 31.9

  2021-2022:
    totalEnrollment: 43800
    ellPercentage: null, totalEll: 8760
    frpmCount: 30660, frpmEnrollment: 520
    spedCount: null
    chronicAbsenteeismRate: null
    elaProficiency: 37.1
    mathProficiency: 34.4  (29.8 + 4.6 = 34.4 — validates scenario S7 "-4.6pp")
```

#### Natomas USD

```
district:
  name: "Natomas Unified"
  cdsCode: "34674320000000"
  code: "67432"
  street: "1901 Arena Boulevard"
  city: "Sacramento"
  state: "CA"
  zip: "95834-1917"
  county: "Sacramento"
  phone: "(916) 567-5400"
  website: "http://www.natomasunified.org"
  docType: "Unified School District"
  superintendentFirstName: "Chris"
  superintendentLastName: "Evans"
  latitude: 38.649
  longitude: -121.498
  ncesDistrictId: "0626820"
  statusType: "Active"

years:
  2023-2024:
    totalEnrollment: 14200
    lowGrade: "K", highGrade: "12"
    ellPercentage: 2414, totalEll: 2414    (17% of 14200)
    frpmCount: 7810        (55% of 14200)
    frpmEnrollment: 8
    spedCount: 1846
    chronicAbsenteeismRate: 19.5
    elaProficiency: 42.0
    mathProficiency: 35.1  (matches scenario S7: "35.1%")

  2022-2023:
    totalEnrollment: 14500
    ellPercentage: null, totalEll: 2465
    frpmCount: 7975, frpmEnrollment: 12
    spedCount: 1740
    chronicAbsenteeismRate: null
    elaProficiency: 43.8
    mathProficiency: 36.2

  2021-2022:
    totalEnrollment: 14800
    ellPercentage: null, totalEll: 2516
    frpmCount: 8140, frpmEnrollment: 380
    spedCount: null
    chronicAbsenteeismRate: null
    elaProficiency: 45.3
    mathProficiency: 38.0  (35.1 + 2.9 = 38.0 — validates scenario S7 "-2.9pp")
```

#### Plumas County OE

```
district:
  name: "Plumas County Office of Education"
  cdsCode: "32000000000000"
  code: "32000"
  street: "50 Church Street"
  city: "Quincy"
  state: "CA"
  zip: "95971-9501"
  county: "Plumas"
  phone: "(530) 283-6500"
  website: "http://www.pcoe.k12.ca.us"
  docType: "County Office of Education"
  superintendentFirstName: "Terry"
  superintendentLastName: "Oestreich"
  latitude: 39.937
  longitude: -120.947
  ncesDistrictId: null
  statusType: "Active"

years:
  2023-2024:
    totalEnrollment: 1012
    lowGrade: "K", highGrade: "12"
    ellPercentage: 85, totalEll: 85      (8.4% of 1012)
    frpmCount: 617         (61% of 1012)
    frpmEnrollment: 1
    spedCount: 154         (15.2% of 1012)
    chronicAbsenteeismRate: 21.0
    elaProficiency: 41.2   (matches scenario S6)
    mathProficiency: 22.8  (matches scenario S6)

  2022-2023:
    totalEnrollment: 1035
    ellPercentage: null, totalEll: 87
    frpmCount: 621, frpmEnrollment: 1
    spedCount: 148
    chronicAbsenteeismRate: null
    elaProficiency: 40.5
    mathProficiency: 23.4  (matches scenario S6 reference)

  2021-2022:
    totalEnrollment: 1050
    ellPercentage: null, totalEll: 84
    frpmCount: 630, frpmEnrollment: 85
    spedCount: null
    chronicAbsenteeismRate: null
    elaProficiency: 39.8
    mathProficiency: 24.1  (matches scenario S6 reference)
```

**Note on `docType` for Plumas:** "County Office of Education" is the CDE classification. The `normalizeDocType()` helper from SS41-01 will need a fourth case:
```ts
if (raw.includes('County Office')) return 'County Office';
```
Or it can fall through to 'Unified' as a reasonable default. Either way, ensure the badge renders correctly.

### 2. Update district ID constants in `/src/services/providers/mock/fixtures/discovery.ts`

Replace the string-based stub IDs with the new UUIDs generated in step 1:

```ts
// BEFORE
const ID_TWIN_RIVERS = 'twin-rivers-usd';
const ID_SACRAMENTO_CITY = 'sacramento-city-usd';
const ID_NATOMAS = 'natomas-usd';
const ID_PLUMAS_COUNTY = 'plumas-county-oe';

// AFTER (use the actual UUIDs you generated)
const ID_TWIN_RIVERS = '<uuid-for-twin-rivers>';
const ID_SACRAMENTO_CITY = '<uuid-for-sacramento-city>';
const ID_NATOMAS = '<uuid-for-natomas>';
const ID_PLUMAS_COUNTY = '<uuid-for-plumas-county>';
```

### 3. Remove stub snapshots from `discovery.ts`

The `snapshotFor()` function currently has a `stubs` object for these 4 districts. Once they exist in `DISTRICT_FIXTURES` (and therefore in `MOCK_DISTRICTS`), the first branch (`MOCK_DISTRICTS.find()`) will handle them. Remove the stubs:

```ts
function snapshotFor(districtId: string): DistrictSnapshot {
  const d = MOCK_DISTRICTS.find((m) => m.districtId === districtId);
  if (d) return buildSnapshot(d);

  // Stub snapshots removed — 4 scenario districts now in MOCK_DISTRICTS.
  // Keep the fallback for safety:
  return buildStubSnapshot({ districtId, name: 'Unknown District', city: '', county: '', state: 'CA', enrollment: 0 });
}
```

### 4. Update `UUID_TO_SEED_ID` in `/src/services/providers/mock/fixtures/district-intelligence.ts`

Add entries for the new UUIDs if they need intelligence map entries. For MVP, only Elk Grove has rich district intelligence. The new districts can be added to the UUID map even if they don't have intelligence entries yet — this ensures the lookup path works if intelligence is added later:

```ts
const UUID_TO_SEED_ID: Record<string, string> = {
  // ... existing entries ...
  '<uuid-for-twin-rivers>': 'dist-tr-001',
  '<uuid-for-sacramento-city>': 'dist-sac-001',
  '<uuid-for-natomas>': 'dist-nat-001',
  '<uuid-for-plumas-county>': 'dist-plumas-001',
};
```

### 5. Update `SEED_DISTRICT_MAP` in `mock-playbook-service.ts`

The playbook service has its own seed-ID-to-name map. Add the new districts:

```ts
const SEED_DISTRICT_MAP: Record<string, string> = {
  // ... existing entries ...
  // No need to add new entries IF the fallback DISTRICT_FIXTURES.find() works.
  // But verify the fallback path uses the UUID, not a seed ID.
};
```

Actually, review the `resolveDistrictName` function. It checks `SEED_DISTRICT_MAP` first, then falls back to `DISTRICT_FIXTURES.find(d => d.district.id === districtId)`. Since the new districts will be in `DISTRICT_FIXTURES` with their UUID as the ID, the fallback will find them. No changes needed to the playbook service unless you want to add them to the seed map for clarity.

### 6. Update `DISCOVERY_COVERAGE` in `discovery.ts`

The coverage entries already exist for the 4 stub IDs. Update the keys to use the new UUIDs:

```ts
[ID_TWIN_RIVERS]: { ... },      // already uses the constant
[ID_SACRAMENTO_CITY]: { ... },   // already uses the constant
[ID_NATOMAS]: { ... },           // already uses the constant
[ID_PLUMAS_COUNTY]: { ... },     // already uses the constant
```

Since these reference the constants (not hardcoded strings), updating the constants in step 2 propagates automatically. But **verify** that every reference in the file uses the constants and not hardcoded strings.

### 7. Update `PRODUCT_RELEVANCE_MAPS` in `discovery.ts`

Same situation — the maps use the `ID_*` constants. Verify no hardcoded string references.

## Verification

After all changes, run the dev server and verify these complete paths:

**Path 1: Scenario 1 (narrative brief)**
1. Discovery → type "large districts in sacramento with math evaluations"
2. All 4 district cards should show correct percentages (not nonsensical values)
3. Click each district card → district profile loads (not "District not found")
4. Identity bar shows correct name, enrollment, badges
5. Research tabs load (may show "No intelligence available" for newer districts — that's correct)
6. Click "Generate Playbook" → sheet opens with correct district name pre-filled
7. Select a product → generate → playbook renders with district name in templates

**Path 2: Scenario 3 (Twin Rivers readiness)**
1. Discovery → type "Is Twin Rivers ready for a math curriculum change?"
2. Intelligence brief renders
3. Click Twin Rivers in key signals → profile loads
4. Generate playbook from profile → completes successfully

**Path 3: Scenario 6 (Plumas County)**
1. Discovery → type "Plumas County math"
2. Narrative brief renders with correct data
3. Click "View Plumas County profile" follow-up chip → profile loads
4. Enrollment, ELL%, FRPM%, proficiency values are reasonable

**Path 4: Card set scenario**
1. Discovery → type "Sacramento County districts with English learner programs"
2. All 4 cards render with reasonable metrics
3. Each card navigates to a working profile

## Files Modified

- `/src/services/providers/mock/fixtures/districts.ts` — add 4 `DistrictFixtureEntry` records
- `/src/services/providers/mock/fixtures/discovery.ts` — update ID constants, remove stubs
- `/src/services/providers/mock/fixtures/district-intelligence.ts` — add UUID mappings
- `/src/services/providers/mock/snapshot-builder.ts` — possibly add `County Office` to docType normalizer (if not handled by fallback)

## Do NOT Modify

- Discovery scenario content (narratives, key signals, sections) — the prose stays as-is
- Playbook service logic — it already handles new districts through the fallback path
- District profile page components — they consume the API, which now returns data
- Any component rendering logic
