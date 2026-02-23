# SS46-01: Playbook Generation Modal — Language, Tokens, and Visual Polish

**Session:** SS-46
**Scope:** UI-layer only — string literals, design token compliance, spacing consistency
**Files to modify:**
- `src/components/playbook/generate-playbook-sheet.tsx` (primary)
- `src/components/playbook/product-selection-card.tsx`
- `src/components/playbook/district-search-combobox.tsx`
- `src/components/playbook/district-resolved-card.tsx`
- `src/components/playbook/empty-playbooks-state.tsx`

**No new files. No new dependencies. No service contract changes.**

---

## Context

The playbook generation modal is functionally complete — state handling, accessibility, flow logic are all solid. This prompt addresses three concerns:

1. **Language**: Current copy is functional but clinical. Upgrade to conversational, guiding tone that orients the sales rep to what they're doing and why.
2. **Token compliance**: A handful of hardcoded/arbitrary values need to resolve to design tokens or standard Tailwind scale values.
3. **Spacing consistency**: Interactive elements need consistent breathing room. All spacing should follow deliberate, token-aligned patterns.

**Guiding principle reminder**: The platform's value is contextual sales intelligence — trends, stories, evidence for compelling conversations. The modal language should reflect this. The visual presentation communicates product quality.

---

## 1. Language Updates

Apply these string literal changes across the specified files. **Standardize on "Generate" as the verb for playbook creation — never "build," "create," or "new" in this context.**

### generate-playbook-sheet.tsx

**Dialog title:**
```
Before: "Generate Playbook"
After:  "Generate Sales Playbook"
```

**Dialog description — make visible (remove `sr-only` class):**
```
Before: (sr-only) "Select products and a district to generate a sales playbook."
After:  (visible) "Choose your products and target district — we'll generate a conversation-ready playbook with district context, evidence, and talking points."
```
Style the visible description as `text-sm text-foreground-secondary mt-1`.

**Products section label:**
```
Before: "Products"
After:  "Which products are you presenting?"
```
Change from uppercase tracking label (`text-xs uppercase tracking-wider`) to a natural question format: `text-sm font-medium text-foreground-secondary`. Drop the uppercase treatment.

**District section label:**
```
Before: "District"
After:  "Which district are you visiting?"
```
Same styling change as products label.

**Empty catalog state (inside generate-playbook-sheet.tsx):**
```
Before: "No products available. Add products to your Solutions Library to generate playbooks."
After:  "You'll need products in your Solutions Library before generating a playbook."

Before button: "Go to Solutions Library"
After button:  "Add Products"
```

**Products error:**
```
Before: "Couldn't load products"
After:  "We couldn't load your products right now."
```

**Footer — incomplete state summaries:**
```
Before: "Select products and a district to continue"
After:  "Pick your products and district to get started"

Before: "Select at least one product to continue"
After:  "Choose at least one product"

Before: "Select a district to continue"
After:  "Now choose a district"
```

**Footer — complete state summary:**
Keep existing pattern: `"Generate a playbook for **[products]** at **[district]**"`
No change needed.

**Duplicate notice:**
```
Before: "A playbook already exists for [district] with [products]. Generating a new one will create a separate version."
After:  "You already have a playbook for [products] at [district]. You can generate a fresh one, but the existing playbook will remain as-is."
```

**Generate button:**
```
Before: "Generate Playbook"
After:  "Generate Playbook" (no change — already correct)

Before: "Generating..."
After:  "Generating your playbook..."
```

**Generation error:**
```
Before: "Playbook generation failed. Please try again."
After:  "Something went wrong generating your playbook. Try again — your selections are still here."
```

**Cancel button:**
No change. "Cancel" is correct.

### district-search-combobox.tsx

**Search placeholder:**
```
Before: "Search districts by name..."
After:  "Start typing a district name..."
```

**Search error:**
```
Before: "Search unavailable. Please try again."
After:  "District search isn't responding right now. Try again in a moment."
```

**No results:**
```
Before: "No districts found for "[query]""
After:  "No districts match "[query]" — try a shorter name or check the spelling."
```

**Min-characters hint:**
```
Before: "Type at least 2 characters to search"
After:  "Type at least 2 characters to search"
(No change — this is already clear and functional.)
```

### empty-playbooks-state.tsx

**CTA button:**
```
Before: "New Playbook"
After:  "Generate Playbook"
```

**Heading and description — no change needed.** "Build your first playbook" as a page-level heading is fine (this is the playbooks listing page, not the modal). The description already references "AI-powered sales playbook." If you want full verb consistency, change heading to "Generate your first playbook" but this is optional — page headings have more flexibility than action buttons.

---

## 2. Token Compliance Fixes

### generate-playbook-sheet.tsx

**Dialog max-width — replace arbitrary value:**
```
Before: className="max-w-[520px] ..."
After:  className="max-w-lg ..."
```
`max-w-lg` = 512px. Close enough to 520px and uses the Tailwind scale.

**Generate button height:**
```
Before: className="w-full h-12"
After:  className="w-full"
```
Use `size="lg"` prop on the Button component instead of overriding height. If the design system's `lg` size doesn't produce the right height, adjust the Button component's `lg` variant — don't override per-instance.

### product-selection-card.tsx

**Selected state left border — replace arbitrary width:**
```
Before: "border-l-[3px] border-l-brand-orange"
After:  "border-l-2 border-l-brand-orange"
```
`border-l-2` (2px) is the standard Tailwind border width. If 3px is intentionally thicker for emphasis, define this in the Tailwind config as a named border width. For MVP, 2px is fine.

**Selected state background — replace arbitrary opacity:**
```
Before: "bg-brand-orange/[0.04]"
After:  "bg-brand-orange/5"
```
Tailwind provides opacity steps at `/5` (0.05) which is the closest standard value to 0.04. Functionally identical, avoids arbitrary value syntax.

### district-resolved-card.tsx

**"Change" button — replace custom micro-padding:**
```
Before: className="text-xs text-foreground-secondary shrink-0 h-auto py-1 px-2"
After:  className="text-xs text-foreground-secondary shrink-0"
```
Use `size="sm"` on the Button and let the design system handle padding. If the default `sm` size feels too large in this context, that's a design system decision to address globally, not per-instance.

---

## 3. Spacing Consistency

Apply these spacing adjustments to create consistent visual rhythm throughout the modal.

### generate-playbook-sheet.tsx

**Dialog padding — make symmetric:**
```
Before: className="... p-0 gap-0"  (then manual px-6 pt-6 pb-4 on header)
After:  Keep p-0 gap-0 on DialogContent (this is correct for sectioned layout)
```

**Header padding — equalize:**
```
Before: className="px-6 pt-6 pb-4 shrink-0"
After:  className="px-6 pt-6 pb-2 shrink-0"
```
Reduce bottom padding to `pb-2` — the visible dialog description now provides visual separation. The content area below has its own top padding context from the section labels.

**Section gap between Products and District:**
```
Before: <div className="mt-8" /> (empty spacer div)
After:  Remove the spacer div. Instead, wrap each section in a div and apply consistent spacing:
```

Replace the current structure:
```tsx
{/* Section A: Products */}
<div>
  ...products content...
</div>

{/* Section gap */}
<div className="mt-8" />

{/* Section B: District */}
<div>
  ...district content...
</div>
```

With:
```tsx
<div className="space-y-8">
  {/* Section: Products */}
  <div>
    ...products content...
  </div>

  {/* Section: District */}
  <div>
    ...district content...
  </div>
</div>
```
This uses `space-y-8` (32px) as deliberate section spacing — same value, but structural rather than a floating spacer div. It also scales correctly if sections are conditionally shown/hidden.

**Product card list — increase gap for breathing room:**
```
Before: className="space-y-2" (8px between cards)
After:  className="space-y-3" (12px between cards)
```
Cards are interactive touch targets. 12px separation gives each card visual identity and a more comfortable tap/click target zone.

**Footer — tighten internal spacing:**
The footer currently uses `space-y-3` which is fine for its contents (summary text, alerts, buttons). No change needed, but verify the visual rhythm feels balanced after the other spacing changes.

### product-selection-card.tsx

**Internal padding — verify consistency:**
Current `px-4 py-3` is good. No change. The card has appropriate internal breathing room.

### district-resolved-card.tsx

**Internal padding — match product cards:**
Current `px-4 py-3` matches product cards. Good. No change.

### district-search-combobox.tsx

**Result item padding:**
Current `py-2.5` on CommandItem is slightly tight for touch targets. Consider `py-3` for consistency with card padding patterns. Optional — only if it feels cramped when viewed in context with the other changes.

---

## Verification Checklist

After applying all changes:

- [ ] Modal opens correctly from all three entry points (district view, product view, cold start)
- [ ] Pre-populated district shows resolved card with "Change" button
- [ ] Pre-populated products show as checked
- [ ] Cold start shows visible description text and question-framed section labels
- [ ] Empty catalog state shows updated language and "Add Products" button navigates to /solutions
- [ ] Product error state shows updated language with Retry button
- [ ] District search placeholder reads "Start typing a district name..."
- [ ] District search no-results shows actionable hint
- [ ] District search error shows updated language
- [ ] Incomplete state footer messages update progressively (products → district → both)
- [ ] Complete state footer shows bold product/district names
- [ ] Duplicate notice uses revised language (no "version" reference)
- [ ] Generate button says "Generate Playbook" (not "Build" or "Create")
- [ ] Loading state says "Generating your playbook..."
- [ ] Error state says "Something went wrong..." with reassurance
- [ ] Empty playbooks page CTA says "Generate Playbook"
- [ ] No arbitrary Tailwind values remain (`[520px]`, `[3px]`, `[0.04]`)
- [ ] Spacing feels consistent — sections breathe, cards have clear separation
- [ ] All existing accessibility attributes (aria-live, aria-label, role, focus management) remain intact
- [ ] No new imports, no new dependencies, no new API calls
