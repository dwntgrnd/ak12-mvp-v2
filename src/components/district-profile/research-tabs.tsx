'use client';

import { useMemo } from 'react';
import { Target, BarChart3, TrendingUp, Newspaper } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  getDistrictIntelligence,
  getAvailableCategories,
} from '@/services/providers/mock/fixtures/district-intelligence';
import type { IntelligenceCategory } from '@/services/types/district-intelligence';
import type { LucideIcon } from 'lucide-react';
import type { DistrictYearData } from '@/services/providers/mock/fixtures/districts';
import type { MatchSummary, AlignmentDimensionKey } from '@/services/types/common';
import { GoalsFundingTab } from './goals-funding-tab';
import { AcademicPerformanceTab } from './academic-performance-tab';
import { DistrictChart } from './district-chart';
import { NewsStubTab } from './news-stub-tab';
import { LensAugmentationBlock } from './lens-augmentation-block';

interface ResearchTabsProps {
  districtId: string;
  yearData?: DistrictYearData[];
  isLensActive?: boolean;
  matchSummary?: MatchSummary | null;
  activeProductName?: string;
}

interface TabConfig {
  key: IntelligenceCategory | 'districtTrends' | 'news';
  label: string;
  icon: LucideIcon;
}

const TAB_DIMENSION_MAP: Record<string, AlignmentDimensionKey[]> = {
  goalsFunding: ['goals_priorities', 'budget_capacity'],
  academicPerformance: ['academic_need', 'student_population'],
  districtTrends: ['student_population'],
  news: [],
};

const TAB_CONFIG: TabConfig[] = [
  { key: 'goalsFunding', label: 'Goals & Funding', icon: Target },
  { key: 'academicPerformance', label: 'Academic Performance', icon: BarChart3 },
  { key: 'districtTrends', label: 'District Trends', icon: TrendingUp },
  { key: 'news', label: 'News', icon: Newspaper },
];

export function ResearchTabs({ districtId, yearData, isLensActive, matchSummary, activeProductName }: ResearchTabsProps) {
  const { intel, availableTabs } = useMemo(() => {
    const data = getDistrictIntelligence(districtId);
    const categories = getAvailableCategories(districtId);

    // Intelligence tabs filtered by available categories
    const intelligenceTabs = TAB_CONFIG.filter(
      (t) => t.key !== 'districtTrends' && t.key !== 'news' && categories.includes(t.key as IntelligenceCategory)
    );

    // District Trends tab appended conditionally based on yearData
    const hasTrendsData = yearData != null && yearData.length > 0;
    const trendTab = hasTrendsData ? [TAB_CONFIG.find((t) => t.key === 'districtTrends')!] : [];
    const newsTab = [TAB_CONFIG.find((t) => t.key === 'news')!];

    return { intel: data, availableTabs: [...intelligenceTabs, ...trendTab, ...newsTab] };
  }, [districtId, yearData]);

  if (availableTabs.length === 0) return null;

  return (
    <Tabs defaultValue={availableTabs[0].key}>
      <TabsList className="h-auto w-full justify-start gap-0 rounded-none border-b border-border bg-transparent p-0">
        {availableTabs.map((tab) => (
          <TabsTrigger
            key={tab.key}
            value={tab.key}
            className="-mb-px gap-1.5 rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 text-sm font-medium text-foreground-secondary shadow-none transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {availableTabs.map((tab) => {
        const dimensionKeys = TAB_DIMENSION_MAP[tab.key] ?? [];
        const showAugmentation = isLensActive && activeProductName && dimensionKeys.length > 0;
        const filteredDimensions = showAugmentation && matchSummary
          ? matchSummary.dimensions.filter((d) => dimensionKeys.includes(d.key))
          : [];

        return (
          <TabsContent key={tab.key} value={tab.key}>
            {showAugmentation && (
              <div className="pt-4">
                <LensAugmentationBlock
                  productName={activeProductName}
                  dimensions={filteredDimensions}
                />
              </div>
            )}
            {tab.key === 'goalsFunding' && intel && <GoalsFundingTab intel={intel} />}
            {tab.key === 'academicPerformance' && intel && <AcademicPerformanceTab intel={intel} />}
            {tab.key === 'news' && <NewsStubTab />}
            {tab.key === 'districtTrends' && yearData && (
              <div className="pt-4">
                <DistrictChart yearData={yearData} />
              </div>
            )}
          </TabsContent>
        );
      })}
    </Tabs>
  );
}
