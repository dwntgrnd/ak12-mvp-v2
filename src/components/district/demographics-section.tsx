interface DemographicsSectionProps {
  demographics: Record<string, number>;
}

export function DemographicsSection({ demographics }: DemographicsSectionProps) {
  const entries = Object.entries(demographics).sort((a, b) => b[1] - a[1]);

  if (entries.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-semibold font-heading mb-4">Demographics</h2>
        <p className="text-sm text-muted-foreground">
          No demographics data available
        </p>
      </div>
    );
  }

  const maxValue = Math.max(...entries.map(([, value]) => value));

  return (
    <div>
      <h2 className="text-lg font-semibold font-heading mb-4">Demographics</h2>
      <div className="space-y-4">
        {entries.map(([label, value]) => (
          <div key={label} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground">{label}</span>
              <span className="text-foreground font-medium">{value}%</span>
            </div>
            <div className="relative w-full bg-muted rounded-full h-2.5">
              <div
                className="bg-primary rounded-full h-2.5"
                style={{ width: `${(value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
