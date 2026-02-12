'use client';

import { useState, useEffect } from 'react';
import type { FitAssessment } from '@/services/types/common';
import type { ProductSummary } from '@/services/types/product';

interface FitAssessmentPanelProps {
  districtId: string;
}

export function FitAssessmentPanel({ districtId }: FitAssessmentPanelProps) {
  const [products, setProducts] = useState<ProductSummary[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [assessment, setAssessment] = useState<FitAssessment | null>(null);
  const [loading, setLoading] = useState(false);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    // Fetch products on mount
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (response.ok) {
          const data = await response.json();
          setProducts(data.products || []);
        }
      } catch (error) {
        // Silently handle 404 or network errors - just show placeholder
        console.error('Failed to fetch products:', error);
      } finally {
        setProductsLoading(false);
      }
    }

    fetchProducts();
  }, []);

  const handleAssessFit = async () => {
    if (selectedProductIds.length === 0) return;

    setLoading(true);
    try {
      const response = await fetch(
        `/api/districts/${districtId}/fit?productIds=${selectedProductIds.join(',')}`
      );
      if (response.ok) {
        const data = await response.json();
        setAssessment(data);
      }
    } catch (error) {
      console.error('Failed to assess fit:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleProduct = (productId: string) => {
    setSelectedProductIds(prev =>
      prev.includes(productId)
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  const getBadgeColor = (category: string): string => {
    switch (category) {
      case 'strong':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="border rounded-lg p-6 bg-card">
      <h2 className="text-lg font-semibold font-heading mb-4">
        Product-District Fit Assessment
      </h2>

      {productsLoading ? (
        <p className="text-sm text-muted-foreground">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          No products available. Add products in Solutions Library to assess fit.
        </p>
      ) : (
        <>
          <div className="space-y-3 mb-4">
            {products.map(product => (
              <label
                key={product.productId}
                className="flex items-start gap-3 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedProductIds.includes(product.productId)}
                  onChange={() => toggleProduct(product.productId)}
                  className="mt-1"
                />
                <div>
                  <div className="font-medium text-sm">{product.name}</div>
                  <div className="text-xs text-muted-foreground">
                    {product.description}
                  </div>
                </div>
              </label>
            ))}
          </div>

          <button
            onClick={handleAssessFit}
            disabled={selectedProductIds.length === 0 || loading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Assessing...' : 'Assess Fit'}
          </button>

          {assessment && (
            <div className="mt-6 pt-6 border-t">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium">Fit Category:</span>
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${getBadgeColor(
                    assessment.fitCategory
                  )}`}
                >
                  {assessment.fitCategory.charAt(0).toUpperCase() +
                    assessment.fitCategory.slice(1)}
                </span>
              </div>
              <p className="text-sm text-foreground">{assessment.fitRationale}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
