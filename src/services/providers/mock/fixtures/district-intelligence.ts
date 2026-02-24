// District intelligence mock fixtures
//
// Consumed directly by research tab components — no service layer.
// Content is generated (not real LCAP data) but modeled on realistic
// district contexts consistent with existing playbook narratives.
//
// Tier 1 (rich): LA, Sacramento, Twin Rivers, Fresno — all 3 brief categories
// Tier 2 (moderate): SF, SD, Oakland, Long Beach — 3-4 categories
// Tier 3 (sparse): remaining districts — none, handled by absence

import type {
  DistrictIntelligence,
  IntelligenceSource,
  DistrictGoal,
  BudgetSummary,
  AcademicDetail,
  CompetitorEntry,
  DistrictContact,
  BriefContent,
  OtherFundingSignal,
  ProgramMention,
} from '../../../types/district-intelligence';

// ============================================================
// Helper: lookup intelligence by districtId
// ============================================================

const UUID_TO_SEED_ID: Record<string, string> = {
  'b8cd9b23-4f2f-470d-b1e5-126e7ff2a928': 'dist-la-001',   // Los Angeles Unified
  '48e9f362-9690-44e5-b8a2-362a24f30e58': 'dist-sd-001',    // San Diego Unified
  '8148d163-df6f-48a9-976f-4137b5e3895b': 'dist-sf-001',    // San Francisco Unified
  '75c04266-c622-4294-aa22-046245c95e51': 'dist-fre-001',   // Fresno Unified
  '89e89add-4b95-47b5-a8e1-ae3b92fadf73': 'dist-oak-001',   // Oakland Unified
  '7c2603bd-7cca-414f-8813-320d8ef2020b': 'dist-lb-001',    // Long Beach Unified
  '94f6d871-3b85-4b21-8499-6b7c450cd124': 'dist-tr-001',    // Twin Rivers Unified
  '7f4e8dd1-9f32-4d87-92f3-3009800b88b0': 'dist-sac-001',   // Sacramento City Unified
  'aa868246-d102-4093-873d-f5d6c2890757': 'dist-nat-001',    // Natomas Unified
  'b1f3e349-0cc9-485b-b9df-d96477b2d4a4': 'dist-plumas-001', // Plumas County OE
};

function resolveDistrictId(districtId: string): string {
  return UUID_TO_SEED_ID[districtId] ?? districtId;
}

const INTELLIGENCE_MAP: Record<string, DistrictIntelligence> = {};

export function getDistrictIntelligence(districtId: string): DistrictIntelligence | null {
  const resolvedId = resolveDistrictId(districtId);
  return INTELLIGENCE_MAP[resolvedId] ?? null;
}

/**
 * Returns which intelligence categories have data for a district.
 * Used by research tabs to determine which tabs to render.
 */
export function getAvailableCategories(districtId: string): string[] {
  const resolvedId = resolveDistrictId(districtId);
  const intel = INTELLIGENCE_MAP[resolvedId];
  if (!intel) return [];

  const categories: string[] = [];
  // New brief categories (Phase 6A)
  if (intel.goalsBrief || (intel.goals && intel.goals.length > 0)) categories.push('goalsFunding');
  if (intel.academicBrief || intel.academicDetail) categories.push('academicPerformance');
  return categories;
}

// ============================================================
// TIER 1: LOS ANGELES UNIFIED (dist-la-001)
// ============================================================

const LA_SOURCES: IntelligenceSource[] = [
  {
    sourceId: 'src-la-lcap-2425',
    sourceType: 'lcap',
    name: '2024-25 LCAP',
    url: 'https://achieve.lausd.net/lcap',
    academicYear: '2024-25',
    retrievedAt: '2025-11-15T00:00:00Z',
  },
  {
    sourceId: 'src-la-cde-2324',
    sourceType: 'state_database',
    name: 'CDE DataQuest 2023-24',
    url: 'https://dq.cde.ca.gov/dataquest/',
    academicYear: '2023-24',
    retrievedAt: '2025-10-01T00:00:00Z',
  },
  {
    sourceId: 'src-la-web',
    sourceType: 'district_website',
    name: 'LAUSD District Website',
    url: 'https://www.lausd.org',
    retrievedAt: '2025-12-01T00:00:00Z',
  },
  {
    sourceId: 'src-la-board',
    sourceType: 'board_minutes',
    name: 'LAUSD Board Meeting Minutes, October 2025',
    retrievedAt: '2025-10-22T00:00:00Z',
  },
];

const LA_GOALS: DistrictGoal[] = [
  {
    goalId: 'la-goal-1',
    goalNumber: 'Goal 1',
    title: 'Proficiency for All: Academic Achievement in Core Subjects',
    description: 'All students will demonstrate growth in academic achievement in English Language Arts, Mathematics, and other core subjects, with targeted support for students performing below grade level and accelerated progress for English Learners toward reclassification.',
    goalType: 'Broad',
    academicYear: '2024-25',
    sourceId: 'src-la-lcap-2425',
    actions: [
      {
        actionId: 'la-act-1-1',
        actionNumber: 'Action 1.1',
        title: 'K-8 Mathematics Instructional Materials Evaluation',
        description: 'Conduct a comprehensive evaluation of K-8 mathematics instructional materials aligned to the 2023 California Mathematics Framework, with emphasis on conceptual understanding, problem-based learning, and embedded supports for English Learners and students with disabilities.',
        descriptionSummary: 'Evaluate new K-8 math materials aligned to CA Math Framework with EL/SPED focus.',
        totalFunds: '$12,500,000',
        fundingSource: 'LCFF Base + Supplemental',
        contributing: true,
        status: 'in_progress',
        sourceId: 'src-la-lcap-2425',
      },
      {
        actionId: 'la-act-1-2',
        actionNumber: 'Action 1.2',
        title: 'Targeted Math Intervention Program',
        description: 'Implement a district-wide math intervention program for students in Grades 3-8 who are two or more grade levels below in mathematics, utilizing diagnostic assessment data and adaptive learning pathways.',
        descriptionSummary: 'District-wide math intervention for students 2+ grade levels below.',
        totalFunds: '$8,200,000',
        fundingSource: 'Title I',
        contributing: true,
        status: 'planned',
        sourceId: 'src-la-lcap-2425',
      },
      {
        actionId: 'la-act-1-3',
        actionNumber: 'Action 1.3',
        title: 'Secondary ELA Curriculum Refresh',
        description: 'Evaluate and pilot secondary ELA instructional materials with culturally responsive content, integrated ELD support, and student voice and choice components to increase engagement and college readiness.',
        descriptionSummary: 'Pilot culturally responsive secondary ELA materials with ELD integration.',
        totalFunds: '$6,800,000',
        fundingSource: 'LCFF Supplemental & Concentration',
        contributing: true,
        status: 'planned',
        sourceId: 'src-la-lcap-2425',
      },
    ],
  },
  {
    goalId: 'la-goal-2',
    goalNumber: 'Goal 2',
    title: 'English Learner Achievement and Reclassification',
    description: 'Increase English Learner reclassification rates and academic achievement in core subjects through enhanced designated and integrated ELD instruction, primary language support, and progress monitoring.',
    goalType: 'Focused',
    academicYear: '2024-25',
    sourceId: 'src-la-lcap-2425',
    actions: [
      {
        actionId: 'la-act-2-1',
        actionNumber: 'Action 2.1',
        title: 'Integrated ELD Professional Development',
        description: 'Provide intensive professional development for all content-area teachers on integrated ELD strategies, with emphasis on mathematics and ELA instructional integration for English Learners.',
        totalFunds: '$4,500,000',
        fundingSource: 'Title III + LCFF Supplemental',
        contributing: true,
        status: 'in_progress',
        sourceId: 'src-la-lcap-2425',
      },
      {
        actionId: 'la-act-2-2',
        actionNumber: 'Action 2.2',
        title: 'Primary Language Instructional Resources',
        description: 'Expand access to Spanish-language instructional materials in mathematics and ELA for newcomer and early-intermediate English Learners, particularly in grades K-5.',
        totalFunds: '$2,100,000',
        fundingSource: 'Title III',
        contributing: true,
        status: 'planned',
        sourceId: 'src-la-lcap-2425',
      },
    ],
  },
  {
    goalId: 'la-goal-3',
    goalNumber: 'Goal 3',
    title: 'Student Engagement and Attendance',
    description: 'Reduce chronic absenteeism from 25.1% to below 20% through targeted attendance interventions, family engagement, and improved school climate and connection strategies.',
    goalType: 'Broad',
    academicYear: '2024-25',
    sourceId: 'src-la-lcap-2425',
    actions: [
      {
        actionId: 'la-act-3-1',
        actionNumber: 'Action 3.1',
        title: 'Attendance Recovery and Intervention Teams',
        description: 'Deploy dedicated attendance intervention teams at the 100 schools with the highest chronic absenteeism rates, providing direct outreach, wraparound services, and family engagement.',
        totalFunds: '$9,000,000',
        fundingSource: 'LCFF Supplemental & Concentration',
        contributing: true,
        status: 'in_progress',
        sourceId: 'src-la-lcap-2425',
      },
    ],
  },
];

const LA_BUDGET: BudgetSummary = {
  academicYear: '2024-25',
  totalBudget: '$8,900,000,000',
  totalGoalFunding: '$43,100,000',
  fundingBreakdown: [
    { source: 'LCFF Base', amount: '$5,200,000,000', percentage: 58 },
    { source: 'LCFF Supplemental & Concentration', amount: '$1,800,000,000', percentage: 20 },
    { source: 'Title I', amount: '$420,000,000', percentage: 5 },
    { source: 'Title III (EL)', amount: '$85,000,000', percentage: 1 },
    { source: 'Special Education', amount: '$890,000,000', percentage: 10 },
    { source: 'Other Federal/State', amount: '$505,000,000', percentage: 6 },
  ],
  highlights: [
    {
      label: 'K-8 Mathematics Materials Evaluation',
      amount: '$12,500,000',
      note: 'Active evaluation cycle for 2025-26 adoption. Aligned to CA Math Framework. Evaluation committee convened.',
    },
    {
      label: 'Secondary ELA Curriculum Refresh',
      amount: '$6,800,000',
      note: 'Planned for 2025-26 pilot phase. Focus on culturally responsive content and ELD integration.',
    },
    {
      label: 'Educator Effectiveness Block Grant',
      amount: '$45,000,000',
      note: 'One-time state allocation through 2026. Available for PD, curriculum support, and coaching.',
    },
  ],
  sourceId: 'src-la-lcap-2425',
};

const LA_ACADEMIC: AcademicDetail = {
  academicYear: '2023-24',
  subjectBreakdowns: [
    { subject: 'Mathematics', gradeLevel: 'Grade 3', proficiencyRate: 34.2, priorYearRate: 31.8, studentCount: 35200 },
    { subject: 'Mathematics', gradeLevel: 'Grade 4', proficiencyRate: 30.1, priorYearRate: 28.5, studentCount: 34800 },
    { subject: 'Mathematics', gradeLevel: 'Grade 5', proficiencyRate: 27.5, priorYearRate: 25.2, studentCount: 33900 },
    { subject: 'Mathematics', gradeLevel: 'Grade 6', proficiencyRate: 25.8, priorYearRate: 23.1, studentCount: 33100 },
    { subject: 'Mathematics', gradeLevel: 'Grade 7', proficiencyRate: 28.3, priorYearRate: 26.9, studentCount: 32500 },
    { subject: 'Mathematics', gradeLevel: 'Grade 8', proficiencyRate: 22.4, priorYearRate: 20.8, studentCount: 31800 },
    { subject: 'Mathematics', gradeLevel: 'All', proficiencyRate: 32.8, priorYearRate: 30.6, studentCount: 350000 },
    { subject: 'ELA', gradeLevel: 'Grade 3', proficiencyRate: 38.5, priorYearRate: 37.2, studentCount: 35200 },
    { subject: 'ELA', gradeLevel: 'Grade 4', proficiencyRate: 40.1, priorYearRate: 38.9, studentCount: 34800 },
    { subject: 'ELA', gradeLevel: 'Grade 5', proficiencyRate: 42.8, priorYearRate: 41.3, studentCount: 33900 },
    { subject: 'ELA', gradeLevel: 'Grade 6', proficiencyRate: 44.2, priorYearRate: 42.8, studentCount: 33100 },
    { subject: 'ELA', gradeLevel: 'Grade 7', proficiencyRate: 46.1, priorYearRate: 44.5, studentCount: 32500 },
    { subject: 'ELA', gradeLevel: 'Grade 8', proficiencyRate: 43.5, priorYearRate: 42.0, studentCount: 31800 },
    { subject: 'ELA', gradeLevel: 'All', proficiencyRate: 43.1, priorYearRate: 41.7, studentCount: 350000 },
  ],
  subgroupGaps: [
    { subgroup: 'English Learners', subject: 'Mathematics', proficiencyRate: 12.4, districtOverallRate: 32.8, gapPoints: -20.4 },
    { subgroup: 'English Learners', subject: 'ELA', proficiencyRate: 8.7, districtOverallRate: 43.1, gapPoints: -34.4 },
    { subgroup: 'Socioeconomically Disadvantaged', subject: 'Mathematics', proficiencyRate: 28.5, districtOverallRate: 32.8, gapPoints: -4.3 },
    { subgroup: 'Socioeconomically Disadvantaged', subject: 'ELA', proficiencyRate: 38.2, districtOverallRate: 43.1, gapPoints: -4.9 },
    { subgroup: 'Students with Disabilities', subject: 'Mathematics', proficiencyRate: 9.8, districtOverallRate: 32.8, gapPoints: -23.0 },
    { subgroup: 'Students with Disabilities', subject: 'ELA', proficiencyRate: 11.2, districtOverallRate: 43.1, gapPoints: -31.9 },
    { subgroup: 'Hispanic/Latino', subject: 'Mathematics', proficiencyRate: 27.1, districtOverallRate: 32.8, gapPoints: -5.7 },
    { subgroup: 'Hispanic/Latino', subject: 'ELA', proficiencyRate: 36.5, districtOverallRate: 43.1, gapPoints: -6.6 },
    { subgroup: 'African American', subject: 'Mathematics', proficiencyRate: 18.3, districtOverallRate: 32.8, gapPoints: -14.5 },
    { subgroup: 'African American', subject: 'ELA', proficiencyRate: 27.8, districtOverallRate: 43.1, gapPoints: -15.3 },
  ],
  narrative: 'LAUSD shows steady but slow academic recovery across both math and ELA. The math-ELA gap (32.8% vs 43.1%) signals math as the more acute instructional challenge. Subgroup analysis reveals severe gaps for English Learners and Students with Disabilities in both subjects, with EL math proficiency at just 12.4%. Grade-level trends show proficiency declining in upper elementary and middle school, with Grade 8 math at 22.4% — the lowest tested grade level. Racial gaps persist, with African American students trailing the district average by 14-15 points in both subjects.',
  sourceId: 'src-la-cde-2324',
};

const LA_COMPETITORS: CompetitorEntry[] = [
  {
    entryId: 'la-comp-1',
    vendorName: 'Houghton Mifflin Harcourt',
    productName: 'Into Math',
    subjectArea: 'Mathematics',
    gradeRange: 'K-8',
    status: 'active_contract',
    contractEndDate: '2026-06-30',
    notes: 'Current primary math adoption in most LAUSD local districts. Contract approaching end. Teacher satisfaction varies by region.',
    confidence: 'confirmed',
    sourceId: 'src-la-lcap-2425',
  },
  {
    entryId: 'la-comp-2',
    vendorName: 'Amplify',
    productName: 'Amplify ELA',
    subjectArea: 'English Language Arts',
    gradeRange: 'K-5',
    status: 'active_contract',
    notes: 'Used in several local districts for elementary ELA. Strong teacher reception for digital components.',
    confidence: 'probable',
    sourceId: 'src-la-board',
  },
  {
    entryId: 'la-comp-3',
    vendorName: 'McGraw-Hill',
    productName: 'StudySync',
    subjectArea: 'English Language Arts',
    gradeRange: '6-12',
    status: 'active_contract',
    notes: 'Secondary ELA in some local districts. Evaluation for replacement has been signaled in LCAP actions.',
    confidence: 'probable',
    sourceId: 'src-la-lcap-2425',
  },
  {
    entryId: 'la-comp-4',
    vendorName: 'Curriculum Associates',
    productName: 'i-Ready',
    subjectArea: 'Mathematics',
    gradeRange: 'K-8',
    status: 'active_contract',
    notes: 'Used for diagnostic assessment and intervention across the district. Separate from core instructional materials.',
    confidence: 'confirmed',
    sourceId: 'src-la-web',
  },
];

const LA_CONTACTS: DistrictContact[] = [
  {
    contactId: 'la-contact-1',
    name: 'Alberto Carvalho',
    title: 'Superintendent',
    department: 'Office of the Superintendent',
    role: 'decision_maker',
    notes: 'Data-driven leader focused on math proficiency recovery and closing achievement gaps. Joined from Miami-Dade in 2022. Public statements emphasize evidence-based materials and measurable outcomes.',
    sourceId: 'src-la-web',
  },
  {
    contactId: 'la-contact-2',
    name: 'Dr. Frances Baez',
    title: 'Deputy Superintendent of Instruction',
    department: 'Division of Instruction',
    role: 'decision_maker',
    notes: 'Oversees curriculum strategy and adoption committee process. Sets evaluation criteria for instructional materials. Primary decision-maker for materials that go to board for approval.',
    sourceId: 'src-la-web',
  },
  {
    contactId: 'la-contact-3',
    name: 'Michael Torres',
    title: 'Director, Mathematics Education',
    department: 'Division of Instruction',
    email: 'michael.torres@lausd.net',
    role: 'evaluator',
    notes: 'Leads K-8 math adoption committee. Advocate for conceptual math instruction aligned to CA Framework. Values embedded formative assessment and adaptive learning.',
    sourceId: 'src-la-web',
  },
  {
    contactId: 'la-contact-4',
    name: 'Dr. Angela Whitfield',
    title: 'Director, English Language Arts',
    department: 'Division of Instruction',
    role: 'evaluator',
    notes: 'Leads secondary ELA evaluation. Prioritizes culturally responsive texts and writing instruction. Strong advocate for student voice and choice in curriculum.',
    sourceId: 'src-la-web',
  },
  {
    contactId: 'la-contact-5',
    name: 'Lydia Romero',
    title: 'Director, English Learner Programs',
    department: 'Multilingual and Multicultural Education',
    role: 'influencer',
    notes: 'Reviews all materials for EL support quality. Focus on integrated ELD, primary language resources, and newcomer supports. Her endorsement significantly influences adoption recommendations.',
    sourceId: 'src-la-web',
  },
  {
    contactId: 'la-contact-6',
    name: 'David Park',
    title: 'Chief Business Officer',
    department: 'Business Services',
    role: 'budget_authority',
    notes: 'Controls procurement and vendor contracts. Focused on total cost of ownership given enrollment-driven budget pressure. Expects detailed multi-year pricing models.',
    sourceId: 'src-la-web',
  },
];

const LA_GOALS_BRIEF: BriefContent = {
  leadInsight: "LAUSD is actively evaluating K-8 math materials aligned to the CA Math Framework, with $12.5M allocated for 2024-25. A secondary ELA curriculum refresh is planned for 2025-26 with $6.8M budgeted. Both initiatives are driven by LCAP Goal 1: Proficiency for All.",
  keySignals: [
    { label: "Active evaluation", value: "K-8 Mathematics — $12.5M allocated", detail: "Aligned to CA Math Framework, evaluation committee convened" },
    { label: "Planned refresh", value: "Secondary ELA — $6.8M planned for 2025-26", detail: "Focus on culturally responsive content and ELD integration" },
    { label: "Driving priority", value: "LCAP Goal 1: Proficiency for All" },
    { label: "Scale", value: "530,000 students across K-12" },
  ],
};

const LA_ACADEMIC_BRIEF: BriefContent = {
  leadInsight: "Math proficiency (32.8%) significantly trails ELA (43.1%), making math the more urgent instructional need. English Learners and Students with Disabilities show the largest achievement gaps — EL math proficiency is just 12.4%. Scores are improving slowly across both subjects, but remain well below state targets.",
  keySignals: [
    { label: "Weakest subject", value: "Mathematics — 32.8% proficient", detail: "10.3 points below ELA; Grade 8 at 22.4%" },
    { label: "English Learners", value: "12.4% math / 8.7% ELA", detail: "20+ point gap below district average in both subjects" },
    { label: "Students with Disabilities", value: "9.8% math / 11.2% ELA" },
    { label: "Trend", value: "Improving — math up 2.2 pts, ELA up 1.4 pts year-over-year" },
  ],
};

const LA_COMPETITIVE_BRIEF: BriefContent = {
  leadInsight: "LAUSD's LCAP references an active evaluation of K-8 math materials, with HMH Into Math (current K-8 adoption) on a contract ending June 2026. The secondary ELA program (McGraw-Hill StudySync, 6-12) is flagged for a curriculum refresh in 2025-26. Amplify ELA is referenced as the K-5 ELA program in several local districts.",
  keySignals: [
    { label: "Active evaluation", value: "K-8 Mathematics — evaluation underway", detail: "HMH Into Math contract expires June 2026" },
    { label: "Replacement signal", value: "Secondary ELA (McGraw-Hill StudySync 6-12) — refresh planned 2025-26" },
    { label: "Current programs", value: "Amplify ELA (K-5), i-Ready Diagnostic (K-8 math intervention)" },
  ],
};

const LA_OTHER_FUNDING: OtherFundingSignal[] = [
  {
    name: "Educator Effectiveness Block Grant",
    amount: "$45,000,000",
    sourceType: "state allocation",
    expiration: "2026",
    relevanceNote: "Available for PD, curriculum support, and coaching",
  },
];

const LA_PROGRAM_MENTIONS: ProgramMention[] = [
  {
    mentionId: 'la-pm-1',
    programName: 'Into Math',
    vendorName: 'Houghton Mifflin Harcourt',
    subjectArea: 'Mathematics',
    gradeRange: 'K-8',
    mentionType: 'in_use',
    sourceContext: 'Current primary math adoption; contract approaching end June 2026.',
    sourceId: 'src-la-lcap-2425',
  },
  {
    mentionId: 'la-pm-2',
    programName: 'Amplify ELA',
    vendorName: 'Amplify',
    subjectArea: 'English Language Arts',
    gradeRange: 'K-5',
    mentionType: 'in_use',
    sourceContext: 'Referenced in board minutes as active elementary ELA in several local districts.',
    sourceId: 'src-la-board',
  },
  {
    mentionId: 'la-pm-3',
    programName: 'StudySync',
    vendorName: 'McGraw-Hill',
    subjectArea: 'English Language Arts',
    gradeRange: '6-12',
    mentionType: 'in_use',
    sourceContext: 'Secondary ELA in some local districts; LCAP actions signal evaluation for replacement.',
    sourceId: 'src-la-lcap-2425',
  },
  {
    mentionId: 'la-pm-4',
    programName: 'i-Ready',
    vendorName: 'Curriculum Associates',
    subjectArea: 'Mathematics',
    gradeRange: 'K-8',
    mentionType: 'in_use',
    sourceContext: 'Used district-wide for diagnostic assessment and intervention; separate from core materials.',
    sourceId: 'src-la-web',
  },
];

INTELLIGENCE_MAP['dist-la-001'] = {
  districtId: 'dist-la-001',
  lastUpdated: '2025-12-01T00:00:00Z',
  goals: LA_GOALS,
  budgetSummary: LA_BUDGET,
  academicDetail: LA_ACADEMIC,
  competitiveLandscape: LA_COMPETITORS,
  keyContacts: LA_CONTACTS,
  goalsBrief: LA_GOALS_BRIEF,
  academicBrief: LA_ACADEMIC_BRIEF,
  competitiveBrief: LA_COMPETITIVE_BRIEF,
  otherFundingSignals: LA_OTHER_FUNDING,
  programMentions: LA_PROGRAM_MENTIONS,
  prioritySummary: 'LAUSD\'s 2024-25 priorities center on math proficiency recovery (32.8%, up from 28.5%), English Learner achievement and reclassification for its 106K EL population, and reducing chronic absenteeism from 25.1%. The district is actively evaluating K-8 math materials aligned to the CA Math Framework and planning a secondary ELA curriculum refresh with emphasis on culturally responsive content. Budget pressure from enrollment decline (548K → 530K over 3 years) drives demand for evidence-based ROI from every curriculum investment.',
  sources: LA_SOURCES,
};

// ============================================================
// TIER 1: SACRAMENTO CITY UNIFIED (dist-sac-001)
// ============================================================

const SAC_SOURCES: IntelligenceSource[] = [
  {
    sourceId: 'src-sac-lcap-2425',
    sourceType: 'lcap',
    name: '2024-25 LCAP',
    academicYear: '2024-25',
    retrievedAt: '2025-11-10T00:00:00Z',
  },
  {
    sourceId: 'src-sac-cde-2324',
    sourceType: 'state_database',
    name: 'CDE DataQuest 2023-24',
    academicYear: '2023-24',
    retrievedAt: '2025-10-01T00:00:00Z',
  },
  {
    sourceId: 'src-sac-web',
    sourceType: 'district_website',
    name: 'SCUSD District Website',
    url: 'https://www.scusd.edu',
    retrievedAt: '2025-12-01T00:00:00Z',
  },
  {
    sourceId: 'src-sac-sales',
    sourceType: 'sales_intelligence',
    name: 'Field Intelligence — Sacramento Region',
    retrievedAt: '2025-11-20T00:00:00Z',
  },
];

const SAC_GOALS: DistrictGoal[] = [
  {
    goalId: 'sac-goal-1',
    goalNumber: 'Goal 1',
    title: 'Academic Excellence: Closing Achievement Gaps in Math and Literacy',
    description: 'Increase proficiency rates in mathematics and English Language Arts for all students, with accelerated progress for English Learners, socioeconomically disadvantaged students, and foster youth. Adopt new standards-aligned instructional materials in both subject areas.',
    goalType: 'Broad',
    academicYear: '2024-25',
    sourceId: 'src-sac-lcap-2425',
    actions: [
      {
        actionId: 'sac-act-1-1',
        actionNumber: 'Action 1.1',
        title: 'K-8 Mathematics Adoption',
        description: 'Complete the K-8 mathematics instructional materials adoption process, including committee evaluation, teacher pilot, community review, and board approval. New materials must align to the 2023 CA Mathematics Framework and demonstrate evidence of effectiveness with high-need student populations.',
        descriptionSummary: 'Full K-8 math adoption cycle — evaluation, pilot, board approval.',
        totalFunds: '$3,200,000',
        fundingSource: 'LCFF Base',
        contributing: false,
        status: 'in_progress',
        sourceId: 'src-sac-lcap-2425',
      },
      {
        actionId: 'sac-act-1-2',
        actionNumber: 'Action 1.2',
        title: 'Secondary ELA Adoption',
        description: 'Initiate the 6-12 ELA instructional materials adoption process with evaluation criteria emphasizing culturally responsive content, integrated ELD, student engagement, and college/career readiness. Pilot phase in Spring 2026.',
        descriptionSummary: '6-12 ELA adoption with culturally responsive and ELD focus.',
        totalFunds: '$1,800,000',
        fundingSource: 'LCFF Base + Supplemental',
        contributing: true,
        status: 'in_progress',
        sourceId: 'src-sac-lcap-2425',
      },
      {
        actionId: 'sac-act-1-3',
        actionNumber: 'Action 1.3',
        title: 'Professional Development for New Materials',
        description: 'Provide comprehensive professional development for teachers adopting new math and ELA materials, including summer institutes, coaching cycles, and PLCs during the school year.',
        totalFunds: '$1,100,000',
        fundingSource: 'Educator Effectiveness Block Grant',
        contributing: false,
        status: 'planned',
        sourceId: 'src-sac-lcap-2425',
      },
    ],
  },
  {
    goalId: 'sac-goal-2',
    goalNumber: 'Goal 2',
    title: 'Equity and Access: English Learner Reclassification and Support',
    description: 'Increase English Learner reclassification rates by 5 percentage points over two years through enhanced ELD instruction, progress monitoring, and instructional materials that integrate designated and integrated ELD across all content areas.',
    goalType: 'Focused',
    academicYear: '2024-25',
    sourceId: 'src-sac-lcap-2425',
    actions: [
      {
        actionId: 'sac-act-2-1',
        actionNumber: 'Action 2.1',
        title: 'ELD Integration in Core Content',
        description: 'Require that all newly adopted math and ELA materials include robust integrated ELD support. Provide additional training for content teachers on ELD strategies.',
        totalFunds: '$800,000',
        fundingSource: 'Title III',
        contributing: true,
        status: 'in_progress',
        sourceId: 'src-sac-lcap-2425',
      },
    ],
  },
  {
    goalId: 'sac-goal-3',
    goalNumber: 'Goal 3',
    title: 'Culturally Responsive Education',
    description: 'Ensure all instructional materials, professional development, and classroom practices reflect the cultural and linguistic diversity of the SCUSD community. Expand access to diverse texts, multilingual resources, and identity-affirming curriculum.',
    goalType: 'Broad',
    academicYear: '2024-25',
    sourceId: 'src-sac-lcap-2425',
    actions: [
      {
        actionId: 'sac-act-3-1',
        actionNumber: 'Action 3.1',
        title: 'Culturally Responsive Materials Criteria',
        description: 'Incorporate culturally responsive evaluation criteria into all instructional materials adoption rubrics. Require publishers to demonstrate authentic representation of diverse communities in student-facing content.',
        totalFunds: '$150,000',
        fundingSource: 'LCFF Supplemental',
        contributing: true,
        status: 'completed',
        sourceId: 'src-sac-lcap-2425',
      },
    ],
  },
];

const SAC_BUDGET: BudgetSummary = {
  academicYear: '2024-25',
  totalBudget: '$520,000,000',
  totalGoalFunding: '$7,050,000',
  fundingBreakdown: [
    { source: 'LCFF Base', amount: '$310,000,000', percentage: 60 },
    { source: 'LCFF Supplemental & Concentration', amount: '$95,000,000', percentage: 18 },
    { source: 'Title I', amount: '$28,000,000', percentage: 5 },
    { source: 'Title III (EL)', amount: '$4,200,000', percentage: 1 },
    { source: 'Special Education', amount: '$52,000,000', percentage: 10 },
    { source: 'Other Federal/State', amount: '$30,800,000', percentage: 6 },
  ],
  highlights: [
    {
      label: 'K-8 Math Adoption Budget',
      amount: '$3,200,000',
      note: 'Active adoption cycle. Evaluation committee convened. Board approval targeted for Spring 2026.',
    },
    {
      label: 'Secondary ELA Adoption Budget',
      amount: '$1,800,000',
      note: 'Evaluation underway. Pilot planned for Spring 2026 with adoption decision by end of 2025-26.',
    },
    {
      label: 'Educator Effectiveness Block Grant',
      amount: '$8,500,000',
      note: 'One-time state funding available through 2026 for PD, coaching, and implementation support.',
    },
  ],
  sourceId: 'src-sac-lcap-2425',
};

const SAC_ACADEMIC: AcademicDetail = {
  academicYear: '2023-24',
  subjectBreakdowns: [
    { subject: 'Mathematics', gradeLevel: 'Grade 3', proficiencyRate: 28.5, priorYearRate: 26.1, studentCount: 2800 },
    { subject: 'Mathematics', gradeLevel: 'Grade 5', proficiencyRate: 23.2, priorYearRate: 21.5, studentCount: 2750 },
    { subject: 'Mathematics', gradeLevel: 'Grade 8', proficiencyRate: 18.9, priorYearRate: 17.2, studentCount: 2600 },
    { subject: 'Mathematics', gradeLevel: 'All', proficiencyRate: 26.0, priorYearRate: 24.1, studentCount: 27000 },
    { subject: 'ELA', gradeLevel: 'Grade 3', proficiencyRate: 34.8, priorYearRate: 33.1, studentCount: 2800 },
    { subject: 'ELA', gradeLevel: 'Grade 5', proficiencyRate: 37.5, priorYearRate: 35.8, studentCount: 2750 },
    { subject: 'ELA', gradeLevel: 'Grade 8', proficiencyRate: 40.2, priorYearRate: 38.5, studentCount: 2600 },
    { subject: 'ELA', gradeLevel: 'All', proficiencyRate: 38.0, priorYearRate: 36.3, studentCount: 27000 },
  ],
  subgroupGaps: [
    { subgroup: 'English Learners', subject: 'Mathematics', proficiencyRate: 10.2, districtOverallRate: 26.0, gapPoints: -15.8 },
    { subgroup: 'English Learners', subject: 'ELA', proficiencyRate: 6.5, districtOverallRate: 38.0, gapPoints: -31.5 },
    { subgroup: 'Socioeconomically Disadvantaged', subject: 'Mathematics', proficiencyRate: 21.3, districtOverallRate: 26.0, gapPoints: -4.7 },
    { subgroup: 'Socioeconomically Disadvantaged', subject: 'ELA', proficiencyRate: 32.1, districtOverallRate: 38.0, gapPoints: -5.9 },
    { subgroup: 'Students with Disabilities', subject: 'Mathematics', proficiencyRate: 7.8, districtOverallRate: 26.0, gapPoints: -18.2 },
    { subgroup: 'Students with Disabilities', subject: 'ELA', proficiencyRate: 10.1, districtOverallRate: 38.0, gapPoints: -27.9 },
    { subgroup: 'African American', subject: 'Mathematics', proficiencyRate: 11.5, districtOverallRate: 26.0, gapPoints: -14.5 },
    { subgroup: 'African American', subject: 'ELA', proficiencyRate: 21.0, districtOverallRate: 38.0, gapPoints: -17.0 },
  ],
  narrative: 'SCUSD shows consistent upward trends in both math (24.1% → 26.0%) and ELA (36.3% → 38.0%), but proficiency remains well below state averages. Math proficiency declines sharply through grade levels, with Grade 8 at just 18.9%. English Learner proficiency in ELA (6.5%) represents the most severe gap. African American students show a 14-17 point gap across subjects. The district\'s active adoption cycle is a direct response to these persistent gaps.',
  sourceId: 'src-sac-cde-2324',
};

const SAC_COMPETITORS: CompetitorEntry[] = [
  {
    entryId: 'sac-comp-1',
    vendorName: 'Houghton Mifflin Harcourt',
    productName: 'Go Math!',
    subjectArea: 'Mathematics',
    gradeRange: 'K-8',
    status: 'expiring',
    contractEndDate: '2026-06-30',
    notes: 'Current math adoption nearing end of contract. Teacher satisfaction is mixed — strong on procedural fluency, weak on conceptual depth. Being replaced through current adoption cycle.',
    confidence: 'confirmed',
    sourceId: 'src-sac-lcap-2425',
  },
  {
    entryId: 'sac-comp-2',
    vendorName: 'McGraw-Hill',
    productName: 'Wonders',
    subjectArea: 'English Language Arts',
    gradeRange: 'K-5',
    status: 'active_contract',
    notes: 'Elementary ELA. Not part of current adoption cycle — secondary ELA is being evaluated separately.',
    confidence: 'confirmed',
    sourceId: 'src-sac-sales',
  },
  {
    entryId: 'sac-comp-3',
    vendorName: 'Amplify',
    productName: 'Amplify ELA',
    subjectArea: 'English Language Arts',
    gradeRange: '6-8',
    status: 'in_evaluation',
    notes: 'Presenting to the secondary ELA adoption committee. Strong digital platform and culturally responsive content. Key competitor for myPerspectives.',
    confidence: 'probable',
    sourceId: 'src-sac-sales',
  },
  {
    entryId: 'sac-comp-4',
    vendorName: 'McGraw-Hill',
    productName: 'Reveal Math',
    subjectArea: 'Mathematics',
    gradeRange: 'K-8',
    status: 'in_evaluation',
    notes: 'Competing in the K-8 math adoption evaluation. Strong standards alignment marketing. Primary math competitor.',
    confidence: 'probable',
    sourceId: 'src-sac-sales',
  },
];

const SAC_CONTACTS: DistrictContact[] = [
  {
    contactId: 'sac-contact-1',
    name: 'Dr. Maria Sandoval',
    title: 'Assistant Superintendent of Curriculum and Instruction',
    department: 'Curriculum and Instruction',
    role: 'decision_maker',
    notes: 'Key decision-maker overseeing both math and ELA adoption processes. Sets evaluation criteria and chairs curriculum council. Meeting with her is the highest-priority stakeholder action.',
    sourceId: 'src-sac-web',
  },
  {
    contactId: 'sac-contact-2',
    name: 'James Chen',
    title: 'Math Curriculum Director',
    department: 'Curriculum and Instruction',
    role: 'evaluator',
    notes: 'Leads K-8 math adoption committee. Vocal advocate for conceptual math instruction aligned to CA Framework. Values embedded formative assessment and adaptive learning. Primary technical evaluator for EnvisionMath.',
    sourceId: 'src-sac-web',
  },
  {
    contactId: 'sac-contact-3',
    name: 'Patricia Washington',
    title: 'ELA Curriculum Director',
    department: 'Curriculum and Instruction',
    role: 'evaluator',
    notes: 'Leads secondary ELA adoption. Background in literacy coaching. Prioritizes culturally responsive texts and authentic student writing experiences. Will rigorously evaluate myPerspectives text anthology.',
    sourceId: 'src-sac-web',
  },
  {
    contactId: 'sac-contact-4',
    name: 'Ana Torres',
    title: 'Director of English Learner Programs',
    department: 'Multilingual Education',
    role: 'influencer',
    notes: 'Critical evaluator for EL support quality. Assesses designated/integrated ELD, primary language resources, and newcomer scaffolding. Her endorsement significantly influences adoption committee recommendations. Schedule a dedicated EL-focused demo.',
    sourceId: 'src-sac-web',
  },
  {
    contactId: 'sac-contact-5',
    name: 'Robert Kim',
    title: 'Chief Business Officer',
    department: 'Business Services',
    role: 'budget_authority',
    notes: 'Manages procurement and budget allocation. Expects transparent multi-year pricing including digital licensing, PD, and implementation support.',
    sourceId: 'src-sac-web',
  },
];

const SAC_GOALS_BRIEF: BriefContent = {
  leadInsight: "SCUSD is in an active adoption cycle for both K-8 mathematics ($3.2M) and secondary ELA 6-12 ($1.8M), with evaluation committees convened and board approval targeted for Spring 2026. Both initiatives are driven by LCAP Goal 1 and a district-wide commitment to closing achievement gaps.",
  keySignals: [
    { label: "Active adoption", value: "K-8 Mathematics — $3.2M allocated", detail: "Evaluation committee convened; board approval Spring 2026" },
    { label: "Active adoption", value: "Secondary ELA (6-12) — $1.8M allocated", detail: "Evaluation underway; pilot planned Spring 2026" },
    { label: "Driving priority", value: "LCAP Goal 1: Academic Excellence — Closing Achievement Gaps" },
    { label: "Scale", value: "27,000 students K-12" },
  ],
};

const SAC_ACADEMIC_BRIEF: BriefContent = {
  leadInsight: "SCUSD math proficiency (26.0%) trails ELA (38.0%) by 12 points, with Grade 8 math at just 18.9%. English Learner achievement gaps are the most severe — EL ELA proficiency at 6.5% is the district's most critical equity challenge. Both subjects show steady upward trends, but proficiency remains well below state averages.",
  keySignals: [
    { label: "Weakest subject", value: "Mathematics — 26.0% proficient", detail: "12 points below ELA; Grade 8 at 18.9%" },
    { label: "English Learners", value: "10.2% math / 6.5% ELA", detail: "Critical EL equity gap across both subjects" },
    { label: "African American students", value: "11.5% math / 21.0% ELA", detail: "14-17 point gap below district average" },
    { label: "Trend", value: "Improving — math up 1.9 pts, ELA up 1.7 pts year-over-year" },
  ],
};

const SAC_COMPETITIVE_BRIEF: BriefContent = {
  leadInsight: "SCUSD's LCAP references an active evaluation for both K-8 math and secondary ELA adoption cycles. HMH Go Math! (current K-8 math) is being replaced through the active adoption cycle, with its contract expiring June 2026. Amplify ELA and McGraw-Hill Reveal Math are identified as presenting to the respective adoption committees.",
  keySignals: [
    { label: "Being replaced", value: "HMH Go Math! (K-8 Math) — contract expiring June 2026" },
    { label: "In evaluation", value: "Amplify ELA (6-8 ELA) — presenting to secondary ELA committee", detail: "Strong digital platform and culturally responsive content" },
    { label: "In evaluation", value: "McGraw-Hill Reveal Math (K-8) — competing in math adoption evaluation" },
  ],
};

const SAC_OTHER_FUNDING: OtherFundingSignal[] = [
  {
    name: "Educator Effectiveness Block Grant",
    amount: "$8,500,000",
    sourceType: "state allocation",
    expiration: "2026",
    relevanceNote: "One-time funding available for PD, coaching, and implementation support",
  },
];

const SAC_PROGRAM_MENTIONS: ProgramMention[] = [
  {
    mentionId: 'sac-pm-1',
    programName: 'Go Math!',
    vendorName: 'Houghton Mifflin Harcourt',
    subjectArea: 'Mathematics',
    gradeRange: 'K-8',
    mentionType: 'in_use',
    sourceContext: 'Current math adoption; contract expiring June 2026 and being replaced through active adoption cycle.',
    sourceId: 'src-sac-lcap-2425',
  },
  {
    mentionId: 'sac-pm-2',
    programName: 'Wonders',
    vendorName: 'McGraw-Hill',
    subjectArea: 'English Language Arts',
    gradeRange: 'K-5',
    mentionType: 'in_use',
    sourceContext: 'Elementary ELA; not part of current adoption cycle.',
    sourceId: 'src-sac-sales',
  },
  {
    mentionId: 'sac-pm-3',
    programName: 'Amplify ELA',
    vendorName: 'Amplify',
    subjectArea: 'English Language Arts',
    gradeRange: '6-8',
    mentionType: 'under_evaluation',
    sourceContext: 'Presenting to the secondary ELA adoption committee; strong digital platform and culturally responsive content.',
    sourceId: 'src-sac-sales',
  },
  {
    mentionId: 'sac-pm-4',
    programName: 'Reveal Math',
    vendorName: 'McGraw-Hill',
    subjectArea: 'Mathematics',
    gradeRange: 'K-8',
    mentionType: 'under_evaluation',
    sourceContext: 'Competing in the K-8 math adoption evaluation; strong standards alignment marketing.',
    sourceId: 'src-sac-sales',
  },
];

INTELLIGENCE_MAP['dist-sac-001'] = {
  districtId: 'dist-sac-001',
  lastUpdated: '2025-12-01T00:00:00Z',
  goals: SAC_GOALS,
  budgetSummary: SAC_BUDGET,
  academicDetail: SAC_ACADEMIC,
  competitiveLandscape: SAC_COMPETITORS,
  keyContacts: SAC_CONTACTS,
  goalsBrief: SAC_GOALS_BRIEF,
  academicBrief: SAC_ACADEMIC_BRIEF,
  competitiveBrief: SAC_COMPETITIVE_BRIEF,
  otherFundingSignals: SAC_OTHER_FUNDING,
  programMentions: SAC_PROGRAM_MENTIONS,
  prioritySummary: 'SCUSD is in an active adoption cycle for both K-8 math and secondary ELA — the strongest timing signal in the pipeline. The district\'s LCAP priorities center on closing achievement gaps (math at 26%, ELA at 38%), EL reclassification, and culturally responsive curriculum. Evaluation committees are convened, budgets are allocated ($3.2M math, $1.8M ELA), and board approval is targeted for Spring 2026. As the state capital\'s urban core district, SCUSD\'s adoption decisions influence the broader Sacramento region.',
  sources: SAC_SOURCES,
};

// ============================================================
// TIER 1: TWIN RIVERS USD (dist-tr-001)
// ============================================================

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

// ============================================================
// TIER 1: FRESNO UNIFIED (dist-fre-001)
// ============================================================

const FRE_SOURCES: IntelligenceSource[] = [
  {
    sourceId: 'src-fre-lcap-2425',
    sourceType: 'lcap',
    name: '2024-25 LCAP',
    academicYear: '2024-25',
    retrievedAt: '2025-11-08T00:00:00Z',
  },
  {
    sourceId: 'src-fre-cde-2324',
    sourceType: 'state_database',
    name: 'CDE DataQuest 2023-24',
    academicYear: '2023-24',
    retrievedAt: '2025-10-01T00:00:00Z',
  },
  {
    sourceId: 'src-fre-web',
    sourceType: 'district_website',
    name: 'Fresno USD District Website',
    url: 'https://www.fresnounified.org',
    retrievedAt: '2025-12-01T00:00:00Z',
  },
  {
    sourceId: 'src-fre-sales',
    sourceType: 'sales_intelligence',
    name: 'Field Intelligence — Central Valley Region',
    retrievedAt: '2025-10-15T00:00:00Z',
  },
];

const FRE_GOALS: DistrictGoal[] = [
  {
    goalId: 'fre-goal-1',
    goalNumber: 'Goal 1',
    title: 'Academic Achievement: Math and Literacy Proficiency',
    description: 'Increase student proficiency in mathematics and ELA, with emphasis on students performing below grade level. Support the successful implementation of newly adopted K-8 mathematics materials and strengthen literacy instruction across all grade levels.',
    goalType: 'Broad',
    academicYear: '2024-25',
    sourceId: 'src-fre-lcap-2425',
    actions: [
      {
        actionId: 'fre-act-1-1',
        actionNumber: 'Action 1.1',
        title: 'K-8 Math Materials Implementation Support',
        description: 'Provide ongoing professional development, coaching, and classroom support for teachers implementing the newly adopted K-8 mathematics program. Includes summer institute, monthly PLCs, and instructional coaching cycles.',
        descriptionSummary: 'PD and coaching for newly adopted math program (year 1 implementation).',
        totalFunds: '$2,800,000',
        fundingSource: 'LCFF Base + Educator Effectiveness',
        contributing: false,
        status: 'in_progress',
        sourceId: 'src-fre-lcap-2425',
      },
      {
        actionId: 'fre-act-1-2',
        actionNumber: 'Action 1.2',
        title: 'Math Intervention for Below-Grade-Level Students',
        description: 'Expand math intervention programs for students in grades 3-8 performing two or more years below grade level, using diagnostic data to target instruction.',
        totalFunds: '$1,500,000',
        fundingSource: 'Title I',
        contributing: true,
        status: 'in_progress',
        sourceId: 'src-fre-lcap-2425',
      },
      {
        actionId: 'fre-act-1-3',
        actionNumber: 'Action 1.3',
        title: 'Literacy Across Content Areas',
        description: 'Strengthen disciplinary literacy instruction across all content areas in grades 6-12, with focus on academic vocabulary, text complexity, and evidence-based writing.',
        totalFunds: '$900,000',
        fundingSource: 'LCFF Supplemental',
        contributing: true,
        status: 'planned',
        sourceId: 'src-fre-lcap-2425',
      },
    ],
  },
  {
    goalId: 'fre-goal-2',
    goalNumber: 'Goal 2',
    title: 'Student Engagement and Attendance',
    description: 'Reduce chronic absenteeism from 30.7% to below 25% through comprehensive attendance strategies, family engagement, expanded mental health services, and school climate improvements.',
    goalType: 'Broad',
    academicYear: '2024-25',
    sourceId: 'src-fre-lcap-2425',
    actions: [
      {
        actionId: 'fre-act-2-1',
        actionNumber: 'Action 2.1',
        title: 'Attendance Intervention Specialists',
        description: 'Hire 25 additional attendance intervention specialists deployed to high-absenteeism schools for direct family outreach, barrier removal, and re-engagement.',
        totalFunds: '$3,100,000',
        fundingSource: 'LCFF Supplemental & Concentration',
        contributing: true,
        status: 'in_progress',
        sourceId: 'src-fre-lcap-2425',
      },
    ],
  },
  {
    goalId: 'fre-goal-3',
    goalNumber: 'Goal 3',
    title: 'English Learner Achievement',
    description: 'Increase English Learner reclassification rates and close proficiency gaps through enhanced designated ELD, integrated ELD across content areas, and primary language support for newcomers.',
    goalType: 'Focused',
    academicYear: '2024-25',
    sourceId: 'src-fre-lcap-2425',
    actions: [
      {
        actionId: 'fre-act-3-1',
        actionNumber: 'Action 3.1',
        title: 'ELD Integration in New Math Adoption',
        description: 'Ensure the newly adopted math materials are implemented with fidelity to their ELD components. Provide supplementary ELD training for math teachers serving classrooms with 30%+ English Learners.',
        totalFunds: '$450,000',
        fundingSource: 'Title III',
        contributing: true,
        status: 'in_progress',
        sourceId: 'src-fre-lcap-2425',
      },
    ],
  },
];

const FRE_BUDGET: BudgetSummary = {
  academicYear: '2024-25',
  totalBudget: '$1,100,000,000',
  totalGoalFunding: '$8,750,000',
  fundingBreakdown: [
    { source: 'LCFF Base', amount: '$580,000,000', percentage: 53 },
    { source: 'LCFF Supplemental & Concentration', amount: '$250,000,000', percentage: 23 },
    { source: 'Title I', amount: '$65,000,000', percentage: 6 },
    { source: 'Title III (EL)', amount: '$8,500,000', percentage: 1 },
    { source: 'Special Education', amount: '$120,000,000', percentage: 11 },
    { source: 'Other Federal/State', amount: '$76,500,000', percentage: 6 },
  ],
  highlights: [
    {
      label: 'Math Adoption Implementation Budget',
      amount: '$2,800,000',
      note: 'Year 1 implementation of newly adopted program. Budget committed to PD, coaching, and rollout — not available for alternative materials.',
    },
    {
      label: 'Chronic Absenteeism Initiative',
      amount: '$3,100,000',
      note: 'Major district investment in attendance recovery. 25 new specialists. Largest single LCAP action item.',
    },
    {
      label: 'Supplemental/Concentration Grant',
      amount: '$250,000,000',
      note: 'Significant S&C allocation driven by 87% FRPM. Potential source for supplemental instructional resources outside core adoption.',
    },
  ],
  sourceId: 'src-fre-lcap-2425',
};

const FRE_ACADEMIC: AcademicDetail = {
  academicYear: '2023-24',
  subjectBreakdowns: [
    { subject: 'Mathematics', gradeLevel: 'Grade 3', proficiencyRate: 27.8, priorYearRate: 24.5, studentCount: 5100 },
    { subject: 'Mathematics', gradeLevel: 'Grade 5', proficiencyRate: 21.5, priorYearRate: 19.2, studentCount: 5000 },
    { subject: 'Mathematics', gradeLevel: 'Grade 8', proficiencyRate: 16.3, priorYearRate: 14.8, studentCount: 4700 },
    { subject: 'Mathematics', gradeLevel: 'All', proficiencyRate: 25.1, priorYearRate: 22.5, studentCount: 48000 },
    { subject: 'ELA', gradeLevel: 'Grade 3', proficiencyRate: 30.5, priorYearRate: 28.8, studentCount: 5100 },
    { subject: 'ELA', gradeLevel: 'Grade 5', proficiencyRate: 33.2, priorYearRate: 31.0, studentCount: 5000 },
    { subject: 'ELA', gradeLevel: 'Grade 8', proficiencyRate: 36.8, priorYearRate: 34.5, studentCount: 4700 },
    { subject: 'ELA', gradeLevel: 'All', proficiencyRate: 34.7, priorYearRate: 32.2, studentCount: 48000 },
  ],
  subgroupGaps: [
    { subgroup: 'English Learners', subject: 'Mathematics', proficiencyRate: 11.8, districtOverallRate: 25.1, gapPoints: -13.3 },
    { subgroup: 'English Learners', subject: 'ELA', proficiencyRate: 5.2, districtOverallRate: 34.7, gapPoints: -29.5 },
    { subgroup: 'Socioeconomically Disadvantaged', subject: 'Mathematics', proficiencyRate: 22.8, districtOverallRate: 25.1, gapPoints: -2.3 },
    { subgroup: 'Socioeconomically Disadvantaged', subject: 'ELA', proficiencyRate: 31.5, districtOverallRate: 34.7, gapPoints: -3.2 },
    { subgroup: 'Students with Disabilities', subject: 'Mathematics', proficiencyRate: 6.5, districtOverallRate: 25.1, gapPoints: -18.6 },
    { subgroup: 'Students with Disabilities', subject: 'ELA', proficiencyRate: 8.3, districtOverallRate: 34.7, gapPoints: -26.4 },
    { subgroup: 'Hispanic/Latino', subject: 'Mathematics', proficiencyRate: 19.5, districtOverallRate: 25.1, gapPoints: -5.6 },
    { subgroup: 'African American', subject: 'Mathematics', proficiencyRate: 10.2, districtOverallRate: 25.1, gapPoints: -14.9 },
    { subgroup: 'African American', subject: 'ELA', proficiencyRate: 16.8, districtOverallRate: 34.7, gapPoints: -17.9 },
    { subgroup: 'Hmong', subject: 'Mathematics', proficiencyRate: 18.1, districtOverallRate: 25.1, gapPoints: -7.0 },
    { subgroup: 'Hmong', subject: 'ELA', proficiencyRate: 22.5, districtOverallRate: 34.7, gapPoints: -12.2 },
  ],
  narrative: 'Fresno shows meaningful improvement from a very low base (math 22.5% → 25.1%, ELA 32.2% → 34.7%), but three-quarters of students remain below grade level in math. Grade 8 math proficiency at 16.3% is critically low. English Learner proficiency gaps are severe (5.2% in ELA), and African American students trail by 15-18 points. The Hmong subgroup, significant in Fresno\'s Central Valley demographics, also shows persistent gaps. The recently adopted math program will be measured against these baselines.',
  sourceId: 'src-fre-cde-2324',
};

const FRE_COMPETITORS: CompetitorEntry[] = [
  {
    entryId: 'fre-comp-1',
    vendorName: 'Curriculum Associates',
    productName: 'Ready Mathematics',
    subjectArea: 'Mathematics',
    gradeRange: 'K-8',
    status: 'recently_adopted',
    contractEndDate: '2030-06-30',
    notes: 'Won the 2024 competitive adoption. Multi-year contract through 2030. District has invested heavily in implementation, PD, and teacher training. Year 1 implementation underway.',
    confidence: 'confirmed',
    sourceId: 'src-fre-sales',
  },
  {
    entryId: 'fre-comp-2',
    vendorName: 'Curriculum Associates',
    productName: 'i-Ready Diagnostic',
    subjectArea: 'Mathematics',
    gradeRange: 'K-8',
    status: 'active_contract',
    notes: 'Diagnostic and adaptive practice platform paired with Ready Mathematics core adoption. Embedded in the implementation strategy.',
    confidence: 'confirmed',
    sourceId: 'src-fre-sales',
  },
  {
    entryId: 'fre-comp-3',
    vendorName: 'McGraw-Hill',
    productName: 'StudySync',
    subjectArea: 'English Language Arts',
    gradeRange: '6-12',
    status: 'active_contract',
    notes: 'Current secondary ELA. Not in an active replacement cycle but has been in place for several years.',
    confidence: 'probable',
    sourceId: 'src-fre-sales',
  },
];

const FRE_CONTACTS: DistrictContact[] = [
  {
    contactId: 'fre-contact-1',
    name: 'Misty Her',
    title: 'Superintendent',
    department: 'Office of the Superintendent',
    role: 'decision_maker',
    notes: 'Focused on steady improvement for high-need population. Invested in the success of the current math adoption. Receptive to partners who support broader goals without competing with existing commitments.',
    sourceId: 'src-fre-web',
  },
  {
    contactId: 'fre-contact-2',
    name: 'Kevin Yamamoto',
    title: 'Math Curriculum Coordinator',
    department: 'Curriculum and Instruction',
    role: 'evaluator',
    notes: 'Managing K-8 math implementation and teacher coaching for newly adopted program. Deeply invested in current adoption success. Not an audience for alternative math pitches. Build collegial relationship through PD channels.',
    sourceId: 'src-fre-web',
  },
  {
    contactId: 'fre-contact-3',
    name: 'Rosa Hernandez',
    title: 'Director of English Learner Services',
    department: 'Multilingual Education',
    role: 'influencer',
    notes: 'With 14,340 ELs and 87% FRPM, EL services are central to Fresno\'s identity. Potential entry point for supplemental EL-focused math resources that complement the core adoption.',
    sourceId: 'src-fre-web',
  },
  {
    contactId: 'fre-contact-4',
    name: 'Thomas Reyes',
    title: 'Associate Superintendent of Curriculum and Instruction',
    department: 'Curriculum and Instruction',
    role: 'decision_maker',
    notes: 'Oversaw the math adoption committee. His credibility is tied to the current adoption\'s success. Approach with respect — acknowledge the decision and offer to be a resource for the next cycle.',
    sourceId: 'src-fre-web',
  },
];

const FRE_GOALS_BRIEF: BriefContent = {
  leadInsight: "Fresno Unified recently completed a K-8 math adoption (Curriculum Associates Ready Mathematics, contract through 2030), eliminating near-term math opportunity. Current LCAP priorities focus on successful implementation of the new math program, reducing 30.7% chronic absenteeism, and supporting 14,340 English Learners. No active materials evaluation is signaled for 2024-25.",
  keySignals: [
    { label: "Recently adopted", value: "K-8 Mathematics — Curriculum Associates, contract through 2030", detail: "Year 1 implementation underway; $2.8M PD and rollout budget" },
    { label: "Primary priority", value: "Chronic Absenteeism — 30.7% rate, $3.1M intervention initiative" },
    { label: "EL focus", value: "14,340 English Learners — ELD integration in math implementation" },
    { label: "Next window", value: "Math adoption cycle estimated 2029-2031" },
  ],
};

const FRE_ACADEMIC_BRIEF: BriefContent = {
  leadInsight: "Fresno shows meaningful improvement from a low base — math up to 25.1% (from 22.5%), ELA up to 34.7% (from 32.2%) — but three-quarters of students remain below grade level in math. Grade 8 math proficiency at 16.3% is critically low. English Learner proficiency gaps are severe, with EL ELA at just 5.2%, and the Hmong student population shows persistent gaps across both subjects.",
  keySignals: [
    { label: "Weakest subject", value: "Mathematics — 25.1% proficient", detail: "Grade 8 at 16.3%; improving from 22.5% prior year" },
    { label: "English Learners", value: "11.8% math / 5.2% ELA", detail: "Most severe EL ELA gap among comparable districts" },
    { label: "African American students", value: "10.2% math / 16.8% ELA", detail: "15-18 point gap below district average" },
    { label: "Hmong subgroup", value: "18.1% math / 22.5% ELA", detail: "Significant in Fresno's Central Valley demographics" },
  ],
};

const FRE_COMPETITIVE_BRIEF: BriefContent = {
  leadInsight: "Fresno's LCAP references Curriculum Associates Ready Mathematics as the recently adopted K-8 math program, with a multi-year contract through 2030. i-Ready Diagnostic is paired with the core adoption as the assessment and intervention platform. McGraw-Hill StudySync is referenced as the current secondary ELA program with no active replacement cycle signaled.",
  keySignals: [
    { label: "Recently adopted", value: "Curriculum Associates Ready Mathematics (K-8)", detail: "Multi-year contract through 2030; Year 1 implementation" },
    { label: "Paired platform", value: "i-Ready Diagnostic — math assessment and adaptive intervention (K-8)" },
    { label: "Current ELA", value: "McGraw-Hill StudySync (6-12) — no active replacement cycle" },
  ],
};

const FRE_PROGRAM_MENTIONS: ProgramMention[] = [
  {
    mentionId: 'fre-pm-1',
    programName: 'Ready Mathematics',
    vendorName: 'Curriculum Associates',
    subjectArea: 'Mathematics',
    gradeRange: 'K-8',
    mentionType: 'in_use',
    sourceContext: 'Won the 2024 competitive adoption; multi-year contract through 2030 with Year 1 implementation underway.',
    sourceId: 'src-fre-sales',
  },
  {
    mentionId: 'fre-pm-2',
    programName: 'i-Ready Diagnostic',
    vendorName: 'Curriculum Associates',
    subjectArea: 'Mathematics',
    gradeRange: 'K-8',
    mentionType: 'in_use',
    sourceContext: 'Diagnostic and adaptive practice platform paired with Ready Mathematics core adoption.',
    sourceId: 'src-fre-sales',
  },
  {
    mentionId: 'fre-pm-3',
    programName: 'StudySync',
    vendorName: 'McGraw-Hill',
    subjectArea: 'English Language Arts',
    gradeRange: '6-12',
    mentionType: 'in_use',
    sourceContext: 'Current secondary ELA; no active replacement cycle signaled.',
    sourceId: 'src-fre-sales',
  },
];

INTELLIGENCE_MAP['dist-fre-001'] = {
  districtId: 'dist-fre-001',
  lastUpdated: '2025-12-01T00:00:00Z',
  goals: FRE_GOALS,
  budgetSummary: FRE_BUDGET,
  academicDetail: FRE_ACADEMIC,
  competitiveLandscape: FRE_COMPETITORS,
  keyContacts: FRE_CONTACTS,
  goalsBrief: FRE_GOALS_BRIEF,
  academicBrief: FRE_ACADEMIC_BRIEF,
  competitiveBrief: FRE_COMPETITIVE_BRIEF,
  programMentions: FRE_PROGRAM_MENTIONS,
  prioritySummary: 'Fresno Unified recently completed a K-8 math adoption (Curriculum Associates, contract through 2030), eliminating near-term math sales opportunity. Current priorities focus on successful implementation of the new math program, reducing 30.7% chronic absenteeism, and supporting 14,340 English Learners. Math proficiency at 25.1% and ELA at 34.7% will be the baseline against which the new adoption is measured. Long-term relationship building for the next adoption cycle (est. 2029-2031) is the strategic play.',
  sources: FRE_SOURCES,
};

// ============================================================
// TIER 2: SAN FRANCISCO UNIFIED (dist-sf-001)
// ============================================================

const SF_GOALS_BRIEF: BriefContent = {
  leadInsight: "SFUSD is in a review phase for K-8 math materials, evaluating alignment with the CA Math Framework, but has not initiated an active adoption cycle. The district's Literacy Equity Initiative ($1.2M) focuses on culturally affirming texts — not a core curriculum replacement. No active curriculum procurement is signaled for 2024-25.",
  keySignals: [
    { label: "Math review", value: "K-8 Mathematics — framework alignment review, $250K", detail: "Review phase only; adoption timeline TBD based on findings" },
    { label: "Active initiative", value: "Literacy Equity Initiative — $1.2M for culturally affirming texts" },
    { label: "No active adoption", value: "No core curriculum procurement signaled for 2024-25" },
  ],
};

INTELLIGENCE_MAP['dist-sf-001'] = {
  districtId: 'dist-sf-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: SF_GOALS_BRIEF,
  goals: [
    {
      goalId: 'sf-goal-1',
      goalNumber: 'Goal 1',
      title: 'Equitable Access to Rigorous Academics',
      description: 'Ensure all students, particularly African American, Latino, Pacific Islander, English Learner, and socioeconomically disadvantaged students, have access to rigorous grade-level instruction in mathematics and literacy.',
      goalType: 'Broad',
      academicYear: '2024-25',
      sourceId: 'src-sf-lcap',
      actions: [
        {
          actionId: 'sf-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Math Instructional Materials Review',
          description: 'Review current K-8 mathematics materials for alignment with updated California Mathematics Framework. Determine timeline for potential adoption cycle.',
          totalFunds: '$250,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress',
          sourceId: 'src-sf-lcap',
        },
        {
          actionId: 'sf-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Literacy Equity Initiative',
          description: 'Expand access to diverse, culturally affirming texts across all grade levels with a focus on decolonizing curriculum and centering student identity.',
          totalFunds: '$1,200,000',
          fundingSource: 'LCFF Supplemental',
          contributing: true,
          status: 'in_progress',
          sourceId: 'src-sf-lcap',
        },
      ],
    },
    {
      goalId: 'sf-goal-2',
      goalNumber: 'Goal 2',
      title: 'Social-Emotional Wellness and School Climate',
      description: 'Strengthen social-emotional learning, restorative practices, and mental health supports to improve school climate and reduce disparities in discipline outcomes.',
      goalType: 'Broad',
      academicYear: '2024-25',
      sourceId: 'src-sf-lcap',
    },
  ],
  budgetSummary: {
    academicYear: '2024-25',
    totalBudget: '$1,050,000,000',
    totalGoalFunding: '$1,450,000',
    highlights: [
      {
        label: 'Math Materials Review',
        amount: '$250,000',
        note: 'Review phase only — not yet in active adoption. Timeline for full adoption TBD based on review findings.',
      },
      {
        label: 'Literacy Equity Initiative',
        amount: '$1,200,000',
        note: 'Supplemental-funded push for diverse texts. Potential entry point for myPerspectives conversation.',
      },
    ],
    sourceId: 'src-sf-lcap',
  },
  keyContacts: [
    {
      contactId: 'sf-contact-1',
      name: 'Dr. Matt Wayne',
      title: 'Superintendent',
      department: 'Office of the Superintendent',
      role: 'decision_maker',
      notes: 'Focused on equity-driven outcomes and community engagement in curriculum decisions.',
      sourceId: 'src-sf-web',
    },
    {
      contactId: 'sf-contact-2',
      name: 'Jennifer Kwong',
      title: 'Executive Director, Curriculum and Instruction',
      department: 'Academics',
      role: 'decision_maker',
      notes: 'Leads curriculum strategy. Would manage any future adoption process.',
      sourceId: 'src-sf-web',
    },
  ],
  prioritySummary: 'SFUSD is in a review (not adoption) phase for K-8 math materials, evaluating alignment with the CA Math Framework. The district\'s equity-driven LCAP priorities and Literacy Equity Initiative create potential openings for culturally responsive ELA conversations. Not in active procurement but building toward a future adoption decision.',
  sources: [
    {
      sourceId: 'src-sf-lcap',
      sourceType: 'lcap',
      name: '2024-25 LCAP',
      academicYear: '2024-25',
      retrievedAt: '2025-11-10T00:00:00Z',
    },
    {
      sourceId: 'src-sf-web',
      sourceType: 'district_website',
      name: 'SFUSD District Website',
      retrievedAt: '2025-11-15T00:00:00Z',
    },
  ],
};

// ============================================================
// TIER 2: SAN DIEGO UNIFIED (dist-sd-001)
// ============================================================

const SD_GOALS_BRIEF: BriefContent = {
  leadInsight: "San Diego USD is planning a K-5 math materials pilot for Spring 2026, with 20 representative schools participating. The current HMH Into Math contract has 2 years remaining but an early performance-based review has been initiated. No active ELA procurement is signaled.",
  keySignals: [
    { label: "Planned pilot", value: "K-5 Mathematics — 20-school pilot, Spring 2026, $800K", detail: "Early review initiated due to performance concerns with current program" },
    { label: "Stable ELA", value: "Elementary ELA (Amplify) — strong teacher satisfaction, no replacement cycle" },
    { label: "Driving priority", value: "LCAP Goal 1: Accelerating Student Achievement" },
  ],
};

const SD_COMPETITIVE_BRIEF: BriefContent = {
  leadInsight: "SDUSD's LCAP references an early review of K-5 math materials, with HMH Into Math under performance-based early review despite 2 years remaining on contract. Amplify ELA is referenced as the elementary ELA program with strong teacher satisfaction and no active replacement cycle signaled.",
  keySignals: [
    { label: "Under review", value: "HMH Into Math (K-5 Math) — early review due to performance concerns", detail: "Contract has 2 years remaining (expires 2027)" },
    { label: "Stable", value: "Amplify ELA (K-5 ELA) — strong teacher satisfaction, not up for replacement" },
  ],
};

const SD_PROGRAM_MENTIONS: ProgramMention[] = [
  {
    mentionId: 'sd-pm-1',
    programName: 'Into Math',
    vendorName: 'Houghton Mifflin Harcourt',
    subjectArea: 'Mathematics',
    gradeRange: 'K-5',
    mentionType: 'in_use',
    sourceContext: 'Current elementary math; early review initiated due to performance concerns despite 2 years remaining on contract.',
    sourceId: 'src-sd-sales',
  },
  {
    mentionId: 'sd-pm-2',
    programName: 'Amplify ELA',
    vendorName: 'Amplify',
    subjectArea: 'English Language Arts',
    gradeRange: 'K-5',
    mentionType: 'in_use',
    sourceContext: 'Elementary ELA with strong teacher satisfaction; not expected to be replaced in near term.',
    sourceId: 'src-sd-sales',
  },
];

INTELLIGENCE_MAP['dist-sd-001'] = {
  districtId: 'dist-sd-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: SD_GOALS_BRIEF,
  competitiveBrief: SD_COMPETITIVE_BRIEF,
  programMentions: SD_PROGRAM_MENTIONS,
  goals: [
    {
      goalId: 'sd-goal-1',
      goalNumber: 'Goal 1',
      title: 'Accelerating Student Achievement',
      description: 'Accelerate academic achievement in mathematics and ELA for all students, with targeted support for English Learners, students with disabilities, and historically underserved populations.',
      goalType: 'Broad',
      academicYear: '2024-25',
      sourceId: 'src-sd-lcap',
      actions: [
        {
          actionId: 'sd-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Elementary Math Materials Pilot',
          description: 'Pilot two finalist K-5 mathematics programs in 20 representative schools during Spring 2026. Collect teacher feedback, student engagement data, and preliminary achievement results.',
          totalFunds: '$800,000',
          fundingSource: 'LCFF Base',
          status: 'planned',
          sourceId: 'src-sd-lcap',
        },
      ],
    },
  ],
  competitiveLandscape: [
    {
      entryId: 'sd-comp-1',
      vendorName: 'Houghton Mifflin Harcourt',
      productName: 'Into Math',
      subjectArea: 'Mathematics',
      gradeRange: 'K-5',
      status: 'active_contract',
      contractEndDate: '2027-06-30',
      notes: 'Current elementary math. Contract has 2 years remaining but district has initiated early review due to performance concerns.',
      confidence: 'confirmed',
      sourceId: 'src-sd-sales',
    },
    {
      entryId: 'sd-comp-2',
      vendorName: 'Amplify',
      productName: 'Amplify ELA',
      subjectArea: 'English Language Arts',
      gradeRange: 'K-5',
      status: 'active_contract',
      notes: 'Strong teacher satisfaction. Not expected to be replaced in near term.',
      confidence: 'confirmed',
      sourceId: 'src-sd-sales',
    },
  ],
  keyContacts: [
    {
      contactId: 'sd-contact-1',
      name: 'Dr. Lamont Jackson',
      title: 'Superintendent',
      department: 'Office of the Superintendent',
      role: 'decision_maker',
      notes: 'Focus on academic acceleration and equity. Supports evidence-based materials evaluation.',
      sourceId: 'src-sd-web',
    },
    {
      contactId: 'sd-contact-2',
      name: 'Sarah Mitchell',
      title: 'Area Superintendent, Teaching and Learning',
      department: 'Teaching and Learning',
      role: 'decision_maker',
      notes: 'Oversees curriculum adoption process. Key relationship for positioning EnvisionMath in the pilot phase.',
      sourceId: 'src-sd-web',
    },
  ],
  prioritySummary: 'San Diego USD is planning a K-5 math materials pilot for Spring 2026, with 20 schools participating. The current HMH Into Math contract runs through 2027 but early review has been initiated due to performance concerns. Elementary ELA (Amplify) is stable. Math pilot represents a near-term opportunity for EnvisionMath.',
  sources: [
    {
      sourceId: 'src-sd-lcap',
      sourceType: 'lcap',
      name: '2024-25 LCAP',
      academicYear: '2024-25',
      retrievedAt: '2025-11-10T00:00:00Z',
    },
    {
      sourceId: 'src-sd-web',
      sourceType: 'district_website',
      name: 'SDUSD District Website',
      retrievedAt: '2025-11-15T00:00:00Z',
    },
    {
      sourceId: 'src-sd-sales',
      sourceType: 'sales_intelligence',
      name: 'Field Intelligence — San Diego Region',
      retrievedAt: '2025-10-20T00:00:00Z',
    },
  ],
};

// ============================================================
// TIER 2: OAKLAND UNIFIED (dist-oak-001)
// ============================================================

const OAK_GOALS_BRIEF: BriefContent = {
  leadInsight: "Oakland USD is conducting a needs assessment for potential math and ELA adoption cycles, but no active procurement has been initiated. Current K-8 math uses Illustrative Mathematics (OER), which has strong teacher buy-in but limited adaptive technology and EL supports. Budget constraints significantly shape any future materials decision.",
  keySignals: [
    { label: "Needs assessment", value: "K-8 Math and ELA — adoption needs assessment underway, $1.8M", detail: "OER-based math (Illustrative Mathematics) in place; assessing capability gaps" },
    { label: "Fiscal constraint", value: "LCAP Goal 2: Fiscal Stability — school closures and budget pressure ongoing" },
    { label: "No active adoption", value: "No confirmed adoption cycle for 2024-25" },
  ],
};

const OAK_COMPETITIVE_BRIEF: BriefContent = {
  leadInsight: "Oakland's LCAP references Illustrative Mathematics as the current K-8 math program — an OER curriculum with strong teacher buy-in but identified gaps in adaptive technology and differentiation for English Learners. No ELA program mentions were extracted from available district documents.",
  keySignals: [
    { label: "Current K-8 math", value: "Illustrative Mathematics (K-5 and 6-8)", detail: "OER-based; strong teacher support; limited adaptive technology and EL scaffolding" },
    { label: "Identified gap", value: "Differentiation and EL support limitations reported by teachers" },
  ],
};

const OAK_PROGRAM_MENTIONS: ProgramMention[] = [
  {
    mentionId: 'oak-pm-1',
    programName: 'IM K-5 Math',
    vendorName: 'Illustrative Mathematics',
    subjectArea: 'Mathematics',
    gradeRange: 'K-5',
    mentionType: 'in_use',
    sourceContext: 'OER-based math curriculum with strong teacher buy-in; limited adaptive technology and EL supports.',
    sourceId: 'src-oak-sales',
  },
  {
    mentionId: 'oak-pm-2',
    programName: 'IM 6-8 Math',
    vendorName: 'Illustrative Mathematics',
    subjectArea: 'Mathematics',
    gradeRange: '6-8',
    mentionType: 'in_use',
    sourceContext: 'Extension of K-5 OER adoption; teachers report challenges with differentiation.',
    sourceId: 'src-oak-sales',
  },
];

INTELLIGENCE_MAP['dist-oak-001'] = {
  districtId: 'dist-oak-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: OAK_GOALS_BRIEF,
  competitiveBrief: OAK_COMPETITIVE_BRIEF,
  programMentions: OAK_PROGRAM_MENTIONS,
  goals: [
    {
      goalId: 'oak-goal-1',
      goalNumber: 'Goal 1',
      title: 'Quality Community Schools for All',
      description: 'Provide high-quality, culturally responsive instruction in every school, with targeted academic support for African American, Latino, English Learner, and Pacific Islander students.',
      goalType: 'Broad',
      academicYear: '2024-25',
      sourceId: 'src-oak-lcap',
      actions: [
        {
          actionId: 'oak-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Standards-Aligned Instructional Materials',
          description: 'Ensure all schools have access to standards-aligned, culturally responsive instructional materials in core subjects. Conduct needs assessment for potential math and ELA adoption cycles.',
          totalFunds: '$1,800,000',
          fundingSource: 'LCFF Supplemental',
          contributing: true,
          status: 'in_progress',
          sourceId: 'src-oak-lcap',
        },
      ],
    },
    {
      goalId: 'oak-goal-2',
      goalNumber: 'Goal 2',
      title: 'Fiscal Stability and Responsible Resource Allocation',
      description: 'Maintain fiscal stability while investing strategically in instructional quality, community schools, and student support services.',
      goalType: 'Broad',
      academicYear: '2024-25',
      sourceId: 'src-oak-lcap',
    },
  ],
  competitiveLandscape: [
    {
      entryId: 'oak-comp-1',
      vendorName: 'Illustrative Mathematics',
      productName: 'IM K-5 Math',
      subjectArea: 'Mathematics',
      gradeRange: 'K-5',
      status: 'active_contract',
      notes: 'OER-based math curriculum. Strong teacher buy-in. Low cost but limited adaptive technology and EL supports.',
      confidence: 'confirmed',
      sourceId: 'src-oak-sales',
    },
    {
      entryId: 'oak-comp-2',
      vendorName: 'Illustrative Mathematics',
      productName: 'IM 6-8 Math',
      subjectArea: 'Mathematics',
      gradeRange: '6-8',
      status: 'active_contract',
      notes: 'Extension of K-5 adoption. Coherent K-8 implementation but teachers report challenges with differentiation.',
      confidence: 'confirmed',
      sourceId: 'src-oak-sales',
    },
  ],
  keyContacts: [
    {
      contactId: 'oak-contact-1',
      name: 'Kyla Johnson-Trammell',
      title: 'Superintendent',
      department: 'Office of the Superintendent',
      role: 'decision_maker',
      notes: 'Long-serving superintendent navigating fiscal challenges and school closures. Curriculum investments must demonstrate clear cost-effectiveness.',
      sourceId: 'src-oak-web',
    },
    {
      contactId: 'oak-contact-2',
      name: 'Marcus Williams',
      title: 'Executive Director of Academics',
      department: 'Academics',
      role: 'decision_maker',
      notes: 'Manages instructional strategy. Focus on culturally responsive pedagogy and community schools model.',
      sourceId: 'src-oak-web',
    },
  ],
  prioritySummary: 'Oakland USD\'s primary focus is fiscal stability alongside instructional quality. Current K-8 math uses Illustrative Mathematics (OER), which has strong teacher support but limited adaptive technology and EL scaffolding. A needs assessment for potential adoption cycles is underway. Budget constraints mean any new materials adoption must demonstrate clear cost advantage or significant capability improvement over current OER approach.',
  sources: [
    {
      sourceId: 'src-oak-lcap',
      sourceType: 'lcap',
      name: '2024-25 LCAP',
      academicYear: '2024-25',
      retrievedAt: '2025-11-10T00:00:00Z',
    },
    {
      sourceId: 'src-oak-web',
      sourceType: 'district_website',
      name: 'OUSD District Website',
      retrievedAt: '2025-11-15T00:00:00Z',
    },
    {
      sourceId: 'src-oak-sales',
      sourceType: 'sales_intelligence',
      name: 'Field Intelligence — East Bay Region',
      retrievedAt: '2025-10-25T00:00:00Z',
    },
  ],
};

// ============================================================
// TIER 2: LONG BEACH UNIFIED (dist-lb-001)
// ============================================================

const LB_GOALS_BRIEF: BriefContent = {
  leadInsight: "Long Beach USD is focused on continuous improvement of current K-8 math materials rather than replacement, with ongoing coaching and PD driving the $1.5M LCAP action. The district is conducting a data-driven evaluation of whether supplemental or replacement materials are needed. No active adoption cycle has been initiated.",
  keySignals: [
    { label: "Improvement focus", value: "K-8 Mathematics — coaching and PD for current materials, $1.5M", detail: "Evaluating need for supplemental or replacement based on student outcome data" },
    { label: "No active adoption", value: "No core curriculum procurement signaled for 2024-25" },
    { label: "Driving priority", value: "LCAP Goal 1: Academic Achievement for Every Student" },
  ],
};

INTELLIGENCE_MAP['dist-lb-001'] = {
  districtId: 'dist-lb-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: LB_GOALS_BRIEF,
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
  budgetSummary: {
    academicYear: '2024-25',
    totalBudget: '$1,300,000,000',
    highlights: [
      {
        label: 'Math Continuous Improvement',
        amount: '$1,500,000',
        note: 'Focused on coaching and PD for current materials. No active adoption cycle, but evaluation of need for supplemental/replacement is underway.',
      },
    ],
    sourceId: 'src-lb-lcap',
  },
  keyContacts: [
    {
      contactId: 'lb-contact-1',
      name: 'Dr. Jill Baker',
      title: 'Superintendent',
      department: 'Office of the Superintendent',
      role: 'decision_maker',
      notes: 'LBUSD is nationally recognized for sustained improvement. Baker values data-driven decision-making and systematic implementation. District culture is methodical — don\'t rush the process.',
      sourceId: 'src-lb-web',
    },
    {
      contactId: 'lb-contact-2',
      name: 'Tiffany Brown',
      title: 'Deputy Superintendent of Curriculum, Instruction, and PD',
      department: 'Curriculum and Instruction',
      role: 'decision_maker',
      notes: 'Oversees all instructional materials decisions. Emphasis on coherent K-12 systems and professional learning communities.',
      sourceId: 'src-lb-web',
    },
  ],
  prioritySummary: 'Long Beach USD is a nationally recognized district focused on continuous improvement of current K-8 math materials rather than replacement. The district is evaluating whether supplemental or replacement materials are needed based on student outcome data. LBUSD\'s methodical, data-driven culture means building a case over time rather than pushing for immediate adoption.',
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
