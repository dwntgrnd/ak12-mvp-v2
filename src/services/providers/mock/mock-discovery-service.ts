import type { IDiscoveryService } from '../../interfaces/discovery-service';
import type {
  DiscoveryQueryRequest,
  DiscoveryQueryResponse,
  DirectorySearchRequest,
  DirectorySearchResponse,
  DistrictCoverage,
} from '../../types/discovery';
import {
  DISCOVERY_DIRECTORY,
  DISCOVERY_COVERAGE,
  DISCOVERY_SCENARIOS,
  DISCOVERY_FALLBACK_RESPONSE,
} from './fixtures/discovery';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let queryCounter = 0;

function freshQueryId(): string {
  queryCounter += 1;
  return `mock-query-${Date.now()}-${queryCounter}`;
}

export const mockDiscoveryService: IDiscoveryService = {
  async query(request: DiscoveryQueryRequest): Promise<DiscoveryQueryResponse> {
    if (!request.query || !request.query.trim()) {
      throw { code: 'QUERY_EMPTY', message: 'Query must not be empty', retryable: false };
    }

    await delay(1200 + Math.random() * 800);

    const lowerQuery = request.query.toLowerCase();

    let bestMatch: (typeof DISCOVERY_SCENARIOS)[number] | null = null;
    let bestMatchCount = 0;

    for (const scenario of DISCOVERY_SCENARIOS) {
      const matchCount = scenario.keywords.filter((kw) =>
        lowerQuery.includes(kw.toLowerCase())
      ).length;
      if (matchCount > bestMatchCount) {
        bestMatchCount = matchCount;
        bestMatch = scenario;
      }
    }

    if (!bestMatch || bestMatchCount < 1) {
      return {
        ...DISCOVERY_FALLBACK_RESPONSE,
        queryId: freshQueryId(),
        originalQuery: request.query,
      };
    }

    return {
      ...bestMatch.response,
      queryId: freshQueryId(),
      originalQuery: request.query,
    };
  },

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
