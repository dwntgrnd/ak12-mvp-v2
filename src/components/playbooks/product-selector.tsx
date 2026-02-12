'use client';

import { useEffect, useState } from 'react';
import type { ProductSummary } from '@/services/types/product';

interface ProductSelectorProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export function ProductSelector({ selectedIds, onSelectionChange }: ProductSelectorProps) {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('/api/products');

        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }

        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const toggleProduct = (productId: string) => {
    if (selectedIds.includes(productId)) {
      onSelectionChange(selectedIds.filter((id) => id !== productId));
    } else {
      onSelectionChange([...selectedIds, productId]);
    }
  };

  if (loading) {
    return (
      <div className="py-4">
        <p className="text-sm text-muted-foreground">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-4">
        <p className="text-sm text-red-600">{error}</p>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="py-4">
        <p className="text-sm text-muted-foreground">No products available</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-80 overflow-y-auto">
      {products.map((product) => (
        <label
          key={product.productId}
          className="flex items-start gap-3 p-3 border rounded-md hover:bg-gray-50 cursor-pointer transition-colors"
        >
          <input
            type="checkbox"
            checked={selectedIds.includes(product.productId)}
            onChange={() => toggleProduct(product.productId)}
            className="mt-1 h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
          />
          <div className="flex-1 min-w-0">
            <div className="font-medium text-sm">{product.name}</div>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              {product.gradeRange && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                  {product.gradeRange}
                </span>
              )}
              {product.subjectArea && (
                <span className="text-xs px-2 py-0.5 rounded-full bg-purple-100 text-purple-800">
                  {product.subjectArea}
                </span>
              )}
            </div>
          </div>
        </label>
      ))}
    </div>
  );
}
