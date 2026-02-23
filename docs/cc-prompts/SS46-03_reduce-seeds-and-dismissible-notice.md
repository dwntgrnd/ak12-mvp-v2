# SS46-03: Reduce Seed Playbooks and Dismissible Duplicate Notice

**Session:** SS-46
**Scope:** Mock fixture reduction + minor UI change to duplicate alert
**Files to modify:**
- `src/services/providers/mock/fixtures/playbooks.ts`
- `src/components/playbook/generate-playbook-sheet.tsx`

**No new files. No new dependencies. No service contract changes.**

---

## Context

During demos, every generation attempt triggers the duplicate playbook notice because all seven seed playbooks use the only two available products (EnvisionMath, myPerspectives). This creates friction — the notice fires on virtually any demo scenario. Two fixes:

1. Remove seed playbooks that occupy the most common demo districts, freeing them for clean generation demos
2. Make the duplicate notice dismissible so reps (and demo presenters) can acknowledge and proceed without a persistent warning

---

## 1. Reduce Seed Playbooks

**In `src/services/providers/mock/fixtures/playbooks.ts`:**

Remove seeds 1, 2, and 3 from the `SEED_PLAYBOOKS` array:

- ~~`pb-seed-001` — Los Angeles Unified (EnvisionMath + myPerspectives, complete)~~
- ~~`pb-seed-002` — San Francisco Unified (myPerspectives, complete)~~
- ~~`pb-seed-003` — Sacramento City Unified (EnvisionMath + myPerspectives, complete)~~

**Keep these four seeds** (they serve distinct UI demo purposes):

| Seed | District | Purpose |
|---|---|---|
| `pb-seed-004` | Fresno Unified | Low fit score (2) — demonstrates fit score styling |
| `pb-seed-005` | San Diego Unified | Generating status — demonstrates in-progress state |
| `pb-seed-006` | Oakland Unified | Failed status — demonstrates error state |
| `pb-seed-007` | Long Beach Unified | Standard complete card — grid density |

This frees Los Angeles Unified, San Francisco Unified, and Sacramento City Unified as clean demo targets with no duplicate collisions.

**After removing the three entries from the array, update the `idCounter` initialization in `mock-playbook-service.ts`:**

The store initializes `idCounter` from `SEED_PLAYBOOKS.length`. With 4 seeds instead of 7, newly generated playbooks will start at `pb-0005`. This is fine — IDs just need to be unique, not sequential with seeds.

No other code references specific seed playbook IDs, so this is a clean removal.

---

## 2. Dismissible Duplicate Notice

**In `src/components/playbook/generate-playbook-sheet.tsx`:**

### Add dismiss state

Add a state variable to track whether the notice has been dismissed:

```tsx
const [duplicateDismissed, setDuplicateDismissed] = useState(false);
```

### Reset dismiss state when selections change

The dismiss state should reset when the user changes their product or district selection (because a new duplicate check runs). Add `setDuplicateDismissed(false)` to the existing `useEffect` that manages `duplicateNotice` — specifically, reset it at the top of that effect before the fetch runs.

Also reset it in the `useEffect` that runs when the sheet opens (alongside the other state resets).

### Conditionally render the notice

Change the duplicate notice rendering from:

```tsx
{duplicateNotice && (
  <Alert>
    <Info className="h-4 w-4" />
    <AlertDescription>{duplicateNotice}</AlertDescription>
  </Alert>
)}
```

To:

```tsx
{duplicateNotice && !duplicateDismissed && (
  <Alert className="relative">
    <Info className="h-4 w-4" />
    <AlertDescription className="pr-8">{duplicateNotice}</AlertDescription>
    <button
      type="button"
      onClick={() => setDuplicateDismissed(true)}
      className="absolute top-3 right-3 text-foreground-secondary hover:text-foreground transition-colors"
      aria-label="Dismiss notice"
    >
      <X className="h-3.5 w-3.5" />
    </button>
  </Alert>
)}
```

### Add X import

Add `X` to the existing lucide-react import:

```tsx
import { Loader2, Info, X } from 'lucide-react';
```

### Behavior summary

- Notice appears when duplicate is detected (existing behavior)
- User can click X to dismiss — notice disappears for the rest of the current modal session
- If user changes district or product selection, dismiss state resets and a new duplicate check runs
- If the new selection also triggers a duplicate, the notice reappears (undismissed)
- When modal closes and reopens, all state resets (existing behavior covers this)

---

## Verification Checklist

**Seed reduction:**
- [ ] Playbooks listing page shows 4 seed playbooks (Fresno, San Diego, Oakland, Long Beach)
- [ ] Los Angeles Unified, San Francisco Unified, Sacramento City Unified have no pre-existing playbooks
- [ ] Generating a playbook for LAUSD does NOT trigger duplicate notice
- [ ] Generating a playbook for San Francisco does NOT trigger duplicate notice
- [ ] Fit score variety still visible on listing page (score 2, 6, 7, 8)
- [ ] Status variety still visible (complete, generating, failed)

**Dismissible notice:**
- [ ] Select a product+district combo that has an existing playbook (e.g., EnvisionMath at Fresno Unified) — duplicate notice appears
- [ ] Click X on the notice — it disappears
- [ ] Generate button remains enabled after dismissing
- [ ] Change the district selection — notice dismiss state resets
- [ ] If new selection also has a duplicate, notice reappears
- [ ] Change product selection — notice dismiss state resets
- [ ] Close and reopen modal — all state is clean
- [ ] X button has visible hover state and appropriate aria-label
