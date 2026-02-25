'use client';

import { use, useEffect, useState, useCallback, useRef } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { RefreshCw, AlertCircle, X } from 'lucide-react';
import { useAppShell } from '@/components/layout/app-shell-context';
import type { DistrictProfile } from '@/services/types/district';
import type { MatchSummary } from '@/services/types/common';
import type { DistrictYearData } from '@/services/providers/mock/fixtures/districts';
import type { Playbook } from '@/services/types/playbook';
import { getDistrictService } from '@/services';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  PersistentDataStrip,
  ModeBar,
  ResearchTabs,
  PlaybookPreviewBanner,
  PlaybookPreviewTabs,
  UnifiedDistrictLayout,
} from '@/components/district-profile';
import { useProductLens } from '@/hooks/use-product-lens';
import { useLibraryReadiness } from '@/hooks/use-library-readiness';

interface GenerationState {
  status: 'idle' | 'generating' | 'preview';
  playbookId: string | null;
  playbookData: Playbook | null;
  defaultName: string;
}

const INITIAL_GENERATION_STATE: GenerationState = {
  status: 'idle',
  playbookId: null,
  playbookData: null,
  defaultName: '',
};

function formatDefaultName(districtName: string, productName: string): string {
  const date = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  return `${districtName} \u00B7 ${productName} \u00B7 ${date}`;
}

export default function DistrictProfilePage({
  params,
}: {
  params: Promise<{ districtId: string }>;
}) {
  const { districtId } = use(params);
  const searchParams = useSearchParams();
  const router = useRouter();
  const productId = searchParams.get('productId');
  const { setBreadcrumbs } = useAppShell();

  const [district, setDistrict] = useState<DistrictProfile | null>(null);
  const [yearData, setYearData] = useState<DistrictYearData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);

  // Generation state machine
  const [generationState, setGenerationState] = useState<GenerationState>(INITIAL_GENERATION_STATE);

  // Transient error notification (replaces toast — no toast library installed)
  const [generationError, setGenerationError] = useState<string | null>(null);
  const errorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const showError = useCallback((msg: string) => {
    setGenerationError(msg);
    if (errorTimerRef.current) clearTimeout(errorTimerRef.current);
    errorTimerRef.current = setTimeout(() => setGenerationError(null), 6000);
  }, []);

  const { activeProduct, setProduct, clearProduct, isLensActive } = useProductLens();
  const readiness = useLibraryReadiness();

  // Seed lens from URL param on mount (doesn't override existing lens)
  useEffect(() => {
    if (productId && !isLensActive && readiness.products.length > 0) {
      const product = readiness.products.find(p => p.productId === productId);
      if (product) setProduct(product);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, readiness.products.length]);

  const activeProductId = activeProduct?.productId ?? null;

  // Fetch match summary when lens is active
  const [matchSummary, setMatchSummary] = useState<MatchSummary | null>(null);

  useEffect(() => {
    if (!activeProductId || !districtId) {
      setMatchSummary(null);
      return;
    }
    let cancelled = false;
    getDistrictService()
      .then(s => s.getMatchSummaries(activeProductId, [districtId]))
      .then(summaries => { if (!cancelled) setMatchSummary(summaries[districtId] ?? null); })
      .catch(() => { if (!cancelled) setMatchSummary(null); });
    return () => { cancelled = true; };
  }, [activeProductId, districtId]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    setNotFound(false);

    try {
      // Fetch district profile and year data in parallel
      const [districtRes, yearsRes] = await Promise.all([
        fetch(`/api/districts/${districtId}`),
        fetch(`/api/districts/${districtId}/years`),
      ]);

      if (districtRes.status === 404) {
        setNotFound(true);
        setLoading(false);
        return;
      }
      if (!districtRes.ok) throw new Error('Failed to fetch district');

      const districtData: DistrictProfile = await districtRes.json();
      setDistrict(districtData);

      if (yearsRes.ok) {
        const years: DistrictYearData[] = await yearsRes.json();
        setYearData(years);
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [districtId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (district) {
      setBreadcrumbs([
        { label: 'Discovery', href: '/discovery' },
        { label: district.name },
      ]);
    }
    return () => setBreadcrumbs(null);
  }, [district, setBreadcrumbs]);

  // --- Generation flow ---
  const handleGeneratePlaybook = useCallback(async () => {
    if (!isLensActive || !activeProduct || !district) return;
    if (generationState.status !== 'idle') return;

    setGenerationState({
      status: 'generating',
      playbookId: null,
      playbookData: null,
      defaultName: '',
    });

    try {
      // Step 1: Trigger generation
      const genRes = await fetch('/api/playbooks/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          districtId,
          productIds: [activeProduct.productId],
        }),
      });

      if (!genRes.ok) {
        throw new Error('Generation request failed');
      }

      const { playbookId } = await genRes.json();

      // Step 2: Poll for completion
      let complete = false;
      while (!complete) {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const statusRes = await fetch(`/api/playbooks/${playbookId}/status`);
        if (!statusRes.ok) continue;

        const statusData = await statusRes.json();

        if (statusData.overallStatus === 'complete') {
          // Step 3: Fetch full playbook
          const pbRes = await fetch(`/api/playbooks/${playbookId}`);
          if (!pbRes.ok) throw new Error('Failed to fetch generated playbook');

          const playbookData: Playbook = await pbRes.json();
          const defaultName = formatDefaultName(district.name, activeProduct.name);

          setGenerationState({
            status: 'preview',
            playbookId,
            playbookData,
            defaultName,
          });
          complete = true;
        } else if (statusData.overallStatus === 'failed') {
          // Clean up failed playbook
          fetch(`/api/playbooks/${playbookId}`, { method: 'DELETE' }).catch(() => {});
          throw new Error('Playbook generation failed. Please try again.');
        }
        // 'generating' or 'partial' → keep polling
      }
    } catch (err) {
      setGenerationState(INITIAL_GENERATION_STATE);
      showError(err instanceof Error ? err.message : 'Playbook generation failed. Please try again.');
    }
  }, [isLensActive, activeProduct, district, districtId, generationState.status, showError]);

  // --- Save flow ---
  // TODO: P2 backend — separate preview generation from save.
  // The MVP conflates generation with persistence. A real backend should have:
  //   POST /api/playbooks/preview — generate temporary preview
  //   POST /api/playbooks/[previewId]/save — commit with name to library
  //   Preview auto-expires after N minutes if not saved.
  const handleSavePlaybook = useCallback((name: string) => {
    const { playbookId } = generationState;
    if (!playbookId) return;

    // In MVP, playbook is already persisted by generatePlaybook.
    // Save = acknowledge + clear lens + navigate.
    // `name` would be sent to a save API in a real backend (unused in MVP).
    void name;
    clearProduct();
    setGenerationState(INITIAL_GENERATION_STATE);
    router.push(`/districts/${districtId}/playbooks/${playbookId}`);
  }, [generationState, clearProduct, districtId, router]);

  // --- Discard flow ---
  const handleDiscardPlaybook = useCallback(async () => {
    const { playbookId } = generationState;
    if (playbookId) {
      // Fire-and-forget delete — still reset UI even if delete fails
      fetch(`/api/playbooks/${playbookId}`, { method: 'DELETE' }).catch(() => {});
    }
    setGenerationState(INITIAL_GENERATION_STATE);
    // Lens remains active — user returns to district-lens state
  }, [generationState]);

  const isPreviewActive = generationState.status !== 'idle';

  // --- 404 state ---
  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <h1 className="text-2xl font-bold">District not found</h1>
        <p className="text-foreground-secondary">The district you&apos;re looking for doesn&apos;t exist.</p>
        <Button asChild variant="outline">
          <Link href="/discovery">Back to Discovery</Link>
        </Button>
      </div>
    );
  }

  // --- Error state ---
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <h1 className="text-2xl font-bold">Something went wrong</h1>
        <p className="text-foreground-secondary">{error}</p>
        <Button onClick={fetchData} variant="outline">
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry
        </Button>
      </div>
    );
  }

  // --- Loading state ---
  if (loading || !district) {
    return (
      <UnifiedDistrictLayout
        identityZone={
          <div className="space-y-3">
            <Skeleton className="h-7 w-64" />
            <div className="pt-3 border-t border-border-subtle flex gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-24" />
              ))}
            </div>
          </div>
        }
        modeBarZone={<Skeleton className="h-10 w-full rounded" />}
      >
        <Skeleton className="h-9 w-72 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </UnifiedDistrictLayout>
    );
  }

  // --- Loaded state ---
  return (
    <>
      {/* Generation error notification */}
      {generationError && (
        <div className="mb-4 flex items-center gap-2 rounded-md bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span className="flex-1">{generationError}</span>
          <button
            onClick={() => setGenerationError(null)}
            className="shrink-0 rounded p-0.5 hover:bg-destructive/10"
            aria-label="Dismiss error"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      <UnifiedDistrictLayout
        identityZone={
          <PersistentDataStrip
            district={district}
            yearData={yearData}
            matchSummary={matchSummary}
            activeProductName={activeProduct?.name}
          />
        }
        modeBarZone={
          <>
            <ModeBar
              districtId={districtId}
              districtName={district.name}
              matchSummary={matchSummary}
              onGeneratePlaybook={handleGeneratePlaybook}
              isPreviewActive={isPreviewActive}
            />
            {generationState.status === 'preview' && (
              <PlaybookPreviewBanner
                defaultName={generationState.defaultName}
                onSave={handleSavePlaybook}
                onDiscard={handleDiscardPlaybook}
              />
            )}
          </>
        }
      >
        {generationState.status === 'idle' ? (
          <ResearchTabs
            districtId={districtId}
            yearData={yearData}
            isLensActive={isLensActive}
            matchSummary={matchSummary}
            activeProductName={activeProduct?.name}
          />
        ) : (
          <PlaybookPreviewTabs
            playbook={generationState.playbookData}
            isGenerating={generationState.status === 'generating'}
          />
        )}
      </UnifiedDistrictLayout>
    </>
  );
}
