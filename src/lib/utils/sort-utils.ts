// Pure sort + filter utilities for district listings (no React)

import type { DistrictSnapshot } from '@/services/types/district';
import type { ProductAlignment } from '@/services/types/discovery';
import type { ActiveSort } from '@/components/shared/list-context-config';

/* ------------------------------------------------------------------ */
/*  Types for entries with snapshot                                    */
/* ------------------------------------------------------------------ */

interface HasSnapshot {
  name: string;
  snapshot: DistrictSnapshot;
}

/* ------------------------------------------------------------------ */
/*  Sort by snapshot field                                             */
/* ------------------------------------------------------------------ */

export function sortBySnapshotField<T extends HasSnapshot>(
  entries: T[],
  activeSort: ActiveSort | null,
): T[] {
  if (!activeSort) return entries;

  const { key, direction } = activeSort;
  const dir = direction === 'asc' ? 1 : -1;
  const sorted = [...entries];

  switch (key) {
    case 'name':
      return sorted.sort((a, b) => dir * a.name.localeCompare(b.name));
    case 'enrollment':
      return sorted.sort((a, b) => dir * (a.snapshot.totalEnrollment - b.snapshot.totalEnrollment));
    case 'frpm':
      return sorted.sort((a, b) => dir * (a.snapshot.frpmPercent - b.snapshot.frpmPercent));
    case 'ell':
      return sorted.sort((a, b) => dir * (a.snapshot.ellPercent - b.snapshot.ellPercent));
    case 'academic':
      // Default to ELA; caller can use academicOverride for math
      return sorted.sort((a, b) => dir * (a.snapshot.elaProficiency - b.snapshot.elaProficiency));
    case 'alignment':
      return sortByAlignment(sorted, dir);
    default:
      return sorted;
  }
}

/* ------------------------------------------------------------------ */
/*  Alignment sort helper                                              */
/* ------------------------------------------------------------------ */

const ALIGNMENT_RANK: Record<string, number> = { strong: 3, moderate: 2, limited: 1 };

function sortByAlignment<T extends HasSnapshot>(entries: T[], dir: number): T[] {
  return [...entries].sort((a, b) => {
    const aLevel = (a as T & { productAlignment?: ProductAlignment }).productAlignment?.level;
    const bLevel = (b as T & { productAlignment?: ProductAlignment }).productAlignment?.level;
    const aRank = aLevel ? (ALIGNMENT_RANK[aLevel] ?? 0) : 0;
    const bRank = bLevel ? (ALIGNMENT_RANK[bLevel] ?? 0) : 0;
    return dir * (aRank - bRank);
  });
}

/* ------------------------------------------------------------------ */
/*  Filter by snapshot fields                                          */
/* ------------------------------------------------------------------ */

function parseGradeNum(grade: string): number {
  if (grade === 'K' || grade === 'KN') return 0;
  if (grade === 'PK' || grade === 'P') return -1;
  const n = parseInt(grade, 10);
  return isNaN(n) ? -1 : n;
}

function matchesGradeBand(snapshot: DistrictSnapshot, band: string): boolean {
  const low = parseGradeNum(snapshot.lowGrade);
  const high = parseGradeNum(snapshot.highGrade);

  switch (band) {
    case 'elementary':
      return low <= 0 && high <= 6;
    case 'middle':
      return low >= 5 && high <= 8;
    case 'high':
      return low >= 9 && high <= 12;
    case 'unified':
      return low <= 0 && high >= 12;
    default:
      return false;
  }
}

function matchesEnrollmentRange(enrollment: number, range: string): boolean {
  switch (range) {
    case '0-1000':
      return enrollment < 1000;
    case '1000-5000':
      return enrollment >= 1000 && enrollment < 5000;
    case '5000-20000':
      return enrollment >= 5000 && enrollment < 20000;
    case '20000-50000':
      return enrollment >= 20000 && enrollment < 50000;
    case '50000+':
      return enrollment >= 50000;
    default:
      return false;
  }
}

export function filterBySnapshot<T extends HasSnapshot>(
  entries: T[],
  filterValues: Record<string, string[]>,
): T[] {
  let result = entries;

  const districtTypes = filterValues['districtType'];
  if (districtTypes?.length) {
    result = result.filter((e) => districtTypes.includes(e.snapshot.docType));
  }

  const enrollmentRanges = filterValues['enrollmentRange'];
  if (enrollmentRanges?.length) {
    result = result.filter((e) =>
      enrollmentRanges.some((range) =>
        matchesEnrollmentRange(e.snapshot.totalEnrollment, range),
      ),
    );
  }

  const gradeBands = filterValues['gradeBand'];
  if (gradeBands?.length) {
    result = result.filter((e) =>
      gradeBands.some((band) => matchesGradeBand(e.snapshot, band)),
    );
  }

  const alignmentLevels = filterValues['alignmentLevel'];
  if (alignmentLevels?.length) {
    result = result.filter((e) => {
      const level = (e as T & { productAlignment?: ProductAlignment }).productAlignment?.level;
      return level ? alignmentLevels.includes(level) : false;
    });
  }

  return result;
}

/* ------------------------------------------------------------------ */
/*  Map sort key to display label                                      */
/* ------------------------------------------------------------------ */

export function mapSortKeyToLabel(
  key: string,
  academicOverride?: 'math' | 'ela',
): string {
  switch (key) {
    case 'name':
      return 'Name';
    case 'enrollment':
      return 'Enrollment';
    case 'frpm':
      return 'FRPM';
    case 'ell':
      return 'ELL';
    case 'academic':
      return academicOverride === 'math' ? 'Math Prof.' : 'ELA Prof.';
    case 'alignment':
      return 'Alignment';
    default:
      return key;
  }
}
