import type { MatchTier } from './common';

// Discovery domain types
//
// District directory search, coverage profiles, and product alignment.

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

// ============================================================
// Product Alignment
// ============================================================

/**
 * Qualitative product-district alignment. NOT a numeric score.
 * Expressed as level + evidence signals.
 * See Spec 15 §8 — Guiding Principle alignment.
 */
export interface ProductAlignment {
  level: MatchTier;
  signals: string[];
  primaryConnection: string;
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
