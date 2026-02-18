'use client';

import { use, useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { RefreshCw } from 'lucide-react';
import { useSidebar } from '@/components/layout/sidebar-context';
import type { DistrictProfile } from '@/services/types/district';
import type { FitAssessment } from '@/services/types/common';
import type { DistrictYearData } from '@/services/providers/mock/fixtures/districts';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DistrictProfileHeader,
  KeyMetricsGrid,
  QuickActionsPanel,
  DistrictChart,
  ResearchTabs,
} from '@/components/district-profile';
import { GeneratePlaybookSheet } from '@/components/playbook/generate-playbook-sheet';
import { fitCategoryColors, type FitCategoryKey } from '@/lib/design-tokens';
import { cn } from '@/lib/utils';

function getFitCategory(score: number): FitCategoryKey {
  if (score >= 7) return 'strong';
  if (score >= 4) return 'moderate';
  return 'low';
}

export default function DistrictProfilePage({
  params,
}: {
  params: Promise<{ districtId: string }>;
}) {
  const { districtId } = use(params);
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');
  const { setBreadcrumbOverride } = useSidebar();

  const [district, setDistrict] = useState<DistrictProfile | null>(null);
  const [yearData, setYearData] = useState<DistrictYearData[]>([]);
  const [fitAssessment, setFitAssessment] = useState<FitAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [playbookOpen, setPlaybookOpen] = useState(false);

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

      // Fetch fit assessment if productId present (independent, progressive)
      if (productId) {
        fetch(`/api/districts/fit-assessment?districtId=${districtId}&productIds=${productId}`)
          .then((res) => (res.ok ? res.json() : null))
          .then((data) => { if (data) setFitAssessment(data); })
          .catch(() => { /* non-critical */ });
      }
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [districtId, productId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (district) {
      setBreadcrumbOverride(district.name);
    }
    return () => setBreadcrumbOverride(null);
  }, [district, setBreadcrumbOverride]);

  // --- 404 state ---
  if (notFound) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-24">
        <h1 className="text-2xl font-bold">District not found</h1>
        <p className="text-muted-foreground">The district you&apos;re looking for doesn&apos;t exist.</p>
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
        <p className="text-muted-foreground">{error}</p>
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
        {/* Identity + metrics skeleton */}
        <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
          <div className="space-y-3">
            <Skeleton className="h-8 w-64" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-36" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-lg" />
            ))}
          </div>
        </div>

        {/* Chart + actions skeleton */}
        <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
          <Skeleton className="h-80 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
            <Skeleton className="h-16 rounded-lg" />
          </div>
        </div>

        {/* Tabs render with districtId */}
        <ResearchTabs districtId={districtId} />
      </div>
    );
  }

  // --- Loaded state ---
  const fitCategory = fitAssessment ? getFitCategory(fitAssessment.fitScore) : null;
  const fitColors = fitCategory ? fitCategoryColors[fitCategory] : null;

  return (
    <div className="space-y-6">
      {/* Row 1: Header + Metrics */}
      <div className="grid gap-6 lg:grid-cols-[1fr_1fr]">
        <DistrictProfileHeader district={district} />
        <KeyMetricsGrid district={district} yearData={yearData} />
      </div>

      {/* Row 2: Chart + Quick Actions */}
      <div className="grid gap-6 lg:grid-cols-[1fr_280px]">
        <DistrictChart yearData={yearData} />
        <QuickActionsPanel
          district={district}
          productId={productId ?? undefined}
          onGeneratePlaybook={() => setPlaybookOpen(true)}
        />
      </div>

      {/* Fit Assessment (if product context) */}
      {fitAssessment && fitColors && (
        <div className={cn('rounded-lg border p-4', fitColors.bg)}>
          <div className="flex items-center gap-3">
            <Badge className={cn(fitColors.bg, fitColors.text, fitColors.border, 'border')}>
              {fitColors.label}
            </Badge>
            <span className="text-sm font-medium">
              Fit Score: {fitAssessment.fitScore}/10
            </span>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {fitAssessment.fitRationale}
          </p>
        </div>
      )}

      {/* Research Tabs */}
      <ResearchTabs districtId={districtId} />

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
        initialProductIds={productId ? [productId] : undefined}
      />
    </div>
  );
}
