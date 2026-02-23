# SS49-02: Wire Shared Save Hook into Discovery Page

**Source:** SS-49 Saved Districts audit
**Scope:** Modify 1 file
**Depends on:** SS49-01 (API route + `useSavedDistricts` hook)

---

## Problem

The Discovery page (`src/app/(dashboard)/discovery/page.tsx`) manages saved districts in isolated local state:
- `const [savedDistricts, setSavedDistricts] = useState<Set<string>>(new Set());`
- `handleSaveDistrict` and `handleRemoveSaved` callbacks make API calls and manage the local Set
- State starts empty on every mount — previously saved districts don't appear as saved

This state is not shared with the District Profile identity bar or the Saved Districts page.

## Changes

### Modify `src/app/(dashboard)/discovery/page.tsx`

1. **Import** the new hook:
   ```typescript
   import { useSavedDistricts } from '@/hooks/use-saved-districts';
   ```

2. **Replace** the local state and callbacks:

   Remove:
   - `const [savedDistricts, setSavedDistricts] = useState<Set<string>>(new Set());`
   - The entire `handleSaveDistrict` callback
   - The entire `handleRemoveSaved` callback

   Add:
   ```typescript
   const { savedDistrictIds, saveDistrict, removeSavedDistrict } = useSavedDistricts();
   ```

3. **Update** the props passed to `DiscoveryResultsLayout`:
   - Change `savedDistricts={savedDistricts}` → `savedDistricts={savedDistrictIds}`
   - Change `onSaveDistrict={handleSaveDistrict}` → `onSaveDistrict={saveDistrict}`
   - Change `onRemoveSaved={handleRemoveSaved}` → `onRemoveSaved={removeSavedDistrict}`

4. **No changes** to any child components — `DiscoveryResultsLayout`, `DiscoveryFormatRouter`, renderers, and `DistrictListCard` all accept the same prop signatures (`Set<string>`, `(districtId: string) => void`).

## Verification

1. `npm run build` passes
2. Navigate to Discovery, run a query that returns card_set or ranked_list results
3. Click "Save" on a district card — bookmark fills, text changes to "Saved"
4. Navigate away and back to Discovery — the saved district should still show as saved (hydrated from API)
5. Click "Saved" to unsave — bookmark unfills, text reverts to "Save"
6. No console errors
