# P2-CC07: District Intelligence Expansion — Tier 3 Coverage for All 50 Districts

**Session:** P2-S08
**Depends on:** Existing district-intelligence.ts fixtures, districts.ts (50 CDE districts)
**Risk:** Low — additive fixture data only. No component changes. No service contract changes.
**Model recommendation:** Use Sonnet for subagent Tasks. This is structured data generation, not architectural reasoning.

---

## Objective

Expand district intelligence fixtures from 8 districts (4 Tier 1, 4 Tier 2) to all 50 districts. The remaining 42 districts get Tier 3 (light) intelligence: `goalsBrief`, `academicBrief`, one LCAP goal with 1-2 actions, and a `prioritySummary`. No contacts, no competitive landscape, no detailed academic breakdowns. The goal is demo fluidity — every district in the app has *something* when you click into it, eliminating dead-end empty states.

**Do not modify any existing Tier 1 or Tier 2 entries.** This is purely additive.

---

## 1. Architecture: Batched Subagent Loop

This task generates ~42 district intelligence entries. Do NOT attempt to generate all entries in a single pass — context quality degrades. Instead:

### Orchestrator responsibilities:
1. Read `src/services/providers/mock/fixtures/districts.ts` — extract all 50 district UUIDs, names, and multi-year academic data
2. Read `src/services/providers/mock/fixtures/district-intelligence.ts` — identify which districts already have entries (skip them)
3. Build a gap list of districts needing Tier 3 entries
4. Chunk the gap list into batches of **5-6 districts**
5. For each batch, spawn a **Task** (subagent) with:
   - The batch's district data (UUID, name, county, docType, enrollment, ELL%, FRPM%, math/ELA proficiency, chronic absenteeism, year-over-year trends)
   - The Tier 3 template (§2 below)
   - The derivation rules (§3 below)
   - One complete Tier 2 example (Long Beach) as structural reference
6. Collect each batch's output and append to `district-intelligence.ts`
7. After all batches: update UUID_TO_SEED_ID mapping, run `npx tsc --noEmit` to verify types
8. Final verification: confirm `getDistrictIntelligence(uuid)` returns non-null for all 50 districts

### Subagent Task prompt pattern:
```
Generate Tier 3 district intelligence entries for the following districts.
Use the template structure, derivation rules, and reference example provided.
Return valid TypeScript that can be appended to the INTELLIGENCE_MAP.

[batch district data]
[template]
[derivation rules]
[Long Beach reference example]
```

---

## 2. Tier 3 Template

Each Tier 3 district entry must include exactly these fields:

```typescript
INTELLIGENCE_MAP['dist-{slug}-001'] = {
  districtId: 'dist-{slug}-001',
  lastUpdated: '2025-11-15T00:00:00Z',

  // REQUIRED: Goals & Funding brief
  goalsBrief: {
    leadInsight: string,   // 2-3 sentences. What are this district's priorities?
    keySignals: [          // 2-3 signals
      { label: string, value: string, detail?: string },
    ],
  },

  // REQUIRED: One LCAP goal with 1-2 actions
  goals: [
    {
      goalId: '{slug}-goal-1',
      goalNumber: 'Goal 1',
      title: string,
      description: string,
      goalType: 'Broad',
      academicYear: '2024-25',
      sourceId: 'src-{slug}-lcap',
      actions: [
        {
          actionId: '{slug}-act-1-1',
          actionNumber: 'Action 1.1',
          title: string,
          description: string,
          totalFunds: string,        // dollar amount as string
          fundingSource: string,     // realistic CA funding source
          status: 'in_progress' | 'planned',
          sourceId: 'src-{slug}-lcap',
        },
        // Optional second action if derivation rules indicate it
      ],
    },
  ],

  // REQUIRED: Academic brief
  academicBrief: {
    leadInsight: string,   // 2-3 sentences about academic trends
    keySignals: [          // 2-3 signals
      { label: string, value: string, detail?: string },
    ],
  },

  // REQUIRED: Priority summary
  prioritySummary: string,  // 2-3 sentence executive summary

  // REQUIRED: Sources
  sources: [
    {
      sourceId: 'src-{slug}-lcap',
      sourceType: 'lcap' as const,
      name: '2024-25 LCAP',
      academicYear: '2024-25',
      retrievedAt: '2025-11-10T00:00:00Z',
    },
    {
      sourceId: 'src-{slug}-cde',
      sourceType: 'state_database' as const,
      name: 'CDE DataQuest 2023-24',
      academicYear: '2023-24',
      retrievedAt: '2025-10-01T00:00:00Z',
    },
  ],
};
```

### Slug naming convention:
Derive a short, unique slug from the district name:
- "Elk Grove Unified" → `elk`
- "Corona-Norco Unified" → `cnorco`
- "San Juan Unified" → `sjuan`
- "San Bernardino City Unified" → `sbern`
- "Capistrano Unified" → `cap`
- "Kern High" → `kern`
- "Stockton Unified" → `stock`
- "Sweetwater Union High" → `sweet`
- "Mt. Diablo Unified" → `mtd`
- "Visalia Unified" → `vis`
- "San Jose Unified" → `sj`
- "Madera Unified" → `mad`
- "Fairfield-Suisun Unified" → `fair`
- "Pajaro Valley Unified" → `paj`
- "Oxnard Union High" → `oxnard`
- "Santa Maria-Bonita" → `smb`
- "Napa Valley Unified" → `napa`
- "Salinas Union High" → `salinas`
- "Modesto City High" → `mod`
- "Chico Unified" → `chico`
- "Rocklin Unified" → `rock`
- "Yuba City Unified" → `yuba`
- "Merced Union High" → `merced`
- "Marysville Joint Unified" → `mary`
- "Buckeye Union Elementary" → `buck`
- "San Mateo-Foster City" → `smfc`
- "Santa Rosa High" → `srh`
- "Lucia Mar Unified" → `lucia`
- "Woodland Joint Unified" → `wood`
- "Calexico Unified" → `cal`
- "Novato Unified" → `nov`
- "Ukiah Unified" → `ukiah`
- "Hollister" → `holl`
- "Hanford Elementary" → `hanf`
- "Shasta Union High" → `shasta`
- "Huntington Beach City Elementary" → `hb`
- "Atwater Elementary" → `atwater`
- "Magnolia Elementary" → `mag`
- "Lawndale Elementary" → `lawn`
- "Santa Rosa Elementary" → `sre`
- "Burton Elementary" → `burton`
- "Lakeside Union Elementary" → `lake`
- "Orcutt Union Elementary" → `orcutt`
- "Mountain View Elementary" → `mtview`
- "Natomas Unified" → `nat` (existing mapping, no intelligence entry)
- "Plumas County Office of Education" → `plumas` (existing mapping, no intelligence entry)

---

## 3. Derivation Rules

**These rules determine what the intelligence content says based on the district's actual CDE data. Do NOT invent arbitrary content. Derive it.**

### 3a. Goal derivation (pick the PRIMARY goal based on data signals):

| Data signal | Goal theme | Example title |
|---|---|---|
| mathProficiency < 35% | Math proficiency improvement | "Academic Achievement in Mathematics" |
| elaProficiency < 40% | ELA proficiency improvement | "Literacy and Language Arts Achievement" |
| mathProficiency declined YoY | Math recovery | "Mathematics Recovery and Acceleration" |
| ellPercentage > 25% | English learner support | "English Learner Achievement and Reclassification" |
| chronicAbsenteeismRate > 20% | Attendance and engagement | "Student Engagement and Attendance" |
| frpmCount/frpmEnrollment > 70% | Equity and access | "Equitable Access to Quality Instruction" |
| None of the above clearly dominant | General academic improvement | "Academic Excellence for All Students" |

If multiple signals are strong, pick the strongest. Add a second action only if a clearly different secondary signal exists (e.g., math is weak AND ELL% is high).

### 3b. Action derivation:

| Goal theme | Action template |
|---|---|
| Math improvement | "K-[high grade] Mathematics Instructional Materials [Evaluation/Improvement]" |
| ELA improvement | "ELA Curriculum [Review/Enhancement]" |
| EL support | "Integrated ELD and Language Support Services" |
| Attendance | "Attendance Intervention and Family Engagement" |
| Equity | "Targeted Intervention and Support Services" |

### 3c. Funding amounts (derive from district size):

| totalEnrollment | Typical action funding |
|---|---|
| < 3,000 | $150,000 – $400,000 |
| 3,000 – 10,000 | $400,000 – $1,500,000 |
| 10,000 – 30,000 | $1,500,000 – $4,000,000 |
| 30,000 – 80,000 | $4,000,000 – $8,000,000 |
| 80,000+ | $8,000,000 – $15,000,000 |

Use realistic California funding sources: "LCFF Base", "LCFF Supplemental", "LCFF Supplemental & Concentration", "Title I", "Title III", "Title III + LCFF Supplemental". Smaller/higher-need districts lean on Supplemental & Concentration. Wealthier suburban districts lean on LCFF Base.

### 3d. Goals Brief derivation:

`leadInsight`: Synthesize the primary goal into 2-3 sentences. Reference specific data points from the district. Example: "Elk Grove USD's LCAP priorities center on improving mathematics proficiency, which stands at 38.2% — a 2.1-point increase from the prior year but still well below state targets. The district has allocated $3.2M for K-8 math instructional improvement."

`keySignals`: 2-3 entries. Always include:
1. The primary focus area with funding amount
2. A driving priority (LCAP goal reference)
3. Optionally: district scale or a notable secondary signal

### 3e. Academic Brief derivation:

`leadInsight`: Compare math vs ELA proficiency, note the trend direction (improving/declining/flat), flag the weaker subject.

`keySignals`: 2-3 entries. Always include:
1. Weakest subject with proficiency rate
2. Year-over-year trend (use actual data from years array)
3. A notable demographic signal (ELL%, chronic absenteeism, or FRPM rate)

### 3f. Priority Summary derivation:

2-3 sentences combining the goal theme, academic context, and one distinguishing characteristic. Reference actual numbers.

### 3g. District type considerations:

| docType | Implications |
|---|---|
| "Unified School District" | K-12 scope, goals span elementary through secondary |
| "High School District" | Only 9-12, goals focus on secondary instruction, college readiness |
| "Elementary School District" | Only K-6 or K-8, goals focus on foundational skills |
| "County Office of Education" | Serves alternative/continuation schools, often high-need populations |

Adjust goal titles, grade ranges in actions, and narrative accordingly. A "High School District" should NOT reference "K-8 math materials."

---

## 4. UUID Mapping Updates

After all entries are generated, update `UUID_TO_SEED_ID` to include all 50 districts. The current mapping has 10 entries. Add the remaining 40.

Format:
```typescript
'<uuid>': 'dist-<slug>-001',   // <District Name>
```

Preserve all existing mappings. Append new ones.

---

## 5. Upgrade Natomas and Plumas

Natomas (`dist-nat-001`) and Plumas (`dist-plumas-001`) have UUID mappings but NO intelligence data. Generate Tier 3 entries for both using the same rules above.

---

## 6. Verification Checklist

After all batches complete:

- [ ] `npx tsc --noEmit` passes (no type errors)
- [ ] `UUID_TO_SEED_ID` contains exactly 50 entries (one per district)
- [ ] Every UUID in `DISTRICT_FIXTURES` has a corresponding `UUID_TO_SEED_ID` entry
- [ ] Every seed ID in `UUID_TO_SEED_ID` has a corresponding `INTELLIGENCE_MAP` entry
- [ ] `getDistrictIntelligence(uuid)` returns non-null for all 50 UUIDs
- [ ] `getAvailableCategories(uuid)` returns `['goalsFunding', 'academicPerformance']` for all 50
- [ ] No existing Tier 1 or Tier 2 entries were modified
- [ ] All generated entries use the Tier 3 template structure exactly (no extra fields, no missing required fields)
- [ ] Slugs are unique across all 50 districts
- [ ] Funding amounts are plausible for district size
- [ ] Goal themes align with actual CDE data signals
- [ ] District type (Unified/High/Elementary/County) is reflected in grade-range language

---

## 7. Reference Example: Long Beach (Tier 2 — structural reference for Tier 3)

Tier 3 entries should follow this structure but with LESS content (no contacts, no competitive landscape, no budget summary, no detailed academic breakdowns):

```typescript
INTELLIGENCE_MAP['dist-lb-001'] = {
  districtId: 'dist-lb-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: "Long Beach USD is focused on continuous improvement of current K-8 math materials rather than replacement, with ongoing coaching and PD driving the $1.5M LCAP action. The district is conducting a data-driven evaluation of whether supplemental or replacement materials are needed. No active adoption cycle has been initiated.",
    keySignals: [
      { label: "Improvement focus", value: "K-8 Mathematics — coaching and PD for current materials, $1.5M", detail: "Evaluating need for supplemental or replacement based on student outcome data" },
      { label: "No active adoption", value: "No core curriculum procurement signaled for 2024-25" },
      { label: "Driving priority", value: "LCAP Goal 1: Academic Achievement for Every Student" },
    ],
  },
  goals: [
    {
      goalId: 'lb-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Achievement for Every Student',
      description: 'Increase proficiency in mathematics and ELA with focus on closing gaps for English Learners, students with disabilities, and African American and Hispanic students.',
      goalType: 'Broad',
      academicYear: '2024-25',
      sourceId: 'src-lb-lcap',
      actions: [
        {
          actionId: 'lb-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'K-8 Mathematics Continuous Improvement',
          description: 'Strengthen implementation of current K-8 math materials through targeted coaching, lesson study, and data-driven PLC cycles. Evaluate need for supplemental or replacement materials based on student outcome data.',
          totalFunds: '$1,500,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress',
          sourceId: 'src-lb-lcap',
        },
      ],
    },
  ],
  // NOTE: Tier 2 also includes budgetSummary, keyContacts — Tier 3 omits these
  prioritySummary: 'Long Beach USD is a nationally recognized district focused on continuous improvement of current K-8 math materials rather than replacement. The district is evaluating whether supplemental or replacement materials are needed based on student outcome data.',
  sources: [
    {
      sourceId: 'src-lb-lcap',
      sourceType: 'lcap',
      name: '2024-25 LCAP',
      academicYear: '2024-25',
      retrievedAt: '2025-11-10T00:00:00Z',
    },
    {
      sourceId: 'src-lb-web',
      sourceType: 'district_website',
      name: 'LBUSD District Website',
      retrievedAt: '2025-11-15T00:00:00Z',
    },
  ],
};
```

**Tier 3 = this structure minus `budgetSummary`, `keyContacts`, `competitiveLandscape`, `competitiveBrief`, `otherFundingSignals`, `programMentions`. Plus `academicBrief` added.**

---

## 8. File Organization

All changes go in a single file: `src/services/providers/mock/fixtures/district-intelligence.ts`

Append new entries AFTER the existing Long Beach entry (last current entry, line ~2065). Keep all existing code untouched above that line.

Organize new entries with section headers:

```typescript
// ============================================================
// TIER 3: [DISTRICT NAME] (dist-{slug}-001)
// ============================================================
```

---

## 9. Error Handling

If a district in `DISTRICT_FIXTURES` has no `years` data or all academic fields are null:
- Still generate an entry, but use generic language: "District priorities center on student achievement and instructional quality improvement."
- Set academic brief signals to note data unavailability: `{ label: "Data limited", value: "Academic metrics pending CDE reporting" }`
- This is better than an empty state.
