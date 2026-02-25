'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { modeColors, matchTierColors } from '@/lib/design-tokens';
import type { ModeKey } from '@/lib/design-tokens';
import type { MatchSummary } from '@/services/types/common';
import type { ProductLensSummary } from '@/services/types/product';
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

interface ModeBarProps {
  districtId: string;
  districtName: string;
  activePlaybookId?: string;
  activePlaybookName?: string;
  activePlaybookStatus?: string;
  isPreviewActive?: boolean;
  onGeneratePlaybook?: () => void;
  matchSummary?: MatchSummary | null;
  onManagePlaybook?: () => void;
}

export function ModeBar({
  districtId,
  activePlaybookId,
  activePlaybookName,
  isPreviewActive = false,
  onGeneratePlaybook,
  matchSummary,
  onManagePlaybook,
}: ModeBarProps) {
  const { activeProduct, clearProduct, isLensActive } = useProductLens();
  const readiness = useLibraryReadiness();

  let mode: ModeKey;
  if (activePlaybookId) {
    mode = 'playbook';
  } else if (isLensActive) {
    mode = 'lens';
  } else {
    mode = 'neutral';
  }

  const colors = modeColors[mode];

  return (
    <div
      className={cn(
        'flex h-12 items-center gap-4 px-4',
        mode === 'neutral' && 'border-b border-border-default',
        mode === 'lens' && 'border-b-2 border-[#03C4D4]/40 bg-[#03C4D4]/5',
        mode === 'playbook' && 'border-b-2 border-[#00DE9C]/40 bg-[#00DE9C]/5',
      )}
    >
      {/* Left — Mode indicator */}
      <div className="flex items-center gap-2 shrink-0">
        {mode === 'neutral' && (
          <span className="text-sm font-semibold text-foreground">
            District Intelligence
          </span>
        )}
        {mode === 'lens' && (
          <>
            <span className={cn('text-sm font-semibold', colors.text)}>
              {activeProduct?.name} Lens
            </span>
            <button
              onClick={clearProduct}
              className="rounded p-0.5 hover:bg-surface-inset"
              aria-label="Dismiss lens"
            >
              <X className="h-3.5 w-3.5 text-foreground-secondary" />
            </button>
          </>
        )}
        {mode === 'playbook' && (
          <>
            <span className={cn('text-sm font-semibold', colors.text)}>
              Playbook: {activePlaybookName}
            </span>
            <Link
              href={`/districts/${districtId}`}
              className="text-xs text-foreground-secondary underline decoration-foreground-tertiary underline-offset-2 hover:text-foreground"
            >
              Back to District
            </Link>
          </>
        )}
      </div>

      {/* Center — Lens picker (neutral + lens modes only) */}
      {mode !== 'playbook' && (
        <div className="shrink-0">
          {readiness.loading ? (
            <Skeleton className="h-9 w-56" />
          ) : (
            <LensPicker
              products={readiness.products}
              activeProductId={activeProduct?.productId ?? ''}
              isLensActive={isLensActive}
              disabled={isPreviewActive}
            />
          )}
        </div>
      )}

      {/* Center-right — Fit indicator (lens mode only) */}
      {mode === 'lens' && matchSummary && (
        <div className="flex items-center gap-2 shrink-0">
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

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right — Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {mode === 'neutral' && (
          <Button size="sm" disabled>
            Generate Playbook
          </Button>
        )}
        {mode === 'lens' && (
          <Button
            size="sm"
            onClick={onGeneratePlaybook}
            disabled={isPreviewActive}
          >
            Generate Playbook
          </Button>
        )}
        {mode === 'playbook' && (
          <Button
            variant="outline"
            size="sm"
            onClick={onManagePlaybook}
          >
            Manage Playbook
          </Button>
        )}
      </div>
    </div>
  );
}

/** Extracted lens picker to keep ModeBar clean */
function LensPicker({
  products,
  activeProductId,
  isLensActive,
  disabled,
}: {
  products: ProductLensSummary[];
  activeProductId: string;
  isLensActive: boolean;
  disabled?: boolean;
}) {
  const { setProduct, clearProduct } = useProductLens();

  const handleValueChange = (value: string) => {
    if (value === '__clear__') {
      clearProduct();
      return;
    }
    const product = products.find(p => p.productId === value);
    if (product) setProduct(product);
  };

  return (
    <Select
      value={activeProductId}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select a product lens\u2026" />
      </SelectTrigger>
      <SelectContent>
        {isLensActive && (
          <SelectItem value="__clear__">
            <span className="text-foreground-secondary">Clear selection</span>
          </SelectItem>
        )}
        {products.map(p => (
          <SelectItem key={p.productId} value={p.productId}>
            {p.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
