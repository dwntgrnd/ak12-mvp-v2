'use client';

import { X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

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
  variant = 'full',
}: ProductLensSelectorProps) {
  if (products.length === 0) return null;

  const selectedProduct = products.find((p) => p.productId === selectedProductId);

  return (
    <div className="flex items-center gap-2">
      <Select
        value={selectedProductId ?? '__none__'}
        onValueChange={(value) =>
          onProductChange(value === '__none__' ? undefined : value)
        }
      >
        <SelectTrigger
          className={variant === 'full' ? 'w-56' : 'w-48'}
          aria-label="Product lens"
        >
          <SelectValue placeholder="Product lens" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="__none__">No product lens</SelectItem>
          {products.map((p) => (
            <SelectItem key={p.productId} value={p.productId}>
              {p.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* Active lens chip — visible indicator with clear action */}
      {selectedProduct && (
        <Badge
          variant="secondary"
          className="pl-2.5 pr-1.5 py-1 gap-1 text-xs font-medium bg-[#E0F9FC] text-foreground border-0 hover:bg-[#CFFAFE] transition-colors"
        >
          {selectedProduct.name}
          <button
            type="button"
            onClick={() => onProductChange(undefined)}
            className="ml-0.5 rounded-full p-0.5 hover:bg-slate-200/60 transition-colors"
            aria-label={`Remove ${selectedProduct.name} product lens`}
          >
            <X className="w-3 h-3" />
          </button>
        </Badge>
      )}
    </div>
  );
}
