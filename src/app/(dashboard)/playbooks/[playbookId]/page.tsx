'use client';

import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { InlineEditableBlock } from '@/components/shared/inline-editable-block';
import { PlaybookContextCard } from '@/components/shared/playbook-context-card';
import { PlaybookSection } from '@/components/shared/playbook-section';
import type { Playbook, PlaybookSection as PlaybookSectionType, PlaybookStatusResponse } from '@/services/types/playbook';
import type { Product } from '@/services/types/product';
import type { DistrictProfile } from '@/services/types/district';
import type { SectionStatus } from '@/services/types/common';

// Tab config: maps sectionType → display label, in order
const TAB_CONFIG = [
  { sectionType: 'district_data', label: 'District Overview' },
  { sectionType: 'key_themes', label: 'Key Themes' },
  { sectionType: 'product_fit', label: 'Product Fit' },
  { sectionType: 'fit_assessment', label: 'Fit Assessment' },
  { sectionType: 'objections', label: 'Objection Handling' },
  { sectionType: 'stakeholders', label: 'Stakeholders' },
] as const;

function StatusDot({ status }: { status: SectionStatus }) {
  switch (status) {
    case 'pending':
      return <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground" />;
    case 'generating':
      return <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />;
    case 'error':
      return <span className="inline-block h-2 w-2 rounded-full bg-destructive" />;
    default:
      return null;
  }
}

function OverallStatusBadge({ status }: { status: string }) {
  switch (status) {
    case 'generating':
      return <Badge variant="secondary" className="animate-pulse">Generating</Badge>;
    case 'complete':
      return <Badge className="bg-success text-success-foreground">Complete</Badge>;
    case 'partial':
      return <Badge variant="secondary" className="border-warning text-warning">Partial</Badge>;
    case 'failed':
      return <Badge variant="destructive">Failed</Badge>;
    default:
      return null;
  }
}

function formatTimestamp(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export default function PlaybookDetailPage({
  params,
}: {
  params: Promise<{ playbookId: string }>;
}) {
  const { playbookId } = use(params);
  const router = useRouter();

  // Core state
  const [playbook, setPlaybook] = useState<Playbook | null>(null);
  const [overallStatus, setOverallStatus] = useState<string>('complete');
  const [district, setDistrict] = useState<DistrictProfile | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
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
        setPlaybook(pb);

        // Fetch status to determine overall state
        const statusRes = await fetchStatus(playbookId);
        if (statusRes && !cancelled) {
          setOverallStatus(statusRes.overallStatus);
          if (statusRes.overallStatus === 'generating') {
            setIsPolling(true);
          }
        }

        // Fetch district and product details for context card
        const [districtRes, ...productResponses] = await Promise.all([
          fetch(`/api/districts/${pb.districtId}`),
          ...pb.productIds.map((pid) => fetch(`/api/products/${pid}`)),
        ]);

        if (!cancelled) {
          if (districtRes.ok) {
            setDistrict(await districtRes.json());
          }
          const loadedProducts: Product[] = [];
          for (const pRes of productResponses) {
            if (pRes.ok) {
              loadedProducts.push(await pRes.json());
            }
          }
          setProducts(loadedProducts);
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
  }, [playbookId, fetchPlaybook, fetchStatus]);

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

  // Handle delete playbook
  const handleDelete = useCallback(async () => {
    try {
      await fetch(`/api/playbooks/${playbookId}`, { method: 'DELETE' });
      router.push('/playbooks');
    } catch {
      // Stay on page if delete fails
    }
  }, [playbookId, router]);

  // Demo: Generate a playbook (dev only)
  const handleDemoGenerate = useCallback(async () => {
    try {
      const res = await fetch('/api/playbooks/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          districtId: 'dist-lausd-001',
          productIds: ['prod-001', 'prod-002'],
        }),
      });
      if (res.ok) {
        const { playbookId: newId } = await res.json();
        router.push(`/playbooks/${newId}`);
      }
    } catch {
      // ignore
    }
  }, [router]);

  // Loading state
  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  // Error state
  if (error || !playbook) {
    return (
      <div className="p-6 space-y-4">
        <Link
          href="/playbooks"
          className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Playbooks
        </Link>
        <div className="text-center py-16">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            {error || 'Playbook not found'}
          </h2>
          <p className="text-muted-foreground mb-4">
            This playbook may not exist yet. Generate one to get started.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <Button onClick={handleDemoGenerate}>
              Demo: Generate Playbook
            </Button>
          )}
        </div>
      </div>
    );
  }

  // Build context card products
  const contextProducts = products.map((p) => ({
    productId: p.productId,
    name: p.name,
    subjectArea: p.subjectArea,
    gradeRange: p.gradeRange,
    description: p.description,
  }));

  // Fallback to playbook product names if products haven't loaded
  const contextProductsFallback = playbook.productNames.map((name, i) => ({
    productId: playbook.productIds[i] || `unknown-${i}`,
    name,
    subjectArea: '',
    gradeRange: { gradeFrom: 0, gradeTo: 0 },
  }));

  const displayProducts = contextProducts.length > 0 ? contextProducts : contextProductsFallback;

  return (
    <div className="p-6 space-y-6 max-w-5xl">
      {/* Back link */}
      <Link
        href="/playbooks"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Playbooks
      </Link>

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <h1 className="text-2xl font-semibold text-foreground">
            {playbook.districtName} &mdash; {playbook.productNames.join(', ')}
          </h1>
          <div className="flex items-center gap-3 flex-wrap">
            <OverallStatusBadge status={overallStatus} />
            <span className="text-sm text-muted-foreground">
              Generated {formatTimestamp(playbook.generatedAt)}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {process.env.NODE_ENV === 'development' && (
            <Button variant="outline" size="sm" onClick={handleDemoGenerate}>
              Demo: Generate
            </Button>
          )}
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive">
                <Trash2 className="h-4 w-4" />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete this playbook?</AlertDialogTitle>
                <AlertDialogDescription>
                  This can&apos;t be undone. The playbook and all its sections will be
                  permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                  onClick={handleDelete}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      {/* Context card */}
      <PlaybookContextCard
        districtName={district?.name || playbook.districtName}
        districtLocation={district?.location}
        districtEnrollment={district?.totalEnrollment}
        products={displayProducts}
      />

      {/* Tabbed sections */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          {TAB_CONFIG.map(({ sectionType, label }) => {
            const section = getSection(sectionType);
            const status = section?.status || 'pending';
            return (
              <TabsTrigger key={sectionType} value={sectionType} className="gap-1.5">
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
                <div className="space-y-1">
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
    </div>
  );
}
