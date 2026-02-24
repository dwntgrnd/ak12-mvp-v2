'use client';

import { useState, useRef, useCallback, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { DiscoveryEntryState } from '@/components/discovery/discovery-entry-state';
import { DiscoveryLoadingState } from '@/components/discovery/discovery-loading-state';
import { DiscoveryResultsLayout } from '@/components/discovery/discovery-results-layout';
import { GeneratePlaybookSheet } from '@/components/playbook/generate-playbook-sheet';
import { LibraryRequiredDialog } from '@/components/shared/library-required-dialog';
import { useLibraryReadiness } from '@/hooks/use-library-readiness';
import { useProductLens } from '@/hooks/use-product-lens';
import { useSavedDistricts } from '@/hooks/use-saved-districts';
import { getDiscoveryService, getDistrictService } from '@/services';
import type { IDiscoveryService } from '@/services';
import type { DiscoveryQueryResponse } from '@/services/types/discovery';
import type { MatchSummary } from '@/services/types/common';

type DiscoveryPageState = 'entry' | 'loading' | 'results';

function DiscoveryPageInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [pageState, setPageState] = useState<DiscoveryPageState>('entry');
  const [activeQuery, setActiveQuery] = useState('');
  const [response, setResponse] = useState<DiscoveryQueryResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  // Product lens — shared singleton hook (persists across navigation)
  const { activeProduct, setProduct, clearProduct } = useProductLens();
  const productLensId = activeProduct?.productId;

  // Library readiness — session-cached
  const readiness = useLibraryReadiness();
  const products = readiness.products.map((p) => ({ productId: p.productId, name: p.name }));

  // Saved districts — shared singleton hook
  const { savedDistrictIds, saveDistrict, removeSavedDistrict } = useSavedDistricts();

  // Match summaries for active lens
  const [matchSummaries, setMatchSummaries] = useState<Record<string, MatchSummary>>({});
  const [, setMatchLoading] = useState(false);

  // Adapter: productId string → ProductLensSummary for useProductLens
  const handleProductLensChange = useCallback((productId: string | undefined) => {
    if (!productId) { clearProduct(); return; }
    const product = readiness.products.find(p => p.productId === productId);
    if (product) setProduct(product);
  }, [readiness.products, setProduct, clearProduct]);

  // Fetch match summaries when lens + results change
  useEffect(() => {
    if (!productLensId || !response) {
      setMatchSummaries({});
      return;
    }
    const districtIds = extractDistrictIds(response);
    if (districtIds.length === 0) {
      setMatchSummaries({});
      return;
    }
    let cancelled = false;
    setMatchLoading(true);
    getDistrictService()
      .then(s => s.getMatchSummaries(productLensId, districtIds))
      .then(result => { if (!cancelled) setMatchSummaries(result); })
      .catch(() => { if (!cancelled) setMatchSummaries({}); })
      .finally(() => { if (!cancelled) setMatchLoading(false); });
    return () => { cancelled = true; };
  }, [productLensId, response]);

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

  // Auto-execute pre-seeded query from URL param (e.g. ?q=districts+in+Los+Angeles+county)
  const initialQueryHandled = useRef(false);
  useEffect(() => {
    if (initialQueryHandled.current) return;
    const q = searchParams.get('q');
    if (q && pageState === 'entry') {
      initialQueryHandled.current = true;
      handleQuerySubmit(q);
    }
  }, [searchParams, pageState]); // eslint-disable-line react-hooks/exhaustive-deps

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
          onProductLensChange={handleProductLensChange}
          hasProducts={readiness.hasProducts}
          matchSummaries={matchSummaries}
          savedDistricts={savedDistrictIds}
          onSaveDistrict={saveDistrict}
          onRemoveSaved={removeSavedDistrict}
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

export default function DiscoveryPage() {
  return (
    <Suspense>
      <DiscoveryPageInner />
    </Suspense>
  );
}

/** Extract all district IDs from a discovery response (any format). */
function extractDistrictIds(response: DiscoveryQueryResponse): string[] {
  const { content } = response;
  if (content.format === 'ranked_list') {
    return content.data.entries.map(e => e.districtId);
  }
  if (content.format === 'card_set') {
    return content.data.districts.map(e => e.districtId);
  }
  if (content.format === 'narrative_brief' || content.format === 'intelligence_brief') {
    return content.data.keySignals
      .filter(s => s.districtId)
      .map(s => s.districtId!);
  }
  return [];
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
