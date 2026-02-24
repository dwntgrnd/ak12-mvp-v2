'use client';

import { Search } from 'lucide-react';
import type { AlignmentDimension } from '@/services/types/common';

interface LensAugmentationBlockProps {
  productName: string;
  dimensions: AlignmentDimension[];
}

export function LensAugmentationBlock({ productName, dimensions }: LensAugmentationBlockProps) {
  if (dimensions.length === 0) {
    return (
      <div className="mb-6 rounded-md bg-[rgba(240,134,50,0.06)] p-4">
        <div className="flex items-center gap-2">
          <Search className="h-3.5 w-3.5 text-foreground-secondary" />
          <span className="text-sm font-semibold text-foreground">{productName}</span>
          <span className="text-sm text-foreground-secondary">lens</span>
        </div>
        <p className="mt-2 text-sm text-foreground-tertiary">
          No specific alignment signals found for this tab.
        </p>
      </div>
    );
  }

  // Use productConnection from the first dimension as the lead insight
  const leadConnection = dimensions[0].productConnection;

  // Deduplicate signals across all dimensions
  const allSignals = Array.from(
    new Set(dimensions.flatMap((d) => d.signals))
  );

  return (
    <div className="mb-6 rounded-md bg-[rgba(240,134,50,0.06)] p-4">
      <div className="flex items-center gap-2">
        <Search className="h-3.5 w-3.5 text-foreground-secondary" />
        <span className="text-sm font-semibold text-foreground">{productName}</span>
        <span className="text-sm text-foreground-secondary">lens</span>
      </div>
      <p className="mt-2 text-sm text-foreground">{leadConnection}</p>
      {allSignals.length > 0 && (
        <ul className="mt-2 space-y-1">
          {allSignals.map((signal) => (
            <li key={signal} className="flex items-start gap-2 text-sm text-foreground-secondary">
              <span className="mt-1.5 h-1 w-1 shrink-0 rounded-full bg-foreground-tertiary" />
              {signal}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
