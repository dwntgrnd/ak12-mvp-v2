'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { PlaybookCard } from '@/components/playbook/playbook-card';
import { EmptyPlaybooksState } from '@/components/playbook/empty-playbooks-state';
import { GeneratePlaybookSheet } from '@/components/playbook/generate-playbook-sheet';
import { useSidebar } from '@/components/layout/sidebar-context';

type SortOption = 'recent' | 'fit';

interface PlaybookListItem {
  playbookId: string;
  districtName: string;
  fitAssessment: { fitScore: number; fitRationale: string };
  productNames: string[];
  generatedAt: string;
  overallStatus: 'generating' | 'complete' | 'partial' | 'failed';
}

function deriveOverallStatus(
  sectionStatuses: Record<string, string>
): 'generating' | 'complete' | 'partial' | 'failed' {
  const statuses = Object.values(sectionStatuses);
  if (statuses.some((s) => s === 'generating')) return 'generating';
  if (statuses.some((s) => s === 'error')) return 'failed';
  if (statuses.every((s) => s === 'complete')) return 'complete';
  return 'partial';
}

function sortPlaybooks(
  items: PlaybookListItem[],
  sort: SortOption
): PlaybookListItem[] {
  const generating = items.filter((p) => p.overallStatus === 'generating');
  const rest = items.filter((p) => p.overallStatus !== 'generating');

  if (sort === 'fit') {
    rest.sort((a, b) => {
      const scoreDiff =
        b.fitAssessment.fitScore - a.fitAssessment.fitScore;
      if (scoreDiff !== 0) return scoreDiff;
      return (
        new Date(b.generatedAt).getTime() -
        new Date(a.generatedAt).getTime()
      );
    });
  } else {
    rest.sort(
      (a, b) =>
        new Date(b.generatedAt).getTime() -
        new Date(a.generatedAt).getTime()
    );
  }

  return [...generating, ...rest];
}

export default function PlaybooksPage() {
  const [playbooks, setPlaybooks] = useState<PlaybookListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('recent');
  const [sheetOpen, setSheetOpen] = useState(false);
  const { setPageActions } = useSidebar();

  useEffect(() => {
    setLoading(true);
    fetch('/api/playbooks')
      .then((res) => res.json())
      .then((data) => {
        const items: PlaybookListItem[] = (data.items || []).map(
          (summary: {
            playbookId: string;
            districtName: string;
            fitAssessment: { fitScore: number; fitRationale: string };
            productNames: string[];
            generatedAt: string;
            sectionStatuses: Record<string, string>;
          }) => ({
            playbookId: summary.playbookId,
            districtName: summary.districtName,
            fitAssessment: summary.fitAssessment,
            productNames: summary.productNames,
            generatedAt: summary.generatedAt,
            overallStatus: deriveOverallStatus(summary.sectionStatuses),
          })
        );
        setPlaybooks(items);
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (!loading && !error && playbooks.length > 0) {
      setPageActions(
        <Button
          onClick={() => setSheetOpen(true)}
          className="bg-brand-orange hover:bg-brand-orange/90 text-white"
        >
          New Playbook
        </Button>
      );
    }
    return () => setPageActions(null);
  }, [loading, error, playbooks.length, setPageActions]);

  const sorted = sortPlaybooks(playbooks, sortOption);

  let content: React.ReactNode;

  if (loading) {
    content = (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-[160px] rounded-lg" />
        ))}
      </div>
    );
  } else if (error) {
    content = (
      <div className="text-center py-16">
        <p className="text-foreground-secondary">Failed to load playbooks.</p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => window.location.reload()}
        >
          Try Again
        </Button>
      </div>
    );
  } else if (playbooks.length === 0) {
    content = <EmptyPlaybooksState onCreateClick={() => setSheetOpen(true)} />;
  } else {
    content = (
      <>
        <div className="mb-6">
          <Select
            value={sortOption}
            onValueChange={(v) => setSortOption(v as SortOption)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">Most Recent</SelectItem>
              <SelectItem value="fit">Fit Assessment</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map((playbook) => (
            <PlaybookCard key={playbook.playbookId} playbook={playbook} />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {content}
      <GeneratePlaybookSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
      />
    </>
  );
}
