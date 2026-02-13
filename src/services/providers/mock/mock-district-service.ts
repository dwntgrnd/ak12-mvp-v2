import type { IDistrictService } from '../../interfaces/district-service';
import type { PaginatedRequest, PaginatedResponse, FitAssessment } from '../../types/common';
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
      name: district.name,
      state: district.state,
      location: district.location,
      enrollment: district.totalEnrollment,
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
