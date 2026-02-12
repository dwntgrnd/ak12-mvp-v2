'use client';

import type { DistrictSummary } from '@/services/types/district';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { SaveButton } from '@/components/district/save-button';
import { ExcludeButton } from '@/components/district/exclude-button';

interface DistrictResultCardProps {
  district: DistrictSummary;
  isSaved?: boolean;
}

export function DistrictResultCard({ district, isSaved = false }: DistrictResultCardProps) {
  return (
    <Link
      href={`/districts/${district.districtId}`}
      className="block bg-card border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{district.name}</h3>
          <p className="text-muted-foreground text-sm mt-1">{district.location}</p>
          <p className="text-sm mt-2">
            <span className="font-medium">{district.enrollment.toLocaleString()}</span>{' '}
            <span className="text-muted-foreground">students</span>
          </p>
        </div>
        <div className="flex items-center gap-2">
          <SaveButton
            districtId={district.districtId}
            initialSaved={isSaved}
          />
          <ExcludeButton districtId={district.districtId} />
          <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
        </div>
      </div>
    </Link>
  );
}
