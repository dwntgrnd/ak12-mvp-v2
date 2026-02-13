'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, Info } from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ProductSelectionCard } from './product-selection-card';
import { DistrictSearchCombobox, type DistrictSearchResult } from './district-search-combobox';
import { DistrictResolvedCard } from './district-resolved-card';
import { cn } from '@/lib/utils';

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
}

export function GeneratePlaybookSheet({
  open,
  onOpenChange,
  initialDistrict,
  initialProductIds,
}: GeneratePlaybookSheetProps) {
  const router = useRouter();

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
      setIsGenerating(false);
      setGenerateError(false);
      setProductsLoading(true);
      setProductsError(false);
    }
  }, [open, initialDistrict, initialProductIds]);

  // Load product catalog on open
  useEffect(() => {
    if (!open) return;

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
  }, [open]);

  // Focus management after products load
  useEffect(() => {
    if (!open || productsLoading || productsError) return;

    const timer = setTimeout(() => {
      // If district is pre-filled, focus first product card
      // If products are pre-filled, district search will auto-focus via prop
      // If neither (cold start), focus first product card
      if (initialDistrict || !initialProductIds?.length) {
        firstCardRef.current?.focus();
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [open, productsLoading, productsError, initialDistrict, initialProductIds]);

  // Duplicate detection
  useEffect(() => {
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
              `A playbook already exists for ${selectedDistrict.districtName} with ${productStr}. Generating a new one will create a separate version.`
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
      router.push(`/playbooks/${playbookId}`);
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
      return { text: 'Select products and a district to continue', complete: false };
    }
    if (productNames.length === 0) {
      return { text: 'Select at least one product to continue', complete: false };
    }
    if (!selectedDistrict) {
      return { text: 'Select a district to continue', complete: false };
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-[480px] flex flex-col p-0"
      >
        {/* Header */}
        <SheetHeader className="px-6 pt-6 pb-4 shrink-0">
          <SheetTitle className="text-lg font-semibold">
            Generate Playbook
          </SheetTitle>
          <SheetDescription className="sr-only">
            Select products and a district to generate a sales playbook.
          </SheetDescription>
        </SheetHeader>

        {/* Scrollable content */}
        <div ref={contentRef} className="flex-1 overflow-y-auto px-6 pb-4">
          {/* Section A: Products */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
              Products
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
                  Couldn&apos;t load products
                </p>
                <Button variant="outline" size="sm" onClick={handleRetryProducts}>
                  Retry
                </Button>
              </div>
            )}

            {!productsLoading && !productsError && (
              <div className="space-y-2">
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

          {/* Section gap */}
          <div className="mt-8" />

          {/* Section B: District */}
          <div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground font-medium mb-2">
              District
            </p>

            {districtMode === 'search' ? (
              <DistrictSearchCombobox
                onSelect={handleDistrictSelect}
                autoFocus={!!initialProductIds?.length && !initialDistrict}
              />
            ) : selectedDistrict ? (
              <DistrictResolvedCard
                district={selectedDistrict}
                onChangeClick={handleDistrictChange}
              />
            ) : null}
          </div>
        </div>

        {/* Footer */}
        <div className="shrink-0 border-t px-6 py-4 space-y-3">
          {/* Confirmation summary */}
          <p
            aria-live="polite"
            className={cn(
              'text-sm transition-opacity duration-150',
              summary.complete ? 'text-foreground' : 'text-muted-foreground'
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
                Playbook generation failed. Please try again.
              </AlertDescription>
            </Alert>
          )}

          {/* Duplicate notice */}
          {duplicateNotice && (
            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>{duplicateNotice}</AlertDescription>
            </Alert>
          )}

          {/* Generate button */}
          <Button
            className="w-full h-12 bg-[#FF7000] hover:bg-[#E56400] text-white"
            disabled={!canGenerate}
            aria-disabled={!canGenerate}
            aria-busy={isGenerating}
            onClick={handleGenerate}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              'Generate Playbook'
            )}
          </Button>

          {/* Cancel */}
          <Button
            variant="ghost"
            className="w-full text-sm text-muted-foreground"
            onClick={() => onOpenChange(false)}
          >
            Cancel
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
