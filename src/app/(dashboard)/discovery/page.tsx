'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DiscoveryEntryState } from '@/components/discovery/discovery-entry-state';

type DiscoveryPageState = 'entry' | 'loading' | 'results';

export default function DiscoveryPage() {
  const router = useRouter();
  const [pageState, setPageState] = useState<DiscoveryPageState>('entry');
  const [activeQuery, setActiveQuery] = useState('');

  function handleQuerySubmit(query: string) {
    setActiveQuery(query);
    setPageState('loading');
    // Phase 9C: call discoveryService.query() here
  }

  function handleDirectNavigation(districtId: string) {
    router.push(`/districts/${districtId}`);
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
        <div className="flex items-center justify-center py-24">
          <p className="text-sm text-muted-foreground">Processing query...</p>
        </div>
      )}

      {pageState === 'results' && (
        <div className="flex items-center justify-center py-24">
          <p className="text-sm text-muted-foreground">
            Results for: &ldquo;{activeQuery}&rdquo; — Phase 9C
          </p>
        </div>
      )}
    </>
  );
}
