'use client';

import { useMemo } from 'react';
import { Target, BarChart3, Shield, TrendingUp } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  getDistrictIntelligence,
  getAvailableCategories,
} from '@/services/providers/mock/fixtures/district-intelligence';
import type { IntelligenceCategory } from '@/services/types/district-intelligence';
import type { LucideIcon } from 'lucide-react';
import type { DistrictYearData } from '@/services/providers/mock/fixtures/districts';
import { GoalsFundingTab } from './goals-funding-tab';
import { AcademicPerformanceTab } from './academic-performance-tab';
import { CompetitiveIntelTab } from './competitive-intel-tab';
import { DistrictChart } from './district-chart';

interface ResearchTabsProps {
  districtId: string;
  yearData?: DistrictYearData[];
}

interface TabConfig {
  key: IntelligenceCategory | 'districtTrends';
  label: string;
  icon: LucideIcon;
}

const TAB_CONFIG: TabConfig[] = [
  { key: 'goalsFunding', label: 'Goals & Funding', icon: Target },
  { key: 'academicPerformance', label: 'Academic Performance', icon: BarChart3 },
  { key: 'competitiveIntel', label: 'Competitive Intel', icon: Shield },
  { key: 'districtTrends', label: 'District Trends', icon: TrendingUp },
];

export function ResearchTabs({ districtId, yearData }: ResearchTabsProps) {
  const { intel, availableTabs } = useMemo(() => {
    const data = getDistrictIntelligence(districtId);
    const categories = getAvailableCategories(districtId);

    // Intelligence tabs filtered by available categories
    const intelligenceTabs = TAB_CONFIG.filter(
      (t) => t.key !== 'districtTrends' && categories.includes(t.key as IntelligenceCategory)
    );

    // District Trends tab appended conditionally based on yearData
    const hasTrendsData = yearData != null && yearData.length > 0;
    const tabs = hasTrendsData
      ? [...intelligenceTabs, TAB_CONFIG.find((t) => t.key === 'districtTrends')!]
      : intelligenceTabs;

    return { intel: data, availableTabs: tabs };
  }, [districtId, yearData]);

  if (availableTabs.length === 0) return null;

  return (
    <Tabs defaultValue={availableTabs[0].key}>
      <TabsList className="h-auto w-full justify-start gap-0 rounded-none border-b border-border bg-transparent p-0">
        {availableTabs.map((tab) => (
          <TabsTrigger
            key={tab.key}
            value={tab.key}
            className="-mb-px gap-1.5 rounded-none border-b-2 border-transparent bg-transparent px-4 py-2 text-sm font-medium text-muted-foreground shadow-none transition-colors hover:text-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:font-semibold data-[state=active]:text-foreground data-[state=active]:shadow-none"
          >
            <tab.icon className="h-3.5 w-3.5" />
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {availableTabs.map((tab) => (
        <TabsContent key={tab.key} value={tab.key}>
          {tab.key === 'goalsFunding' && intel && <GoalsFundingTab intel={intel} />}
          {tab.key === 'academicPerformance' && intel && <AcademicPerformanceTab intel={intel} />}
          {tab.key === 'competitiveIntel' && intel && <CompetitiveIntelTab intel={intel} />}
          {tab.key === 'districtTrends' && yearData && (
            <div className="pt-4">
              <DistrictChart yearData={yearData} />
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
