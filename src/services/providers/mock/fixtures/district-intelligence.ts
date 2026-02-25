// District intelligence mock fixtures
//
// Consumed directly by research tab components — no service layer.
// Content is generated (not real LCAP data) but modeled on realistic
// district contexts consistent with existing playbook narratives.
//
// Tier 1 (rich): LA, Sacramento, Twin Rivers, Fresno — all 3 brief categories
// Tier 2 (moderate): SF, SD, Oakland, Long Beach — 3-4 categories
// Tier 3 (light): remaining 46 districts — goalsBrief, academicBrief, 1 goal, prioritySummary

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
  '55ce12af-7cdb-4ec1-9974-7c4a9e40a315': 'dist-smb-001',    // Santa Maria-Bonita Elementary
  '73e0fb10-4b06-4aff-b4f6-380214a59ae0': 'dist-napa-001',   // Napa Valley Unified
  '23f2b75a-07c4-423d-9ab0-903ba166b249': 'dist-salinas-001', // Salinas Union High
  '1c7b20ee-45a3-4d2d-8337-4f0032fbd075': 'dist-mod-001',    // Modesto City High
  'd7a32616-4f9a-45ca-8797-ddf03587fd34': 'dist-chico-001',  // Chico Unified
  'a2671310-4656-4e43-a91a-7688536f1764': 'dist-elk-001',      // Elk Grove Unified
  'fa25b52f-3c45-4b47-8720-3accf44ab842': 'dist-cnorco-001',   // Corona-Norco Unified
  '15af6c1f-5b42-4fa6-abaa-986d0afee1f5': 'dist-sjuan-001',    // San Juan Unified
  '7897e111-527a-4d70-b6e2-0a297f9ad5bf': 'dist-sbern-001',    // San Bernardino City Unified
  '310fa476-24fe-4696-bbc4-d01e125b4e34': 'dist-cap-001',      // Capistrano Unified
  '4777a49f-978f-482d-b053-5a7bfbebae90': 'dist-kern-001',     // Kern High
  'e3427a7e-efd1-44fe-8573-7ac7610b45ed': 'dist-stock-001',    // Stockton Unified
  '0f23870f-6168-46fe-960e-899025ae10da': 'dist-sweet-001',    // Sweetwater Union High
  '54b40e55-2941-43e7-8cdd-2101349efe37': 'dist-mtd-001',      // Mt. Diablo Unified
  '5e410fee-9464-4eb9-b8f4-349e165f5740': 'dist-vis-001',      // Visalia Unified
  'b9a91263-4410-4a13-a1ae-96677027acf7': 'dist-sj-001',       // San Jose Unified
  '840c532c-f029-48af-8e57-8f71b3ee6ae0': 'dist-mad-001',      // Madera Unified
  'f4d0ece3-3e64-416f-8549-caa0146bee77': 'dist-fair-001',     // Fairfield-Suisun Unified
  '1667672a-ef32-4065-8ee8-b67a69c1cbd3': 'dist-paj-001',      // Pajaro Valley Unified
  '2c538df1-d21d-416c-9c4f-8aec8ab96ad0': 'dist-oxnard-001',   // Oxnard Union High
  '11d1b43b-586d-42ec-8be5-ea83b24b7c28': 'dist-rock-001',     // Rocklin Unified
  '31a0f1bb-2a28-43db-ae76-7e2916b19dae': 'dist-yuba-001',     // Yuba City Unified
  '77488938-5d99-414b-8a2c-0c395f0f4adb': 'dist-merced-001',   // Merced Union High
  '8970bf30-3a73-4aef-bac4-e773dab339ca': 'dist-mary-001',     // Marysville Joint Unified
  'e95a0540-534a-420a-af38-c33c60e494e8': 'dist-buck-001',     // Buckeye Union Elementary
  'bb533420-8e78-47b6-b4bc-dc09c8cd6e53': 'dist-smfc-001',     // San Mateo-Foster City
  '84c89208-cf71-468e-969a-cab2528aa5d4': 'dist-srh-001',      // Santa Rosa High
  'ecb2fb58-21ec-491a-98ec-8add3ebadbd8': 'dist-lucia-001',    // Lucia Mar Unified
  '39a3e761-e22c-4f14-8bb0-39cf580086d3': 'dist-wood-001',     // Woodland Joint Unified
  'c3c2f2b5-ad90-422a-b2cb-2c995a9f8bcf': 'dist-cal-001',      // Calexico Unified
  '6fa577ff-4381-4c2e-85d3-e0b3a503b2a9': 'dist-nov-001',      // Novato Unified
  '5e80bc34-17dd-4b19-88cf-87377234c012': 'dist-ukiah-001',    // Ukiah Unified
  '5c0442de-591c-4b8b-8b3f-f3eaa80900ac': 'dist-holl-001',     // Hollister
  '9d6f1608-f6f2-4476-b27d-0e3249722056': 'dist-hanf-001',     // Hanford Elementary
  '9961f954-c0dc-434c-9166-f1069108c780': 'dist-shasta-001',   // Shasta Union High
  '18af7485-62fb-4a12-aa6a-fb2cd41fdc61': 'dist-hb-001',       // Huntington Beach City Elementary
  'e32e62ae-bbeb-42a0-b092-f8019bed741a': 'dist-atwater-001',  // Atwater Elementary
  '8be57c39-e8d1-45d9-b9ec-efa7fbe4ec6c': 'dist-mag-001',      // Magnolia Elementary
  '706685ad-c142-4951-8977-d51ca0f4078f': 'dist-lawn-001',     // Lawndale Elementary
  '225d146c-3c6c-435c-ae8c-5927486e7548': 'dist-sre-001',      // Santa Rosa Elementary
  '4c36fa20-73f2-482b-afcf-954290061a6e': 'dist-burton-001',   // Burton Elementary
  'b0198e3d-a98c-4211-baf0-74d929c1ec54': 'dist-lake-001',     // Lakeside Union Elementary
  'e53aefb5-2ae7-48e6-b6e5-47bef921cea6': 'dist-orcutt-001',   // Orcutt Union Elementary
  '2db5ede7-e3dd-465b-baa4-931fc4d91191': 'dist-mtview-001',   // Mountain View Elementary
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

// ============================================================
// TIER 3: SANTA MARIA-BONITA ELEMENTARY (dist-smb-001)
// ============================================================

INTELLIGENCE_MAP['dist-smb-001'] = {
  districtId: 'dist-smb-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Santa Maria-Bonita is a high-need K-8 district with 56.5% English Learners and 89.8% FRPM — among the highest ELL concentrations in Santa Barbara County. The district\'s LCAP is heavily oriented toward English Learner achievement and reclassification, with substantial LCFF Supplemental & Concentration and Title III funding available. Math proficiency at 16.47% and ELA at 24.89% signal urgent need for foundational literacy and numeracy intervention. Low chronic absenteeism (12.5%) is a district strength and unusual positive for this demographic profile.',
    keySignals: [
      { label: 'ELL concentration', value: '56.5% English Learners (9,690 students)', detail: 'One of the highest ELL rates in the county — primary LCAP driver' },
      { label: 'FRPM rate', value: '89.8% — $4M+ in Supplemental & Concentration funding available' },
      { label: 'Math proficiency', value: '16.47% — extremely low, multi-year stagnation', detail: 'Persistent gap signals need for foundational numeracy intervention at K-5 level' },
      { label: 'ELA proficiency', value: '24.89% — declining 2021-22 then slight recovery', detail: 'Foundational literacy is a core LCAP priority across all grade bands' },
      { label: 'Chronic absenteeism', value: '12.5% — notable strength for this demographic profile' },
    ],
  },
  goals: [
    {
      goalId: 'smb-goal-1',
      goalNumber: 'Goal 1',
      title: 'English Learner Achievement and Reclassification',
      description: 'Increase English Learner reclassification rates and academic achievement in English Language Arts and mathematics through expanded designated and integrated ELD instruction, primary language support, and rigorous progress monitoring in grades K-8.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-smb-lcap',
      actions: [
        {
          actionId: 'smb-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Designated ELD Instructional Materials and Coaching',
          description: 'Adopt and implement designated ELD instructional materials for grades K-8 aligned with CA ELD Standards. Provide teacher coaching and release time for collaborative planning of ELD lessons integrated with foundational literacy.',
          totalFunds: '$2,800,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-smb-lcap',
        },
        {
          actionId: 'smb-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Primary Language Literacy Bridges (Spanish)',
          description: 'Expand access to Spanish-language foundational literacy materials and dual-language pathway resources for newcomer and emerging bilingual students in grades K-3, supporting transfer of literacy skills to English.',
          totalFunds: '$1,200,000',
          fundingSource: 'Title III',
          status: 'in_progress' as const,
          sourceId: 'src-smb-lcap',
        },
        {
          actionId: 'smb-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'EL Progress Monitoring and Reclassification Support',
          description: 'Implement a structured reclassification process with diagnostic checkpoints, teacher support protocols, and family notification systems to accelerate reclassification timelines for long-term English Learners.',
          totalFunds: '$650,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-smb-lcap',
        },
      ],
    },
    {
      goalId: 'smb-goal-2',
      goalNumber: 'Goal 2',
      title: 'Academic Achievement in Mathematics',
      description: 'Increase the percentage of students meeting or exceeding grade-level standards in mathematics in grades K-8, with targeted intervention for students performing significantly below grade level and embedded EL supports throughout math instruction.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-smb-lcap',
      actions: [
        {
          actionId: 'smb-act-2-1',
          actionNumber: 'Action 2.1',
          title: 'K-8 Math Intervention and Foundational Numeracy',
          description: 'Provide targeted math intervention for students in grades K-8 performing below grade level, using diagnostic assessment data to assign tiered supports. Prioritize foundational numeracy skills in primary grades.',
          totalFunds: '$1,900,000',
          fundingSource: 'Title I',
          status: 'in_progress' as const,
          sourceId: 'src-smb-lcap',
        },
        {
          actionId: 'smb-act-2-2',
          actionNumber: 'Action 2.2',
          title: 'Math Instructional Coaching and Materials Alignment',
          description: 'Deploy math instructional coaches to support implementation of grade-level math materials with embedded English Language Development strategies for bilingual and English Learner students across all grade levels.',
          totalFunds: '$950,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-smb-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 16.47% and ELA at 24.89%, Santa Maria-Bonita\'s academic profile reflects the compounding challenge of serving a majority English Learner population with extremely high economic disadvantage. Math performance has been essentially flat for three years despite targeted investment. ELA declined from 26.53% in 2021-22 before a modest 2023-24 recovery to 24.89%. Chronic absenteeism at 12.5% is a genuine district strength that creates a stable instructional foundation for any intervention investment.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '16.47%', detail: '3-year range: 16.00%–16.47% — no meaningful growth' },
      { label: 'ELA proficiency (2023-24)', value: '24.89%', detail: 'Down from 26.53% in 2021-22; partial recovery from 2022-23 low of 24.41%' },
      { label: 'English Learner share', value: '56.5% of enrollment', detail: 'ELL academic outcomes drive overall proficiency rates' },
      { label: 'FRPM rate', value: '89.8% (2023-24)' },
      { label: 'Chronic absenteeism', value: '12.5% — below state average, notable for high-need context' },
    ],
  },
  prioritySummary: 'Santa Maria-Bonita is one of California\'s highest-need K-8 districts by ELL concentration and FRPM rate. The district\'s strongest funding levers are LCFF Supplemental & Concentration and Title III, both available for EL-serving programs and interventions. Math at 16.47% and ELA at 24.89% create dual-subject urgency. Any pitch should lead with EL-specific instructional materials (designated ELD, bilingual resources) and foundational literacy/numeracy — not college readiness framing. Low chronic absenteeism is a positive signal: students are in seats, awaiting effective instruction.',
  sources: [
    { sourceId: 'src-smb-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-smb-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: NAPA VALLEY UNIFIED (dist-napa-001)
// ============================================================

INTELLIGENCE_MAP['dist-napa-001'] = {
  districtId: 'dist-napa-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Napa Valley Unified is a mid-size K-12 district facing a convergence of pressures: math proficiency stagnant at 27.80%, ELA declining for two straight years (−2.18 pts), FRPM rising sharply to 63.9%, and chronic absenteeism at 20.5% — exactly at the state "high" threshold. The district\'s shifting economic profile (FRPM up from 49.4% in 2021-22) unlocks growing LCFF Supplemental & Concentration eligibility, increasing available resources for high-need interventions. No active curriculum adoption is publicly signaled, making this a relationship-building window.',
    keySignals: [
      { label: 'Math proficiency', value: '27.80% — flat 3-year trend', detail: 'No growth from 27.16% (2021-22); persistent gap across K-12' },
      { label: 'ELA proficiency', value: '40.68% — declining 2 consecutive years', detail: 'Down from 42.86% (2021-22); approaching 40% floor' },
      { label: 'FRPM trajectory', value: '63.9% (2023-24) vs. 49.4% (2021-22)', detail: 'Rapid rise unlocks Supplemental & Concentration funding access' },
      { label: 'Chronic absenteeism', value: '20.5% — at state "high" threshold', detail: 'Attendance intervention is a likely LCAP priority this cycle' },
      { label: 'ELL share', value: '23.9% — below 25% threshold, growing slightly' },
    ],
  },
  goals: [
    {
      goalId: 'napa-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Achievement in Mathematics',
      description: 'Increase the percentage of students in grades K-12 meeting or exceeding grade-level standards in mathematics, with a focus on closing persistent gaps for socioeconomically disadvantaged students, English Learners, and students with disabilities.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-napa-lcap',
      actions: [
        {
          actionId: 'napa-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'K-12 Math Instructional Materials Evaluation',
          description: 'Conduct a structured evaluation of current K-12 mathematics materials for alignment with the 2023 California Mathematics Framework, including data review on student outcomes by subgroup. Determine need and timeline for potential adoption.',
          totalFunds: '$320,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-napa-lcap',
        },
        {
          actionId: 'napa-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Targeted Math Intervention — Grades 6-10',
          description: 'Implement structured math intervention supports for students in grades 6-10 performing below grade level, using diagnostic screeners to place students in tiered support models including teacher-led intervention periods and supplemental digital tools.',
          totalFunds: '$1,100,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-napa-lcap',
        },
      ],
    },
    {
      goalId: 'napa-goal-2',
      goalNumber: 'Goal 2',
      title: 'Literacy and Language Arts Achievement',
      description: 'Reverse the two-year decline in ELA proficiency and increase the percentage of students meeting or exceeding grade-level standards in English Language Arts across K-12, with targeted support for students reading below grade level and English Learners.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-napa-lcap',
      actions: [
        {
          actionId: 'napa-act-2-1',
          actionNumber: 'Action 2.1',
          title: 'K-8 Foundational Literacy Strengthening',
          description: 'Audit K-8 ELA instructional materials for alignment with the science of reading. Provide professional development in structured literacy approaches and identify targeted supplemental resources for students below grade level.',
          totalFunds: '$850,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-napa-lcap',
        },
        {
          actionId: 'napa-act-2-2',
          actionNumber: 'Action 2.2',
          title: 'Secondary Reading Acceleration Program',
          description: 'Expand access to structured reading intervention supports for secondary students (grades 6-12) reading significantly below grade level, with progress monitoring and teacher coaching on comprehension and academic literacy strategies.',
          totalFunds: '$620,000',
          fundingSource: 'Title I',
          status: 'planned' as const,
          sourceId: 'src-napa-lcap',
        },
      ],
    },
    {
      goalId: 'napa-goal-3',
      goalNumber: 'Goal 3',
      title: 'Student Engagement and Attendance',
      description: 'Reduce chronic absenteeism from 20.5% toward the state target through proactive attendance monitoring, family engagement, and school climate improvements that foster student connection and belonging.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-napa-lcap',
      actions: [
        {
          actionId: 'napa-act-3-1',
          actionNumber: 'Action 3.1',
          title: 'Attendance Intervention and Family Outreach',
          description: 'Deploy attendance counselors and family liaison staff at highest-need schools to provide early outreach, barrier identification, and wraparound coordination for chronically absent students.',
          totalFunds: '$780,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-napa-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'Napa Valley Unified\'s academic profile is sliding: ELA fell from 42.86% to 40.68% over two years while math has stagnated near 27-28% across the same period. Chronic absenteeism at 20.5% compounds instructional loss. The district\'s FRPM rate jumped 14 points in two years — a structural shift that reflects economic displacement in the Napa Valley region and signals growing need for supplemental support services alongside academic intervention.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '27.80%', detail: 'Flat across 3 years; systemic math challenge across grade bands' },
      { label: 'ELA proficiency (2023-24)', value: '40.68%', detail: 'Two-year decline from 42.86%; at risk of falling below 40%' },
      { label: 'FRPM (2023-24)', value: '63.9%', detail: 'Up from 49.4% in 2021-22 — rapid economic disadvantage increase' },
      { label: 'Chronic absenteeism', value: '20.5% — state "high" classification threshold' },
    ],
  },
  prioritySummary: 'Napa Valley Unified presents a genuine dual-subject opportunity: math at 27.80% with no growth trajectory, and ELA actively declining. The district\'s rapidly rising FRPM rate is unlocking greater Supplemental & Concentration funding, expanding the resource pool for high-need programming. No active adoption cycle is publicly signaled — this is a positioning and relationship-building window. Lead with math (stagnation narrative + framework alignment) and layer in ELA (declining trend + science of reading urgency). Attendance intervention is also an active LCAP priority.',
  sources: [
    { sourceId: 'src-napa-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-napa-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: SALINAS UNION HIGH (dist-salinas-001)
// ============================================================

INTELLIGENCE_MAP['dist-salinas-001'] = {
  districtId: 'dist-salinas-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Salinas Union High is a grades 7-12 district with the highest FRPM rate in this cohort at 92.9% — a Title I and LCFF Supplemental & Concentration powerhouse. Math proficiency is critically low at 18.08% despite a slight uptick, and ELA has fluctuated around 42% without sustained improvement. The district serves a predominantly Latino, economically disadvantaged student body in one of California\'s most agriculture-dependent economies. College and career readiness, not foundational skills remediation, is the appropriate framing given the secondary-only scope.',
    keySignals: [
      { label: 'FRPM rate', value: '92.9% (2023-24) — extremely high', detail: 'Maximum Supplemental & Concentration and Title I funding leverage' },
      { label: 'Math proficiency', value: '18.08% — critically low, marginal improvement', detail: 'Up from 17.36% (2021-22); no sustained acceleration' },
      { label: 'ELA proficiency', value: '42.79% — fluctuating without sustained trend' },
      { label: 'Enrollment trajectory', value: 'Declining: 16,525 → 16,225 over 3 years' },
      { label: 'ELL share', value: '19.4% (2023-24), down from 23.5% (2021-22)' },
    ],
  },
  goals: [
    {
      goalId: 'salinas-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Achievement in Mathematics',
      description: 'Increase the percentage of students in grades 7-12 meeting or exceeding grade-level standards in mathematics, with urgency around Algebra I/II completion rates, math course pathways for college readiness, and targeted intervention for students two or more years below grade level.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-salinas-lcap',
      actions: [
        {
          actionId: 'salinas-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Secondary Math Intervention Courses and Supports',
          description: 'Expand access to math intervention and bridge courses for students entering grades 7-8 below grade level in mathematics, with structured pathways to on-track Algebra I completion and beyond.',
          totalFunds: '$2,100,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-salinas-lcap',
        },
        {
          actionId: 'salinas-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Math Instructional Coaching and Materials Review',
          description: 'Deploy secondary math instructional coaches across all sites and initiate a review of current 7-12 math materials for alignment with the 2023 California Mathematics Framework, with emphasis on college preparatory pathways.',
          totalFunds: '$980,000',
          fundingSource: 'Title I',
          status: 'planned' as const,
          sourceId: 'src-salinas-lcap',
        },
      ],
    },
    {
      goalId: 'salinas-goal-2',
      goalNumber: 'Goal 2',
      title: 'Equitable Access to Quality Instruction',
      description: 'Ensure all students, particularly socioeconomically disadvantaged students and English Learners, have access to rigorous grade-level instruction, qualified teachers, and the academic and social-emotional supports necessary for college and career readiness.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-salinas-lcap',
      actions: [
        {
          actionId: 'salinas-act-2-1',
          actionNumber: 'Action 2.1',
          title: 'College and Career Readiness Pathways Expansion',
          description: 'Expand access to Advanced Placement, dual enrollment, and CTE pathway courses at all comprehensive high schools. Provide targeted academic counseling for underrepresented students to increase A-G completion rates.',
          totalFunds: '$1,500,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-salinas-lcap',
        },
        {
          actionId: 'salinas-act-2-2',
          actionNumber: 'Action 2.2',
          title: 'Integrated ELD and Academic Literacy Support (7-12)',
          description: 'Strengthen integrated ELD supports across content-area instruction for English Learner students in grades 7-12, with emphasis on academic language development in mathematics and English Language Arts.',
          totalFunds: '$720,000',
          fundingSource: 'Title III',
          status: 'planned' as const,
          sourceId: 'src-salinas-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'Salinas Union High\'s math proficiency at 18.08% is among the lowest for a secondary-only district — a persistent crisis that has seen minimal movement over three years. ELA at 42.79% is more stable but still below the 50% mark. With 92.9% FRPM, the district qualifies for maximum high-need funding, yet academic outcomes have not responded to investment. The declining ELL share (19.4%, down from 23.5%) suggests some reclassification progress, but economic disadvantage remains the dominant challenge.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '18.08%', detail: 'Marginal gain from 17.36% (2021-22); 3-year low was 16.94% in 2022-23' },
      { label: 'ELA proficiency (2023-24)', value: '42.79%', detail: 'No sustained trend — fluctuated between 40.88% and 42.79%' },
      { label: 'FRPM rate', value: '92.9% — maximum high-need classification' },
      { label: 'ELL share', value: '19.4%, declining — reclassification progress possible' },
    ],
  },
  prioritySummary: 'Salinas Union High is a secondary-only district (grades 7-12) with one of the highest FRPM rates in California. Math at 18.08% is the defining academic crisis — framing should center on college readiness and A-G pathway completion, not foundational skills (which are an elementary concern). The district\'s extreme high-need status means Title I and LCFF Supplemental & Concentration funding are abundant. Any pitch should emphasize middle and high school math pathway materials, intervention programs aligned to secondary standards, and EL academic language supports integrated into content-area instruction.',
  sources: [
    { sourceId: 'src-salinas-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-salinas-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: MODESTO CITY HIGH (dist-mod-001)
// ============================================================

INTELLIGENCE_MAP['dist-mod-001'] = {
  districtId: 'dist-mod-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Modesto City High is a grades 6-Adult district showing genuine academic momentum — ELA improved from 42.89% to 48.04% (+5.15 pts over two years) and math climbed from 15.78% to 19.04% (+3.26 pts). This positive trajectory distinguishes Modesto City High from peers. However, chronic absenteeism at 25.1% is a serious drag on progress and an active LCAP priority. The district serves a predominantly socioeconomically disadvantaged population at 67.1% FRPM with moderate ELL concentration at 16.6%.',
    keySignals: [
      { label: 'ELA momentum', value: '48.04% (+5.15 pts since 2021-22)', detail: 'Consistent improvement across three years — instructional investment is working' },
      { label: 'Math momentum', value: '19.04% (+3.26 pts since 2021-22)', detail: 'Positive trend but still critically low; further intervention warranted' },
      { label: 'Chronic absenteeism', value: '25.1% — high, active LCAP priority', detail: 'Attendance loss threatens to undermine academic gains' },
      { label: 'FRPM rate', value: '67.1% — significant high-need funding access' },
      { label: 'ELL share', value: '16.6% — moderate, growing slightly' },
    ],
  },
  goals: [
    {
      goalId: 'mod-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Achievement in Mathematics',
      description: 'Accelerate growth in mathematics proficiency for students in grades 6-12, building on recent improvement trends through expanded intervention, revised course pathways, and instructional coaching. Close persistent gaps between current proficiency (19.04%) and college-readiness benchmarks.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-mod-lcap',
      actions: [
        {
          actionId: 'mod-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Secondary Math Pathway Redesign and Intervention',
          description: 'Redesign 6-12 math course pathways to increase access to grade-level content while providing structured intervention for students below grade level. Implement diagnostic tools to identify students needing bridge supports at grade 6 entry.',
          totalFunds: '$1,800,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-mod-lcap',
        },
        {
          actionId: 'mod-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Math Materials Review and Supplemental Resources',
          description: 'Review current 6-12 mathematics instructional materials for alignment with the California Mathematics Framework. Identify supplemental resources to support the improving trajectory and address remaining gaps in Algebra I readiness.',
          totalFunds: '$480,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-mod-lcap',
        },
      ],
    },
    {
      goalId: 'mod-goal-2',
      goalNumber: 'Goal 2',
      title: 'Student Engagement and Attendance',
      description: 'Reduce chronic absenteeism from 25.1% through coordinated attendance intervention, school climate improvements, and community outreach — protecting academic gains from attendance-driven instructional loss.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-mod-lcap',
      actions: [
        {
          actionId: 'mod-act-2-1',
          actionNumber: 'Action 2.1',
          title: 'Multi-Tiered Attendance Intervention System',
          description: 'Implement a multi-tiered attendance intervention system with early warning data dashboards, site-based attendance counselors, and family engagement liaisons. Prioritize students with 10%+ absence rates for individualized outreach.',
          totalFunds: '$1,200,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-mod-lcap',
        },
        {
          actionId: 'mod-act-2-2',
          actionNumber: 'Action 2.2',
          title: 'School Climate and Student Belonging Initiative',
          description: 'Invest in school climate improvements including advisory programs, restorative practices, and extracurricular expansion to increase student connection and reduce attendance barriers related to disengagement.',
          totalFunds: '$650,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-mod-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'Modesto City High is one of the few districts in this cohort showing clear academic momentum. ELA at 48.04% is approaching the 50% proficiency mark — a psychologically significant threshold for a high-need urban district. Math at 19.04% remains critically low in absolute terms but the trajectory (+3.26 pts over two years) is the story. Chronic absenteeism at 25.1% is the primary risk to sustaining these gains: students missing instruction cannot benefit from improved materials or teaching.',
    keySignals: [
      { label: 'ELA proficiency (2023-24)', value: '48.04%', detail: 'Up from 42.89% (2021-22) — strongest 2-year gain in this peer cohort' },
      { label: 'Math proficiency (2023-24)', value: '19.04%', detail: 'Up from 15.78% (2021-22) — positive trend, low absolute baseline' },
      { label: 'Chronic absenteeism', value: '25.1% — primary threat to academic progress' },
      { label: 'FRPM rate', value: '67.1% — high-need funding available' },
    ],
  },
  prioritySummary: 'Modesto City High is a grades 6-12 district with improving academics and a serious attendance problem. The ELA momentum story (+5.15 pts) is a sales narrative asset: frame any ELA materials pitch as an accelerant for a trajectory already in motion. Math at 19.04% is the primary academic gap — college readiness and Algebra pathway framing is appropriate for a secondary-only district. Attendance at 25.1% is an active LCAP priority with dedicated funding. Lead with the momentum narrative and position products as what helps Modesto finish the job.',
  sources: [
    { sourceId: 'src-mod-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-mod-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: CHICO UNIFIED (dist-chico-001)
// ============================================================

INTELLIGENCE_MAP['dist-chico-001'] = {
  districtId: 'dist-chico-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Chico Unified is a mid-size K-12 unified district in Butte County with academic performance above peer averages but a concerning two-year decline in both ELA (−2.30 pts) and math (down from a 2022-23 high of 40.03% to 38.89%). Math fell back below 40% after briefly clearing that threshold — a setback that signals implementation challenges rather than a sustained trajectory. With low ELL concentration (6.1%) and moderate FRPM (51.5%), Chico USD occupies a "middle tier" need profile where LCFF Base plus modest Supplemental funding are the primary levers.',
    keySignals: [
      { label: 'Math decline', value: '38.89% (down from 40.03% peak in 2022-23)', detail: 'Fell below 40% after brief improvement — potential implementation gap' },
      { label: 'ELA decline', value: '52.87% (down from 55.17% in 2021-22)', detail: '2-year decline of −2.30 pts; approaching 50% floor' },
      { label: 'FRPM rate', value: '51.5% — moderate; some Supplemental & Concentration access' },
      { label: 'ELL share', value: '6.1% — low; not a primary driver of district strategy' },
      { label: 'Chronic absenteeism', value: '17.2% — moderate, manageable' },
    ],
  },
  goals: [
    {
      goalId: 'chico-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Excellence for All Students',
      description: 'Reverse two-year declines in mathematics and English Language Arts proficiency and accelerate achievement toward state and district benchmarks across K-12, with focused investment in consistent instructional implementation and evidence-based teaching practices.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-chico-lcap',
      actions: [
        {
          actionId: 'chico-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Mathematics Recovery and Acceleration Initiative',
          description: 'Analyze root causes of the 2023-24 math proficiency decline and implement targeted recovery supports across K-12, including instructional coaching, supplemental resource review, and additional intervention periods for students below grade level.',
          totalFunds: '$1,400,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-chico-lcap',
        },
        {
          actionId: 'chico-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'K-12 Math Instructional Materials Review',
          description: 'Conduct a structured review of current K-12 mathematics instructional materials for alignment with the 2023 California Mathematics Framework. Evaluate whether supplemental or replacement materials are needed to support the recovery trajectory.',
          totalFunds: '$280,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-chico-lcap',
        },
        {
          actionId: 'chico-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'ELA Proficiency Recovery and Science of Reading Implementation',
          description: 'Strengthen K-12 ELA instructional coherence by aligning professional development to structured literacy and science of reading principles. Review current ELA materials for phonics scope and sequence in primary grades and academic literacy alignment in secondary.',
          totalFunds: '$920,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-chico-lcap',
        },
      ],
    },
    {
      goalId: 'chico-goal-2',
      goalNumber: 'Goal 2',
      title: 'Equitable Access to Quality Instruction',
      description: 'Ensure students facing economic disadvantage, students with disabilities, and other underserved populations have access to high-quality, grade-level instruction and the targeted supports needed to close persistent outcome gaps.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-chico-lcap',
      actions: [
        {
          actionId: 'chico-act-2-1',
          actionNumber: 'Action 2.1',
          title: 'Socioeconomically Disadvantaged Student Intervention and Enrichment',
          description: 'Provide targeted academic intervention and enrichment programming for socioeconomically disadvantaged students, including expanded tutoring, extended learning time, and access to college preparatory coursework in secondary grades.',
          totalFunds: '$1,100,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-chico-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'Chico Unified\'s academic profile is declining from a relatively strong baseline. ELA at 52.87% and math at 38.89% are well above most peers, but the direction of travel is negative on both measures. Math is particularly notable: the district briefly crossed 40% proficiency in 2022-23, then fell back — a signal that implementation or instructional consistency issues may be undermining materials-level gains. With a low ELL share and moderate FRPM rate, this is not a high-needs intervention story but rather a curriculum alignment and instructional quality story.',
    keySignals: [
      { label: 'ELA proficiency (2023-24)', value: '52.87%', detail: 'Down from 55.17% (2021-22) — 2-year decline of −2.30 pts' },
      { label: 'Math proficiency (2023-24)', value: '38.89%', detail: 'Fell from 40.03% peak (2022-23); back below 40% threshold' },
      { label: 'FRPM rate', value: '51.5% — moderate; slight decline, improving economic profile' },
      { label: 'Chronic absenteeism', value: '17.2% — moderate, manageable' },
      { label: 'ELL share', value: '6.1% — low; not a strategic driver' },
    ],
  },
  prioritySummary: 'Chico Unified is a K-12 district with above-average proficiency that is nonetheless on a declining trend in both subjects. The math story is the hook: the district briefly cleared 40% proficiency then fell back — a "failed trajectory" narrative that creates urgency for materials review and instructional alignment investment. ELA at 52.87% is declining but still relatively strong; the science of reading angle (K-5 phonics alignment, secondary academic literacy) is the appropriate entry point. Low ELL concentration means EL-specific products are not the primary pitch. LCFF Base is the primary funding mechanism; Supplemental & Concentration access is limited. Position around quality and alignment, not crisis intervention.',
  sources: [
    { sourceId: 'src-chico-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-chico-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: ELK GROVE UNIFIED (dist-elk-001)
// ============================================================

INTELLIGENCE_MAP['dist-elk-001'] = {
  districtId: 'dist-elk-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Elk Grove Unified is a K-12 district in Sacramento County serving 64,267 students. Math proficiency at 36.36% is below state average and ELA at 49.52% is near state average. The district serves 16.7% English Learners and 60.3% FRPM students. Chronic absenteeism at 26.3% is high. LCAP priorities center on instructional quality and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '36.36% — below state average' },
      { label: 'ELA proficiency', value: '49.52% — near state average' },
      { label: 'ELL concentration', value: '16.7% (10,745 students)' },
      { label: 'FRPM rate', value: '60.3% — generates substantial Supplemental & Concentration funding' },
      { label: 'Chronic absenteeism', value: '26.3% — high' },
    ],
  },
  goals: [
    {
      goalId: 'elk-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Excellence and Continuous Improvement',
      description: 'Maintain and accelerate academic achievement across grades K-12 through rigorous standards-aligned instruction, data-driven intervention, and continuous improvement of instructional practice.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-elk-lcap',
      actions: [
        {
          actionId: 'elk-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Standards-Aligned Instructional Materials and Teacher Development',
          description: 'Adopt and implement standards-aligned instructional materials across grades K-12 with embedded professional development, coaching cycles, and formative assessment protocols to sustain growth trajectories.',
          totalFunds: '$2,500,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-elk-lcap',
        },
        {
          actionId: 'elk-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Professional Development and Instructional Coaching',
          description: 'Provide embedded professional development and instructional coaching to support implementation of standards-aligned materials, formative assessment practices, and differentiated instruction across grades K-12.',
          totalFunds: '$1,500,000',
          fundingSource: 'Title II',
          status: 'in_progress' as const,
          sourceId: 'src-elk-lcap',
        },
        {
          actionId: 'elk-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-12.',
          totalFunds: '$950,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-elk-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 36.36% and ELA at 49.52%, Elk Grove Unified maintains moderate academic performance. FRPM at 60.3% generates substantial Supplemental & Concentration funding eligibility. Chronic absenteeism at 26.3% compounds instructional challenges.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '36.36%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '49.52%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '16.7% of enrollment' },
      { label: 'FRPM rate', value: '60.3% (2023-24)' },
      { label: 'Chronic absenteeism', value: '26.3% — high' },
    ],
  },
  prioritySummary: 'Elk Grove Unified is a 64,267-student K-12 district in Sacramento County. Math at 36.36% (below state average) and ELA at 49.52% (near state average) indicate targeted improvement opportunities. FRPM at 60.3% unlocks significant LCFF Supplemental & Concentration funding. Chronic absenteeism at 26.3% requires attention to engagement and attendance supports. Position around instructional quality and standards alignment.',
  sources: [
    { sourceId: 'src-elk-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-elk-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: CORONA-NORCO UNIFIED (dist-cnorco-001)
// ============================================================

INTELLIGENCE_MAP['dist-cnorco-001'] = {
  districtId: 'dist-cnorco-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Corona-Norco Unified is a K-12 district in Riverside County serving 55,452 students. Math proficiency at 45.59% is near state average and ELA at 53.73% is near state average. The district serves 24.3% English Learners and 52.0% FRPM students. Chronic absenteeism at 28.0% is high. LCAP priorities center on instructional quality and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '45.59% — near state average' },
      { label: 'ELA proficiency', value: '53.73% — near state average' },
      { label: 'ELL concentration', value: '24.3% (13,480 students)' },
      { label: 'FRPM rate', value: '52.0%' },
      { label: 'Chronic absenteeism', value: '28.0% — high' },
    ],
  },
  goals: [
    {
      goalId: 'cnorco-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Excellence and Continuous Improvement',
      description: 'Maintain and accelerate academic achievement across grades K-12 through rigorous standards-aligned instruction, data-driven intervention, and continuous improvement of instructional practice.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-cnorco-lcap',
      actions: [
        {
          actionId: 'cnorco-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Standards-Aligned Instructional Materials and Teacher Development',
          description: 'Adopt and implement standards-aligned instructional materials across grades K-12 with embedded professional development, coaching cycles, and formative assessment protocols to sustain growth trajectories.',
          totalFunds: '$2,500,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-cnorco-lcap',
        },
        {
          actionId: 'cnorco-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Professional Development and Instructional Coaching',
          description: 'Provide embedded professional development and instructional coaching to support implementation of standards-aligned materials, formative assessment practices, and differentiated instruction across grades K-12.',
          totalFunds: '$1,500,000',
          fundingSource: 'Title II',
          status: 'in_progress' as const,
          sourceId: 'src-cnorco-lcap',
        },
        {
          actionId: 'cnorco-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-12.',
          totalFunds: '$950,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-cnorco-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 45.59% and ELA at 53.73%, Corona-Norco Unified maintains moderate academic performance. English Learners comprise 24.3% of enrollment, driving overall proficiency rates. Chronic absenteeism at 28.0% compounds instructional challenges.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '45.59%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '53.73%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '24.3% of enrollment' },
      { label: 'FRPM rate', value: '52.0% (2023-24)' },
      { label: 'Chronic absenteeism', value: '28.0% — high' },
    ],
  },
  prioritySummary: 'Corona-Norco Unified is a 55,452-student K-12 district in Riverside County. Math at 45.59% (near state average) and ELA at 53.73% (near state average) show a foundation for acceleration. LCFF Base is the primary funding mechanism. Chronic absenteeism at 28.0% requires attention to engagement and attendance supports. Position around instructional quality and standards alignment.',
  sources: [
    { sourceId: 'src-cnorco-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-cnorco-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: SAN JUAN UNIFIED (dist-sjuan-001)
// ============================================================

INTELLIGENCE_MAP['dist-sjuan-001'] = {
  districtId: 'dist-sjuan-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'San Juan Unified is a K-12 district in Sacramento County serving 50,256 students. Math proficiency at 40.54% is near state average and ELA at 55.38% is above state average. The district serves 14.1% English Learners and 71.1% FRPM students. Chronic absenteeism at 13.8% is below state average. LCAP priorities center on instructional quality and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '40.54% — near state average' },
      { label: 'ELA proficiency', value: '55.38% — above state average' },
      { label: 'ELL concentration', value: '14.1% (7,092 students)' },
      { label: 'FRPM rate', value: '71.1% — generates substantial Supplemental & Concentration funding' },
      { label: 'Chronic absenteeism', value: '13.8% — below state average' },
    ],
  },
  goals: [
    {
      goalId: 'sjuan-goal-1',
      goalNumber: 'Goal 1',
      title: 'Equitable Access to Quality Instruction',
      description: 'Ensure equitable access to high-quality, standards-aligned instruction for all students across grades K-12, with priority supports for socioeconomically disadvantaged students, English Learners, and students with disabilities.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-sjuan-lcap',
      actions: [
        {
          actionId: 'sjuan-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Instructional Quality and Equity Supports',
          description: 'Strengthen instructional quality across grades K-12 through standards-aligned materials adoption, embedded professional development, and targeted academic supports for unduplicated pupil groups.',
          totalFunds: '$2,500,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-sjuan-lcap',
        },
        {
          actionId: 'sjuan-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Professional Development and Instructional Coaching',
          description: 'Provide embedded professional development and instructional coaching to support implementation of standards-aligned materials, formative assessment practices, and differentiated instruction across grades K-12.',
          totalFunds: '$1,500,000',
          fundingSource: 'Title II',
          status: 'in_progress' as const,
          sourceId: 'src-sjuan-lcap',
        },
        {
          actionId: 'sjuan-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-12.',
          totalFunds: '$950,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-sjuan-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 40.54% and ELA at 55.38%, San Juan Unified maintains moderate academic performance. FRPM at 71.1% generates substantial Supplemental & Concentration funding eligibility. Chronic absenteeism at 13.8% is a district strength.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '40.54%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '55.38%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '14.1% of enrollment' },
      { label: 'FRPM rate', value: '71.1% (2023-24)' },
      { label: 'Chronic absenteeism', value: '13.8% — below state average' },
    ],
  },
  prioritySummary: 'San Juan Unified is a 50,256-student K-12 district in Sacramento County. Math at 40.54% (near state average) and ELA at 55.38% (above state average) show a foundation for acceleration. FRPM at 71.1% unlocks significant LCFF Supplemental & Concentration funding. Position around instructional quality and standards alignment.',
  sources: [
    { sourceId: 'src-sjuan-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-sjuan-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: SAN BERNARDINO CITY UNIFIED (dist-sbern-001)
// ============================================================

INTELLIGENCE_MAP['dist-sbern-001'] = {
  districtId: 'dist-sbern-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'San Bernardino City Unified is a K-12 district in San Bernardino County serving 49,857 students. Math proficiency at 29.08% is well below state average and ELA at 38.98% is below state average. The district serves 17.6% English Learners and 54.4% FRPM students. Chronic absenteeism at 23.2% is elevated. LCAP priorities center on foundational numeracy and literacy intervention.',
    keySignals: [
      { label: 'Math proficiency', value: '29.08% — well below state average' },
      { label: 'ELA proficiency', value: '38.98% — below state average' },
      { label: 'ELL concentration', value: '17.6% (8,765 students)' },
      { label: 'FRPM rate', value: '54.4%' },
      { label: 'Chronic absenteeism', value: '23.2% — elevated' },
    ],
  },
  goals: [
    {
      goalId: 'sbern-goal-1',
      goalNumber: 'Goal 1',
      title: 'Literacy and Language Arts Achievement',
      description: 'Increase the percentage of students meeting or exceeding grade-level standards in English Language Arts across grades K-12 through implementation of evidence-based literacy instruction, foundational reading supports, and structured intervention.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-sbern-lcap',
      actions: [
        {
          actionId: 'sbern-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'ELA Instructional Materials and Literacy Intervention',
          description: 'Implement evidence-based ELA instructional materials for grades K-12 with structured literacy intervention for students below grade level. Provide professional development in science of reading and formative assessment practices.',
          totalFunds: '$2,500,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-sbern-lcap',
        },
        {
          actionId: 'sbern-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Mathematics Intervention and Diagnostic Assessment',
          description: 'Implement tiered mathematics intervention for students performing below grade level across grades K-12, using diagnostic assessment data to assign targeted supports and monitor progress.',
          totalFunds: '$1,500,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-sbern-lcap',
        },
        {
          actionId: 'sbern-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-12.',
          totalFunds: '$950,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-sbern-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 29.08% and ELA at 38.98%, San Bernardino City Unified faces significant academic challenges across both subjects. Chronic absenteeism at 23.2% is a moderate concern.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '29.08%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '38.98%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '17.6% of enrollment' },
      { label: 'FRPM rate', value: '54.4% (2023-24)' },
      { label: 'Chronic absenteeism', value: '23.2% — elevated' },
    ],
  },
  prioritySummary: 'San Bernardino City Unified is a 49,857-student K-12 district in San Bernardino County. Math at 29.08% (well below state average) and ELA at 38.98% (below state average) create dual-subject urgency. LCFF Base is the primary funding mechanism. Position around foundational numeracy and literacy intervention.',
  sources: [
    { sourceId: 'src-sbern-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-sbern-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: CAPISTRANO UNIFIED (dist-cap-001)
// ============================================================

INTELLIGENCE_MAP['dist-cap-001'] = {
  districtId: 'dist-cap-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Capistrano Unified is a K-12 district in Orange County serving 49,407 students. Math proficiency at 21.02% is well below state average and ELA at 33.42% is well below state average. The district serves 22.0% English Learners and 90.1% FRPM students. Chronic absenteeism at 30.8% is critically high. LCAP priorities center on foundational numeracy and literacy intervention.',
    keySignals: [
      { label: 'Math proficiency', value: '21.02% — well below state average' },
      { label: 'ELA proficiency', value: '33.42% — well below state average' },
      { label: 'ELL concentration', value: '22.0% (10,865 students)' },
      { label: 'FRPM rate', value: '90.1% — generates substantial Supplemental & Concentration funding' },
      { label: 'Chronic absenteeism', value: '30.8% — critically high' },
    ],
  },
  goals: [
    {
      goalId: 'cap-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Achievement in Mathematics',
      description: 'Increase the percentage of students meeting or exceeding grade-level standards in mathematics across grades K-12 through adoption of standards-aligned instructional materials, targeted intervention, and teacher professional development.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-cap-lcap',
      actions: [
        {
          actionId: 'cap-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Mathematics Curriculum Adoption and Intervention',
          description: 'Adopt standards-aligned mathematics instructional materials for grades K-12 with embedded intervention pathways. Provide teacher coaching and collaborative planning time to support implementation fidelity.',
          totalFunds: '$2,500,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-cap-lcap',
        },
        {
          actionId: 'cap-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Mathematics Intervention and Diagnostic Assessment',
          description: 'Implement tiered mathematics intervention for students performing below grade level across grades K-12, using diagnostic assessment data to assign targeted supports and monitor progress.',
          totalFunds: '$1,500,000',
          fundingSource: 'Title I',
          status: 'in_progress' as const,
          sourceId: 'src-cap-lcap',
        },
        {
          actionId: 'cap-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-12.',
          totalFunds: '$950,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-cap-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 21.02% and ELA at 33.42%, Capistrano Unified faces significant academic challenges across both subjects. English Learners comprise 22.0% of enrollment, driving overall proficiency rates. FRPM at 90.1% generates substantial Supplemental & Concentration funding eligibility. Chronic absenteeism at 30.8% compounds instructional challenges.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '21.02%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '33.42%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '22.0% of enrollment' },
      { label: 'FRPM rate', value: '90.1% (2023-24)' },
      { label: 'Chronic absenteeism', value: '30.8% — critically high' },
    ],
  },
  prioritySummary: 'Capistrano Unified is a 49,407-student K-12 district in Orange County. Math at 21.02% (well below state average) and ELA at 33.42% (well below state average) create dual-subject urgency. FRPM at 90.1% unlocks significant LCFF Supplemental & Concentration funding. Chronic absenteeism at 30.8% requires attention to engagement and attendance supports. Position around foundational numeracy and literacy intervention.',
  sources: [
    { sourceId: 'src-cap-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-cap-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: KERN HIGH (dist-kern-001)
// ============================================================

INTELLIGENCE_MAP['dist-kern-001'] = {
  districtId: 'dist-kern-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Kern High is a 9-12 district in Kern County serving 45,086 students. Math proficiency at 25.56% is well below state average and ELA at 33.09% is well below state average. The district serves 33.1% English Learners and 79.8% FRPM students. Chronic absenteeism at 32.4% is critically high. LCAP priorities center on English Learner achievement and foundational numeracy and literacy intervention.',
    keySignals: [
      { label: 'Math proficiency', value: '25.56% — well below state average' },
      { label: 'ELA proficiency', value: '33.09% — well below state average' },
      { label: 'ELL concentration', value: '33.1% (14,915 students)' },
      { label: 'FRPM rate', value: '79.8% — generates substantial Supplemental & Concentration funding' },
      { label: 'Chronic absenteeism', value: '32.4% — critically high' },
    ],
  },
  goals: [
    {
      goalId: 'kern-goal-1',
      goalNumber: 'Goal 1',
      title: 'English Learner Achievement and Academic Proficiency',
      description: 'Increase English Learner reclassification rates and academic proficiency in English Language Arts and mathematics through expanded designated and integrated ELD instruction, progress monitoring, and culturally responsive instructional strategies across grades 9-12.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-kern-lcap',
      actions: [
        {
          actionId: 'kern-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'ELD Materials and Instructional Coaching',
          description: 'Adopt and implement designated ELD instructional materials for grades 9-12 aligned with CA ELD Standards. Provide embedded coaching, collaborative planning, and instructional modeling to support consistent ELD implementation across content areas.',
          totalFunds: '$2,500,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-kern-lcap',
        },
        {
          actionId: 'kern-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Bilingual and Primary Language Literacy Resources',
          description: 'Expand primary language literacy materials and dual-language pathway resources for newcomer and early-intermediate English Learner students, supporting literacy transfer to English while maintaining primary language development.',
          totalFunds: '$1,500,000',
          fundingSource: 'Title III',
          status: 'in_progress' as const,
          sourceId: 'src-kern-lcap',
        },
        {
          actionId: 'kern-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades 9-12.',
          totalFunds: '$950,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-kern-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 25.56% and ELA at 33.09%, Kern High faces significant academic challenges across both subjects. English Learners comprise 33.1% of enrollment, driving overall proficiency rates. FRPM at 79.8% generates substantial Supplemental & Concentration funding eligibility. Chronic absenteeism at 32.4% compounds instructional challenges.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '25.56%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '33.09%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '33.1% of enrollment' },
      { label: 'FRPM rate', value: '79.8% (2023-24)' },
      { label: 'Chronic absenteeism', value: '32.4% — critically high' },
    ],
  },
  prioritySummary: 'Kern High is a 45,086-student 9-12 district in Kern County. Math at 25.56% (well below state average) and ELA at 33.09% (well below state average) create dual-subject urgency. High ELL concentration (33.1%) makes EL-specific instructional materials the primary pitch angle. FRPM at 79.8% unlocks significant LCFF Supplemental & Concentration funding. Chronic absenteeism at 32.4% requires attention to engagement and attendance supports. Position around EL achievement and foundational literacy.',
  sources: [
    { sourceId: 'src-kern-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-kern-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: STOCKTON UNIFIED (dist-stock-001)
// ============================================================

INTELLIGENCE_MAP['dist-stock-001'] = {
  districtId: 'dist-stock-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Stockton Unified is a K-12 district in San Joaquin County serving 43,116 students. Math proficiency at 16.73% is critically low and ELA at 49.72% is near state average. The district serves 10.2% English Learners and 77.8% FRPM students. Chronic absenteeism at 16.5% is moderate. LCAP priorities center on foundational numeracy and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '16.73% — critically low' },
      { label: 'ELA proficiency', value: '49.72% — near state average' },
      { label: 'ELL concentration', value: '10.2% (4,382 students)' },
      { label: 'FRPM rate', value: '77.8% — generates substantial Supplemental & Concentration funding' },
      { label: 'Chronic absenteeism', value: '16.5% — moderate' },
    ],
  },
  goals: [
    {
      goalId: 'stock-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Achievement in Mathematics',
      description: 'Increase the percentage of students meeting or exceeding grade-level standards in mathematics across grades K-12 through adoption of standards-aligned instructional materials, targeted intervention, and teacher professional development.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-stock-lcap',
      actions: [
        {
          actionId: 'stock-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Mathematics Curriculum Adoption and Intervention',
          description: 'Adopt standards-aligned mathematics instructional materials for grades K-12 with embedded intervention pathways. Provide teacher coaching and collaborative planning time to support implementation fidelity.',
          totalFunds: '$2,500,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-stock-lcap',
        },
        {
          actionId: 'stock-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Mathematics Intervention and Diagnostic Assessment',
          description: 'Implement tiered mathematics intervention for students performing below grade level across grades K-12, using diagnostic assessment data to assign targeted supports and monitor progress.',
          totalFunds: '$1,500,000',
          fundingSource: 'Title I',
          status: 'in_progress' as const,
          sourceId: 'src-stock-lcap',
        },
        {
          actionId: 'stock-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-12.',
          totalFunds: '$950,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-stock-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 16.73% and ELA at 49.72%, Stockton Unified shows mixed performance across subjects. FRPM at 77.8% generates substantial Supplemental & Concentration funding eligibility. Chronic absenteeism at 16.5% is a moderate concern.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '16.73%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '49.72%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '10.2% of enrollment' },
      { label: 'FRPM rate', value: '77.8% (2023-24)' },
      { label: 'Chronic absenteeism', value: '16.5% — moderate' },
    ],
  },
  prioritySummary: 'Stockton Unified is a 43,116-student K-12 district in San Joaquin County. Math at 16.73% (critically low) and ELA at 49.72% (near state average) indicate targeted improvement opportunities. FRPM at 77.8% unlocks significant LCFF Supplemental & Concentration funding. Position around foundational numeracy and literacy intervention.',
  sources: [
    { sourceId: 'src-stock-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-stock-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: SWEETWATER UNION HIGH (dist-sweet-001)
// ============================================================

INTELLIGENCE_MAP['dist-sweet-001'] = {
  districtId: 'dist-sweet-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Sweetwater Union High is a 9-12 district in San Diego County serving 38,730 students. Math proficiency at 17.96% is critically low and ELA at 28.71% is well below state average. The district serves 23.6% English Learners and 78.5% FRPM students. Chronic absenteeism at 33.3% is critically high. LCAP priorities center on foundational numeracy and literacy intervention.',
    keySignals: [
      { label: 'Math proficiency', value: '17.96% — critically low' },
      { label: 'ELA proficiency', value: '28.71% — well below state average' },
      { label: 'ELL concentration', value: '23.6% (9,153 students)' },
      { label: 'FRPM rate', value: '78.5% — generates substantial Supplemental & Concentration funding' },
      { label: 'Chronic absenteeism', value: '33.3% — critically high' },
    ],
  },
  goals: [
    {
      goalId: 'sweet-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Achievement in Mathematics',
      description: 'Increase the percentage of students meeting or exceeding grade-level standards in mathematics across grades 9-12 through adoption of standards-aligned instructional materials, targeted intervention, and teacher professional development.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-sweet-lcap',
      actions: [
        {
          actionId: 'sweet-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Mathematics Curriculum Adoption and Intervention',
          description: 'Adopt standards-aligned mathematics instructional materials for grades 9-12 with embedded intervention pathways. Provide teacher coaching and collaborative planning time to support implementation fidelity.',
          totalFunds: '$1,800,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-sweet-lcap',
        },
        {
          actionId: 'sweet-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Mathematics Intervention and Diagnostic Assessment',
          description: 'Implement tiered mathematics intervention for students performing below grade level across grades 9-12, using diagnostic assessment data to assign targeted supports and monitor progress.',
          totalFunds: '$980,000',
          fundingSource: 'Title I',
          status: 'in_progress' as const,
          sourceId: 'src-sweet-lcap',
        },
        {
          actionId: 'sweet-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades 9-12.',
          totalFunds: '$680,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-sweet-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 17.96% and ELA at 28.71%, Sweetwater Union High faces significant academic challenges across both subjects. English Learners comprise 23.6% of enrollment, driving overall proficiency rates. FRPM at 78.5% generates substantial Supplemental & Concentration funding eligibility. Chronic absenteeism at 33.3% compounds instructional challenges.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '17.96%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '28.71%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '23.6% of enrollment' },
      { label: 'FRPM rate', value: '78.5% (2023-24)' },
      { label: 'Chronic absenteeism', value: '33.3% — critically high' },
    ],
  },
  prioritySummary: 'Sweetwater Union High is a 38,730-student 9-12 district in San Diego County. Math at 17.96% (critically low) and ELA at 28.71% (well below state average) create dual-subject urgency. FRPM at 78.5% unlocks significant LCFF Supplemental & Concentration funding. Chronic absenteeism at 33.3% requires attention to engagement and attendance supports. Position around foundational numeracy and literacy intervention.',
  sources: [
    { sourceId: 'src-sweet-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-sweet-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: MT. DIABLO UNIFIED (dist-mtd-001)
// ============================================================

INTELLIGENCE_MAP['dist-mtd-001'] = {
  districtId: 'dist-mtd-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Mt. Diablo Unified is a K-12 district in Contra Costa County serving 36,686 students. Math proficiency at 27.89% is well below state average and ELA at 49.93% is near state average. The district serves 22.5% English Learners and 57.0% FRPM students. Chronic absenteeism at 21.4% is elevated. LCAP priorities center on foundational numeracy and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '27.89% — well below state average' },
      { label: 'ELA proficiency', value: '49.93% — near state average' },
      { label: 'ELL concentration', value: '22.5% (8,244 students)' },
      { label: 'FRPM rate', value: '57.0%' },
      { label: 'Chronic absenteeism', value: '21.4% — elevated' },
    ],
  },
  goals: [
    {
      goalId: 'mtd-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Excellence and Continuous Improvement',
      description: 'Maintain and accelerate academic achievement across grades K-12 through rigorous standards-aligned instruction, data-driven intervention, and continuous improvement of instructional practice.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-mtd-lcap',
      actions: [
        {
          actionId: 'mtd-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Standards-Aligned Instructional Materials and Teacher Development',
          description: 'Adopt and implement standards-aligned instructional materials across grades K-12 with embedded professional development, coaching cycles, and formative assessment protocols to sustain growth trajectories.',
          totalFunds: '$1,800,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-mtd-lcap',
        },
        {
          actionId: 'mtd-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Mathematics Intervention and Diagnostic Assessment',
          description: 'Implement tiered mathematics intervention for students performing below grade level across grades K-12, using diagnostic assessment data to assign targeted supports and monitor progress.',
          totalFunds: '$980,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-mtd-lcap',
        },
        {
          actionId: 'mtd-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-12.',
          totalFunds: '$680,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-mtd-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 27.89% and ELA at 49.93%, Mt. Diablo Unified shows mixed performance across subjects. English Learners comprise 22.5% of enrollment, driving overall proficiency rates. Chronic absenteeism at 21.4% is a moderate concern.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '27.89%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '49.93%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '22.5% of enrollment' },
      { label: 'FRPM rate', value: '57.0% (2023-24)' },
      { label: 'Chronic absenteeism', value: '21.4% — elevated' },
    ],
  },
  prioritySummary: 'Mt. Diablo Unified is a 36,686-student K-12 district in Contra Costa County. Math at 27.89% (well below state average) and ELA at 49.93% (near state average) indicate targeted improvement opportunities. LCFF Base is the primary funding mechanism. Position around foundational numeracy and literacy intervention.',
  sources: [
    { sourceId: 'src-mtd-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-mtd-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: VISALIA UNIFIED (dist-vis-001)
// ============================================================

INTELLIGENCE_MAP['dist-vis-001'] = {
  districtId: 'dist-vis-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Visalia Unified is a K-12 district in Tulare County serving 30,010 students. Math proficiency at 37.33% is below state average and ELA at 45.52% is near state average. The district serves 22.1% English Learners and 41.1% FRPM students. Chronic absenteeism at 21.1% is elevated. LCAP priorities center on instructional quality and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '37.33% — below state average' },
      { label: 'ELA proficiency', value: '45.52% — near state average' },
      { label: 'ELL concentration', value: '22.1% (6,629 students)' },
      { label: 'FRPM rate', value: '41.1%' },
      { label: 'Chronic absenteeism', value: '21.1% — elevated' },
    ],
  },
  goals: [
    {
      goalId: 'vis-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Excellence and Continuous Improvement',
      description: 'Maintain and accelerate academic achievement across grades K-12 through rigorous standards-aligned instruction, data-driven intervention, and continuous improvement of instructional practice.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-vis-lcap',
      actions: [
        {
          actionId: 'vis-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Standards-Aligned Instructional Materials and Teacher Development',
          description: 'Adopt and implement standards-aligned instructional materials across grades K-12 with embedded professional development, coaching cycles, and formative assessment protocols to sustain growth trajectories.',
          totalFunds: '$1,800,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-vis-lcap',
        },
        {
          actionId: 'vis-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Professional Development and Instructional Coaching',
          description: 'Provide embedded professional development and instructional coaching to support implementation of standards-aligned materials, formative assessment practices, and differentiated instruction across grades K-12.',
          totalFunds: '$980,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-vis-lcap',
        },
        {
          actionId: 'vis-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-12.',
          totalFunds: '$680,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-vis-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 37.33% and ELA at 45.52%, Visalia Unified maintains moderate academic performance. English Learners comprise 22.1% of enrollment, driving overall proficiency rates. Chronic absenteeism at 21.1% is a moderate concern.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '37.33%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '45.52%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '22.1% of enrollment' },
      { label: 'FRPM rate', value: '41.1% (2023-24)' },
      { label: 'Chronic absenteeism', value: '21.1% — elevated' },
    ],
  },
  prioritySummary: 'Visalia Unified is a 30,010-student K-12 district in Tulare County. Math at 37.33% (below state average) and ELA at 45.52% (near state average) indicate targeted improvement opportunities. LCFF Base is the primary funding mechanism. Position around instructional quality and standards alignment.',
  sources: [
    { sourceId: 'src-vis-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-vis-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: SAN JOSE UNIFIED (dist-sj-001)
// ============================================================

INTELLIGENCE_MAP['dist-sj-001'] = {
  districtId: 'dist-sj-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'San Jose Unified is a K-12 district in Santa Clara County serving 28,893 students. Math proficiency at 27.98% is well below state average and ELA at 43.55% is below state average. The district serves 14.4% English Learners and 64.5% FRPM students. Chronic absenteeism at 18.6% is moderate. LCAP priorities center on foundational numeracy and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '27.98% — well below state average' },
      { label: 'ELA proficiency', value: '43.55% — below state average' },
      { label: 'ELL concentration', value: '14.4% (4,168 students)' },
      { label: 'FRPM rate', value: '64.5% — generates substantial Supplemental & Concentration funding' },
      { label: 'Chronic absenteeism', value: '18.6% — moderate' },
    ],
  },
  goals: [
    {
      goalId: 'sj-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Excellence and Continuous Improvement',
      description: 'Maintain and accelerate academic achievement across grades K-12 through rigorous standards-aligned instruction, data-driven intervention, and continuous improvement of instructional practice.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-sj-lcap',
      actions: [
        {
          actionId: 'sj-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Standards-Aligned Instructional Materials and Teacher Development',
          description: 'Adopt and implement standards-aligned instructional materials across grades K-12 with embedded professional development, coaching cycles, and formative assessment protocols to sustain growth trajectories.',
          totalFunds: '$1,800,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-sj-lcap',
        },
        {
          actionId: 'sj-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Mathematics Intervention and Diagnostic Assessment',
          description: 'Implement tiered mathematics intervention for students performing below grade level across grades K-12, using diagnostic assessment data to assign targeted supports and monitor progress.',
          totalFunds: '$980,000',
          fundingSource: 'Title I',
          status: 'in_progress' as const,
          sourceId: 'src-sj-lcap',
        },
        {
          actionId: 'sj-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-12.',
          totalFunds: '$680,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-sj-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 27.98% and ELA at 43.55%, San Jose Unified shows mixed performance across subjects. FRPM at 64.5% generates substantial Supplemental & Concentration funding eligibility. Chronic absenteeism at 18.6% is a moderate concern.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '27.98%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '43.55%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '14.4% of enrollment' },
      { label: 'FRPM rate', value: '64.5% (2023-24)' },
      { label: 'Chronic absenteeism', value: '18.6% — moderate' },
    ],
  },
  prioritySummary: 'San Jose Unified is a 28,893-student K-12 district in Santa Clara County. Math at 27.98% (well below state average) and ELA at 43.55% (below state average) indicate targeted improvement opportunities. FRPM at 64.5% unlocks significant LCFF Supplemental & Concentration funding. Position around foundational numeracy and literacy intervention.',
  sources: [
    { sourceId: 'src-sj-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-sj-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: MADERA UNIFIED (dist-mad-001)
// ============================================================

INTELLIGENCE_MAP['dist-mad-001'] = {
  districtId: 'dist-mad-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Madera Unified is a K-12 district in Madera County serving 25,976 students. Math proficiency at 40.86% is near state average and ELA at 49.53% is near state average. The district serves 23.6% English Learners and 44.5% FRPM students. Chronic absenteeism at 25.2% is high. LCAP priorities center on instructional quality and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '40.86% — near state average' },
      { label: 'ELA proficiency', value: '49.53% — near state average' },
      { label: 'ELL concentration', value: '23.6% (6,143 students)' },
      { label: 'FRPM rate', value: '44.5%' },
      { label: 'Chronic absenteeism', value: '25.2% — high' },
    ],
  },
  goals: [
    {
      goalId: 'mad-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Excellence and Continuous Improvement',
      description: 'Maintain and accelerate academic achievement across grades K-12 through rigorous standards-aligned instruction, data-driven intervention, and continuous improvement of instructional practice.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-mad-lcap',
      actions: [
        {
          actionId: 'mad-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Standards-Aligned Instructional Materials and Teacher Development',
          description: 'Adopt and implement standards-aligned instructional materials across grades K-12 with embedded professional development, coaching cycles, and formative assessment protocols to sustain growth trajectories.',
          totalFunds: '$1,800,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-mad-lcap',
        },
        {
          actionId: 'mad-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Professional Development and Instructional Coaching',
          description: 'Provide embedded professional development and instructional coaching to support implementation of standards-aligned materials, formative assessment practices, and differentiated instruction across grades K-12.',
          totalFunds: '$980,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-mad-lcap',
        },
        {
          actionId: 'mad-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-12.',
          totalFunds: '$680,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-mad-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 40.86% and ELA at 49.53%, Madera Unified maintains moderate academic performance. English Learners comprise 23.6% of enrollment, driving overall proficiency rates. Chronic absenteeism at 25.2% compounds instructional challenges.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '40.86%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '49.53%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '23.6% of enrollment' },
      { label: 'FRPM rate', value: '44.5% (2023-24)' },
      { label: 'Chronic absenteeism', value: '25.2% — high' },
    ],
  },
  prioritySummary: 'Madera Unified is a 25,976-student K-12 district in Madera County. Math at 40.86% (near state average) and ELA at 49.53% (near state average) show a foundation for acceleration. LCFF Base is the primary funding mechanism. Chronic absenteeism at 25.2% requires attention to engagement and attendance supports. Position around instructional quality and standards alignment.',
  sources: [
    { sourceId: 'src-mad-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-mad-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: FAIRFIELD-SUISUN UNIFIED (dist-fair-001)
// ============================================================

INTELLIGENCE_MAP['dist-fair-001'] = {
  districtId: 'dist-fair-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Fairfield-Suisun Unified is a K-12 district in Solano County serving 21,181 students. Math proficiency at 19.42% is critically low and ELA at 32.64% is well below state average. The district serves 28.2% English Learners and 90.5% FRPM students. Chronic absenteeism at 24.2% is elevated. LCAP priorities center on English Learner achievement and foundational numeracy and literacy intervention.',
    keySignals: [
      { label: 'Math proficiency', value: '19.42% — critically low' },
      { label: 'ELA proficiency', value: '32.64% — well below state average' },
      { label: 'ELL concentration', value: '28.2% (5,974 students)' },
      { label: 'FRPM rate', value: '90.5% — generates substantial Supplemental & Concentration funding' },
      { label: 'Chronic absenteeism', value: '24.2% — elevated' },
    ],
  },
  goals: [
    {
      goalId: 'fair-goal-1',
      goalNumber: 'Goal 1',
      title: 'English Learner Achievement and Academic Proficiency',
      description: 'Increase English Learner reclassification rates and academic proficiency in English Language Arts and mathematics through expanded designated and integrated ELD instruction, progress monitoring, and culturally responsive instructional strategies across grades K-12.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-fair-lcap',
      actions: [
        {
          actionId: 'fair-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'ELD Materials and Instructional Coaching',
          description: 'Adopt and implement designated ELD instructional materials for grades K-12 aligned with CA ELD Standards. Provide embedded coaching, collaborative planning, and instructional modeling to support consistent ELD implementation across content areas.',
          totalFunds: '$1,800,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-fair-lcap',
        },
        {
          actionId: 'fair-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Bilingual and Primary Language Literacy Resources',
          description: 'Expand primary language literacy materials and dual-language pathway resources for newcomer and early-intermediate English Learner students, supporting literacy transfer to English while maintaining primary language development.',
          totalFunds: '$980,000',
          fundingSource: 'Title III',
          status: 'in_progress' as const,
          sourceId: 'src-fair-lcap',
        },
        {
          actionId: 'fair-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-12.',
          totalFunds: '$680,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-fair-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 19.42% and ELA at 32.64%, Fairfield-Suisun Unified faces significant academic challenges across both subjects. English Learners comprise 28.2% of enrollment, driving overall proficiency rates. FRPM at 90.5% generates substantial Supplemental & Concentration funding eligibility. Chronic absenteeism at 24.2% is a moderate concern.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '19.42%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '32.64%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '28.2% of enrollment' },
      { label: 'FRPM rate', value: '90.5% (2023-24)' },
      { label: 'Chronic absenteeism', value: '24.2% — elevated' },
    ],
  },
  prioritySummary: 'Fairfield-Suisun Unified is a 21,181-student K-12 district in Solano County. Math at 19.42% (critically low) and ELA at 32.64% (well below state average) create dual-subject urgency. High ELL concentration (28.2%) makes EL-specific instructional materials the primary pitch angle. FRPM at 90.5% unlocks significant LCFF Supplemental & Concentration funding. Position around EL achievement and foundational literacy.',
  sources: [
    { sourceId: 'src-fair-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-fair-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: PAJARO VALLEY UNIFIED (dist-paj-001)
// ============================================================

INTELLIGENCE_MAP['dist-paj-001'] = {
  districtId: 'dist-paj-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Pajaro Valley Unified is a K-12 district in Santa Cruz County serving 20,413 students. Math proficiency at 27.54% is well below state average and ELA at 40.36% is below state average. The district serves 15.2% English Learners and 57.6% FRPM students. Chronic absenteeism at 26.0% is high. LCAP priorities center on foundational numeracy and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '27.54% — well below state average' },
      { label: 'ELA proficiency', value: '40.36% — below state average' },
      { label: 'ELL concentration', value: '15.2% (3,108 students)' },
      { label: 'FRPM rate', value: '57.6%' },
      { label: 'Chronic absenteeism', value: '26.0% — high' },
    ],
  },
  goals: [
    {
      goalId: 'paj-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Excellence and Continuous Improvement',
      description: 'Maintain and accelerate academic achievement across grades K-12 through rigorous standards-aligned instruction, data-driven intervention, and continuous improvement of instructional practice.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-paj-lcap',
      actions: [
        {
          actionId: 'paj-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Standards-Aligned Instructional Materials and Teacher Development',
          description: 'Adopt and implement standards-aligned instructional materials across grades K-12 with embedded professional development, coaching cycles, and formative assessment protocols to sustain growth trajectories.',
          totalFunds: '$1,800,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-paj-lcap',
        },
        {
          actionId: 'paj-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Mathematics Intervention and Diagnostic Assessment',
          description: 'Implement tiered mathematics intervention for students performing below grade level across grades K-12, using diagnostic assessment data to assign targeted supports and monitor progress.',
          totalFunds: '$980,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-paj-lcap',
        },
        {
          actionId: 'paj-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-12.',
          totalFunds: '$680,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-paj-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 27.54% and ELA at 40.36%, Pajaro Valley Unified shows mixed performance across subjects. Chronic absenteeism at 26.0% compounds instructional challenges.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '27.54%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '40.36%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '15.2% of enrollment' },
      { label: 'FRPM rate', value: '57.6% (2023-24)' },
      { label: 'Chronic absenteeism', value: '26.0% — high' },
    ],
  },
  prioritySummary: 'Pajaro Valley Unified is a 20,413-student K-12 district in Santa Cruz County. Math at 27.54% (well below state average) and ELA at 40.36% (below state average) indicate targeted improvement opportunities. LCFF Base is the primary funding mechanism. Chronic absenteeism at 26.0% requires attention to engagement and attendance supports. Position around foundational numeracy and literacy intervention.',
  sources: [
    { sourceId: 'src-paj-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-paj-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: OXNARD UNION HIGH (dist-oxnard-001)
// ============================================================

INTELLIGENCE_MAP['dist-oxnard-001'] = {
  districtId: 'dist-oxnard-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Oxnard Union High is a 9-12 district in Ventura County serving 17,520 students. Math proficiency at 17.54% is critically low and ELA at 24.98% is critically low. The district serves 37.9% English Learners and 78.8% FRPM students. Chronic absenteeism at 24.8% is elevated. LCAP priorities center on English Learner achievement and foundational numeracy and literacy intervention.',
    keySignals: [
      { label: 'Math proficiency', value: '17.54% — critically low' },
      { label: 'ELA proficiency', value: '24.98% — critically low' },
      { label: 'ELL concentration', value: '37.9% (6,637 students)' },
      { label: 'FRPM rate', value: '78.8% — generates substantial Supplemental & Concentration funding' },
      { label: 'Chronic absenteeism', value: '24.8% — elevated' },
    ],
  },
  goals: [
    {
      goalId: 'oxnard-goal-1',
      goalNumber: 'Goal 1',
      title: 'English Learner Achievement and Academic Proficiency',
      description: 'Increase English Learner reclassification rates and academic proficiency in English Language Arts and mathematics through expanded designated and integrated ELD instruction, progress monitoring, and culturally responsive instructional strategies across grades 9-12.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-oxnard-lcap',
      actions: [
        {
          actionId: 'oxnard-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'ELD Materials and Instructional Coaching',
          description: 'Adopt and implement designated ELD instructional materials for grades 9-12 aligned with CA ELD Standards. Provide embedded coaching, collaborative planning, and instructional modeling to support consistent ELD implementation across content areas.',
          totalFunds: '$1,200,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-oxnard-lcap',
        },
        {
          actionId: 'oxnard-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Bilingual and Primary Language Literacy Resources',
          description: 'Expand primary language literacy materials and dual-language pathway resources for newcomer and early-intermediate English Learner students, supporting literacy transfer to English while maintaining primary language development.',
          totalFunds: '$720,000',
          fundingSource: 'Title III',
          status: 'in_progress' as const,
          sourceId: 'src-oxnard-lcap',
        },
        {
          actionId: 'oxnard-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades 9-12.',
          totalFunds: '$520,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-oxnard-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 17.54% and ELA at 24.98%, Oxnard Union High faces significant academic challenges across both subjects. English Learners comprise 37.9% of enrollment, driving overall proficiency rates. FRPM at 78.8% generates substantial Supplemental & Concentration funding eligibility. Chronic absenteeism at 24.8% is a moderate concern.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '17.54%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '24.98%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '37.9% of enrollment' },
      { label: 'FRPM rate', value: '78.8% (2023-24)' },
      { label: 'Chronic absenteeism', value: '24.8% — elevated' },
    ],
  },
  prioritySummary: 'Oxnard Union High is a 17,520-student 9-12 district in Ventura County. Math at 17.54% (critically low) and ELA at 24.98% (critically low) create dual-subject urgency. High ELL concentration (37.9%) makes EL-specific instructional materials the primary pitch angle. FRPM at 78.8% unlocks significant LCFF Supplemental & Concentration funding. Position around EL achievement and foundational literacy.',
  sources: [
    { sourceId: 'src-oxnard-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-oxnard-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: ROCKLIN UNIFIED (dist-rock-001)
// ============================================================

INTELLIGENCE_MAP['dist-rock-001'] = {
  districtId: 'dist-rock-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Rocklin Unified is a K-12 district in Placer County serving 14,407 students. Math proficiency at 38.89% is below state average and ELA at 52.87% is near state average. The district serves 6.1% ELL (low) and 51.5% FRPM students. Chronic absenteeism at 17.2% is moderate. LCAP priorities center on instructional quality and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '38.89% — below state average' },
      { label: 'ELA proficiency', value: '52.87% — near state average' },
      { label: 'ELL concentration', value: '6.1% (885 students)' },
      { label: 'FRPM rate', value: '51.5%' },
      { label: 'Chronic absenteeism', value: '17.2% — moderate' },
    ],
  },
  goals: [
    {
      goalId: 'rock-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Excellence and Continuous Improvement',
      description: 'Maintain and accelerate academic achievement across grades K-12 through rigorous standards-aligned instruction, data-driven intervention, and continuous improvement of instructional practice.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-rock-lcap',
      actions: [
        {
          actionId: 'rock-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Standards-Aligned Instructional Materials and Teacher Development',
          description: 'Adopt and implement standards-aligned instructional materials across grades K-12 with embedded professional development, coaching cycles, and formative assessment protocols to sustain growth trajectories.',
          totalFunds: '$1,200,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-rock-lcap',
        },
        {
          actionId: 'rock-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Professional Development and Instructional Coaching',
          description: 'Provide embedded professional development and instructional coaching to support implementation of standards-aligned materials, formative assessment practices, and differentiated instruction across grades K-12.',
          totalFunds: '$720,000',
          fundingSource: 'Title II',
          status: 'in_progress' as const,
          sourceId: 'src-rock-lcap',
        },
        {
          actionId: 'rock-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-12.',
          totalFunds: '$520,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-rock-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 38.89% and ELA at 52.87%, Rocklin Unified maintains moderate academic performance. Chronic absenteeism at 17.2% is a moderate concern.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '38.89%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '52.87%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'FRPM rate', value: '51.5% (2023-24)' },
      { label: 'Chronic absenteeism', value: '17.2% — moderate' },
    ],
  },
  prioritySummary: 'Rocklin Unified is a 14,407-student K-12 district in Placer County. Math at 38.89% (below state average) and ELA at 52.87% (near state average) indicate targeted improvement opportunities. LCFF Base is the primary funding mechanism. Position around instructional quality and standards alignment.',
  sources: [
    { sourceId: 'src-rock-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-rock-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: YUBA CITY UNIFIED (dist-yuba-001)
// ============================================================

INTELLIGENCE_MAP['dist-yuba-001'] = {
  districtId: 'dist-yuba-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Yuba City Unified is a K-12 district in Sutter County serving 13,206 students. Math proficiency at 59.42% is above state average and ELA at 65.22% is well above state average. The district serves 5.7% ELL (low) and 20.6% FRPM students. Chronic absenteeism at 9.5% is low — district strength. LCAP priorities center on instructional quality and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '59.42% — above state average' },
      { label: 'ELA proficiency', value: '65.22% — well above state average' },
      { label: 'ELL concentration', value: '5.7% (754 students)' },
      { label: 'FRPM rate', value: '20.6%' },
      { label: 'Chronic absenteeism', value: '9.5% — low — district strength' },
    ],
  },
  goals: [
    {
      goalId: 'yuba-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Excellence and Continuous Improvement',
      description: 'Maintain and accelerate academic achievement across grades K-12 through rigorous standards-aligned instruction, data-driven intervention, and continuous improvement of instructional practice.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-yuba-lcap',
      actions: [
        {
          actionId: 'yuba-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Standards-Aligned Instructional Materials and Teacher Development',
          description: 'Adopt and implement standards-aligned instructional materials across grades K-12 with embedded professional development, coaching cycles, and formative assessment protocols to sustain growth trajectories.',
          totalFunds: '$1,200,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-yuba-lcap',
        },
        {
          actionId: 'yuba-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Professional Development and Instructional Coaching',
          description: 'Provide embedded professional development and instructional coaching to support implementation of standards-aligned materials, formative assessment practices, and differentiated instruction across grades K-12.',
          totalFunds: '$720,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-yuba-lcap',
        },
        {
          actionId: 'yuba-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-12.',
          totalFunds: '$520,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-yuba-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 59.42% and ELA at 65.22%, Yuba City Unified maintains moderate academic performance. Chronic absenteeism at 9.5% is a district strength.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '59.42%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '65.22%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'FRPM rate', value: '20.6% (2023-24)' },
      { label: 'Chronic absenteeism', value: '9.5% — low — district strength' },
    ],
  },
  prioritySummary: 'Yuba City Unified is a 13,206-student K-12 district in Sutter County. Math at 59.42% (above state average) and ELA at 65.22% (well above state average) show a foundation for acceleration. LCFF Base is the primary funding mechanism. Position around instructional quality and standards alignment.',
  sources: [
    { sourceId: 'src-yuba-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-yuba-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: MERCED UNION HIGH (dist-merced-001)
// ============================================================

INTELLIGENCE_MAP['dist-merced-001'] = {
  districtId: 'dist-merced-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Merced Union High is a 9-12 district in Merced County serving 12,211 students. Math proficiency at 24.51% is well below state average and ELA at 38.45% is below state average. The district serves 21.6% English Learners and 69.7% FRPM students. Chronic absenteeism at 18.3% is moderate. LCAP priorities center on foundational numeracy and literacy intervention.',
    keySignals: [
      { label: 'Math proficiency', value: '24.51% — well below state average' },
      { label: 'ELA proficiency', value: '38.45% — below state average' },
      { label: 'ELL concentration', value: '21.6% (2,636 students)' },
      { label: 'FRPM rate', value: '69.7% — generates substantial Supplemental & Concentration funding' },
      { label: 'Chronic absenteeism', value: '18.3% — moderate' },
    ],
  },
  goals: [
    {
      goalId: 'merced-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Achievement in Mathematics',
      description: 'Increase the percentage of students meeting or exceeding grade-level standards in mathematics across grades 9-12 through adoption of standards-aligned instructional materials, targeted intervention, and teacher professional development.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-merced-lcap',
      actions: [
        {
          actionId: 'merced-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Mathematics Curriculum Adoption and Intervention',
          description: 'Adopt standards-aligned mathematics instructional materials for grades 9-12 with embedded intervention pathways. Provide teacher coaching and collaborative planning time to support implementation fidelity.',
          totalFunds: '$1,200,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-merced-lcap',
        },
        {
          actionId: 'merced-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Mathematics Intervention and Diagnostic Assessment',
          description: 'Implement tiered mathematics intervention for students performing below grade level across grades 9-12, using diagnostic assessment data to assign targeted supports and monitor progress.',
          totalFunds: '$720,000',
          fundingSource: 'Title I',
          status: 'in_progress' as const,
          sourceId: 'src-merced-lcap',
        },
        {
          actionId: 'merced-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades 9-12.',
          totalFunds: '$520,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-merced-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 24.51% and ELA at 38.45%, Merced Union High faces significant academic challenges across both subjects. English Learners comprise 21.6% of enrollment, driving overall proficiency rates. FRPM at 69.7% generates substantial Supplemental & Concentration funding eligibility. Chronic absenteeism at 18.3% is a moderate concern.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '24.51%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '38.45%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '21.6% of enrollment' },
      { label: 'FRPM rate', value: '69.7% (2023-24)' },
      { label: 'Chronic absenteeism', value: '18.3% — moderate' },
    ],
  },
  prioritySummary: 'Merced Union High is a 12,211-student 9-12 district in Merced County. Math at 24.51% (well below state average) and ELA at 38.45% (below state average) create dual-subject urgency. FRPM at 69.7% unlocks significant LCFF Supplemental & Concentration funding. Position around foundational numeracy and literacy intervention.',
  sources: [
    { sourceId: 'src-merced-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-merced-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: MARYSVILLE JOINT UNIFIED (dist-mary-001)
// ============================================================

INTELLIGENCE_MAP['dist-mary-001'] = {
  districtId: 'dist-mary-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Marysville Joint Unified is a K-12 district in Yuba County serving 11,120 students. Math proficiency at 10.52% is critically low and ELA at 41.6% is below state average. The district serves 11.6% English Learners and 79.6% FRPM students. Chronic absenteeism at 26.7% is high. LCAP priorities center on foundational numeracy and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '10.52% — critically low' },
      { label: 'ELA proficiency', value: '41.6% — below state average' },
      { label: 'ELL concentration', value: '11.6% (1,295 students)' },
      { label: 'FRPM rate', value: '79.6% — generates substantial Supplemental & Concentration funding' },
      { label: 'Chronic absenteeism', value: '26.7% — high' },
    ],
  },
  goals: [
    {
      goalId: 'mary-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Achievement in Mathematics',
      description: 'Increase the percentage of students meeting or exceeding grade-level standards in mathematics across grades K-12 through adoption of standards-aligned instructional materials, targeted intervention, and teacher professional development.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-mary-lcap',
      actions: [
        {
          actionId: 'mary-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Mathematics Curriculum Adoption and Intervention',
          description: 'Adopt standards-aligned mathematics instructional materials for grades K-12 with embedded intervention pathways. Provide teacher coaching and collaborative planning time to support implementation fidelity.',
          totalFunds: '$1,200,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-mary-lcap',
        },
        {
          actionId: 'mary-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Mathematics Intervention and Diagnostic Assessment',
          description: 'Implement tiered mathematics intervention for students performing below grade level across grades K-12, using diagnostic assessment data to assign targeted supports and monitor progress.',
          totalFunds: '$720,000',
          fundingSource: 'Title I',
          status: 'in_progress' as const,
          sourceId: 'src-mary-lcap',
        },
        {
          actionId: 'mary-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-12.',
          totalFunds: '$520,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-mary-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 10.52% and ELA at 41.6%, Marysville Joint Unified shows mixed performance across subjects. FRPM at 79.6% generates substantial Supplemental & Concentration funding eligibility. Chronic absenteeism at 26.7% compounds instructional challenges.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '10.52%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '41.6%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '11.6% of enrollment' },
      { label: 'FRPM rate', value: '79.6% (2023-24)' },
      { label: 'Chronic absenteeism', value: '26.7% — high' },
    ],
  },
  prioritySummary: 'Marysville Joint Unified is a 11,120-student K-12 district in Yuba County. Math at 10.52% (critically low) and ELA at 41.6% (below state average) indicate targeted improvement opportunities. FRPM at 79.6% unlocks significant LCFF Supplemental & Concentration funding. Chronic absenteeism at 26.7% requires attention to engagement and attendance supports. Position around foundational numeracy and literacy intervention.',
  sources: [
    { sourceId: 'src-mary-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-mary-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: BUCKEYE UNION ELEMENTARY (dist-buck-001)
// ============================================================

INTELLIGENCE_MAP['dist-buck-001'] = {
  districtId: 'dist-buck-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Buckeye Union Elementary is a K-8 district in El Dorado County serving 10,539 students. Math proficiency at 18.88% is critically low and ELA at 32.02% is well below state average. The district serves 17.7% English Learners and 66.3% FRPM students. Chronic absenteeism at 24.0% is elevated. LCAP priorities center on foundational numeracy and literacy intervention.',
    keySignals: [
      { label: 'Math proficiency', value: '18.88% — critically low' },
      { label: 'ELA proficiency', value: '32.02% — well below state average' },
      { label: 'ELL concentration', value: '17.7% (1,865 students)' },
      { label: 'FRPM rate', value: '66.3% — generates substantial Supplemental & Concentration funding' },
      { label: 'Chronic absenteeism', value: '24.0% — elevated' },
    ],
  },
  goals: [
    {
      goalId: 'buck-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Achievement in Mathematics',
      description: 'Increase the percentage of students meeting or exceeding grade-level standards in mathematics across grades K-8 through adoption of standards-aligned instructional materials, targeted intervention, and teacher professional development.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-buck-lcap',
      actions: [
        {
          actionId: 'buck-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Mathematics Curriculum Adoption and Intervention',
          description: 'Adopt standards-aligned mathematics instructional materials for grades K-8 with embedded intervention pathways. Provide teacher coaching and collaborative planning time to support implementation fidelity.',
          totalFunds: '$1,200,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-buck-lcap',
        },
        {
          actionId: 'buck-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Mathematics Intervention and Diagnostic Assessment',
          description: 'Implement tiered mathematics intervention for students performing below grade level across grades K-8, using diagnostic assessment data to assign targeted supports and monitor progress.',
          totalFunds: '$720,000',
          fundingSource: 'Title I',
          status: 'in_progress' as const,
          sourceId: 'src-buck-lcap',
        },
        {
          actionId: 'buck-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-8.',
          totalFunds: '$520,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-buck-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 18.88% and ELA at 32.02%, Buckeye Union Elementary faces significant academic challenges across both subjects. FRPM at 66.3% generates substantial Supplemental & Concentration funding eligibility. Chronic absenteeism at 24.0% is a moderate concern.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '18.88%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '32.02%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '17.7% of enrollment' },
      { label: 'FRPM rate', value: '66.3% (2023-24)' },
      { label: 'Chronic absenteeism', value: '24.0% — elevated' },
    ],
  },
  prioritySummary: 'Buckeye Union Elementary is a 10,539-student K-8 district in El Dorado County. Math at 18.88% (critically low) and ELA at 32.02% (well below state average) create dual-subject urgency. FRPM at 66.3% unlocks significant LCFF Supplemental & Concentration funding. Position around foundational numeracy and literacy intervention.',
  sources: [
    { sourceId: 'src-buck-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-buck-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: SAN MATEO-FOSTER CITY (dist-smfc-001)
// ============================================================

INTELLIGENCE_MAP['dist-smfc-001'] = {
  districtId: 'dist-smfc-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'San Mateo-Foster City is a K-8 district in San Mateo County serving 10,189 students. Math proficiency at 65.19% is well above state average and ELA at 68.94% is well above state average. The district serves 4.7% ELL (low) and 32.3% FRPM students. Chronic absenteeism at 4.7% is low — district strength. LCAP priorities center on instructional quality and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '65.19% — well above state average' },
      { label: 'ELA proficiency', value: '68.94% — well above state average' },
      { label: 'ELL concentration', value: '4.7% (481 students)' },
      { label: 'FRPM rate', value: '32.3%' },
      { label: 'Chronic absenteeism', value: '4.7% — low — district strength' },
    ],
  },
  goals: [
    {
      goalId: 'smfc-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Excellence and Continuous Improvement',
      description: 'Maintain and accelerate academic achievement across grades K-8 through rigorous standards-aligned instruction, data-driven intervention, and continuous improvement of instructional practice.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-smfc-lcap',
      actions: [
        {
          actionId: 'smfc-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Standards-Aligned Instructional Materials and Teacher Development',
          description: 'Adopt and implement standards-aligned instructional materials across grades K-8 with embedded professional development, coaching cycles, and formative assessment protocols to sustain growth trajectories.',
          totalFunds: '$1,200,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-smfc-lcap',
        },
        {
          actionId: 'smfc-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Professional Development and Instructional Coaching',
          description: 'Provide embedded professional development and instructional coaching to support implementation of standards-aligned materials, formative assessment practices, and differentiated instruction across grades K-8.',
          totalFunds: '$720,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-smfc-lcap',
        },
        {
          actionId: 'smfc-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-8.',
          totalFunds: '$520,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-smfc-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 65.19% and ELA at 68.94%, San Mateo-Foster City maintains moderate academic performance. Chronic absenteeism at 4.7% is a district strength.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '65.19%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '68.94%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'FRPM rate', value: '32.3% (2023-24)' },
      { label: 'Chronic absenteeism', value: '4.7% — low — district strength' },
    ],
  },
  prioritySummary: 'San Mateo-Foster City is a 10,189-student K-8 district in San Mateo County. Math at 65.19% (well above state average) and ELA at 68.94% (well above state average) show a foundation for acceleration. LCFF Base is the primary funding mechanism. Position around instructional quality and standards alignment.',
  sources: [
    { sourceId: 'src-smfc-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-smfc-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: SANTA ROSA HIGH (dist-srh-001)
// ============================================================

INTELLIGENCE_MAP['dist-srh-001'] = {
  districtId: 'dist-srh-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Santa Rosa High is a 9-12 district in Sonoma County serving 9,945 students. Math proficiency at 50.65% is above state average and ELA at 55.03% is above state average. The district serves 28.2% English Learners and 35.2% FRPM students. Chronic absenteeism at 17.7% is moderate. LCAP priorities center on English Learner achievement and instructional quality and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '50.65% — above state average' },
      { label: 'ELA proficiency', value: '55.03% — above state average' },
      { label: 'ELL concentration', value: '28.2% (2,804 students)' },
      { label: 'FRPM rate', value: '35.2%' },
      { label: 'Chronic absenteeism', value: '17.7% — moderate' },
    ],
  },
  goals: [
    {
      goalId: 'srh-goal-1',
      goalNumber: 'Goal 1',
      title: 'English Learner Achievement and Academic Proficiency',
      description: 'Increase English Learner reclassification rates and academic proficiency in English Language Arts and mathematics through expanded designated and integrated ELD instruction, progress monitoring, and culturally responsive instructional strategies across grades 9-12.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-srh-lcap',
      actions: [
        {
          actionId: 'srh-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'ELD Materials and Instructional Coaching',
          description: 'Adopt and implement designated ELD instructional materials for grades 9-12 aligned with CA ELD Standards. Provide embedded coaching, collaborative planning, and instructional modeling to support consistent ELD implementation across content areas.',
          totalFunds: '$850,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-srh-lcap',
        },
        {
          actionId: 'srh-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Bilingual and Primary Language Literacy Resources',
          description: 'Expand primary language literacy materials and dual-language pathway resources for newcomer and early-intermediate English Learner students, supporting literacy transfer to English while maintaining primary language development.',
          totalFunds: '$480,000',
          fundingSource: 'Title III',
          status: 'in_progress' as const,
          sourceId: 'src-srh-lcap',
        },
        {
          actionId: 'srh-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades 9-12.',
          totalFunds: '$380,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-srh-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 50.65% and ELA at 55.03%, Santa Rosa High maintains moderate academic performance. English Learners comprise 28.2% of enrollment, driving overall proficiency rates. Chronic absenteeism at 17.7% is a moderate concern.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '50.65%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '55.03%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '28.2% of enrollment' },
      { label: 'FRPM rate', value: '35.2% (2023-24)' },
      { label: 'Chronic absenteeism', value: '17.7% — moderate' },
    ],
  },
  prioritySummary: 'Santa Rosa High is a 9,945-student 9-12 district in Sonoma County. Math at 50.65% (above state average) and ELA at 55.03% (above state average) show a foundation for acceleration. High ELL concentration (28.2%) makes EL-specific instructional materials the primary pitch angle. LCFF Base is the primary funding mechanism. Position around EL achievement and foundational literacy.',
  sources: [
    { sourceId: 'src-srh-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-srh-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: LUCIA MAR UNIFIED (dist-lucia-001)
// ============================================================

INTELLIGENCE_MAP['dist-lucia-001'] = {
  districtId: 'dist-lucia-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Lucia Mar Unified is a K-12 district in San Luis Obispo County serving 9,941 students. Math proficiency at 25.05% is well below state average and ELA at 39.71% is below state average. The district serves 14.6% English Learners and 42.8% FRPM students. Chronic absenteeism at 27.0% is high. LCAP priorities center on foundational numeracy and literacy intervention.',
    keySignals: [
      { label: 'Math proficiency', value: '25.05% — well below state average' },
      { label: 'ELA proficiency', value: '39.71% — below state average' },
      { label: 'ELL concentration', value: '14.6% (1,455 students)' },
      { label: 'FRPM rate', value: '42.8%' },
      { label: 'Chronic absenteeism', value: '27.0% — high' },
    ],
  },
  goals: [
    {
      goalId: 'lucia-goal-1',
      goalNumber: 'Goal 1',
      title: 'Literacy and Language Arts Achievement',
      description: 'Increase the percentage of students meeting or exceeding grade-level standards in English Language Arts across grades K-12 through implementation of evidence-based literacy instruction, foundational reading supports, and structured intervention.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-lucia-lcap',
      actions: [
        {
          actionId: 'lucia-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'ELA Instructional Materials and Literacy Intervention',
          description: 'Implement evidence-based ELA instructional materials for grades K-12 with structured literacy intervention for students below grade level. Provide professional development in science of reading and formative assessment practices.',
          totalFunds: '$850,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-lucia-lcap',
        },
        {
          actionId: 'lucia-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Mathematics Intervention and Diagnostic Assessment',
          description: 'Implement tiered mathematics intervention for students performing below grade level across grades K-12, using diagnostic assessment data to assign targeted supports and monitor progress.',
          totalFunds: '$480,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-lucia-lcap',
        },
        {
          actionId: 'lucia-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-12.',
          totalFunds: '$380,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-lucia-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 25.05% and ELA at 39.71%, Lucia Mar Unified faces significant academic challenges across both subjects. Chronic absenteeism at 27.0% compounds instructional challenges.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '25.05%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '39.71%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '14.6% of enrollment' },
      { label: 'FRPM rate', value: '42.8% (2023-24)' },
      { label: 'Chronic absenteeism', value: '27.0% — high' },
    ],
  },
  prioritySummary: 'Lucia Mar Unified is a 9,941-student K-12 district in San Luis Obispo County. Math at 25.05% (well below state average) and ELA at 39.71% (below state average) create dual-subject urgency. LCFF Base is the primary funding mechanism. Chronic absenteeism at 27.0% requires attention to engagement and attendance supports. Position around foundational numeracy and literacy intervention.',
  sources: [
    { sourceId: 'src-lucia-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-lucia-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: WOODLAND JOINT UNIFIED (dist-wood-001)
// ============================================================

INTELLIGENCE_MAP['dist-wood-001'] = {
  districtId: 'dist-wood-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Woodland Joint Unified is a K-12 district in Yolo County serving 9,621 students. Math proficiency at 36.02% is below state average and ELA at 52.26% is near state average. The district serves 11.5% English Learners and 60.4% FRPM students. Chronic absenteeism at 15.4% is moderate. LCAP priorities center on instructional quality and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '36.02% — below state average' },
      { label: 'ELA proficiency', value: '52.26% — near state average' },
      { label: 'ELL concentration', value: '11.5% (1,108 students)' },
      { label: 'FRPM rate', value: '60.4% — generates substantial Supplemental & Concentration funding' },
      { label: 'Chronic absenteeism', value: '15.4% — moderate' },
    ],
  },
  goals: [
    {
      goalId: 'wood-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Excellence and Continuous Improvement',
      description: 'Maintain and accelerate academic achievement across grades K-12 through rigorous standards-aligned instruction, data-driven intervention, and continuous improvement of instructional practice.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-wood-lcap',
      actions: [
        {
          actionId: 'wood-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Standards-Aligned Instructional Materials and Teacher Development',
          description: 'Adopt and implement standards-aligned instructional materials across grades K-12 with embedded professional development, coaching cycles, and formative assessment protocols to sustain growth trajectories.',
          totalFunds: '$850,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-wood-lcap',
        },
        {
          actionId: 'wood-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Professional Development and Instructional Coaching',
          description: 'Provide embedded professional development and instructional coaching to support implementation of standards-aligned materials, formative assessment practices, and differentiated instruction across grades K-12.',
          totalFunds: '$480,000',
          fundingSource: 'Title II',
          status: 'in_progress' as const,
          sourceId: 'src-wood-lcap',
        },
        {
          actionId: 'wood-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-12.',
          totalFunds: '$380,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-wood-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 36.02% and ELA at 52.26%, Woodland Joint Unified maintains moderate academic performance. FRPM at 60.4% generates substantial Supplemental & Concentration funding eligibility. Chronic absenteeism at 15.4% is a moderate concern.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '36.02%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '52.26%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '11.5% of enrollment' },
      { label: 'FRPM rate', value: '60.4% (2023-24)' },
      { label: 'Chronic absenteeism', value: '15.4% — moderate' },
    ],
  },
  prioritySummary: 'Woodland Joint Unified is a 9,621-student K-12 district in Yolo County. Math at 36.02% (below state average) and ELA at 52.26% (near state average) indicate targeted improvement opportunities. FRPM at 60.4% unlocks significant LCFF Supplemental & Concentration funding. Position around instructional quality and standards alignment.',
  sources: [
    { sourceId: 'src-wood-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-wood-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: SHASTA UNION HIGH (dist-shasta-001)
// ============================================================

INTELLIGENCE_MAP['dist-shasta-001'] = {
  districtId: 'dist-shasta-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Shasta Union High is a 9-12 district in Shasta County serving 5,568 students. Math proficiency at 37.68% is below state average and ELA at 45.09% is near state average. The district serves 18.9% English Learners and 80.2% FRPM students. Chronic absenteeism at 13.2% is below state average. LCAP priorities center on instructional quality and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '37.68% — below state average' },
      { label: 'ELA proficiency', value: '45.09% — near state average' },
      { label: 'ELL concentration', value: '18.9% (1,051 students)' },
      { label: 'FRPM rate', value: '80.2% — generates substantial Supplemental & Concentration funding' },
      { label: 'Chronic absenteeism', value: '13.2% — below state average' },
    ],
  },
  goals: [
    {
      goalId: 'shasta-goal-1',
      goalNumber: 'Goal 1',
      title: 'Equitable Access to Quality Instruction',
      description: 'Ensure equitable access to high-quality, standards-aligned instruction for all students across grades 9-12, with priority supports for socioeconomically disadvantaged students, English Learners, and students with disabilities.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-shasta-lcap',
      actions: [
        {
          actionId: 'shasta-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Instructional Quality and Equity Supports',
          description: 'Strengthen instructional quality across grades 9-12 through standards-aligned materials adoption, embedded professional development, and targeted academic supports for unduplicated pupil groups.',
          totalFunds: '$850,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-shasta-lcap',
        },
        {
          actionId: 'shasta-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Professional Development and Instructional Coaching',
          description: 'Provide embedded professional development and instructional coaching to support implementation of standards-aligned materials, formative assessment practices, and differentiated instruction across grades 9-12.',
          totalFunds: '$480,000',
          fundingSource: 'Title II',
          status: 'in_progress' as const,
          sourceId: 'src-shasta-lcap',
        },
        {
          actionId: 'shasta-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades 9-12.',
          totalFunds: '$380,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-shasta-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 37.68% and ELA at 45.09%, Shasta Union High maintains moderate academic performance. FRPM at 80.2% generates substantial Supplemental & Concentration funding eligibility. Chronic absenteeism at 13.2% is a district strength.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '37.68%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '45.09%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '18.9% of enrollment' },
      { label: 'FRPM rate', value: '80.2% (2023-24)' },
      { label: 'Chronic absenteeism', value: '13.2% — below state average' },
    ],
  },
  prioritySummary: 'Shasta Union High is a 5,568-student 9-12 district in Shasta County. Math at 37.68% (below state average) and ELA at 45.09% (near state average) indicate targeted improvement opportunities. FRPM at 80.2% unlocks significant LCFF Supplemental & Concentration funding. Position around instructional quality and standards alignment.',
  sources: [
    { sourceId: 'src-shasta-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-shasta-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: HUNTINGTON BEACH CITY ELEMENTARY (dist-hb-001)
// ============================================================

INTELLIGENCE_MAP['dist-hb-001'] = {
  districtId: 'dist-hb-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Huntington Beach City Elementary is a K-8 district in Orange County serving 5,501 students. Math proficiency at 40.3% is near state average and ELA at 62.62% is above state average. The district serves 1.9% ELL (low) and 48.8% FRPM students. Chronic absenteeism at 18.4% is moderate. LCAP priorities center on instructional quality and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '40.3% — near state average' },
      { label: 'ELA proficiency', value: '62.62% — above state average' },
      { label: 'ELL concentration', value: '1.9% (105 students)' },
      { label: 'FRPM rate', value: '48.8%' },
      { label: 'Chronic absenteeism', value: '18.4% — moderate' },
    ],
  },
  goals: [
    {
      goalId: 'hb-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Excellence and Continuous Improvement',
      description: 'Maintain and accelerate academic achievement across grades K-8 through rigorous standards-aligned instruction, data-driven intervention, and continuous improvement of instructional practice.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-hb-lcap',
      actions: [
        {
          actionId: 'hb-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Standards-Aligned Instructional Materials and Teacher Development',
          description: 'Adopt and implement standards-aligned instructional materials across grades K-8 with embedded professional development, coaching cycles, and formative assessment protocols to sustain growth trajectories.',
          totalFunds: '$850,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-hb-lcap',
        },
        {
          actionId: 'hb-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Professional Development and Instructional Coaching',
          description: 'Provide embedded professional development and instructional coaching to support implementation of standards-aligned materials, formative assessment practices, and differentiated instruction across grades K-8.',
          totalFunds: '$480,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-hb-lcap',
        },
        {
          actionId: 'hb-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-8.',
          totalFunds: '$380,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-hb-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 40.3% and ELA at 62.62%, Huntington Beach City Elementary maintains moderate academic performance. Chronic absenteeism at 18.4% is a moderate concern.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '40.3%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '62.62%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'FRPM rate', value: '48.8% (2023-24)' },
      { label: 'Chronic absenteeism', value: '18.4% — moderate' },
    ],
  },
  prioritySummary: 'Huntington Beach City Elementary is a 5,501-student K-8 district in Orange County. Math at 40.3% (near state average) and ELA at 62.62% (above state average) show a foundation for acceleration. LCFF Base is the primary funding mechanism. Position around instructional quality and standards alignment.',
  sources: [
    { sourceId: 'src-hb-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-hb-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: ATWATER ELEMENTARY (dist-atwater-001)
// ============================================================

INTELLIGENCE_MAP['dist-atwater-001'] = {
  districtId: 'dist-atwater-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Atwater Elementary is a K-8 district in Merced County serving 4,974 students. Math proficiency at 64.83% is well above state average and ELA at 70.14% is well above state average. The district serves 5.1% ELL (low) and 31.2% FRPM students. Chronic absenteeism at 9.5% is low — district strength. LCAP priorities center on instructional quality and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '64.83% — well above state average' },
      { label: 'ELA proficiency', value: '70.14% — well above state average' },
      { label: 'ELL concentration', value: '5.1% (253 students)' },
      { label: 'FRPM rate', value: '31.2%' },
      { label: 'Chronic absenteeism', value: '9.5% — low — district strength' },
    ],
  },
  goals: [
    {
      goalId: 'atwater-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Excellence and Continuous Improvement',
      description: 'Maintain and accelerate academic achievement across grades K-8 through rigorous standards-aligned instruction, data-driven intervention, and continuous improvement of instructional practice.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-atwater-lcap',
      actions: [
        {
          actionId: 'atwater-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Standards-Aligned Instructional Materials and Teacher Development',
          description: 'Adopt and implement standards-aligned instructional materials across grades K-8 with embedded professional development, coaching cycles, and formative assessment protocols to sustain growth trajectories.',
          totalFunds: '$550,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-atwater-lcap',
        },
        {
          actionId: 'atwater-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Professional Development and Instructional Coaching',
          description: 'Provide embedded professional development and instructional coaching to support implementation of standards-aligned materials, formative assessment practices, and differentiated instruction across grades K-8.',
          totalFunds: '$350,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-atwater-lcap',
        },
        {
          actionId: 'atwater-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-8.',
          totalFunds: '$280,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-atwater-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 64.83% and ELA at 70.14%, Atwater Elementary maintains moderate academic performance. Chronic absenteeism at 9.5% is a district strength.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '64.83%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '70.14%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'FRPM rate', value: '31.2% (2023-24)' },
      { label: 'Chronic absenteeism', value: '9.5% — low — district strength' },
    ],
  },
  prioritySummary: 'Atwater Elementary is a 4,974-student K-8 district in Merced County. Math at 64.83% (well above state average) and ELA at 70.14% (well above state average) show a foundation for acceleration. LCFF Base is the primary funding mechanism. Position around instructional quality and standards alignment.',
  sources: [
    { sourceId: 'src-atwater-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-atwater-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: MAGNOLIA ELEMENTARY (dist-mag-001)
// ============================================================

INTELLIGENCE_MAP['dist-mag-001'] = {
  districtId: 'dist-mag-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Magnolia Elementary is a K-8 district in Orange County serving 4,959 students. Math proficiency at 31.94% is below state average and ELA at 44.38% is below state average. The district serves 27.2% English Learners and 79.1% FRPM students. Chronic absenteeism at 11.4% is below state average. LCAP priorities center on English Learner achievement and instructional quality and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '31.94% — below state average' },
      { label: 'ELA proficiency', value: '44.38% — below state average' },
      { label: 'ELL concentration', value: '27.2% (1,351 students)' },
      { label: 'FRPM rate', value: '79.1% — generates substantial Supplemental & Concentration funding' },
      { label: 'Chronic absenteeism', value: '11.4% — below state average' },
    ],
  },
  goals: [
    {
      goalId: 'mag-goal-1',
      goalNumber: 'Goal 1',
      title: 'English Learner Achievement and Academic Proficiency',
      description: 'Increase English Learner reclassification rates and academic proficiency in English Language Arts and mathematics through expanded designated and integrated ELD instruction, progress monitoring, and culturally responsive instructional strategies across grades K-8.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-mag-lcap',
      actions: [
        {
          actionId: 'mag-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'ELD Materials and Instructional Coaching',
          description: 'Adopt and implement designated ELD instructional materials for grades K-8 aligned with CA ELD Standards. Provide embedded coaching, collaborative planning, and instructional modeling to support consistent ELD implementation across content areas.',
          totalFunds: '$550,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-mag-lcap',
        },
        {
          actionId: 'mag-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Bilingual and Primary Language Literacy Resources',
          description: 'Expand primary language literacy materials and dual-language pathway resources for newcomer and early-intermediate English Learner students, supporting literacy transfer to English while maintaining primary language development.',
          totalFunds: '$350,000',
          fundingSource: 'Title III',
          status: 'in_progress' as const,
          sourceId: 'src-mag-lcap',
        },
        {
          actionId: 'mag-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-8.',
          totalFunds: '$280,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-mag-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 31.94% and ELA at 44.38%, Magnolia Elementary shows mixed performance across subjects. English Learners comprise 27.2% of enrollment, driving overall proficiency rates. FRPM at 79.1% generates substantial Supplemental & Concentration funding eligibility. Chronic absenteeism at 11.4% is a district strength.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '31.94%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '44.38%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '27.2% of enrollment' },
      { label: 'FRPM rate', value: '79.1% (2023-24)' },
      { label: 'Chronic absenteeism', value: '11.4% — below state average' },
    ],
  },
  prioritySummary: 'Magnolia Elementary is a 4,959-student K-8 district in Orange County. Math at 31.94% (below state average) and ELA at 44.38% (below state average) indicate targeted improvement opportunities. High ELL concentration (27.2%) makes EL-specific instructional materials the primary pitch angle. FRPM at 79.1% unlocks significant LCFF Supplemental & Concentration funding. Position around EL achievement and foundational literacy.',
  sources: [
    { sourceId: 'src-mag-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-mag-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: LAWNDALE ELEMENTARY (dist-lawn-001)
// ============================================================

INTELLIGENCE_MAP['dist-lawn-001'] = {
  districtId: 'dist-lawn-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Lawndale Elementary is a K-8 district in Los Angeles County serving 4,920 students. Math proficiency at 40.54% is near state average and ELA at 46.65% is near state average. The district serves 40.9% English Learners and 79.9% FRPM students. Chronic absenteeism at 18.5% is moderate. LCAP priorities center on English Learner achievement and instructional quality and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '40.54% — near state average' },
      { label: 'ELA proficiency', value: '46.65% — near state average' },
      { label: 'ELL concentration', value: '40.9% (2,013 students)' },
      { label: 'FRPM rate', value: '79.9% — generates substantial Supplemental & Concentration funding' },
      { label: 'Chronic absenteeism', value: '18.5% — moderate' },
    ],
  },
  goals: [
    {
      goalId: 'lawn-goal-1',
      goalNumber: 'Goal 1',
      title: 'English Learner Achievement and Academic Proficiency',
      description: 'Increase English Learner reclassification rates and academic proficiency in English Language Arts and mathematics through expanded designated and integrated ELD instruction, progress monitoring, and culturally responsive instructional strategies across grades K-8.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-lawn-lcap',
      actions: [
        {
          actionId: 'lawn-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'ELD Materials and Instructional Coaching',
          description: 'Adopt and implement designated ELD instructional materials for grades K-8 aligned with CA ELD Standards. Provide embedded coaching, collaborative planning, and instructional modeling to support consistent ELD implementation across content areas.',
          totalFunds: '$550,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-lawn-lcap',
        },
        {
          actionId: 'lawn-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Bilingual and Primary Language Literacy Resources',
          description: 'Expand primary language literacy materials and dual-language pathway resources for newcomer and early-intermediate English Learner students, supporting literacy transfer to English while maintaining primary language development.',
          totalFunds: '$350,000',
          fundingSource: 'Title III',
          status: 'in_progress' as const,
          sourceId: 'src-lawn-lcap',
        },
        {
          actionId: 'lawn-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-8.',
          totalFunds: '$280,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-lawn-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 40.54% and ELA at 46.65%, Lawndale Elementary maintains moderate academic performance. English Learners comprise 40.9% of enrollment, driving overall proficiency rates. FRPM at 79.9% generates substantial Supplemental & Concentration funding eligibility. Chronic absenteeism at 18.5% is a moderate concern.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '40.54%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '46.65%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '40.9% of enrollment' },
      { label: 'FRPM rate', value: '79.9% (2023-24)' },
      { label: 'Chronic absenteeism', value: '18.5% — moderate' },
    ],
  },
  prioritySummary: 'Lawndale Elementary is a 4,920-student K-8 district in Los Angeles County. Math at 40.54% (near state average) and ELA at 46.65% (near state average) show a foundation for acceleration. High ELL concentration (40.9%) makes EL-specific instructional materials the primary pitch angle. FRPM at 79.9% unlocks significant LCFF Supplemental & Concentration funding. Position around EL achievement and foundational literacy.',
  sources: [
    { sourceId: 'src-lawn-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-lawn-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: SANTA ROSA ELEMENTARY (dist-sre-001)
// ============================================================

INTELLIGENCE_MAP['dist-sre-001'] = {
  districtId: 'dist-sre-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Santa Rosa Elementary is a K-8 district in Sonoma County serving 4,910 students. Math proficiency at 35.65% is below state average and ELA at 48.66% is near state average. The district serves 26.1% English Learners and 79.9% FRPM students. Chronic absenteeism at 20.2% is elevated. LCAP priorities center on English Learner achievement and instructional quality and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '35.65% — below state average' },
      { label: 'ELA proficiency', value: '48.66% — near state average' },
      { label: 'ELL concentration', value: '26.1% (1,280 students)' },
      { label: 'FRPM rate', value: '79.9% — generates substantial Supplemental & Concentration funding' },
      { label: 'Chronic absenteeism', value: '20.2% — elevated' },
    ],
  },
  goals: [
    {
      goalId: 'sre-goal-1',
      goalNumber: 'Goal 1',
      title: 'English Learner Achievement and Academic Proficiency',
      description: 'Increase English Learner reclassification rates and academic proficiency in English Language Arts and mathematics through expanded designated and integrated ELD instruction, progress monitoring, and culturally responsive instructional strategies across grades K-8.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-sre-lcap',
      actions: [
        {
          actionId: 'sre-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'ELD Materials and Instructional Coaching',
          description: 'Adopt and implement designated ELD instructional materials for grades K-8 aligned with CA ELD Standards. Provide embedded coaching, collaborative planning, and instructional modeling to support consistent ELD implementation across content areas.',
          totalFunds: '$550,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-sre-lcap',
        },
        {
          actionId: 'sre-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Bilingual and Primary Language Literacy Resources',
          description: 'Expand primary language literacy materials and dual-language pathway resources for newcomer and early-intermediate English Learner students, supporting literacy transfer to English while maintaining primary language development.',
          totalFunds: '$350,000',
          fundingSource: 'Title III',
          status: 'in_progress' as const,
          sourceId: 'src-sre-lcap',
        },
        {
          actionId: 'sre-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-8.',
          totalFunds: '$280,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-sre-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 35.65% and ELA at 48.66%, Santa Rosa Elementary maintains moderate academic performance. English Learners comprise 26.1% of enrollment, driving overall proficiency rates. FRPM at 79.9% generates substantial Supplemental & Concentration funding eligibility. Chronic absenteeism at 20.2% is a moderate concern.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '35.65%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '48.66%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '26.1% of enrollment' },
      { label: 'FRPM rate', value: '79.9% (2023-24)' },
      { label: 'Chronic absenteeism', value: '20.2% — elevated' },
    ],
  },
  prioritySummary: 'Santa Rosa Elementary is a 4,910-student K-8 district in Sonoma County. Math at 35.65% (below state average) and ELA at 48.66% (near state average) indicate targeted improvement opportunities. High ELL concentration (26.1%) makes EL-specific instructional materials the primary pitch angle. FRPM at 79.9% unlocks significant LCFF Supplemental & Concentration funding. Position around EL achievement and foundational literacy.',
  sources: [
    { sourceId: 'src-sre-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-sre-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: BURTON ELEMENTARY (dist-burton-001)
// ============================================================

INTELLIGENCE_MAP['dist-burton-001'] = {
  districtId: 'dist-burton-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Burton Elementary is a K-8 district in Tulare County serving 4,857 students. Math proficiency at 23.68% is well below state average and ELA at 31.28% is well below state average. The district serves 37.5% English Learners and 58.3% FRPM students. Chronic absenteeism at 24.4% is elevated. LCAP priorities center on English Learner achievement and foundational numeracy and literacy intervention.',
    keySignals: [
      { label: 'Math proficiency', value: '23.68% — well below state average' },
      { label: 'ELA proficiency', value: '31.28% — well below state average' },
      { label: 'ELL concentration', value: '37.5% (1,821 students)' },
      { label: 'FRPM rate', value: '58.3%' },
      { label: 'Chronic absenteeism', value: '24.4% — elevated' },
    ],
  },
  goals: [
    {
      goalId: 'burton-goal-1',
      goalNumber: 'Goal 1',
      title: 'English Learner Achievement and Academic Proficiency',
      description: 'Increase English Learner reclassification rates and academic proficiency in English Language Arts and mathematics through expanded designated and integrated ELD instruction, progress monitoring, and culturally responsive instructional strategies across grades K-8.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-burton-lcap',
      actions: [
        {
          actionId: 'burton-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'ELD Materials and Instructional Coaching',
          description: 'Adopt and implement designated ELD instructional materials for grades K-8 aligned with CA ELD Standards. Provide embedded coaching, collaborative planning, and instructional modeling to support consistent ELD implementation across content areas.',
          totalFunds: '$550,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-burton-lcap',
        },
        {
          actionId: 'burton-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Bilingual and Primary Language Literacy Resources',
          description: 'Expand primary language literacy materials and dual-language pathway resources for newcomer and early-intermediate English Learner students, supporting literacy transfer to English while maintaining primary language development.',
          totalFunds: '$350,000',
          fundingSource: 'Title III',
          status: 'in_progress' as const,
          sourceId: 'src-burton-lcap',
        },
        {
          actionId: 'burton-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-8.',
          totalFunds: '$280,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-burton-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 23.68% and ELA at 31.28%, Burton Elementary faces significant academic challenges across both subjects. English Learners comprise 37.5% of enrollment, driving overall proficiency rates. Chronic absenteeism at 24.4% is a moderate concern.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '23.68%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '31.28%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '37.5% of enrollment' },
      { label: 'FRPM rate', value: '58.3% (2023-24)' },
      { label: 'Chronic absenteeism', value: '24.4% — elevated' },
    ],
  },
  prioritySummary: 'Burton Elementary is a 4,857-student K-8 district in Tulare County. Math at 23.68% (well below state average) and ELA at 31.28% (well below state average) create dual-subject urgency. High ELL concentration (37.5%) makes EL-specific instructional materials the primary pitch angle. LCFF Base is the primary funding mechanism. Position around EL achievement and foundational literacy.',
  sources: [
    { sourceId: 'src-burton-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-burton-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: LAKESIDE UNION ELEMENTARY (dist-lake-001)
// ============================================================

INTELLIGENCE_MAP['dist-lake-001'] = {
  districtId: 'dist-lake-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Lakeside Union Elementary is a K-8 district in Kings County serving 4,844 students. Math proficiency at 27.86% is well below state average and ELA at 42.29% is below state average. The district serves 15.5% English Learners and 80.0% FRPM students. Chronic absenteeism at 10.1% is below state average. LCAP priorities center on foundational numeracy and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '27.86% — well below state average' },
      { label: 'ELA proficiency', value: '42.29% — below state average' },
      { label: 'ELL concentration', value: '15.5% (753 students)' },
      { label: 'FRPM rate', value: '80.0% — generates substantial Supplemental & Concentration funding' },
      { label: 'Chronic absenteeism', value: '10.1% — below state average' },
    ],
  },
  goals: [
    {
      goalId: 'lake-goal-1',
      goalNumber: 'Goal 1',
      title: 'Equitable Access to Quality Instruction',
      description: 'Ensure equitable access to high-quality, standards-aligned instruction for all students across grades K-8, with priority supports for socioeconomically disadvantaged students, English Learners, and students with disabilities.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-lake-lcap',
      actions: [
        {
          actionId: 'lake-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Instructional Quality and Equity Supports',
          description: 'Strengthen instructional quality across grades K-8 through standards-aligned materials adoption, embedded professional development, and targeted academic supports for unduplicated pupil groups.',
          totalFunds: '$550,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-lake-lcap',
        },
        {
          actionId: 'lake-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Mathematics Intervention and Diagnostic Assessment',
          description: 'Implement tiered mathematics intervention for students performing below grade level across grades K-8, using diagnostic assessment data to assign targeted supports and monitor progress.',
          totalFunds: '$350,000',
          fundingSource: 'Title I',
          status: 'in_progress' as const,
          sourceId: 'src-lake-lcap',
        },
        {
          actionId: 'lake-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-8.',
          totalFunds: '$280,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-lake-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 27.86% and ELA at 42.29%, Lakeside Union Elementary shows mixed performance across subjects. FRPM at 80.0% generates substantial Supplemental & Concentration funding eligibility. Chronic absenteeism at 10.1% is a district strength.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '27.86%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '42.29%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '15.5% of enrollment' },
      { label: 'FRPM rate', value: '80.0% (2023-24)' },
      { label: 'Chronic absenteeism', value: '10.1% — below state average' },
    ],
  },
  prioritySummary: 'Lakeside Union Elementary is a 4,844-student K-8 district in Kings County. Math at 27.86% (well below state average) and ELA at 42.29% (below state average) indicate targeted improvement opportunities. FRPM at 80.0% unlocks significant LCFF Supplemental & Concentration funding. Position around foundational numeracy and literacy intervention.',
  sources: [
    { sourceId: 'src-lake-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-lake-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: ORCUTT UNION ELEMENTARY (dist-orcutt-001)
// ============================================================

INTELLIGENCE_MAP['dist-orcutt-001'] = {
  districtId: 'dist-orcutt-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Orcutt Union Elementary is a K-8 district in Santa Barbara County serving 4,842 students. Math proficiency at 33.35% is below state average and ELA at 44.12% is below state average. The district serves 7.8% ELL (low) and 41.3% FRPM students.  LCAP priorities center on instructional quality and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '33.35% — below state average' },
      { label: 'ELA proficiency', value: '44.12% — below state average' },
      { label: 'ELL concentration', value: '7.8% (378 students)' },
      { label: 'FRPM rate', value: '41.3%' },
    ],
  },
  goals: [
    {
      goalId: 'orcutt-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Excellence and Continuous Improvement',
      description: 'Maintain and accelerate academic achievement across grades K-8 through rigorous standards-aligned instruction, data-driven intervention, and continuous improvement of instructional practice.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-orcutt-lcap',
      actions: [
        {
          actionId: 'orcutt-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Standards-Aligned Instructional Materials and Teacher Development',
          description: 'Adopt and implement standards-aligned instructional materials across grades K-8 with embedded professional development, coaching cycles, and formative assessment protocols to sustain growth trajectories.',
          totalFunds: '$550,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-orcutt-lcap',
        },
        {
          actionId: 'orcutt-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Professional Development and Instructional Coaching',
          description: 'Provide embedded professional development and instructional coaching to support implementation of standards-aligned materials, formative assessment practices, and differentiated instruction across grades K-8.',
          totalFunds: '$350,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-orcutt-lcap',
        },
        {
          actionId: 'orcutt-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-8.',
          totalFunds: '$280,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-orcutt-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 33.35% and ELA at 44.12%, Orcutt Union Elementary shows mixed performance across subjects.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '33.35%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '44.12%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'FRPM rate', value: '41.3% (2023-24)' },
    ],
  },
  prioritySummary: 'Orcutt Union Elementary is a 4,842-student K-8 district in Santa Barbara County. Math at 33.35% (below state average) and ELA at 44.12% (below state average) indicate targeted improvement opportunities. LCFF Base is the primary funding mechanism. Position around foundational numeracy and literacy intervention.',
  sources: [
    { sourceId: 'src-orcutt-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-orcutt-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: MOUNTAIN VIEW ELEMENTARY (dist-mtview-001)
// ============================================================

INTELLIGENCE_MAP['dist-mtview-001'] = {
  districtId: 'dist-mtview-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Mountain View Elementary is a K-8 district in Los Angeles County serving 4,764 students. Math proficiency at 38.51% is below state average and ELA at 46.82% is near state average. The district serves 10.8% English Learners and 48.2% FRPM students. Chronic absenteeism at 13.8% is below state average. LCAP priorities center on instructional quality and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '38.51% — below state average' },
      { label: 'ELA proficiency', value: '46.82% — near state average' },
      { label: 'ELL concentration', value: '10.8% (516 students)' },
      { label: 'FRPM rate', value: '48.2%' },
      { label: 'Chronic absenteeism', value: '13.8% — below state average' },
    ],
  },
  goals: [
    {
      goalId: 'mtview-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Excellence and Continuous Improvement',
      description: 'Maintain and accelerate academic achievement across grades K-8 through rigorous standards-aligned instruction, data-driven intervention, and continuous improvement of instructional practice.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-mtview-lcap',
      actions: [
        {
          actionId: 'mtview-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Standards-Aligned Instructional Materials and Teacher Development',
          description: 'Adopt and implement standards-aligned instructional materials across grades K-8 with embedded professional development, coaching cycles, and formative assessment protocols to sustain growth trajectories.',
          totalFunds: '$550,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-mtview-lcap',
        },
        {
          actionId: 'mtview-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Professional Development and Instructional Coaching',
          description: 'Provide embedded professional development and instructional coaching to support implementation of standards-aligned materials, formative assessment practices, and differentiated instruction across grades K-8.',
          totalFunds: '$350,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-mtview-lcap',
        },
        {
          actionId: 'mtview-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-8.',
          totalFunds: '$280,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-mtview-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 38.51% and ELA at 46.82%, Mountain View Elementary maintains moderate academic performance. Chronic absenteeism at 13.8% is a district strength.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '38.51%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '46.82%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '10.8% of enrollment' },
      { label: 'FRPM rate', value: '48.2% (2023-24)' },
      { label: 'Chronic absenteeism', value: '13.8% — below state average' },
    ],
  },
  prioritySummary: 'Mountain View Elementary is a 4,764-student K-8 district in Los Angeles County. Math at 38.51% (below state average) and ELA at 46.82% (near state average) indicate targeted improvement opportunities. LCFF Base is the primary funding mechanism. Position around instructional quality and standards alignment.',
  sources: [
    { sourceId: 'src-mtview-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-mtview-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: PLUMAS COUNTY OFFICE OF EDUCATION (dist-plumas-001)
// ============================================================

INTELLIGENCE_MAP['dist-plumas-001'] = {
  districtId: 'dist-plumas-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Plumas County Office of Education is a K-12 district in Plumas County serving 14,200 students. Math proficiency at 35.1% is below state average and ELA at 42.0% is below state average. The district serves 17.0% English Learners and 55.0% FRPM students. Chronic absenteeism at 19.5% is moderate. LCAP priorities center on instructional quality and academic acceleration.',
    keySignals: [
      { label: 'Math proficiency', value: '35.1% — below state average' },
      { label: 'ELA proficiency', value: '42.0% — below state average' },
      { label: 'ELL concentration', value: '17.0% (2,414 students)' },
      { label: 'FRPM rate', value: '55.0%' },
      { label: 'Chronic absenteeism', value: '19.5% — moderate' },
    ],
  },
  goals: [
    {
      goalId: 'plumas-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Excellence and Continuous Improvement',
      description: 'Maintain and accelerate academic achievement across grades K-12 through rigorous standards-aligned instruction, data-driven intervention, and continuous improvement of instructional practice.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-plumas-lcap',
      actions: [
        {
          actionId: 'plumas-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Standards-Aligned Instructional Materials and Teacher Development',
          description: 'Adopt and implement standards-aligned instructional materials across grades K-12 with embedded professional development, coaching cycles, and formative assessment protocols to sustain growth trajectories.',
          totalFunds: '$1,200,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-plumas-lcap',
        },
        {
          actionId: 'plumas-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Professional Development and Instructional Coaching',
          description: 'Provide embedded professional development and instructional coaching to support implementation of standards-aligned materials, formative assessment practices, and differentiated instruction across grades K-12.',
          totalFunds: '$720,000',
          fundingSource: 'Title II',
          status: 'in_progress' as const,
          sourceId: 'src-plumas-lcap',
        },
        {
          actionId: 'plumas-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-12.',
          totalFunds: '$520,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-plumas-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 35.1% and ELA at 42.0%, Plumas County Office of Education shows mixed performance across subjects. Chronic absenteeism at 19.5% is a moderate concern.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '35.1%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '42.0%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '17.0% of enrollment' },
      { label: 'FRPM rate', value: '55.0% (2023-24)' },
      { label: 'Chronic absenteeism', value: '19.5% — moderate' },
    ],
  },
  prioritySummary: 'Plumas County Office of Education is a 14,200-student K-12 district in Plumas County. Math at 35.1% (below state average) and ELA at 42.0% (below state average) indicate targeted improvement opportunities. LCFF Base is the primary funding mechanism. Position around instructional quality and standards alignment.',
  sources: [
    { sourceId: 'src-plumas-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-plumas-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};
// ============================================================
// TIER 3: CALEXICO UNIFIED (dist-cal-001)
// ============================================================

INTELLIGENCE_MAP['dist-cal-001'] = {
  districtId: 'dist-cal-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Calexico Unified is a high-need K-12 district in Imperial County with the most acute English Learner concentration in this dataset — 59.8% ELL on an enrollment of 8,146. Math proficiency at 17.23% and ELA at 27.57% rank among the lowest in California, and chronic absenteeism at 36.3% compounds instructional loss severely. Despite three years of modest academic improvement, no subject has crossed meaningful thresholds. The district\'s LCAP is anchored on English Learner achievement and reclassification, with LCFF Supplemental & Concentration and Title III as the primary funding vehicles. Any pitch must lead with EL-specific instructional materials and attendance/engagement supports.',
    keySignals: [
      { label: 'ELL concentration', value: '59.8% (4,874 students)', detail: 'Among the highest ELL rates in Imperial County — primary LCAP driver across all goals' },
      { label: 'Math proficiency', value: '17.23% — critically low, below state floor', detail: 'Up 2.62 pts over 3 years but still urgently below grade level across K-12' },
      { label: 'ELA proficiency', value: '27.57% — well below state average', detail: 'Slow recovery from 25.79% (2021-22); foundational literacy is a core need' },
      { label: 'Chronic absenteeism', value: '36.3% — critically high, compounds all academic gaps', detail: 'One-third of students chronically absent; intervention and re-engagement urgency is extreme' },
      { label: 'FRPM rate', value: '87.5% (7,127 students) — generates substantial Supplemental & Concentration funding' },
    ],
  },
  goals: [
    {
      goalId: 'cal-goal-1',
      goalNumber: 'Goal 1',
      title: 'English Learner Achievement and Reclassification',
      description: 'Increase English Learner reclassification rates and academic proficiency in English Language Arts and mathematics through expanded designated and integrated ELD instruction, primary language support, and structured progress monitoring across grades K-12.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-cal-lcap',
      actions: [
        {
          actionId: 'cal-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Designated ELD Materials Adoption and Teacher Coaching',
          description: 'Adopt designated ELD instructional materials for grades K-12 aligned with California ELD Standards. Provide embedded teacher coaching, collaborative planning time, and instructional modeling to support consistent implementation of ELD instruction across all content areas.',
          totalFunds: '$2,200,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-cal-lcap',
        },
        {
          actionId: 'cal-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Bilingual and Primary Language Literacy Resources (Spanish)',
          description: 'Expand Spanish-language foundational literacy materials and dual-language pathway resources for newcomer and early-intermediate English Learner students in grades K-5, supporting literacy transfer to English while maintaining primary language development.',
          totalFunds: '$980,000',
          fundingSource: 'Title III',
          status: 'in_progress' as const,
          sourceId: 'src-cal-lcap',
        },
        {
          actionId: 'cal-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'EL Reclassification Progress Monitoring System',
          description: 'Implement a district-wide structured reclassification tracking and early intervention system, with diagnostic checkpoints, teacher consultation protocols, and family outreach to accelerate reclassification rates for long-term English Learners in grades 3-8.',
          totalFunds: '$550,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-cal-lcap',
        },
      ],
    },
    {
      goalId: 'cal-goal-2',
      goalNumber: 'Goal 2',
      title: 'Academic Achievement in Mathematics',
      description: 'Increase the percentage of students meeting or exceeding grade-level mathematics standards across grades K-12, with targeted intervention for students performing significantly below grade level and embedded EL supports integrated throughout mathematics instruction.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-cal-lcap',
      actions: [
        {
          actionId: 'cal-act-2-1',
          actionNumber: 'Action 2.1',
          title: 'K-12 Mathematics Intervention and Foundational Numeracy',
          description: 'Deploy targeted mathematics intervention for students in grades K-12 performing below grade level using diagnostic assessment data to assign tiered instructional supports. Emphasize foundational numeracy skills in primary grades and algebraic reasoning in secondary.',
          totalFunds: '$1,600,000',
          fundingSource: 'Title I',
          status: 'in_progress' as const,
          sourceId: 'src-cal-lcap',
        },
        {
          actionId: 'cal-act-2-2',
          actionNumber: 'Action 2.2',
          title: 'Mathematics Instructional Coaching with EL Integration',
          description: 'Assign mathematics instructional coaches to support implementation fidelity of grade-level math materials with embedded ELD strategies for English Learner students across K-12. Focus on mathematical language development and access strategies for emerging bilinguals.',
          totalFunds: '$720,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-cal-lcap',
        },
      ],
    },
    {
      goalId: 'cal-goal-3',
      goalNumber: 'Goal 3',
      title: 'Student Engagement and Attendance',
      description: 'Reduce chronic absenteeism from 36.3% toward state and district targets through multi-tiered attendance intervention, school climate improvement, and coordinated family engagement strategies across all K-12 schools.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-cal-lcap',
      actions: [
        {
          actionId: 'cal-act-3-1',
          actionNumber: 'Action 3.1',
          title: 'Attendance Intervention Teams and Family Outreach',
          description: 'Establish dedicated attendance intervention teams at each school site to provide direct student and family outreach, wraparound support referrals, and re-engagement planning for students with chronic absenteeism patterns.',
          totalFunds: '$1,100,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-cal-lcap',
        },
        {
          actionId: 'cal-act-3-2',
          actionNumber: 'Action 3.2',
          title: 'School Climate and Student Connection Programming',
          description: 'Implement school climate improvement programming including restorative practices, positive behavioral supports, and extracurricular engagement pathways to strengthen student sense of belonging and reduce barriers to attendance.',
          totalFunds: '$480,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-cal-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'Calexico Unified\'s academic profile reflects the compounding burden of extreme ELL concentration (59.8%), near-universal economic disadvantage (87.5% FRPM), and chronically high absenteeism (36.3%). Math at 17.23% and ELA at 27.57% show modest three-year improvement (+2.62 and +1.78 pts respectively), but remain among the lowest in California. The math-ELA gap (10 points) signals that foundational literacy — while urgent — is slightly less acute than numeracy. With one-third of students chronically absent, instructional time loss is a structural barrier that any intervention strategy must account for.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '17.23%', detail: 'Up from 14.61% (2021-22) — slow but consistent growth; still critically low' },
      { label: 'ELA proficiency (2023-24)', value: '27.57%', detail: 'Up from 25.79% (2021-22); consistent upward trend but well below state targets' },
      { label: 'Chronic absenteeism', value: '36.3% — one-third of students missing 10%+ of school days', detail: 'Severely compounds all instructional investment; attendance must be addressed alongside academics' },
      { label: 'FRPM rate', value: '87.5% — near-universal economic disadvantage' },
      { label: 'ELL share', value: '59.8% — majority English Learner enrollment; drives all academic outcome patterns' },
    ],
  },
  prioritySummary: 'Calexico Unified is a high-urgency K-12 district where every sales conversation must lead with English Learner instructional materials and foundational literacy/numeracy supports. At 59.8% ELL and 87.5% FRPM, the district has strong LCFF Supplemental & Concentration and Title III funding access — but purchasing decisions are tightly constrained by budget scrutiny and evidence requirements for high-ELL contexts. Chronic absenteeism at 36.3% is the district\'s most visible crisis and should anchor attendance/engagement product conversations. Math at 17.23% and ELA at 27.57% are both critically low; any curriculum or intervention pitch should emphasize EL-integrated instruction, Spanish primary language supports, and diagnostic assessment capabilities. Do not lead with college readiness or enrichment framing.',
  sources: [
    { sourceId: 'src-cal-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-cal-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: NOVATO UNIFIED (dist-nov-001)
// ============================================================

INTELLIGENCE_MAP['dist-nov-001'] = {
  districtId: 'dist-nov-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Novato Unified is a mid-size K-12 district in Marin County occupying an unusual profile: relatively strong academic performance (ELA 53.52%, math 40.82%) yet with a two-year ELA decline (−1.84 pts from 2021-22) and math that barely cleared 40% in 2023-24 — the first time in three years. With low ELL (17.3%) and moderate FRPM (35.0%), the district does not face a high-need urgency story. Instead, the strategic framing is sustaining academic excellence while closing persistent gaps for its economically disadvantaged subgroup. LCFF Base is the primary funding lever; the district is a candidate for quality-and-alignment conversations rather than crisis intervention pitches.',
    keySignals: [
      { label: 'ELA proficiency', value: '53.52% — strong but declining', detail: 'Down from 55.36% (2021-22); 2-year slide signals instructional coherence question' },
      { label: 'Math proficiency', value: '40.82% — above state average', detail: 'Roughly flat 3-year trend (38.90% → 40.83% → 40.82%); barely holding above 40%' },
      { label: 'FRPM rate', value: '35.0% — moderate; limited Supplemental & Concentration access' },
      { label: 'ELL share', value: '17.3% — below 25% threshold; EL supports are supplemental, not primary' },
      { label: 'Chronic absenteeism', value: '11.3% — healthy; not a barrier to instruction' },
    ],
  },
  goals: [
    {
      goalId: 'nov-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Excellence for All Students',
      description: 'Reverse declining ELA proficiency and sustain mathematics achievement above the 40% threshold across grades K-12, with focused instructional investment in curriculum alignment, professional development, and evidence-based teaching practices for all student populations.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-nov-lcap',
      actions: [
        {
          actionId: 'nov-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'ELA Instructional Materials Review and Coherence Initiative',
          description: 'Conduct a structured review of K-12 ELA instructional materials to identify alignment gaps contributing to two-year proficiency decline. Evaluate whether current programs provide adequate support for academic literacy development in secondary grades and foundational phonics in primary grades.',
          totalFunds: '$920,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-nov-lcap',
        },
        {
          actionId: 'nov-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Mathematics Instructional Coaching and Sustainability',
          description: 'Deploy instructional coaching to support consistent implementation of grade-level mathematics materials across K-12. Focus on maintaining above-40% math proficiency through instructional coherence, teacher collaboration, and formative assessment integration.',
          totalFunds: '$740,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-nov-lcap',
        },
        {
          actionId: 'nov-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Targeted Intervention for Economically Disadvantaged Students',
          description: 'Provide targeted academic intervention and enrichment for socioeconomically disadvantaged students to close outcome gaps relative to district overall performance. Include tutoring, extended learning time, and access to college preparatory coursework in secondary.',
          totalFunds: '$650,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-nov-lcap',
        },
      ],
    },
    {
      goalId: 'nov-goal-2',
      goalNumber: 'Goal 2',
      title: 'Literacy and Language Arts Achievement',
      description: 'Halt and reverse the two-year decline in ELA proficiency by strengthening foundational literacy instruction in primary grades and academic reading and writing skills in secondary, with evidence-based materials and professional learning aligned to science of reading principles.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-nov-lcap',
      actions: [
        {
          actionId: 'nov-act-2-1',
          actionNumber: 'Action 2.1',
          title: 'Science of Reading Professional Development — K-5',
          description: 'Provide structured professional development for K-5 teachers on science of reading principles including systematic phonics, phonemic awareness, and fluency. Evaluate current materials for alignment with explicit, systematic literacy instruction frameworks.',
          totalFunds: '$580,000',
          fundingSource: 'LCFF Base',
          status: 'in_progress' as const,
          sourceId: 'src-nov-lcap',
        },
        {
          actionId: 'nov-act-2-2',
          actionNumber: 'Action 2.2',
          title: 'Secondary Academic Literacy and Writing Instruction',
          description: 'Strengthen secondary ELA outcomes through disciplinary literacy coaching, writing workshop implementation, and alignment of 6-12 text complexity expectations to college and career readiness standards.',
          totalFunds: '$420,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-nov-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'Novato Unified\'s academic profile is one of relative strength with a worrying trend line. ELA at 53.52% and math at 40.82% place the district well above peer districts in Marin County by need, but both subjects are effectively flat or declining over three years. The ELA decline (−1.84 pts since 2021-22) is the more actionable signal — it suggests a curriculum or instructional coherence issue that has not been addressed despite the district\'s relatively advantaged position. Low chronic absenteeism (11.3%) confirms that student attendance is not the driver; the question is instructional quality and materials alignment.',
    keySignals: [
      { label: 'ELA proficiency (2023-24)', value: '53.52%', detail: 'Down from 55.36% (2021-22) — 2-year decline of −1.84 pts; approaching 50% floor' },
      { label: 'Math proficiency (2023-24)', value: '40.82%', detail: 'Essentially flat 3-year trend; barely above the 40% threshold' },
      { label: 'Chronic absenteeism', value: '11.3% — healthy; not a structural barrier' },
      { label: 'FRPM rate', value: '35.0% — moderate; modest Supplemental & Concentration access' },
      { label: 'ELL share', value: '17.3% — below primary EL intervention threshold' },
    ],
  },
  prioritySummary: 'Novato Unified is a K-12 district where the pitch is about protecting and improving strong performance — not crisis intervention. The ELA decline story is the primary hook: a district with real strengths is losing ground, which creates urgency for curriculum review and instructional alignment without the crisis framing of high-need districts. Lead with science of reading alignment for K-5 and academic literacy for secondary. Math is above 40% but showing no growth — a sustainability and coherence conversation, not a recovery one. Low FRPM limits Supplemental & Concentration access; budget conversations should focus on LCFF Base efficiency and multi-year value. Do not lead with EL-specific products at 17.3% ELL.',
  sources: [
    { sourceId: 'src-nov-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-nov-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: UKIAH UNIFIED (dist-ukiah-001)
// ============================================================

INTELLIGENCE_MAP['dist-ukiah-001'] = {
  districtId: 'dist-ukiah-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Ukiah Unified is a mid-size K-Adult district in Mendocino County facing multiple converging pressures: math proficiency at 21.67% (critically below 35% threshold), ELA at 32.20% (below 40%), FRPM at 77.7% (above 70% equity threshold), and chronic absenteeism at 23.5% (above 20%). All four secondary flags trigger simultaneously. The district\'s LCAP is oriented around mathematics recovery, foundational literacy, and equitable access for its high-poverty student body. LCFF Supplemental & Concentration funding is the primary lever given 77.7% FRPM. ELL at 22.6% is just below the 25% primary trigger but should be factored into materials decisions.',
    keySignals: [
      { label: 'Math proficiency', value: '21.67% — critically low, below 35% threshold', detail: 'Up 2.70 pts over 3 years but still in bottom quartile statewide' },
      { label: 'ELA proficiency', value: '32.20% — below 40% floor', detail: 'Slight dip from 32.55% (2022-23); effectively flat after recovery from 2021-22 low' },
      { label: 'FRPM rate', value: '77.7% (5,084 students) — above 70% equity threshold; strong Supplemental & Concentration access' },
      { label: 'Chronic absenteeism', value: '23.5% — above 20% high-concern threshold', detail: 'Compounds instructional loss across all subjects; engagement strategy is a co-priority' },
      { label: 'ELL share', value: '22.6% — near but below 25% primary threshold; EL supports still relevant' },
    ],
  },
  goals: [
    {
      goalId: 'ukiah-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Achievement in Mathematics',
      description: 'Increase the percentage of students meeting or exceeding grade-level mathematics standards in grades K-12 through targeted intervention, instructional materials alignment, and embedded supports for English Learners and socioeconomically disadvantaged students.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-ukiah-lcap',
      actions: [
        {
          actionId: 'ukiah-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'K-12 Mathematics Intervention and Diagnostic Assessment',
          description: 'Implement tiered mathematics intervention for students in grades K-12 performing below grade level, anchored by diagnostic assessment data to assign targeted instructional supports. Prioritize foundational numeracy in primary grades and algebraic reasoning in middle school.',
          totalFunds: '$1,400,000',
          fundingSource: 'Title I',
          status: 'in_progress' as const,
          sourceId: 'src-ukiah-lcap',
        },
        {
          actionId: 'ukiah-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Mathematics Instructional Materials Review and Alignment',
          description: 'Conduct a structured review of current K-12 math instructional materials for alignment with the 2023 California Mathematics Framework. Evaluate whether supplemental or replacement materials are needed to support the recovery trajectory and address persistent below-grade outcomes.',
          totalFunds: '$380,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-ukiah-lcap',
        },
        {
          actionId: 'ukiah-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Math Coaching with Equity and EL Integration',
          description: 'Deploy instructional coaches to support consistent math implementation with embedded ELD strategies for English Learner students and culturally responsive practices for socioeconomically disadvantaged populations. Focus on access to grade-level math content for all students.',
          totalFunds: '$650,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-ukiah-lcap',
        },
      ],
    },
    {
      goalId: 'ukiah-goal-2',
      goalNumber: 'Goal 2',
      title: 'Literacy and Language Arts Achievement',
      description: 'Improve ELA proficiency across grades K-Adult from 32.20% toward state benchmarks through strengthened foundational literacy instruction in primary grades, academic literacy in secondary, and integrated ELD supports for English Learner students.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-ukiah-lcap',
      actions: [
        {
          actionId: 'ukiah-act-2-1',
          actionNumber: 'Action 2.1',
          title: 'Foundational Literacy and Science of Reading — K-5',
          description: 'Strengthen K-5 ELA instruction through professional development on science of reading principles, materials review for phonics and phonemic awareness alignment, and structured coaching for consistent foundational literacy implementation.',
          totalFunds: '$860,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-ukiah-lcap',
        },
        {
          actionId: 'ukiah-act-2-2',
          actionNumber: 'Action 2.2',
          title: 'Secondary Academic Literacy and Writing Intervention',
          description: 'Provide targeted academic literacy and writing intervention for students in grades 6-12 performing below grade level in ELA. Include disciplinary literacy coaching and text complexity scaffolding aligned to college and career readiness standards.',
          totalFunds: '$540,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-ukiah-lcap',
        },
      ],
    },
    {
      goalId: 'ukiah-goal-3',
      goalNumber: 'Goal 3',
      title: 'Equitable Access to Quality Instruction',
      description: 'Ensure socioeconomically disadvantaged students, English Learners, and students with disabilities have equitable access to high-quality, grade-level instruction and the targeted supports needed to close persistent outcome gaps across all subjects and grade levels.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-ukiah-lcap',
      actions: [
        {
          actionId: 'ukiah-act-3-1',
          actionNumber: 'Action 3.1',
          title: 'High-Poverty Student Academic Support and Extended Learning',
          description: 'Provide expanded tutoring, extended learning time, and supplemental academic supports for socioeconomically disadvantaged students across K-12. Prioritize students in the lowest performance quartiles in both mathematics and ELA.',
          totalFunds: '$920,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-ukiah-lcap',
        },
        {
          actionId: 'ukiah-act-3-2',
          actionNumber: 'Action 3.2',
          title: 'Attendance Intervention and Student Re-Engagement',
          description: 'Address chronic absenteeism at 23.5% through school-level attendance intervention teams, family outreach and engagement programs, and positive school climate initiatives to strengthen student connection and reduce barriers to consistent attendance.',
          totalFunds: '$460,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-ukiah-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'Ukiah Unified\'s academic profile is defined by multi-subject underperformance compounded by high poverty and chronic absenteeism. Math at 21.67% and ELA at 32.20% place the district well below state averages in both subjects. Math shows a positive three-year trajectory (+2.70 pts) while ELA is essentially flat after a minor recovery. At 77.7% FRPM, economic disadvantage is the structural driver of academic outcomes, and at 23.5% chronic absenteeism, instructional time loss is a persistent multiplier. ELL at 22.6% adds a language access dimension that should inform materials selection even at sub-25% concentration.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '21.67%', detail: 'Up from 18.97% (2021-22); consistent growth but still critically below 35% threshold' },
      { label: 'ELA proficiency (2023-24)', value: '32.20%', detail: 'Slight decline from 32.55% (2022-23); effectively flat after 2021-22 low of 29.71%' },
      { label: 'FRPM rate', value: '77.7% — above 70% threshold; poverty is the primary structural driver' },
      { label: 'Chronic absenteeism', value: '23.5% — above 20% high-concern threshold; compounding academic gaps' },
      { label: 'ELL share', value: '22.6% — near threshold; EL instructional needs are a secondary priority' },
    ],
  },
  prioritySummary: 'Ukiah Unified is a multi-need K-Adult district where math is the most acute academic priority and equity is the strategic frame. At 21.67% math and 32.20% ELA, both subjects require urgent intervention investment. The 77.7% FRPM rate generates strong LCFF Supplemental & Concentration funding access — making this a viable target for mid-size curriculum and intervention investments. Lead with math intervention and foundational literacy materials that embed EL supports and culturally responsive approaches for high-poverty contexts. Chronic absenteeism at 23.5% creates a secondary conversation around attendance and engagement tools. Do not lead with enrichment or advanced coursework framing; every pitch must start from equity and access.',
  sources: [
    { sourceId: 'src-ukiah-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-ukiah-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: HOLLISTER SCHOOL DISTRICT (dist-holl-001)
// ============================================================

INTELLIGENCE_MAP['dist-holl-001'] = {
  districtId: 'dist-holl-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Hollister School District is a K-8 elementary district in San Benito County where English Learner concentration (28.3%) is the primary strategic driver — crossing the 25% EL threshold that anchors LCAP planning. Math proficiency at 23.76% and ELA at 33.70% are both critically below grade-level standards, with ELA showing a three-year decline (−1.56 pts from 2021-22). Chronic absenteeism at 20.6% sits at the high-concern threshold. At 57.1% FRPM, substantial LCFF Supplemental & Concentration funding is available. As a K-8 district, all instructional framing should be foundational: phonics, early numeracy, ELD — not secondary or college readiness content.',
    keySignals: [
      { label: 'ELL concentration', value: '28.3% (1,784 students) — primary LCAP driver above 25% threshold', detail: 'EL achievement and reclassification is the organizing goal across all content areas' },
      { label: 'Math proficiency', value: '23.76% — critically low, below 35% threshold', detail: 'Slight dip from 23.93% (2022-23); three-year range 21.99%–23.93%' },
      { label: 'ELA proficiency', value: '33.70% — below 40%, declining trend', detail: 'Down from 35.26% (2021-22) — 3-year decline of −1.56 pts; foundational literacy is urgent' },
      { label: 'Chronic absenteeism', value: '20.6% — at the high-concern threshold', detail: 'Compounds instructional access for EL and high-poverty populations' },
      { label: 'FRPM rate', value: '57.1% (3,598 students) — meaningful Supplemental & Concentration access' },
    ],
  },
  goals: [
    {
      goalId: 'holl-goal-1',
      goalNumber: 'Goal 1',
      title: 'English Learner Achievement and Reclassification',
      description: 'Increase English Learner reclassification rates and academic proficiency in English Language Arts and mathematics through expanded designated and integrated ELD instruction, primary language literacy supports, and structured progress monitoring in grades K-8.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-holl-lcap',
      actions: [
        {
          actionId: 'holl-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Designated ELD Materials and Teacher Coaching — K-8',
          description: 'Adopt and implement designated ELD instructional materials for grades K-8 aligned with California ELD Standards. Provide embedded coaching and collaborative planning time for consistent ELD lesson delivery integrated with foundational literacy and mathematics instruction.',
          totalFunds: '$1,600,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-holl-lcap',
        },
        {
          actionId: 'holl-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Spanish Primary Language Literacy Bridges — K-3',
          description: 'Expand Spanish-language foundational literacy materials and dual-language pathway resources for newcomer and early-intermediate English Learner students in grades K-3, supporting literacy transfer to English while preserving primary language development.',
          totalFunds: '$720,000',
          fundingSource: 'Title III',
          status: 'in_progress' as const,
          sourceId: 'src-holl-lcap',
        },
        {
          actionId: 'holl-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'EL Reclassification Tracking and Acceleration Protocols',
          description: 'Implement a structured reclassification tracking system with diagnostic checkpoints, teacher consultation protocols, and family communication systems to accelerate reclassification timelines for long-term English Learners in grades 4-8.',
          totalFunds: '$380,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-holl-lcap',
        },
      ],
    },
    {
      goalId: 'holl-goal-2',
      goalNumber: 'Goal 2',
      title: 'Academic Achievement in Mathematics',
      description: 'Increase the percentage of K-8 students meeting or exceeding grade-level mathematics standards, with targeted intervention for students performing significantly below grade level and embedded EL supports integrated throughout foundational and grade-level math instruction.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-holl-lcap',
      actions: [
        {
          actionId: 'holl-act-2-1',
          actionNumber: 'Action 2.1',
          title: 'K-8 Math Intervention and Foundational Numeracy Supports',
          description: 'Deploy targeted mathematics intervention for K-8 students performing below grade level using diagnostic assessment data to assign tiered instructional supports. Emphasize foundational numeracy skills in primary grades and proportional reasoning and pre-algebra in grades 6-8.',
          totalFunds: '$980,000',
          fundingSource: 'Title I',
          status: 'in_progress' as const,
          sourceId: 'src-holl-lcap',
        },
        {
          actionId: 'holl-act-2-2',
          actionNumber: 'Action 2.2',
          title: 'Math Instructional Materials Alignment Review',
          description: 'Conduct a structured review of K-8 math instructional materials for alignment with the 2023 California Mathematics Framework and embedded ELD support features for English Learner students. Evaluate supplemental resource needs at the primary grade band.',
          totalFunds: '$280,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-holl-lcap',
        },
      ],
    },
    {
      goalId: 'holl-goal-3',
      goalNumber: 'Goal 3',
      title: 'Literacy and Language Arts Achievement',
      description: 'Reverse the three-year ELA proficiency decline and improve foundational literacy outcomes across grades K-8, with structured literacy instruction in primary grades, academic reading and writing development in intermediate and middle grades, and integrated ELD supports throughout.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-holl-lcap',
      actions: [
        {
          actionId: 'holl-act-3-1',
          actionNumber: 'Action 3.1',
          title: 'Foundational Literacy and Phonics Alignment — K-3',
          description: 'Strengthen K-3 literacy instruction through science of reading professional development, phonics and phonemic awareness materials review, and structured coaching for consistent foundational literacy implementation with EL-integrated supports.',
          totalFunds: '$720,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-holl-lcap',
        },
        {
          actionId: 'holl-act-3-2',
          actionNumber: 'Action 3.2',
          title: 'Intermediate and Middle Grade Academic Literacy — 4-8',
          description: 'Provide targeted academic reading comprehension and writing instruction for students in grades 4-8 performing below grade level in ELA, with emphasis on text-based writing, academic vocabulary, and disciplinary literacy aligned to ELA standards.',
          totalFunds: '$480,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-holl-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'Hollister School District\'s K-8 academic profile shows persistent below-grade performance in both subjects, with ELA on a concerning three-year downward trend. Math at 23.76% has been essentially flat (21.99%–23.93%) since 2021-22 despite modest investment. ELA at 33.70% is declining from a 2021-22 baseline of 35.26% — a reversal that in a K-8 context points to foundational literacy alignment gaps in primary grades. ELL at 28.3% and FRPM at 57.1% define the student population; any academic story must contextualize outcomes through these lenses.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '23.76%', detail: '3-year range: 21.99%–23.93% — flat, no meaningful growth across K-8' },
      { label: 'ELA proficiency (2023-24)', value: '33.70%', detail: 'Down from 35.26% (2021-22) — 3-year decline of −1.56 pts; foundational literacy concern' },
      { label: 'ELL share', value: '28.3% — primary driver; EL outcomes shape all district performance metrics' },
      { label: 'Chronic absenteeism', value: '20.6% — at high-concern threshold; compounds instructional access' },
      { label: 'FRPM rate', value: '57.1% — substantial economic disadvantage across student body' },
    ],
  },
  prioritySummary: 'Hollister School District is a K-8 district where the sales conversation must be grounded in EL-specific, foundational-grade instructional materials. At 28.3% ELL (above the 25% primary trigger), the district\'s LCAP is organized around English Learner achievement — making designated ELD materials, bilingual literacy resources, and EL-integrated math the primary pitch. Math at 23.76% and ELA at 33.70% (declining) create dual-subject urgency. FRPM at 57.1% means LCFF Supplemental & Concentration is a viable funding lever alongside Title I and Title III. Chronic absenteeism at 20.6% opens a secondary conversation around engagement and attendance tools. As a K-8 district, all product framing must be foundational — phonics, early numeracy, ELD instruction, K-8 intervention — not secondary or college-readiness oriented.',
  sources: [
    { sourceId: 'src-holl-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-holl-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};

// ============================================================
// TIER 3: HANFORD ELEMENTARY SCHOOL DISTRICT (dist-hanf-001)
// ============================================================

INTELLIGENCE_MAP['dist-hanf-001'] = {
  districtId: 'dist-hanf-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Hanford Elementary is a K-8 district in Kings County with an unusually positive math momentum story: math proficiency has climbed 7.70 points over three years (29.98% → 33.66% → 37.68%), the strongest growth trajectory in this batch. Despite this, math remains below the 40% target and ELA at 45.09% is declining slightly. The primary strategic flag is FRPM at 80.2% — above the 70% equity threshold — which generates strong LCFF Supplemental & Concentration access and anchors LCAP goals around equitable access and high-quality instruction for economically disadvantaged students. ELL at 18.9% is below the 25% primary trigger but adds a language access dimension to materials decisions.',
    keySignals: [
      { label: 'Math momentum', value: '+7.70 pts over 3 years (29.98% → 37.68%)', detail: 'Strongest math growth trajectory in this batch — signals effective intervention; approaching 40% threshold' },
      { label: 'Math proficiency', value: '37.68% — below 40% but closing fast', detail: 'Likely to cross 40% in 2024-25 if trajectory holds; instructional investment is working' },
      { label: 'ELA proficiency', value: '45.09% — above state average but slight decline', detail: 'Down from 45.51% (2021-22); relatively flat but at risk of sliding further' },
      { label: 'FRPM rate', value: '80.2% (4,463 students) — above 70% equity threshold; primary LCAP driver', detail: 'Strong Supplemental & Concentration funding access; equitable access is the organizing priority' },
      { label: 'ELL share', value: '18.9% — below 25% primary trigger but relevant for materials selection' },
    ],
  },
  goals: [
    {
      goalId: 'hanf-goal-1',
      goalNumber: 'Goal 1',
      title: 'Equitable Access to Quality Instruction',
      description: 'Ensure socioeconomically disadvantaged students and other underserved populations across grades K-8 have equitable access to high-quality, grade-level instruction in mathematics and English Language Arts, with targeted supports to close persistent outcome gaps relative to state benchmarks.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-hanf-lcap',
      actions: [
        {
          actionId: 'hanf-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'High-Poverty Student Academic Intervention and Enrichment — K-8',
          description: 'Provide targeted academic intervention and enrichment programming for socioeconomically disadvantaged students across grades K-8, including expanded tutoring, extended learning time, and access to grade-level and advanced instructional content to close gaps relative to state benchmarks.',
          totalFunds: '$1,800,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-hanf-lcap',
        },
        {
          actionId: 'hanf-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Instructional Coaching for Equity and Implementation Fidelity',
          description: 'Deploy instructional coaches across K-8 to support consistent, high-quality implementation of grade-level mathematics and ELA materials. Emphasize equitable access strategies for economically disadvantaged and English Learner students, including culturally responsive practices and language scaffolding.',
          totalFunds: '$940,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-hanf-lcap',
        },
        {
          actionId: 'hanf-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Family Engagement and Community Partnership for Academic Support',
          description: 'Strengthen family engagement in student academic progress through translated communications, parent education workshops on grade-level expectations, and community partnership programs that extend learning beyond the school day for high-need students.',
          totalFunds: '$420,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-hanf-lcap',
        },
      ],
    },
    {
      goalId: 'hanf-goal-2',
      goalNumber: 'Goal 2',
      title: 'Mathematics Recovery and Acceleration',
      description: 'Sustain and accelerate the strong three-year mathematics growth trajectory to carry K-8 proficiency above the 40% threshold and establish long-term instructional practices that embed math momentum into district culture and daily instruction.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-hanf-lcap',
      actions: [
        {
          actionId: 'hanf-act-2-1',
          actionNumber: 'Action 2.1',
          title: 'K-8 Math Acceleration: Sustaining the Growth Trajectory',
          description: 'Invest in sustaining and extending the three-year math growth trajectory through instructional materials alignment, diagnostic assessment integration, and teacher professional development. Target crossing the 40% proficiency threshold in 2024-25 and maintaining above-average growth through 2025-26.',
          totalFunds: '$1,200,000',
          fundingSource: 'Title I',
          status: 'in_progress' as const,
          sourceId: 'src-hanf-lcap',
        },
        {
          actionId: 'hanf-act-2-2',
          actionNumber: 'Action 2.2',
          title: 'Math Diagnostic Assessment and Formative Feedback Systems',
          description: 'Expand use of diagnostic and formative assessment tools in mathematics to track individual student progress, identify emerging gaps early, and support responsive instruction. Align data review cycles to inform instructional adjustments at the classroom and school levels.',
          totalFunds: '$360,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-hanf-lcap',
        },
      ],
    },
    {
      goalId: 'hanf-goal-3',
      goalNumber: 'Goal 3',
      title: 'Literacy and Language Arts Achievement',
      description: 'Halt the slight ELA proficiency decline and protect Hanford Elementary\'s above-state-average ELA performance through continued investment in foundational literacy instruction, science of reading alignment, and academic reading and writing development across grades K-8.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-hanf-lcap',
      actions: [
        {
          actionId: 'hanf-act-3-1',
          actionNumber: 'Action 3.1',
          title: 'Foundational Literacy Protection and Science of Reading Alignment — K-3',
          description: 'Protect K-3 ELA performance through science of reading professional development, phonics scope and sequence review, and coaching support for foundational literacy implementation. Ensure primary grade ELA does not slip from current above-average baseline.',
          totalFunds: '$640,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-hanf-lcap',
        },
        {
          actionId: 'hanf-act-3-2',
          actionNumber: 'Action 3.2',
          title: 'Intermediate and Middle Grade Academic Literacy — 4-8',
          description: 'Strengthen 4-8 academic reading comprehension, writing, and vocabulary instruction to sustain ELA performance in intermediate and middle grades. Evaluate current materials for text complexity alignment and writing instruction coherence.',
          totalFunds: '$380,000',
          fundingSource: 'LCFF Base',
          status: 'planned' as const,
          sourceId: 'src-hanf-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'Hanford Elementary stands out in this batch for a compelling math growth narrative: +7.70 points over three years is among the strongest K-8 math trajectories in the Kings County region. At 37.68%, math is approaching the 40% threshold and is likely to cross it in 2024-25 if the current trajectory holds. ELA at 45.09% is above state average but showing slight erosion (−0.42 pts since 2021-22) — a protection story rather than a recovery one. The 80.2% FRPM rate means economic disadvantage shapes all academic outcomes, and any intervention must be framed through an equity and access lens.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '37.68%', detail: '+7.70 pts over 3 years (29.98% → 37.68%) — near 40% threshold; strongest growth in batch' },
      { label: 'ELA proficiency (2023-24)', value: '45.09%', detail: 'Slight decline from 45.51% (2021-22); above state average but at risk of continuing slide' },
      { label: 'FRPM rate', value: '80.2% — above 70% equity threshold; primary LCAP strategic driver' },
      { label: 'Chronic absenteeism', value: '13.2% — healthy; not a structural barrier to instruction' },
      { label: 'ELL share', value: '18.9% — below 25% primary trigger; EL considerations are secondary' },
    ],
  },
  prioritySummary: 'Hanford Elementary is a K-8 district with an unusually strong math momentum story that creates a distinct sales angle: lead with sustaining and extending a successful trajectory, not crisis recovery. At +7.70 pts over three years, math is approaching 40% proficiency — position products as the vehicle for crossing that threshold and building long-term instructional strength. ELA at 45.09% is above average but declining slightly; frame ELA as protection of a strength, not urgent remediation. The 80.2% FRPM rate anchors the equity conversation and provides strong LCFF Supplemental & Concentration access. As a K-8 district, all product framing must be foundational: early numeracy, phonics-aligned literacy, K-8 intervention, diagnostic assessment. Do not lead with secondary or college-readiness content. Low chronic absenteeism (13.2%) is a genuine positive: students are present and ready for effective instruction.',
  sources: [
    { sourceId: 'src-hanf-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-hanf-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};
// ============================================================
// TIER 3: NATOMAS UNIFIED (dist-nat-001)
// ============================================================

INTELLIGENCE_MAP['dist-nat-001'] = {
  districtId: 'dist-nat-001',
  lastUpdated: '2025-11-15T00:00:00Z',
  goalsBrief: {
    leadInsight: 'Natomas Unified is a K-12 district in Sacramento County serving 42,500 students. Math proficiency at 29.8% is below state average and ELA at 34.0% is below state average. The district serves 20.0% English Learners and 71.0% FRPM students. Chronic absenteeism at 27.3% is high. LCAP priorities center on foundational numeracy and literacy intervention, with significant LCFF Supplemental & Concentration funding available.',
    keySignals: [
      { label: 'Math proficiency', value: '29.8% — below state average' },
      { label: 'ELA proficiency', value: '34.0% — below state average' },
      { label: 'ELL concentration', value: '20.0% (8,500 students)' },
      { label: 'FRPM rate', value: '71.0% — generates substantial Supplemental & Concentration funding' },
      { label: 'Chronic absenteeism', value: '27.3% — high' },
    ],
  },
  goals: [
    {
      goalId: 'nat-goal-1',
      goalNumber: 'Goal 1',
      title: 'Academic Achievement in Mathematics',
      description: 'Increase the percentage of students meeting or exceeding grade-level standards in mathematics across grades K-12 through adoption of standards-aligned instructional materials, targeted intervention, and teacher professional development.',
      goalType: 'Broad' as const,
      academicYear: '2024-25',
      sourceId: 'src-nat-lcap',
      actions: [
        {
          actionId: 'nat-act-1-1',
          actionNumber: 'Action 1.1',
          title: 'Mathematics Curriculum Adoption and Intervention',
          description: 'Adopt standards-aligned mathematics instructional materials for grades K-12 with embedded intervention pathways. Provide teacher coaching and collaborative planning time to support implementation fidelity.',
          totalFunds: '$2,500,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'in_progress' as const,
          sourceId: 'src-nat-lcap',
        },
        {
          actionId: 'nat-act-1-2',
          actionNumber: 'Action 1.2',
          title: 'Mathematics Intervention and Diagnostic Assessment',
          description: 'Implement tiered mathematics intervention for students performing below grade level across grades K-12, using diagnostic assessment data to assign targeted supports and monitor progress.',
          totalFunds: '$1,500,000',
          fundingSource: 'Title I',
          status: 'in_progress' as const,
          sourceId: 'src-nat-lcap',
        },
        {
          actionId: 'nat-act-1-3',
          actionNumber: 'Action 1.3',
          title: 'Student Engagement and Attendance Supports',
          description: 'Implement attendance monitoring, early warning systems, and student engagement strategies to reduce chronic absenteeism and maximize instructional time across grades K-12.',
          totalFunds: '$950,000',
          fundingSource: 'LCFF Supplemental & Concentration',
          status: 'planned' as const,
          sourceId: 'src-nat-lcap',
        },
      ],
    },
  ],
  academicBrief: {
    leadInsight: 'With math at 29.8% and ELA at 34.0%, Natomas Unified faces significant academic challenges across both subjects. English Learners comprise 20.0% of enrollment, driving overall proficiency rates. FRPM at 71.0% generates substantial Supplemental & Concentration funding eligibility. Chronic absenteeism at 27.3% compounds instructional challenges.',
    keySignals: [
      { label: 'Math proficiency (2023-24)', value: '29.8%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'ELA proficiency (2023-24)', value: '34.0%', detail: '3-year trend data available in CDE DataQuest' },
      { label: 'English Learner share', value: '20.0% of enrollment' },
      { label: 'FRPM rate', value: '71.0% (2023-24)' },
      { label: 'Chronic absenteeism', value: '27.3% — high' },
    ],
  },
  prioritySummary: 'Natomas Unified is a 42,500-student K-12 district in Sacramento County. Math at 29.8% (below state average) and ELA at 34.0% (below state average) create dual-subject urgency. FRPM at 71.0% unlocks significant LCFF Supplemental & Concentration funding. Chronic absenteeism at 27.3% requires attention to engagement and attendance supports. Position around foundational numeracy and literacy intervention.',
  sources: [
    { sourceId: 'src-nat-lcap', sourceType: 'lcap' as const, name: '2024-25 LCAP', academicYear: '2024-25', retrievedAt: '2025-11-10T00:00:00Z' },
    { sourceId: 'src-nat-cde', sourceType: 'state_database' as const, name: 'CDE DataQuest 2023-24', academicYear: '2023-24', retrievedAt: '2025-10-01T00:00:00Z' },
  ],
};