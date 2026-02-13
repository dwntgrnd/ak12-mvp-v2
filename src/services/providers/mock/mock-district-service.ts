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

function delay(ms: number = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Minimal mock district data — enough to support playbook generation flow.
// Fields match Prisma schema: MasterDistrict + DistrictInfo (most recent year).
// Will be replaced by curated fixture file in Phase 3D.
const MOCK_DISTRICT: DistrictProfile = {
  districtId: 'dist-lausd-001',
  name: 'Los Angeles Unified School District',
  cdsCode: '19-64733',
  state: 'CA',
  location: 'Los Angeles, CA',
  county: 'Los Angeles',
  city: 'Los Angeles',
  zip: '90017',
  phone: '(213) 241-1000',
  website: 'https://www.lausd.net',
  latitude: 34.0522,
  longitude: -118.2437,
  superintendentFirstName: 'Alberto',
  superintendentLastName: 'Carvalho',
  docType: 'Unified School District',
  statusType: 'Active',

  // DistrictInfo — 2023-24 academic year
  academicYear: '2023-24',
  gradeServed: 'K-12',
  lowGrade: 'K',
  highGrade: '12',
  numberOfSchools: 1413,
  totalEnrollment: 422276,
  studentSpending: 18200,
  ellPercentage: 20.1,
  totalEll: 84878,
  frpmCount: 338000,
  frpmEnrollment: 422276,
  spedCount: 63341,
  chronicAbsenteeismRate: 35.2,
  elaProficiency: 42.1,
  mathProficiency: 30.8,
};

export const mockDistrictService: IDistrictService = {
  async searchDistricts(_request: DistrictSearchRequest): Promise<PaginatedResponse<DistrictSummary>> {
    await delay(300);
    // Return the single mock district for now
    return {
      items: [{
        districtId: MOCK_DISTRICT.districtId,
        name: MOCK_DISTRICT.name,
        state: MOCK_DISTRICT.state,
        location: MOCK_DISTRICT.location,
        enrollment: MOCK_DISTRICT.totalEnrollment,
      }],
      totalCount: 1,
      page: 1,
      pageSize: 25,
      totalPages: 1,
    };
  },

  async getDistrict(districtId: string): Promise<DistrictProfile> {
    await delay(200);
    // Return mock district regardless of ID for now
    return JSON.parse(JSON.stringify({ ...MOCK_DISTRICT, districtId }));
  },

  async getDistrictFitAssessment(_districtId: string, _productIds: string[]): Promise<FitAssessment> {
    await delay(500);
    return { fitScore: 7, fitRationale: 'Strong alignment with district priorities.' };
  },

  async getAvailableFilters(): Promise<FilterFacet[]> {
    await delay(100);
    return []; // Stub — populated in Phase 3D
  },

  async saveDistrict(_districtId: string): Promise<SavedDistrict> {
    throw { code: 'NOT_IMPLEMENTED', message: 'Saved districts not available in mock provider', retryable: false };
  },

  async getSavedDistricts(_pagination?: PaginatedRequest): Promise<PaginatedResponse<SavedDistrict>> {
    await delay(100);
    return { items: [], totalCount: 0, page: 1, pageSize: 25, totalPages: 0 };
  },

  async removeSavedDistrict(_districtId: string): Promise<void> {
    throw { code: 'NOT_IMPLEMENTED', message: 'Not available in mock provider', retryable: false };
  },

  async excludeDistrict(_districtId: string, _reason: ExclusionReason): Promise<ExcludedDistrict> {
    throw { code: 'NOT_IMPLEMENTED', message: 'Not available in mock provider', retryable: false };
  },

  async restoreDistrict(_districtId: string): Promise<void> {
    throw { code: 'NOT_IMPLEMENTED', message: 'Not available in mock provider', retryable: false };
  },
};
