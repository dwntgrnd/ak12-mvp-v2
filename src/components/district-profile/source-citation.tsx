import type { IntelligenceSource } from '@/services/types/district-intelligence';

interface SourceCitationProps {
  sources?: IntelligenceSource[];
}

export function SourceCitation({ sources }: SourceCitationProps) {
  if (!sources || sources.length === 0) return null;

  return (
    <p className="mt-6 pt-3 border-t border-border text-xs font-medium text-muted-foreground">
      Sources:{' '}
      {sources.map((src, i) => (
        <span key={src.sourceId}>
          {i > 0 && ', '}
          {src.url ? (
            <a
              href={src.url}
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-muted-foreground/30 underline-offset-2 hover:decoration-foreground hover:text-foreground"
            >
              {src.name}
            </a>
          ) : (
            src.name
          )}
          {src.academicYear && ` (${src.academicYear})`}
        </span>
      ))}
    </p>
  );
}
