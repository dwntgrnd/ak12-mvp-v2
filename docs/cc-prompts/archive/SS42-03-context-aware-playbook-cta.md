# SS42-03: Context-Aware Playbook CTA on District Profile and List Card

**Priority:** High — broken user path  
**Scope:** 2 UI components + 1 data hook  
**Depends on:** SS42-01 (seed playbooks use real UUIDs)

---

## Problem

Both the district profile identity bar and the district list card always show "Create Playbook" and open the generation sheet, even when a playbook already exists for that district. The generation sheet detects the duplicate and shows a notice, but the user can still click "Generate Playbook" — which either creates an unwanted duplicate or errors. The correct behavior: if a playbook exists, the CTA should say "View Playbook" and navigate directly to it.

## Design Specification

### CTA States

Both entry points use identical labels:

| State | Label | Action |
|-------|-------|--------|
| No existing playbook | **Create Playbook** | Opens `GeneratePlaybookSheet` |
| One existing playbook | **View Playbook** | Navigates to `/playbooks/{playbookId}` |
| Multiple existing playbooks | **View Playbook** | Navigates to most recent playbook (by `generatedAt`) |

"Most recent" is the pragmatic default for multiple playbooks. We are not building a playbook picker at this stage.

### Visual Treatment

- **Create Playbook**: filled brand-orange button (current styling, no change)
- **View Playbook**: outline brand-orange button (`border-brand-orange text-brand-orange hover:bg-orange-50`)

The outline variant signals "something exists, go see it" vs. the filled variant signaling "create something new." This visual distinction is subtle but meaningful — the filled button is a generative action, the outline button is navigational.

## Implementation

### Step 1: Create a shared hook — `useDistrictPlaybookStatus`

**File:** `/src/hooks/use-district-playbook-status.ts`

This hook encapsulates the existing playbook lookup so both components share the same logic.

```typescript
import { useState, useEffect } from 'react';

interface PlaybookStatus {
  /** Whether the lookup has completed */
  loading: boolean;
  /** The most recent existing playbook ID, or null if none exist */
  existingPlaybookId: string | null;
  /** Total count of existing playbooks for this district */
  existingCount: number;
}

export function useDistrictPlaybookStatus(districtId: string | null): PlaybookStatus {
  const [status, setStatus] = useState<PlaybookStatus>({
    loading: true,
    existingPlaybookId: null,
    existingCount: 0,
  });

  useEffect(() => {
    if (!districtId) {
      setStatus({ loading: false, existingPlaybookId: null, existingCount: 0 });
      return;
    }

    let cancelled = false;
    setStatus(prev => ({ ...prev, loading: true }));

    fetch(`/api/districts/${districtId}/playbooks`)
      .then(res => res.ok ? res.json() : [])
      .then(data => {
        if (cancelled) return;
        const items = Array.isArray(data) ? data : (data.items || []);
        if (items.length === 0) {
          setStatus({ loading: false, existingPlaybookId: null, existingCount: 0 });
        } else {
          // Sort by generatedAt descending, take most recent
          const sorted = [...items].sort((a: { generatedAt: string }, b: { generatedAt: string }) =>
            new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
          );
          setStatus({
            loading: false,
            existingPlaybookId: sorted[0].playbookId,
            existingCount: items.length,
          });
        }
      })
      .catch(() => {
        if (!cancelled) {
          // On error, fall back to "no playbook" — user can still create
          setStatus({ loading: false, existingPlaybookId: null, existingCount: 0 });
        }
      });

    return () => { cancelled = true; };
  }, [districtId]);

  return status;
}
```

### Step 2: Update `DistrictIdentityBar`

**File:** `/src/components/district-profile/district-identity-bar.tsx`

**Changes:**

1. Import the hook and `useRouter`:
   - Add `import { useDistrictPlaybookStatus } from '@/hooks/use-district-playbook-status';`
   - `useRouter` is already imported

2. Call the hook inside the component:
   ```typescript
   const { loading: playbookLoading, existingPlaybookId } = useDistrictPlaybookStatus(district.districtId);
   ```

3. Replace the current static "Create Playbook" button with conditional rendering:

   ```tsx
   {playbookLoading ? (
     <Skeleton className="h-9 w-32" />
   ) : existingPlaybookId ? (
     <Button
       variant="outline"
       className="border-[1.5px] border-brand-orange text-brand-orange hover:bg-orange-50 hover:text-brand-orange"
       onClick={() => router.push(`/playbooks/${existingPlaybookId}`)}
     >
       View Playbook
     </Button>
   ) : (
     <Button
       className="bg-brand-orange text-white hover:bg-brand-orange/90"
       onClick={onGeneratePlaybook}
     >
       Create Playbook
     </Button>
   )}
   ```

4. The `onGeneratePlaybook` prop stays — it's still needed for the "Create" state. No interface change.

### Step 3: Update `DistrictListCard`

**File:** `/src/components/shared/district-list-card.tsx`

**Changes:**

1. Import the hook and `useRouter`:
   - Add `import { useDistrictPlaybookStatus } from '@/hooks/use-district-playbook-status';`
   - `useRouter` is already imported

2. Call the hook:
   ```typescript
   const { loading: playbookLoading, existingPlaybookId } = useDistrictPlaybookStatus(districtId);
   ```

3. Replace the current playbook button block. Find the block that renders `onGeneratePlaybook && (...)` and replace with:

   ```tsx
   {playbookLoading ? (
     <Skeleton className="h-6 w-24" />
   ) : existingPlaybookId ? (
     <button
       type="button"
       onClick={(e) => {
         e.stopPropagation();
         router.push(`/playbooks/${existingPlaybookId}`);
       }}
       className="flex items-center gap-1 border border-brand-orange text-brand-orange text-xs font-medium px-2.5 py-1 rounded-md hover:bg-orange-50 transition-colors"
     >
       View Playbook
       <ArrowRight className="h-3 w-3" />
     </button>
   ) : onGeneratePlaybook ? (
     <button
       type="button"
       onClick={(e) => {
         e.stopPropagation();
         onGeneratePlaybook(districtId);
       }}
       className="flex items-center gap-1 bg-brand-orange text-white text-xs font-medium px-2.5 py-1 rounded-md hover:bg-brand-orange/90 transition-colors"
     >
       Create Playbook
       <ArrowRight className="h-3 w-3" />
     </button>
   ) : null}
   ```

   Note: the list card always shows a playbook CTA now (either View or Create) regardless of whether `onGeneratePlaybook` is passed — because "View" doesn't need the callback. The `onGeneratePlaybook` prop is only needed for the "Create" path. If `onGeneratePlaybook` is not provided AND no playbook exists, render nothing (maintains backward compatibility for contexts that don't support generation).

## Verification

Run `npm run build` to confirm no type errors.

Then test these paths:

1. **District profile — no existing playbook** (e.g., a district without a seed playbook like Elk Grove):
   - CTA says "Create Playbook" (filled orange)
   - Clicking opens generation sheet
   - Complete generation → redirects to new playbook detail

2. **District profile — existing playbook** (e.g., Los Angeles, Sacramento City — districts with seed playbooks):
   - CTA says "View Playbook" (outline orange)
   - Clicking navigates to `/playbooks/{seedPlaybookId}`
   - Playbook detail renders with full district context

3. **District list card — same two cases**: verify both "Create Playbook" and "View Playbook" states render correctly with matching labels

4. **Discovery results**: run a discovery scenario, verify district cards in results show correct playbook CTA state

5. **After generating a new playbook**: navigate back to the district profile. CTA should now say "View Playbook" (the hook re-fetches on mount).

## Do NOT Change

- `GeneratePlaybookSheet` component (it still works for the "Create" path)
- Playbook service or API routes
- Any fixture data
- The `onGeneratePlaybook` prop interface on either component (it remains optional)
