'use client';

import { RankedListRenderer } from '@/components/discovery/renderers/ranked-list-renderer';
import type { RankedListContent, ResponseConfidence } from '@/services/types/discovery';

const CONTENT: RankedListContent = {
  title: 'Sacramento County Districts by Math Proficiency Decline (2-Year)',
  rankingCriterion: '2-year math proficiency percentage point change',
  entries: [
    {
      rank: 1,
      districtId: 'twin-rivers-usd',
      name: 'Twin Rivers USD',
      primaryMetric: { label: 'Math Decline', value: '-5.1pp' },
      secondaryMetrics: [
        { label: 'Current Proficiency', value: '31.2%' },
        { label: 'Enrollment', value: '27,100' },
      ],
      confidence: 1,
    },
    {
      rank: 2,
      districtId: 'sacramento-city-usd',
      name: 'Sacramento City USD',
      primaryMetric: { label: 'Math Decline', value: '-4.6pp' },
      secondaryMetrics: [
        { label: 'Current Proficiency', value: '29.8%' },
        { label: 'Enrollment', value: '42,500' },
      ],
      confidence: 2,
      confidenceNote: 'Proficiency data from 2023-24; 2024-25 not yet published.',
    },
    {
      rank: 3,
      districtId: 'a2671310-4656-4e43-a91a-7688536f1764',
      name: 'Elk Grove USD',
      primaryMetric: { label: 'Math Decline', value: '-3.8pp' },
      secondaryMetrics: [
        { label: 'Current Proficiency', value: '38.4%' },
        { label: 'Enrollment', value: '59,800' },
      ],
      confidence: 1,
    },
    {
      rank: 4,
      districtId: 'natomas-usd',
      name: 'Natomas USD',
      primaryMetric: { label: 'Math Decline', value: '-2.9pp' },
      secondaryMetrics: [
        { label: 'Current Proficiency', value: '35.1%' },
        { label: 'Enrollment', value: '14,200' },
      ],
      confidence: 2,
      confidenceNote: 'Limited LCAP data available for Natomas.',
    },
  ],
  synthesis:
    'Twin Rivers and Sacramento City show the most significant math proficiency declines in the county, both exceeding 4 percentage points over two years. Both districts have prioritized math intervention in their LCAPs. Elk Grove\'s decline is more moderate but notable given its large enrollment — the district has already initiated a K-8 math curriculum review. Natomas shows the smallest decline but limited LCAP documentation makes it harder to assess their response.',
};

const CONFIDENCE: ResponseConfidence = {
  overall: 2,
  sections: {
    'rank-1': { level: 1 },
    'rank-2': { level: 2 },
    'rank-3': { level: 1 },
    'rank-4': { level: 2 },
  },
};

const noop = () => {};

export default function RankedListPreviewPage() {
  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">This page is only available in development mode.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-content">
      <h1 className="text-2xl font-bold tracking-[-0.01em]">Ranked List Preview</h1>
      <p className="text-muted-foreground mt-1 mb-6">Scenario 7 — Sacramento County math declines</p>
      <RankedListRenderer
        content={CONTENT}
        confidence={CONFIDENCE}
        products={[]}
        productLensId={undefined}
        onProductLensChange={noop}
      />
    </div>
  );
}
