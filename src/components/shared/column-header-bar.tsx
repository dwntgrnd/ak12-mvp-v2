'use client';

import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ColumnDefinition, ActiveSort } from './list-context-config';

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
  return (
    <div
      className="flex items-center bg-slate-50 border-b border-border py-1.5 px-4"
      role="row"
      aria-label="Column headers"
    >
      {columns.map((col) => {
        const isActive = activeSort?.key === col.key;
        const isIdentity = col.key === 'rank' || col.key === 'name';

        if (!col.sortable) {
          return (
            <div
              key={col.key}
              className={cn('text-overline text-muted-foreground', col.minWidth)}
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
              isActive ? 'text-foreground' : 'text-muted-foreground',
              col.minWidth,
              isIdentity && 'flex-1 min-w-0',
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
