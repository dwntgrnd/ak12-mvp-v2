'use client';

import { cn } from '@/lib/utils';
import { matchTierColors } from '@/lib/design-tokens';
import type { MatchSummary } from '@/services/types/common';
import { useProductLens } from '@/hooks/use-product-lens';
import { useLibraryReadiness } from '@/hooks/use-library-readiness';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';

interface LensControlBarProps {
  districtId: string;
  matchSummary?: MatchSummary | null;
}

export function LensControlBar({ matchSummary }: LensControlBarProps) {
  const { activeProduct, setProduct, clearProduct, isLensActive } = useProductLens();
  const readiness = useLibraryReadiness();

  const handleValueChange = (value: string) => {
    if (value === '__clear__') {
      clearProduct();
      return;
    }
    const product = readiness.products.find(p => p.productId === value);
    if (product) setProduct(product);
  };

  return (
    <div className="flex items-center justify-between py-3 border-b border-border-subtle">
      {/* Product selector (left) */}
      <div>
        {readiness.loading ? (
          <Skeleton className="h-9 w-72" />
        ) : (
          <Select
            value={activeProduct?.productId ?? ''}
            onValueChange={handleValueChange}
          >
            <SelectTrigger className="w-72">
              <SelectValue placeholder="Select a product to explore fit\u2026" />
            </SelectTrigger>
            <SelectContent>
              {isLensActive && (
                <SelectItem value="__clear__">
                  <span className="text-foreground-secondary">Clear selection</span>
                </SelectItem>
              )}
              {readiness.products.map(p => (
                <SelectItem key={p.productId} value={p.productId}>
                  {p.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Fit indicator (right) */}
      {isLensActive && matchSummary && (
        <div className="flex items-center gap-2">
          <span
            className={cn(
              'inline-flex items-center rounded-md px-2 py-0.5 text-xs font-medium',
              matchTierColors[matchSummary.overallTier].bg,
              matchTierColors[matchSummary.overallTier].text,
            )}
          >
            {matchTierColors[matchSummary.overallTier].label}
          </span>
          <span className="text-sm text-foreground-secondary">
            {matchSummary.headline}
          </span>
        </div>
      )}
    </div>
  );
}
