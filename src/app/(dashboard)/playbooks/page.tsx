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

function handleNewPlaybook() {
  // TODO: Wire GeneratePlaybookSheet — separate handoff
  console.log('New Playbook clicked — sheet wiring pending');
}

export default function PlaybooksPage() {
  const [playbooks, setPlaybooks] = useState<PlaybookListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [sortOption, setSortOption] = useState<SortOption>('recent');

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

  // Loading state
  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Playbooks</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-[160px] rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Playbooks</h1>
        <div className="text-center py-16">
          <p className="text-muted-foreground">Failed to load playbooks.</p>
          <Button
            variant="outline"
            className="mt-4"
            onClick={() => window.location.reload()}
          >
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  // Empty state
  if (playbooks.length === 0) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-6">Playbooks</h1>
        <EmptyPlaybooksState onCreateClick={handleNewPlaybook} />
      </div>
    );
  }

  // Populated state
  const sorted = sortPlaybooks(playbooks, sortOption);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Playbooks</h1>
        <Button
          className="bg-[#FF7000] hover:bg-[#FF7000]/90 text-white"
          onClick={handleNewPlaybook}
        >
          New Playbook
        </Button>
      </div>

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
    </div>
  );
}
