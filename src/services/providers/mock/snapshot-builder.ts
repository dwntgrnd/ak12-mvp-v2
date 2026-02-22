import type { DistrictSnapshot } from '@/services/types/district';
import type { DistrictProfile } from '@/services/types/district';

/**
 * Build a DistrictSnapshot from a DistrictProfile (mock fixture).
 * Calculates derived fields (frpmPercent) from raw counts.
 * Missing data falls back to 0 — every district gets a snapshot.
 */
export function buildSnapshot(district: DistrictProfile): DistrictSnapshot {
  const snapshot: DistrictSnapshot = {
    districtId: district.districtId,
    name: district.name,
    city: district.city ?? '',
    county: district.county,
    state: district.state,
    docType: normalizeDocType(district.docType),
    lowGrade: district.lowGrade ?? 'K',
    highGrade: district.highGrade ?? '12',
    totalEnrollment: district.totalEnrollment,
    frpmPercent: calculateFrpmPercent(district),
    ellPercent: calculateEllPercent(district),
    elaProficiency: district.elaProficiency ?? 0,
    mathProficiency: district.mathProficiency ?? 0,
  };

  if (process.env.NODE_ENV === 'development') {
    if (snapshot.frpmPercent > 100) {
      console.warn(`[snapshot-builder] ${district.name}: frpmPercent=${snapshot.frpmPercent} exceeds 100%`);
    }
    if (snapshot.ellPercent > 100) {
      console.warn(`[snapshot-builder] ${district.name}: ellPercent=${snapshot.ellPercent} exceeds 100%`);
    }
  }

  return snapshot;
}

function calculateEllPercent(district: DistrictProfile): number {
  // If ellPercentage is already a valid percentage, use it directly
  if (district.ellPercentage != null && district.ellPercentage >= 0 && district.ellPercentage <= 100) {
    return Math.round(district.ellPercentage * 10) / 10;
  }
  // Otherwise derive from absolute counts
  if (district.totalEll != null && district.totalEnrollment > 0) {
    return Math.round((district.totalEll / district.totalEnrollment) * 1000) / 10;
  }
  return 0;
}

function calculateFrpmPercent(district: DistrictProfile): number {
  if (district.frpmCount != null && district.totalEnrollment > 0) {
    const pct = (district.frpmCount / district.totalEnrollment) * 100;
    return Math.round(Math.min(Math.max(pct, 0), 100) * 10) / 10;
  }
  return 0;
}

function normalizeDocType(raw?: string): string {
  if (!raw) return 'Unified';
  if (raw.includes('County Office')) return 'County Office';
  if (raw.includes('Elementary')) return 'Elementary';
  if (raw.includes('High')) return 'High School';
  return 'Unified';
}

/**
 * Build a stub DistrictSnapshot for districts not present in MOCK_DISTRICTS
 * (e.g., Sacramento-area stubs used in discovery scenarios).
 */
export function buildStubSnapshot(opts: {
  districtId: string;
  name: string;
  city: string;
  county: string;
  state: string;
  enrollment: number;
}): DistrictSnapshot {
  return {
    districtId: opts.districtId,
    name: opts.name,
    city: opts.city,
    county: opts.county,
    state: opts.state,
    docType: 'Unified',
    lowGrade: 'K',
    highGrade: '12',
    totalEnrollment: opts.enrollment,
    // Stub districts lack FRPM/ELL/proficiency data — use 0 placeholders
    frpmPercent: 0,
    ellPercent: 0,
    elaProficiency: 0,
    mathProficiency: 0,
  };
}
