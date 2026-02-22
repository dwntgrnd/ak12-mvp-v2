'use client';

import { useState, useMemo, useCallback } from 'react';
import { DistrictListingsContainer } from '@/components/shared/district-listings-container';
import { DistrictListCard } from '@/components/shared/district-list-card';
import type { ListingsToolbarProps, FilterDefinition, SortOption } from '@/components/shared/listings-toolbar';
import type { DistrictSnapshot } from '@/services/types/district';

/* ------------------------------------------------------------------ */
/*  Fixture data                                                       */
/* ------------------------------------------------------------------ */

interface MockDistrict {
  snapshot: DistrictSnapshot;
  county: string;
  enrollmentBand: 'small' | 'medium' | 'large' | 'very-large';
  additionalMetrics: Array<{ label: string; value: string }>;
}

const DISTRICTS: MockDistrict[] = [
  {
    snapshot: {
      districtId: 'sacramento-city-usd',
      name: 'Sacramento City USD',
      city: 'Sacramento',
      county: 'Sacramento',
      state: 'CA',
      docType: 'Unified',
      lowGrade: 'K',
      highGrade: '12',
      totalEnrollment: 42500,
      frpmPercent: 65.3,
      ellPercent: 22.4,
      elaProficiency: 38.1,
      mathProficiency: 29.8,
    },
    county: 'Sacramento',
    enrollmentBand: 'large',
    additionalMetrics: [
      { label: 'Math Proficiency', value: '29.8%' },
      { label: 'ELA Proficiency', value: '38.1%' },
    ],
  },
  {
    snapshot: {
      districtId: 'a2671310-4656-4e43-a91a-7688536f1764',
      name: 'Elk Grove USD',
      city: 'Elk Grove',
      county: 'Sacramento',
      state: 'CA',
      docType: 'Unified',
      lowGrade: 'K',
      highGrade: '12',
      totalEnrollment: 59800,
      frpmPercent: 48.2,
      ellPercent: 18.7,
      elaProficiency: 47.2,
      mathProficiency: 38.4,
    },
    county: 'Sacramento',
    enrollmentBand: 'large',
    additionalMetrics: [
      { label: 'Math Proficiency', value: '38.4%' },
      { label: 'ELA Proficiency', value: '47.2%' },
    ],
  },
  {
    snapshot: {
      districtId: 'twin-rivers-usd',
      name: 'Twin Rivers USD',
      city: 'North Highlands',
      county: 'Sacramento',
      state: 'CA',
      docType: 'Unified',
      lowGrade: 'K',
      highGrade: '12',
      totalEnrollment: 27100,
      frpmPercent: 72.1,
      ellPercent: 19.1,
      elaProficiency: 35.8,
      mathProficiency: 31.2,
    },
    county: 'Sacramento',
    enrollmentBand: 'large',
    additionalMetrics: [
      { label: 'Math Proficiency', value: '31.2%' },
      { label: 'ELA Proficiency', value: '35.8%' },
    ],
  },
  {
    snapshot: {
      districtId: 'natomas-usd',
      name: 'Natomas USD',
      city: 'Sacramento',
      county: 'Sacramento',
      state: 'CA',
      docType: 'Unified',
      lowGrade: 'K',
      highGrade: '12',
      totalEnrollment: 14200,
      frpmPercent: 44.8,
      ellPercent: 16.3,
      elaProficiency: 42.6,
      mathProficiency: 35.1,
    },
    county: 'Sacramento',
    enrollmentBand: 'medium',
    additionalMetrics: [
      { label: 'Math Proficiency', value: '35.1%' },
      { label: 'ELA Proficiency', value: '42.6%' },
    ],
  },
  {
    snapshot: {
      districtId: 'san-juan-usd',
      name: 'San Juan USD',
      city: 'Carmichael',
      county: 'Sacramento',
      state: 'CA',
      docType: 'Unified',
      lowGrade: 'K',
      highGrade: '12',
      totalEnrollment: 39400,
      frpmPercent: 51.7,
      ellPercent: 14.2,
      elaProficiency: 40.9,
      mathProficiency: 33.5,
    },
    county: 'Sacramento',
    enrollmentBand: 'large',
    additionalMetrics: [
      { label: 'Math Proficiency', value: '33.5%' },
      { label: 'ELA Proficiency', value: '40.9%' },
    ],
  },
  {
    snapshot: {
      districtId: 'folsom-cordova-usd',
      name: 'Folsom Cordova USD',
      city: 'Folsom',
      county: 'Sacramento',
      state: 'CA',
      docType: 'Unified',
      lowGrade: 'K',
      highGrade: '12',
      totalEnrollment: 19600,
      frpmPercent: 28.4,
      ellPercent: 9.8,
      elaProficiency: 55.2,
      mathProficiency: 48.7,
    },
    county: 'Sacramento',
    enrollmentBand: 'medium',
    additionalMetrics: [
      { label: 'Math Proficiency', value: '48.7%' },
      { label: 'ELA Proficiency', value: '55.2%' },
    ],
  },
  {
    snapshot: {
      districtId: 'davis-jusd',
      name: 'Davis Joint USD',
      city: 'Davis',
      county: 'Yolo',
      state: 'CA',
      docType: 'Unified',
      lowGrade: 'K',
      highGrade: '12',
      totalEnrollment: 8400,
      frpmPercent: 18.2,
      ellPercent: 11.5,
      elaProficiency: 63.1,
      mathProficiency: 56.3,
    },
    county: 'Yolo',
    enrollmentBand: 'medium',
    additionalMetrics: [
      { label: 'Math Proficiency', value: '56.3%' },
      { label: 'ELA Proficiency', value: '63.1%' },
    ],
  },
  {
    snapshot: {
      districtId: 'woodland-jusd',
      name: 'Woodland Joint USD',
      city: 'Woodland',
      county: 'Yolo',
      state: 'CA',
      docType: 'Unified',
      lowGrade: 'K',
      highGrade: '12',
      totalEnrollment: 10200,
      frpmPercent: 62.7,
      ellPercent: 31.2,
      elaProficiency: 34.7,
      mathProficiency: 28.4,
    },
    county: 'Yolo',
    enrollmentBand: 'medium',
    additionalMetrics: [
      { label: 'Math Proficiency', value: '28.4%' },
      { label: 'ELA Proficiency', value: '34.7%' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Filter / sort config                                               */
/* ------------------------------------------------------------------ */

const COUNTY_OPTIONS = [
  { value: 'Sacramento', label: 'Sacramento' },
  { value: 'Yolo', label: 'Yolo' },
];

const ENROLLMENT_OPTIONS = [
  { value: 'small', label: 'Small (under 5,000)' },
  { value: 'medium', label: 'Medium (5,000 \u2013 25,000)' },
  { value: 'large', label: 'Large (25,000 \u2013 100,000)' },
  { value: 'very-large', label: 'Very Large (over 100,000)' },
];

const FILTER_DEFINITIONS: FilterDefinition[] = [
  {
    id: 'county',
    label: 'Filter by county',
    placeholder: 'All Counties',
    options: COUNTY_OPTIONS,
    width: 'md:w-44',
  },
  {
    id: 'enrollment',
    label: 'Filter by enrollment size',
    placeholder: 'All Sizes',
    options: ENROLLMENT_OPTIONS,
    width: 'md:w-52',
  },
];

const SORT_OPTIONS: SortOption[] = [
  { value: 'enrollment-desc', label: 'Enrollment: High \u2192 Low' },
  { value: 'enrollment-asc', label: 'Enrollment: Low \u2192 High' },
  { value: 'name-asc', label: 'Name: A \u2192 Z' },
  { value: 'county-asc', label: 'County: A \u2192 Z' },
];

/* ------------------------------------------------------------------ */
/*  Sorting helper                                                     */
/* ------------------------------------------------------------------ */

function sortDistricts(districts: MockDistrict[], sort: string): MockDistrict[] {
  const sorted = [...districts];
  switch (sort) {
    case 'enrollment-desc':
      return sorted.sort((a, b) => b.snapshot.totalEnrollment - a.snapshot.totalEnrollment);
    case 'enrollment-asc':
      return sorted.sort((a, b) => a.snapshot.totalEnrollment - b.snapshot.totalEnrollment);
    case 'name-asc':
      return sorted.sort((a, b) => a.snapshot.name.localeCompare(b.snapshot.name));
    case 'county-asc':
      return sorted.sort((a, b) => a.county.localeCompare(b.county) || a.snapshot.name.localeCompare(b.snapshot.name));
    default:
      return sorted;
  }
}

/* ------------------------------------------------------------------ */
/*  Demo page                                                          */
/* ------------------------------------------------------------------ */

export default function ContainerPreviewPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string | undefined>>({});
  const [sortValue, setSortValue] = useState('enrollment-desc');
  const [savedDistricts, setSavedDistricts] = useState<Set<string>>(new Set());

  const handleFilterChange = useCallback(
    (filterId: string, value: string | undefined) => {
      setFilterValues((prev) => ({ ...prev, [filterId]: value }));
    },
    [],
  );

  const handleSave = useCallback((districtId: string) => {
    setSavedDistricts((prev) => new Set(prev).add(districtId));
  }, []);

  const handleRemoveSaved = useCallback((districtId: string) => {
    setSavedDistricts((prev) => {
      const next = new Set(prev);
      next.delete(districtId);
      return next;
    });
  }, []);

  // Filter and sort
  const filtered = useMemo(() => {
    let result = DISTRICTS;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (d) =>
          d.snapshot.name.toLowerCase().includes(q) ||
          d.snapshot.city.toLowerCase().includes(q),
      );
    }
    if (filterValues.county) {
      result = result.filter((d) => d.county === filterValues.county);
    }
    if (filterValues.enrollment) {
      result = result.filter((d) => d.enrollmentBand === filterValues.enrollment);
    }

    return sortDistricts(result, sortValue);
  }, [searchQuery, filterValues, sortValue]);

  // Derive active sort metric label for highlight
  const activeSortMetric = sortValue.startsWith('enrollment') ? 'Enrollment' : undefined;

  const toolbarProps: ListingsToolbarProps = {
    searchQuery,
    onSearchChange: setSearchQuery,
    searchPlaceholder: 'Search districts by name or city...',
    filters: FILTER_DEFINITIONS,
    filterValues,
    onFilterChange: handleFilterChange,
    sortOptions: SORT_OPTIONS,
    sortValue,
    onSortChange: setSortValue,
  };

  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">This page is only available in development mode.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-content">
      <DistrictListingsContainer
        title="District Browser"
        subtitle="Browse and filter districts across the Sacramento region"
        toolbar={toolbarProps}
        resultCount={filtered.length}
        totalCount={DISTRICTS.length}
      >
        {filtered.map((d) => (
          <DistrictListCard
            key={d.snapshot.districtId}
            snapshot={d.snapshot}
            variant="inset"
            additionalMetrics={d.additionalMetrics}
            activeSortMetric={activeSortMetric}
            isSaved={savedDistricts.has(d.snapshot.districtId)}
            onSave={handleSave}
            onRemoveSaved={handleRemoveSaved}
          />
        ))}
      </DistrictListingsContainer>
    </div>
  );
}
