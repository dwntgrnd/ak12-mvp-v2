import { ResearchBrief } from './research-brief';
import type { DistrictIntelligence, ProgramMention, CompetitorEntry } from '@/services/types/district-intelligence';

interface CompetitiveIntelTabProps {
  intel: DistrictIntelligence;
}

const MENTION_TYPE_LABELS: Record<ProgramMention['mentionType'], string> = {
  in_use: 'Currently in use',
  under_evaluation: 'Under evaluation',
  planned_replacement: 'Planned replacement',
  general_reference: 'Referenced in district documents',
};

function buildDetailContent(
  programMentions?: ProgramMention[],
  competitiveLandscape?: CompetitorEntry[],
): React.ReactNode | undefined {
  if (programMentions && programMentions.length > 0) {
    return (
      <div>
        {programMentions.map((m) => (
          <div key={m.mentionId} className="py-2 first:pt-0">
            <p className="text-sm font-medium">
              {m.programName}{m.vendorName && ` (${m.vendorName})`}
            </p>
            <p className="text-xs text-muted-foreground">
              {[m.subjectArea, m.gradeRange].filter(Boolean).join(' · ')}
              {(m.subjectArea || m.gradeRange) ? ' · ' : ''}
              {MENTION_TYPE_LABELS[m.mentionType]}
            </p>
            {m.sourceContext && (
              <p className="text-xs text-muted-foreground mt-0.5">{m.sourceContext}</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  if (competitiveLandscape && competitiveLandscape.length > 0) {
    return (
      <div>
        {competitiveLandscape.map((c) => (
          <div key={c.entryId} className="py-2 first:pt-0">
            <p className="text-sm font-medium">
              {c.vendorName}{c.productName && ` — ${c.productName}`}
            </p>
            <p className="text-xs text-muted-foreground">
              {[c.subjectArea, c.gradeRange].filter(Boolean).join(' · ')}
            </p>
            {c.notes && (
              <p className="text-xs text-muted-foreground mt-0.5">{c.notes}</p>
            )}
          </div>
        ))}
      </div>
    );
  }

  return undefined;
}

export function CompetitiveIntelTab({ intel }: CompetitiveIntelTabProps) {
  const leadInsight =
    intel.competitiveBrief?.leadInsight ??
    'Competitive intelligence available — expand for details.';

  const keySignals = intel.competitiveBrief?.keySignals ?? [];

  const detailContent = buildDetailContent(intel.programMentions, intel.competitiveLandscape);

  return (
    <ResearchBrief
      leadInsight={leadInsight}
      keySignals={keySignals}
      detailContent={detailContent}
      detailLabel="View all program mentions"
      sources={intel.sources}
    />
  );
}
