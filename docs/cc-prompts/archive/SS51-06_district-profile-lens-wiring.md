# SS51-06: District Profile — Lens Wiring

**Session:** SS-51
**Depends on:** SS51-01 (hook), SS51-02 (indicator)
**Spec reference:** Spec 16 §6.3 (District Profile Identity Bar)

---

## Context

The district profile page currently reads `productId` from URL search params and fetches `FitAssessment` (deprecated) when a product context exists. This prompt:

1. Seeds the `useProductLens` hook from the URL param (preserving deep link capability).
2. Replaces `FitAssessment` fetching with `MatchSummary` fetching via `getMatchSummaries`.
3. Renders the match tier badge and headline in the identity bar.
4. Contextualizes the "Generate Playbook" CTA with the product name.

---

## Requirements

### Modify: `src/app/(dashboard)/districts/[districtId]/page.tsx`

**1. Add lens hook and URL param seeding:**

```typescript
import { useProductLens } from '@/hooks/use-product-lens';
import { useLibraryReadiness } from '@/hooks/use-library-readiness';
import type { MatchSummary } from '@/services/types/common';

const { activeProduct, setProduct, isLensActive } = useProductLens();
const readiness = useLibraryReadiness();
```

**URL param seeding effect** — runs once on mount. If a `productId` URL param exists AND no lens is currently active, seed the hook:

```typescript
useEffect(() => {
  if (productId && !isLensActive && readiness.products.length > 0) {
    const product = readiness.products.find(p => p.productId === productId);
    if (product) {
      setProduct(product);
    }
  }
  // Intentionally only run when readiness loads, not on every render
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [productId, readiness.products.length]);
```

The `productId` from search params seeds the hook, but the hook is the runtime authority. If the user already has a different lens active (set from discovery), the URL param does NOT override it.

Derive the active product ID for data fetching:
```typescript
const activeProductId = activeProduct?.productId ?? null;
```

**2. Replace FitAssessment with MatchSummary:**

Remove:
```typescript
const [fitAssessment, setFitAssessment] = useState<FitAssessment | null>(null);
```

Add:
```typescript
const [matchSummary, setMatchSummary] = useState<MatchSummary | null>(null);
```

In `fetchData`, replace the fit assessment fetch block:

Remove:
```typescript
if (productId) {
  fetch(`/api/districts/fit-assessment?districtId=${districtId}&productIds=${productId}`)
    .then((res) => (res.ok ? res.json() : null))
    .then((data) => { if (data) setFitAssessment(data); })
    .catch(() => { /* non-critical */ });
}
```

Add a separate effect for match summary fetching (decoupled from the main data fetch since it depends on lens state, not just page load):

```typescript
useEffect(() => {
  if (!activeProductId || !districtId) {
    setMatchSummary(null);
    return;
  }

  getDistrictService()
    .then(service => service.getMatchSummaries(activeProductId, [districtId]))
    .then(summaries => {
      setMatchSummary(summaries[districtId] ?? null);
    })
    .catch(() => setMatchSummary(null));
}, [activeProductId, districtId]);
```

Import `getDistrictService` from `@/services`.

**3. Remove FitAssessment rendering:**

Remove the entire fit assessment card block from the loaded state:
```tsx
{/* Remove this block: */}
{fitAssessment && fitColors && (
  <div className={cn('rounded-lg border p-4', fitColors.bg)}>
    ...
  </div>
)}
```

Remove the `fitCategory`, `fitColors` computations and the `getFitCategory` helper function.

Remove imports: `FitAssessment` from common, `fitCategoryColors` and `FitCategoryKey` from design-tokens.

**4. Thread match data to identity bar:**

```tsx
<DistrictIdentityBar
  district={district}
  yearData={yearData}
  matchSummary={matchSummary}
  activeProductName={activeProduct?.name}
  onGeneratePlaybook={() => setPlaybookOpen(true)}
/>
```

**5. Update GeneratePlaybookSheet:**

```tsx
<GeneratePlaybookSheet
  open={playbookOpen}
  onOpenChange={setPlaybookOpen}
  initialDistrict={{
    districtId: district.districtId,
    districtName: district.name,
    location: district.location,
    enrollment: district.totalEnrollment,
  }}
  initialProductIds={activeProductId ? [activeProductId] : undefined}
/>
```

### Modify: `src/components/district-profile/district-identity-bar.tsx`

**1. Add match summary and product name props:**

```typescript
import type { MatchSummary } from '@/services/types/common';
import { matchTierColors } from '@/lib/design-tokens';

interface DistrictIdentityBarProps {
  district: DistrictProfile;
  yearData: DistrictYearData[];
  matchSummary?: MatchSummary | null;
  activeProductName?: string;
  onGeneratePlaybook: () => void;
}
```

Remove `productId?: string` prop (no longer needed — lens hook handles this).

**2. Render match badge in Row A (name row):**

After the save toggle button and before the button group, add:

```tsx
{matchSummary && (
  <Badge
    className={`${matchTierColors[matchSummary.overallTier].bg} ${matchTierColors[matchSummary.overallTier].text} ${matchTierColors[matchSummary.overallTier].border} border`}
    variant="outline"
  >
    {matchTierColors[matchSummary.overallTier].label}
  </Badge>
)}
```

**3. Render headline as subtitle in Row B (contact info row):**

If `matchSummary` is present, render the headline before or after the contact segments:

```tsx
{matchSummary && (
  <p className="mt-1 text-sm text-foreground-secondary">
    {matchSummary.headline}
  </p>
)}
```

This renders as a separate line below the contact info, not inline with it. It's the match context line — distinct from contact metadata.

**4. Contextualize "Generate Playbook" CTA:**

In the button group, when `activeProductName` is provided, update the button label:

```tsx
<Button onClick={onGeneratePlaybook}>
  {activeProductName
    ? `Generate ${activeProductName} Playbook`
    : 'Generate Playbook'}
</Button>
```

Same treatment for the existing playbook button — if a playbook exists and the lens is active, the "View Playbook" label stays unchanged (it's viewing an existing document, not generating a new one).

---

## Verification

1. `npm run build` passes.
2. Navigating to `/districts/[id]` without a lens or URL param — page renders identically to current behavior (no badge, no headline, generic "Generate Playbook").
3. Navigating to `/districts/[id]?productId=abc` — lens activates, badge appears in identity bar, headline renders, CTA reads "Generate [Product Name] Playbook", ContentUtilityBar shows indicator.
4. If lens was already active from discovery (no URL param needed), district profile picks it up and renders match data.
5. Clearing the lens via ContentUtilityBar indicator dismisses badge, headline, and reverts CTA text.
6. The deprecated `FitAssessment` card no longer renders on any district profile.

---

## Files

| Action | File |
|--------|------|
| Modify | `src/app/(dashboard)/districts/[districtId]/page.tsx` |
| Modify | `src/components/district-profile/district-identity-bar.tsx` |
