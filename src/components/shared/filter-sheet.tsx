'use client';

import { SlidersHorizontal } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import type { SheetFilterDefinition } from './list-context-config';

/* ------------------------------------------------------------------ */
/*  FilterTriggerButton                                                */
/* ------------------------------------------------------------------ */

interface FilterTriggerButtonProps {
  activeCount: number;
  onClick: () => void;
}

export function FilterTriggerButton({
  activeCount,
  onClick,
}: FilterTriggerButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 bg-white text-foreground border border-border font-medium px-4 py-2 rounded-md text-sm transition-colors hover:bg-slate-50"
    >
      <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
      Filters
      {activeCount > 0 && (
        <span className="flex items-center justify-center h-4 w-4 rounded-full bg-primary text-white text-[10px] font-semibold leading-none">
          {activeCount}
        </span>
      )}
    </button>
  );
}

/* ------------------------------------------------------------------ */
/*  FilterSheet                                                        */
/* ------------------------------------------------------------------ */

interface FilterSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  filters: SheetFilterDefinition[];
  filterValues: Record<string, string[]>;
  onFilterChange: (filterId: string, values: string[]) => void;
  onClearAll: () => void;
}

export function FilterSheet({
  open,
  onOpenChange,
  filters,
  filterValues,
  onFilterChange,
  onClearAll,
}: FilterSheetProps) {
  const hasAny = Object.values(filterValues).some((v) => v.length > 0);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-80 sm:w-96">
        <SheetHeader>
          <SheetTitle>Filters</SheetTitle>
          <SheetDescription>Narrow the district list</SheetDescription>
        </SheetHeader>

        <div className="mt-6 flex flex-col gap-6">
          {filters.map((filter) => (
            <FilterSection
              key={filter.id}
              filter={filter}
              values={filterValues[filter.id] ?? []}
              onChange={(values) => onFilterChange(filter.id, values)}
            />
          ))}
        </div>

        {hasAny && (
          <div className="mt-8 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClearAll}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2 decoration-muted-foreground/30 hover:decoration-foreground"
            >
              Clear all filters
            </button>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

/* ------------------------------------------------------------------ */
/*  Filter section (multi-checkbox or bracket-select)                  */
/* ------------------------------------------------------------------ */

function FilterSection({
  filter,
  values,
  onChange,
}: {
  filter: SheetFilterDefinition;
  values: string[];
  onChange: (values: string[]) => void;
}) {
  if (filter.type === 'bracket-select') {
    return (
      <fieldset>
        <legend className="text-overline text-muted-foreground mb-2">
          {filter.label}
        </legend>
        <div className="flex flex-col gap-1.5">
          {filter.options.map((opt) => {
            const isSelected = values.includes(opt.value);
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(isSelected ? [] : [opt.value]);
                }}
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

  // multi-checkbox (default)
  return (
    <fieldset>
      <legend className="text-overline text-muted-foreground mb-2">
        {filter.label}
      </legend>
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
