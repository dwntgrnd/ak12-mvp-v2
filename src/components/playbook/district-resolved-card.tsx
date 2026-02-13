'use client';

import { Button } from '@/components/ui/button';
import { formatNumber } from '@/lib/utils/format';

export interface DistrictResolvedCardProps {
  district: {
    districtId: string;
    districtName: string;
    location: string;
    enrollment: number;
  };
  onChangeClick: () => void;
}

export function DistrictResolvedCard({
  district,
  onChangeClick,
}: DistrictResolvedCardProps) {
  return (
    <div
      className="flex items-start justify-between gap-4 px-4 py-3 rounded-lg border border-border bg-background"
      role="status"
      aria-label={`Selected district: ${district.districtName}, ${district.location}, ${formatNumber(district.enrollment)} students`}
    >
      <div className="min-w-0">
        <p className="font-semibold text-foreground text-base">
          {district.districtName}
        </p>
        <p className="text-sm text-muted-foreground">
          {district.location} &middot; {formatNumber(district.enrollment)} students
        </p>
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={onChangeClick}
        className="text-xs text-muted-foreground shrink-0 h-auto py-1 px-2"
      >
        Change
      </Button>
    </div>
  );
}
