'use client';

import { SearchBar } from '@/components/discovery/search-bar';
import { FilterSidebar } from '@/components/discovery/filter-sidebar';
import { DistrictResultCard } from '@/components/discovery/district-result-card';
import { Pagination } from '@/components/discovery/pagination';
import type { DistrictSummary, FilterFacet } from '@/services/types/district';
import type { PaginatedResponse } from '@/services/types/common';
import { useEffect, useState } from 'react';

export default function DiscoveryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<Record<string, string | number | string[]>>({});
  const [page, setPage] = useState(1);
  const [results, setResults] = useState<PaginatedResponse<DistrictSummary> | null>(null);
  const [facets, setFacets] = useState<FilterFacet[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch filter facets on mount
  useEffect(() => {
    const fetchFacets = async () => {
      try {
        const response = await fetch('/api/districts/filters');
        if (!response.ok) {
          throw new Error('Failed to load filters');
        }
        const data = await response.json();
        setFacets(data.facets || []);
      } catch (err) {
        console.error('Error loading facets:', err);
      }
    };

    fetchFacets();
  }, []);

  // Reset page to 1 when search query or filters change
  useEffect(() => {
    setPage(1);
  }, [searchQuery, filters]);

  // Fetch results whenever searchQuery, filters, or page changes
  useEffect(() => {
    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        // Build query params
        const params = new URLSearchParams();

        if (searchQuery) {
          params.set('q', searchQuery);
        }

        params.set('page', page.toString());
        params.set('pageSize', '25');

        // Add county filter
        if (filters.county && Array.isArray(filters.county) && filters.county.length > 0) {
          params.set('county', filters.county.join(','));
        }

        // Add enrollment filters
        if (filters.enrollmentMin) {
          params.set('enrollmentMin', filters.enrollmentMin.toString());
        }
        if (filters.enrollmentMax) {
          params.set('enrollmentMax', filters.enrollmentMax.toString());
        }

        const response = await fetch(`/api/districts?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to search districts');
        }

        const data = await response.json();
        setResults(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setResults(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [searchQuery, filters, page]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold font-heading">
        Discovery & Targeting
      </h1>
      <p className="text-muted-foreground mt-2">
        Search California districts and build your territory.
      </p>

      <div className="mt-6">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>

      <div className="mt-6 grid grid-cols-[280px_1fr] gap-6">
        {/* Left column: Filters */}
        <div className="bg-card border rounded-lg p-4">
          <FilterSidebar
            filters={filters}
            onFiltersChange={setFilters}
            facets={facets}
          />
        </div>

        {/* Right column: Results */}
        <div>
          {loading && (
            <p className="text-muted-foreground">Searching...</p>
          )}

          {error && (
            <p className="text-red-500">{error}</p>
          )}

          {!loading && !error && results && results.items.length === 0 && (
            <p className="text-muted-foreground">
              No districts found matching your search.
            </p>
          )}

          {!loading && !error && results && results.items.length > 0 && (
            <>
              <div className="grid grid-cols-1 gap-3">
                {results.items.map((district) => (
                  <DistrictResultCard key={district.districtId} district={district} />
                ))}
              </div>

              {results.totalPages > 1 && (
                <Pagination
                  page={results.page}
                  totalPages={results.totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}

          {!loading && !error && !results && (
            <p className="text-muted-foreground">
              Enter a search term or browse all districts.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
