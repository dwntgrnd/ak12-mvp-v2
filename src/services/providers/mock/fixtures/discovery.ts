import type {
  DirectoryEntry,
  DistrictCoverage,
  DiscoveryQueryResponse,
  ProductRelevance,
} from '../../../types/discovery';
import { MOCK_DISTRICTS } from './districts';

// ============================================================
// District ID constants — used across directory, coverage, and scenarios
// ============================================================

const ID_ELK_GROVE = 'a2671310-4656-4e43-a91a-7688536f1764';       // from MOCK_DISTRICTS
const ID_FRESNO = '75c04266-c622-4294-aa22-046245c95e51';           // from MOCK_DISTRICTS
const ID_TWIN_RIVERS = 'twin-rivers-usd';
const ID_SACRAMENTO_CITY = 'sacramento-city-usd';
const ID_NATOMAS = 'natomas-usd';
const ID_PLUMAS_COUNTY = 'plumas-county-oe';
const ID_PORTLAND = 'non-ca-portland';
const ID_SEATTLE = 'non-ca-seattle';
const ID_DENVER = 'non-ca-denver';

// ============================================================
// A. District Directory
// Derived from MOCK_DISTRICTS + Sacramento-area stubs + 3 non-CA stubs.
// Non-CA entries exist for autocomplete but have Level 5 coverage.
// ============================================================

const EXTRA_DIRECTORY_ENTRIES: DirectoryEntry[] = [
  { districtId: ID_TWIN_RIVERS,     name: 'Twin Rivers Unified',                  county: 'Sacramento', state: 'CA' },
  { districtId: ID_SACRAMENTO_CITY, name: 'Sacramento City Unified',              county: 'Sacramento', state: 'CA' },
  { districtId: ID_NATOMAS,         name: 'Natomas Unified',                      county: 'Sacramento', state: 'CA' },
  { districtId: ID_PLUMAS_COUNTY,   name: 'Plumas County Office of Education',    county: 'Plumas',     state: 'CA' },
  { districtId: ID_PORTLAND,        name: 'Portland Public Schools',              county: 'Multnomah',  state: 'OR' },
  { districtId: ID_SEATTLE,         name: 'Seattle Public Schools',               county: 'King',       state: 'WA' },
  { districtId: ID_DENVER,          name: 'Denver Public Schools',                county: 'Denver',     state: 'CO' },
];

export const DISCOVERY_DIRECTORY: DirectoryEntry[] = [
  ...MOCK_DISTRICTS.map((d) => ({
    districtId: d.districtId,
    name: d.name,
    county: d.county,
    state: d.state,
  })),
  ...EXTRA_DIRECTORY_ENTRIES,
];

// ============================================================
// B. Coverage Index
// Per-category confidence profiles. Record keyed by districtId.
// ============================================================

export const DISCOVERY_COVERAGE: Record<string, DistrictCoverage> = {
  [ID_ELK_GROVE]: {
    districtId: ID_ELK_GROVE,
    overallLevel: 1,
    lastAssessed: '2026-02-01',
    categories: [
      { category: 'enrollment_demographics', level: 1 },
      { category: 'academic_performance',    level: 1 },
      { category: 'goals_priorities',        level: 1 },
      { category: 'budget_funding',          level: 1 },
      { category: 'competitive_landscape',   level: 1 },
      { category: 'stakeholder_contacts',    level: 1 },
    ],
  },
  [ID_TWIN_RIVERS]: {
    districtId: ID_TWIN_RIVERS,
    overallLevel: 2,
    lastAssessed: '2026-02-01',
    categories: [
      { category: 'enrollment_demographics', level: 1 },
      { category: 'academic_performance',    level: 1 },
      { category: 'goals_priorities',        level: 2 },
      { category: 'budget_funding',          level: 2 },
      { category: 'competitive_landscape',   level: 3, note: 'Competitive data based on LCAP references only' },
      { category: 'stakeholder_contacts',    level: 2 },
    ],
  },
  [ID_FRESNO]: {
    districtId: ID_FRESNO,
    overallLevel: 1,
    lastAssessed: '2026-02-01',
    categories: [
      { category: 'enrollment_demographics', level: 1 },
      { category: 'academic_performance',    level: 1 },
      { category: 'goals_priorities',        level: 1 },
      { category: 'budget_funding',          level: 1 },
      { category: 'competitive_landscape',   level: 1 },
      { category: 'stakeholder_contacts',    level: 1 },
    ],
  },
  [ID_SACRAMENTO_CITY]: {
    districtId: ID_SACRAMENTO_CITY,
    overallLevel: 1,
    lastAssessed: '2026-02-01',
    categories: [
      { category: 'enrollment_demographics', level: 1 },
      { category: 'academic_performance',    level: 1 },
      { category: 'goals_priorities',        level: 1 },
      { category: 'budget_funding',          level: 1 },
      { category: 'competitive_landscape',   level: 2, note: 'Some vendor intelligence limited to LCAP references' },
      { category: 'stakeholder_contacts',    level: 1 },
    ],
  },
  [ID_NATOMAS]: {
    districtId: ID_NATOMAS,
    overallLevel: 2,
    lastAssessed: '2026-02-01',
    categories: [
      { category: 'enrollment_demographics', level: 1 },
      { category: 'academic_performance',    level: 1 },
      { category: 'goals_priorities',        level: 2 },
      { category: 'budget_funding',          level: 2 },
      { category: 'competitive_landscape',   level: 3, note: 'No direct vendor intelligence available' },
      { category: 'stakeholder_contacts',    level: 3, note: 'Superintendent and board members identified; curriculum contacts not confirmed' },
    ],
  },
  [ID_PLUMAS_COUNTY]: {
    districtId: ID_PLUMAS_COUNTY,
    overallLevel: 3,
    lastAssessed: '2026-02-01',
    categories: [
      { category: 'enrollment_demographics', level: 1 },
      { category: 'academic_performance',    level: 1 },
      { category: 'goals_priorities',        level: 4, note: 'LCAP not yet processed for this district' },
      { category: 'budget_funding',          level: 4, note: 'Budget data not available beyond CDE public records' },
      { category: 'competitive_landscape',   level: 5, note: 'No competitive intelligence available' },
      { category: 'stakeholder_contacts',    level: 5, note: 'No stakeholder data available' },
    ],
  },
  [ID_PORTLAND]: {
    districtId: ID_PORTLAND,
    overallLevel: 5,
    lastAssessed: '2026-02-01',
    categories: [
      { category: 'enrollment_demographics', level: 5 },
      { category: 'academic_performance',    level: 5 },
      { category: 'goals_priorities',        level: 5 },
      { category: 'budget_funding',          level: 5 },
      { category: 'competitive_landscape',   level: 5 },
      { category: 'stakeholder_contacts',    level: 5 },
    ],
  },
  [ID_SEATTLE]: {
    districtId: ID_SEATTLE,
    overallLevel: 5,
    lastAssessed: '2026-02-01',
    categories: [
      { category: 'enrollment_demographics', level: 5 },
      { category: 'academic_performance',    level: 5 },
      { category: 'goals_priorities',        level: 5 },
      { category: 'budget_funding',          level: 5 },
      { category: 'competitive_landscape',   level: 5 },
      { category: 'stakeholder_contacts',    level: 5 },
    ],
  },
  [ID_DENVER]: {
    districtId: ID_DENVER,
    overallLevel: 5,
    lastAssessed: '2026-02-01',
    categories: [
      { category: 'enrollment_demographics', level: 5 },
      { category: 'academic_performance',    level: 5 },
      { category: 'goals_priorities',        level: 5 },
      { category: 'budget_funding',          level: 5 },
      { category: 'competitive_landscape',   level: 5 },
      { category: 'stakeholder_contacts',    level: 5 },
    ],
  },
};

// ============================================================
// C. Demo Scenario Responses
// 6 pre-staged scenarios keyed by keyword arrays.
// Mock service scores keyword overlap against the incoming query.
// ============================================================

export const DISCOVERY_SCENARIOS: { keywords: string[]; response: DiscoveryQueryResponse }[] = [

  // ----------------------------------------------------------
  // Scenario 1 — Exploratory Narrative Brief (Level 1)
  // Query: large Sacramento districts with math evaluation activity
  // ----------------------------------------------------------
  {
    keywords: ['large districts', 'sacramento', 'math evaluations'],
    response: {
      queryId: 'fixture-s1',
      originalQuery: 'large districts in sacramento with math evaluations',
      intent: 'exploratory',
      generatedAt: '2026-02-19T10:00:00Z',
      content: {
        format: 'narrative_brief',
        data: {
          leadInsight:
            'Sacramento County has three large districts actively signaling math curriculum evaluation needs, led by Elk Grove USD\'s formal review process and Twin Rivers\' recent budget allocation for K-8 math materials.',
          keySignals: [
            {
              label: 'Elk Grove USD',
              value: 'Active K-8 math curriculum review',
              detail: 'RFP expected spring 2026',
              districtId: ID_ELK_GROVE,
              location: 'Elk Grove, CA · Sacramento County',
              enrollment: 59800,
            },
            {
              label: 'Twin Rivers USD',
              value: '$4.2M allocated for math materials',
              detail: 'Board approved evaluation timeline',
              districtId: ID_TWIN_RIVERS,
              location: 'North Highlands, CA · Sacramento County',
              enrollment: 27100,
            },
            {
              label: 'Sacramento City USD',
              value: 'Math proficiency 29.1% · LCAP Goal 2 priority',
              detail: 'LCAP prioritizes math intervention',
              districtId: ID_SACRAMENTO_CITY,
              location: 'Sacramento, CA · Sacramento County',
              enrollment: 42500,
            },
            {
              label: 'Natomas USD',
              value: 'Math proficiency trending down 4.2pp',
              detail: 'Exploring supplemental programs',
              districtId: ID_NATOMAS,
              location: 'Sacramento, CA · Sacramento County',
              enrollment: 14800,
            },
          ],
          sections: [
            {
              sectionId: 'regional-math-landscape',
              heading: 'Regional Math Landscape',
              body:
                'Sacramento County\'s four largest unified districts collectively enroll over 142,000 students and share a common challenge: math proficiency has declined steadily since 2021-22 across all grade spans. The county average of 31.8% math proficiency trails the California state average of 33.4%, and all four districts fall below pre-pandemic benchmarks. Elk Grove USD (38.4%) leads the group but is still 7 points below its 2018-19 level. Twin Rivers USD (31.2%) and Sacramento City USD (29.1%) reflect a deeper structural gap, particularly among English Learner and Socioeconomically Disadvantaged subgroups where proficiency ranges from 14% to 22%. Natomas USD (28.6%) has experienced the steepest decline, down 4.2 percentage points over two years, driven by demographic shifts in its fastest-growing attendance areas.',
              confidence: { level: 1 },
            },
            {
              sectionId: 'active-evaluation-signals',
              heading: 'Active Evaluation Signals',
              body:
                'Elk Grove USD is the most advanced in its evaluation cycle. The district launched a formal K-8 math curriculum review in fall 2025 with a curriculum committee of 24 teachers and instructional coaches. An RFP for a full K-8 core adoption is expected in spring 2026, with board approval targeted for June 2026 and implementation in 2026-27. Twin Rivers USD signaled evaluation intent through its October 2024 board meeting, where trustees approved a $4.2M instructional materials allocation explicitly tied to math curriculum assessment. A formal RFP has not yet been published, but district leadership indicated a selection timeline before the 2025-26 school year ends. Sacramento City USD is in an earlier stage, with LCAP Goal 2 establishing math proficiency as a top priority and a curriculum coordinator position posted in January 2026 — a common leading indicator of impending adoption activity. Natomas USD has convened a math task force but has not allocated budget or set a formal timeline.',
              confidence: { level: 1 },
            },
            {
              sectionId: 'funding-timeline-context',
              heading: 'Funding & Timeline Context',
              body:
                'LCAP-based funding provides the primary financing mechanism for math curriculum adoptions in this region. Elk Grove USD\'s curriculum budget draws from Local Control Funding Formula (LCFF) discretionary funds, with roughly $6.8M available in the current fiscal cycle for instructional materials across all subjects. Twin Rivers USD\'s $4.2M allocation is explicitly line-itemed in the 2025-26 adopted budget under Supplemental and Concentration Grant expenditures, indicating board-level commitment. Sacramento City USD has not yet allocated a specific amount, but the district\'s LCAP identifies $3.1M in unspent instructional materials carryforward from 2024-25, which may fund an adoption. Standard California adoption cycles run 5-7 years; Elk Grove\'s current Eureka Math adoption (2019) and Twin Rivers\' Go Math! adoption (2017) are both approaching or past typical review windows.',
              confidence: { level: 1 },
            },
          ],
        },
      },
      confidence: {
        overall: 1,
        sections: {
          'regional-math-landscape':    { level: 1 },
          'active-evaluation-signals':  { level: 1 },
          'funding-timeline-context':   { level: 1 },
        },
      },
      followUpChips: [
        {
          chipId: 's1-chip-1',
          label: 'Compare Elk Grove and Twin Rivers math readiness',
          query: 'Compare Elk Grove and Twin Rivers math readiness',
          backedBy: ['academic_performance', 'goals_priorities'],
        },
        {
          chipId: 's1-chip-2',
          label: 'Show math proficiency trends by district',
          query: 'Show math proficiency trends for Sacramento County districts',
          backedBy: ['academic_performance'],
        },
        {
          chipId: 's1-chip-3',
          label: 'Which Sacramento districts have expiring math adoptions?',
          query: 'Which Sacramento County districts have expiring math curriculum adoptions?',
          backedBy: ['competitive_landscape'],
        },
      ],
      sources: [
        {
          sourceId: 'cde-dataquest-2425',
          label: 'CDE DataQuest — Enrollment & Assessment 2024-25',
          url: 'https://dq.cde.ca.gov/dataquest/',
          academicYear: '2024-25',
          sourceType: 'state_database',
        },
        {
          sourceId: 'egusd-lcap-2425',
          label: 'Elk Grove USD 2024-25 LCAP',
          academicYear: '2024-25',
          sourceType: 'lcap',
        },
        {
          sourceId: 'twin-rivers-lcap-2425',
          label: 'Twin Rivers USD 2024-25 LCAP',
          academicYear: '2024-25',
          sourceType: 'lcap',
        },
      ],
    },
  },

  // ----------------------------------------------------------
  // Scenario 2 — Direct Answer (Level 1)
  // Query: Fresno enrollment
  // ----------------------------------------------------------
  {
    keywords: ['fresno', 'enrollment'],
    response: {
      queryId: 'fixture-s2',
      originalQuery: 'What is Fresno Unified enrollment?',
      intent: 'direct_answer',
      generatedAt: '2026-02-19T10:00:00Z',
      content: {
        format: 'direct_answer_card',
        data: {
          value: '71,673',
          valueUnit: 'students',
          contextLine: 'Fresno Unified School District · 2024-25 enrollment',
          districtId: ID_FRESNO,
          districtName: 'Fresno Unified School District',
        },
      },
      confidence: {
        overall: 1,
        sections: {
          'enrollment': { level: 1 },
        },
      },
      followUpChips: [
        {
          chipId: 's2-chip-1',
          label: 'Show Fresno enrollment trends over 5 years',
          query: 'Show Fresno Unified enrollment trends over the past 5 years',
          backedBy: ['enrollment_demographics'],
        },
        {
          chipId: 's2-chip-2',
          label: 'Compare Fresno enrollment to nearby districts',
          query: 'Compare Fresno Unified enrollment to nearby California districts',
          backedBy: ['enrollment_demographics'],
        },
        {
          chipId: 's2-chip-3',
          label: 'View Fresno Unified full profile',
          query: 'Show full profile for Fresno Unified School District',
          backedBy: ['enrollment_demographics'],
        },
      ],
      sources: [
        {
          sourceId: 'cde-enrollment-2425',
          label: 'CDE DataQuest Enrollment Data 2024-25',
          url: 'https://dq.cde.ca.gov/dataquest/',
          academicYear: '2024-25',
          sourceType: 'state_database',
        },
      ],
    },
  },

  // ----------------------------------------------------------
  // Scenario 3 — Intelligence Brief / Readiness Assessment (Level 2)
  // Query: Is Twin Rivers ready for a math curriculum change?
  // ----------------------------------------------------------
  {
    keywords: ['twin rivers', 'math curriculum', 'ready', 'change'],
    response: {
      queryId: 'fixture-s3',
      originalQuery: 'Is Twin Rivers ready for a math curriculum change?',
      intent: 'readiness_fit',
      generatedAt: '2026-02-19T10:00:00Z',
      content: {
        format: 'intelligence_brief',
        data: {
          leadInsight:
            'Twin Rivers USD shows moderate-to-strong signals for math curriculum change — declining proficiency and an aging adoption create urgency, though limited competitive landscape data leaves vendor positioning unclear.',
          keySignals: [
            {
              label: 'Math Proficiency',
              value: '31.2% — down 5.1pp over 2 years',
            },
            {
              label: 'Current Adoption',
              value: 'Houghton Mifflin Go Math! · Adopted 2017',
            },
            {
              label: 'LCAP Priority',
              value: 'Goal 1 explicitly targets math intervention and materials',
            },
            {
              label: 'Budget Signal',
              value: '$4.2M allocated for instructional materials 2025-26',
            },
          ],
          sections: [
            {
              sectionId: 'performance-trends',
              heading: 'Performance Trends',
              body:
                'Twin Rivers USD math proficiency has declined from 36.3% in 2022-23 to 31.2% in 2024-25, a 5.1 percentage point drop that mirrors but exceeds the statewide trend. Third-grade math proficiency sits at 27.4%, below the district\'s own 2021-22 baseline of 31.8% and well below the state average of 35.1% for the same grade. English Learner students in the district score 18.9% proficient in math — a gap of 12.3 points compared to non-EL peers. Socioeconomically Disadvantaged students are at 22.1%, underscoring a systemic equity challenge that a coherent core curriculum intervention could meaningfully address. The 2-year decline trajectory is consistent across all grade bands from K-5 and suggests a curriculum alignment issue rather than an isolated demographic shift.',
              confidence: { level: 1 },
            },
            {
              sectionId: 'evaluation-signals',
              heading: 'Evaluation Signals',
              body:
                'Several convergent signals indicate Twin Rivers is in active evaluation mode. The 2024-25 LCAP, Goal 1 Action 3, commits $4.2M to "evaluation and procurement of high-quality instructional materials in mathematics." The October 2024 board meeting included a superintendent\'s report referencing the need to "revisit our K-8 math program alignment" and a curriculum committee chair presentation on EdReports ratings for four math programs. The district\'s current Go Math! adoption is 8 years old — at the outer edge of California\'s typical 5-7 year cycle and no longer receiving active publisher updates. A curriculum coordinator job posting from January 2025 listed "lead K-8 math program evaluation" as a primary responsibility, a strong operational indicator that an adoption decision is forthcoming within 12-18 months.',
              confidence: { level: 2 },
            },
            {
              sectionId: 'competitive-landscape',
              heading: 'Competitive Landscape',
              body:
                'Competitive intelligence for Twin Rivers is limited. The district\'s current adoption (Go Math!) is publicly documented through LCAP references and board materials. The October 2024 board presentation referenced four programs by name — Eureka Math Squared, Illustrative Mathematics, Into Math, and a fourth redacted in public documents — suggesting these are in active evaluation. No direct vendor meeting records, pilot data, or formal shortlist have been identified in public documents. The district has not published an RFP. Based on regional patterns and the EdReports criteria cited by the curriculum committee, Illustrative Mathematics and Eureka Math Squared appear most likely to be in contention.',
              confidence: {
                level: 2,
                transparencyNote:
                  'Competitive data based on LCAP references and board meeting materials only — direct vendor intelligence not available for this district.',
              },
            },
            {
              sectionId: 'stakeholder-context',
              heading: 'Stakeholder Context',
              body:
                'Dr. Olivia Harrison serves as Superintendent of Twin Rivers USD. The Director of Curriculum and Instruction, Mark Solis, is the operational lead for the math curriculum evaluation based on board meeting presentations. Board President Maria Estrada has vocally prioritized math improvement in public comments since 2023. Three additional board trustees have indicated support for a new math adoption in their public statements. The Parent Advisory Committee (PAC) submitted a formal recommendation in September 2024 supporting a transition to a more "structured" math program.',
              confidence: {
                level: 2,
                transparencyNote:
                  'Key contacts beyond superintendent identified from public board documents only — direct relationship intelligence not available.',
              },
            },
          ],
          subjectDistrictId: ID_TWIN_RIVERS,
          subjectDistrictName: 'Twin Rivers USD',
        },
      },
      confidence: {
        overall: 2,
        sections: {
          'performance-trends':   { level: 1 },
          'evaluation-signals':   { level: 2 },
          'competitive-landscape': {
            level: 2,
            transparencyNote: 'Competitive data based on LCAP references and board meeting materials only — direct vendor intelligence not available for this district.',
          },
          'stakeholder-context': {
            level: 2,
            transparencyNote: 'Key contacts beyond superintendent identified from public board documents only.',
          },
        },
      },
      followUpChips: [
        {
          chipId: 's3-chip-1',
          label: 'Show Twin Rivers math scores by grade level',
          query: 'Show Twin Rivers Unified math proficiency scores by grade level',
          backedBy: ['academic_performance'],
        },
        {
          chipId: 's3-chip-2',
          label: 'Compare Twin Rivers to Elk Grove on math readiness',
          query: 'Compare Twin Rivers and Elk Grove on math curriculum readiness',
          backedBy: ['academic_performance', 'goals_priorities'],
        },
        {
          chipId: 's3-chip-3',
          label: 'Generate playbook for Twin Rivers',
          query: 'Generate engagement playbook for Twin Rivers Unified math curriculum',
          backedBy: ['goals_priorities', 'academic_performance'],
        },
      ],
      sources: [
        {
          sourceId: 'cde-dataquest-2425',
          label: 'CDE DataQuest — Assessment Data 2024-25',
          url: 'https://dq.cde.ca.gov/dataquest/',
          academicYear: '2024-25',
          sourceType: 'state_database',
        },
        {
          sourceId: 'twin-rivers-lcap-2425',
          label: 'Twin Rivers USD 2024-25 LCAP',
          academicYear: '2024-25',
          sourceType: 'lcap',
        },
        {
          sourceId: 'twin-rivers-board-nov-2024',
          label: 'Twin Rivers USD Board Meeting Minutes — November 2024',
          sourceType: 'district_website',
        },
      ],
    },
  },

  // ----------------------------------------------------------
  // Scenario 4 — Comparison Table (Mixed Confidence)
  // Query: Compare Elk Grove and Twin Rivers on math
  // ----------------------------------------------------------
  {
    keywords: ['compare', 'elk grove', 'twin rivers', 'math'],
    response: {
      queryId: 'fixture-s4',
      originalQuery: 'Compare Elk Grove and Twin Rivers on math curriculum readiness',
      intent: 'comparative',
      generatedAt: '2026-02-19T10:00:00Z',
      content: {
        format: 'comparison_table',
        data: {
          title: 'Elk Grove USD vs. Twin Rivers USD — Math Curriculum Readiness',
          entities: [
            {
              entityId: 'egusd',
              name: 'Elk Grove USD',
              districtId: ID_ELK_GROVE,
              overallConfidence: 1,
            },
            {
              entityId: 'trusd',
              name: 'Twin Rivers USD',
              districtId: ID_TWIN_RIVERS,
              overallConfidence: 2,
            },
          ],
          dimensions: [
            { dimensionId: 'enrollment',          label: 'Total Enrollment' },
            { dimensionId: 'math-proficiency',    label: 'Math Proficiency' },
            { dimensionId: 'math-trend',          label: '2-Year Math Trend' },
            { dimensionId: 'lcap-math-priority',  label: 'LCAP Math Priority' },
            { dimensionId: 'eval-status',         label: 'Evaluation Status' },
            { dimensionId: 'current-adoption',    label: 'Current Math Adoption' },
            { dimensionId: 'competitive',         label: 'Competitive Landscape' },
          ],
          cells: [
            // enrollment
            { dimensionId: 'enrollment',         entityId: 'egusd', value: '59,800',                              confidence: { level: 1 } },
            { dimensionId: 'enrollment',         entityId: 'trusd', value: '27,100',                              confidence: { level: 1 } },
            // math proficiency
            { dimensionId: 'math-proficiency',   entityId: 'egusd', value: '38.4%',                              confidence: { level: 1 } },
            { dimensionId: 'math-proficiency',   entityId: 'trusd', value: '31.2%',                              confidence: { level: 1 } },
            // trend
            { dimensionId: 'math-trend',         entityId: 'egusd', value: '▼ 3.8pp over 2 years',              confidence: { level: 1 } },
            { dimensionId: 'math-trend',         entityId: 'trusd', value: '▼ 5.1pp over 2 years',              confidence: { level: 1 } },
            // lcap priority
            { dimensionId: 'lcap-math-priority', entityId: 'egusd', value: 'Goal 2 — math intervention & materials', confidence: { level: 1 } },
            { dimensionId: 'lcap-math-priority', entityId: 'trusd', value: 'Goal 1 — math intervention & materials', confidence: { level: 1 } },
            // evaluation status
            { dimensionId: 'eval-status',        entityId: 'egusd', value: 'Active K-8 review, RFP spring 2026', confidence: { level: 1 } },
            { dimensionId: 'eval-status',        entityId: 'trusd', value: 'Budget allocated, timeline TBD',     confidence: { level: 2 } },
            // current adoption
            { dimensionId: 'current-adoption',   entityId: 'egusd', value: 'Eureka Math · Adopted 2019',        confidence: { level: 1 } },
            { dimensionId: 'current-adoption',   entityId: 'trusd', value: 'Go Math! · Adopted 2017',           confidence: { level: 2 } },
            // competitive landscape
            { dimensionId: 'competitive',        entityId: 'egusd', value: '3 vendors in evaluation pipeline',  confidence: { level: 1 } },
            {
              dimensionId: 'competitive',
              entityId: 'trusd',
              value: 'Limited vendor intelligence available',
              confidence: {
                level: 3,
                transparencyNote: 'Competitive data for Twin Rivers based on LCAP references only — direct vendor intelligence not available.',
              },
            },
          ],
          synthesis:
            'Both districts show declining math proficiency and have prioritized math in their LCAPs, but Elk Grove is further along in the evaluation process with an active review and upcoming RFP. Twin Rivers has allocated significant budget ($4.2M) but has not published a formal timeline. Elk Grove\'s larger enrollment and more advanced evaluation make it the higher-priority near-term opportunity, while Twin Rivers represents a strong mid-term target once their process formalizes.',
        },
      },
      confidence: {
        overall: 2,
        sections: {
          'egusd': { level: 1 },
          'trusd': { level: 2 },
        },
      },
      followUpChips: [
        {
          chipId: 's4-chip-1',
          label: 'Break down math scores by grade level for both districts',
          query: 'Show math proficiency by grade level for Elk Grove USD and Twin Rivers USD',
          backedBy: ['academic_performance'],
        },
        {
          chipId: 's4-chip-2',
          label: 'Show EL subgroup math comparison',
          query: 'Compare English Learner math proficiency between Elk Grove and Twin Rivers',
          backedBy: ['academic_performance', 'enrollment_demographics'],
        },
        {
          chipId: 's4-chip-3',
          label: 'View Elk Grove full profile',
          query: 'Show full profile for Elk Grove Unified School District',
          backedBy: ['enrollment_demographics'],
        },
      ],
      sources: [
        {
          sourceId: 'cde-dataquest-2425',
          label: 'CDE DataQuest — Enrollment & Assessment 2024-25',
          url: 'https://dq.cde.ca.gov/dataquest/',
          academicYear: '2024-25',
          sourceType: 'state_database',
        },
        {
          sourceId: 'egusd-lcap-2425',
          label: 'Elk Grove USD 2024-25 LCAP',
          academicYear: '2024-25',
          sourceType: 'lcap',
        },
        {
          sourceId: 'twin-rivers-lcap-2425',
          label: 'Twin Rivers USD 2024-25 LCAP',
          academicYear: '2024-25',
          sourceType: 'lcap',
        },
      ],
    },
  },

  // ----------------------------------------------------------
  // Scenario 5 — Recovery (Level 5)
  // Query: Oregon districts with EL support programs
  // ----------------------------------------------------------
  {
    keywords: ['oregon', 'districts', 'el support'],
    response: {
      queryId: 'fixture-s5',
      originalQuery: 'Oregon districts with strong EL support programs',
      intent: 'exploratory',
      generatedAt: '2026-02-19T10:00:00Z',
      content: {
        format: 'recovery',
        data: {
          acknowledgment:
            'Oregon districts are not yet in our coverage area. We currently provide district intelligence for California school districts.',
          alternativeSuggestion:
            'California has several large districts with significant English Learner populations and active EL support program evaluations, including Fresno Unified (29.4% EL), Los Angeles Unified (20.1% EL), and Sacramento City USD (17.8% EL).',
          redirectLabel: 'Explore California districts with EL support needs',
          redirectQuery: 'California districts with high EL populations and support program needs',
        },
      },
      confidence: {
        overall: 5,
        sections: {},
      },
      followUpChips: [
        {
          chipId: 's5-chip-1',
          label: 'Show California districts with highest EL populations',
          query: 'Show California districts with the highest English Learner populations',
          backedBy: ['enrollment_demographics'],
        },
        {
          chipId: 's5-chip-2',
          label: 'Which California districts are evaluating EL programs?',
          query: 'Which California districts are currently evaluating English Learner support programs?',
          backedBy: ['goals_priorities', 'competitive_landscape'],
        },
      ],
      sources: [],
    },
  },

  // ----------------------------------------------------------
  // Scenario 7 — Ranked List (Sacramento County Math Declines)
  // Query: Which Sacramento County districts have the steepest math score declines?
  // ----------------------------------------------------------
  {
    keywords: ['rank', 'sacramento', 'math', 'decline'],
    response: {
      queryId: 'fixture-s7',
      originalQuery: 'Which Sacramento County districts have the steepest math score declines?',
      intent: 'comparative',
      generatedAt: '2026-02-19T10:00:00Z',
      content: {
        format: 'ranked_list',
        data: {
          title: 'Sacramento County Districts by Math Proficiency Decline (2-Year)',
          rankingCriterion: '2-year math proficiency percentage point change',
          entries: [
            {
              rank: 1,
              districtId: ID_TWIN_RIVERS,
              name: 'Twin Rivers USD',
              primaryMetric: { label: 'Math Decline', value: '-5.1pp' },
              secondaryMetrics: [
                { label: 'Current Proficiency', value: '31.2%' },
                { label: 'Enrollment', value: '27,100' },
              ],
              confidence: 1,
            },
            {
              rank: 2,
              districtId: ID_SACRAMENTO_CITY,
              name: 'Sacramento City USD',
              primaryMetric: { label: 'Math Decline', value: '-4.6pp' },
              secondaryMetrics: [
                { label: 'Current Proficiency', value: '29.8%' },
                { label: 'Enrollment', value: '42,500' },
              ],
              confidence: 2,
              confidenceNote: 'Proficiency data from 2023-24; 2024-25 not yet published.',
            },
            {
              rank: 3,
              districtId: ID_ELK_GROVE,
              name: 'Elk Grove USD',
              primaryMetric: { label: 'Math Decline', value: '-3.8pp' },
              secondaryMetrics: [
                { label: 'Current Proficiency', value: '38.4%' },
                { label: 'Enrollment', value: '59,800' },
              ],
              confidence: 1,
            },
            {
              rank: 4,
              districtId: ID_NATOMAS,
              name: 'Natomas USD',
              primaryMetric: { label: 'Math Decline', value: '-2.9pp' },
              secondaryMetrics: [
                { label: 'Current Proficiency', value: '35.1%' },
                { label: 'Enrollment', value: '14,200' },
              ],
              confidence: 2,
              confidenceNote: 'Limited LCAP data available for Natomas.',
            },
          ],
          synthesis: 'Twin Rivers and Sacramento City show the most significant math proficiency declines in the county, both exceeding 4 percentage points over two years. Both districts have prioritized math intervention in their LCAPs. Elk Grove\'s decline is more moderate but notable given its large enrollment — the district has already initiated a K-8 math curriculum review. Natomas shows the smallest decline but limited LCAP documentation makes it harder to assess their response.',
        },
      },
      confidence: {
        overall: 2,
        sections: {
          'rank-1': { level: 1 },
          'rank-2': { level: 2 },
          'rank-3': { level: 1 },
          'rank-4': { level: 2 },
        },
      },
      followUpChips: [
        {
          chipId: 's7-chip-1',
          label: 'Compare Twin Rivers and Sacramento City math programs',
          query: 'Compare Twin Rivers and Sacramento City math programs',
          backedBy: ['academic_performance', 'goals_priorities'],
        },
        {
          chipId: 's7-chip-2',
          label: 'Show EL subgroup math for these districts',
          query: 'Show English Learner subgroup math proficiency for Twin Rivers, Sacramento City, Elk Grove, and Natomas',
          backedBy: ['academic_performance', 'enrollment_demographics'],
        },
        {
          chipId: 's7-chip-3',
          label: 'View Twin Rivers full profile',
          query: 'Show full profile for Twin Rivers Unified School District',
          backedBy: ['enrollment_demographics'],
        },
      ],
      sources: [
        {
          sourceId: 'cde-dataquest-2425',
          label: 'CDE DataQuest 2024-25',
          url: 'https://dq.cde.ca.gov/dataquest/',
          academicYear: '2024-25',
          sourceType: 'state_database',
        },
        {
          sourceId: 'twin-rivers-lcap-2425',
          label: 'Twin Rivers LCAP',
          academicYear: '2024-25',
          sourceType: 'lcap',
        },
        {
          sourceId: 'sacramento-city-lcap-2425',
          label: 'Sacramento City LCAP',
          academicYear: '2024-25',
          sourceType: 'lcap',
        },
        {
          sourceId: 'egusd-lcap-2425',
          label: 'Elk Grove LCAP',
          academicYear: '2024-25',
          sourceType: 'lcap',
        },
      ],
    },
  },

  // ----------------------------------------------------------
  // Scenario 8 — Card Set (Sacramento County EL Support) — primary keywords
  // Query: Show me Sacramento County districts with English learner programs
  // ----------------------------------------------------------
  {
    keywords: ['sacramento', 'county', 'districts', 'english learner'],
    response: {
      queryId: 'fixture-s8',
      originalQuery: 'Show me Sacramento County districts with English learner programs',
      intent: 'exploratory',
      generatedAt: '2026-02-19T10:00:00Z',
      content: {
        format: 'card_set',
        data: {
          overview: 'Four Sacramento County districts with significant English Learner populations and active EL support programs identified from LCAP priorities and demographic data.',
          districts: [
            {
              districtId: ID_ELK_GROVE,
              name: 'Elk Grove USD',
              location: 'Elk Grove, CA',
              enrollment: 59800,
              keyMetric: { label: 'EL Population', value: '24.3%' },
              confidence: 1,
            },
            {
              districtId: ID_SACRAMENTO_CITY,
              name: 'Sacramento City USD',
              location: 'Sacramento, CA',
              enrollment: 42500,
              keyMetric: { label: 'EL Population', value: '19.7%' },
              confidence: 2,
            },
            {
              districtId: ID_TWIN_RIVERS,
              name: 'Twin Rivers USD',
              location: 'North Highlands, CA',
              enrollment: 27100,
              keyMetric: { label: 'EL Population', value: '21.5%' },
              confidence: 1,
            },
            {
              districtId: ID_NATOMAS,
              name: 'Natomas USD',
              location: 'Sacramento, CA',
              enrollment: 14200,
              keyMetric: { label: 'EL Population', value: '16.8%' },
              confidence: 2,
            },
          ],
        },
      },
      confidence: {
        overall: 2,
        sections: {},
      },
      followUpChips: [
        {
          chipId: 's8-chip-1',
          label: 'Compare EL proficiency across these districts',
          query: 'Compare English Learner proficiency across Elk Grove, Sacramento City, Twin Rivers, and Natomas',
          backedBy: ['academic_performance', 'enrollment_demographics'],
        },
        {
          chipId: 's8-chip-2',
          label: 'Which district has the largest EL budget allocation?',
          query: 'Which Sacramento County district has the largest English Learner budget allocation?',
          backedBy: ['budget_funding', 'goals_priorities'],
        },
        {
          chipId: 's8-chip-3',
          label: 'Show Elk Grove EL program details',
          query: 'Show Elk Grove USD English Learner program details',
          backedBy: ['goals_priorities', 'enrollment_demographics'],
        },
      ],
      sources: [
        {
          sourceId: 'cde-dataquest-2425',
          label: 'CDE DataQuest 2024-25',
          url: 'https://dq.cde.ca.gov/dataquest/',
          academicYear: '2024-25',
          sourceType: 'state_database',
        },
        {
          sourceId: 'cde-el-dashboard-2425',
          label: 'CDE English Learner Dashboard',
          url: 'https://www.caschooldashboard.org/',
          academicYear: '2024-25',
          sourceType: 'state_database',
        },
      ],
    },
  },

  // ----------------------------------------------------------
  // Scenario 8b — Card Set (Sacramento County EL Support) — alternate keywords
  // Same response, alternate trigger: ['sacramento', 'el', 'support']
  // ----------------------------------------------------------
  {
    keywords: ['sacramento', 'el', 'support'],
    response: {
      queryId: 'fixture-s8',
      originalQuery: 'Show me Sacramento County districts with English learner programs',
      intent: 'exploratory',
      generatedAt: '2026-02-19T10:00:00Z',
      content: {
        format: 'card_set',
        data: {
          overview: 'Four Sacramento County districts with significant English Learner populations and active EL support programs identified from LCAP priorities and demographic data.',
          districts: [
            {
              districtId: ID_ELK_GROVE,
              name: 'Elk Grove USD',
              location: 'Elk Grove, CA',
              enrollment: 59800,
              keyMetric: { label: 'EL Population', value: '24.3%' },
              confidence: 1,
            },
            {
              districtId: ID_SACRAMENTO_CITY,
              name: 'Sacramento City USD',
              location: 'Sacramento, CA',
              enrollment: 42500,
              keyMetric: { label: 'EL Population', value: '19.7%' },
              confidence: 2,
            },
            {
              districtId: ID_TWIN_RIVERS,
              name: 'Twin Rivers USD',
              location: 'North Highlands, CA',
              enrollment: 27100,
              keyMetric: { label: 'EL Population', value: '21.5%' },
              confidence: 1,
            },
            {
              districtId: ID_NATOMAS,
              name: 'Natomas USD',
              location: 'Sacramento, CA',
              enrollment: 14200,
              keyMetric: { label: 'EL Population', value: '16.8%' },
              confidence: 2,
            },
          ],
        },
      },
      confidence: {
        overall: 2,
        sections: {},
      },
      followUpChips: [
        {
          chipId: 's8-chip-1',
          label: 'Compare EL proficiency across these districts',
          query: 'Compare English Learner proficiency across Elk Grove, Sacramento City, Twin Rivers, and Natomas',
          backedBy: ['academic_performance', 'enrollment_demographics'],
        },
        {
          chipId: 's8-chip-2',
          label: 'Which district has the largest EL budget allocation?',
          query: 'Which Sacramento County district has the largest English Learner budget allocation?',
          backedBy: ['budget_funding', 'goals_priorities'],
        },
        {
          chipId: 's8-chip-3',
          label: 'Show Elk Grove EL program details',
          query: 'Show Elk Grove USD English Learner program details',
          backedBy: ['goals_priorities', 'enrollment_demographics'],
        },
      ],
      sources: [
        {
          sourceId: 'cde-dataquest-2425',
          label: 'CDE DataQuest 2024-25',
          url: 'https://dq.cde.ca.gov/dataquest/',
          academicYear: '2024-25',
          sourceType: 'state_database',
        },
        {
          sourceId: 'cde-el-dashboard-2425',
          label: 'CDE English Learner Dashboard',
          url: 'https://www.caschooldashboard.org/',
          academicYear: '2024-25',
          sourceType: 'state_database',
        },
      ],
    },
  },

  // ----------------------------------------------------------
  // Scenario 6 — Narrative Brief at Level 3 (Quantitative Only)
  // Query: Plumas County math
  // ----------------------------------------------------------
  {
    keywords: ['plumas county', 'math'],
    response: {
      queryId: 'fixture-s6',
      originalQuery: 'What can you tell me about math in Plumas County?',
      intent: 'exploratory',
      generatedAt: '2026-02-19T10:00:00Z',
      content: {
        format: 'narrative_brief',
        data: {
          leadInsight:
            'Plumas County Office of Education serves a small rural student population with math proficiency significantly below state average, though limited qualitative intelligence is available for this district.',
          keySignals: [
            {
              label: 'Enrollment',
              value: '1,012 students · Rural mountain county',
            },
            {
              label: 'Math Proficiency',
              value: '22.8% — below state average of 33.4%',
            },
            {
              label: 'District Context',
              value: 'Small, geographically isolated · K-12 unified',
            },
          ],
          sections: [
            {
              sectionId: 'academic-performance',
              heading: 'Academic Performance',
              body:
                'Plumas County Office of Education reported 22.8% math proficiency in 2024-25, compared to the California state average of 33.4%. ELA proficiency stands at 41.2%, closer to the statewide average of 47.1%. The district\'s math proficiency has been below state average for each of the past three years for which data is available (2022-23: 24.1%; 2023-24: 23.4%; 2024-25: 22.8%), indicating a modest downward trend. The small student population (under 1,100) means individual cohort variation can move percentages meaningfully from year to year. All grades K-12 are served through a combination of school sites and independent study options typical of rural Northern California districts.',
              confidence: { level: 1 },
            },
            {
              sectionId: 'district-demographics',
              heading: 'District Demographics',
              body:
                'Plumas County OE serves approximately 1,012 students across Plumas County, a geographically isolated mountain county in Northern California\'s Sierra Nevada. The district\'s student population is approximately 68% White, 18% Hispanic/Latino, and 14% other ethnicities. Free and reduced-price meal (FRPM) eligibility is 61%, reflecting the county\'s rural poverty profile. English Learner percentage is 8.4%, well below the California average of 19.2%. Special education enrollment is approximately 15.2%, above the state average of 13.1%, consistent with patterns in small rural districts. The geographic isolation makes staff recruitment and retention a persistent operational challenge, which may affect both program availability and assessment consistency.',
              confidence: { level: 1 },
            },
            {
              sectionId: 'goals-strategic-priorities',
              heading: 'Goals & Strategic Priorities',
              body: '',
              confidence: {
                level: 4,
                transparencyNote:
                  'LCAP data has not been processed for Plumas County Office of Education. Strategic priority information is not available.',
              },
            },
          ],
          subjectDistrictId: ID_PLUMAS_COUNTY,
          subjectDistrictName: 'Plumas County Office of Education',
        },
      },
      confidence: {
        overall: 3,
        sections: {
          'academic-performance':       { level: 1 },
          'district-demographics':      { level: 1 },
          'goals-strategic-priorities': {
            level: 4,
            transparencyNote: 'LCAP data has not been processed for Plumas County Office of Education.',
          },
        },
      },
      followUpChips: [
        {
          chipId: 's6-chip-1',
          label: 'Compare Plumas County to similar-sized districts',
          query: 'Compare Plumas County Office of Education to similar small rural California districts on math performance',
          backedBy: ['enrollment_demographics', 'academic_performance'],
        },
        {
          chipId: 's6-chip-2',
          label: 'View Plumas County profile',
          query: 'Show full profile for Plumas County Office of Education',
          backedBy: ['enrollment_demographics'],
        },
      ],
      sources: [
        {
          sourceId: 'cde-dataquest-2425',
          label: 'CDE DataQuest — Enrollment & Assessment 2024-25',
          url: 'https://dq.cde.ca.gov/dataquest/',
          academicYear: '2024-25',
          sourceType: 'state_database',
        },
      ],
    },
  },
];

// ============================================================
// E. Product Relevance Maps (Static Mock)
// Per-product relevance indicators keyed by districtId.
// Used when productLensId is present in the query request.
// ============================================================

export const PRODUCT_RELEVANCE_MAPS: Record<string, Record<string, ProductRelevance>> = {
  // EnvisionMath (prod-001) — math curriculum, K-8
  'prod-001': {
    [ID_ELK_GROVE]: {
      alignmentLevel: 'strong',
      signals: ['Active K-8 math curriculum review matches product grade range', 'LCAP Goal 2 math priority aligns with product focus'],
      productName: 'EnvisionMath',
    },
    [ID_TWIN_RIVERS]: {
      alignmentLevel: 'strong',
      signals: ['$4.2M math materials budget allocated', 'Current Go Math! adoption aging — replacement cycle active'],
      productName: 'EnvisionMath',
    },
    [ID_SACRAMENTO_CITY]: {
      alignmentLevel: 'moderate',
      signals: ['LCAP math priority present but no active RFP', 'Math proficiency 29.1% indicates need'],
      productName: 'EnvisionMath',
    },
    [ID_NATOMAS]: {
      alignmentLevel: 'limited',
      signals: ['Math decline noted but no budget allocation or formal evaluation'],
      productName: 'EnvisionMath',
    },
    [ID_FRESNO]: {
      alignmentLevel: 'moderate',
      signals: ['Large district with math needs but evaluation status unknown'],
      productName: 'EnvisionMath',
    },
    [ID_PLUMAS_COUNTY]: {
      alignmentLevel: 'limited',
      signals: ['Small rural district — math proficiency below average but limited LCAP data'],
      productName: 'EnvisionMath',
    },
  },
  // myPerspectives (prod-002) — ELA curriculum, 6-12
  'prod-002': {
    [ID_ELK_GROVE]: {
      alignmentLevel: 'limited',
      signals: ['No active ELA evaluation signals detected'],
      productName: 'myPerspectives',
    },
    [ID_TWIN_RIVERS]: {
      alignmentLevel: 'unknown',
      signals: ['Insufficient data to assess ELA alignment'],
      productName: 'myPerspectives',
    },
    [ID_SACRAMENTO_CITY]: {
      alignmentLevel: 'moderate',
      signals: ['ELA proficiency gaps present', 'Diverse student population aligns with product strengths'],
      productName: 'myPerspectives',
    },
    [ID_NATOMAS]: {
      alignmentLevel: 'limited',
      signals: ['No ELA-specific evaluation activity detected'],
      productName: 'myPerspectives',
    },
    [ID_FRESNO]: {
      alignmentLevel: 'strong',
      signals: ['High EL population benefits from culturally responsive texts', 'District has active ELA initiatives'],
      productName: 'myPerspectives',
    },
    [ID_PLUMAS_COUNTY]: {
      alignmentLevel: 'unknown',
      signals: ['Insufficient data for ELA assessment'],
      productName: 'myPerspectives',
    },
  },
};

// ============================================================
// D. Fallback Response
// Returned when no scenario keywords match the incoming query.
// ============================================================

export const DISCOVERY_FALLBACK_RESPONSE: DiscoveryQueryResponse = {
  queryId: 'fixture-fallback',
  originalQuery: '',
  intent: 'exploratory',
  generatedAt: '2026-02-19T10:00:00Z',
  content: {
    format: 'narrative_brief',
    data: {
      leadInsight:
        'Here\'s what we found based on your query. Note: this is a demo environment with pre-staged data for select California districts.',
      keySignals: [
        {
          label: 'Coverage Area',
          value: 'California school districts — 50+ districts indexed',
        },
        {
          label: 'Demo Scenarios',
          value: 'Pre-staged for Sacramento, Fresno, and rural districts',
        },
      ],
      sections: [
        {
          sectionId: 'demo-context',
          heading: 'Demo Environment',
          body:
            'This demo environment includes pre-staged intelligence for a curated set of California school districts, with full coverage for Elk Grove USD, Fresno Unified, Sacramento City USD, and Twin Rivers USD, and partial coverage for Natomas USD and Plumas County OE. Try queries like "large Sacramento districts with math evaluations," "Fresno enrollment," "Is Twin Rivers ready for a math curriculum change?", or "Compare Elk Grove and Twin Rivers on math." Non-California districts will return a coverage recovery response.',
          confidence: { level: 2 },
        },
      ],
    },
  },
  confidence: {
    overall: 2,
    sections: {
      'demo-context': { level: 2 },
    },
  },
  followUpChips: [
    {
      chipId: 'fallback-chip-1',
      label: 'Explore Sacramento math landscape',
      query: 'Large districts in Sacramento with math evaluations',
      backedBy: ['academic_performance', 'goals_priorities'],
    },
    {
      chipId: 'fallback-chip-2',
      label: 'View Fresno Unified profile',
      query: 'Show full profile for Fresno Unified',
      backedBy: ['enrollment_demographics'],
    },
  ],
  sources: [],
};
