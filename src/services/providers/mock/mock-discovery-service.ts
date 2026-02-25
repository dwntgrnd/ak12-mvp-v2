import type { IDiscoveryService } from '../../interfaces/discovery-service';
import type {
  DirectorySearchRequest,
  DirectorySearchResponse,
  DistrictCoverage,
} from '../../types/discovery';
import {
  DISCOVERY_DIRECTORY,
  DISCOVERY_COVERAGE,
} from './fixtures/discovery';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockDiscoveryService: IDiscoveryService = {
  async searchDirectory(request: DirectorySearchRequest): Promise<DirectorySearchResponse> {
    if (!request.query || !request.query.trim()) {
      throw { code: 'QUERY_EMPTY', message: 'Search query must not be empty', retryable: false };
    }

    await delay(100);

    const lowerQuery = request.query.toLowerCase();
    const limit = request.limit ?? 8;

    const allMatches = DISCOVERY_DIRECTORY.filter((entry) =>
      entry.name.toLowerCase().includes(lowerQuery)
    );

    const matches = allMatches.slice(0, limit);

    return {
      matches,
      hasMore: allMatches.length > limit,
    };
  },

  async getCoverage(districtId: string): Promise<DistrictCoverage> {
    await delay(50);

    const coverage = DISCOVERY_COVERAGE[districtId];
    if (!coverage) {
      throw { code: 'DISTRICT_NOT_FOUND', message: `Coverage not found for district ${districtId}`, retryable: false };
    }

    return coverage;
  },
};
