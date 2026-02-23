'use client';

import { useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { DiscoveryEntryState } from '@/components/discovery/discovery-entry-state';
import { DiscoveryLoadingState } from '@/components/discovery/discovery-loading-state';
import { DiscoveryResultsLayout } from '@/components/discovery/discovery-results-layout';
import { GeneratePlaybookSheet } from '@/components/playbook/generate-playbook-sheet';
import { LibraryRequiredDialog } from '@/components/shared/library-required-dialog';
import { useLibraryReadiness } from '@/hooks/use-library-readiness';
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
  const [productLensId, setProductLensId] = useState<string | undefined>(undefined);

  // Library readiness — session-cached
  const readiness = useLibraryReadiness();
  const products = readiness.products.map((p) => ({ productId: p.productId, name: p.name }));

  // Saved districts — optimistic local state
  const [savedDistricts, setSavedDistricts] = useState<Set<string>>(new Set());

  // Playbook sheet state
  const [playbookOpen, setPlaybookOpen] = useState(false);
  const [playbookDistrictId, setPlaybookDistrictId] = useState<string | null>(null);

  // Library required dialog state
  const [showLibraryDialog, setShowLibraryDialog] = useState(false);

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

  const handleSaveDistrict = useCallback(async (districtId: string) => {
    setSavedDistricts((prev) => new Set(prev).add(districtId));
    try {
      const res = await fetch(`/api/districts/${districtId}/save`, { method: 'POST' });
      if (!res.ok) setSavedDistricts((prev) => { const next = new Set(prev); next.delete(districtId); return next; });
    } catch {
      setSavedDistricts((prev) => { const next = new Set(prev); next.delete(districtId); return next; });
    }
  }, []);

  const handleRemoveSaved = useCallback(async (districtId: string) => {
    setSavedDistricts((prev) => { const next = new Set(prev); next.delete(districtId); return next; });
    try {
      const res = await fetch(`/api/districts/${districtId}/save`, { method: 'DELETE' });
      if (!res.ok) setSavedDistricts((prev) => new Set(prev).add(districtId));
    } catch {
      setSavedDistricts((prev) => new Set(prev).add(districtId));
    }
  }, []);

  const handleGeneratePlaybook = useCallback((districtId: string) => {
    if (!readiness.hasProducts) {
      setShowLibraryDialog(true);
      return;
    }
    setPlaybookDistrictId(districtId);
    setPlaybookOpen(true);
  }, [readiness.hasProducts]);

  // Resolve playbook district info from response data
  const playbookDistrictInfo = playbookDistrictId
    ? getDistrictInfoFromResponse(response, playbookDistrictId)
    : undefined;

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
          hasProducts={readiness.hasProducts}
          savedDistricts={savedDistricts}
          onSaveDistrict={handleSaveDistrict}
          onRemoveSaved={handleRemoveSaved}
          onGeneratePlaybook={handleGeneratePlaybook}
        />
      )}

      {/* Generate Playbook sheet */}
      <GeneratePlaybookSheet
        open={playbookOpen}
        onOpenChange={setPlaybookOpen}
        initialDistrict={
          playbookDistrictId
            ? {
                districtId: playbookDistrictId,
                districtName: playbookDistrictInfo?.name ?? playbookDistrictId,
                location: playbookDistrictInfo?.location ?? '',
                enrollment: playbookDistrictInfo?.enrollment ?? 0,
              }
            : undefined
        }
        initialProductIds={productLensId ? [productLensId] : undefined}
      />

      {/* Library required dialog — shown when playbook CTA clicked without products */}
      <LibraryRequiredDialog
        open={showLibraryDialog}
        onOpenChange={setShowLibraryDialog}
      />
    </>
  );
}

/** Extract district info from response data for playbook sheet. */
function getDistrictInfoFromResponse(
  response: DiscoveryQueryResponse | null,
  districtId: string,
): { name: string; location: string; enrollment: number } | undefined {
  if (!response) return undefined;
  const { content } = response;
  if (content.format === 'ranked_list') {
    const entry = content.data.entries.find((e) => e.districtId === districtId);
    if (entry) {
      return {
        name: entry.snapshot.name,
        location: `${entry.snapshot.city}, ${entry.snapshot.county}`,
        enrollment: entry.snapshot.totalEnrollment,
      };
    }
  }
  if (content.format === 'card_set') {
    const entry = content.data.districts.find((e) => e.districtId === districtId);
    if (entry) {
      return {
        name: entry.snapshot.name,
        location: `${entry.snapshot.city}, ${entry.snapshot.county}`,
        enrollment: entry.snapshot.totalEnrollment,
      };
    }
  }
  if (content.format === 'narrative_brief' || content.format === 'intelligence_brief') {
    const signal = content.data.keySignals.find((s) => s.districtId === districtId);
    if (signal) return { name: signal.label, location: '', enrollment: 0 };
  }
  return undefined;
}
