'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Collapsible, CollapsibleTrigger, CollapsibleContent } from '@/components/ui/collapsible';
import { SourceCitation } from './source-citation';
import type { KeySignal, IntelligenceSource } from '@/services/types/district-intelligence';

interface ResearchBriefProps {
  leadInsight: string;
  keySignals: KeySignal[];
  detailContent?: React.ReactNode;
  detailLabel?: string;
  additionalContent?: React.ReactNode;
  sources?: IntelligenceSource[];
}

export function ResearchBrief({
  leadInsight,
  keySignals,
  detailContent,
  detailLabel = 'View details',
  additionalContent,
  sources,
}: ResearchBriefProps) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="rounded-lg bg-muted/40 p-4">
        <p className="text-sm leading-relaxed">{leadInsight}</p>
      </div>

      <div className="mt-4 space-y-2">
        <dl>
          {keySignals.map((signal, i) => (
            <div key={i}>
              <dt className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{signal.label}</dt>
              <dd className="text-sm font-medium">{signal.value}</dd>
              {signal.detail && <dd className="text-xs text-muted-foreground">{signal.detail}</dd>}
            </div>
          ))}
        </dl>
      </div>

      {additionalContent && (
        <div className="mt-4">{additionalContent}</div>
      )}

      {detailContent && (
        <div className="mt-4">
          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger asChild>
              <button className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
                <ChevronRight className={cn('h-4 w-4 transition-transform', open && 'rotate-90')} />
                {detailLabel}
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>{detailContent}</CollapsibleContent>
          </Collapsible>
        </div>
      )}

      <SourceCitation sources={sources} />
    </div>
  );
}
