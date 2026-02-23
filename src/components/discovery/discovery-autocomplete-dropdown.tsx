'use client';

import { cn } from '@/lib/utils';
import type { DirectoryEntry } from '@/services';

interface DiscoveryAutocompleteDropdownProps {
  matches: DirectoryEntry[];
  isLoading: boolean;
  highlightedIndex: number;
  onSelect: (entry: DirectoryEntry) => void;
  onHighlight: (index: number) => void;
  query: string;
}

function HighlightedName({ name, query }: { name: string; query: string }) {
  const lowerName = name.toLowerCase();
  const lowerQuery = query.toLowerCase();
  const idx = lowerName.indexOf(lowerQuery);

  if (!query || idx === -1) {
    return <span>{name}</span>;
  }

  return (
    <>
      {name.slice(0, idx)}
      <span className="font-semibold">{name.slice(idx, idx + query.length)}</span>
      {name.slice(idx + query.length)}
    </>
  );
}

export function DiscoveryAutocompleteDropdown({
  matches,
  isLoading,
  highlightedIndex,
  onSelect,
  onHighlight,
  query,
}: DiscoveryAutocompleteDropdownProps) {
  return (
    <ul
      id="discovery-autocomplete-listbox"
      role="listbox"
      aria-label="District suggestions"
      className="absolute top-full left-0 right-0 mt-1 bg-surface-raised border border-border-default rounded-lg shadow-lg z-50 overflow-hidden max-h-[320px] overflow-y-auto text-left"
    >
      {isLoading ? (
        <li
          className="px-4 py-3 text-xs text-foreground-tertiary italic"
          role="option"
          aria-selected={false}
        >
          Searching districts...
        </li>
      ) : matches.length === 0 ? (
        <li
          className="px-4 py-3 text-xs text-foreground-tertiary"
          role="option"
          aria-selected={false}
        >
          No matching districts.{' '}
          <span className="font-normal">Press Enter to search.</span>
        </li>
      ) : (
        matches.map((entry, index) => (
          <li
            key={entry.districtId}
            id={`discovery-option-${index}`}
            role="option"
            aria-selected={index === highlightedIndex}
            className={cn(
              'px-4 py-2.5 cursor-pointer select-none',
              index !== 0 && 'border-t border-border-subtle',
              index === highlightedIndex ? 'bg-surface-emphasis-neutral' : 'hover:bg-surface-inset',
            )}
            onMouseEnter={() => onHighlight(index)}
            onMouseDown={(e) => {
              // Prevent input blur before the select fires
              e.preventDefault();
              onSelect(entry);
            }}
          >
            <span className="text-sm font-normal text-foreground">
              <HighlightedName name={entry.name} query={query} />
            </span>
            <span className="text-xs text-foreground-secondary font-normal ml-1.5">
              · {entry.county}, {entry.state}
            </span>
          </li>
        ))
      )}
    </ul>
  );
}
