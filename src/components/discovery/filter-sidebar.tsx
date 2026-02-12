'use client';

import type { FilterFacet } from '@/services/types/district';

interface FilterSidebarProps {
  filters: Record<string, string | number | string[]>;
  onFiltersChange: (filters: Record<string, string | number | string[]>) => void;
  facets: FilterFacet[];
}

export function FilterSidebar({ filters, onFiltersChange, facets }: FilterSidebarProps) {
  const handleCountyToggle = (countyValue: string) => {
    const currentCounties = (filters.county as string[]) || [];
    const newCounties = currentCounties.includes(countyValue)
      ? currentCounties.filter((c) => c !== countyValue)
      : [...currentCounties, countyValue];

    onFiltersChange({
      ...filters,
      county: newCounties,
    });
  };

  const handleEnrollmentChange = (field: 'enrollmentMin' | 'enrollmentMax', value: string) => {
    const numValue = value === '' ? undefined : parseInt(value, 10);
    const newFilters = { ...filters };

    if (numValue === undefined) {
      delete newFilters[field];
    } else {
      newFilters[field] = numValue;
    }

    onFiltersChange(newFilters);
  };

  const handleClearFilters = () => {
    onFiltersChange({});
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-medium text-sm uppercase tracking-wider text-muted-foreground">
          Filters
        </h2>
        <button
          onClick={handleClearFilters}
          className="text-xs text-primary hover:underline"
        >
          Clear all
        </button>
      </div>

      {facets.map((facet) => (
        <div key={facet.filterName} className="border-b pb-4 mb-4 last:border-b-0">
          <h3 className="font-medium text-sm mb-3">{facet.filterLabel}</h3>

          {facet.filterType === 'multi-select' && facet.options && (
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {facet.options.map((option) => {
                const isChecked = ((filters.county as string[]) || []).includes(option.value);
                return (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 cursor-pointer hover:text-foreground"
                  >
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => handleCountyToggle(option.value)}
                      className="rounded border-input"
                    />
                    <span className="text-sm flex-1">{option.label}</span>
                    <span className="text-xs text-muted-foreground bg-muted px-1.5 py-0.5 rounded">
                      {option.count}
                    </span>
                  </label>
                );
              })}
            </div>
          )}

          {facet.filterType === 'range' && facet.range && (
            <div className="flex gap-2">
              <div className="flex-1">
                <label htmlFor={`${facet.filterName}-min`} className="text-xs text-muted-foreground">
                  Min
                </label>
                <input
                  id={`${facet.filterName}-min`}
                  type="number"
                  value={(filters.enrollmentMin as number) || ''}
                  onChange={(e) => handleEnrollmentChange('enrollmentMin', e.target.value)}
                  placeholder={facet.range.min.toString()}
                  className="w-full px-2 py-1.5 text-sm rounded border border-input bg-background"
                />
              </div>
              <div className="flex-1">
                <label htmlFor={`${facet.filterName}-max`} className="text-xs text-muted-foreground">
                  Max
                </label>
                <input
                  id={`${facet.filterName}-max`}
                  type="number"
                  value={(filters.enrollmentMax as number) || ''}
                  onChange={(e) => handleEnrollmentChange('enrollmentMax', e.target.value)}
                  placeholder={facet.range.max.toString()}
                  className="w-full px-2 py-1.5 text-sm rounded border border-input bg-background"
                />
              </div>
            </div>
          )}
        </div>
      ))}

      <button
        onClick={handleClearFilters}
        className="w-full px-4 py-2 text-sm rounded-md border border-input hover:bg-accent transition-colors"
      >
        Clear Filters
      </button>
    </div>
  );
}
