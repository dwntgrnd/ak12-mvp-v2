// DistrictService interface

import type { PaginatedRequest, PaginatedResponse, FitAssessment, MatchSummary } from '../types/common';
import type {
  DistrictSummary,
  DistrictProfile,
  DistrictSearchRequest,
  FilterFacet,
  SavedDistrict,
  ExclusionReason,
  ExcludedDistrict
} from '../types/district';

export interface IDistrictService {
  // Authorization: publisher-admin, publisher-rep
  // Errors: INVALID_FILTER
  // Exclusions are org-wide (shared within tenant).
  // Use exclusionStatus='excluded_only' to list excluded districts (replaces getExcludedDistricts).
  searchDistricts(request: DistrictSearchRequest): Promise<PaginatedResponse<DistrictSummary>>;

  // Authorization: publisher-admin, publisher-rep
  // Errors: DISTRICT_NOT_FOUND
  getDistrict(districtId: string): Promise<DistrictProfile>;

  // Authorization: publisher-admin, publisher-rep
  // Errors: DISTRICT_NOT_FOUND, PRODUCT_NOT_FOUND
  /** @deprecated Use getMatchSummaries instead */
  getDistrictFitAssessment(districtId: string, productIds: string[]): Promise<FitAssessment>;

  // Authorization: publisher-admin, publisher-rep
  // Errors: DISTRICT_NOT_FOUND, PRODUCT_NOT_FOUND
  // Batch: returns match summaries for multiple districts against a single product.
  // Used by discovery, saved districts, and other list surfaces.
  // Districts not found or without matching data are omitted from the result.
  getMatchSummaries(productId: string, districtIds: string[]): Promise<Record<string, MatchSummary>>;

  // Authorization: publisher-admin, publisher-rep
  getAvailableFilters(): Promise<FilterFacet[]>;

  // Authorization: publisher-admin, publisher-rep
  saveDistrict(districtId: string): Promise<SavedDistrict>;

  // Authorization: publisher-admin, publisher-rep
  getSavedDistricts(pagination?: PaginatedRequest): Promise<PaginatedResponse<SavedDistrict>>;

  // Authorization: publisher-admin, publisher-rep
  // Errors: DISTRICT_NOT_FOUND, NOT_SAVED
  removeSavedDistrict(districtId: string): Promise<void>;

  // Authorization: publisher-admin, publisher-rep
  // Exclusions are org-wide (shared within tenant). excludedBy is set automatically.
  // Errors: DISTRICT_NOT_FOUND, ALREADY_EXCLUDED
  excludeDistrict(districtId: string, reason: ExclusionReason): Promise<ExcludedDistrict>;

  // Authorization: publisher-admin, publisher-rep
  // Any user in the tenant can restore any exclusion.
  // Errors: DISTRICT_NOT_FOUND, NOT_EXCLUDED
  restoreDistrict(districtId: string): Promise<void>;
}
