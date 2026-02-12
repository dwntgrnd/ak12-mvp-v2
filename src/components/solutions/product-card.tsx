'use client';

import Link from 'next/link';
import type { ProductSummary } from '@/services/types/product';

interface ProductCardProps {
  product: ProductSummary;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      href={`/solutions/${product.productId}`}
      className="block border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-card"
    >
      <h3 className="font-semibold text-lg font-heading">
        {product.name}
      </h3>

      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
        {product.description}
      </p>

      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs">
          {product.gradeRange}
        </span>

        <span className="rounded-full bg-secondary/10 text-secondary-foreground px-2 py-0.5 text-xs">
          {product.subjectArea}
        </span>

        {product.assetCount > 0 && (
          <span className="text-xs text-muted-foreground ml-auto">
            {product.assetCount} {product.assetCount === 1 ? 'asset' : 'assets'}
          </span>
        )}
      </div>
    </Link>
  );
}
