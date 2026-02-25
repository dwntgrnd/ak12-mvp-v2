'use client';

import { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Skeleton } from '@/components/ui/skeleton';
import type { Playbook } from '@/services/types/playbook';

interface PlaybookPreviewTabsProps {
  playbook: Playbook | null;
  isGenerating: boolean;
}

const PREVIEW_TAB_CONFIG = [
  { sectionType: 'key_themes', label: 'Key Themes' },
  { sectionType: 'stakeholder_talking_points', label: 'Stakeholder Talking Points' },
  { sectionType: 'product_fit_data', label: 'Product Fit / Data' },
  { sectionType: 'handling_objections', label: 'Handling Objections' },
  { sectionType: 'competition', label: 'Competition' },
  { sectionType: 'news', label: 'News' },
] as const;

export function PlaybookPreviewTabs({
  playbook,
  isGenerating,
}: PlaybookPreviewTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(PREVIEW_TAB_CONFIG[0].sectionType);

  return (
    <div>
      {isGenerating && (
        <div className="flex items-center gap-2 mb-4">
          <Loader2 className="h-4 w-4 animate-spin text-primary" />
          <span className="text-sm text-foreground-secondary">Generating playbook…</span>
        </div>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="h-auto w-full justify-start gap-0 rounded-none border-b border-border-default bg-transparent p-0 overflow-x-auto">
          {PREVIEW_TAB_CONFIG.map(({ sectionType, label }) => (
            <TabsTrigger
              key={sectionType}
              value={sectionType}
              disabled={isGenerating}
              className="-mb-px gap-1.5 rounded-none border-b-2 border-transparent bg-transparent px-4 py-2.5 text-sm font-medium text-foreground-secondary shadow-none transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-foreground data-[state=active]:shadow-none"
            >
              {label}
            </TabsTrigger>
          ))}
        </TabsList>

        {PREVIEW_TAB_CONFIG.map(({ sectionType }) => {
          const section = playbook?.sections.find(
            (s) => s.sectionType === sectionType,
          );
          const contentBlocks = section?.content
            ? section.content.split('\n\n').filter((b) => b.trim())
            : [];

          return (
            <TabsContent key={sectionType} value={sectionType} className="pt-4">
              {isGenerating ? (
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-4 w-4/6" />
                  <Skeleton className="h-4 w-full" />
                </div>
              ) : contentBlocks.length > 0 ? (
                <div className="space-y-3">
                  {contentBlocks.map((block, idx) => (
                    <p key={idx} className="text-sm text-foreground">
                      {block}
                    </p>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-foreground-secondary">
                  No content available for this section.
                </p>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
