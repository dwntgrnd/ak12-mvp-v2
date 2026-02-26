'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { invalidatePlaybookCount } from '@/hooks/use-playbook-count';
import { Loader2, Info, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProductSelectionCard } from './product-selection-card';
import { DistrictSearchCombobox, type DistrictSearchResult } from './district-search-combobox';
import { DistrictResolvedCard } from './district-resolved-card';
import { cn } from '@/lib/utils';
import { useSavedDistricts } from '@/hooks/use-saved-districts';

interface ProductItem {
  productId: string;
  name: string;
  description: string;
  gradeRange: { gradeFrom: number; gradeTo: number };
  subjectArea: string;
}

interface InitialDistrict {
  districtId: string;
  districtName: string;
  location: string;
  enrollment: number;
}

export interface GeneratePlaybookSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialDistrict?: InitialDistrict;
  initialProductIds?: string[];
  /** Demo-only: simulate empty product catalog. Do not use in production code. */
  _demoEmptyCatalog?: boolean;
}

export function GeneratePlaybookSheet({
  open,
  onOpenChange,
  initialDistrict,
  initialProductIds,
  _demoEmptyCatalog,
}: GeneratePlaybookSheetProps) {
  const router = useRouter();
  const { isSaved, saveDistrict } = useSavedDistricts();

  // Product state
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<Set<string>>(
    new Set(initialProductIds || [])
  );

  // District state
  const [districtMode, setDistrictMode] = useState<'search' | 'resolved'>(
    initialDistrict ? 'resolved' : 'search'
  );
  const [selectedDistrict, setSelectedDistrict] = useState<InitialDistrict | null>(
    initialDistrict || null
  );

  // Submission state
  const [duplicateNotice, setDuplicateNotice] = useState<string | null>(null);
  const [duplicateDismissed, setDuplicateDismissed] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generateError, setGenerateError] = useState(false);

  // Refs for focus management
  const firstCardRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  // Derived
  const canGenerate =
    selectedProductIds.size > 0 && selectedDistrict !== null && !isGenerating;

  // Reset state when sheet opens
  useEffect(() => {
    if (open) {
      setSelectedProductIds(new Set(initialProductIds || []));
      setDistrictMode(initialDistrict ? 'resolved' : 'search');
      setSelectedDistrict(initialDistrict || null);
      setDuplicateNotice(null);
      setDuplicateDismissed(false);
      setIsGenerating(false);
      setGenerateError(false);
      setProductsLoading(true);
      setProductsError(false);
    }
  }, [open, initialDistrict, initialProductIds]);

  // Load product catalog on open
  useEffect(() => {
    if (!open) return;
    if (_demoEmptyCatalog) {
      setProducts([]);
      setProductsLoading(false);
      return;
    }

    let cancelled = false;

    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load products');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const items = (data.items || data) as ProductItem[];
        const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));
        setProducts(sorted);
        setProductsLoading(false);
      })
      .catch(() => {
        if (cancelled) return;
        setProductsError(true);
        setProductsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, _demoEmptyCatalog]);

  // Focus management after products load
  useEffect(() => {
    if (!open || productsLoading || productsError) return;

    const timer = setTimeout(() => {
      if (initialDistrict) {
        firstCardRef.current?.focus();
      }
      // Otherwise district combobox auto-focuses via autoFocus prop
    }, 100);

    return () => clearTimeout(timer);
  }, [open, productsLoading, productsError, initialDistrict]);

  // Duplicate detection
  useEffect(() => {
    setDuplicateDismissed(false);
    if (selectedProductIds.size === 0 || !selectedDistrict) {
      setDuplicateNotice(null);
      return;
    }

    let cancelled = false;

    fetch(`/api/districts/${selectedDistrict.districtId}/playbooks`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to check');
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;
        const existing = data.items || data;
        if (Array.isArray(existing) && existing.length > 0) {
          const overlapping = existing.filter(
            (pb: { productIds?: string[] }) =>
              pb.productIds?.some((id: string) => selectedProductIds.has(id))
          );
          if (overlapping.length > 0) {
            const productNames = products
              .filter((p) => selectedProductIds.has(p.productId))
              .map((p) => p.name);
            const productStr =
              productNames.length === 1
                ? productNames[0]
                : productNames.slice(0, -1).join(', ') +
                  ' and ' +
                  productNames[productNames.length - 1];
            setDuplicateNotice(
              `You already have a playbook for ${productStr} at ${selectedDistrict.districtName}. You can generate a fresh one, but the existing playbook will remain as-is.`
            );
          } else {
            setDuplicateNotice(null);
          }
        } else {
          setDuplicateNotice(null);
        }
      })
      .catch(() => {
        if (!cancelled) setDuplicateNotice(null);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedProductIds, selectedDistrict, products]);

  // Handlers
  function handleProductToggle(productId: string) {
    setSelectedProductIds((prev) => {
      const next = new Set(prev);
      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }
      return next;
    });
  }

  function handleDistrictSelect(district: DistrictSearchResult) {
    setSelectedDistrict(district);
    setDistrictMode('resolved');
  }

  function handleDistrictChange() {
    setDistrictMode('search');
    setSelectedDistrict(null);
    setDuplicateNotice(null);
  }

  function handleRetryProducts() {
    setProductsError(false);
    setProductsLoading(true);
    fetch('/api/products')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load products');
        return res.json();
      })
      .then((data) => {
        const items = (data.items || data) as ProductItem[];
        const sorted = [...items].sort((a, b) => a.name.localeCompare(b.name));
        setProducts(sorted);
        setProductsLoading(false);
      })
      .catch(() => {
        setProductsError(true);
        setProductsLoading(false);
      });
  }

  async function handleGenerate() {
    if (!canGenerate || !selectedDistrict) return;
    setIsGenerating(true);
    setGenerateError(false);

    try {
      const res = await fetch('/api/playbooks/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          districtId: selectedDistrict.districtId,
          productIds: Array.from(selectedProductIds),
        }),
      });

      if (!res.ok) throw new Error('Generation failed');
      const data = await res.json();
      const playbookId = data.playbookId;
      invalidatePlaybookCount();
      if (selectedDistrict && !isSaved(selectedDistrict.districtId)) {
        saveDistrict(selectedDistrict.districtId).catch(() => {});
      }
      router.push(`/districts/${selectedDistrict.districtId}/playbooks/${playbookId}`);
      onOpenChange(false);
    } catch {
      setGenerateError(true);
      setIsGenerating(false);
    }
  }

  // Confirmation summary
  const getConfirmationSummary = useCallback((): {
    text: string;
    complete: boolean;
    parts?: { productStr: string; districtName: string };
  } => {
    const productNames = products
      .filter((p) => selectedProductIds.has(p.productId))
      .map((p) => p.name);

    if (productNames.length === 0 && !selectedDistrict) {
      return { text: 'Search for a district to get started', complete: false };
    }
    if (productNames.length === 0) {
      return { text: 'Now choose at least one product', complete: false };
    }
    if (!selectedDistrict) {
      return { text: 'Search for a district first', complete: false };
    }

    const productStr =
      productNames.length === 1
        ? productNames[0]
        : productNames.slice(0, -1).join(', ') +
          ' and ' +
          productNames[productNames.length - 1];

    return {
      text: `Generate a playbook for ${productStr} at ${selectedDistrict.districtName}`,
      complete: true,
      parts: { productStr, districtName: selectedDistrict.districtName },
    };
  }, [products, selectedProductIds, selectedDistrict]);

  const summary = getConfirmationSummary();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-xl max-h-[85vh] flex flex-col p-0 gap-0 top-[10vh] translate-y-0"
      >
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-5 shrink-0">
          <DialogTitle className="text-lg font-semibold">
            Generate Sales Playbook
          </DialogTitle>
          <DialogDescription className="text-sm text-foreground-secondary mt-1">
            Find your target district, then choose your products — we&apos;ll generate a conversation-ready playbook with district context, evidence, and talking points.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto px-6 pb-4">
         <div className="space-y-10">
          {/* Section A: District */}
          <div>
            <p className="text-sm font-medium text-foreground-secondary mb-3">
              Which district are you meeting with?
            </p>

            {districtMode === 'search' ? (
              <DistrictSearchCombobox
                onSelect={handleDistrictSelect}
                autoFocus={!initialDistrict}
              />
            ) : selectedDistrict ? (
              <DistrictResolvedCard
                district={selectedDistrict}
                onChangeClick={handleDistrictChange}
              />
            ) : null}
          </div>

          {/* Section B: Products */}
          <div className={cn(
            'transition-opacity duration-200',
            !selectedDistrict && products.length > 0 && 'opacity-40 pointer-events-none'
          )}>
            <p className="text-sm font-medium text-foreground-secondary mb-3">
              Which products are you presenting?
            </p>

            {productsLoading && (
              <div className="space-y-2">
                <Skeleton className="h-14 w-full rounded-lg" />
                <Skeleton className="h-14 w-full rounded-lg" />
                <Skeleton className="h-14 w-full rounded-lg" />
              </div>
            )}

            {productsError && (
              <div className="text-center py-6">
                <p className="text-sm text-destructive mb-2">
                  We couldn&apos;t load your products right now.
                </p>
                <Button variant="outline" size="sm" onClick={handleRetryProducts}>
                  Retry
                </Button>
              </div>
            )}

            {!productsLoading && !productsError && products.length === 0 && (
              <div className="text-center py-8 space-y-3">
                <p className="text-sm text-foreground-secondary">
                  You&apos;ll need products in your Solutions Library before generating a playbook.
                </p>
                <Button
                  variant="outline"
                  onClick={() => {
                    onOpenChange(false);
                    router.push('/solutions');
                  }}
                >
                  Add Products
                </Button>
              </div>
            )}

            {!productsLoading && !productsError && products.length > 0 && (
              <div className="space-y-3">
                {products.map((product, index) => (
                  <div
                    key={product.productId}
                    ref={index === 0 ? firstCardRef : undefined}
                  >
                    <ProductSelectionCard
                      product={product}
                      selected={selectedProductIds.has(product.productId)}
                      onToggle={handleProductToggle}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
         </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t px-6 py-5 space-y-4">
          {/* Confirmation summary */}
          <p
            aria-live="polite"
            className={cn(
              'text-sm transition-opacity duration-150',
              summary.complete ? 'text-foreground' : 'text-foreground-secondary'
            )}
          >
            {summary.complete && summary.parts ? (
              <>
                Generate a playbook for{' '}
                <strong>{summary.parts.productStr}</strong> at{' '}
                <strong>{summary.parts.districtName}</strong>
              </>
            ) : (
              summary.text
            )}
          </p>

          {/* Generation error */}
          {generateError && (
            <Alert variant="destructive">
              <AlertDescription>
                Something went wrong generating your playbook. Try again — your selections are still here.
              </AlertDescription>
            </Alert>
          )}

          {/* Duplicate notice */}
          {duplicateNotice && !duplicateDismissed && (
            <Alert className="relative">
              <Info className="h-4 w-4" />
              <AlertDescription className="pr-8">{duplicateNotice}</AlertDescription>
              <button
                type="button"
                onClick={() => setDuplicateDismissed(true)}
                className="absolute top-3 right-3 text-foreground-secondary hover:text-foreground transition-colors"
                aria-label="Dismiss notice"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Alert>
          )}

          {/* Generate button — hidden when catalog is empty */}
          {(products.length > 0 || productsLoading) && (
            <Button
              className="w-full"
              size="lg"
              disabled={!canGenerate}
              aria-disabled={!canGenerate}
              aria-busy={isGenerating}
              onClick={handleGenerate}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Generating your playbook...
                </>
              ) : (
                'Generate Playbook'
              )}
            </Button>
          )}

          {/* Cancel */}
          <Button
            variant="ghost"
            className="w-full text-sm text-foreground-secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
