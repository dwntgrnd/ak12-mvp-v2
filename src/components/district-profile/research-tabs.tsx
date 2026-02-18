'use client';

import { useMemo } from 'react';
import { Target, BarChart3, Shield } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  getDistrictIntelligence,
  getAvailableCategories,
} from '@/services/providers/mock/fixtures/district-intelligence';
import type { IntelligenceCategory } from '@/services/types/district-intelligence';
import type { LucideIcon } from 'lucide-react';
import { GoalsFundingTab } from './goals-funding-tab';
import { AcademicPerformanceTab } from './academic-performance-tab';
import { CompetitiveIntelTab } from './competitive-intel-tab';

interface ResearchTabsProps {
  districtId: string;
}

interface TabConfig {
  key: IntelligenceCategory;
  label: string;
  icon: LucideIcon;
}

const TAB_CONFIG: TabConfig[] = [
  { key: 'goalsFunding', label: 'Goals & Funding', icon: Target },
  { key: 'academicPerformance', label: 'Academic Performance', icon: BarChart3 },
  { key: 'competitiveIntel', label: 'Competitive Intel', icon: Shield },
];

export function ResearchTabs({ districtId }: ResearchTabsProps) {
  const { intel, availableTabs } = useMemo(() => {
    const data = getDistrictIntelligence(districtId);
    const categories = getAvailableCategories(districtId);
    const tabs = TAB_CONFIG.filter((t) => categories.includes(t.key));
    return { intel: data, availableTabs: tabs };
  }, [districtId]);

  if (availableTabs.length === 0 || !intel) return null;

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
          {tab.key === 'goalsFunding' && (
            <GoalsFundingTab intel={intel} />
          )}
          {tab.key === 'academicPerformance' && (
            <AcademicPerformanceTab intel={intel} />
          )}
          {tab.key === 'competitiveIntel' && (
            <CompetitiveIntelTab intel={intel} />
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
}
