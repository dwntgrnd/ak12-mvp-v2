// District service implementation

import { prisma } from '@/lib/prisma';
import type { PaginatedResponse, FitAssessment } from './types/common';
import type {
  DistrictSummary,
  DistrictProfile,
  DistrictSearchRequest,
  FilterFacet,
  FilterOption,
  SavedDistrict,
  ExclusionReason,
  ExcludedDistrict
} from './types/district';
import { EXCLUSION_CATEGORIES } from './types/controlled-vocabulary';

/**
 * Search districts with optional filters and pagination
 */
export async function searchDistricts(
  request: DistrictSearchRequest
): Promise<PaginatedResponse<DistrictSummary>> {
  const {
    searchQuery,
    filters = {},
    page = 1,
    pageSize = 25,
    includeExcluded = false
  } = request;

  // Build where clause
  const where: any = {};

  // Search by name
  if (searchQuery) {
    where.name = {
      contains: searchQuery,
      mode: 'insensitive'
    };
  }

  // Apply filters
  if (filters.county) {
    const counties = Array.isArray(filters.county) ? filters.county : [filters.county];
    where.county = { in: counties };
  }

  if (filters.enrollmentMin !== undefined) {
    where.enrollment = {
      ...where.enrollment,
      gte: Number(filters.enrollmentMin)
    };
  }

  if (filters.enrollmentMax !== undefined) {
    where.enrollment = {
      ...where.enrollment,
      lte: Number(filters.enrollmentMax)
    };
  }

  // Note: includeExcluded filtering is deferred to Phase 4 when user context is available

  // Calculate pagination
  const skip = (page - 1) * pageSize;
  const take = Math.min(pageSize, 100); // max 100 items per page

  // Execute queries in parallel
  const [items, totalCount] = await Promise.all([
    prisma.district.findMany({
      where,
      skip,
      take,
      select: {
        id: true,
        name: true,
        location: true,
        enrollment: true
      },
      orderBy: {
        name: 'asc'
      }
    }),
    prisma.district.count({ where })
  ]);

  // Map to DistrictSummary
  const summaries: DistrictSummary[] = items.map(item => ({
    districtId: item.id,
    name: item.name,
    location: item.location,
    enrollment: item.enrollment
  }));

  const totalPages = Math.ceil(totalCount / pageSize);

  return {
    items: summaries,
    totalCount,
    page,
    pageSize,
    totalPages
  };
}

/**
 * Get full district profile by ID
 */
export async function getDistrict(districtId: string): Promise<DistrictProfile> {
  const district = await prisma.district.findUnique({
    where: { id: districtId }
  });

  if (!district) {
    const error: any = new Error('District not found');
    error.code = 'DISTRICT_NOT_FOUND';
    throw error;
  }

  // Map to DistrictProfile
  const profile: DistrictProfile = {
    districtId: district.id,
    name: district.name,
    location: district.location,
    county: district.county,
    enrollment: district.enrollment,
    demographics: district.demographics as Record<string, number>,
    proficiency: district.proficiency as Record<string, number>,
    funding: district.funding as Record<string, number>,
    additionalData: (district.additionalData as Record<string, unknown>) || {}
  };

  return profile;
}

/**
 * Get available filter facets from district data
 */
export async function getAvailableFilters(): Promise<FilterFacet[]> {
  // Get county facet (grouped by county with counts)
  const countyData = await prisma.district.groupBy({
    by: ['county'],
    _count: {
      county: true
    },
    orderBy: {
      _count: {
        county: 'desc'
      }
    }
  });

  const countyOptions: FilterOption[] = countyData.map(item => ({
    value: item.county,
    label: item.county,
    count: item._count.county
  }));

  // Get enrollment range facet
  const enrollmentData = await prisma.district.aggregate({
    _min: {
      enrollment: true
    },
    _max: {
      enrollment: true
    }
  });

  const facets: FilterFacet[] = [
    {
      filterName: 'county',
      filterLabel: 'County',
      filterType: 'multi-select',
      options: countyOptions
    },
    {
      filterName: 'enrollment',
      filterLabel: 'Enrollment',
      filterType: 'range',
      range: {
        min: enrollmentData._min.enrollment || 0,
        max: enrollmentData._max.enrollment || 100000,
        step: 1000
      }
    }
  ];

  return facets;
}

/**
 * Get fit assessment for district with given products
 */
export async function getDistrictFitAssessment(
  districtId: string,
  productIds: string[]
): Promise<FitAssessment> {
  // Get district profile
  const district = await getDistrict(districtId);

  // Get products
  const products = await prisma.product.findMany({
    where: {
      id: { in: productIds },
      isDeleted: false
    },
    select: {
      id: true,
      name: true,
      targetChallenges: true,
      subjectArea: true
    }
  });

  if (products.length === 0) {
    const error: any = new Error('No matching products found');
    error.code = 'PRODUCT_NOT_FOUND';
    throw error;
  }

  // Simple heuristic fit assessment
  const proficiency = district.proficiency;

  // Calculate average proficiency across Math, ELA, Science
  const proficiencyKeys = ['Math', 'ELA', 'Science'];
  const proficiencyValues = proficiencyKeys
    .map(key => proficiency[key])
    .filter((val): val is number => typeof val === 'number');

  const avgProficiency = proficiencyValues.length > 0
    ? proficiencyValues.reduce((sum, val) => sum + val, 0) / proficiencyValues.length
    : 50; // default to middle if no data

  // Check product characteristics
  const productTargets = products.flatMap(p => p.targetChallenges || []);
  const hasIntervention = productTargets.some(t =>
    t.toLowerCase().includes('intervention') ||
    t.toLowerCase().includes('sel') ||
    t.toLowerCase().includes('struggling')
  );
  const hasEnrichment = productTargets.some(t =>
    t.toLowerCase().includes('enrichment') ||
    t.toLowerCase().includes('advanced') ||
    t.toLowerCase().includes('stem')
  );

  // Determine fit category and rationale
  let fitCategory: 'strong' | 'moderate' | 'low';
  let fitRationale: string;

  if (avgProficiency < 35 && hasIntervention) {
    fitCategory = 'strong';
    fitRationale = `Strong fit: District shows low proficiency (${avgProficiency.toFixed(1)}% average) and your intervention-focused products directly address this need. Large enrollment (${district.enrollment.toLocaleString()}) provides significant opportunity.`;
  } else if (avgProficiency > 50 && hasEnrichment) {
    fitCategory = 'strong';
    fitRationale = `Strong fit: District shows strong proficiency (${avgProficiency.toFixed(1)}% average), making it ideal for enrichment and advanced learning products. Enrollment of ${district.enrollment.toLocaleString()} students represents solid market potential.`;
  } else if (district.enrollment > 50000) {
    fitCategory = 'moderate';
    fitRationale = `Moderate fit: Large district (${district.enrollment.toLocaleString()} students) offers scale opportunity. Average proficiency of ${avgProficiency.toFixed(1)}% suggests general market potential, though product alignment could be stronger.`;
  } else if (district.enrollment > 10000) {
    fitCategory = 'moderate';
    fitRationale = `Moderate fit: Mid-sized district (${district.enrollment.toLocaleString()} students) with ${avgProficiency.toFixed(1)}% average proficiency. Represents a viable opportunity with moderate scale.`;
  } else {
    fitCategory = 'low';
    fitRationale = `Limited fit: Smaller district (${district.enrollment.toLocaleString()} students) with ${avgProficiency.toFixed(1)}% average proficiency. Consider prioritizing larger districts for better ROI.`;
  }

  return {
    fitCategory,
    fitRationale
  };
}

/**
 * Save a district for a user
 */
export async function saveDistrict(
  userId: string,
  districtId: string
): Promise<SavedDistrict> {
  // Verify district exists
  const district = await prisma.district.findUnique({
    where: { id: districtId }
  });

  if (!district) {
    const error: any = new Error('District not found');
    error.code = 'DISTRICT_NOT_FOUND';
    throw error;
  }

  try {
    // Create saved district record
    const savedRecord = await prisma.savedDistrict.create({
      data: {
        userId,
        districtId
      },
      include: {
        district: true
      }
    });

    // Map to SavedDistrict type
    return {
      districtId: savedRecord.districtId,
      name: savedRecord.district.name,
      location: savedRecord.district.location,
      enrollment: savedRecord.district.enrollment,
      savedAt: savedRecord.savedAt.toISOString()
    };
  } catch (error: any) {
    // Handle unique constraint violation (already saved)
    if (error.code === 'P2002') {
      // Fetch and return existing record
      const existing = await prisma.savedDistrict.findUnique({
        where: {
          userId_districtId: { userId, districtId }
        },
        include: {
          district: true
        }
      });

      if (existing) {
        return {
          districtId: existing.districtId,
          name: existing.district.name,
          location: existing.district.location,
          enrollment: existing.district.enrollment,
          savedAt: existing.savedAt.toISOString()
        };
      }
    }

    throw error;
  }
}

/**
 * Get all saved districts for a user
 */
export async function getSavedDistricts(userId: string): Promise<SavedDistrict[]> {
  const records = await prisma.savedDistrict.findMany({
    where: { userId },
    include: {
      district: true
    },
    orderBy: {
      savedAt: 'desc'
    }
  });

  return records.map(record => ({
    districtId: record.districtId,
    name: record.district.name,
    location: record.district.location,
    enrollment: record.district.enrollment,
    savedAt: record.savedAt.toISOString()
  }));
}

/**
 * Remove a saved district for a user
 */
export async function removeSavedDistrict(
  userId: string,
  districtId: string
): Promise<void> {
  try {
    await prisma.savedDistrict.delete({
      where: {
        userId_districtId: { userId, districtId }
      }
    });
  } catch (error: any) {
    // Handle record not found
    if (error.code === 'P2025') {
      const notSavedError: any = new Error('District is not saved');
      notSavedError.code = 'NOT_SAVED';
      throw notSavedError;
    }
    throw error;
  }
}

/**
 * Exclude a district with a categorized reason
 */
export async function excludeDistrict(
  userId: string,
  districtId: string,
  reason: ExclusionReason
): Promise<ExcludedDistrict> {
  // Validate category
  if (!EXCLUSION_CATEGORIES.includes(reason.category as any)) {
    const error: any = new Error('Invalid exclusion category');
    error.code = 'INVALID_CATEGORY';
    throw error;
  }

  // Verify district exists
  const district = await prisma.district.findUnique({
    where: { id: districtId }
  });

  if (!district) {
    const error: any = new Error('District not found');
    error.code = 'DISTRICT_NOT_FOUND';
    throw error;
  }

  try {
    // Create excluded district record
    const excludedRecord = await prisma.excludedDistrict.create({
      data: {
        userId,
        districtId,
        category: reason.category,
        note: reason.note
      },
      include: {
        district: true
      }
    });

    // Cleanup: remove from saved districts if it was saved (silent)
    await prisma.savedDistrict.deleteMany({
      where: { userId, districtId }
    });

    // Map to ExcludedDistrict type
    return {
      districtId: excludedRecord.districtId,
      districtName: excludedRecord.district.name,
      reason: {
        category: excludedRecord.category as any,
        note: excludedRecord.note || undefined
      },
      excludedAt: excludedRecord.excludedAt.toISOString()
    };
  } catch (error: any) {
    // Handle unique constraint violation (already excluded)
    if (error.code === 'P2002') {
      const alreadyExcludedError: any = new Error('District is already excluded');
      alreadyExcludedError.code = 'ALREADY_EXCLUDED';
      throw alreadyExcludedError;
    }
    throw error;
  }
}

/**
 * Get all excluded districts for a user
 */
export async function getExcludedDistricts(userId: string): Promise<ExcludedDistrict[]> {
  const records = await prisma.excludedDistrict.findMany({
    where: { userId },
    include: {
      district: true
    },
    orderBy: {
      excludedAt: 'desc'
    }
  });

  return records.map(record => ({
    districtId: record.districtId,
    districtName: record.district.name,
    reason: {
      category: record.category as any,
      note: record.note || undefined
    },
    excludedAt: record.excludedAt.toISOString()
  }));
}

/**
 * Restore an excluded district for a user
 */
export async function restoreDistrict(
  userId: string,
  districtId: string
): Promise<void> {
  try {
    await prisma.excludedDistrict.delete({
      where: {
        userId_districtId: { userId, districtId }
      }
    });
  } catch (error: any) {
    // Handle record not found
    if (error.code === 'P2025') {
      const notExcludedError: any = new Error('District is not excluded');
      notExcludedError.code = 'NOT_EXCLUDED';
      throw notExcludedError;
    }
    throw error;
  }
}
