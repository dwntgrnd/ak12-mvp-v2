// DistrictService domain types

import type { FitAssessment, MatchSummary } from './common';
import type { ExclusionCategory } from './controlled-vocabulary';

export interface DistrictSummary {
  districtId: string;
  name: string;
  state: string;             // two-letter abbreviation, e.g. "CA"
  location: string;          // city/county, human-readable
  enrollment: number;
}

/**
 * Lightweight district shape for list contexts.
 * Guaranteed baseline data for district cards — AI-generated content layers on top.
 * See Spec 15 §3 for design rationale.
 */
export interface DistrictSnapshot {
  districtId: string;
  name: string;
  city: string;
  county: string;
  state: string;
  docType: string;         // "Unified", "Elementary", "High School"
  lowGrade: string;        // e.g., "K", "7", "9"
  highGrade: string;       // e.g., "6", "8", "12"
  totalEnrollment: number;
  frpmPercent: number;     // 0–100
  ellPercent: number;      // 0–100
  elaProficiency: number;  // 0–100
  mathProficiency: number; // 0–100
}

export interface DistrictProfile {
  districtId: string;
  name: string;
  cdsCode: string;             // California District/School code, unique identifier
  state: string;               // two-letter abbreviation
  location: string;            // city/county, human-readable (derived: "{city}, {state}")
  county: string;
  street?: string;
  city?: string;
  zip?: string;
  phone?: string;
  website?: string;
  latitude?: number;
  longitude?: number;
  superintendentFirstName?: string;
  superintendentLastName?: string;
  docType?: string;            // district type classification
  statusType?: string;         // operational status
  ncesDistrictId?: string;     // NCES federal identifier

  // --- Per-academic-year data (from DistrictInfo, most recent year) ---
  academicYear: string;        // e.g., "2023-24"
  gradeServed?: string;        // e.g., "K-12"
  lowGrade?: string;
  highGrade?: string;
  numberOfSchools?: number;
  totalEnrollment: number;     // canonical enrollment figure
  studentSpending?: number;    // per-pupil spending

  // Student population
  ellPercentage?: number;      // English Language Learner percentage
  totalEll?: number;           // ELL absolute count
  frpmCount?: number;          // Free/Reduced Price Meals count (poverty indicator)
  frpmEnrollment?: number;     // FRPM denominator for calculating rate
  spedCount?: number;          // Special Education count
  chronicAbsenteeismRate?: number;

  // Academic proficiency
  elaProficiency?: number;     // ELA proficiency percentage
  mathProficiency?: number;    // Math proficiency percentage

  // Catch-all for data not yet explicitly modeled
  additionalData?: Record<string, unknown>;

  // Populated only after product selection
  /** @deprecated Use matchSummary instead */
  fitAssessment?: FitAssessment;
  matchSummary?: MatchSummary;
}

// exclusion_status controls visibility of excluded districts in search results.
// 'not_excluded' = hide excluded (default), 'any' = show all, 'excluded_only' = show only excluded.
export type ExclusionStatus = 'not_excluded' | 'any' | 'excluded_only';

export interface DistrictSearchRequest {
  searchQuery?: string;
  filters?: Record<string, string | number | string[]>;
  exclusionStatus?: ExclusionStatus;   // defaults to 'not_excluded'
  page?: number;
  pageSize?: number;
}

export interface FilterFacet {
  filterName: string;
  filterLabel: string;
  multiValue?: boolean;        // for categorical filters: can multiple values apply simultaneously?
  options?: FilterOption[];    // present for categorical filters
  range?: {                    // present for numeric filters
    min: number;
    max: number;
    step?: number;
  };
}

export interface FilterOption {
  value: string;
  label: string;
  count: number;
}

export interface SavedDistrict {
  districtId: string;
  snapshot: DistrictSnapshot;
  savedAt: string;           // ISO 8601
}

export interface ExclusionReason {
  category: ExclusionCategory;
  note?: string;              // freeform text, especially for 'other'
}

export interface ExcludedDistrict {
  districtId: string;
  districtName: string;
  reason: ExclusionReason;
  excludedBy: {              // org-wide: who performed the exclusion
    userId: string;
    displayName: string;
  };
  excludedAt: string;         // ISO 8601
}
