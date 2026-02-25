// DiscoveryService interface

import type {
  DirectorySearchRequest,
  DirectorySearchResponse,
  DistrictCoverage,
} from '../types/discovery';

export interface IDiscoveryService {
  /**
   * Fuzzy search against the district directory for autocomplete.
   * Returns lightweight entries (name, county, state, id).
   *
   * Mock: substring match against fixture directory.
   * API: lightweight lookup against district name index.
   *
   * Errors: QUERY_EMPTY
   */
  searchDirectory(request: DirectorySearchRequest): Promise<DirectorySearchResponse>;

  /**
   * Get coverage profile for a district.
   * Returns per-category confidence levels.
   *
   * Mock: fixture lookup by districtId.
   * API: coverage index query.
   *
   * Errors: DISTRICT_NOT_FOUND
   */
  getCoverage(districtId: string): Promise<DistrictCoverage>;
}
