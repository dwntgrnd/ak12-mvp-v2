import { ResearchBrief } from './research-brief';
import type { DistrictIntelligence } from '@/services/types/district-intelligence';

interface GoalsFundingTabProps {
  intel: DistrictIntelligence;
}

export function GoalsFundingTab({ intel }: GoalsFundingTabProps) {
  const leadInsight =
    intel.goalsBrief?.leadInsight ??
    intel.prioritySummary ??
    'District goals and funding information available below.';
  const keySignals = intel.goalsBrief?.keySignals ?? [];

  const additionalContent =
    intel.otherFundingSignals && intel.otherFundingSignals.length > 0 ? (
      <div>
        <h4 className="text-subsection-sm font-semibold text-foreground mb-2">
          Other Funding Signals
        </h4>
        {intel.otherFundingSignals.map((signal) => (
          <div key={signal.name} className="py-1.5">
            <p className="text-sm font-medium">
              {signal.name}{signal.amount && ` — ${signal.amount}`}
            </p>
            <p className="text-xs text-muted-foreground">
              {signal.relevanceNote}{signal.expiration && ` · Expires ${signal.expiration}`}
            </p>
          </div>
        ))}
      </div>
    ) : undefined;

  const goals = intel.goals && intel.goals.length > 0 ? intel.goals : null;

  const detailContent = goals ? (
    <div>
      {goals.map((goal) => (
        <div key={goal.goalId} className="py-3 first:pt-0">
          <p className="text-sm font-semibold">
            {goal.goalNumber && `${goal.goalNumber}: `}{goal.title}
            {goal.academicYear && (
              <span className="ml-2 text-xs font-normal text-muted-foreground">{goal.academicYear}</span>
            )}
          </p>
          {goal.actions?.map((action) => (
            <div key={action.actionId} className="ml-4 mt-1.5">
              <p className="text-sm">
                {action.actionNumber && <span className="text-muted-foreground">{action.actionNumber}: </span>}
                {action.title}
              </p>
              {action.descriptionSummary && (
                <p className="text-xs text-muted-foreground mt-0.5">{action.descriptionSummary}</p>
              )}
              <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                {action.totalFunds && <span className="font-mono">{action.totalFunds}</span>}
                {action.fundingSource && <span>{action.fundingSource}</span>}
                {action.status && <span className="capitalize">{action.status.replace('_', ' ')}</span>}
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  ) : undefined;

  return (
    <ResearchBrief
      leadInsight={leadInsight}
      keySignals={keySignals}
      additionalContent={additionalContent}
      detailContent={detailContent}
      detailLabel="View all LCAP goals"
      sources={intel.sources}
    />
  );
}
