// Discovery domain types
//
// Complete response schema for the discovery experience — query intent,
// response formats, confidence/coverage, follow-up chips, source citations,
// and all content shapes the UI will render. Discriminated union on
// DiscoveryResponseContent.format is the critical type: rendering components
// switch on it to select the appropriate format component.
//
// Spec references: Spec 12 (Response Format & Query Intent),
// Spec 11 (Confidence & Degradation), Spec 13 §10 (Data Architecture).

// ============================================================
// Query Intent & Response Format
// ============================================================

/**
 * Four intent categories from Spec 12 §Query Intent Taxonomy.
 * Classification determines which response format renders.
 */
export type QueryIntent =
  | 'direct_answer'      // Single fact: "What is Fresno's enrollment?"
  | 'exploratory'        // Landscape survey: "What's happening with math in Sacramento County?"
  | 'comparative'        // Side-by-side: "Compare Elk Grove and Twin Rivers"
  | 'readiness_fit';     // Assessment: "Is Fresno ready for a math curriculum change?"

/**
 * Response format selected based on intent × confidence.
 * Each format maps to a distinct rendering component.
 */
export type ResponseFormat =
  | 'narrative_brief'       // Exploratory at Level 1-2
  | 'direct_answer_card'    // Direct answer
  | 'comparison_table'      // Comparative, 2-3 entities
  | 'intelligence_brief'    // Readiness/fit assessment
  | 'card_set'              // Exploratory at Level 3
  | 'ranked_list'           // Comparative, 4+ entities
  | 'recovery';             // Level 5 — no coverage

// ============================================================
// Confidence & Coverage
// ============================================================

/** Spec 11 confidence levels (1 = full, 5 = no coverage) */
export type ConfidenceLevel = 1 | 2 | 3 | 4 | 5;

/** Data categories that can be independently assessed for coverage */
export type CoverageCategory =
  | 'enrollment_demographics'
  | 'academic_performance'
  | 'goals_priorities'
  | 'budget_funding'
  | 'competitive_landscape'
  | 'stakeholder_contacts';

export interface CategoryCoverage {
  category: CoverageCategory;
  level: ConfidenceLevel;
  note?: string;
}

export interface DistrictCoverage {
  districtId: string;
  overallLevel: ConfidenceLevel;
  categories: CategoryCoverage[];
  lastAssessed?: string;  // ISO 8601
}

export interface SectionConfidence {
  level: ConfidenceLevel;
  transparencyNote?: string;
}

export interface ResponseConfidence {
  overall: ConfidenceLevel;
  sections: Record<string, SectionConfidence>;
}

// ============================================================
// Follow-Up Chips
// ============================================================

export interface FollowUpChip {
  chipId: string;
  label: string;
  query: string;                        // Full query to execute on click
  backedBy: CoverageCategory[];         // Must have data for chip to render
}

// ============================================================
// Source Citation
// ============================================================

export interface DiscoverySource {
  sourceId: string;
  label: string;
  url?: string;
  academicYear?: string;
  sourceType: 'lcap' | 'state_database' | 'federal_database' | 'district_website' | 'news' | 'other';
}

// ============================================================
// Content Types — Discriminated by Format
// ============================================================

/** Brief content shared by `narrative_brief` and `intelligence_brief` */

export interface BriefSection {
  sectionId: string;
  heading: string;
  body: string;
  confidence: SectionConfidence;
}

export interface KeySignal {
  label: string;
  value: string;
  detail?: string;
  districtId?: string;   // when present, signal renders as a DiscoveryResultCard
  location?: string;     // city, county text for card identity zone
  enrollment?: number;   // enrollment for card identity zone
}

export interface BriefContent {
  leadInsight: string;
  keySignals: KeySignal[];
  sections: BriefSection[];
  subjectDistrictId?: string;    // identifies single-entity briefs
  subjectDistrictName?: string;  // display name for link text
}

/** Direct Answer content */

export interface DirectAnswerContent {
  value: string;
  valueUnit?: string;
  contextLine: string;
  districtId?: string;     // enables district profile navigation
  districtName?: string;   // display name for link text
}

/** Comparison content */

export interface ComparisonCell {
  dimensionId: string;
  entityId: string;
  value: string;
  confidence: SectionConfidence;
}

export interface ComparisonEntity {
  entityId: string;
  name: string;
  districtId?: string;
  overallConfidence: ConfidenceLevel;
}

export interface ComparisonDimension {
  dimensionId: string;
  label: string;
}

export interface ComparisonContent {
  title: string;
  entities: ComparisonEntity[];
  dimensions: ComparisonDimension[];
  cells: ComparisonCell[];
  synthesis: string;
  contextBanner?: string;
}

/** Card Set content */

export interface CardSetEntry {
  districtId: string;
  name: string;
  location: string;
  enrollment?: number;
  keyMetric?: { label: string; value: string };
  confidence: ConfidenceLevel;
}

export interface CardSetContent {
  overview?: string;
  districts: CardSetEntry[];
}

/** Ranked List content */

export interface RankedListEntry {
  rank: number;
  districtId: string;
  name: string;
  primaryMetric: { label: string; value: string };
  secondaryMetrics?: { label: string; value: string }[];
  confidence: ConfidenceLevel;
  confidenceNote?: string;
}

export interface RankedListContent {
  title: string;
  rankingCriterion: string;
  entries: RankedListEntry[];
  synthesis?: string;
}

/** Recovery content */

export interface RecoveryContent {
  acknowledgment: string;
  alternativeSuggestion?: string;
  redirectLabel?: string;
  redirectQuery?: string;
}

export interface ProductRelevance {
  alignmentLevel: 'strong' | 'moderate' | 'limited' | 'unknown';
  signals: string[];      // e.g., ["LCAP math priority matches product focus"]
  productName: string;
}

// ============================================================
// Response Envelope — Discriminated Union
// ============================================================

export type DiscoveryResponseContent =
  | { format: 'narrative_brief'; data: BriefContent }
  | { format: 'intelligence_brief'; data: BriefContent }
  | { format: 'direct_answer_card'; data: DirectAnswerContent }
  | { format: 'comparison_table'; data: ComparisonContent }
  | { format: 'card_set'; data: CardSetContent }
  | { format: 'ranked_list'; data: RankedListContent }
  | { format: 'recovery'; data: RecoveryContent };

export interface DiscoveryQueryResponse {
  queryId: string;
  originalQuery: string;
  intent: QueryIntent;
  content: DiscoveryResponseContent;
  confidence: ResponseConfidence;
  followUpChips: FollowUpChip[];
  sources: DiscoverySource[];
  generatedAt: string;  // ISO 8601
  productRelevanceMap?: Record<string, ProductRelevance>;  // keyed by districtId
}

// ============================================================
// Request Types
// ============================================================

export interface DiscoveryQueryRequest {
  query: string;
  productIds?: string[];
  productLensId?: string;   // optional, omitted when no lens active
}

// ============================================================
// District Directory (Autocomplete)
// ============================================================

export interface DirectoryEntry {
  districtId: string;
  name: string;
  county: string;
  state: string;
}

export interface DirectorySearchRequest {
  query: string;
  limit?: number;  // Default 8
}

export interface DirectorySearchResponse {
  matches: DirectoryEntry[];
  hasMore: boolean;
}
