# SS54-02: Quick Fixes — Demo Button Removal, Find Similar Districts, Auto-Save on Generate (PL-06, PL-07)

**Session:** SS-54  
**Punch List Items:** PL-06 (Find Similar copy + behavior), PL-07 (auto-save on playbook generate), + demo button cleanup  
**Surfaces:** District identity bar, playbook detail page, generate playbook sheet

---

## Task 1: Remove Demo Generate Button from Playbook Detail Page

**File:** `src/app/(dashboard)/playbooks/[playbookId]/page.tsx`

The "Demo: Generate" button on the playbook detail page is dev scaffolding that no longer serves a purpose now that the generate sheet is fully functional. It has caused bugs (ghost playbooks from bad districtIds) and creates confusion during walkthroughs.

### Changes

1. Remove the `handleDemoGenerate` callback function entirely.

2. Remove the demo button from the header button group. Find this block in the JSX:
```tsx
{process.env.NODE_ENV === 'development' && (
  <Button variant="outline" size="sm" onClick={handleDemoGenerate}>
    Demo: Generate
  </Button>
)}
```
Delete it.

3. Remove the demo button from the error state as well. Find:
```tsx
{process.env.NODE_ENV === 'development' && (
  <Button onClick={handleDemoGenerate}>
    Demo: Generate Playbook
  </Button>
)}
```
Delete it.

### Verification — Task 1
- [ ] Playbook detail page no longer shows "Demo: Generate" button in any environment
- [ ] Error/not-found state no longer shows the demo button
- [ ] No TypeScript errors from removed references
- [ ] Existing playbook navigation and display is unaffected

---

## Task 2: "Find Similar Districts" Copy + County Pre-Seed (PL-06)

**File:** `src/components/district-profile/district-identity-bar.tsx`

### Current behavior
The "Find Similar" button navigates to `/discovery` with no parameters. The label is vague and the destination is a blank discovery page — useless to the rep.

### Target behavior
- Rename to **"Find Similar Districts"**
- Navigate to discovery with the district's county as a pre-seeded query: `/discovery?q=districts in {county} county`
- This gives the rep a relevant starting point (same-region districts) without requiring true quantitative similarity matching (which is backlog work)

### Changes

Find the "Find Similar" button in the JSX:
```tsx
<Button
  variant="outlineBrand"
  onClick={() => router.push('/discovery')}
>
  Find Similar
</Button>
```

Replace with:
```tsx
<Button
  variant="outlineBrand"
  onClick={() => {
    const query = district.county
      ? `districts in ${district.county} county`
      : district.name;
    router.push(`/discovery?q=${encodeURIComponent(query)}`);
  }}
>
  Find Similar Districts
</Button>
```

### Discovery page: consume the `q` param

**File:** `src/app/(dashboard)/discovery/page.tsx`

The discovery page needs to check for a `q` search param on mount and auto-submit it if present. 

Add `useSearchParams` to the imports (if not already imported):
```tsx
import { useRouter, useSearchParams } from 'next/navigation';
```

Inside the component, after the existing state declarations, add an effect that reads the `q` param and triggers a search:

```tsx
const searchParams = useSearchParams();

// Auto-submit if q param is present (e.g., from "Find Similar Districts")
useEffect(() => {
  const initialQuery = searchParams.get('q');
  if (initialQuery && pageState === 'entry') {
    handleSubmit(initialQuery);
  }
  // Only run on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);
```

**Important:** Check how `handleSubmit` (or the equivalent query submission function) is defined in the discovery page. The function that takes a query string and triggers the loading → results flow needs to be callable from this effect. If the submission function is defined after this effect in the component body, it may need to be hoisted or wrapped in a ref. Adapt accordingly — the key requirement is that arriving at `/discovery?q=districts+in+Los+Angeles+county` automatically executes that query and shows results.

If the discovery page uses a different function name for query submission (e.g., `handleQuery`, `submitQuery`, `executeSearch`), use that function instead. The pattern is: read `q` from URL → call the existing submit function → user sees results immediately.

### Fallback
If `district.county` is null or empty, fall back to the district name as the query. This ensures the button always does something, even for districts with incomplete fixture data.

### Verification — Task 2
- [ ] District profile page shows "Find Similar Districts" (not "Find Similar")
- [ ] Clicking the button from LAUSD's profile navigates to `/discovery?q=districts%20in%20Los%20Angeles%20county`
- [ ] Discovery page auto-executes the query and shows results (Los Angeles county districts)
- [ ] Clicking from a district with no county data navigates with the district name as query
- [ ] Discovery page still works normally when accessed without a `q` param (entry state)
- [ ] Back navigation from discovery returns to the district profile

---

## Task 3: Auto-Save District on Playbook Generation (PL-07)

**File:** `src/components/playbook/generate-playbook-sheet.tsx`

### Design intent
When a rep generates a playbook for a district, that district should automatically appear in their Saved Districts list. If a district is worth generating a playbook for, it's worth tracking. This eliminates the manual step of saving separately.

### Changes

The `handleGenerate` function already has the `selectedDistrict` in scope. After successful generation (after the `router.push` and before `onOpenChange(false)`), call `saveDistrict` for the selected district — but only if it isn't already saved.

1. Import and use the `useSavedDistricts` hook. Add near the top of the component:
```tsx
const { isSaved, saveDistrict } = useSavedDistricts();
```

2. In the `handleGenerate` function, after the successful `router.push`, add the auto-save. Find the success path:
```tsx
const data = await res.json();
const playbookId = data.playbookId;
router.push(`/playbooks/${playbookId}`);
onOpenChange(false);
```

Insert the auto-save between `router.push` and `onOpenChange`:
```tsx
const data = await res.json();
const playbookId = data.playbookId;

// Auto-save district if not already saved
if (selectedDistrict && !isSaved(selectedDistrict.districtId)) {
  saveDistrict(selectedDistrict.districtId).catch(() => {
    // Silent failure — auto-save is a convenience, not critical path
  });
}

router.push(`/playbooks/${playbookId}`);
onOpenChange(false);
```

The `.catch()` ensures that a failed auto-save doesn't block or error the playbook generation flow. The save is fire-and-forget — the optimistic update in `useSavedDistricts` will show the bookmark immediately, and if it fails it rolls back silently.

### Verification — Task 3
- [ ] Generate a playbook for a district that is NOT saved → after generation, the district appears in Saved Districts (check sidebar or /saved page)
- [ ] Generate a playbook for a district that IS already saved → no duplicate, no error, saved state unchanged
- [ ] If the auto-save API call fails, the playbook still generates and navigates correctly
- [ ] The saved districts bookmark icon on the district profile page reflects the auto-saved state on return

---

## Execution Order

1. **Task 1** — Remove demo button (cleanup, no dependencies)
2. **Task 2** — Find Similar Districts (copy + routing + discovery param consumption)
3. **Task 3** — Auto-save on generate (isolated side effect addition)

---

## Files Modified

| File | Change |
|------|--------|
| `src/app/(dashboard)/playbooks/[playbookId]/page.tsx` | Remove demo generate button and handler |
| `src/components/district-profile/district-identity-bar.tsx` | Rename "Find Similar" → "Find Similar Districts", add county query routing |
| `src/app/(dashboard)/discovery/page.tsx` | Read `q` search param and auto-submit on mount |
| `src/components/playbook/generate-playbook-sheet.tsx` | Auto-save district on successful playbook generation |

## Backlog Note

PL-06 ("Find Similar Districts") is solved here for demo purposes only — routing to same-county discovery results. True quantitative similarity matching (enrollment band, proficiency range, demographic profile) requires deeper requirements gathering and service layer work. Flag for future sprint.
