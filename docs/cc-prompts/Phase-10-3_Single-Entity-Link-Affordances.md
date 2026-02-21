# Phase 10-3 — District Profile Link Affordances for Single-Entity Formats

**Created:** 2026-02-20 · SS-33
**Depends on:** Phase 10-1 (type changes), Phase 10-2 (renderer integration)
**Spec references:** Spec 14 §2 (District Profile Link Affordances), Spec 09 §5 (Links)

---

## Objective

Add district profile navigation to the three single-entity result formats: Direct Answer Card, Intelligence Brief, and Narrative Brief (single-entity variant like S6 Plumas). These formats currently show district names as plain text with no path to the district profile page — they are dead ends.

Each single-entity format gets two affordances:
1. **District name as a styled link** in the result header/context
2. **"View district profile →" action link** as a terminal CTA below the result content

---

## Design Decisions (Resolved)

1. **District name is always the primary link.** Users learn one pattern: "district names are clickable." Consistent with multi-entity cards from Phase 10-2.

2. **Action link is left-aligned below result content, on its own line.** Left-alignment matches the scan pattern for stacked layouts. Own line creates a clear terminal CTA after the user has read the result.

3. **Action link reads "View district profile →"** with a right arrow character (→), not a chevron icon. Keeps it lightweight and text-native. Caption tier typography.

4. **These are `<a>` tags with `onClick` router.push** — same pattern as the Comparison Table links from Phase 10-2. Not cards.

---

## 1. Direct Answer Card

**File:** `src/components/discovery/renderers/direct-answer-card.tsx`

### Changes

The component needs `'use client'` and `useRouter`. The context line currently contains the district name as plain text (e.g., "Fresno Unified School District · 2024-25 enrollment"). We replace this with a linked district name + remaining context.

**Full updated component:**

```tsx
'use client';

import { useRouter } from 'next/navigation';
import type { DirectAnswerContent, ResponseConfidence } from '@/services/types/discovery';

interface DirectAnswerCardProps {
  content: DirectAnswerContent;
  confidence: ResponseConfidence;
}

export function DirectAnswerCard({ content }: DirectAnswerCardProps) {
  const router = useRouter();

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
      {/* Emphasis surface — value + unit centered */}
      <div className="bg-[#E0F9FC] rounded-md p-5 text-center">
        <span className="text-page-title font-[700] leading-[1.2] tracking-[-0.01em] text-foreground">
          {content.value}
        </span>
        {content.valueUnit && (
          <span className="ml-1.5 text-body font-[400] leading-[1.6] text-slate-500">
            {content.valueUnit}
          </span>
        )}
      </div>

      {/* Context line — with linked district name when available */}
      <p className="mt-3 text-body font-[400] leading-[1.6] text-slate-500 text-center">
        {content.districtId && content.districtName ? (
          <>
            <a
              href={`/districts/${content.districtId}`}
              className="font-[500] text-primary hover:underline hover:decoration-primary/60 underline-offset-2 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                router.push(`/districts/${content.districtId}`);
              }}
            >
              {content.districtName}
            </a>
            {' · '}
            {/* Render the context line portion after the district name.
                The fixture contextLine is "Fresno Unified School District · 2024-25 enrollment".
                We strip the district name prefix and render the remainder. */}
            {content.contextLine.includes(content.districtName)
              ? content.contextLine
                  .substring(content.contextLine.indexOf(content.districtName) + content.districtName.length)
                  .replace(/^\s*·\s*/, '')
              : content.contextLine}
          </>
        ) : (
          content.contextLine
        )}
      </p>

      {/* Action link — only when district context available */}
      {content.districtId && (
        <div className="mt-4 text-center">
          <a
            href={`/districts/${content.districtId}`}
            className="text-caption font-[500] leading-[1.5] tracking-[0.025em] text-primary hover:underline hover:decoration-primary/60 underline-offset-2 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              router.push(`/districts/${content.districtId}`);
            }}
          >
            View district profile →
          </a>
        </div>
      )}
    </div>
  );
}
```

### Design Notes

- The context line parsing handles the current fixture format ("District Name · detail") by splitting on the district name and rendering the remainder after the linked name. If the district name isn't found in the context line (future-proofing), it falls back to rendering the full context line as-is.
- Action link is center-aligned for Direct Answer because the entire card is center-aligned (value, context line). Left-alignment would feel disconnected here. **This is the one exception** to the left-alignment rule — the other single-entity formats are left-aligned.
- When no `districtId` exists, both the link treatment and the action link are omitted — component renders identically to its pre-Phase 10 state.

---

## 2. Brief Renderer — Single-Entity Formats (Intelligence Brief, Partial Data Brief)

**File:** `src/components/discovery/renderers/brief-renderer.tsx`

### Changes

When `content.subjectDistrictId` is present, the brief is about a single district. Two additions:

1. **District name link in the header area** — appears above the lead insight, below the format label (if intelligence brief)
2. **"View district profile →" action link** — appears after the last collapsible section, before source citations would be added

### 2A. District Name Link — Header Area

Add between the intelligence brief label and the lead insight emphasis surface:

```tsx
{/* Intelligence brief label */}
{format === 'intelligence_brief' && (
  <p className="text-overline font-[500] leading-[1.4] tracking-[0.05em] uppercase text-slate-400 mb-3">
    READINESS ASSESSMENT
  </p>
)}

{/* Subject district name — linked, single-entity briefs only */}
{content.subjectDistrictId && content.subjectDistrictName && (
  <div className="mb-3">
    <a
      href={`/districts/${content.subjectDistrictId}`}
      className="text-section-heading font-[600] leading-[1.3] tracking-[-0.01em] text-primary hover:underline hover:decoration-primary/60 underline-offset-2 transition-colors"
      onClick={(e) => {
        e.preventDefault();
        router.push(`/districts/${content.subjectDistrictId}`);
      }}
    >
      {content.subjectDistrictName}
    </a>
  </div>
)}

{/* Lead insight — emphasis surface */}
<div className="bg-[#E0F9FC] rounded-md p-4">
  ...
```

The district name uses **section heading** tier (18px/600) — it's the most prominent element in the header, establishing the subject before the user reads the lead insight. Color is `text-primary` (cyan) to signal interactivity.

### 2B. Action Link — After Sections

Add after the collapsible sections block, as the last element inside the outer card `<div>`:

```tsx
      {/* ... existing collapsible sections ... */}

      {/* View district profile action — single-entity briefs only */}
      {content.subjectDistrictId && (
        <div className="mt-6">
          <a
            href={`/districts/${content.subjectDistrictId}`}
            className="text-caption font-[500] leading-[1.5] tracking-[0.025em] text-primary hover:underline hover:decoration-primary/60 underline-offset-2 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              router.push(`/districts/${content.subjectDistrictId}`);
            }}
          >
            View district profile →
          </a>
        </div>
      )}
    </div>  {/* end outer card */}
```

Left-aligned (default block flow), `mt-6` section gap above. Caption tier to keep it subordinate to the brief content.

### 2C. Add Router Import

The file already has `'use client'`. Add `useRouter`:

```tsx
import { useRouter } from 'next/navigation';
```

Add `const router = useRouter();` at the top of the component function body (before the `openSections` state).

### 2D. Multi-Entity Briefs Unaffected

When `subjectDistrictId` is absent (S1 Narrative Brief — multi-entity landscape), neither the district name header nor the action link render. The brief looks and behaves exactly as it does post-Phase 10-2.

---

## 3. What This Prompt Does NOT Do

- Does **not** modify Ranked List, Card Set, or Comparison Table — those were handled in Phase 10-2
- Does **not** implement the product lens selector — that's Phase 10-4
- Does **not** modify the format router or results layout
- Does **not** change any fixture data — all required fields (`subjectDistrictId`, `districtId`, `districtName`) were added in Phase 10-1

---

## 4. Verification

### Direct Answer (S2 — "fresno enrollment")
- [ ] District name "Fresno Unified School District" renders as cyan link in context line
- [ ] Clicking district name navigates to `/districts/75c04266-c622-4294-aa22-046245c95e51`
- [ ] "View district profile →" appears center-aligned below context line
- [ ] Clicking action link navigates to same district profile
- [ ] Hover: underline appears on both links
- [ ] Context line remainder ("2024-25 enrollment") renders after the linked name with · separator

### Intelligence Brief (S3 — "twin rivers math curriculum ready change")
- [ ] "READINESS ASSESSMENT" overline label still renders
- [ ] "Twin Rivers USD" appears as cyan link at section heading size below the label, above lead insight
- [ ] Clicking district name navigates to `/districts/twin-rivers-usd`
- [ ] "View district profile →" appears left-aligned after last collapsible section
- [ ] Clicking action link navigates to same district profile
- [ ] Key signals still render as plain metric tiles (no districtId on S3 signals)

### Narrative Brief — Plumas Single-Entity (S6 — "plumas county math")
- [ ] "Plumas County Office of Education" appears as cyan link at section heading size above lead insight
- [ ] Clicking navigates to `/districts/plumas-county-oe`
- [ ] "View district profile →" appears left-aligned after last collapsible section
- [ ] Key signals still render as plain metric tiles
- [ ] No "READINESS ASSESSMENT" label (this is `narrative_brief` format, not `intelligence_brief`)

### Narrative Brief — Multi-Entity (S1 — "large districts sacramento math evaluations")
- [ ] No district name header (no `subjectDistrictId`)
- [ ] No "View district profile →" action link
- [ ] Key signal district cards from Phase 10-2 still function correctly

### No-Change Formats
- [ ] Recovery (S5): no changes
- [ ] Ranked List (S7): no changes (handled in 10-2)
- [ ] Card Set (S8): no changes (handled in 10-2)
- [ ] Comparison Table (S4): no changes (handled in 10-2)

### Build
- [ ] `npm run build` passes
