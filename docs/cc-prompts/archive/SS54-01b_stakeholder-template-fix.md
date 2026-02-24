# SS54-01b: Stakeholder Template Fix — Remove Role Glossary Pattern

**Session:** SS-54  
**Punch List Item:** PL-01 (Stakeholder Map — corrective follow-up)  
**Depends on:** SS54-01 (already applied — superintendent name interpolation is in place)  
**File:** `src/services/providers/mock/fixtures/playbook-content.ts`

---

## Problem

The rewritten generic stakeholder template (from SS54-01) still reads as a role directory with approach tips. A sales rep already knows what a Chief Academic Officer or School Board does. The section patronizes experienced reps and provides no district-specific value.

The three demo districts with district-specific content (LAUSD, Sacramento, Fresno) have **named fictional stakeholders with tailored approach guidance** — that's the quality bar. For districts without that level of detail, the generic template should NOT try to fake it with generic role descriptions.

## Design Intent

For districts where we only have CDE data (superintendent name, phone, website), the stakeholder section should:

1. Surface the superintendent name and any known contact info (phone, website from district profile)
2. Be honest that we don't have specific stakeholder intelligence for this district
3. Give the rep a concrete pre-meeting research framework — what to look for, where to find it
4. Provide the role-based engagement framework as a compact reference, not an expanded glossary

## Replacement Template

Replace the entire `stakeholder_map.template` value in `GENERIC_SECTION_TEMPLATES` with the following:

```typescript
stakeholder_map: {
    sectionLabel: 'Stakeholder Map',
    contentSource: 'constrained',
    template: `{{superintendentLine}} leads {{districtName}}. {{superintendentContact}}

**We don't yet have detailed stakeholder intelligence for {{districtName}}.** The contacts below will need to be identified through pre-meeting research. This section provides a framework for who to find and how to approach them once identified.

**Pre-Meeting Research Checklist:**
- Review {{districtName}}'s website for organizational directory and cabinet listings
- Pull the most recent LCAP document — it names priorities and often identifies responsible administrators
- Watch or read minutes from the last 2-3 board meetings — note who presents on curriculum, who asks about student outcomes, and which board members are most engaged on instructional materials
- Check for an active adoption timeline or RFP — the procurement office or board agendas will surface this
- Identify the EL program director by name — this role carries outsized influence in California districts and is often the gatekeeper for product evaluation

**Stakeholder Engagement Framework:**
Once you've identified the individuals at {{districtName}}, use this approach hierarchy:

- **Superintendent:** Do not request a direct meeting early. Study their public priorities and mirror that language in every touchpoint with their team. Your credibility with the superintendent is built indirectly — through alignment with their stated goals, not through a pitch.
- **Chief Academic Officer / Asst. Superintendent of Instruction:** Your highest-value first meeting. Ask for the evaluation rubric or adoption criteria before presenting. Tailor everything to their stated weights.
- **Curriculum Directors (Math/ELA):** Prepare for deep product walkthroughs. Ask what gaps exist in current materials — their frustrations are your positioning.
- **EL Program Director:** Schedule a dedicated EL-focused session, separate from general presentations. Show designated and integrated ELD support at the lesson level. A generic demo won't earn this stakeholder's endorsement.
- **Chief Business Officer:** Lead with total cost of ownership and per-pupil pricing. Ask about fiscal calendar and procurement thresholds before proposing timing.
- **School Board:** Do not present directly. Arm the administration with board-ready talking points. Attend a meeting first to identify champions and skeptics.
- **Site Principals:** Identify instructional leaders. A principal who champions {{productNames}} during a pilot becomes your strongest internal advocate.`,
  },
```

## New Placeholder: `{{superintendentContact}}`

Add a new placeholder to the `interpolateTemplate` function in **both** `mock-playbook-service.ts` and `playbooks.ts`.

The `superintendentContact` line should render district phone and website when available, or be empty when not.

### In `mock-playbook-service.ts`, update `interpolateTemplate`:

Add a new parameter `superintendentContact?: string` and handle the replacement:

```typescript
function interpolateTemplate(
  template: string,
  districtName: string,
  productNames: string[],
  superintendentName?: string,
  superintendentContact?: string
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
    .replace(/\{\{superintendentLine\}\}/g, superintendentLine)
    .replace(/\{\{superintendentContact\}\}/g, superintendentContact || '');
}
```

### Add a `resolveSuperintendentContact` helper (in both files, alongside `resolveSuperintendentName`):

```typescript
function resolveSuperintendentContact(districtId: string): string {
  const fixture = DISTRICT_FIXTURES.find((d) => d.district.id === districtId);
  if (!fixture) return '';
  const parts: string[] = [];
  if (fixture.district.phone) parts.push(`Phone: ${fixture.district.phone}`);
  if (fixture.district.website) parts.push(`Website: ${fixture.district.website}`);
  return parts.length > 0 ? parts.join(' · ') : '';
}
```

### Wire it through

Everywhere `interpolateTemplate` is called — in `resolveContent`, `simulateGeneration`, and in `playbooks.ts` `buildCompleteSections` — pass `resolveSuperintendentContact(districtId)` as the new parameter.

### Same pattern in `playbooks.ts`

Mirror the same changes: add `resolveSuperintendentContact`, update `interpolateTemplate` signature, pass through in `buildCompleteSections`.

## Do NOT Modify

- `DISTRICT_SPECIFIC_CONTENT` entries for LAUSD, Sacramento, Fresno — these have hand-written stakeholder maps with named fictional personnel and are already high quality
- `PlaybookContextCard` or playbook detail page — no UI changes in this prompt
- Any other section templates (district_story, key_themes, etc.) — only stakeholder_map is affected

## After Applying

**You must restart the dev server** (`Ctrl+C` then `npm run dev`). The seed playbooks are cached in a `globalThis` singleton that survives HMR. Only a full restart rebuilds them from the updated templates.

## Verification

- [ ] Long Beach playbook → Stakeholder Map tab shows: "**Superintendent Jill Baker** leads Long Beach Unified. Phone: (562) 997-8000 · Website: http://www.lbschools.net" (or whatever CDE data contains) followed by the research checklist and compact framework — NOT a role glossary
- [ ] San Diego playbook → same pattern with San Diego's superintendent name and contact info
- [ ] Oakland playbook → same pattern
- [ ] A district with no superintendent name in CDE data → shows "**Superintendent** leads [District Name]." with no blank or broken rendering
- [ ] A district with no phone/website → the contact line is empty (no orphaned "Phone:" or "Website:" labels)
- [ ] LAUSD, Sacramento, Fresno playbooks → UNCHANGED, still show their district-specific named stakeholder maps
- [ ] Dynamically generated playbook (via generate sheet) → uses new template with correct interpolation
