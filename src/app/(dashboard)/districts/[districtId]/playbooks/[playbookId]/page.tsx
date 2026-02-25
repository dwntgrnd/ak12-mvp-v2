'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { InlineEditableBlock } from '@/components/shared/inline-editable-block';
import { PlaybookSection } from '@/components/shared/playbook-section';
import { PersistentDataStrip, ModeBar, UnifiedDistrictLayout } from '@/components/district-profile';
import { useAppShell } from '@/components/layout/app-shell-context';
import type { Playbook, PlaybookSection as PlaybookSectionType, PlaybookStatusResponse } from '@/services/types/playbook';
import type { DistrictProfile } from '@/services/types/district';
import type { DistrictYearData } from '@/services/providers/mock/fixtures/districts';
import type { SectionStatus } from '@/services/types/common';

// Tab config: maps sectionType → display label, in order
const TAB_CONFIG = [
  { sectionType: 'key_themes', label: 'Key Themes' },
  { sectionType: 'stakeholder_talking_points', label: 'Stakeholder Talking Points' },
  { sectionType: 'product_fit_data', label: 'Product Fit / Data' },
  { sectionType: 'handling_objections', label: 'Handling Objections' },
  { sectionType: 'competition', label: 'Competition' },
  { sectionType: 'news', label: 'News' },
] as const;

function StatusDot({ status }: { status: SectionStatus }) {
  switch (status) {
    case 'pending':
      return <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground" />;
    case 'generating':
      return <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />;
    case 'error':
      return <span className="inline-block h-2 w-2 rounded-full bg-destructive" />;
    case 'complete':
    default:
      return null;
  }
}

export default function NestedPlaybookDetailPage({
  params,
}: {
  params: Promise<{ districtId: string; playbookId: string }>;
}) {
  const { districtId, playbookId } = use(params);
  const router = useRouter();
  const { setBreadcrumbs } = useAppShell();

  // Core state
  const [playbook, setPlaybook] = useState<Playbook | null>(null);
  const [overallStatus, setOverallStatus] = useState<string>('complete');
  const [district, setDistrict] = useState<DistrictProfile | null>(null);
  const [yearData, setYearData] = useState<DistrictYearData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Section-level state (local overrides for editing/regeneration)
  const [sectionOverrides, setSectionOverrides] = useState<
    Record<string, Partial<PlaybookSectionType>>
  >({});

  // Active tab
  const [activeTab, setActiveTab] = useState<string>(TAB_CONFIG[0].sectionType);

  // Polling ref
  const [isPolling, setIsPolling] = useState(false);

  // Fetch playbook data
  const fetchPlaybook = useCallback(async (id: string) => {
    const res = await fetch(`/api/playbooks/${id}`);
    if (!res.ok) {
      throw new Error(`Failed to load playbook: ${res.status}`);
    }
    return res.json() as Promise<Playbook>;
  }, []);

  // Fetch playbook status (for polling)
  const fetchStatus = useCallback(async (id: string) => {
    const res = await fetch(`/api/playbooks/${id}/status`);
    if (!res.ok) return null;
    return res.json() as Promise<PlaybookStatusResponse>;
  }, []);

  // Initial data load
  useEffect(() => {
    let cancelled = false;

    async function loadData() {
      try {
        setLoading(true);
        setError(null);
        const pb = await fetchPlaybook(playbookId);
        if (cancelled) return;

        // Validate districtId matches — redirect if mismatch
        if (pb.districtId !== districtId) {
          router.replace(`/districts/${pb.districtId}/playbooks/${playbookId}`);
          return;
        }

        setPlaybook(pb);

        // Fetch status to determine overall state
        const statusRes = await fetchStatus(playbookId);
        if (statusRes && !cancelled) {
          setOverallStatus(statusRes.overallStatus);
          if (statusRes.overallStatus === 'generating') {
            setIsPolling(true);
          }
        }

        // Fetch district and year-over-year data
        const [districtRes, yearsRes] = await Promise.all([
          fetch(`/api/districts/${pb.districtId}`),
          fetch(`/api/districts/${pb.districtId}/years`),
        ]);

        if (!cancelled) {
          if (districtRes.ok) {
            setDistrict(await districtRes.json());
          }
          if (yearsRes.ok) {
            const years: DistrictYearData[] = await yearsRes.json();
            setYearData(years);
          }
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Failed to load playbook');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadData();
    return () => { cancelled = true; };
  }, [playbookId, districtId, router, fetchPlaybook, fetchStatus]);

  // Set breadcrumbs
  useEffect(() => {
    if (playbook) {
      setBreadcrumbs([
        { label: district?.name ?? playbook.districtName, href: `/districts/${districtId}` },
        { label: playbook.productNames.join(', ') },
      ]);
    }
    return () => setBreadcrumbs(null);
  }, [playbook, district, districtId, setBreadcrumbs]);

  // Polling for generation status
  useEffect(() => {
    if (!isPolling) return;
    const interval = setInterval(async () => {
      const statusRes = await fetchStatus(playbookId);
      if (!statusRes) return;

      setOverallStatus(statusRes.overallStatus);

      // Update section statuses from poll
      setSectionOverrides((prev) => {
        const next = { ...prev };
        for (const sec of statusRes.sections) {
          if (!next[sec.sectionId]) next[sec.sectionId] = {};
          next[sec.sectionId] = { ...next[sec.sectionId], status: sec.status };
        }
        return next;
      });

      // If a section just completed, re-fetch full playbook for content
      const hasNewComplete = statusRes.sections.some((s) => s.status === 'complete');
      if (hasNewComplete) {
        try {
          const pb = await fetchPlaybook(playbookId);
          setPlaybook(pb);
        } catch {
          // ignore fetch errors during polling
        }
      }

      // Stop polling when done
      if (['complete', 'partial', 'failed'].includes(statusRes.overallStatus)) {
        setIsPolling(false);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, [isPolling, playbookId, fetchPlaybook, fetchStatus]);

  // Get effective section state (merging playbook data with local overrides)
  const getSection = useCallback(
    (sectionType: string): PlaybookSectionType | undefined => {
      if (!playbook) return undefined;
      const base = playbook.sections.find((s) => s.sectionType === sectionType);
      if (!base) return undefined;
      const override = sectionOverrides[base.sectionId];
      if (!override) return base;
      return { ...base, ...override };
    },
    [playbook, sectionOverrides]
  );

  // Handle inline edit save
  const handleSaveBlock = useCallback(
    async (sectionId: string, blockIndex: number, newValue: string) => {
      if (!playbook) return;
      const section = playbook.sections.find((s) => s.sectionId === sectionId);
      if (!section?.content) return;

      const blocks = section.content.split('\n\n');
      blocks[blockIndex] = newValue;
      const newContent = blocks.join('\n\n');

      // Optimistically update local state
      const now = new Date().toISOString();
      setSectionOverrides((prev) => ({
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          content: newContent,
          isEdited: true,
          lastEditedAt: now,
        },
      }));

      // Persist through API
      try {
        await fetch(`/api/playbooks/${playbookId}/sections/${sectionId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ content: newContent }),
        });
      } catch {
        // Revert on failure — re-fetch
        const pb = await fetchPlaybook(playbookId);
        setPlaybook(pb);
        setSectionOverrides((prev) => {
          const next = { ...prev };
          delete next[sectionId];
          return next;
        });
      }
    },
    [playbook, playbookId, fetchPlaybook]
  );

  // Handle section regeneration
  const handleRegenerate = useCallback(
    async (sectionId: string) => {
      // Optimistically set to generating
      setSectionOverrides((prev) => ({
        ...prev,
        [sectionId]: {
          ...prev[sectionId],
          status: 'generating' as SectionStatus,
          content: undefined,
          isEdited: false,
          lastEditedAt: undefined,
        },
      }));
      setOverallStatus('generating');

      try {
        await fetch(
          `/api/playbooks/${playbookId}/sections/${sectionId}/regenerate`,
          { method: 'POST' }
        );
        // Start polling to pick up the regenerated content
        setIsPolling(true);
      } catch {
        setSectionOverrides((prev) => ({
          ...prev,
          [sectionId]: {
            ...prev[sectionId],
            status: 'error' as SectionStatus,
            errorMessage: 'Regeneration failed. Please try again.',
          },
        }));
      }
    },
    [playbookId]
  );

  // Loading state
  if (loading) {
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
        <div className="space-y-4">
          <Skeleton className="h-9 w-full" />
          <Skeleton className="h-64 w-full" />
        </div>
      </UnifiedDistrictLayout>
    );
  }

  // Error state
  if (error || !playbook) {
    return (
      <div className="space-y-4">
        <div className="text-center py-16">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            {error || 'Playbook not found'}
          </h2>
          <p className="text-foreground-secondary mb-4">
            This playbook may not exist yet. Generate one to get started.
          </p>
          <Button
            variant="outline"
            onClick={() => router.push(`/districts/${districtId}`)}
          >
            Back to District
          </Button>
        </div>
      </div>
    );
  }

  return (
    <UnifiedDistrictLayout
      identityZone={
        district ? (
          <PersistentDataStrip
            district={district}
            yearData={yearData}
            matchSummary={null}
            activeProductName={playbook.productNames[0]}
          />
        ) : (
          <div className="space-y-3">
            <Skeleton className="h-7 w-64" />
            <div className="pt-3 border-t border-border-subtle flex gap-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="h-12 w-24" />
              ))}
            </div>
          </div>
        )
      }
      modeBarZone={
        <ModeBar
          districtId={districtId}
          districtName={district?.name ?? playbook.districtName}
          activePlaybookId={playbookId}
          activePlaybookName={playbook.productNames.join(' · ')}
          activePlaybookStatus={overallStatus}
        />
      }
    >
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-auto w-full justify-start gap-0 rounded-none border-b border-border bg-transparent p-0 overflow-x-auto">
          {TAB_CONFIG.map(({ sectionType, label }) => {
            const section = getSection(sectionType);
            const status = section?.status || 'pending';
            return (
              <TabsTrigger
                key={sectionType}
                value={sectionType}
                className="-mb-px gap-1.5 rounded-none border-b-2 border-transparent bg-transparent px-4 py-2.5 text-sm font-medium text-foreground-secondary shadow-none transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-foreground data-[state=active]:shadow-none"
              >
                <StatusDot status={status} />
                {label}
              </TabsTrigger>
            );
          })}
        </TabsList>

        {TAB_CONFIG.map(({ sectionType, label }) => {
          const section = getSection(sectionType);
          if (!section) return null;

          const contentBlocks = section.content
            ? section.content.split('\n\n').filter((b) => b.trim())
            : [];

          return (
            <TabsContent key={sectionType} value={sectionType} className="pt-4">
              <PlaybookSection
                sectionId={section.sectionId}
                sectionLabel={label}
                status={section.status}
                isEdited={section.isEdited}
                lastEditedAt={section.lastEditedAt}
                generatedAt={playbook.generatedAt}
                errorMessage={section.errorMessage}
                retryable={section.retryable}
                onRegenerate={() => handleRegenerate(section.sectionId)}
              >
                <div className="space-y-4">
                  {contentBlocks.map((block, blockIdx) => (
                    <InlineEditableBlock
                      key={`${section.sectionId}-block-${blockIdx}`}
                      value={block}
                      onSave={(newValue) =>
                        handleSaveBlock(section.sectionId, blockIdx, newValue)
                      }
                      aria-label={`Edit ${label} content block ${blockIdx + 1}`}
                    />
                  ))}
                </div>
              </PlaybookSection>
            </TabsContent>
          );
        })}
      </Tabs>
    </UnifiedDistrictLayout>
  );
}
