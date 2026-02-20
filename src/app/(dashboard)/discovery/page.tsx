'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { DiscoveryEntryState } from '@/components/discovery/discovery-entry-state';
import { DiscoveryLoadingState } from '@/components/discovery/discovery-loading-state';
import { DiscoveryResultsLayout } from '@/components/discovery/discovery-results-layout';
import { getDiscoveryService } from '@/services';
import type { IDiscoveryService } from '@/services';
import type { DiscoveryQueryResponse } from '@/services/types/discovery';

type DiscoveryPageState = 'entry' | 'loading' | 'results';

export default function DiscoveryPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<DiscoveryPageState>('entry');
  const [activeQuery, setActiveQuery] = useState('');
  const [response, setResponse] = useState<DiscoveryQueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const serviceRef = useRef<IDiscoveryService | null>(null);

  async function getService(): Promise<IDiscoveryService> {
    if (!serviceRef.current) {
      serviceRef.current = await getDiscoveryService();
    }
    return serviceRef.current;
  }

  async function handleQuerySubmit(query: string) {
    setActiveQuery(query);
    setPageState('loading');
    setError(null);
    setResponse(null);

    try {
      const service = await getService();
      const result = await service.query({ query });
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
        />
      )}
    </>
  );
}
