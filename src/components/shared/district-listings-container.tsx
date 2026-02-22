'use client';

import { useState } from 'react';
import { Search, X, SearchX } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { formatNumber } from '@/lib/utils/format';
import { ColumnHeaderBar } from './column-header-bar';
import { FilterTriggerButton, FilterSheet } from './filter-sheet';
import type { ListContextConfig, ActiveSort } from './list-context-config';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DistrictListingsContainerProps {
  /** List context configuration (columns, filters, display flags) */
  config: ListContextConfig;

  /** Header slot — renderer-specific content (title, criterion, product lens) */
  header?: React.ReactNode;
  /** Footer slot — synthesis block */
  footer?: React.ReactNode;

  /** Number of districts currently displayed after filtering */
  resultCount: number;
  /** Total number of districts before filtering (shows "X of Y") */
  totalCount?: number;

  /** Search state */
  searchQuery: string;
  onSearchChange: (query: string) => void;

  /** Column sort state */
  activeSort: ActiveSort | null;
  onSortChange: (sort: ActiveSort | null) => void;

  /** Filter state */
  filterValues: Record<string, string[]>;
  onFilterChange: (filterId: string, values: string[]) => void;
  onClearAllFilters: () => void;
  activeFilterCount: number;

  /** List content — DistrictListCards */
  children: React.ReactNode;

  /** Show skeleton loading state */
  loading?: boolean;
  /** Number of skeleton rows to show while loading */
  skeletonRows?: number;

  /** Custom empty state message */
  emptyTitle?: string;
  /** Custom empty state description */
  emptyDescription?: string;

  /** Extra class names on the outermost element */
  className?: string;
}

/* ------------------------------------------------------------------ */
/*  Skeleton loader                                                    */
/* ------------------------------------------------------------------ */

function ListingSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="flex flex-col gap-2" role="status" aria-label="Loading districts">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="bg-slate-50 rounded-md border border-border/50 px-4 py-2.5"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-3 w-24" />
            </div>
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-6 w-14" />
            </div>
          </div>
          <div className="mt-2 pt-2 border-t border-border/30">
            <div className="flex items-center gap-6">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-20" />
            </div>
          </div>
        </div>
      ))}
      <span className="sr-only">Loading district listings…</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Empty state                                                        */
/* ------------------------------------------------------------------ */

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center mb-3">
        <SearchX className="h-5 w-5 text-muted-foreground" />
      </div>
      <p className="text-sm font-semibold text-foreground">{title}</p>
      <p className="mt-1 text-xs text-muted-foreground max-w-xs">
        {description}
      </p>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Result count strip                                                 */
/* ------------------------------------------------------------------ */

function ResultCount({
  count,
  total,
}: {
  count: number;
  total?: number;
}) {
  const isFiltered = total != null && count !== total;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-medium text-muted-foreground tracking-wide">
        {isFiltered ? (
          <>
            <span className="text-foreground font-semibold">
              {formatNumber(count)}
            </span>{' '}
            of {formatNumber(total)} districts
          </>
        ) : (
          <>
            <span className="text-foreground font-semibold">
              {formatNumber(count)}
            </span>{' '}
            {count === 1 ? 'district' : 'districts'}
          </>
        )}
      </span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Active filter pills                                                */
/* ------------------------------------------------------------------ */

function FilterPills({
  config,
  filterValues,
  searchQuery,
  onFilterChange,
  onSearchChange,
  onClearAll,
}: {
  config: ListContextConfig;
  filterValues: Record<string, string[]>;
  searchQuery: string;
  onFilterChange: (filterId: string, values: string[]) => void;
  onSearchChange: (q: string) => void;
  onClearAll: () => void;
}) {
  const pills: Array<{ filterId: string; value: string; label: string }> = [];
  for (const f of config.availableFilters) {
    const vals = filterValues[f.id] ?? [];
    for (const v of vals) {
      const opt = f.options.find((o) => o.value === v);
      if (opt) {
        pills.push({ filterId: f.id, value: v, label: opt.label });
      }
    }
  }

  const hasAny = pills.length > 0 || searchQuery.length > 0;
  if (!hasAny) return null;

  return (
    <div className="flex flex-wrap items-center gap-2 px-4 pb-3">
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

      {pills.map((pill) => (
        <span
          key={`${pill.filterId}-${pill.value}`}
          className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2 py-0.5 text-xs font-medium text-foreground"
        >
          {pill.label}
          <button
            type="button"
            onClick={() => {
              const current = filterValues[pill.filterId] ?? [];
              onFilterChange(
                pill.filterId,
                current.filter((v) => v !== pill.value),
              );
            }}
            className="ml-0.5 rounded-sm hover:bg-slate-200 p-0.5 transition-colors"
            aria-label={`Remove ${pill.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      {(pills.length > 1 || (pills.length >= 1 && searchQuery)) && (
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors underline underline-offset-2 decoration-muted-foreground/30 hover:decoration-foreground ml-1"
        >
          Clear all
        </button>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function DistrictListingsContainer({
  config,
  header,
  footer,
  resultCount,
  totalCount,
  searchQuery,
  onSearchChange,
  activeSort,
  onSortChange,
  filterValues,
  onFilterChange,
  onClearAllFilters,
  activeFilterCount,
  children,
  loading = false,
  skeletonRows = 5,
  emptyTitle = 'No districts found',
  emptyDescription = 'Try adjusting your filters or search terms.',
  className,
}: DistrictListingsContainerProps) {
  const [filterSheetOpen, setFilterSheetOpen] = useState(false);
  const showEmpty = !loading && resultCount === 0;

  function handleClearAll() {
    onSearchChange('');
    onClearAllFilters();
  }

  return (
    <div className={cn('w-full', className)}>
      {/* ---- Card surface ---- */}
      <div className="bg-white border border-border rounded-lg shadow-sm">
        {/* Header slot (title, criterion, product lens) */}
        {header && <div className="p-5 pb-0">{header}</div>}

        {/* Toolbar: search input + filter trigger */}
        {config.showLocalFilter && (
          <div className="px-5 pt-4 pb-3">
            <div
              role="search"
              aria-label="District filters"
              className="flex items-center gap-3"
            >
              <div className="relative flex-1 max-w-xs">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder={config.searchPlaceholder}
                  aria-label={config.searchPlaceholder}
                  className="pl-8 pr-8"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => onSearchChange('')}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              {config.availableFilters.length > 0 && (
                <FilterTriggerButton
                  activeCount={activeFilterCount}
                  onClick={() => setFilterSheetOpen(true)}
                />
              )}
            </div>
          </div>
        )}

        {/* Active filter pills */}
        <FilterPills
          config={config}
          filterValues={filterValues}
          searchQuery={searchQuery}
          onFilterChange={onFilterChange}
          onSearchChange={onSearchChange}
          onClearAll={handleClearAll}
        />

        {/* Column header bar */}
        {config.showColumnHeaders && (
          <ColumnHeaderBar
            columns={config.columns}
            activeSort={activeSort}
            onSortChange={onSortChange}
          />
        )}

        {/* Count strip */}
        <div className="px-4 py-2.5 flex items-center justify-between border-b border-border/50 bg-slate-50/50">
          <ResultCount count={resultCount} total={totalCount} />
        </div>

        {/* List content */}
        <div className="p-4">
          {loading && <ListingSkeleton rows={skeletonRows} />}

          {showEmpty && (
            <EmptyState title={emptyTitle} description={emptyDescription} />
          )}

          {!loading && !showEmpty && (
            <div className="flex flex-col gap-2" role="list" aria-label="District listings">
              {children}
            </div>
          )}
        </div>

        {/* Footer slot (synthesis) */}
        {footer && <div className="px-5 pb-5">{footer}</div>}
      </div>

      {/* Filter sheet */}
      {config.availableFilters.length > 0 && (
        <FilterSheet
          open={filterSheetOpen}
          onOpenChange={setFilterSheetOpen}
          filters={config.availableFilters}
          filterValues={filterValues}
          onFilterChange={onFilterChange}
          onClearAll={onClearAllFilters}
        />
      )}
    </div>
  );
}
