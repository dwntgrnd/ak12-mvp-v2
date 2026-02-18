// District Intelligence domain types
//
// Qualitative intelligence for district profile research tabs
// and playbook enrichment. Separate domain from DistrictProfile
// (quantitative CDE data). Source-agnostic — same shape serves
// LCAP data, state plans, web crawls, or sales intelligence.
//
// Demo scope: consumed directly from fixtures by UI components.
// No service contract, no providers, no API routes.
// Production recommendations marked with ⚑ are deferred.

// ============================================================
// Core Container
// ============================================================

/**
 * Top-level intelligence container for a district.
 * Every field is optional. The UI renders tabs only for
 * categories that contain data.
 */
export interface DistrictIntelligence {
  districtId: string;

  /** When this intelligence was last refreshed/updated */
  lastUpdated?: string;                    // ISO 8601

  /** Categories — each is optional and independently populated */
  goals?: DistrictGoal[];
  budgetSummary?: BudgetSummary;
  academicDetail?: AcademicDetail;
  competitiveLandscape?: CompetitorEntry[];
  keyContacts?: DistrictContact[];

  /** Brief content for each research tab category (Phase 6A) */
  goalsBrief?: BriefContent;
  academicBrief?: BriefContent;
  competitiveBrief?: BriefContent;
  otherFundingSignals?: OtherFundingSignal[];
  programMentions?: ProgramMention[];

  /**
   * AI-generated executive summary of district priorities.
   * Analogous to `priority.response` in the original AlchemyK12
   * schema — a synthesis of available intelligence into narrative.
   */
  prioritySummary?: string;

  /** Sources that contributed to this intelligence */
  sources?: IntelligenceSource[];
}

/**
 * Categories that map to research tab rendering.
 * Used to determine which tabs to show without fetching all content.
 */
export type IntelligenceCategory =
  | 'goalsFunding'
  | 'academicPerformance'
  | 'competitiveIntel';

// ============================================================
// Source Attribution
// ============================================================

/**
 * Tracks where intelligence came from. Displayed as citation
 * in the UI — critical for trust ("how do you know this?").
 */
export interface IntelligenceSource {
  sourceId: string;
  sourceType: IntelligenceSourceType;
  name: string;                           // "2024-25 LCAP", "District Website"
  url?: string;                           // link to original document/page
  academicYear?: string;                  // "2024-25"
  retrievedAt?: string;                   // ISO 8601
}

export type IntelligenceSourceType =
  | 'lcap'                                // CA Local Control Accountability Plan
  | 'state_plan'                          // non-CA state accountability plan
  | 'district_website'                    // crawled from district site
  | 'board_minutes'                       // public board meeting records
  | 'state_database'                      // CDE, TEA, etc.
  | 'federal_database'                    // NCES, grants.gov
  | 'sales_intelligence'                  // manually entered by sales team
  | 'news'                                // news article or press release
  | 'other';

// ============================================================
// Goals & Priorities
// ============================================================

/**
 * A district goal with associated actions. In California, maps
 * to LCAP Goal → Actions. Other states map to strategic plan
 * priorities, board-adopted goals, etc.
 */
export interface DistrictGoal {
  goalId: string;
  goalNumber?: string;                    // "Goal 1", "Priority 3"
  title: string;
  description: string;
  goalType?: string;                      // "Broad", "Focused" (LCAP terminology)
  academicYear?: string;                  // "2024-25"
  sourceId?: string;                      // references IntelligenceSource
  actions?: DistrictAction[];
}

/**
 * A specific action under a goal. In LCAP terms, funded
 * activities the district has committed to.
 */
export interface DistrictAction {
  actionId: string;
  actionNumber?: string;                  // "Action 1.3"
  title: string;
  description?: string;
  descriptionSummary?: string;            // AI-generated summary
  totalFunds?: string;                    // dollar amount as string (preserves formatting)
  fundingSource?: string;                 // "LCFF", "Title I", "Supplemental"
  contributing?: boolean;                 // LCAP: contributing to increased/improved services
  status?: ActionStatus;
  sourceId?: string;
}

export type ActionStatus =
  | 'planned'
  | 'in_progress'
  | 'completed'
  | 'unknown';

// ============================================================
// Budget & Funding
// ============================================================

/**
 * Aggregated budget view derived from goal/action funding data
 * plus additional funding intelligence (bonds, grants, etc.).
 */
export interface BudgetSummary {
  academicYear?: string;
  totalBudget?: string;                   // overall instructional budget if known
  totalGoalFunding?: string;              // sum of all goal/action funding

  /** Budget broken down by funding source */
  fundingBreakdown?: FundingBreakdownEntry[];

  /** Notable budget items relevant to sales */
  highlights?: BudgetHighlight[];

  sourceId?: string;
}

export interface FundingBreakdownEntry {
  source: string;                         // "LCFF Base", "Title I"
  amount: string;
  percentage?: number;                    // of total, if calculable
}

export interface BudgetHighlight {
  label: string;                          // "Instructional Materials Budget"
  amount?: string;
  note: string;                           // "Allocated for 2025-26 math adoption cycle"
}

// ============================================================
// Academic Deep Dive
// ============================================================

/**
 * Subject-level and subgroup-level academic detail beyond
 * the top-level metrics grid.
 */
export interface AcademicDetail {
  academicYear?: string;

  /** Subject-by-grade proficiency breakdown */
  subjectBreakdowns?: SubjectBreakdown[];

  /** Performance by student subgroup */
  subgroupGaps?: SubgroupGap[];

  /** Narrative summary of academic trends */
  narrative?: string;

  sourceId?: string;
}

export interface SubjectBreakdown {
  subject: string;                        // "Mathematics", "ELA"
  gradeLevel?: string;                    // "Grade 3", "All"
  proficiencyRate: number;                // percentage
  priorYearRate?: number;                 // for trend calculation
  studentCount?: number;
}

export interface SubgroupGap {
  subgroup: string;                       // "English Learners", "Socioeconomically Disadvantaged"
  subject: string;                        // "Mathematics", "ELA"
  proficiencyRate: number;
  districtOverallRate: number;            // for gap calculation
  gapPoints: number;                      // negative = below overall
}

// ============================================================
// Competitive Landscape
// ============================================================

/**
 * Known competitors active in the district. Sources vary:
 * LCAP actions naming vendors, sales intel, procurement records.
 */
export interface CompetitorEntry {
  entryId: string;
  vendorName: string;                     // "McGraw-Hill", "Amplify"
  productName?: string;                   // "Into Math", "Amplify ELA"
  subjectArea?: string;                   // "Mathematics", "ELA"
  gradeRange?: string;                    // "K-5", "6-8"
  status?: CompetitorStatus;
  contractEndDate?: string;               // ISO 8601 — high-value intel
  notes?: string;
  confidence: IntelligenceConfidence;
  sourceId?: string;
}

export type CompetitorStatus =
  | 'active_contract'
  | 'in_evaluation'
  | 'recently_adopted'
  | 'expiring'
  | 'historical';

export type IntelligenceConfidence =
  | 'confirmed'                           // verified source (contract, board vote)
  | 'probable'                            // strong indicator (LCAP reference)
  | 'possible';                           // single signal, unverified

// ============================================================
// Key Contacts
// ============================================================

/**
 * District personnel relevant to sales conversations.
 * Superintendent comes from DistrictProfile — this covers
 * additional contacts: curriculum directors, CBO, etc.
 */
export interface DistrictContact {
  contactId: string;
  name: string;
  title: string;                          // "Chief Academic Officer"
  department?: string;                    // "Curriculum & Instruction"
  email?: string;
  phone?: string;
  role?: ContactRole;                     // functional role in adoption process
  notes?: string;
  sourceId?: string;
}

export type ContactRole =
  | 'decision_maker'
  | 'evaluator'
  | 'influencer'
  | 'budget_authority'
  | 'champion'
  | 'gatekeeper'
  | 'other';

// ============================================================
// Research Brief Types (Phase 6A)
// ============================================================

/** Shared brief structure for all research tab categories */
export interface BriefContent {
  /** 1-3 sentence narrative answering the tab's core question */
  leadInsight: string;
  /** 2-4 discrete, interpreted data points (not raw values) */
  keySignals: KeySignal[];
}

export interface KeySignal {
  label: string;       // e.g., "Active evaluation"
  value: string;       // e.g., "K-8 Math — $12.5M allocated"
  detail?: string;     // optional secondary line
}

export interface OtherFundingSignal {
  name: string;            // "Educator Effectiveness Block Grant"
  amount?: string;         // "$45M"
  sourceType?: string;     // "state allocation"
  expiration?: string;     // "2026"
  relevanceNote: string;   // "Available for PD, curriculum support, and coaching"
}

export interface ProgramMention {
  mentionId: string;
  programName: string;           // "Amplify ELA"
  vendorName?: string;           // "Amplify"
  subjectArea?: string;          // "English Language Arts"
  gradeRange?: string;           // "K-5"
  mentionType: 'in_use' | 'under_evaluation' | 'planned_replacement' | 'general_reference';
  sourceContext?: string;        // "Referenced in LCAP Goal 1, Action 1.3"
  sourceId?: string;
}
