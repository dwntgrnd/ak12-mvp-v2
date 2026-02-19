import { DiscoveryInput } from './discovery-input';
import { FollowUpChips } from './follow-up-chips';
import { SourceCitations } from './source-citations';
import { DiscoveryFormatRouter } from './discovery-format-router';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { DiscoveryQueryResponse } from '@/services/types/discovery';

interface DiscoveryResultsLayoutProps {
  query: string;
  response: DiscoveryQueryResponse | null;
  error?: string | null;
  onNewQuery: (query: string) => void;
  onDirectNavigation: (districtId: string) => void;
  onClearResults: () => void;
}

export function DiscoveryResultsLayout({
  query,
  response,
  error,
  onNewQuery,
  onDirectNavigation,
  onClearResults,
}: DiscoveryResultsLayoutProps) {
  return (
    <div className="w-full">
      {/* Compact input bar — full width, active */}
      <DiscoveryInput
        variant="compact"
        initialValue={query}
        onSubmit={onNewQuery}
        onDirectNavigation={onDirectNavigation}
        onClear={onClearResults}
      />

      {/* Content area — constrained to reading width */}
      <div className="max-w-3xl mx-auto mt-6">
        {error && !response && (
          <div className="space-y-3">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <button
              type="button"
              onClick={() => onNewQuery(query)}
              className="text-sm font-medium text-slate-600 hover:text-foreground transition-colors underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        )}

        {response && (
          <div className="space-y-6">
            {/* Format router — switches on content.format */}
            <DiscoveryFormatRouter response={response} onNewQuery={onNewQuery} />

            {/* Follow-up chips */}
            <FollowUpChips
              chips={response.followUpChips}
              onChipClick={onNewQuery}
            />

            {/* Source citations */}
            <SourceCitations sources={response.sources} />
          </div>
        )}
      </div>
    </div>
  );
}
