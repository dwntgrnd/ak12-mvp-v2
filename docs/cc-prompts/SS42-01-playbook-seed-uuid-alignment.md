# SS42-01: Align Seed Playbooks with District Fixture UUIDs

**Priority:** High — broken user path  
**Scope:** Mock data alignment only — no UI changes  
**Estimated complexity:** Low (mechanical ID replacement + one dead-code removal)

---

## Problem

`SEED_PLAYBOOKS` in `playbooks.ts` and `SEED_DISTRICT_MAP` in `mock-playbook-service.ts` use fictional seed IDs (`dist-la-001`, `dist-sac-001`, etc.) while all district profiles use real CDE UUIDs from `DISTRICT_FIXTURES`. This disconnect causes:

1. Seed playbooks appear in the playbook list but their district context cards fail (404 on district fetch)
2. Duplicate detection in the generate sheet can't match seed playbooks to real districts
3. `getExistingPlaybooks()` returns empty for districts that actually have seed playbooks

## Changes Required

### File 1: `/src/services/providers/mock/fixtures/playbooks.ts`

Replace all `districtId` values in `SEED_PLAYBOOKS` with real UUIDs from `DISTRICT_FIXTURES`:

| Seed ID | UUID | District |
|---------|------|----------|
| `dist-la-001` | `b8cd9b23-4f2f-470d-b1e5-126e7ff2a928` | Los Angeles Unified |
| `dist-sf-001` | `8148d163-df6f-48a9-976f-4137b5e3895b` | San Francisco Unified |
| `dist-sac-001` | `7f4e8dd1-9f32-4d87-92f3-3009800b88b0` | Sacramento City Unified |
| `dist-fre-001` | `75c04266-c622-4294-aa22-046245c95e51` | Fresno Unified |
| `dist-sd-001` | `48e9f362-9690-44e5-b8a2-362a24f30e58` | San Diego Unified |
| `dist-oak-001` | `89e89add-4b95-47b5-a8e1-ae3b92fadf73` | Oakland Unified |
| `dist-lb-001` | `7c2603bd-7cca-414f-8813-320d8ef2020b` | Long Beach Unified |

For each of the 7 seed playbook entries, replace the `districtId` field value. Do NOT change `playbookId`, `productIds`, `productNames`, `fitAssessment`, `generatedAt`, section builders, or `overallStatus`.

Also update the `districtId` argument passed to `buildCompleteSections()` — the second argument is `districtId` and is used for `DISTRICT_SPECIFIC_CONTENT` lookup. This must match the keys in `playbook-content.ts` (updated in File 3 below).

### File 2: `/src/services/providers/mock/mock-playbook-service.ts`

**Remove the `SEED_DISTRICT_MAP` entirely.** The `resolveDistrictName` function already has a `DISTRICT_FIXTURES.find()` fallback that works with UUIDs. The hardcoded map is now redundant and would need to be kept in sync — eliminate it.

Updated `resolveDistrictName` should be:

```typescript
function resolveDistrictName(districtId: string): string {
  const fixture = DISTRICT_FIXTURES.find((d) => d.district.id === districtId);
  if (fixture) {
    return fixture.district.name;
  }
  return 'California School District';
}
```

### File 3: `/src/services/providers/mock/fixtures/playbook-content.ts`

`DISTRICT_SPECIFIC_CONTENT` uses seed ID keys. Update all three to UUIDs:

| Old Key | New Key (UUID) | District |
|---------|----------------|----------|
| `'dist-la-001'` | `'b8cd9b23-4f2f-470d-b1e5-126e7ff2a928'` | Los Angeles Unified |
| `'dist-sac-001'` | `'7f4e8dd1-9f32-4d87-92f3-3009800b88b0'` | Sacramento City Unified |
| `'dist-fre-001'` | `'75c04266-c622-4294-aa22-046245c95e51'` | Fresno Unified |

Change only the object keys. Do not modify the content values, section labels, or content source fields within each entry.

## Verification

After changes, run `npm run build` to confirm no type errors.

Then verify these paths in the browser:

1. **Playbook list page** (`/playbooks`): All 7 seed playbooks should render with district names
2. **Playbook detail** — click any seed playbook: District context card should show enrollment, proficiency data (not just the name)
3. **District profile → Generate Playbook**: Navigate to Sacramento City profile, click Generate Playbook. The sheet should show "A playbook already exists for Sacramento City Unified" duplicate notice (because seed playbook `pb-seed-003` now uses Sacramento's UUID)
4. **Generate new playbook**: Complete the generation flow. After redirect to the new playbook detail page, the district context card should render fully
5. **Playbook list after generation**: Both the seed playbook and newly generated playbook for Sacramento City should appear

## Do NOT Change

- Any UI components
- The `DISTRICT_FIXTURES` data
- The `district-intelligence.ts` file (its `UUID_TO_SEED_ID` map is a separate concern for intelligence lookup)
- Seed playbook structure, section builders, or content templates
- The playbook service interface
