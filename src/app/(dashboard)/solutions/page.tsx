'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { ProductSummary } from '@/services/types/product';
import { ProductCard } from '@/components/solutions/product-card';
import { ProductFilters } from '@/components/solutions/product-filters';

export default function SolutionsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const [filters, setFilters] = useState<{ gradeRange?: string; subjectArea?: string }>({});
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce search query by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch products when debounced query or filters change
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (debouncedQuery) {
          params.set('q', debouncedQuery);
        }

        if (filters.gradeRange) {
          params.set('gradeRange', filters.gradeRange);
        }

        if (filters.subjectArea) {
          params.set('subjectArea', filters.subjectArea);
        }

        const response = await fetch(`/api/products?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to load products');
        }

        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [debouncedQuery, filters]);

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold font-heading">Solutions Library</h1>
          <p className="text-muted-foreground mt-2">
            Browse and discover products by grade range and subject area.
          </p>
        </div>
        <Link
          href="/solutions/new"
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
        >
          New Product
        </Link>
      </div>

      <div className="mt-6">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-md border border-input bg-background px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      <div className="mt-4">
        <ProductFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      <div className="mt-6">
        {loading && (
          <p className="text-muted-foreground">Loading products...</p>
        )}

        {error && (
          <p className="text-red-500">{error}</p>
        )}

        {!loading && !error && products.length === 0 && (
          <p className="text-muted-foreground">
            No products found. Try adjusting your filters or search query.
          </p>
        )}

        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <ProductCard key={product.productId} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
