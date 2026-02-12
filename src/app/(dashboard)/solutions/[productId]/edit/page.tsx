'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProductForm } from '@/components/solutions/product-form';
import type { Product } from '@/services/types/product';

export default function EditProductPage() {
  const params = useParams();
  const productId = params.productId as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`/api/products/${productId}`);

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Product not found');
          }
          throw new Error('Failed to load product');
        }

        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <p className="text-muted-foreground">Loading product...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Link
          href="/solutions"
          className="text-sm text-primary hover:underline flex items-center gap-1 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Solutions
        </Link>
        <p className="text-red-500">{error || 'Product not found'}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back navigation */}
      <Link
        href={`/solutions/${productId}`}
        className="text-sm text-primary hover:underline flex items-center gap-1 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Product
      </Link>

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold font-heading">
          Edit Product
        </h1>
        <p className="text-muted-foreground mt-2">
          {product.name}
        </p>
      </div>

      {/* Product form */}
      <ProductForm
        mode="edit"
        productId={productId}
        initialData={{
          name: product.name,
          description: product.description,
          gradeRange: product.gradeRange,
          subjectArea: product.subjectArea,
          keyFeatures: product.keyFeatures || [],
          targetChallenges: product.targetChallenges || [],
          competitiveDifferentiators: product.competitiveDifferentiators || [],
          approvedMessaging: product.approvedMessaging || [],
        }}
      />
    </div>
  );
}
