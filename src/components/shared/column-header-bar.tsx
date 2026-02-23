'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ColumnDefinition, ActiveSort } from './list-context-config';
import { METRIC_COL_WIDTHS } from './list-context-config';

interface ColumnHeaderBarProps {
  columns: ColumnDefinition[];
  activeSort: ActiveSort | null;
  onSortChange: (sort: ActiveSort | null) => void;
}

function getNextSort(
  key: string,
  current: ActiveSort | null,
): ActiveSort | null {
  if (!current || current.key !== key) return { key, direction: 'asc' };
  if (current.direction === 'asc') return { key, direction: 'desc' };
  return null; // third click clears
}

function getAriaSortValue(
  key: string,
  activeSort: ActiveSort | null,
): 'ascending' | 'descending' | 'none' {
  if (!activeSort || activeSort.key !== key) return 'none';
  return activeSort.direction === 'asc' ? 'ascending' : 'descending';
}

export function ColumnHeaderBar({
  columns,
  activeSort,
  onSortChange,
}: ColumnHeaderBarProps) {
  // Separate identity columns (rank, name) from metric columns
  const identityCols = columns.filter(
    (col) => col.key === 'rank' || col.key === 'name',
  );
  const metricCols = columns.filter(
    (col) => col.key !== 'rank' && col.key !== 'name',
  );

  return (
    <div
      className="flex items-center bg-surface-inset border-y border-border py-1.5 px-4"
      role="row"
      aria-label="Column headers"
    >
      {/* Identity columns — flex-1 to fill remaining space */}
      <div className="flex items-center flex-1 min-w-0">
        {identityCols.map((col) => {
          const isActive = activeSort?.key === col.key;

          if (!col.sortable) {
            return (
              <div
                key={col.key}
                className="text-overline text-foreground-secondary shrink-0 w-8"
                role="columnheader"
                aria-sort="none"
              >
                {col.label}
              </div>
            );
          }

          return (
            <button
              key={col.key}
              type="button"
              onClick={() => onSortChange(getNextSort(col.key, activeSort))}
              className={cn(
                'text-overline flex items-center gap-0.5 transition-colors duration-150',
                'hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm',
                'flex-1 min-w-0',
                isActive ? 'text-foreground' : 'text-foreground-secondary',
              )}
              role="columnheader"
              aria-sort={getAriaSortValue(col.key, activeSort)}
            >
              <span className="truncate">{col.label}</span>
              {isActive && activeSort && (
                activeSort.direction === 'asc'
                  ? <ArrowUp className="h-3 w-3 shrink-0" />
                  : <ArrowDown className="h-3 w-3 shrink-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Metric columns — shrink-0 fixed widths */}
      {metricCols.map((col, i) => {
        const isActive = activeSort?.key === col.key;
        const widthClass =
          i < METRIC_COL_WIDTHS.length ? METRIC_COL_WIDTHS[i] : col.minWidth;

        return (
          <button
            key={col.key}
            type="button"
            onClick={() => onSortChange(getNextSort(col.key, activeSort))}
            className={cn(
              'text-overline flex items-center gap-0.5 transition-colors duration-150 shrink-0',
              'hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring rounded-sm',
              widthClass,
              isActive ? 'text-foreground' : 'text-foreground-secondary',
            )}
            role="columnheader"
            aria-sort={getAriaSortValue(col.key, activeSort)}
          >
            <span className="truncate">{col.label}</span>
            {isActive && activeSort && (
              activeSort.direction === 'asc'
                ? <ArrowUp className="h-3 w-3 shrink-0" />
                : <ArrowDown className="h-3 w-3 shrink-0" />
            )}
          </button>
        );
      })}
    </div>
  );
}
