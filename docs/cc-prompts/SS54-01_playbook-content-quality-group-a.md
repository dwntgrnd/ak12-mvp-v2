# SS54-01: Playbook Content Quality — Group A (PL-01, PL-02) + Demo Button Fix

**Session:** SS-54  
**Punch List Items:** PL-01 (Stakeholder Map), PL-02 (PlaybookContextCard metrics), + prerequisite demo button fix  
**Surfaces:** Playbook detail page, PlaybookContextCard, mock playbook service, playbook content fixtures

---

## Context

The playbook detail page has three issues that collectively undermine demo quality:

1. **Ghost playbooks from broken demo button.** The "Demo: Generate" button on the playbook detail page hardcodes `districtId: 'dist-lausd-001'` — a fake ID that doesn't match any fixture UUID. The mock playbook service silently accepts it, `resolveDistrictName()` falls back to "California School District," and the district profile fetch returns nothing. This produces a playbook with an empty context card.

2. **PlaybookContextCard collapsed state is too sparse (PL-02).** The collapsed/header row shows only district name, product badges, enrollment count, and fit score. Key academic metrics (ELA proficiency, math proficiency, FRPM rate) are hidden behind the expand toggle. A sales rep glancing at the playbook header gets no academic context.

3. **Generic stakeholder template reads like a role glossary (PL-01).** The three demo districts with district-specific content (LAUSD, Sacramento, Fresno) have named fictional stakeholders with detailed approach guidance. The other three seed playbook districts (San Diego, Oakland, Long Beach) and any dynamically generated playbooks fall back to `GENERIC_SECTION_TEMPLATES.stakeholder_map`, which is a generic description of K-12 district roles — not actionable sales preparation.

---

## Task 1: Fix Demo Button + Add District Validation

### 1A: Fix `handleDemoGenerate` in playbook detail page

**File:** `src/app/(dashboard)/playbooks/[playbookId]/page.tsx`

Find the `handleDemoGenerate` callback. Change the hardcoded district ID from `'dist-lausd-001'` to LAUSD's real fixture UUID: `'b8cd9b23-4f2f-470d-b1e5-126e7ff2a928'`.

Before:
```typescript
body: JSON.stringify({
  districtId: 'dist-lausd-001',
  productIds: ['prod-001', 'prod-002'],
}),
```

After:
```typescript
body: JSON.stringify({
  districtId: 'b8cd9b23-4f2f-470d-b1e5-126e7ff2a928', // LAUSD real fixture ID
  productIds: ['prod-001', 'prod-002'],
}),
```

### 1B: Add district validation in mock playbook service

**File:** `src/services/providers/mock/mock-playbook-service.ts`

In the `generatePlaybook` method, add a validation check immediately after `await delay(300)` — before any other logic:

```typescript
// Validate districtId exists in fixtures
const districtFixture = DISTRICT_FIXTURES.find((d) => d.district.id === request.districtId);
if (!districtFixture) {
  throw { code: 'DISTRICT_NOT_FOUND', message: `District ${request.districtId} not found`, retryable: false };
}
```

Then use `districtFixture.district.name` directly instead of calling `resolveDistrictName()`:

```typescript
const districtName = districtFixture.district.name;
```

This ensures no playbook can be created for a district that doesn't exist in the fixture set.

### Verification — Task 1
- [ ] Click "Demo: Generate" on any playbook detail page → new playbook is created for "Los Angeles Unified" (not "California School District")
- [ ] New playbook's context card shows LAUSD district data (enrollment, proficiency, FRPM)
- [ ] Attempting to call the generate API with a fake districtId returns a 404 error

---

## Task 2: Surface Key Metrics in PlaybookContextCard Collapsed State (PL-02)

**File:** `src/components/shared/playbook-context-card.tsx`

### Current collapsed row layout:
```
[District Name] [Product Badge] [Product Badge]          [Enrollment] [Fit Score] [Chevron]
```

### Target collapsed row layout:
```
[District Name] [Product Badge] [Product Badge]    [Enrollment] · [Math %] · [ELA %]   [Fit Score] [Chevron]
```

### Changes

In the collapsed `CollapsibleTrigger` area, find the `hidden md:flex` div that currently shows enrollment and fit score. Add math and ELA proficiency inline with enrollment. Keep fit score as the rightmost element.

**Current code block** (inside CollapsibleTrigger):
```tsx
<div className="hidden md:flex items-center gap-4 text-sm text-foreground-secondary mr-2">
  {districtEnrollment != null && (
    <span>{formatNumber(districtEnrollment)} students</span>
  )}
  {fitScore != null && (
    <span className={cn(
      'font-medium',
      fitScore >= 7 ? 'text-success' : fitScore >= 4 ? 'text-warning' : 'text-destructive'
    )}>
      {fitScore}/10 fit
    </span>
  )}
</div>
```

**Replace with:**
```tsx
<div className="hidden md:flex items-center gap-3 text-sm text-foreground-secondary mr-2">
  {districtEnrollment != null && (
    <span>{formatNumber(districtEnrollment)} students</span>
  )}
  {mathProficiency != null && (
    <>
      <span className="text-foreground-tertiary">·</span>
      <span>Math {mathProficiency}%</span>
    </>
  )}
  {elaProficiency != null && (
    <>
      <span className="text-foreground-tertiary">·</span>
      <span>ELA {elaProficiency}%</span>
    </>
  )}
  {fitScore != null && (
    <span className={cn(
      'font-medium ml-1',
      fitScore >= 7 ? 'text-success' : fitScore >= 4 ? 'text-warning' : 'text-destructive'
    )}>
      {fitScore}/10 fit
    </span>
  )}
</div>
```

### Null field handling

The existing pattern already handles nulls correctly — each metric is wrapped in a null check and only renders when data exists. The dot separators are inside the conditional blocks, so they only appear when the preceding metric renders. No additional null handling needed.

### Verification — Task 2
- [ ] LAUSD playbook (seed): collapsed header shows enrollment, Math 32.8%, ELA 43.1%, and 8/10 fit
- [ ] Sacramento playbook (seed): collapsed header shows enrollment, math %, ELA %, and 9/10 fit
- [ ] Fresno playbook (seed): collapsed header shows enrollment, math %, ELA %, and 2/10 fit
- [ ] Districts with null proficiency values: those metrics are simply absent, no empty gaps or orphaned separators
- [ ] At narrow widths (below `md` breakpoint), metrics row remains hidden — no layout breakage

---

## Task 3: Rewrite Generic Stakeholder Template (PL-01)

**File:** `src/services/providers/mock/fixtures/playbook-content.ts`

### Problem
The current generic `stakeholder_map` template is a glossary of K-12 district roles. It describes what each role does, not how to approach them. For districts without district-specific content, this section provides no sales value.

### Approach
Rewrite the generic template to be **approach-focused** — each role gets tactical engagement guidance, not a job description. Use the `{{districtName}}` placeholder throughout. The template should read as actionable preparation, not organizational theory.

Additionally, the generic template should incorporate the superintendent's real name when available. Since the generic template uses simple string interpolation, add two new placeholders: `{{superintendentName}}` and `{{superintendentLine}}`.

### New placeholders to support

Add these to the `interpolateTemplate` function in **both** `playbook-content.ts` (the one in the `GENERIC_SECTION_TEMPLATES` export) and `mock-playbook-service.ts` (the one used during generation):

**File:** `src/services/providers/mock/mock-playbook-service.ts`

Update the `interpolateTemplate` function to accept an optional superintendent name:

```typescript
function interpolateTemplate(
  template: string,
  districtName: string,
  productNames: string[],
  superintendentName?: string
): string {
  const productNameStr = productNames.join(' and ');
  const productList = productNames
    .map((name) => {
      const product = MOCK_PRODUCTS.find((p) => p.name === name);
      if (!product) return `${name}: Aligns with district priorities in ${name}'s subject area.`;
      return `${name} (${product.subjectArea}, Grades ${product.gradeRange.gradeFrom}–${product.gradeRange.gradeTo}): ${product.description.split('.')[0]}. This aligns with the district's needs in ${product.subjectArea.toLowerCase()}.`;
    })
    .join('\n\n');

  const superintendentLine = superintendentName
    ? `**Superintendent ${superintendentName}**`
    : '**Superintendent**';

  return template
    .replace(/\{\{districtName\}\}/g, districtName)
    .replace(/\{\{productNames\}\}/g, productNameStr)
    .replace(/\{\{productList\}\}/g, productList)
    .replace(/\{\{superintendentLine\}\}/g, superintendentLine);
}
```

Update `resolveContent` and `buildCompleteSections` (in `playbooks.ts`) to pass the superintendent name through. Resolve it from `DISTRICT_FIXTURES`:

```typescript
function resolveSuperintendentName(districtId: string): string | undefined {
  const fixture = DISTRICT_FIXTURES.find((d) => d.district.id === districtId);
  if (!fixture) return undefined;
  const { superintendentFirstName, superintendentLastName } = fixture.district;
  if (superintendentFirstName && superintendentLastName) {
    return `${superintendentFirstName} ${superintendentLastName}`;
  }
  if (superintendentLastName) return superintendentLastName;
  return undefined;
}
```

Pass this through wherever `interpolateTemplate` is called — both in `mock-playbook-service.ts` (for dynamic generation) and in `playbooks.ts` `buildCompleteSections` (for seed playbooks using generic templates).

### Replacement template

Replace the `stakeholder_map.template` value in `GENERIC_SECTION_TEMPLATES` with:

```typescript
template: `Key decision-makers at {{districtName}} involved in curriculum adoption, with tactical approach guidance for each role.

{{superintendentLine}} — Sets district-wide strategic direction aligned with the LCAP and board priorities. *Approach:* You are unlikely to meet the superintendent early in the sales cycle. Instead, study their publicly stated priorities — recent board presentations, LCAP goals, community messages — and mirror that language in every touchpoint with their team. When your message echoes the superintendent's own framing, it gains credibility at every level below. Do not request a superintendent meeting until you have a champion at the cabinet level who can frame the introduction.

**Chief Academic Officer / Assistant Superintendent of Instruction** — The primary decision-maker for instructional materials at {{districtName}}. Manages the adoption committee and determines which products advance to piloting. *Approach:* This is your highest-value first meeting. Lead with evidence of impact in comparable districts and alignment with the district's stated evaluation criteria. Ask directly: "What is the evaluation committee weighting most heavily this cycle?" Tailor your presentation to those weights. If you can't get this meeting, the opportunity stalls.

**Curriculum Directors (Math / ELA)** — Technical evaluators who assess standards alignment, pedagogy, teacher usability, and differentiation support for {{productNames}}. *Approach:* Build these relationships early — curriculum directors are long-cycle contacts who influence multiple adoption rounds. Prepare for deep product walkthroughs, not executive summaries. Ask what gaps they see in current materials — their frustrations reveal your positioning. These conversations should feel like peer-to-peer instructional discussion, not a sales pitch.

**Director of English Learner Programs** — Evaluates every material through the EL lens. At {{districtName}}, this role carries significant influence given California's EL population requirements. *Approach:* Schedule a dedicated EL-focused session separate from general committee presentations. Show designated and integrated ELD support at the lesson level — not as a supplement. Be prepared for detailed questions about newcomer scaffolding, primary language resources, and reclassification pathway support. A generic demo will not earn this stakeholder's endorsement.

**Chief Business Officer / Procurement Lead** — Controls budget allocation and vendor contracts at {{districtName}}. *Approach:* Come prepared with total cost of ownership, per-pupil pricing, and multi-year licensing models before being asked. Ask about the fiscal calendar and procurement thresholds early — timing a proposal to align with budget cycles matters more than the pitch itself. Proactive pricing transparency builds trust faster than waiting for the RFP.

**School Board** — Final approval authority for major curriculum purchases. Board meetings are public and votes are on record. *Approach:* Attend a {{districtName}} board meeting before your sales conversation. Note which members ask about instructional materials, equity, or student outcomes. Do not present to the board directly — arm the administration with talking points and evidence they can use during the approval process. Teachers and principals who speak authentically about classroom impact during public comment are the most persuasive testimony a board hears.

**Site Principals** — Influence adoption through pilot participation and teacher feedback. *Approach:* Identify principals known for instructional leadership or innovation at {{districtName}}. A principal who champions {{productNames}} during a pilot becomes your strongest internal advocate. Invest in these relationships during the evaluation period — their voice carries weight with the adoption committee and the board.`,
```

### Important: Do NOT modify district-specific content

The `DISTRICT_SPECIFIC_CONTENT` entries for LAUSD (`b8cd9b23-...`), Sacramento (`7f4e8dd1-...`), and Fresno (`75c04266-...`) already have rich stakeholder maps with fictional named personnel. Do not touch those. This change only affects the generic fallback template used by San Diego, Oakland, Long Beach, and any dynamically generated playbooks.

### Verification — Task 3
- [ ] LAUSD playbook stakeholder tab: unchanged — still shows Alberto Carvalho and other named fictional stakeholders
- [ ] Sacramento playbook stakeholder tab: unchanged — still shows Dr. Maria Sandoval and other named fictional stakeholders  
- [ ] Fresno playbook stakeholder tab: unchanged — still shows Superintendent Misty Her and other named fictional stakeholders
- [ ] Long Beach playbook stakeholder tab: now shows "**Superintendent [Real Name]**" (from CDE fixture data) with approach guidance, followed by actionable role-based guidance for other positions
- [ ] San Diego playbook stakeholder tab: same pattern — real superintendent name if available, tactical approach guidance throughout
- [ ] Oakland playbook stakeholder tab: same pattern
- [ ] Dynamically generated playbook for a district with superintendent name: superintendent line shows the real name
- [ ] Dynamically generated playbook for a district WITHOUT superintendent name: superintendent line shows generic "**Superintendent**" — no blank or broken rendering
- [ ] Generic template references `{{districtName}}` and `{{productNames}}` — confirm interpolation works correctly in rendered content (no raw placeholders visible)

---

## Execution Order

1. **Task 1** first — fixes the demo button and adds validation. This prevents creating new broken playbooks and is a prerequisite for clean testing.
2. **Task 2** second — context card collapsed state. Quick, isolated UI change.
3. **Task 3** third — stakeholder template rewrite. Largest change but isolated to fixture/template files.

After each task, run the corresponding verification checklist before proceeding to the next.

---

## Files Modified

| File | Change |
|------|--------|
| `src/app/(dashboard)/playbooks/[playbookId]/page.tsx` | Fix demo button districtId |
| `src/services/providers/mock/mock-playbook-service.ts` | Add district validation, update interpolateTemplate signature |
| `src/components/shared/playbook-context-card.tsx` | Surface math/ELA in collapsed header |
| `src/services/providers/mock/fixtures/playbook-content.ts` | Rewrite generic stakeholder template, add `{{superintendentLine}}` placeholder |
| `src/services/providers/mock/fixtures/playbooks.ts` | Pass superintendent name through `buildCompleteSections` |

## Files NOT Modified

| File | Reason |
|------|--------|
| District-specific content in `playbook-content.ts` (LAUSD, Sacramento, Fresno blocks) | Already have rich named stakeholder content |
| `generate-playbook-sheet.tsx` | District selection already validates against fixture set |
| District fixture data (`districts.ts`) | Real CDE data, no changes needed |
