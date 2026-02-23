# SS42-04: Fix Playbook Generation Flow — 404, Labels, and District Data

**Priority:** Critical — primary user flow completely broken  
**Scope:** Mock service stability + UI label fix + discovery sheet data  
**Depends on:** SS42-01 (UUID alignment), SS42-03 (context-aware CTA hook)

---

## Three Problems, One Prompt

### Problem 1: Playbook 404 After Generation (Critical)

The in-memory `playbooks` Map in `mock-playbook-service.ts` is module-scoped. In Next.js dev mode, server modules can be re-evaluated during navigation (HMR, Turbopack re-bundling), which reinitializes the Map from `SEED_PLAYBOOKS` only — any dynamically generated playbooks are lost. The generation POST succeeds and returns a `playbookId`, but the subsequent GET on the detail page hits a freshly reinitialized Map and returns 404.

**Fix:** Use the standard Next.js `globalThis` singleton pattern for the playbooks Map. This survives module re-evaluation in dev mode.

### Problem 2: List Card Label Still Says "Playbook →" (Minor)

The district list card's create state should say "Create Playbook" to match the district profile identity bar. SS42-03 specified this but the label wasn't updated.

### Problem 3: Discovery Sheet Shows "0 students" and Wrong District Name (Moderate)

When the discovery page opens the `GeneratePlaybookSheet`, it passes `initialDistrict` with `location: ''` and `enrollment: 0` because it only extracts the district name from discovery response data. The generation sheet's `DistrictResolvedCard` then shows "0 students" (Image 2). The name also shows "Elk Grove USD" instead of "Elk Grove Unified" because the discovery response uses abbreviated forms.

**Fix:** Pass the full snapshot data from the discovery response entries, which already contain enrollment, city, and county.

---

## Changes

### File 1: `/src/services/providers/mock/mock-playbook-service.ts`

**Replace the module-scoped Map with a `globalThis` singleton.**

At the top of the file, after imports, replace:

```typescript
// === In-memory store ===

interface StoredPlaybook extends Playbook {
  overallStatus: 'generating' | 'complete' | 'partial' | 'failed';
}

// Initialize with seed data for immediate list view testing
const playbooks: Map<string, StoredPlaybook> = new Map(
  SEED_PLAYBOOKS.map(pb => [pb.playbookId, pb])
);
let idCounter = SEED_PLAYBOOKS.length;
```

With:

```typescript
// === In-memory store (dev-safe singleton) ===

interface StoredPlaybook extends Playbook {
  overallStatus: 'generating' | 'complete' | 'partial' | 'failed';
}

// Use globalThis to survive Next.js module re-evaluation in dev mode.
// Without this, the Map reinitializes on every HMR cycle and loses
// dynamically generated playbooks.
const globalKey = '__ak12_mock_playbooks__' as const;

interface PlaybookStore {
  playbooks: Map<string, StoredPlaybook>;
  idCounter: number;
}

function getStore(): PlaybookStore {
  if (!(globalThis as Record<string, unknown>)[globalKey]) {
    (globalThis as Record<string, unknown>)[globalKey] = {
      playbooks: new Map<string, StoredPlaybook>(
        SEED_PLAYBOOKS.map(pb => [pb.playbookId, pb])
      ),
      idCounter: SEED_PLAYBOOKS.length,
    };
  }
  return (globalThis as Record<string, unknown>)[globalKey] as PlaybookStore;
}

// Convenience accessors used throughout the service
function getPlaybooks(): Map<string, StoredPlaybook> {
  return getStore().playbooks;
}
```

Then replace the `generateId` function:

```typescript
function generateId(): string {
  const store = getStore();
  store.idCounter++;
  return `pb-${String(store.idCounter).padStart(4, '0')}`;
}
```

Then do a find-and-replace throughout the file:
- Replace every `playbooks.get(` with `getPlaybooks().get(`
- Replace every `playbooks.set(` with `getPlaybooks().set(`
- Replace every `playbooks.has(` with `getPlaybooks().has(`
- Replace every `playbooks.delete(` with `getPlaybooks().delete(`
- Replace every `playbooks.values()` with `getPlaybooks().values()`

There should be no remaining direct references to the old `playbooks` variable or `idCounter` variable.

### File 2: `/src/components/shared/district-list-card.tsx`

Find the "Create Playbook" button block (the one that renders when `onGeneratePlaybook` is available and no existing playbook is found). The button text currently says "Playbook" — change it to "Create Playbook".

Look for text content like:
```
Playbook
```
inside the orange filled button and replace with:
```
Create Playbook
```

Keep the `<ArrowRight>` icon. The "View Playbook" label should already be correct from SS42-03.

### File 3: `/src/app/(dashboard)/discovery/page.tsx`

The `initialDistrict` prop passed to `GeneratePlaybookSheet` currently uses empty location and 0 enrollment:

```typescript
initialDistrict={
  playbookDistrictId
    ? {
        districtId: playbookDistrictId,
        districtName: playbookDistrictName ?? playbookDistrictId,
        location: '',
        enrollment: 0,
      }
    : undefined
}
```

Replace the `getDistrictNameFromResponse` function with a `getDistrictInfoFromResponse` function that extracts the full snapshot data:

```typescript
/** Extract district info from response data for playbook sheet. */
function getDistrictInfoFromResponse(
  response: DiscoveryQueryResponse | null,
  districtId: string,
): { name: string; location: string; enrollment: number } | undefined {
  if (!response) return undefined;
  const { content } = response;

  // Ranked list entries have a snapshot with full data
  if (content.format === 'ranked_list') {
    const entry = content.data.entries.find((e) => e.districtId === districtId);
    if (entry?.snapshot) {
      return {
        name: entry.snapshot.name,
        location: `${entry.snapshot.city}, ${entry.snapshot.county}`,
        enrollment: entry.snapshot.totalEnrollment,
      };
    }
    if (entry) return { name: entry.name, location: '', enrollment: 0 };
  }

  // Card set entries also have snapshots
  if (content.format === 'card_set') {
    const entry = content.data.districts.find((e) => e.districtId === districtId);
    if (entry?.snapshot) {
      return {
        name: entry.snapshot.name,
        location: `${entry.snapshot.city}, ${entry.snapshot.county}`,
        enrollment: entry.snapshot.totalEnrollment,
      };
    }
    if (entry) return { name: entry.name, location: '', enrollment: 0 };
  }

  // Brief formats — limited data available
  if (content.format === 'narrative_brief' || content.format === 'intelligence_brief') {
    const signal = content.data.keySignals.find((s) => s.districtId === districtId);
    if (signal) return { name: signal.label, location: '', enrollment: 0 };
  }

  return undefined;
}
```

Update the usage. Replace `playbookDistrictName` derivation:

```typescript
// Old
const playbookDistrictName = playbookDistrictId
  ? getDistrictNameFromResponse(response, playbookDistrictId)
  : undefined;

// New
const playbookDistrictInfo = playbookDistrictId
  ? getDistrictInfoFromResponse(response, playbookDistrictId)
  : undefined;
```

Update the `initialDistrict` prop:

```typescript
initialDistrict={
  playbookDistrictId
    ? {
        districtId: playbookDistrictId,
        districtName: playbookDistrictInfo?.name ?? playbookDistrictId,
        location: playbookDistrictInfo?.location ?? '',
        enrollment: playbookDistrictInfo?.enrollment ?? 0,
      }
    : undefined
}
```

Remove the old `getDistrictNameFromResponse` function entirely.

---

## Verification

Run `npm run build` to confirm no type errors.

### Test 1: Generation Flow (Critical Path)
1. Navigate to discovery, run query "Sacramento county districts english learner"
2. Click "Create Playbook" on Elk Grove Unified
3. Generation sheet opens — verify district shows "Elk Grove Unified" (not "Elk Grove USD") and correct enrollment (63,518)
4. Select EnvisionMath, click "Generate Playbook"
5. Should redirect to playbook detail page with content loading progressively
6. **No 404 error**

### Test 2: Label Consistency
1. In the same discovery result list, verify:
   - Districts WITH seed playbooks (Sacramento City): button says "View Playbook" (outline)
   - Districts WITHOUT playbooks (Elk Grove, Twin Rivers): button says "Create Playbook" (filled)

### Test 3: View Playbook Flow
1. Click "View Playbook" on Sacramento City Unified
2. Should navigate directly to the seed playbook detail page
3. District context card should render with real enrollment and proficiency data

### Test 4: Identity Bar Consistency
1. Navigate to Elk Grove district profile
2. Identity bar should show "Create Playbook" (filled orange)
3. Navigate to Sacramento City district profile
4. Identity bar should show "View Playbook" (outline orange)

### Test 5: Persistence After Navigation
1. Generate a playbook for Elk Grove (Test 1)
2. Navigate away (back to discovery or playbooks list)
3. Navigate back to the generated playbook URL
4. Playbook should still load (globalThis persistence)

## Do NOT Change

- `GeneratePlaybookSheet` internal logic (product selection, generation POST, redirect)
- Playbook service interface types
- Seed playbook data or fixture files
- The `useDistrictPlaybookStatus` hook
- Any other mock service files
