'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Search, Loader2 } from 'lucide-react';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';
import { Skeleton } from '@/components/ui/skeleton';
import { formatNumber } from '@/lib/utils/format';

export interface DistrictSearchResult {
  districtId: string;
  districtName: string;
  location: string;
  enrollment: number;
}

export interface DistrictSearchComboboxProps {
  onSelect: (district: DistrictSearchResult) => void;
  autoFocus?: boolean;
}

export function DistrictSearchCombobox({
  onSelect,
  autoFocus = false,
}: DistrictSearchComboboxProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<DistrictSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus when requested
  useEffect(() => {
    if (autoFocus) {
      // Small delay to ensure DOM is ready
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [autoFocus]);

  const searchDistricts = useCallback(async (searchQuery: string) => {
    // Cancel any in-flight request
    if (abortRef.current) {
      abortRef.current.abort();
    }

    const controller = new AbortController();
    abortRef.current = controller;

    setIsLoading(true);
    setError(false);

    try {
      const res = await fetch(
        `/api/districts?searchQuery=${encodeURIComponent(searchQuery)}`,
        { signal: controller.signal }
      );
      if (!res.ok) throw new Error('Search failed');
      const data = await res.json();
      const items = (data.items || data) as Array<{
        districtId: string;
        name: string;
        location: string;
        enrollment: number;
      }>;
      setResults(
        items.map((d) => ({
          districtId: d.districtId,
          districtName: d.name,
          location: d.location,
          enrollment: d.enrollment,
        }))
      );
      setHasSearched(true);
    } catch (err: unknown) {
      if ((err as Error).name !== 'AbortError') {
        setError(true);
        setResults([]);
        setHasSearched(true);
      }
    } finally {
      if (!controller.signal.aborted) {
        setIsLoading(false);
      }
    }
  }, []);

  // Debounced search effect
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (query.length < 2) {
      setResults([]);
      setHasSearched(false);
      setIsLoading(false);
      setError(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      searchDistricts(query);
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query, searchDistricts]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortRef.current) abortRef.current.abort();
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);

  return (
    <Command
      shouldFilter={false}
      className="rounded-lg border border-border"
    >
      <CommandInput
        ref={inputRef}
        placeholder="Search districts by name..."
        value={query}
        onValueChange={setQuery}
      />
      <CommandList>
        {/* Loading state */}
        {isLoading && (
          <div className="p-2 space-y-2">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="py-6 text-center text-sm text-destructive">
            Search unavailable. Please try again.
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && hasSearched && results.length === 0 && (
          <CommandEmpty>
            No districts found for &ldquo;{query}&rdquo;
          </CommandEmpty>
        )}

        {/* Results */}
        {!isLoading && !error && results.length > 0 && (
          <CommandGroup>
            {results.map((district) => (
              <CommandItem
                key={district.districtId}
                value={district.districtId}
                onSelect={() => onSelect(district)}
                className="cursor-pointer py-2.5"
              >
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-sm">
                    {district.districtName}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {district.location} &middot;{' '}
                    {formatNumber(district.enrollment)} students
                  </span>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
        )}

        {/* Pre-search hint */}
        {!isLoading && !error && !hasSearched && query.length > 0 && query.length < 2 && (
          <div className="py-6 text-center text-sm text-muted-foreground">
            Type at least 2 characters to search
          </div>
        )}
      </CommandList>
    </Command>
  );
}
