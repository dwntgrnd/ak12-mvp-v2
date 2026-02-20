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
      {/* Lead Insight — emphasis surface, no border */}
      <div className="bg-emphasis-surface rounded-md p-4">
        <p className="text-sm leading-relaxed text-foreground">{leadInsight}</p>
      </div>

      {/* Key Signals — 2-column grid */}
      {keySignals.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {keySignals.map((signal, i) => (
            <div key={i}>
              <p className="text-overline font-medium uppercase tracking-[0.05em] text-muted-foreground">
                {signal.label}
              </p>
              <p className="mt-1 text-sm font-semibold text-foreground">{signal.value}</p>
              {signal.detail && (
                <p className="mt-0.5 text-xs text-muted-foreground">{signal.detail}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Additional Content — inset surface */}
      {additionalContent && (
        <div className="mt-6 bg-slate-50 rounded-md p-4">{additionalContent}</div>
      )}

      {/* Collapsible Detail */}
      {detailContent && (
        <div className="mt-6">
          <Collapsible open={open} onOpenChange={setOpen}>
            <CollapsibleTrigger asChild>
              <button
                className={cn(
                  'flex w-full items-center gap-1.5 py-1.5 px-2 -mx-2 rounded-md',
                  'transition-colors hover:bg-slate-50',
                  'text-foreground hover:text-primary',
                )}
              >
                <ChevronRight
                  className={cn(
                    'h-[18px] w-[18px] transition-transform duration-200 ease-out',
                    open && 'rotate-90',
                  )}
                />
                <span className="text-subsection-heading font-semibold">{detailLabel}</span>
              </button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="bg-slate-50 rounded-md p-4 mt-3">{detailContent}</div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}

      <SourceCitation sources={sources} />
    </div>
  );
}
