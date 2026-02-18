import type { DistrictProfile } from '@/services/types/district';
import type { DistrictYearData } from '@/services/providers/mock/fixtures/districts';
import { formatNumber } from '@/lib/utils/format';
import { calculateTrend } from '@/lib/utils/trends';
import { MetricTile } from './metric-tile';

interface KeyMetricsGridProps {
  district: DistrictProfile;
  yearData: DistrictYearData[];
}

export function KeyMetricsGrid({ district, yearData }: KeyMetricsGridProps) {
  const enrollmentTrend = calculateTrend(yearData.map((y) => y.totalEnrollment));
  const elaTrend = calculateTrend(yearData.map((y) => y.elaProficiency));

  const frpmPercentages = yearData.map((y) =>
    y.frpmCount != null && y.totalEnrollment != null && y.totalEnrollment > 0
      ? (y.frpmCount / y.totalEnrollment) * 100
      : null
  );
  const frpmTrend = calculateTrend(frpmPercentages);

  const spedPercentages = yearData.map((y) =>
    y.spedCount != null && y.totalEnrollment != null && y.totalEnrollment > 0
      ? (y.spedCount / y.totalEnrollment) * 100
      : null
  );
  const spedTrend = calculateTrend(spedPercentages);

  const currentFrpmPct =
    district.frpmCount != null && district.totalEnrollment > 0
      ? ((district.frpmCount / district.totalEnrollment) * 100).toFixed(1)
      : null;

  const currentSpedPct =
    district.spedCount != null && district.totalEnrollment > 0
      ? ((district.spedCount / district.totalEnrollment) * 100).toFixed(1)
      : null;

  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
        {district.lowGrade != null && district.highGrade != null && (
          <MetricTile
            label="Grades Served"
            value={`${district.lowGrade}–${district.highGrade}`}
          />
        )}

        <MetricTile
          label="Enrollment"
          value={formatNumber(district.totalEnrollment)}
          trend={enrollmentTrend}
          trendOptions={{ format: 'percent' }}
        />

        {district.elaProficiency != null && (
          <MetricTile
            label="ELA Proficiency"
            value={`${district.elaProficiency}%`}
            trend={elaTrend}
            trendOptions={{ format: 'points' }}
          />
        )}

        {currentFrpmPct != null && (
          <MetricTile
            label="FRPM"
            value={`${currentFrpmPct}%`}
            trend={frpmTrend}
            trendOptions={{ format: 'points' }}
            neutralTrend
          />
        )}

        {currentSpedPct != null && (
          <MetricTile
            label="SPED"
            value={`${currentSpedPct}%`}
            trend={spedTrend}
            trendOptions={{ format: 'points' }}
            neutralTrend
          />
        )}
      </div>

      <p className="mt-4 pt-3 border-t border-border text-xs font-medium text-muted-foreground">
        Sources: {district.name} {district.academicYear}
      </p>
    </div>
  );
}
