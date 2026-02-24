'use client';

import { use, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { RefreshCw } from 'lucide-react';
import { useAppShell } from '@/components/layout/app-shell-context';
import type { DistrictProfile } from '@/services/types/district';
import type { MatchSummary } from '@/services/types/common';
import type { DistrictYearData } from '@/services/providers/mock/fixtures/districts';
import { getDistrictService } from '@/services';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import {
  PersistentDataStrip,
  ModeBar,
  LensControlBar,
  ResearchTabs,
} from '@/components/district-profile';
import { GeneratePlaybookSheet } from '@/components/playbook/generate-playbook-sheet';
import { useProductLens } from '@/hooks/use-product-lens';
import { useLibraryReadiness } from '@/hooks/use-library-readiness';

export default function DistrictProfilePage({
  params,
}: {
  params: Promise<{ districtId: string }>;
}) {
  const { districtId } = use(params);
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const { setBreadcrumbs } = useAppShell();

  const [district, setDistrict] = useState<DistrictProfile | null>(null);
  const [yearData, setYearData] = useState<DistrictYearData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [playbookOpen, setPlaybookOpen] = useState(false);

  const { activeProduct, setProduct, isLensActive } = useProductLens();
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
      <div className="space-y-6">
        {/* Data strip skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-7 w-64" />
          <div className="pt-3 border-t border-border-subtle flex gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-12 w-24" />
            ))}
          </div>
        </div>

        {/* Mode bar skeleton */}
        <Skeleton className="h-10 w-full rounded" />

        {/* Lens bar skeleton */}
        <Skeleton className="h-9 w-72" />

        {/* Tab area skeleton */}
        <div className="space-y-4">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </div>
    );
  }

  // --- Loaded state ---
  return (
    <div>
      {/* Layer 1 — Persistent Data Strip */}
      <PersistentDataStrip
        district={district}
        yearData={yearData}
        matchSummary={matchSummary}
        activeProductName={activeProduct?.name}
      />

      {/* Layer 2 — Mode Bar */}
      <div className="mt-4">
        <ModeBar
          districtId={districtId}
          districtName={district.name}
          activeMode="district"
          onGeneratePlaybook={() => setPlaybookOpen(true)}
          activeProductName={activeProduct?.name}
        />
      </div>

      {/* Layer 3 — Lens Control Bar */}
      <LensControlBar districtId={districtId} matchSummary={matchSummary} />

      {/* Layer 4 — Tab Area */}
      <div className="mt-8">
        <ResearchTabs
          districtId={districtId}
          yearData={yearData}
          isLensActive={isLensActive}
          matchSummary={matchSummary}
          activeProductName={activeProduct?.name}
        />
      </div>

      {/* Generate Playbook Sheet */}
      <GeneratePlaybookSheet
        open={playbookOpen}
        onOpenChange={setPlaybookOpen}
        initialDistrict={{
          districtId: district.districtId,
          districtName: district.name,
          location: district.location,
          enrollment: district.totalEnrollment,
        }}
        initialProductIds={activeProductId ? [activeProductId] : undefined}
      />
    </div>
  );
}
