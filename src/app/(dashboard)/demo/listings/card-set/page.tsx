'use client';

import { CardSetRenderer } from '@/components/discovery/renderers/card-set-renderer';
import type { CardSetContent, ResponseConfidence } from '@/services/types/discovery';

const CONTENT: CardSetContent = {
  overview:
    'Four Sacramento County districts with significant English Learner populations and active EL support programs identified from LCAP priorities and demographic data.',
  districts: [
    {
      districtId: 'a2671310-4656-4e43-a91a-7688536f1764',
      name: 'Elk Grove USD',
      snapshot: {
        districtId: 'a2671310-4656-4e43-a91a-7688536f1764',
        name: 'Elk Grove USD',
        city: 'Elk Grove',
        county: 'Sacramento',
        state: 'CA',
        docType: 'Unified',
        lowGrade: 'K',
        highGrade: '12',
        totalEnrollment: 59800,
        frpmPercent: 48.2,
        ellPercent: 24.3,
        elaProficiency: 42.7,
        mathProficiency: 38.4,
      },
      location: 'Elk Grove, CA',
      enrollment: 59800,
      keyMetric: { label: 'EL Population', value: '24.3%' },
      confidence: 1,
    },
    {
      districtId: 'sacramento-city-usd',
      name: 'Sacramento City USD',
      snapshot: {
        districtId: 'sacramento-city-usd',
        name: 'Sacramento City USD',
        city: 'Sacramento',
        county: 'Sacramento',
        state: 'CA',
        docType: 'Unified',
        lowGrade: 'K',
        highGrade: '12',
        totalEnrollment: 42500,
        frpmPercent: 65.3,
        ellPercent: 19.7,
        elaProficiency: 32.1,
        mathProficiency: 29.8,
      },
      location: 'Sacramento, CA',
      enrollment: 42500,
      keyMetric: { label: 'EL Population', value: '19.7%' },
      confidence: 2,
    },
    {
      districtId: 'twin-rivers-usd',
      name: 'Twin Rivers USD',
      snapshot: {
        districtId: 'twin-rivers-usd',
        name: 'Twin Rivers USD',
        city: 'North Highlands',
        county: 'Sacramento',
        state: 'CA',
        docType: 'Unified',
        lowGrade: 'K',
        highGrade: '12',
        totalEnrollment: 27100,
        frpmPercent: 72.1,
        ellPercent: 21.5,
        elaProficiency: 33.4,
        mathProficiency: 31.2,
      },
      location: 'North Highlands, CA',
      enrollment: 27100,
      keyMetric: { label: 'EL Population', value: '21.5%' },
      confidence: 1,
    },
    {
      districtId: 'natomas-usd',
      name: 'Natomas USD',
      snapshot: {
        districtId: 'natomas-usd',
        name: 'Natomas USD',
        city: 'Sacramento',
        county: 'Sacramento',
        state: 'CA',
        docType: 'Unified',
        lowGrade: 'K',
        highGrade: '12',
        totalEnrollment: 14200,
        frpmPercent: 44.8,
        ellPercent: 16.8,
        elaProficiency: 39.2,
        mathProficiency: 35.1,
      },
      location: 'Sacramento, CA',
      enrollment: 14200,
      keyMetric: { label: 'EL Population', value: '16.8%' },
      confidence: 2,
    },
  ],
};

const CONFIDENCE: ResponseConfidence = {
  overall: 2,
  sections: {},
};

const noop = () => {};

export default function CardSetPreviewPage() {
  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">This page is only available in development mode.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-content">
      <h1 className="text-2xl font-bold tracking-[-0.01em]">Card Set Preview</h1>
      <p className="text-muted-foreground mt-1 mb-6">Scenario 8 — Sacramento County EL programs</p>
      <CardSetRenderer
        content={CONTENT}
        confidence={CONFIDENCE}
        products={[]}
        productLensId={undefined}
        onProductLensChange={noop}
      />
    </div>
  );
}
