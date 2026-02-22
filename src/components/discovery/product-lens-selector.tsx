'use client';

import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductLensSelectorProps {
  products: Array<{ productId: string; name: string }>;
  selectedProductId: string | undefined;
  onProductChange: (productId: string | undefined) => void;
  variant?: 'full' | 'compact';
}

export function ProductLensSelector({
  products,
  selectedProductId,
  onProductChange,
}: ProductLensSelectorProps) {
  if (products.length === 0) return null;

  return (
    <div className="flex items-center gap-1.5">
      <Select
        value={selectedProductId}
        onValueChange={(value) => onProductChange(value)}
      >
        <SelectTrigger
          className="w-auto min-w-[160px]"
          aria-label="Select product lens"
        >
          <SelectValue placeholder="Product lens" />
        </SelectTrigger>
        <SelectContent>
          {products.map((p) => (
            <SelectItem key={p.productId} value={p.productId}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {selectedProductId && (
        <button
          type="button"
          onClick={() => onProductChange(undefined)}
          className="rounded-full p-1 text-muted-foreground hover:text-foreground hover:bg-slate-100 transition-colors"
          aria-label="Clear product lens"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
