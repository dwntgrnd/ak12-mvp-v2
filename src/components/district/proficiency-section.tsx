interface ProficiencySectionProps {
  proficiency: Record<string, number>;
}

export function ProficiencySection({ proficiency }: ProficiencySectionProps) {
  const entries = Object.entries(proficiency);

  if (entries.length === 0) {
    return (
      <div>
        <h2 className="text-lg font-semibold font-heading mb-4">
          Academic Proficiency
        </h2>
        <p className="text-sm text-muted-foreground">
          No proficiency data available
        </p>
      </div>
    );
  }

  const getBarColor = (value: number): string => {
    if (value >= 50) return 'bg-green-500';
    if (value >= 35) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div>
      <h2 className="text-lg font-semibold font-heading mb-4">
        Academic Proficiency
      </h2>
      <div className="space-y-4">
        {entries.map(([subject, value]) => (
          <div key={subject} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-foreground">{subject}</span>
              <span className="text-foreground font-medium">
                {value}% Proficient
              </span>
            </div>
            <div className="relative w-full bg-muted rounded-full h-2.5">
              <div
                className={`${getBarColor(value)} rounded-full h-2.5`}
                style={{ width: `${value}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
