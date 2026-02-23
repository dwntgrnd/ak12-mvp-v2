# SS49-03: Wire Shared Save Hook into District Profile Identity Bar

**Source:** SS-49 Saved Districts audit
**Scope:** Modify 1 file
**Depends on:** SS49-01 (API route + `useSavedDistricts` hook)

---

## Problem

The District Identity Bar (`src/components/district-profile/district-identity-bar.tsx`) manages save state with isolated local state:
- `const [isSaved, setIsSaved] = useState(false);` — always starts `false`
- `const [isSaving, setIsSaving] = useState(false);`
- `handleToggleSave` makes API calls and manages the two local booleans

If a district was saved from Discovery, the identity bar doesn't know. If you save from the identity bar and navigate back to Discovery, that save isn't reflected either.

## Changes

### Modify `src/components/district-profile/district-identity-bar.tsx`

1. **Import** the shared hook:
   ```typescript
   import { useSavedDistricts } from '@/hooks/use-saved-districts';
   ```

2. **Replace** local save state and handler:

   Remove:
   - `const [isSaved, setIsSaved] = useState(false);`
   - `const [isSaving, setIsSaving] = useState(false);`
   - The entire `handleToggleSave` function

   Add:
   ```typescript
   const { isSaved: checkIsSaved, saveDistrict, removeSavedDistrict } = useSavedDistricts();
   const isSaved = checkIsSaved(district.districtId);
   ```

3. **Update** the save button's `onClick`:
   ```typescript
   onClick={() => isSaved ? removeSavedDistrict(district.districtId) : saveDistrict(district.districtId)}
   ```

4. **Remove** the `disabled={isSaving}` prop from the save button. The shared hook handles optimistic updates — the UI responds instantly. If you want to keep a brief disabled state during the API call, the hook's optimistic pattern already handles rollback on failure, so disabling is optional. Remove it for simplicity.

5. **Keep everything else unchanged** — the button's `aria-pressed={isSaved}`, `aria-label`, visual classes (`fill-current` when saved), and text (`'Saved' : 'Save'`) all work with the boolean `isSaved` as before.

## Verification

1. `npm run build` passes
2. Navigate to a district profile — if previously saved from Discovery, bookmark shows as saved
3. Click save toggle — state changes immediately (optimistic)
4. Navigate back to Discovery results — the district shows as saved there too
5. Unsave from Discovery — navigate to district profile — shows as unsaved
6. No console errors
