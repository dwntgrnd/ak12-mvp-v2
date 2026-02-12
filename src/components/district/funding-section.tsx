import { DataField } from './data-field';

interface FundingSectionProps {
  funding: Record<string, number>;
}

export function FundingSection({ funding }: FundingSectionProps) {
  const entries = Object.entries(funding);

  if (entries.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-semibold font-heading mb-4">Funding</h2>
        <p className="text-sm text-muted-foreground">
          No funding data available
        </p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-lg font-semibold font-heading mb-4">Funding</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {entries.map(([key, value]) => (
          <DataField key={key} label={key} value={value} format="currency" />
        ))}
      </div>
    </div>
  );
}
