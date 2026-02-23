'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { formatGradeRange } from '@/lib/utils/format';
import type { PaginatedResponse } from '@/services/types/common';
import type { ProductSummary } from '@/services/types/product';
import type { PlaybookSummary } from '@/services/types/playbook';

function getSubjectBadgeClasses(subject: string): string {
  const lower = subject.toLowerCase();
  if (lower.includes('math'))
    return 'bg-brand-blue/10 text-brand-blue border-brand-blue/30';
  if (lower.includes('english') || lower.includes('ela') || lower.includes('language arts'))
    return 'bg-brand-green/10 text-brand-green border-brand-green/30';
  return 'bg-surface-emphasis-neutral text-foreground-secondary border-border';
}

export default function SolutionsLibraryPage() {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [playbookCounts, setPlaybookCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [productsRes, playbooksRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/playbooks'),
        ]);

        if (!productsRes.ok) throw new Error('Failed to fetch products');
        if (!playbooksRes.ok) throw new Error('Failed to fetch playbooks');

        const productsData: PaginatedResponse<ProductSummary> = await productsRes.json();
        const playbooksData: PaginatedResponse<PlaybookSummary> = await playbooksRes.json();

        setProducts(productsData.items);

        const counts: Record<string, number> = {};
        for (const playbook of playbooksData.items) {
          for (const pid of playbook.productIds) {
            counts[pid] = (counts[pid] || 0) + 1;
          }
        }
        setPlaybookCounts(counts);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  return (
    <div className="max-w-content">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-[-0.01em] text-foreground">
          Solutions Library
        </h1>
        <p className="text-sm text-foreground-secondary mt-1">
          Your product catalog — the foundation for matching and playbook generation.
        </p>
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
        </div>
      )}

      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="rounded-lg border border-border-default bg-card p-5">
              <Skeleton className="h-5 w-24 mb-3" />
              <Skeleton className="h-5 w-48 mb-2" />
              <Skeleton className="h-4 w-32 mb-3" />
              <Skeleton className="h-16 w-full mb-3" />
              <div className="border-t border-border-subtle mt-3 pt-3">
                <Skeleton className="h-4 w-28" />
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && products.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Package className="h-12 w-12 text-foreground-tertiary mb-4" />
          <h2 className="text-lg font-semibold text-foreground tracking-[-0.01em]">
            No products yet
          </h2>
          <p className="text-sm text-foreground-secondary mt-1 max-w-md">
            Add products to your solutions library to start generating playbooks and matching with districts.
          </p>
        </div>
      )}

      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6" role="list">
          {products.map((product) => {
            const count = playbookCounts[product.productId] || 0;
            const gradeText = `Grades ${formatGradeRange(product.gradeRange.gradeFrom, product.gradeRange.gradeTo)}`;
            const countText = count > 0 ? `${count} playbook${count !== 1 ? 's' : ''}` : 'No playbooks yet';

            return (
              <Link
                key={product.productId}
                href={`/solutions/${product.productId}`}
                role="listitem"
                aria-label={`${product.name}, ${product.subjectArea}, ${gradeText}, ${countText}`}
                className="rounded-lg border border-border-default bg-card p-5 hover:shadow-md hover:border-border-default transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 block"
              >
                <Badge
                  variant="outline"
                  className={`text-xs font-medium ${getSubjectBadgeClasses(product.subjectArea)}`}
                >
                  {product.subjectArea}
                </Badge>

                <h2 className="text-lg font-semibold text-foreground tracking-[-0.01em] mt-2">
                  {product.name}
                </h2>

                <p className="text-sm text-foreground-secondary mt-0.5">
                  {gradeText}
                </p>

                <p className="text-sm text-foreground-secondary leading-relaxed mt-2">
                  {product.description}
                </p>

                <div className="border-t border-border-subtle mt-3 pt-3 flex items-center gap-1.5">
                  <FileText className="h-3.5 w-3.5 text-foreground-tertiary" />
                  <span className="text-xs text-foreground-tertiary">{countText}</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
