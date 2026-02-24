# SS54-03: Pre-Seed Saved Districts from Seed Playbooks

**Session:** SS-54  
**Depends on:** None  
**File:** `src/services/providers/mock/mock-district-service.ts`

---

## Problem

The `savedDistricts` Map is initialized empty. But the app ships with seed playbooks for Fresno, San Diego, Oakland, and Long Beach. A rep who has playbooks for these districts would obviously have them in their saved districts list. The empty saved list creates an unrealistic demo state.

## Fix

Pre-populate `savedDistricts` with an entry for each district that has a seed playbook.

### Changes

1. Import `SEED_PLAYBOOKS` and `buildSnapshot`:

The file already imports `buildSnapshot` from `./snapshot-builder` and `MOCK_DISTRICTS`. Add `SEED_PLAYBOOKS`:

```typescript
import { SEED_PLAYBOOKS } from './fixtures/playbooks';
```

2. Replace the empty Map initialization:

**Find:**
```typescript
const savedDistricts: Map<string, SavedDistrict> = new Map();
```

**Replace with:**
```typescript
// Pre-seed saved districts from seed playbooks — districts with playbooks should appear saved
const savedDistricts: Map<string, SavedDistrict> = new Map();

for (const pb of SEED_PLAYBOOKS) {
  if (savedDistricts.has(pb.districtId)) continue; // avoid duplicates from multiple playbooks per district
  const district = MOCK_DISTRICTS.find((d) => d.districtId === pb.districtId);
  if (!district) continue;
  savedDistricts.set(pb.districtId, {
    districtId: pb.districtId,
    snapshot: buildSnapshot(district),
    savedAt: pb.generatedAt, // use playbook generation date as save date
  });
}
```

This iterates over seed playbooks, finds the matching district profile, builds a snapshot, and seeds the saved map. Using the playbook's `generatedAt` as the `savedAt` timestamp is realistic — the rep would have saved the district around the time they generated a playbook.

## Do NOT Modify

- The `saveDistrict`, `getSavedDistricts`, `removeSavedDistrict` methods — they work correctly against the Map
- Any other fixture files
- The `useSavedDistricts` hook or any UI components

## Verification

- [ ] `/saved` page shows 4 saved districts on fresh load (Fresno, San Diego, Oakland, Long Beach)
- [ ] Bookmark icons on those district profiles show as saved (filled)
- [ ] Saving a new district still works (adds to the pre-seeded list)
- [ ] Removing a pre-seeded district works (disappears from saved list)
- [ ] Playbook list page districts match saved districts list (same 4)
- [ ] Restart dev server to verify (module-level initialization runs once)

## Also Check

Are LAUSD and Sacramento seed playbooks missing? The seed array only has pb-seed-004 through 007. If they were removed intentionally, fine. If not, they should be restored — they have the richest district-specific content. This is a separate investigation, not part of this prompt.
