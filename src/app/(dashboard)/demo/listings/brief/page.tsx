'use client';

import { BriefRenderer } from '@/components/discovery/renderers/brief-renderer';
import type { BriefContent, ResponseConfidence } from '@/services/types/discovery';

const CONTENT: BriefContent = {
  leadInsight:
    'Sacramento County has three large districts actively signaling math curriculum evaluation needs, led by Elk Grove USD\'s formal review process and Twin Rivers\' recent budget allocation for K-8 math materials.',
  keySignals: [
    {
      label: 'Elk Grove USD',
      value: 'Active K-8 math curriculum review',
      detail: 'RFP expected spring 2026',
      districtId: 'a2671310-4656-4e43-a91a-7688536f1764',
      location: 'Elk Grove, CA \u00b7 Sacramento County',
      enrollment: 59800,
    },
    {
      label: 'Twin Rivers USD',
      value: '$4.2M allocated for math materials',
      detail: 'Board approved evaluation timeline',
      districtId: 'twin-rivers-usd',
      location: 'North Highlands, CA \u00b7 Sacramento County',
      enrollment: 27100,
    },
    {
      label: 'Sacramento City USD',
      value: 'Math proficiency 29.1% \u00b7 LCAP Goal 2 priority',
      detail: 'LCAP prioritizes math intervention',
      districtId: 'sacramento-city-usd',
      location: 'Sacramento, CA \u00b7 Sacramento County',
      enrollment: 42500,
    },
    {
      label: 'Natomas USD',
      value: 'Math proficiency trending down 4.2pp',
      detail: 'Exploring supplemental programs',
      districtId: 'natomas-usd',
      location: 'Sacramento, CA \u00b7 Sacramento County',
      enrollment: 14800,
    },
  ],
  sections: [
    {
      sectionId: 'regional-math-landscape',
      heading: 'Regional Math Landscape',
      body: 'Sacramento County\'s four largest unified districts collectively enroll over 142,000 students and share a common challenge: math proficiency has declined steadily since 2021-22 across all grade spans. The county average of 31.8% math proficiency trails the California state average of 33.4%, and all four districts fall below pre-pandemic benchmarks. Elk Grove USD (38.4%) leads the group but is still 7 points below its 2018-19 level. Twin Rivers USD (31.2%) and Sacramento City USD (29.1%) reflect a deeper structural gap, particularly among English Learner and Socioeconomically Disadvantaged subgroups where proficiency ranges from 14% to 22%. Natomas USD (28.6%) has experienced the steepest decline, down 4.2 percentage points over two years, driven by demographic shifts in its fastest-growing attendance areas.',
      confidence: { level: 1 },
    },
    {
      sectionId: 'active-evaluation-signals',
      heading: 'Active Evaluation Signals',
      body: 'Elk Grove USD is the most advanced in its evaluation cycle. The district launched a formal K-8 math curriculum review in fall 2025 with a curriculum committee of 24 teachers and instructional coaches. An RFP for a full K-8 core adoption is expected in spring 2026, with board approval targeted for June 2026 and implementation in 2026-27. Twin Rivers USD signaled evaluation intent through its October 2024 board meeting, where trustees approved a $4.2M instructional materials allocation explicitly tied to math curriculum assessment. A formal RFP has not yet been published, but district leadership indicated a selection timeline before the 2025-26 school year ends. Sacramento City USD is in an earlier stage, with LCAP Goal 2 establishing math proficiency as a top priority and a curriculum coordinator position posted in January 2026 \u2014 a common leading indicator of impending adoption activity. Natomas USD has convened a math task force but has not allocated budget or set a formal timeline.',
      confidence: { level: 1 },
    },
    {
      sectionId: 'funding-timeline-context',
      heading: 'Funding & Timeline Context',
      body: 'LCAP-based funding provides the primary financing mechanism for math curriculum adoptions in this region. Elk Grove USD\'s curriculum budget draws from Local Control Funding Formula (LCFF) discretionary funds, with roughly $6.8M available in the current fiscal cycle for instructional materials across all subjects. Twin Rivers USD\'s $4.2M allocation is explicitly line-itemed in the 2025-26 adopted budget under Supplemental and Concentration Grant expenditures, indicating board-level commitment. Sacramento City USD has not yet allocated a specific amount, but the district\'s LCAP identifies $3.1M in unspent instructional materials carryforward from 2024-25, which may fund an adoption. Standard California adoption cycles run 5-7 years; Elk Grove\'s current Eureka Math adoption (2019) and Twin Rivers\' Go Math! adoption (2017) are both approaching or past typical review windows.',
      confidence: { level: 1 },
    },
  ],
};

const CONFIDENCE: ResponseConfidence = {
  overall: 1,
  sections: {
    'regional-math-landscape': { level: 1 },
    'active-evaluation-signals': { level: 1 },
    'funding-timeline-context': { level: 1 },
  },
};

export default function BriefPreviewPage() {
  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">This page is only available in development mode.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-3xl">
      <h1 className="text-2xl font-bold tracking-[-0.01em]">Narrative Brief Preview</h1>
      <p className="text-muted-foreground mt-1 mb-6">Scenario 1 — Large Sacramento districts with math evaluations</p>
      <BriefRenderer
        content={CONTENT}
        confidence={CONFIDENCE}
        format="narrative_brief"
      />
    </div>
  );
}
