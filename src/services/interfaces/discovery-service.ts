// DiscoveryService interface

import type {
  DiscoveryQueryRequest,
  DiscoveryQueryResponse,
  DirectorySearchRequest,
  DirectorySearchResponse,
  DistrictCoverage,
} from '../types/discovery';

export interface IDiscoveryService {
  /**
   * Submit a free-text query to the discovery pipeline.
   * Returns structured response with intent, content, confidence, and chips.
   *
   * Mock: keyword-matched fixture lookup with simulated delay.
   * API: full AI pipeline round-trip.
   *
   * Errors: QUERY_EMPTY, QUERY_TOO_LONG, GENERATION_FAILED
   */
  query(request: DiscoveryQueryRequest): Promise<DiscoveryQueryResponse>;

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
   * Used for: chip evidence gating, format downgrade decisions.
   *
   * Mock: fixture lookup by districtId.
   * API: coverage index query.
   *
   * Errors: DISTRICT_NOT_FOUND
   */
  getCoverage(districtId: string): Promise<DistrictCoverage>;
}
