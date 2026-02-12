'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ProductForm } from '@/components/solutions/product-form';

export default function CreateProductPage() {
  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back navigation */}
      <Link
        href="/solutions"
        className="text-sm text-primary hover:underline flex items-center gap-1 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Solutions
      </Link>

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold font-heading">
          Create New Product
        </h1>
        <p className="text-muted-foreground mt-2">
          Add a new product to your catalog.
        </p>
      </div>

      {/* Product form */}
      <ProductForm mode="create" />
    </div>
  );
}
