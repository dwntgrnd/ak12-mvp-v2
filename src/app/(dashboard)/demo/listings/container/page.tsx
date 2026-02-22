'use client';

import { useState, useMemo, useCallback } from 'react';
import { DistrictListingsContainer } from '@/components/shared/district-listings-container';
import { DistrictListCard } from '@/components/shared/district-list-card';
import { CARD_SET_CONFIG, type ActiveSort } from '@/components/shared/list-context-config';
import { sortBySnapshotField, filterBySnapshot, mapSortKeyToLabel } from '@/lib/utils/sort-utils';
import type { DistrictSnapshot } from '@/services/types/district';

/* ------------------------------------------------------------------ */
/*  Fixture data                                                       */
/* ------------------------------------------------------------------ */

interface MockDistrict {
  name: string;
  snapshot: DistrictSnapshot;
  additionalMetrics: Array<{ label: string; value: string }>;
}

const DISTRICTS: MockDistrict[] = [
  {
    name: 'Sacramento City USD',
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
    additionalMetrics: [
      { label: 'Math Proficiency', value: '29.8%' },
      { label: 'ELA Proficiency', value: '38.1%' },
    ],
  },
  {
    name: 'Elk Grove USD',
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
    additionalMetrics: [
      { label: 'Math Proficiency', value: '38.4%' },
      { label: 'ELA Proficiency', value: '47.2%' },
    ],
  },
  {
    name: 'Twin Rivers USD',
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
    additionalMetrics: [
      { label: 'Math Proficiency', value: '31.2%' },
      { label: 'ELA Proficiency', value: '35.8%' },
    ],
  },
  {
    name: 'Natomas USD',
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
    additionalMetrics: [
      { label: 'Math Proficiency', value: '35.1%' },
      { label: 'ELA Proficiency', value: '42.6%' },
    ],
  },
  {
    name: 'San Juan USD',
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
    additionalMetrics: [
      { label: 'Math Proficiency', value: '33.5%' },
      { label: 'ELA Proficiency', value: '40.9%' },
    ],
  },
  {
    name: 'Folsom Cordova USD',
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
    additionalMetrics: [
      { label: 'Math Proficiency', value: '48.7%' },
      { label: 'ELA Proficiency', value: '55.2%' },
    ],
  },
  {
    name: 'Davis Joint USD',
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
    additionalMetrics: [
      { label: 'Math Proficiency', value: '56.3%' },
      { label: 'ELA Proficiency', value: '63.1%' },
    ],
  },
  {
    name: 'Woodland Joint USD',
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
    additionalMetrics: [
      { label: 'Math Proficiency', value: '28.4%' },
      { label: 'ELA Proficiency', value: '34.7%' },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Demo page                                                          */
/* ------------------------------------------------------------------ */

export default function ContainerPreviewPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSort, setActiveSort] = useState<ActiveSort | null>(null);
  const [filterValues, setFilterValues] = useState<Record<string, string[]>>({});
  const [savedDistricts, setSavedDistricts] = useState<Set<string>>(new Set());

  const handleFilterChange = useCallback((filterId: string, values: string[]) => {
    setFilterValues((prev) => ({ ...prev, [filterId]: values }));
  }, []);

  const handleClearAllFilters = useCallback(() => {
    setFilterValues({});
  }, []);

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

    result = filterBySnapshot(result, filterValues);
    result = sortBySnapshotField(result, activeSort);

    return result;
  }, [searchQuery, filterValues, activeSort]);

  const activeSortMetric = activeSort ? mapSortKeyToLabel(activeSort.key) : undefined;

  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">This page is only available in development mode.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-content">
      <h1 className="text-2xl font-bold tracking-[-0.01em] text-foreground mb-6">
        District Browser
      </h1>
      <p className="mb-6 text-sm text-muted-foreground">
        Browse and filter districts across the Sacramento region
      </p>
      <DistrictListingsContainer
        config={CARD_SET_CONFIG}
        resultCount={filtered.length}
        totalCount={DISTRICTS.length}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeSort={activeSort}
        onSortChange={setActiveSort}
        filterValues={filterValues}
        onFilterChange={handleFilterChange}
        onClearAllFilters={handleClearAllFilters}
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
