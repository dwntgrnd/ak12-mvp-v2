// DistrictService interface

import type { PaginatedResponse, FitAssessment } from '../types/common';
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
  searchDistricts(request: DistrictSearchRequest): Promise<PaginatedResponse<DistrictSummary>>;

  // Authorization: publisher-admin, publisher-rep
  // Errors: DISTRICT_NOT_FOUND
  getDistrict(districtId: string): Promise<DistrictProfile>;

  // Authorization: publisher-admin, publisher-rep
  // Errors: DISTRICT_NOT_FOUND, PRODUCT_NOT_FOUND
  getDistrictFitAssessment(districtId: string, productIds: string[]): Promise<FitAssessment>;

  // Authorization: publisher-admin, publisher-rep
  getAvailableFilters(): Promise<FilterFacet[]>;

  // Authorization: publisher-admin, publisher-rep
  saveDistrict(districtId: string): Promise<SavedDistrict>;

  // Authorization: publisher-admin, publisher-rep
  getSavedDistricts(): Promise<SavedDistrict[]>;

  // Authorization: publisher-admin, publisher-rep
  // Errors: DISTRICT_NOT_FOUND, NOT_SAVED
  removeSavedDistrict(districtId: string): Promise<void>;

  // Authorization: publisher-admin, publisher-rep
  // Errors: DISTRICT_NOT_FOUND, ALREADY_EXCLUDED
  excludeDistrict(districtId: string, reason: ExclusionReason): Promise<ExcludedDistrict>;

  // Authorization: publisher-admin, publisher-rep
  getExcludedDistricts(): Promise<ExcludedDistrict[]>;

  // Authorization: publisher-admin, publisher-rep
  // Errors: DISTRICT_NOT_FOUND, NOT_EXCLUDED
  restoreDistrict(districtId: string): Promise<void>;
}
