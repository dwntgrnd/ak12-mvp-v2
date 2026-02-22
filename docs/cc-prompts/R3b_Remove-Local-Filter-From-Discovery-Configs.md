# R3b — Remove Local Filter from Discovery Configs

**Scope:** 1 file, 2 line changes  
**File:** `/src/components/shared/list-context-config.ts`

---

## Problem

R3 specified setting `showLocalFilter: false` for both `RANKED_LIST_CONFIG` and `CARD_SET_CONFIG`, but both still have `showLocalFilter: true`. This causes the "Filter districts..." text input to render in the utility bar for discovery contexts — the exact redundancy Spec 15A eliminates.

## Changes

In `list-context-config.ts`, change both presets:

```typescript
// RANKED_LIST_CONFIG — line ~100
showLocalFilter: false,    // was: true
searchPlaceholder: '',     // was: 'Filter districts...'

// CARD_SET_CONFIG — line ~110
showLocalFilter: false,    // was: true
searchPlaceholder: '',     // was: 'Filter districts...'
```

That's it. Two field changes in each preset.

## Do NOT Change

- `DistrictListingsContainer` — the `resolvedSearchSlot` logic is correct (it checks `config.showLocalFilter` and only builds the search input when `true`)
- `FilterPopoverBar` — its `searchSlot` prop rendering is correct (only renders when passed)
- Future directory browse config will use `showLocalFilter: true`

## Verification

1. Run `npm run build`
2. Navigate to discovery, query "districts with math initiatives"
3. Confirm: NO "Filter districts..." text input visible in the utility bar
4. Confirm: Product lens, three filter buttons, and result count are the only utility bar controls
