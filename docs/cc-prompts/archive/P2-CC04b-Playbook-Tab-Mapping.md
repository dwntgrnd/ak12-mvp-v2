# P2-CC04b: Playbook Tab Mapping

**Purpose:** Align playbook section types, tab config, templates, and fixture content to P2-Spec-01 §4.2  
**Depends on:** CC04a (district tab mapping)  
**Spec reference:** `Specs/P2-Spec-01_Unified-View-Architecture.md` §4.2  
**Session:** P2-S06

---

## Context

The playbook tabs still use the P1 section type system (6 types: district_story, key_themes, product_alignment, stakeholder_map, objection_handling, conversation_playbook). The P2 spec defines a different set of 6 tabs with different content focus. This prompt updates the type system, section ordering, generic templates, per-district fixture content, and the playbook detail page tab config.

**P1 → P2 section type mapping:**

| P2 Tab (Spec §4.2) | New `PlaybookSectionType` | Disposition of P1 Type |
|---|---|---|
| Key Themes | `key_themes` | **Keep** — same type, same role |
| Stakeholder Talking Points | `stakeholder_talking_points` | **Rename** from `stakeholder_map` — reframe from map to actionable talking points |
| Product Fit / Data | `product_fit_data` | **Rename** from `product_alignment` — reframe to evidence-backed fit |
| Handling Objections | `handling_objections` | **Rename** from `objection_handling` — minor label normalization |
| Competition | `competition` | **New** — competitive landscape moved from district tab to playbook context |
| News | `news` | **New** — stub placeholder, same pattern as district news tab |

**Removed P1 types:**
- `district_story` — district context now lives in the persistent data strip and district intelligence tabs. Redundant in playbook.
- `conversation_playbook` — tactical prep content (opening, proof points, discovery questions, next steps). This content is valuable but is redistributed: key proof points fold into `key_themes`, discovery questions and tactical approach fold into `stakeholder_talking_points`. The remaining tactical "opening line" and "next step" suggestions are lightweight enough to incorporate into key_themes or handled by a future playbook summary header.

---

## Deliverables

### 1. Update `PlaybookSectionType` union

**File:** `src/services/types/playbook.ts`

Replace:

```typescript
export type PlaybookSectionType =
  | 'district_story'
  | 'key_themes'
  | 'product_alignment'
  | 'stakeholder_map'
  | 'objection_handling'
  | 'conversation_playbook';
```

With:

```typescript
export type PlaybookSectionType =
  | 'key_themes'
  | 'stakeholder_talking_points'
  | 'product_fit_data'
  | 'handling_objections'
  | 'competition'
  | 'news';
```

### 2. Update `SECTION_ORDER` and `GENERIC_SECTION_TEMPLATES`

**File:** `src/services/providers/mock/fixtures/playbook-content.ts`

**2a. Replace SECTION_ORDER:**

```typescript
export const SECTION_ORDER: PlaybookSectionType[] = [
  'key_themes',
  'stakeholder_talking_points',
  'product_fit_data',
  'handling_objections',
  'competition',
  'news',
];
```

**2b. Replace GENERIC_SECTION_TEMPLATES** — full replacement of all 6 entries:

```typescript
export const GENERIC_SECTION_TEMPLATES: Record<PlaybookSectionType, {
  sectionLabel: string;
  contentSource: ContentSource;
  template: string;
}> = {
  key_themes: {
    sectionLabel: 'Key Themes',
    contentSource: 'constrained',
    template: `Three themes connect directly to how {{productNames}} should be positioned at {{districtName}}.

**Post-pandemic academic recovery remains the dominant instructional priority.** Most California districts remain below pre-pandemic baselines, particularly in mathematics. Districts evaluating new materials prioritize programs with embedded assessment, differentiation support, and documented evidence of impact. If {{districtName}} follows this pattern, anchor {{productNames}} in specific proficiency data from the district's own trends — not generic product capabilities.

**Equity criteria shape every procurement decision.** California's instructional frameworks emphasize conceptual understanding and access for all learners. Districts require that materials demonstrate robust support for English Learners, students with disabilities, and culturally responsive content. {{districtName}}'s demographic profile determines which equity dimensions carry the most weight — lead with the ones most relevant to their student population.

**Technology consolidation favors integrated platforms.** Districts prefer programs that work within existing ecosystems rather than adding standalone tools. Position {{productNames}} as reducing platform count and teacher cognitive load — fewer tools, built-in assessment and practice, less fragmentation.`,
  },

  stakeholder_talking_points: {
    sectionLabel: 'Stakeholder Talking Points',
    contentSource: 'constrained',
    template: `{{superintendentLine}} leads {{districtName}}. {{superintendentContact}}

**Detailed stakeholder intelligence for {{districtName}} is not yet available.** The framework below provides role-based talking points to use once you have identified key contacts through pre-meeting research.

**Pre-Meeting Research:**
Review {{districtName}}'s website for organizational directory and cabinet listings. Pull the most recent LCAP document — it names priorities and often identifies responsible administrators. Watch or read minutes from the last 2-3 board meetings.

**By Role:**

- **Superintendent:** Mirror their public priorities. Your credibility is built indirectly — through alignment with stated goals, not through a pitch. Do not request a direct meeting early.
- **Chief Academic Officer / Asst. Superintendent of Instruction:** Your highest-value first meeting. Ask for evaluation criteria before presenting. Tailor everything to their stated weights.
- **Curriculum Directors (Math/ELA):** Prepare for deep product walkthroughs. Ask what gaps exist in current materials — their frustrations are your positioning for {{productNames}}.
- **EL Program Director:** Schedule a dedicated EL-focused session, separate from general presentations. Show designated and integrated ELD support at the lesson level.
- **Chief Business Officer:** Lead with total cost of ownership and per-pupil pricing. Ask about fiscal calendar and procurement thresholds.
- **School Board:** Do not present directly. Arm the administration with board-ready talking points. Attend a meeting first to identify champions and skeptics.
- **Site Principals:** Identify instructional leaders who can champion {{productNames}} during a pilot.`,
  },

  product_fit_data: {
    sectionLabel: 'Product Fit / Data',
    contentSource: 'synthesis',
    template: `{{productNames}} maps to {{districtName}}'s likely needs based on available district data and current California education trends.

{{productList}}

**Evidence Anchor:** Lead with the product that addresses the district's most urgent documented need — typically mathematics if proficiency data shows significant gaps, or ELA if the district has signaled active interest in literacy. Anchor every talking point in specific data from the district's own performance trends, not general product capabilities.

The pattern that works: "Your data shows X → districts with similar profiles have seen Y → here's how {{productNames}} connects those dots."

**Procurement Posture:** Determine the district's position before the meeting: active adoption window, mid-cycle, or approaching end-of-contract. This changes the entire conversation. Active adoption means compete on evaluation criteria; mid-cycle means build relationships and position for the next window.`,
  },

  handling_objections: {
    sectionLabel: 'Handling Objections',
    contentSource: 'synthesis',
    template: `Anticipated objections for {{productNames}} at {{districtName}}, with response frameworks.

**"We're already using a program in this subject area."**
Acknowledge the investment, then pivot: "I'm not asking you to replace what's working. I'd like to understand what your team would want in the next adoption cycle — and make sure {{productNames}} is on your radar when that window opens." Ask about satisfaction levels and unmet teacher needs.

**"Our budget is committed for this year."**
Validate, then reframe the timeline: "That makes sense. A no-cost pilot this year positions you to evaluate with real classroom data before the next budget cycle." Ask about LCAP funding, Title I allocations, or one-time state grants that could support a focused evaluation.

**"Implementation and professional development are too disruptive."**
Reframe from disruption to consolidation: "{{productNames}} is built to reduce the tool count, not add to it — embedded assessment, built-in scaffolding, and ready-to-use lessons mean less platform-switching for teachers." Reference successful implementations at similar-sized California districts.

**"How does this support our English Learners and students with disabilities?"**
This is an opportunity, not an objection. Lead with specifics: designated and integrated ELD support built into {{productNames}} at the lesson level, accessibility features, and scaffolding for diverse learners. Offer a focused demo for the EL coordinator and Special Education director.`,
  },

  competition: {
    sectionLabel: 'Competition',
    contentSource: 'synthesis',
    template: `**Competitive intelligence for {{districtName}} is limited.** The landscape below is based on general California market patterns. Update with district-specific intelligence from LCAP documents, board minutes, and stakeholder conversations.

**Common Competitors in California K-12:**
- **Mathematics:** McGraw-Hill (Reveal Math, Into Math), Amplify (Desmos), Curriculum Associates (i-Ready), Great Minds (Eureka Math)
- **ELA:** Amplify (CKLA, Amplify ELA), HMH (Into Reading, Into Literature), McGraw-Hill (Wonders, StudySync)

**Differentiation Framework for {{productNames}}:**
- Against programs lacking integrated adaptive practice: emphasize built-in differentiation without requiring a separate platform
- Against programs with limited EL support: emphasize native language integration at the lesson level, not bolted-on translation
- Against programs with strong brand recognition but aging content: emphasize alignment with California's current frameworks and standards refresh

**Intelligence to Gather:**
Before the meeting, determine which programs {{districtName}} currently uses, when contracts expire, and where teacher satisfaction is lowest. LCAP documents often reference vendor names in funded actions. Board meeting minutes surface adoption discussions. This intelligence transforms a generic competitive pitch into a targeted displacement strategy.`,
  },

  news: {
    sectionLabel: 'News',
    contentSource: 'constrained',
    template: `Product-relevant news and recent developments for {{districtName}} will appear here when data sources are connected.

This section will surface recent coverage, board decisions, and community developments that are relevant to {{productNames}} positioning at {{districtName}}.`,
  },
};
```

### 3. Update `DISTRICT_SPECIFIC_CONTENT`

**File:** `src/services/providers/mock/fixtures/playbook-content.ts`

Replace all three district entries. Each district now has 6 sections matching the new P2 types. The `district_story` and `conversation_playbook` content is removed. `competition` and `news` are new.

**Content migration strategy per district:**
- `key_themes` — carry forward from P1 (content is still valid)
- `stakeholder_talking_points` — carry forward from P1 `stakeholder_map` (content is still valid, rename sectionLabel)
- `product_fit_data` — carry forward from P1 `product_alignment` (content is still valid, rename sectionLabel)
- `handling_objections` — carry forward from P1 `objection_handling` (content is still valid, rename sectionLabel)
- `competition` — **new content** synthesized from the P1 competitive intel data and the removed district_story competitive mentions
- `news` — stub content, same pattern as generic template

#### 3a. Los Angeles Unified (`b8cd9b23-4f2f-470d-b1e5-126e7ff2a928`)

Replace the entire district entry. Keep the existing content for carried-forward sections (key_themes, stakeholder → stakeholder_talking_points, product_alignment → product_fit_data, objection_handling → handling_objections). For `competition`, write new content:

```typescript
competition: {
  sectionLabel: 'Competition',
  contentSource: 'synthesis',
  content: `LAUSD's scale makes it a target for every major publisher. Multiple vendors are actively pursuing math and ELA adoption opportunities across the district's regional structure.

**Known Competitive Landscape:**
LAUSD's size means the district sometimes maintains different adopted programs across its local districts, creating a fragmented competitive picture. The district has historically worked with major publishers including HMH, McGraw-Hill, and Amplify across different subject areas and grade bands.

**Mathematics Competition:**
- **McGraw-Hill (Reveal Math / Into Math):** Strong presence in California urban districts. Likely incumbent or active competitor. Differentiate EnvisionMath on: Visual Learning Bridge for conceptual understanding (every lesson, not select lessons), integrated adaptive practice without separate license, and native Spanish language support built into lessons rather than translated supplements.
- **Curriculum Associates (i-Ready):** Widely used as a diagnostic/intervention platform. Position EnvisionMath as a consolidation play — core instruction + adaptive practice + formative assessment in one platform vs. separate core + i-Ready licenses.
- **Great Minds (Eureka Math):** Strong conceptual math reputation but limited digital/adaptive capabilities. Differentiate on technology integration, adaptive practice, and teacher usability.

**ELA Competition:**
- **Amplify (CKLA, Amplify ELA):** Growing presence in California. Strong in knowledge-building literacy. Differentiate myPerspectives on: culturally diverse text anthology (purpose-built, not retrofitted), integrated SEL, and student voice/choice architecture.
- **HMH (Into Reading / Into Literature):** Legacy presence in LAUSD. Differentiate myPerspectives on: contemporary, diverse text selections and the writing workshop model.

**Strategic Advantage:**
The combined EnvisionMath + myPerspectives offering positions Savvas as a comprehensive K-12 partner rather than a single-product vendor. At LAUSD's scale, procurement simplification has real value — one vendor relationship, one PD partnership, one implementation support team across math and ELA.

**Intelligence to Gather:**
Identify which programs are currently adopted in each of LAUSD's local districts. Determine contract expiration timelines by region. Ask curriculum directors about satisfaction with current materials — their frustrations reveal your competitive opening.`,
},

news: {
  sectionLabel: 'News',
  contentSource: 'constrained',
  content: `Product-relevant news and recent developments for Los Angeles Unified will appear here when data sources are connected.

This section will surface recent board decisions, community developments, and coverage relevant to EnvisionMath and myPerspectives positioning at LAUSD.`,
},
```

For the carried-forward sections, update only the keys and `sectionLabel` values:
- `stakeholder_map` → key becomes `stakeholder_talking_points`, sectionLabel becomes `'Stakeholder Talking Points'`
- `product_alignment` → key becomes `product_fit_data`, sectionLabel becomes `'Product Fit / Data'`
- `objection_handling` → key becomes `handling_objections`, sectionLabel becomes `'Handling Objections'`
- `key_themes` — unchanged
- Remove `district_story` and `conversation_playbook` entries entirely

#### 3b. Sacramento City Unified (`7f4e8dd1-9f32-4d87-92f3-3009800b88b0`)

Same pattern. Carry forward content with key/label renames. New `competition` content:

```typescript
competition: {
  sectionLabel: 'Competition',
  contentSource: 'synthesis',
  content: `Sacramento City Unified is in an active adoption cycle, meaning this is a live competitive evaluation. Identifying and differentiating against specific competitors is critical.

**Active Evaluation Context:**
SCUSD's curriculum council has initiated formal evaluation for both math and ELA materials. Multiple publishers are presenting to the adoption committee. The evaluation rubric likely weights equity, EL support, evidence of impact, and California framework alignment heavily.

**Likely Competitors — Mathematics:**
- **McGraw-Hill (Reveal Math):** Strong California presence. Differentiate EnvisionMath on: Visual Learning Bridge in every lesson (conceptual understanding is core, not supplemental), integrated adaptive practice engine, and native Spanish language support at the lesson level.
- **Amplify (Desmos Math):** Growing reputation for engagement. Differentiate on: comprehensive K-8 scope (Desmos strength is secondary), print+digital flexibility, and deeper formative assessment integration.
- **Great Minds (Eureka Math/Squared):** Respected for rigor. Differentiate on: adaptive technology, digital-first design, and teacher usability — Eureka's implementation burden is a known concern.

**Likely Competitors — ELA:**
- **Amplify (CKLA / Amplify ELA):** Knowledge-building literacy approach. Differentiate myPerspectives on: the most diverse text anthology in secondary ELA (purpose-built), integrated SEL, and student choice architecture.
- **HMH (Into Reading / Into Literature):** Legacy publisher with strong California history. Differentiate on: contemporary content, culturally responsive design, and performance-based assessments vs. traditional comprehension focus.

**Winning the Evaluation:**
- Request the evaluation rubric from Dr. Sandoval's office before presenting. Structure the entire presentation around their criteria, not your feature set.
- Prepare head-to-head differentiation sheets for the 2-3 most likely competitors. The committee will be comparing side by side.
- Secure teacher pilot slots in representative classrooms — teacher feedback during pilot is likely the highest-weighted input in the committee's decision.
- Leverage the combined K-12 offering as a strategic differentiator: one vendor relationship simplifies procurement for a district adopting both math and ELA simultaneously.`,
},

news: {
  sectionLabel: 'News',
  contentSource: 'constrained',
  content: `Product-relevant news and recent developments for Sacramento City Unified will appear here when data sources are connected.

This section will surface recent board decisions, adoption timeline updates, and coverage relevant to EnvisionMath and myPerspectives positioning at SCUSD.`,
},
```

#### 3c. Fresno Unified (`75c04266-c622-4294-aa22-046245c95e51`)

Same pattern. New `competition` content:

```typescript
competition: {
  sectionLabel: 'Competition',
  contentSource: 'synthesis',
  content: `Fresno Unified recently completed a competitive math adoption and selected a competing program. Understanding the competitive landscape here is about long-term positioning, not near-term displacement.

**Current Adopted Program:**
Fresno selected a competing K-8 mathematics program in 2024 under a multi-year contract. The district invested in teacher training, materials distribution, and implementation support. The program is in its first full year of use.

**Why This Matters:**
- The adoption committee, teachers, and administrators are invested in making the current program succeed.
- Any attempt to position EnvisionMath as a near-term alternative will be perceived as disrespectful of the district's decision-making process.
- The current contract likely runs 5-7 years, creating an adoption window around 2029-2031.

**Long-Term Competitive Strategy:**
- **Monitor performance:** Fresno's math proficiency baseline is 25.1%. If the adopted program doesn't produce measurable improvement over 2-3 years, dissatisfaction will build. Being a known, trusted presence before that moment is the strategic goal.
- **Identify gaps:** Even strong core programs often have supplemental needs — intervention pathways, EL-specific math resources, or assessment tools that complement the core. These non-competitive offerings can maintain presence in the district.
- **Build peer intelligence:** Connect with curriculum coordinators at conferences and PD events. Over time, they become informants about how the current program is performing and what the district will prioritize in the next cycle.

**ELA Opportunity:**
The recent adoption was mathematics-only. Determine whether Fresno has an active or upcoming ELA adoption cycle — myPerspectives could be positioned independently of the math situation. This requires separate stakeholder conversations with the ELA curriculum team.

**Competitive Intelligence to Gather:**
- Which specific program was adopted (publisher, product name, grade range)
- Contract length and renewal terms (public record via board minutes)
- Teacher satisfaction after first year of implementation
- Whether supplemental or intervention needs exist that the core program doesn't address`,
},

news: {
  sectionLabel: 'News',
  contentSource: 'constrained',
  content: `Product-relevant news and recent developments for Fresno Unified will appear here when data sources are connected.

This section will surface implementation progress, board discussions, and community developments relevant to long-term positioning at Fresno Unified.`,
},
```

### 4. Update playbook detail page TAB_CONFIG

**File:** `src/app/(dashboard)/districts/[districtId]/playbooks/[playbookId]/page.tsx`

Replace:

```typescript
const TAB_CONFIG = [
  { sectionType: 'district_story', label: 'District Story' },
  { sectionType: 'key_themes', label: 'Key Themes' },
  { sectionType: 'product_alignment', label: 'Product Alignment' },
  { sectionType: 'stakeholder_map', label: 'Stakeholder Map' },
  { sectionType: 'objection_handling', label: 'Objection Handling' },
  { sectionType: 'conversation_playbook', label: 'Conversation Playbook' },
] as const;
```

With:

```typescript
const TAB_CONFIG = [
  { sectionType: 'key_themes', label: 'Key Themes' },
  { sectionType: 'stakeholder_talking_points', label: 'Stakeholder Talking Points' },
  { sectionType: 'product_fit_data', label: 'Product Fit / Data' },
  { sectionType: 'handling_objections', label: 'Handling Objections' },
  { sectionType: 'competition', label: 'Competition' },
  { sectionType: 'news', label: 'News' },
] as const;
```

Also update the `activeTab` initial state to match:

```typescript
const [activeTab, setActiveTab] = useState<string>(TAB_CONFIG[0].sectionType);
```

This already references `TAB_CONFIG[0]`, so it will automatically pick up `'key_themes'` — no change needed if the code already uses `TAB_CONFIG[0].sectionType`.

### 5. Update seed playbooks fixture

**File:** `src/services/providers/mock/fixtures/playbooks.ts`

The `buildCompleteSections` function in this file already uses `SECTION_ORDER` and `DISTRICT_SPECIFIC_CONTENT` / `GENERIC_SECTION_TEMPLATES`. Since we're updating all three sources, the seed playbooks will automatically generate with the new section types and content.

**Verify:** After changes, confirm that `buildCompleteSections` still works correctly — it iterates `SECTION_ORDER`, looks up `DISTRICT_SPECIFIC_CONTENT[districtId]?.[sectionType]`, falls back to `GENERIC_SECTION_TEMPLATES[sectionType]`. The shape is identical, only the keys changed.

### 6. Verify mock playbook service cascades correctly

**File:** `src/services/providers/mock/mock-playbook-service.ts`

This file imports `SECTION_ORDER`, `GENERIC_SECTION_TEMPLATES`, and `DISTRICT_SPECIFIC_CONTENT`. Since it uses these by reference (iterating `SECTION_ORDER`, indexing into templates/content by `sectionType`), the changes should cascade automatically.

**Verify:** The `simulateGeneration` function iterates `SECTION_ORDER` and calls `resolveContent` which indexes `DISTRICT_SPECIFIC_CONTENT` and `GENERIC_SECTION_TEMPLATES` by `sectionType`. With updated keys, this should work without code changes.

**One potential issue:** The `resolveContent` function parameter type is `typeof SECTION_ORDER[number]`. Since `SECTION_ORDER` is now typed with the new `PlaybookSectionType` values, this should resolve correctly. Verify no TS errors.

---

## Files Modified

| File | Change |
|---|---|
| `src/services/types/playbook.ts` | Replace `PlaybookSectionType` union (6 old → 6 new values) |
| `src/services/providers/mock/fixtures/playbook-content.ts` | Replace `SECTION_ORDER`, `GENERIC_SECTION_TEMPLATES`, and all `DISTRICT_SPECIFIC_CONTENT` entries |
| `src/app/(dashboard)/districts/[districtId]/playbooks/[playbookId]/page.tsx` | Replace `TAB_CONFIG` |

## Files Verified (no code changes expected)

| File | Verification |
|---|---|
| `src/services/providers/mock/fixtures/playbooks.ts` | Confirm `buildCompleteSections` cascades correctly with new types |
| `src/services/providers/mock/mock-playbook-service.ts` | Confirm `simulateGeneration` and `resolveContent` cascade correctly |
| `src/services/interfaces/playbook-service.ts` | Confirm interface references `PlaybookSectionType` — should cascade |

---

## Verification

### District-specific playbooks (seed data)

1. Navigate to LAUSD playbook: Go to `/districts/b8cd9b23-4f2f-470d-b1e5-126e7ff2a928`, click a playbook in the mode bar
2. Confirm 6 tabs: **Key Themes**, **Stakeholder Talking Points**, **Product Fit / Data**, **Handling Objections**, **Competition**, **News**
3. Confirm Key Themes content renders (carried forward from P1)
4. Confirm Stakeholder Talking Points content renders (carried forward, relabeled)
5. Confirm Product Fit / Data content renders (carried forward, relabeled)
6. Confirm Handling Objections content renders (carried forward, relabeled)
7. Confirm Competition tab renders new competitive landscape content
8. Confirm News tab renders stub content
9. Repeat spot-check for Sacramento City Unified playbook

### Newly generated playbooks (generic templates)

10. Go to any district, trigger playbook generation via the GeneratePlaybookSheet
11. Wait for generation to complete (polling)
12. Confirm all 6 tabs appear with generic template content
13. Confirm no "District Story" or "Conversation Playbook" tabs appear

### Type safety

14. Run `npx tsc --noEmit` — confirm zero errors
15. Search codebase for any remaining references to removed types: `district_story`, `conversation_playbook`, `product_alignment`, `stakeholder_map`, `objection_handling` (the string literals, not general prose)

### No regressions

16. Confirm playbook section editing still works (click into a section, edit, save)
17. Confirm section regeneration still works (regenerate button on a section)
18. Confirm playbook deletion still works
19. Confirm playbook list page (`/playbooks`) still renders correctly
20. No console errors in browser

---

## Acceptance Criteria

- [ ] `PlaybookSectionType` union contains exactly: `key_themes`, `stakeholder_talking_points`, `product_fit_data`, `handling_objections`, `competition`, `news`
- [ ] Playbook detail page shows 6 tabs matching spec §4.2 in correct order
- [ ] No references to removed P1 section types (`district_story`, `conversation_playbook`) remain in active code paths
- [ ] Renamed section types (`product_alignment` → `product_fit_data`, `stakeholder_map` → `stakeholder_talking_points`, `objection_handling` → `handling_objections`) have no remaining references in active code paths
- [ ] All 3 district-specific fixture entries updated with new keys, labels, and competition/news content
- [ ] Generic templates updated for all 6 new section types
- [ ] Seed playbooks build correctly with new section types
- [ ] New playbook generation produces correct section types
- [ ] Section editing and regeneration still functional
- [ ] Zero TypeScript compilation errors
- [ ] Zero runtime console errors
