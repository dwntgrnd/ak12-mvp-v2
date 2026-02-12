'use client';

import type { DistrictSummary } from '@/services/types/district';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';

interface DistrictResultCardProps {
  district: DistrictSummary;
}

export function DistrictResultCard({ district }: DistrictResultCardProps) {
  return (
    <Link
      href={`/districts/${district.districtId}`}
      className="block bg-card border rounded-lg p-4 hover:border-primary/50 hover:shadow-sm transition-all cursor-pointer"
    >
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <h3 className="font-semibold text-lg">{district.name}</h3>
          <p className="text-muted-foreground text-sm mt-1">{district.location}</p>
          <p className="text-sm mt-2">
            <span className="font-medium">{district.enrollment.toLocaleString()}</span>{' '}
            <span className="text-muted-foreground">students</span>
          </p>
        </div>
        <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-4" />
      </div>
    </Link>
  );
}
