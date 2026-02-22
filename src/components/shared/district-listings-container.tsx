'use client';

import { Search, X, SearchX, ArrowUpDown } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { ColumnHeaderBar } from './column-header-bar';
import { FilterPopoverBar } from './filter-popover-bar';
import type { ListContextConfig, ActiveSort } from './list-context-config';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface DistrictListingsContainerProps {
  /** List context configuration (columns, filters, display flags) */
  config: ListContextConfig;

  /** Header slot — renderer-specific content (title, criterion) */
  header?: React.ReactNode;
  /** Footer slot — synthesis block */
  footer?: React.ReactNode;

  /** Slot for product lens selector — rendered in FilterPopoverBar */
  productLensSlot?: React.ReactNode;
  /** Slot for local search input — rendered in FilterPopoverBar when config.showLocalFilter */
  searchSlot?: React.ReactNode;

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
/*  Main component                                                     */
/* ------------------------------------------------------------------ */

export function DistrictListingsContainer({
  config,
  header,
  footer,
  productLensSlot,
  searchSlot,
  resultCount,
  totalCount,
  searchQuery,
  onSearchChange,
  activeSort,
  onSortChange,
  filterValues,
  onFilterChange,
  onClearAllFilters,
  children,
  loading = false,
  skeletonRows = 5,
  emptyTitle = 'No districts found',
  emptyDescription = 'Try adjusting your filters or search terms.',
  className,
}: DistrictListingsContainerProps) {
  const showEmpty = !loading && resultCount === 0;

  function handleClearAll() {
    onSearchChange('');
    onClearAllFilters();
  }

  // Build search slot from config when showLocalFilter is true and no external searchSlot provided
  const resolvedSearchSlot = searchSlot ?? (config.showLocalFilter ? (
    <div className="relative flex-1 max-w-xs" role="search" aria-label="District search">
      <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
      <Input
        value={searchQuery}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={config.searchPlaceholder}
        aria-label={config.searchPlaceholder}
        className="pl-8 pr-8 h-8"
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
  ) : undefined);

  // Build sort dropdown from config
  const sortDropdown = config.sortOptions.length > 0 ? (
    <div className="flex items-center gap-1.5">
      <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
      <Select
        value={activeSort?.key ?? ''}
        onValueChange={(value) => {
          if (!value) {
            onSortChange(null);
          } else {
            // If already sorting by this key, toggle direction
            if (activeSort?.key === value) {
              onSortChange(
                activeSort.direction === 'asc'
                  ? { key: value, direction: 'desc' }
                  : null
              );
            } else {
              onSortChange({ key: value, direction: 'asc' });
            }
          }
        }}
      >
        <SelectTrigger className="h-8 text-xs font-medium border-border w-auto min-w-[140px]">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          {config.sortOptions.map((opt) => (
            <SelectItem key={opt.key} value={opt.key} className="text-xs">
              {opt.label}
              {activeSort?.key === opt.key && (
                <span className="ml-1 text-muted-foreground">
                  {activeSort.direction === 'asc' ? '\u2191' : '\u2193'}
                </span>
              )}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  ) : null;

  return (
    <div className={cn('w-full', className)}>
      {/* ---- Card surface ---- */}
      <div className="bg-white border border-border rounded-lg shadow-sm">
        {/* Header slot (title, criterion) */}
        {header && <div className="p-5 pb-0">{header}</div>}

        {/* Utility bar: product lens + filters + count */}
        <div className="px-5 pt-4 pb-3">
          <FilterPopoverBar
            filters={config.availableFilters}
            filterValues={filterValues}
            onFilterChange={onFilterChange}
            onClearAll={handleClearAll}
            resultCount={resultCount}
            totalCount={totalCount}
            productLensSlot={productLensSlot}
            searchSlot={resolvedSearchSlot}
            sortSlot={sortDropdown}
          />
        </div>

        {/* Column header bar */}
        {config.showColumnHeaders && (
          <ColumnHeaderBar
            columns={config.columns}
            activeSort={activeSort}
            onSortChange={onSortChange}
          />
        )}

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
    </div>
  );
}
