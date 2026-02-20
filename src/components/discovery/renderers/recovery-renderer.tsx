import type { RecoveryContent } from '@/services/types/discovery';

interface RecoveryRendererProps {
  content: RecoveryContent;
  onRedirectQuery: (query: string) => void;
}

export function RecoveryRenderer({ content, onRedirectQuery }: RecoveryRendererProps) {
  const hasRedirect = content.redirectLabel && content.redirectQuery;

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
      {/* Acknowledgment */}
      <p className="text-body font-[400] leading-[1.6] text-foreground">
        {content.acknowledgment}
      </p>

      {/* Alternative suggestion — inset surface */}
      {content.alternativeSuggestion && (
        <div className="mt-4 bg-slate-50 rounded-md p-4">
          <p className="text-body font-[400] leading-[1.6] text-foreground">
            {content.alternativeSuggestion}
          </p>
        </div>
      )}

      {/* Redirect button — Secondary tier */}
      {hasRedirect && (
        <div className="mt-4">
          <button
            type="button"
            onClick={() => onRedirectQuery(content.redirectQuery!)}
            className="px-4 py-2 rounded-md text-sm font-[500] bg-white text-foreground border border-slate-200 transition-colors hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-400"
          >
            {content.redirectLabel}
          </button>
        </div>
      )}
    </div>
  );
}
