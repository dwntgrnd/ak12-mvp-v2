import type { DiscoverySource } from '@/services/types/discovery';

interface SourceCitationsProps {
  sources: DiscoverySource[];
}

export function SourceCitations({ sources }: SourceCitationsProps) {
  if (sources.length === 0) return null;

  return (
    <div className="border-t border-border pt-3">
      <p className="text-caption font-medium leading-[1.5] tracking-[0.025em] text-foreground-secondary">
        Sources:{' '}
        {sources.map((source, i) => {
          const label = source.academicYear
            ? `${source.label} (${source.academicYear})`
            : source.label;

          return (
            <span key={source.sourceId}>
              {i > 0 && ', '}
              {source.url ? (
                <a
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-foreground-secondary/30 underline-offset-2 hover:decoration-foreground-secondary transition-[text-decoration-color] duration-150"
                >
                  {label}
                </a>
              ) : (
                <span>{label}</span>
              )}
            </span>
          );
        })}
      </p>
    </div>
  );
}
