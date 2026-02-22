import type { DistrictSnapshot } from '@/services/types/district';
import type { DistrictProfile } from '@/services/types/district';

/**
 * Build a DistrictSnapshot from a DistrictProfile (mock fixture).
 * Calculates derived fields (frpmPercent) from raw counts.
 * Missing data falls back to 0 — every district gets a snapshot.
 */
export function buildSnapshot(district: DistrictProfile): DistrictSnapshot {
  return {
    districtId: district.districtId,
    name: district.name,
    city: district.city ?? '',
    county: district.county,
    state: district.state,
    docType: district.docType ?? 'Unified',
    lowGrade: district.lowGrade ?? 'K',
    highGrade: district.highGrade ?? '12',
    totalEnrollment: district.totalEnrollment,
    frpmPercent: calculateFrpmPercent(district),
    ellPercent: district.ellPercentage ?? 0,
    elaProficiency: district.elaProficiency ?? 0,
    mathProficiency: district.mathProficiency ?? 0,
  };
}

function calculateFrpmPercent(district: DistrictProfile): number {
  if (
    district.frpmCount != null &&
    district.frpmEnrollment != null &&
    district.frpmEnrollment > 0
  ) {
    return Math.round((district.frpmCount / district.frpmEnrollment) * 100);
  }
  return 0;
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
