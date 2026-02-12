'use client';

import { GRADE_RANGES, SUBJECT_AREAS } from '@/services/types/controlled-vocabulary';

interface ProductFiltersProps {
  filters: {
    gradeRange?: string;
    subjectArea?: string;
  };
  onFiltersChange: (filters: { gradeRange?: string; subjectArea?: string }) => void;
}

export function ProductFilters({ filters, onFiltersChange }: ProductFiltersProps) {
  const handleGradeRangeChange = (value: string) => {
    const newFilters = { ...filters };
    if (value === '') {
      delete newFilters.gradeRange;
    } else {
      newFilters.gradeRange = value;
    }
    onFiltersChange(newFilters);
  };

  const handleSubjectAreaChange = (value: string) => {
    const newFilters = { ...filters };
    if (value === '') {
      delete newFilters.subjectArea;
    } else {
      newFilters.subjectArea = value;
    }
    onFiltersChange(newFilters);
  };

  return (
    <div className="flex gap-3">
      <select
        value={filters.gradeRange || ''}
        onChange={(e) => handleGradeRangeChange(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All Grade Ranges</option>
        {GRADE_RANGES.map((range) => (
          <option key={range} value={range}>
            {range}
          </option>
        ))}
      </select>

      <select
        value={filters.subjectArea || ''}
        onChange={(e) => handleSubjectAreaChange(e.target.value)}
        className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
      >
        <option value="">All Subject Areas</option>
        {SUBJECT_AREAS.map((area) => (
          <option key={area} value={area}>
            {area}
          </option>
        ))}
      </select>
    </div>
  );
}
