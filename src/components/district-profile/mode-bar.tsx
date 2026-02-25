'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { useDistrictPlaybooks } from '@/hooks/use-district-playbooks';

interface ModeBarProps {
  districtId: string;
  districtName: string;
  activeMode: 'district' | string; // 'district' or a playbookId
  onGeneratePlaybook: () => void;
  activeProductName?: string;
  isPreviewActive?: boolean;
}

const tabBase =
  '-mb-px border-b-2 border-transparent px-4 py-2.5 text-sm font-medium transition-colors';
const tabActive = 'border-primary text-foreground font-semibold';
const tabInactive = 'text-foreground-secondary hover:text-foreground';

export function ModeBar({
  districtId,
  districtName,
  activeMode,
  onGeneratePlaybook,
  activeProductName,
  isPreviewActive = false,
}: ModeBarProps) {
  const router = useRouter();
  const { loading, playbooks } = useDistrictPlaybooks(districtId);

  const mostRecent = playbooks[0] ?? null;

  return (
    <div className="flex items-center justify-between border-b border-border-default">
      {/* Left side — mode entries */}
      <nav className="flex items-center gap-0 overflow-x-auto" aria-label="View mode">
        <Link
          href={`/districts/${districtId}`}
          className={cn(tabBase, activeMode === 'district' ? tabActive : tabInactive)}
        >
          District Intelligence
        </Link>

        {isPreviewActive && (
          <Badge variant="secondary" className="ml-2 text-xs animate-pulse">
            Preview
          </Badge>
        )}

        {loading ? (
          <>
            <Skeleton className="mx-2 h-5 w-28 rounded" />
            <Skeleton className="mx-2 h-5 w-28 rounded" />
          </>
        ) : (
          playbooks.map((pb) => (
            <Link
              key={pb.playbookId}
              href={`/districts/${districtId}/playbooks/${pb.playbookId}`}
              className={cn(
                tabBase,
                activeMode === pb.playbookId ? tabActive : tabInactive,
                isPreviewActive && 'opacity-50 pointer-events-none',
              )}
              aria-disabled={isPreviewActive}
              tabIndex={isPreviewActive ? -1 : undefined}
            >
              {pb.productNames.join(' \u00B7 ')}
            </Link>
          ))
        )}
      </nav>

      {/* Right side — action buttons */}
      <div className="flex items-center gap-2 shrink-0 pl-4">
        <Button
          variant="outlineBrand"
          size="sm"
          disabled={isPreviewActive}
          onClick={() => {
            const searchTerm = districtName;
            router.push(
              `/discovery?q=${encodeURIComponent(`districts near ${searchTerm}`)}`,
            );
          }}
        >
          Find Similar Districts
        </Button>

        {loading ? (
          <Skeleton className="h-8 w-32 rounded" />
        ) : mostRecent ? (
          <Button variant="outlineBrand" size="sm" disabled={isPreviewActive} asChild={!isPreviewActive}>
            {isPreviewActive ? (
              'View Playbook'
            ) : (
              <Link href={`/districts/${districtId}/playbooks/${mostRecent.playbookId}`}>
                View Playbook
              </Link>
            )}
          </Button>
        ) : (
          <Button
            size="sm"
            onClick={onGeneratePlaybook}
            disabled={isPreviewActive || !activeProductName}
          >
            {activeProductName
              ? `Generate ${activeProductName} Playbook`
              : 'Generate Playbook'}
          </Button>
        )}
      </div>
    </div>
  );
}
