'use client';

import { useState, useCallback, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { DiscoveryEntryState } from '@/components/discovery/discovery-entry-state';
import { GeneratePlaybookSheet } from '@/components/playbook/generate-playbook-sheet';
import { LibraryRequiredDialog } from '@/components/shared/library-required-dialog';
import { useLibraryReadiness } from '@/hooks/use-library-readiness';
import { useProductLens } from '@/hooks/use-product-lens';
import { useSavedDistricts } from '@/hooks/use-saved-districts';

function DiscoveryPageInner() {
  const router = useRouter();
  // Product lens — shared singleton hook (persists across navigation)
  const { activeProduct } = useProductLens();
  const productLensId = activeProduct?.productId;

  // Library readiness — session-cached
  const readiness = useLibraryReadiness();

  // Saved districts — shared singleton hook
  useSavedDistricts();

  // Playbook sheet state
  const [playbookOpen, setPlaybookOpen] = useState(false);
  const [playbookDistrictId, setPlaybookDistrictId] = useState<string | null>(null);

  // Library required dialog state
  const [showLibraryDialog, setShowLibraryDialog] = useState(false);

  function handleDirectNavigation(districtId: string) {
    router.push(`/districts/${districtId}`);
  }

  const handleGeneratePlaybook = useCallback((districtId: string) => {
    if (!readiness.hasProducts) {
      setShowLibraryDialog(true);
      return;
    }
    setPlaybookDistrictId(districtId);
    setPlaybookOpen(true);
  }, [readiness.hasProducts]);

  return (
    <>
      <DiscoveryEntryState
        onDirectNavigation={handleDirectNavigation}
      />

      {/* Generate Playbook sheet */}
      <GeneratePlaybookSheet
        open={playbookOpen}
        onOpenChange={setPlaybookOpen}
        initialDistrict={
          playbookDistrictId
            ? {
                districtId: playbookDistrictId,
                districtName: playbookDistrictId,
                location: '',
                enrollment: 0,
              }
            : undefined
        }
        initialProductIds={productLensId ? [productLensId] : undefined}
      />

      {/* Library required dialog — shown when playbook CTA clicked without products */}
      <LibraryRequiredDialog
        open={showLibraryDialog}
        onOpenChange={setShowLibraryDialog}
      />
    </>
  );
}

export default function DiscoveryPage() {
  return (
    <Suspense>
      <DiscoveryPageInner />
    </Suspense>
  );
}
