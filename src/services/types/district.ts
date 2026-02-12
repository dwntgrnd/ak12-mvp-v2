// DistrictService domain types

import type { FitAssessment } from './common';
import type { ExclusionCategory } from './controlled-vocabulary';

export interface DistrictSummary {
  districtId: string;
  name: string;
  location: string;          // city/county, human-readable
  enrollment: number;
}

export interface DistrictProfile {
  districtId: string;
  name: string;
  location: string;
  county: string;
  enrollment: number;
  demographics: Record<string, number>;
  proficiency: Record<string, number>;
  funding: Record<string, number>;
  additionalData: Record<string, unknown>;
  fitAssessment?: FitAssessment;   // populated only after product selection
}

export interface DistrictSearchRequest {
  searchQuery?: string;
  filters?: Record<string, string | number | string[]>;
  includeExcluded?: boolean;   // defaults to false
  page?: number;
  pageSize?: number;
}

export interface FilterFacet {
  filterName: string;
  filterLabel: string;
  filterType: 'range' | 'select' | 'multi-select';
  options?: FilterOption[];
  range?: {
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
  name: string;
  location: string;
  enrollment: number;
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
  excludedAt: string;         // ISO 8601
}
