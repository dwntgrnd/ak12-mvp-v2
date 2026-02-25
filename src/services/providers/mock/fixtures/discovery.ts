import type {
  DirectoryEntry,
  DistrictCoverage,
  ProductAlignment,
} from '../../../types/discovery';
import { MOCK_DISTRICTS } from './districts';

// ============================================================
// District ID constants — used across directory, coverage, and relevance maps
// ============================================================

const ID_ELK_GROVE = 'a2671310-4656-4e43-a91a-7688536f1764';       // from MOCK_DISTRICTS
const ID_FRESNO = '75c04266-c622-4294-aa22-046245c95e51';           // from MOCK_DISTRICTS
const ID_TWIN_RIVERS = '94f6d871-3b85-4b21-8499-6b7c450cd124';       // from MOCK_DISTRICTS
const ID_SACRAMENTO_CITY = '7f4e8dd1-9f32-4d87-92f3-3009800b88b0';  // from MOCK_DISTRICTS
const ID_NATOMAS = 'aa868246-d102-4093-873d-f5d6c2890757';           // from MOCK_DISTRICTS
const ID_PLUMAS_COUNTY = 'b1f3e349-0cc9-485b-b9df-d96477b2d4a4';    // from MOCK_DISTRICTS
const ID_PORTLAND = 'non-ca-portland';
const ID_SEATTLE = 'non-ca-seattle';
const ID_DENVER = 'non-ca-denver';

// ============================================================
// A. District Directory
// Derived from MOCK_DISTRICTS + Sacramento-area stubs + 3 non-CA stubs.
// Non-CA entries exist for autocomplete but have Level 5 coverage.
// ============================================================

const EXTRA_DIRECTORY_ENTRIES: DirectoryEntry[] = [
  // Twin Rivers, Sacramento City, Natomas, Plumas County now in MOCK_DISTRICTS
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
// C. Product Relevance Maps (Static Mock)
// Per-product relevance indicators keyed by districtId.
// Used by DistrictService.getMatchSummaries when productLensId is present.
// ============================================================

export const PRODUCT_RELEVANCE_MAPS: Record<string, Record<string, ProductAlignment>> = {
  // EnvisionMath (prod-001) — math curriculum, K-8
  'prod-001': {
    [ID_ELK_GROVE]: {
      level: 'strong',
      signals: ['Active K-8 math curriculum review matches product grade range', 'LCAP Goal 2 math priority aligns with product focus'],
      primaryConnection: 'Active math curriculum review aligns with K-8 grade range',
    },
    [ID_TWIN_RIVERS]: {
      level: 'strong',
      signals: ['$4.2M math materials budget allocated', 'Current Go Math! adoption aging — replacement cycle active'],
      primaryConnection: 'Math materials budget allocated with aging adoption in replacement cycle',
    },
    [ID_SACRAMENTO_CITY]: {
      level: 'moderate',
      signals: ['LCAP math priority present but no active RFP', 'Math proficiency 29.1% indicates need'],
      primaryConnection: 'LCAP math priority present but no active procurement',
    },
    [ID_NATOMAS]: {
      level: 'limited',
      signals: ['Math decline noted but no budget allocation or formal evaluation'],
      primaryConnection: 'Math decline noted without formal evaluation activity',
    },
    [ID_FRESNO]: {
      level: 'moderate',
      signals: ['Large district with math needs but evaluation status unknown'],
      primaryConnection: 'Large district with math needs but evaluation timing unclear',
    },
    [ID_PLUMAS_COUNTY]: {
      level: 'limited',
      signals: ['Small rural district — math proficiency below average but limited LCAP data'],
      primaryConnection: 'Below-average math proficiency with limited strategic data',
    },
  },
  // myPerspectives (prod-002) — ELA curriculum, 6-12
  'prod-002': {
    [ID_ELK_GROVE]: {
      level: 'limited',
      signals: ['No active ELA evaluation signals detected'],
      primaryConnection: 'No active ELA evaluation signals detected',
    },
    // Twin Rivers omitted — insufficient data (was 'unknown', which is no longer a valid level)
    [ID_SACRAMENTO_CITY]: {
      level: 'moderate',
      signals: ['ELA proficiency gaps present', 'Diverse student population aligns with product strengths'],
      primaryConnection: 'ELA gaps and diverse population align with product strengths',
    },
    [ID_NATOMAS]: {
      level: 'limited',
      signals: ['No ELA-specific evaluation activity detected'],
      primaryConnection: 'No ELA-specific evaluation activity detected',
    },
    [ID_FRESNO]: {
      level: 'strong',
      signals: ['High EL population benefits from culturally responsive texts', 'District has active ELA initiatives'],
      primaryConnection: 'Active ELA initiatives with high EL population',
    },
    // Plumas County omitted — insufficient data (was 'unknown', which is no longer a valid level)
  },
};
