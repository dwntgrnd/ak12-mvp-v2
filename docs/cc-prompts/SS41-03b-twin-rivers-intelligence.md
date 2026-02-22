# CC Prompt: Add Twin Rivers USD Intelligence (Tier 1)

**Session:** SS-41  
**Prompt:** 3b of 3  
**Depends on:** SS41-02 (Twin Rivers must exist in DISTRICT_FIXTURES first)

---

## Objective

Add a full Tier 1 intelligence entry for Twin Rivers USD (`dist-tr-001`) to the `INTELLIGENCE_MAP` in `/src/services/providers/mock/fixtures/district-intelligence.ts`. Twin Rivers is the showcase district for the readiness assessment flow (Scenario 3). Users who explore that rich discovery narrative and click through to the profile should find substantive research content, not an empty page.

## Content Source

All content below is derived from Discovery Scenario 3 (Twin Rivers readiness assessment) in `discovery.ts`, reformatted into the intelligence fixture structure. The data is synthetic but internally consistent with the discovery narrative claims.

## Structure

Follow the exact pattern used by the existing Tier 1 entries (LA, Sacramento City, Fresno). Twin Rivers needs all intelligence categories:
- Sources
- Goals (LCAP)
- Budget summary
- Academic detail (grade-level breakdowns + subgroup gaps)
- Competitive landscape
- Key contacts
- Goals brief, Academic brief, Competitive brief
- Program mentions
- Priority summary

## Content to Add

Add the following after the existing `INTELLIGENCE_MAP['dist-sac-001']` block (or at the end of the Tier 1 section). Use the same code pattern — define constants, then assign to map.

### Sources

```ts
const TR_SOURCES: IntelligenceSource[] = [
  {
    sourceId: 'src-tr-lcap-2425',
    sourceType: 'lcap',
    name: '2024-25 LCAP',
    academicYear: '2024-25',
    retrievedAt: '2025-11-12T00:00:00Z',
  },
  {
    sourceId: 'src-tr-cde-2324',
    sourceType: 'state_database',
    name: 'CDE DataQuest 2023-24',
    url: 'https://dq.cde.ca.gov/dataquest/',
    academicYear: '2023-24',
    retrievedAt: '2025-10-01T00:00:00Z',
  },
  {
    sourceId: 'src-tr-web',
    sourceType: 'district_website',
    name: 'Twin Rivers USD District Website',
    url: 'http://www.twinriversusd.org',
    retrievedAt: '2025-12-01T00:00:00Z',
  },
  {
    sourceId: 'src-tr-board-oct-2024',
    sourceType: 'board_minutes',
    name: 'Twin Rivers USD Board Meeting Minutes — October 2024',
    retrievedAt: '2024-11-05T00:00:00Z',
  },
];
```

### Goals

```ts
const TR_GOALS: DistrictGoal[] = [
  {
    goalId: 'tr-goal-1',
    goalNumber: 'Goal 1',
    title: 'Mathematics Achievement and Instructional Materials',
    description: 'Increase math proficiency for all students through evaluation and adoption of high-quality K-8 instructional materials, targeted math intervention, and professional development aligned to the 2023 California Mathematics Framework. Close achievement gaps for English Learners and Socioeconomically Disadvantaged students.',
    goalType: 'Broad',
    academicYear: '2024-25',
    sourceId: 'src-tr-lcap-2425',
    actions: [
      {
        actionId: 'tr-act-1-1',
        actionNumber: 'Action 1.1',
        title: 'K-8 Math Instructional Materials Evaluation and Procurement',
        description: 'Complete the evaluation and procurement of high-quality instructional materials in mathematics for grades K-8. Includes curriculum committee review, teacher pilot, EdReports analysis, community input, and board approval.',
        descriptionSummary: 'Evaluate and procure new K-8 math materials — committee, pilot, board approval.',
        totalFunds: '$4,200,000',
        fundingSource: 'LCFF Supplemental & Concentration',
        contributing: true,
        status: 'in_progress',
        sourceId: 'src-tr-lcap-2425',
      },
      {
        actionId: 'tr-act-1-2',
        actionNumber: 'Action 1.2',
        title: 'Math Intervention for Grades 3-8',
        description: 'Expand diagnostic-driven math intervention for students in grades 3-8 performing below grade level, with priority for English Learner and Socioeconomically Disadvantaged subgroups.',
        descriptionSummary: 'Expand targeted math intervention for below-grade-level students.',
        totalFunds: '$1,100,000',
        fundingSource: 'Title I',
        contributing: true,
        status: 'in_progress',
        sourceId: 'src-tr-lcap-2425',
      },
      {
        actionId: 'tr-act-1-3',
        actionNumber: 'Action 1.3',
        title: 'Math Professional Development',
        description: 'Provide sustained professional development for K-8 teachers on new math materials implementation, including summer institute, coaching cycles, and collaborative lesson study.',
        descriptionSummary: 'PD for new math materials — summer institute, coaching, lesson study.',
        totalFunds: '$650,000',
        fundingSource: 'Educator Effectiveness Block Grant',
        contributing: false,
        status: 'planned',
        sourceId: 'src-tr-lcap-2425',
      },
    ],
  },
  {
    goalId: 'tr-goal-2',
    goalNumber: 'Goal 2',
    title: 'English Learner Achievement and Reclassification',
    description: 'Increase English Learner reclassification rates and close proficiency gaps through enhanced designated and integrated ELD instruction, with particular focus on ELD support embedded in math instructional materials.',
    goalType: 'Focused',
    academicYear: '2024-25',
    sourceId: 'src-tr-lcap-2425',
    actions: [
      {
        actionId: 'tr-act-2-1',
        actionNumber: 'Action 2.1',
        title: 'Integrated ELD in Math Instruction',
        description: 'Require that newly adopted math materials include robust integrated ELD supports. Provide supplemental training for math teachers serving classrooms with high EL enrollment.',
        totalFunds: '$350,000',
        fundingSource: 'Title III',
        contributing: true,
        status: 'in_progress',
        sourceId: 'src-tr-lcap-2425',
      },
    ],
  },
  {
    goalId: 'tr-goal-3',
    goalNumber: 'Goal 3',
    title: 'Student Engagement and Chronic Absenteeism Reduction',
    description: 'Reduce chronic absenteeism from 22.8% to below 18% through attendance intervention, family engagement, and improved school climate strategies.',
    goalType: 'Broad',
    academicYear: '2024-25',
    sourceId: 'src-tr-lcap-2425',
    actions: [
      {
        actionId: 'tr-act-3-1',
        actionNumber: 'Action 3.1',
        title: 'Attendance Intervention Program',
        description: 'Deploy attendance intervention specialists at the 8 schools with highest chronic absenteeism rates for direct outreach and family engagement.',
        totalFunds: '$780,000',
        fundingSource: 'LCFF Supplemental',
        contributing: true,
        status: 'in_progress',
        sourceId: 'src-tr-lcap-2425',
      },
    ],
  },
];
```

### Budget Summary

```ts
const TR_BUDGET: BudgetSummary = {
  academicYear: '2024-25',
  totalBudget: '$310,000,000',
  totalGoalFunding: '$7,080,000',
  fundingBreakdown: [
    { source: 'LCFF Base', amount: '$168,000,000', percentage: 54 },
    { source: 'LCFF Supplemental & Concentration', amount: '$72,000,000', percentage: 23 },
    { source: 'Title I', amount: '$18,500,000', percentage: 6 },
    { source: 'Title III (EL)', amount: '$2,800,000', percentage: 1 },
    { source: 'Special Education', amount: '$34,000,000', percentage: 11 },
    { source: 'Other Federal/State', amount: '$14,700,000', percentage: 5 },
  ],
  highlights: [
    {
      label: 'K-8 Math Materials Evaluation and Procurement',
      amount: '$4,200,000',
      note: 'Board-approved allocation for evaluation and procurement of new K-8 math materials. Evaluation committee convened October 2024. Selection timeline before end of 2025-26.',
    },
    {
      label: 'Math Intervention Expansion',
      amount: '$1,100,000',
      note: 'Title I-funded intervention for below-grade-level students in grades 3-8. Priority for EL and SED subgroups.',
    },
    {
      label: 'Educator Effectiveness Block Grant',
      amount: '$4,200,000',
      note: 'One-time state allocation through 2026. Available for PD, coaching, and implementation support for new materials.',
    },
  ],
  sourceId: 'src-tr-lcap-2425',
};
```

### Academic Detail

```ts
const TR_ACADEMIC: AcademicDetail = {
  academicYear: '2023-24',
  subjectBreakdowns: [
    { subject: 'Mathematics', gradeLevel: 'Grade 3', proficiencyRate: 27.4, priorYearRate: 29.8, studentCount: 2050 },
    { subject: 'Mathematics', gradeLevel: 'Grade 4', proficiencyRate: 25.1, priorYearRate: 27.6, studentCount: 2010 },
    { subject: 'Mathematics', gradeLevel: 'Grade 5', proficiencyRate: 22.8, priorYearRate: 25.5, studentCount: 1980 },
    { subject: 'Mathematics', gradeLevel: 'Grade 6', proficiencyRate: 20.5, priorYearRate: 23.1, studentCount: 1920 },
    { subject: 'Mathematics', gradeLevel: 'Grade 7', proficiencyRate: 24.2, priorYearRate: 26.8, studentCount: 1890 },
    { subject: 'Mathematics', gradeLevel: 'Grade 8', proficiencyRate: 19.3, priorYearRate: 22.0, studentCount: 1850 },
    { subject: 'Mathematics', gradeLevel: 'All', proficiencyRate: 31.2, priorYearRate: 33.5, studentCount: 17500 },
    { subject: 'ELA', gradeLevel: 'Grade 3', proficiencyRate: 33.2, priorYearRate: 34.5, studentCount: 2050 },
    { subject: 'ELA', gradeLevel: 'Grade 5', proficiencyRate: 35.8, priorYearRate: 37.2, studentCount: 1980 },
    { subject: 'ELA', gradeLevel: 'Grade 8', proficiencyRate: 38.5, priorYearRate: 40.1, studentCount: 1850 },
    { subject: 'ELA', gradeLevel: 'All', proficiencyRate: 36.0, priorYearRate: 37.8, studentCount: 17500 },
  ],
  subgroupGaps: [
    { subgroup: 'English Learners', subject: 'Mathematics', proficiencyRate: 18.9, districtOverallRate: 31.2, gapPoints: -12.3 },
    { subgroup: 'English Learners', subject: 'ELA', proficiencyRate: 10.5, districtOverallRate: 36.0, gapPoints: -25.5 },
    { subgroup: 'Socioeconomically Disadvantaged', subject: 'Mathematics', proficiencyRate: 22.1, districtOverallRate: 31.2, gapPoints: -9.1 },
    { subgroup: 'Socioeconomically Disadvantaged', subject: 'ELA', proficiencyRate: 28.5, districtOverallRate: 36.0, gapPoints: -7.5 },
    { subgroup: 'Students with Disabilities', subject: 'Mathematics', proficiencyRate: 8.2, districtOverallRate: 31.2, gapPoints: -23.0 },
    { subgroup: 'Students with Disabilities', subject: 'ELA', proficiencyRate: 10.8, districtOverallRate: 36.0, gapPoints: -25.2 },
    { subgroup: 'Hispanic/Latino', subject: 'Mathematics', proficiencyRate: 24.5, districtOverallRate: 31.2, gapPoints: -6.7 },
    { subgroup: 'African American', subject: 'Mathematics', proficiencyRate: 15.8, districtOverallRate: 31.2, gapPoints: -15.4 },
    { subgroup: 'African American', subject: 'ELA', proficiencyRate: 20.3, districtOverallRate: 36.0, gapPoints: -15.7 },
  ],
  narrative: 'Twin Rivers USD math proficiency has declined from 36.3% in 2021-22 to 31.2% in 2023-24, a 5.1 percentage point drop that exceeds the statewide trend. Third-grade math proficiency at 27.4% sits below the district\'s own 2021-22 baseline. English Learner students score 18.9% proficient in math — a 12.3 point gap versus non-EL peers. Socioeconomically Disadvantaged students at 22.1% underscore a systemic equity challenge. The 2-year decline is consistent across all grade bands K-8, suggesting a curriculum alignment issue rather than isolated demographic shifts. Grade 8 math at 19.3% is the most critical intervention point.',
  sourceId: 'src-tr-cde-2324',
};
```

### Competitive Landscape

```ts
const TR_COMPETITORS: CompetitorEntry[] = [
  {
    entryId: 'tr-comp-1',
    vendorName: 'Houghton Mifflin Harcourt',
    productName: 'Go Math!',
    subjectArea: 'Mathematics',
    gradeRange: 'K-8',
    status: 'expiring',
    contractEndDate: '2025-06-30',
    notes: 'Current math adoption since 2017 — 8 years old, at the outer edge of California\'s typical 5-7 year cycle. No longer receiving active publisher updates. Being replaced through the current evaluation process.',
    confidence: 'confirmed',
    sourceId: 'src-tr-lcap-2425',
  },
  {
    entryId: 'tr-comp-2',
    vendorName: 'Great Minds',
    productName: 'Eureka Math Squared',
    subjectArea: 'Mathematics',
    gradeRange: 'K-8',
    status: 'in_evaluation',
    notes: 'Referenced in October 2024 board presentation as one of four programs under evaluation. EdReports-aligned evaluation criteria cited by curriculum committee.',
    confidence: 'probable',
    sourceId: 'src-tr-board-oct-2024',
  },
  {
    entryId: 'tr-comp-3',
    vendorName: 'Illustrative Mathematics',
    productName: 'IM K-12 Math',
    subjectArea: 'Mathematics',
    gradeRange: 'K-8',
    status: 'in_evaluation',
    notes: 'Referenced in October 2024 board presentation. Strong EdReports ratings. Based on regional patterns and cited evaluation criteria, appears likely in contention.',
    confidence: 'probable',
    sourceId: 'src-tr-board-oct-2024',
  },
  {
    entryId: 'tr-comp-4',
    vendorName: 'Houghton Mifflin Harcourt',
    productName: 'Into Math',
    subjectArea: 'Mathematics',
    gradeRange: 'K-8',
    status: 'in_evaluation',
    notes: 'Referenced in October 2024 board presentation as one of four programs. Successor to current Go Math! adoption — continuity advantage but performance concerns with predecessor.',
    confidence: 'probable',
    sourceId: 'src-tr-board-oct-2024',
  },
];
```

### Key Contacts

```ts
const TR_CONTACTS: DistrictContact[] = [
  {
    contactId: 'tr-contact-1',
    name: 'Dr. Olivia Harrison',
    title: 'Superintendent',
    department: 'Office of the Superintendent',
    role: 'decision_maker',
    notes: 'District leader with stated commitment to math improvement. Board meeting presentations reflect urgency around math proficiency decline. Key relationship for executive-level engagement.',
    sourceId: 'src-tr-web',
  },
  {
    contactId: 'tr-contact-2',
    name: 'Mark Solis',
    title: 'Director of Curriculum and Instruction',
    department: 'Curriculum and Instruction',
    role: 'evaluator',
    notes: 'Operational lead for the K-8 math curriculum evaluation based on board meeting presentations. Chairs the curriculum evaluation committee. Primary technical contact for product demonstrations and pilot coordination.',
    sourceId: 'src-tr-board-oct-2024',
  },
  {
    contactId: 'tr-contact-3',
    name: 'Maria Estrada',
    title: 'Board President',
    department: 'Board of Trustees',
    role: 'decision_maker',
    notes: 'Vocally prioritized math improvement in public comments since 2023. Board approval is the final gate for adoption. Understanding her criteria and concerns is critical for the final stage.',
    sourceId: 'src-tr-board-oct-2024',
  },
  {
    contactId: 'tr-contact-4',
    name: 'Parent Advisory Committee (PAC)',
    title: 'Advisory Body',
    department: 'Community Engagement',
    role: 'influencer',
    notes: 'Submitted formal recommendation in September 2024 supporting transition to a more "structured" math program. Community voice carries weight in board decisions. Be prepared to address parent concerns about instructional approach.',
    sourceId: 'src-tr-board-oct-2024',
  },
];
```

### Briefs

```ts
const TR_GOALS_BRIEF: BriefContent = {
  leadInsight: "Twin Rivers USD has committed $4.2M to evaluation and procurement of K-8 math materials, with an evaluation committee convened in October 2024 and selection targeted before the end of 2025-26. LCAP Goal 1 explicitly targets math intervention and materials as the district's top priority.",
  keySignals: [
    { label: "Active evaluation", value: "K-8 Mathematics — $4.2M allocated", detail: "Evaluation committee convened Oct 2024; selection before end of 2025-26" },
    { label: "Driving priority", value: "LCAP Goal 1: Math Achievement and Instructional Materials" },
    { label: "EL integration", value: "Goal 2 requires ELD supports embedded in new math materials" },
    { label: "Scale", value: "27,100 students K-12" },
  ],
};

const TR_ACADEMIC_BRIEF: BriefContent = {
  leadInsight: "Math proficiency has declined from 36.3% to 31.2% over two years — a 5.1 percentage point drop exceeding the statewide trend. The decline is consistent across all K-8 grade bands, suggesting a curriculum alignment issue. English Learner math proficiency at 18.9% represents a 12.3 point gap, and Grade 8 math at 19.3% is the most critical intervention point.",
  keySignals: [
    { label: "Math decline", value: "31.2% proficient — down 5.1pp over 2 years", detail: "Exceeds statewide decline trend; consistent across all grade bands" },
    { label: "Grade 3 math", value: "27.4% — below district's own 2021-22 baseline of 31.8%" },
    { label: "English Learners", value: "18.9% math / 10.5% ELA", detail: "12.3 point gap vs non-EL peers in math" },
    { label: "SED students", value: "22.1% math — 9.1 point gap below district average" },
  ],
};

const TR_COMPETITIVE_BRIEF: BriefContent = {
  leadInsight: "Twin Rivers' current Go Math! adoption (HMH, 2017) is 8 years old — at the outer edge of California's typical cycle and no longer receiving active updates. The October 2024 board presentation referenced four programs under evaluation: Eureka Math Squared, Illustrative Mathematics, Into Math, and a fourth redacted in public documents. No formal RFP has been published.",
  keySignals: [
    { label: "Being replaced", value: "HMH Go Math! (K-8) — adopted 2017, 8 years old", detail: "No longer receiving active publisher updates" },
    { label: "In evaluation", value: "Eureka Math Squared (Great Minds)", detail: "Referenced in Oct 2024 board presentation" },
    { label: "In evaluation", value: "Illustrative Mathematics (K-8)", detail: "Strong EdReports ratings; evaluation criteria cited" },
    { label: "In evaluation", value: "Into Math (HMH) — successor to current adoption" },
  ],
};
```

### Program Mentions

```ts
const TR_PROGRAM_MENTIONS: ProgramMention[] = [
  {
    mentionId: 'tr-pm-1',
    programName: 'Go Math!',
    vendorName: 'Houghton Mifflin Harcourt',
    subjectArea: 'Mathematics',
    gradeRange: 'K-8',
    mentionType: 'in_use',
    sourceContext: 'Current math adoption since 2017; 8 years old, at outer edge of typical cycle. Being replaced through active evaluation.',
    sourceId: 'src-tr-lcap-2425',
  },
  {
    mentionId: 'tr-pm-2',
    programName: 'Eureka Math Squared',
    vendorName: 'Great Minds',
    subjectArea: 'Mathematics',
    gradeRange: 'K-8',
    mentionType: 'under_evaluation',
    sourceContext: 'Referenced in October 2024 board presentation as one of four programs under evaluation.',
    sourceId: 'src-tr-board-oct-2024',
  },
  {
    mentionId: 'tr-pm-3',
    programName: 'IM K-12 Math',
    vendorName: 'Illustrative Mathematics',
    subjectArea: 'Mathematics',
    gradeRange: 'K-8',
    mentionType: 'under_evaluation',
    sourceContext: 'Referenced in board presentation; strong EdReports ratings align with committee evaluation criteria.',
    sourceId: 'src-tr-board-oct-2024',
  },
  {
    mentionId: 'tr-pm-4',
    programName: 'Into Math',
    vendorName: 'Houghton Mifflin Harcourt',
    subjectArea: 'Mathematics',
    gradeRange: 'K-8',
    mentionType: 'under_evaluation',
    sourceContext: 'Referenced in board presentation; successor to current Go Math! adoption.',
    sourceId: 'src-tr-board-oct-2024',
  },
];
```

### Map Entry

```ts
INTELLIGENCE_MAP['dist-tr-001'] = {
  districtId: 'dist-tr-001',
  lastUpdated: '2025-12-01T00:00:00Z',
  goals: TR_GOALS,
  budgetSummary: TR_BUDGET,
  academicDetail: TR_ACADEMIC,
  competitiveLandscape: TR_COMPETITORS,
  keyContacts: TR_CONTACTS,
  goalsBrief: TR_GOALS_BRIEF,
  academicBrief: TR_ACADEMIC_BRIEF,
  competitiveBrief: TR_COMPETITIVE_BRIEF,
  programMentions: TR_PROGRAM_MENTIONS,
  prioritySummary: 'Twin Rivers USD is in active evaluation for K-8 math materials with $4.2M allocated and an evaluation committee reviewing four programs. Math proficiency has declined 5.1 percentage points over two years to 31.2%, with the current Go Math! adoption (2017) at 8 years old. The LCAP explicitly prioritizes math intervention and materials, the board president has publicly championed math improvement, and the Parent Advisory Committee has formally recommended a transition. This is a high-priority near-term opportunity with a selection timeline before end of 2025-26.',
  sources: TR_SOURCES,
};
```

## Placement

Add the Twin Rivers block as a new Tier 1 section. Update the file header comment to reflect:

```
// Tier 1 (rich): LA, Sacramento, Twin Rivers, Fresno — all 3 brief categories
```

## Verification

1. Navigate to Twin Rivers district profile
2. Three intelligence tabs should appear: Goals & Funding, Academic Performance, Competitive Intel
3. District Trends tab should also appear (from yearData)
4. Goals & Funding tab should show 3 goals with actions, budget highlights, and the goals brief
5. Academic Performance tab should show grade-level breakdowns, subgroup gaps, and the academic brief
6. Competitive Intel tab should show 4 competitor entries, program mentions, and the competitive brief
7. No console errors

## Files Modified

- `/src/services/providers/mock/fixtures/district-intelligence.ts` — add Twin Rivers Tier 1 entry

## Do NOT Modify

- Discovery scenario content — the intelligence data complements, not replaces, the discovery narratives
- Other intelligence entries
- Research tab components (rendering logic stays the same)
