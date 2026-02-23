'use client';

import { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { brandColors } from '@/lib/design-tokens';
import { formatNumber } from '@/lib/utils/format';
import type { DistrictYearData } from '@/services/providers/mock/fixtures/districts';

interface DistrictChartProps {
  yearData: DistrictYearData[];
}

function formatAcademicYear(year: string): string {
  // "2021-2022" → "2021-22"
  const parts = year.split('-');
  if (parts.length === 2 && parts[1].length === 4) {
    return `${parts[0]}-${parts[1].slice(2)}`;
  }
  return year;
}

export function DistrictChart({ yearData }: DistrictChartProps) {
  const [view, setView] = useState<'enrollment' | 'proficiency'>('enrollment');

  const enrollmentData = useMemo(
    () =>
      yearData.map((y) => ({
        year: formatAcademicYear(y.academicYear),
        'Total Enrollment': y.totalEnrollment,
        FRPM: y.frpmCount,
        ELL: y.totalEll,
        SPED: y.spedCount,
      })),
    [yearData]
  );

  const proficiencyData = useMemo(
    () =>
      yearData.map((y) => ({
        year: formatAcademicYear(y.academicYear),
        ELA: y.elaProficiency,
        Math: y.mathProficiency,
      })),
    [yearData]
  );

  // Detect data gaps for footnote
  const dataGaps = useMemo(() => {
    const gaps: string[] = [];
    const seriesChecks = [
      { label: 'SPED', key: 'spedCount' as const },
      { label: 'ELL', key: 'totalEll' as const },
      { label: 'FRPM', key: 'frpmCount' as const },
    ];
    for (const check of seriesChecks) {
      const missingYears = yearData
        .filter((y) => y[check.key] == null)
        .map((y) => y.academicYear);
      if (missingYears.length > 0 && missingYears.length < yearData.length) {
        gaps.push(
          `${check.label} data not reported for ${missingYears.join(', ')}.`
        );
      }
    }
    return gaps;
  }, [yearData]);

  return (
    <div>
      <Tabs value={view} onValueChange={(v) => setView(v as 'enrollment' | 'proficiency')}>
        <TabsList className="mb-3">
          <TabsTrigger value="enrollment">Enrollment</TabsTrigger>
          <TabsTrigger value="proficiency">Proficiency</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="max-w-[600px] w-full">
        <ResponsiveContainer width="100%" height={280}>
          {view === 'enrollment' ? (
            <LineChart data={enrollmentData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} tickFormatter={(v) => formatNumber(v)} />
              <Tooltip formatter={(value) => value != null ? formatNumber(Number(value)) : '—'} />
              <Legend />
              <Line
                type="monotone"
                dataKey="Total Enrollment"
                stroke={brandColors.brand.orange}
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="FRPM"
                stroke={brandColors.brand.blue}
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="ELL"
                stroke={brandColors.brand.green}
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="SPED"
                stroke={brandColors.brand.midBlue}
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
            </LineChart>
          ) : (
            <LineChart data={proficiencyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="year" tick={{ fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} tickFormatter={(v) => `${v}%`} />
              <Tooltip formatter={(value) => value != null ? `${value}%` : '—'} />
              <Legend />
              <Line
                type="monotone"
                dataKey="ELA"
                stroke={brandColors.brand.blue}
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="Math"
                stroke={brandColors.brand.orange}
                strokeWidth={2}
                dot={{ r: 3 }}
                connectNulls
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>

      {dataGaps.length > 0 && (
        <p className="mt-2 text-xs text-foreground-secondary italic">
          Note: {dataGaps.join(' ')}
        </p>
      )}
    </div>
  );
}
