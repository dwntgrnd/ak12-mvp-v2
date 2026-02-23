// Cross-cutting types shared across all services

export interface PaginatedRequest {
  page?: number;        // 1-indexed, defaults to 1
  pageSize?: number;    // defaults to 25
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ServiceError {
  code: string;           // machine-readable
  message: string;        // human-readable
  field?: string;         // for validation errors
  retryable: boolean;
}

// Fit score: integer 0–10. Frontend maps to display labels:
// 0–3 = low, 4–6 = moderate, 7–10 = strong
// Label thresholds are a frontend concern and can be adjusted without API changes.
/** @deprecated Use MatchSummary instead. Will be removed in a future release. */
export interface FitAssessment {
  fitScore: number;          // 0–10 integer
  fitRationale: string;
}

// ============================================================
// Unified Matching Model (Spec 16)
// ============================================================

/** Qualitative tier — replaces numeric fit scores */
export type MatchTier = 'strong' | 'moderate' | 'limited';

/** Dimension keys for alignment breakdown */
export type AlignmentDimensionKey =
  | 'goals_priorities'
  | 'student_population'
  | 'budget_capacity'
  | 'academic_need'
  | 'competitive_landscape';

/** One dimension of a match assessment */
export interface AlignmentDimension {
  key: AlignmentDimensionKey;
  tier: MatchTier;
  signals: string[];          // evidence statements for this dimension
  productConnection: string;  // how the product relates to this dimension
}

/** Unified match summary — replaces FitAssessment */
export interface MatchSummary {
  overallTier: MatchTier;
  headline: string;          // one-line summary, e.g. "Strong alignment on math priorities"
  dimensions: AlignmentDimension[];
  topSignals: string[];      // 2-4 top evidence bullets
}

/** Full product-district match record */
export interface ProductDistrictMatch {
  districtId: string;
  productId: string;
  summary: MatchSummary;
  generatedAt: string;       // ISO 8601
}

/** Multi-product solution assessment — future state (Spec 16 §3.2) */
export interface SolutionMatch {
  districtId: string;
  products: ProductDistrictMatch[];
  combinedTier: MatchTier;
  coverageSummary: string;
  gaps: string[];
  solutionSynthesis: string;
}

export type ContentSource = 'verbatim' | 'constrained' | 'synthesis' | 'hybrid';
export type SectionStatus = 'pending' | 'generating' | 'complete' | 'error';

export type UserRole = 'super-admin' | 'publisher-admin' | 'publisher-rep';

export interface ServiceContext {
  userId: string;
  tenantId: string;
  userRole: UserRole;
  organizationName: string;
}
