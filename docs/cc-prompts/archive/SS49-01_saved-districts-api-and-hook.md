# SS49-01: Saved Districts API Route + Shared Hook

**Source:** SS-49 Saved Districts audit
**Scope:** 1 new API route, 1 new hook
**Depends on:** Nothing — foundational layer

---

## Problem

The mock provider implements `getSavedDistricts()` but no API route exposes it. UI surfaces manage save state in isolated local state (`useState`) that starts empty on every mount. Save state is lost across page navigations and isn't shared between Discovery and District Profile.

## Changes

### 1. Create API route: `src/app/api/saved-districts/route.ts`

GET endpoint that returns the saved districts list.

```typescript
import { NextResponse } from 'next/server';
import { getDistrictService } from '@/services/factory';

export async function GET() {
  try {
    const service = await getDistrictService();
    const result = await service.getSavedDistricts();
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
```

### 2. Create shared hook: `src/hooks/use-saved-districts.ts`

This hook owns all save state for the application. Any component that needs to know saved status or trigger save/unsave imports this hook.

Requirements:
- On mount, fetch `GET /api/saved-districts` to hydrate the saved IDs set
- Expose `savedDistrictIds: Set<string>` (just the IDs for quick lookup)
- Expose `savedDistricts: SavedDistrict[]` (full objects for the Saved Districts page)
- Expose `saveDistrict(districtId: string): Promise<void>` — optimistic add to set, POST to API, rollback on failure
- Expose `removeSavedDistrict(districtId: string): Promise<void>` — optimistic remove, DELETE to API, rollback on failure
- Expose `isSaved(districtId: string): boolean` convenience method
- Expose `loading: boolean` for initial hydration state
- Use a module-level cache so multiple components mounting the hook share the same data without duplicate fetches. Pattern: store the fetched data in a module-scoped variable and a `Promise` ref to prevent concurrent fetches.

The hook should NOT use React Context. It should use a module-level singleton pattern so that:
- Any component importing `useSavedDistricts()` gets the same cached data
- Mutations (save/remove) update the shared cache and trigger re-renders in all consuming components

Implementation approach — use a simple pub/sub pattern:
```
// Module-level state
let cache: { ids: Set<string>; items: SavedDistrict[] } | null = null;
let fetchPromise: Promise<void> | null = null;
const listeners = new Set<() => void>();

function subscribe(listener: () => void) { ... }
function notify() { listeners.forEach(fn => fn()); }
```

The hook uses `useSyncExternalStore` (or a `useState` + `useEffect` subscription) to re-render when cache changes.

Type the return value:
```typescript
interface UseSavedDistrictsReturn {
  savedDistrictIds: Set<string>;
  savedDistricts: SavedDistrict[];
  saveDistrict: (districtId: string) => Promise<void>;
  removeSavedDistrict: (districtId: string) => Promise<void>;
  isSaved: (districtId: string) => boolean;
  loading: boolean;
}
```

Import `SavedDistrict` from `@/services/types/district`.

## Verification

1. `npm run build` passes with no type errors
2. In browser console, `fetch('/api/saved-districts').then(r => r.json()).then(console.log)` returns `{ items: [], totalCount: 0, ... }`
3. After saving a district via `POST /api/districts/{id}/save`, the GET endpoint returns that district
4. No existing files are modified in this prompt — this is purely additive
