'use client';

import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface FilterDefinition {
  id: string;
  label: string;
  placeholder: string;
  options: Array<{ value: string; label: string }>;
  /** Tailwind width class for desktop, e.g. "md:w-44" */
  width?: string;
  /** When true the filter only renders if `visibleWhen` returns true */
  conditional?: boolean;
  visibleWhen?: () => boolean;
}

export interface SortOption {
  value: string;
  label: string;
}

export interface ListingsToolbarProps {
  /* Search */
  searchQuery: string;
  onSearchChange: (query: string) => void;
  searchPlaceholder?: string;

  /* Filters */
  filters?: FilterDefinition[];
  filterValues: Record<string, string | undefined>;
  onFilterChange: (filterId: string, value: string | undefined) => void;

  /* Sort */
  sortOptions: SortOption[];
  sortValue: string;
  onSortChange: (value: string) => void;

  /** Extra class names on the root element */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Active filter pill helpers                                         */
/* ------------------------------------------------------------------ */

function getActiveFilters(
  filters: FilterDefinition[],
  values: Record<string, string | undefined>,
): Array<{ filterId: string; filterLabel: string; optionLabel: string }> {
  const active: Array<{ filterId: string; filterLabel: string; optionLabel: string }> = [];
  for (const f of filters) {
    const val = values[f.id];
    if (!val) continue;
    const opt = f.options.find((o) => o.value === val);
    if (opt) {
      active.push({
        filterId: f.id,
        filterLabel: f.label,
        optionLabel: opt.label,
      });
    }
  }
  return active;
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function ListingsToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Search districts...',
  filters = [],
  filterValues,
  onFilterChange,
  sortOptions,
  sortValue,
  onSortChange,
  className,
}: ListingsToolbarProps) {
  const visibleFilters = filters.filter(
    (f) => !f.conditional || f.visibleWhen?.(),
  );

  const activeFilters = getActiveFilters(visibleFilters, filterValues);
  const hasActiveFilters = activeFilters.length > 0 || searchQuery.length > 0;

  function handleClearAll() {
    onSearchChange('');
    for (const f of visibleFilters) {
      onFilterChange(f.id, undefined);
    }
  }

  return (
    <div className={cn('space-y-3', className)}>
      {/* ---- Main toolbar row ---- */}
      <div
        role="search"
        aria-label="District filters"
        className="flex flex-col gap-3 md:flex-row md:flex-wrap md:items-center md:gap-3"
      >
        {/* Search input */}
        <div className="relative w-full md:w-60">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground-secondary pointer-events-none" />
          <Input
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            aria-label={searchPlaceholder}
            className="pl-8 pr-8"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-foreground-secondary hover:text-foreground transition-colors"
              aria-label="Clear search"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter dropdowns */}
        {visibleFilters.map((filter) => (
          <Select
            key={filter.id}
            value={filterValues[filter.id] ?? '__all__'}
            onValueChange={(value) =>
              onFilterChange(filter.id, value === '__all__' ? undefined : value)
            }
          >
            <SelectTrigger
              className={cn('w-full', filter.width ?? 'md:w-44')}
              aria-label={filter.label}
            >
              <SelectValue placeholder={filter.placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__all__">{filter.placeholder}</SelectItem>
              {filter.options.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        ))}

        {/* Sort dropdown — pushed right on desktop */}
        <div className="w-full md:w-auto md:ml-auto">
          <Select value={sortValue} onValueChange={onSortChange}>
            <SelectTrigger
              className="w-full md:w-48"
              aria-label="Sort districts"
            >
              <SlidersHorizontal className="h-3.5 w-3.5 mr-1.5 text-foreground-secondary shrink-0" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {sortOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ---- Active filter pills ---- */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {searchQuery && (
            <span className="inline-flex items-center gap-1 rounded-md bg-primary/8 px-2 py-0.5 text-xs font-medium text-primary">
              &ldquo;{searchQuery}&rdquo;
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="ml-0.5 rounded-sm hover:bg-primary/15 p-0.5 transition-colors"
                aria-label="Clear search filter"
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          )}

          {activeFilters.map((af) => (
            <span
              key={af.filterId}
              className="inline-flex items-center gap-1 rounded-md bg-surface-emphasis-neutral px-2 py-0.5 text-xs font-medium text-foreground"
            >
              {af.optionLabel}
              <button
                type="button"
                onClick={() => onFilterChange(af.filterId, undefined)}
                className="ml-0.5 rounded-sm hover:bg-surface-emphasis-neutral p-0.5 transition-colors"
                aria-label={`Remove ${af.filterLabel} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}

          {(activeFilters.length > 1 || (activeFilters.length >= 1 && searchQuery)) && (
            <button
              type="button"
              onClick={handleClearAll}
              className="text-xs font-medium text-foreground-secondary hover:text-foreground transition-colors underline underline-offset-2 decoration-foreground-secondary/30 hover:decoration-foreground ml-1"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}
