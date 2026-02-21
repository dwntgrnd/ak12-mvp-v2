'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GeneratePlaybookSheet } from '@/components/playbook/generate-playbook-sheet';

export default function GenerateDemoPage() {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [scenario, setScenario] = useState<'cold' | 'district' | 'product' | 'empty'>('cold');

  // Simulated entry point contexts
  const districtContext = {
    districtId: 'dist-lausd-001',
    districtName: 'Los Angeles Unified School District',
    location: 'Los Angeles, CA',
    enrollment: 422276,
  };

  const productContext = ['prod-001']; // EnvisionMath

  // Only render in development
  if (process.env.NODE_ENV !== 'development') {
    return (
      <div className="p-8">
        <p className="text-muted-foreground">This page is only available in development mode.</p>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Generate Playbook — Demo Scenarios</h1>
        <p className="text-muted-foreground mt-1">
          Test the generation trigger from different entry points.
        </p>
      </div>

      <div className="flex flex-col gap-3 max-w-md">
        <Button
          variant="outline"
          onClick={() => {
            setScenario('cold');
            setSheetOpen(true);
          }}
        >
          Entry 5: Cold Start (Playbook List — no pre-fills)
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setScenario('district');
            setSheetOpen(true);
          }}
        >
          Entry 1/2: From District (district pre-filled)
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setScenario('product');
            setSheetOpen(true);
          }}
        >
          Entry 3/4: From Product (product pre-filled)
        </Button>
        <Button
          variant="outline"
          onClick={() => {
            setScenario('empty');
            setSheetOpen(true);
          }}
        >
          Entry 0: Empty Product Catalog (no products)
        </Button>
      </div>

      {/* District Listing Previews */}
      <div className="mt-8">
        <h2 className="text-lg font-semibold">District Listing Previews</h2>
        <p className="text-muted-foreground mt-1">
          Preview district card rendering across listing formats.
        </p>
        <div className="flex flex-col gap-3 max-w-md mt-3">
          <Button variant="outline" asChild>
            <Link href="/demo/listings/ranked">Ranked List</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/demo/listings/card-set">Card Set</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/demo/listings/brief">Narrative Brief</Link>
          </Button>
        </div>
      </div>

      <GeneratePlaybookSheet
        open={sheetOpen}
        onOpenChange={setSheetOpen}
        initialDistrict={scenario === 'district' ? districtContext : undefined}
        initialProductIds={scenario === 'product' ? productContext : undefined}
        _demoEmptyCatalog={scenario === 'empty'}
      />
    </div>
  );
}
