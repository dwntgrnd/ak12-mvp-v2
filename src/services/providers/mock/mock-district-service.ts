import type { IDistrictService } from '../../interfaces/district-service';
import type { PaginatedRequest, PaginatedResponse, FitAssessment, MatchSummary, AlignmentDimension, MatchTier } from '../../types/common';
import type {
  DistrictSummary,
  DistrictProfile,
  DistrictSearchRequest,
  FilterFacet,
  SavedDistrict,
  ExclusionReason,
  ExcludedDistrict,
} from '../../types/district';
import { MOCK_DISTRICTS, getMockDistrictListItems, getMockCountyFilters } from './fixtures/districts';
import { PRODUCT_RELEVANCE_MAPS, DISCOVERY_COVERAGE } from './fixtures/discovery';
import { buildSnapshot } from './snapshot-builder';

function delay(ms: number = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const savedDistricts: Map<string, SavedDistrict> = new Map();

export const mockDistrictService: IDistrictService = {
  async searchDistricts(request: DistrictSearchRequest): Promise<PaginatedResponse<DistrictSummary>> {
    await delay(300);

    let results = getMockDistrictListItems();

    // Text search: match name or location (case-insensitive substring)
    if (request.searchQuery) {
      const q = request.searchQuery.toLowerCase();
      results = results.filter(
        (d) =>
          d.name.toLowerCase().includes(q) ||
          d.location.toLowerCase().includes(q)
      );
    }

    // Filter by county
    if (request.filters?.county && typeof request.filters.county === 'string') {
      results = results.filter((d) => d.county === request.filters!.county);
    }

    // Filter by enrollment band
    if (request.filters?.enrollmentBand && typeof request.filters.enrollmentBand === 'string') {
      const band = request.filters.enrollmentBand;
      results = results.filter((d) => {
        switch (band) {
          case 'small': return d.enrollment < 5000;
          case 'medium': return d.enrollment >= 5000 && d.enrollment < 25000;
          case 'large': return d.enrollment >= 25000 && d.enrollment < 100000;
          case 'very-large': return d.enrollment >= 100000;
          default: return true;
        }
      });
    }

    return {
      items: results,
      totalCount: results.length,
      page: 1,
      pageSize: results.length,
      totalPages: 1,
    };
  },

  async getDistrict(districtId: string): Promise<DistrictProfile> {
    await delay(200);
    const district = MOCK_DISTRICTS.find((d) => d.districtId === districtId);
    if (!district) {
      throw { code: 'DISTRICT_NOT_FOUND', message: `District ${districtId} not found`, retryable: false };
    }
    return JSON.parse(JSON.stringify(district));
  },

  async getDistrictFitAssessment(districtId: string, productIds: string[]): Promise<FitAssessment> {
    // Stagger response time: 50-150ms to simulate per-district computation
    await delay(50 + Math.floor(Math.random() * 100));

    const district = MOCK_DISTRICTS.find((d) => d.districtId === districtId);
    if (!district) {
      throw { code: 'DISTRICT_NOT_FOUND', message: `District ${districtId} not found`, retryable: false };
    }

    // Deterministic hash: same district + product always produces same score
    const hashInput = `${districtId}:${productIds.sort().join(',')}`;
    let hash = 0;
    for (let i = 0; i < hashInput.length; i++) {
      const char = hashInput.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0; // Convert to 32-bit integer
    }
    const fitScore = Math.abs(hash) % 11; // 0–10

    // Generate rationale based on score tier and product
    const productName = productIds[0] === 'prod-001' ? 'mathematics' : 'ELA';
    let fitRationale: string;
    if (fitScore >= 7) {
      fitRationale = `Strong alignment with district ${productName} priorities and student population needs.`;
    } else if (fitScore >= 4) {
      fitRationale = `Moderate alignment with district ${productName} goals. Some areas of opportunity.`;
    } else {
      fitRationale = `Limited alignment with current district ${productName} priorities based on available data.`;
    }

    return { fitScore, fitRationale };
  },

  async getMatchSummaries(productId: string, districtIds: string[]): Promise<Record<string, MatchSummary>> {
    await delay(100 + Math.floor(Math.random() * 100));

    const productMap = PRODUCT_RELEVANCE_MAPS[productId];
    const result: Record<string, MatchSummary> = {};

    for (const districtId of districtIds) {
      const district = MOCK_DISTRICTS.find((d) => d.districtId === districtId);
      if (!district) continue;

      const alignment = productMap?.[districtId];

      if (alignment) {
        const coverage = DISCOVERY_COVERAGE[districtId];
        const overallTier: MatchTier = alignment.level;

        const dimensions: AlignmentDimension[] = [
          {
            key: 'goals_priorities',
            tier: overallTier,
            signals: [alignment.signals[0]],
            productConnection: 'Product focus areas align with district strategic goals.',
          },
          {
            key: 'student_population',
            tier: overallTier === 'limited' ? 'limited' : 'moderate',
            signals: [`${district.totalEnrollment.toLocaleString()} students enrolled across ${district.name}.`],
            productConnection: 'Product target population overlaps with district demographics.',
          },
          {
            key: 'budget_capacity',
            tier: coverage?.categories.find((c) => c.category === 'budget_funding')?.level === 1 ? 'strong' : 'moderate',
            signals: [alignment.signals.length > 1 ? alignment.signals[1] : 'Budget data available through LCAP filings.'],
            productConnection: 'Product price point aligns with available funding sources.',
          },
        ];

        const competitiveCoverage = coverage?.categories.find((c) => c.category === 'competitive_landscape');
        if (competitiveCoverage && competitiveCoverage.level <= 3) {
          dimensions.push({
            key: 'competitive_landscape',
            tier: competitiveCoverage.level === 1 ? 'strong' : competitiveCoverage.level === 2 ? 'moderate' : 'limited',
            signals: [competitiveCoverage.note || 'Competitive landscape data available.'],
            productConnection: 'Product positioning relative to current vendor landscape.',
          });
        }

        result[districtId] = {
          overallTier,
          headline: alignment.primaryConnection,
          dimensions,
          topSignals: alignment.signals,
        };
      } else {
        // Fallback: deterministic hash for districts not in PRODUCT_RELEVANCE_MAPS
        const hashInput = `${districtId}:${productId}`;
        let hash = 0;
        for (let i = 0; i < hashInput.length; i++) {
          const char = hashInput.charCodeAt(i);
          hash = ((hash << 5) - hash) + char;
          hash |= 0;
        }
        const fitScore = Math.abs(hash) % 11;
        const overallTier: MatchTier = fitScore >= 7 ? 'strong' : fitScore >= 4 ? 'moderate' : 'limited';
        const productName = productId === 'prod-001' ? 'mathematics' : 'ELA';

        result[districtId] = {
          overallTier,
          headline: `${overallTier === 'strong' ? 'Strong' : overallTier === 'moderate' ? 'Moderate' : 'Limited'} alignment with district ${productName} priorities`,
          dimensions: [
            { key: 'goals_priorities', tier: overallTier, signals: [`District ${productName} goals ${overallTier === 'limited' ? 'do not closely ' : ''}align with product focus.`], productConnection: `Product addresses district ${productName} priorities.` },
            { key: 'student_population', tier: 'moderate', signals: ['Student demographics suggest moderate opportunity.'], productConnection: 'Product target population overlaps with district demographics.' },
          ],
          topSignals: [
            `District prioritizes ${productName} improvement in strategic plan.`,
            `${district.totalEnrollment.toLocaleString()} students enrolled.`,
          ],
        };
      }
    }

    return result;
  },

  async getAvailableFilters(): Promise<FilterFacet[]> {
    await delay(100);
    return [getMockCountyFilters()];
  },

  async saveDistrict(districtId: string): Promise<SavedDistrict> {
    await delay(200);
    const district = MOCK_DISTRICTS.find((d) => d.districtId === districtId);
    if (!district) {
      throw { code: 'DISTRICT_NOT_FOUND', message: `District ${districtId} not found`, retryable: false };
    }
    const saved: SavedDistrict = {
      districtId: district.districtId,
      snapshot: buildSnapshot(district),
      savedAt: new Date().toISOString(),
    };
    savedDistricts.set(districtId, saved);
    return saved;
  },

  async getSavedDistricts(_pagination?: PaginatedRequest): Promise<PaginatedResponse<SavedDistrict>> {
    await delay(100);
    const items = Array.from(savedDistricts.values());
    return { items, totalCount: items.length, page: 1, pageSize: items.length, totalPages: 1 };
  },

  async removeSavedDistrict(districtId: string): Promise<void> {
    await delay(100);
    if (!savedDistricts.has(districtId)) {
      throw { code: 'NOT_SAVED', message: `District ${districtId} is not saved`, retryable: false };
    }
    savedDistricts.delete(districtId);
  },

  async excludeDistrict(_districtId: string, _reason: ExclusionReason): Promise<ExcludedDistrict> {
    throw { code: 'NOT_IMPLEMENTED', message: 'Not available in mock provider', retryable: false };
  },

  async restoreDistrict(_districtId: string): Promise<void> {
    throw { code: 'NOT_IMPLEMENTED', message: 'Not available in mock provider', retryable: false };
  },
};
