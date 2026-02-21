'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DiscoveryEntryState } from '@/components/discovery/discovery-entry-state';
import { DiscoveryLoadingState } from '@/components/discovery/discovery-loading-state';
import { DiscoveryResultsLayout } from '@/components/discovery/discovery-results-layout';
import { getDiscoveryService, getProductService } from '@/services';
import type { IDiscoveryService, IProductService } from '@/services';
import type { DiscoveryQueryResponse } from '@/services/types/discovery';

type DiscoveryPageState = 'entry' | 'loading' | 'results';

export default function DiscoveryPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<DiscoveryPageState>('entry');
  const [activeQuery, setActiveQuery] = useState('');
  const [response, setResponse] = useState<DiscoveryQueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [productLensId, setProductLensId] = useState<string | undefined>(undefined);
  const [products, setProducts] = useState<Array<{ productId: string; name: string }>>([]);

  const serviceRef = useRef<IDiscoveryService | null>(null);
  const productServiceRef = useRef<IProductService | null>(null);

  async function getService(): Promise<IDiscoveryService> {
    if (!serviceRef.current) {
      serviceRef.current = await getDiscoveryService();
    }
    return serviceRef.current;
  }

  useEffect(() => {
    async function loadProducts() {
      try {
        if (!productServiceRef.current) {
          productServiceRef.current = await getProductService();
        }
        const result = await productServiceRef.current.getProducts();
        setProducts(result.items.map((p) => ({ productId: p.productId, name: p.name })));
      } catch {
        setProducts([]);
      }
    }
    loadProducts();
  }, []);

  async function handleQuerySubmit(query: string) {
    setActiveQuery(query);
    setPageState('loading');
    setError(null);
    setResponse(null);

    try {
      const service = await getService();
      const result = await service.query({ query, productLensId });
      setResponse(result);
      setPageState('results');
    } catch (err: unknown) {
      const message =
        err && typeof err === 'object' && 'message' in err
          ? (err as { message: string }).message
          : 'An unexpected error occurred. Please try again.';
      setError(message);
      setPageState('results');
    }
  }

  function handleDirectNavigation(districtId: string) {
    router.push(`/districts/${districtId}`);
  }

  function handleClearResults() {
    setActiveQuery('');
    setResponse(null);
    setError(null);
    setPageState('entry');
    // productLensId intentionally NOT reset — lens persists across query clears
  }

  return (
    <>
      {pageState === 'entry' && (
        <DiscoveryEntryState
          onQuerySubmit={handleQuerySubmit}
          onDirectNavigation={handleDirectNavigation}
        />
      )}

      {pageState === 'loading' && (
        <DiscoveryLoadingState query={activeQuery} />
      )}

      {pageState === 'results' && (
        <DiscoveryResultsLayout
          query={activeQuery}
          response={response}
          error={error}
          onNewQuery={handleQuerySubmit}
          onDirectNavigation={handleDirectNavigation}
          onClearResults={handleClearResults}
          products={products}
          productLensId={productLensId}
          onProductLensChange={setProductLensId}
        />
      )}
    </>
  );
}
