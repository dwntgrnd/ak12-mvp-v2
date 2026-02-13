import { Target, Newspaper, Users, BarChart3, FileSearch } from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import type { LucideIcon } from 'lucide-react';

interface TabConfig {
  value: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

const tabs: TabConfig[] = [
  {
    value: 'goals',
    label: 'Goals and Priorities',
    icon: Target,
    description: 'District goals and budget priorities from LCAP documents will appear here.',
  },
  {
    value: 'news',
    label: 'Recent News',
    icon: Newspaper,
    description: 'District news, board decisions, and press coverage will appear here.',
  },
  {
    value: 'contacts',
    label: 'Contact Directory',
    icon: Users,
    description: 'Key district personnel and department contacts will appear here.',
  },
  {
    value: 'competitive',
    label: 'Competitive Landscape',
    icon: BarChart3,
    description: 'Other publishers and vendors active in this district will appear here.',
  },
  {
    value: 'rfps',
    label: 'RFPs',
    icon: FileSearch,
    description: 'Active and historical requests for proposals will appear here.',
  },
];

export function ResearchTabs() {
  return (
    <Tabs defaultValue="goals">
      <TabsList className="flex-wrap h-auto gap-1">
        {tabs.map((tab) => (
          <TabsTrigger key={tab.value} value={tab.value}>
            {tab.label}
          </TabsTrigger>
        ))}
      </TabsList>

      {tabs.map((tab) => (
        <TabsContent key={tab.value} value={tab.value}>
          <div className="flex min-h-[300px] flex-col items-center justify-center gap-3 rounded-lg border p-8">
            <tab.icon className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="text-lg font-semibold text-muted-foreground">
              Coming Soon
            </h3>
            <p className="max-w-md text-center text-sm text-muted-foreground">
              {tab.description}
            </p>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
}
