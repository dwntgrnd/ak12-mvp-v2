// District intelligence mock fixtures
//
// Consumed directly by research tab components — no service layer.
// Content is generated (not real LCAP data) but modeled on realistic
// district contexts consistent with existing playbook narratives.
//
// Tier 1 (rich): LA, Sacramento, Fresno — all 5 categories
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
  // Sacramento City Unified (dist-sac-001) is not in the 50-district CDE fixture set
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
  if (intel.goals && intel.goals.length > 0) categories.push('goals');
  if (intel.budgetSummary) categories.push('budgetSummary');
  if (intel.academicDetail) categories.push('academicDetail');
  if (intel.competitiveLandscape && intel.competitiveLandscape.length > 0) categories.push('competitiveLandscape');
  if (intel.keyContacts && intel.keyContacts.length > 0) categories.push('keyContacts');
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

INTELLIGENCE_MAP['dist-la-001'] = {
  districtId: 'dist-la-001',
  lastUpdated: '2025-12-01T00:00:00Z',
  goals: LA_GOALS,
  budgetSummary: LA_BUDGET,
  academicDetail: LA_ACADEMIC,
  competitiveLandscape: LA_COMPETITORS,
  keyContacts: LA_CONTACTS,
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

INTELLIGENCE_MAP['dist-sac-001'] = {
  districtId: 'dist-sac-001',
  lastUpdated: '2025-12-01T00:00:00Z',
  goals: SAC_GOALS,
  budgetSummary: SAC_BUDGET,
  academicDetail: SAC_ACADEMIC,
  competitiveLandscape: SAC_COMPETITORS,
  keyContacts: SAC_CONTACTS,
  prioritySummary: 'SCUSD is in an active adoption cycle for both K-8 math and secondary ELA — the strongest timing signal in the pipeline. The district\'s LCAP priorities center on closing achievement gaps (math at 26%, ELA at 38%), EL reclassification, and culturally responsive curriculum. Evaluation committees are convened, budgets are allocated ($3.2M math, $1.8M ELA), and board approval is targeted for Spring 2026. As the state capital\'s urban core district, SCUSD\'s adoption decisions influence the broader Sacramento region.',
  sources: SAC_SOURCES,
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

INTELLIGENCE_MAP['dist-fre-001'] = {
  districtId: 'dist-fre-001',
  lastUpdated: '2025-12-01T00:00:00Z',
  goals: FRE_GOALS,
  budgetSummary: FRE_BUDGET,
  academicDetail: FRE_ACADEMIC,
  competitiveLandscape: FRE_COMPETITORS,
  keyContacts: FRE_CONTACTS,
  prioritySummary: 'Fresno Unified recently completed a K-8 math adoption (Curriculum Associates, contract through 2030), eliminating near-term math sales opportunity. Current priorities focus on successful implementation of the new math program, reducing 30.7% chronic absenteeism, and supporting 14,340 English Learners. Math proficiency at 25.1% and ELA at 34.7% will be the baseline against which the new adoption is measured. Long-term relationship building for the next adoption cycle (est. 2029-2031) is the strategic play.',
  sources: FRE_SOURCES,
};

// ============================================================
// TIER 2: SAN FRANCISCO UNIFIED (dist-sf-001)
// ============================================================

INTELLIGENCE_MAP['dist-sf-001'] = {
  districtId: 'dist-sf-001',
  lastUpdated: '2025-11-15T00:00:00Z',
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

INTELLIGENCE_MAP['dist-sd-001'] = {
  districtId: 'dist-sd-001',
  lastUpdated: '2025-11-15T00:00:00Z',
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

INTELLIGENCE_MAP['dist-oak-001'] = {
  districtId: 'dist-oak-001',
  lastUpdated: '2025-11-15T00:00:00Z',
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

INTELLIGENCE_MAP['dist-lb-001'] = {
  districtId: 'dist-lb-001',
  lastUpdated: '2025-11-15T00:00:00Z',
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
