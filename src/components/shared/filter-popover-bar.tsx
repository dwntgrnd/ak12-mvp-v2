'use client';

import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils/format';
import type { SheetFilterDefinition } from './list-context-config';

/* ------------------------------------------------------------------ */
/*  FilterPopoverBar                                                   */
/* ------------------------------------------------------------------ */

interface FilterPopoverBarProps {
  filters: SheetFilterDefinition[];
  filterValues: Record<string, string[]>;
  onFilterChange: (filterId: string, values: string[]) => void;
  onClearAll: () => void;
  resultCount: number;
  totalCount?: number;
  /** Slot for product lens selector — renders as leftmost control */
  productLensSlot?: React.ReactNode;
  /** Slot for local search input — renders before filter buttons, only for directory browse */
  searchSlot?: React.ReactNode;
  /** Slot for sort dropdown — renders after filter buttons */
  sortSlot?: React.ReactNode;
  className?: string;
}

export function FilterPopoverBar({
  filters,
  filterValues,
  onFilterChange,
  onClearAll,
  resultCount,
  totalCount,
  productLensSlot,
  searchSlot,
  sortSlot,
  className,
}: FilterPopoverBarProps) {
  // Collect active pills across all filters
  const pills: Array<{
    filterId: string;
    value: string;
    label: string;
  }> = [];
  for (const filter of filters) {
    const values = filterValues[filter.id] ?? [];
    for (const val of values) {
      const opt = filter.options.find((o) => o.value === val);
      if (opt) {
        pills.push({ filterId: filter.id, value: val, label: opt.label });
      }
    }
  }

  const hasActiveFilters = pills.length > 0;
  const isFiltered = hasActiveFilters || (totalCount != null && resultCount !== totalCount);

  function removePill(pill: { filterId: string; value: string }) {
    const current = filterValues[pill.filterId] ?? [];
    onFilterChange(
      pill.filterId,
      current.filter((v) => v !== pill.value),
    );
  }

  return (
    <div className={cn('flex flex-col', className)}>
      {/* Main row */}
      <div className="flex items-center gap-2 flex-wrap">
        {productLensSlot}
        {searchSlot}

        {filters.map((filter) => {
          const activeCount = (filterValues[filter.id] ?? []).length;
          return (
            <FilterPopover
              key={filter.id}
              filter={filter}
              values={filterValues[filter.id] ?? []}
              activeCount={activeCount}
              onChange={(values) => onFilterChange(filter.id, values)}
            />
          );
        })}

        {sortSlot}

        {/* Result count — right-aligned */}
        <div className="ml-auto text-xs font-medium text-muted-foreground whitespace-nowrap">
          {isFiltered && totalCount != null ? (
            <>
              <span className="text-foreground font-semibold">
                {formatNumber(resultCount)}
              </span>{' '}
              of {formatNumber(totalCount)} districts
            </>
          ) : (
            <>
              <span className="text-foreground font-semibold">
                {formatNumber(resultCount)}
              </span>{' '}
              {resultCount === 1 ? 'district' : 'districts'}
            </>
          )}
        </div>
      </div>

      {/* Active filter pills row */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mt-2">
          {pills.map((pill) => (
            <span
              key={`${pill.filterId}-${pill.value}`}
              className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-foreground"
            >
              {pill.label}
              <button
                type="button"
                onClick={() => removePill(pill)}
                className="rounded-sm p-0.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={`Remove ${pill.label} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {pills.length >= 2 && (
            <button
              type="button"
              onClick={onClearAll}
              className="text-xs text-muted-foreground hover:text-foreground underline underline-offset-2 decoration-muted-foreground/30 hover:decoration-foreground transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  FilterPopover — individual filter trigger + popover                */
/* ------------------------------------------------------------------ */

function FilterPopover({
  filter,
  values,
  activeCount,
  onChange,
}: {
  filter: SheetFilterDefinition;
  values: string[];
  activeCount: number;
  onChange: (values: string[]) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 text-sm font-medium">
          {filter.label}
          {activeCount > 0 && (
            <span className="ml-1.5 flex items-center justify-center h-4 min-w-[16px] rounded-full bg-primary text-white text-[10px] font-semibold">
              {activeCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-auto min-w-[200px] p-3">
        {filter.type === 'bracket-select' ? (
          <BracketSelect filter={filter} values={values} onChange={onChange} />
        ) : (
          <MultiCheckbox filter={filter} values={values} onChange={onChange} />
        )}
      </PopoverContent>
    </Popover>
  );
}

/* ------------------------------------------------------------------ */
/*  MultiCheckbox content                                              */
/* ------------------------------------------------------------------ */

function MultiCheckbox({
  filter,
  values,
  onChange,
}: {
  filter: SheetFilterDefinition;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <fieldset>
      <legend className="sr-only">{filter.label}</legend>
      <div className="flex flex-col gap-2">
        {filter.options.map((opt) => {
          const isChecked = values.includes(opt.value);
          return (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Checkbox
                checked={isChecked}
                onCheckedChange={(checked) => {
                  if (checked) {
                    onChange([...values, opt.value]);
                  } else {
                    onChange(values.filter((v) => v !== opt.value));
                  }
                }}
              />
              <span className="text-sm text-foreground">{opt.label}</span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

/* ------------------------------------------------------------------ */
/*  BracketSelect content                                              */
/* ------------------------------------------------------------------ */

function BracketSelect({
  filter,
  values,
  onChange,
}: {
  filter: SheetFilterDefinition;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  return (
    <fieldset>
      <legend className="sr-only">{filter.label}</legend>
      <div className="flex flex-col gap-1">
        {filter.options.map((opt) => {
          const isSelected = values.includes(opt.value);
          return (
            <button
              key={opt.value}
              type="button"
              onClick={() => onChange(isSelected ? [] : [opt.value])}
              className={cn(
                'text-left text-sm px-3 py-1.5 rounded-md transition-colors',
                isSelected
                  ? 'bg-primary/10 text-primary font-medium'
                  : 'text-foreground hover:bg-slate-50',
              )}
            >
              {opt.label}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
