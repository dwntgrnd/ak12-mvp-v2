import { cn } from '@/lib/utils';
import { ResearchBrief } from './research-brief';
import type { DistrictIntelligence, SubjectBreakdown, SubgroupGap } from '@/services/types/district-intelligence';

interface AcademicPerformanceTabProps {
  intel: DistrictIntelligence;
}

function proficiencyColor(rate: number): string {
  if (rate < 30) return 'text-destructive';
  if (rate < 50) return 'text-amber-600 dark:text-amber-400';
  return 'text-emerald-600 dark:text-emerald-400';
}

function changeIndicator(current: number, prior?: number): { text: string; className: string } {
  if (prior === undefined) return { text: '—', className: 'text-foreground-secondary' };
  const delta = current - prior;
  if (Math.abs(delta) < 0.05) return { text: '—', className: 'text-foreground-secondary' };
  const sign = delta > 0 ? '↑ +' : '↓ ';
  const cls = delta > 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive';
  return { text: `${sign}${Math.abs(delta).toFixed(1)}`, className: cls };
}

function buildDetailContent(
  breakdowns?: SubjectBreakdown[],
  gaps?: SubgroupGap[],
): React.ReactNode | undefined {
  const allGradeBreakdowns = breakdowns?.filter((b) => b.gradeLevel === 'All') ?? [];
  const topGaps = gaps
    ? [...gaps].sort((a, b) => Math.abs(b.gapPoints) - Math.abs(a.gapPoints)).slice(0, 5)
    : [];

  if (allGradeBreakdowns.length === 0 && topGaps.length === 0) return undefined;

  return (
    <div className="space-y-6">
      {allGradeBreakdowns.length > 0 && (
        <div>
          <h4 className="text-subsection-sm font-semibold text-foreground mb-2">
            Overall Proficiency
          </h4>
          {allGradeBreakdowns.map((b) => {
            const change = changeIndicator(b.proficiencyRate, b.priorYearRate);
            return (
              <div key={b.subject} className="flex items-baseline justify-between py-1">
                <span className="text-sm">{b.subject}</span>
                <span className="flex items-baseline gap-3 text-sm tabular-nums">
                  {b.priorYearRate !== undefined && (
                    <span className="text-xs text-foreground-secondary">{b.priorYearRate.toFixed(1)}%</span>
                  )}
                  <span className={cn('font-medium', proficiencyColor(b.proficiencyRate))}>
                    {b.proficiencyRate.toFixed(1)}%
                  </span>
                  <span className={cn('text-xs', change.className)}>{change.text}</span>
                </span>
              </div>
            );
          })}
        </div>
      )}

      {topGaps.length > 0 && (
        <div>
          <h4 className="text-subsection-sm font-semibold text-foreground mb-2">
            Largest Achievement Gaps
          </h4>
          {topGaps.map((g, i) => (
            <div key={i} className="flex items-baseline justify-between py-1">
              <span className="text-sm">
                {g.subgroup}
                <span className="text-xs text-foreground-secondary"> · {g.subject}</span>
              </span>
              <span className="flex items-baseline gap-2 text-sm tabular-nums">
                <span className={cn('font-medium', proficiencyColor(g.proficiencyRate))}>
                  {g.proficiencyRate.toFixed(1)}%
                </span>
                <span className="text-xs text-destructive">
                  {g.gapPoints > 0 ? '+' : '−'}{Math.abs(g.gapPoints).toFixed(1)} pts
                </span>
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function AcademicPerformanceTab({ intel }: AcademicPerformanceTabProps) {
  const leadInsight =
    intel.academicBrief?.leadInsight ??
    intel.academicDetail?.narrative ??
    'Academic performance data available below.';

  const keySignals = intel.academicBrief?.keySignals ?? [];

  const detailContent = buildDetailContent(
    intel.academicDetail?.subjectBreakdowns,
    intel.academicDetail?.subgroupGaps,
  );

  return (
    <ResearchBrief
      leadInsight={leadInsight}
      keySignals={keySignals}
      detailContent={detailContent}
      detailLabel="View academic detail"
      sources={intel.sources}
    />
  );
}
