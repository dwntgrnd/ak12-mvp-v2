interface DataFieldProps {
  label: string;
  value: string | number;
  format?: 'number' | 'currency' | 'percent' | 'text';
}

export function DataField({ label, value, format = 'text' }: DataFieldProps) {
  const formatValue = (val: string | number, fmt: string): string => {
    if (typeof val === 'number') {
      switch (fmt) {
        case 'number':
          return val.toLocaleString();
        case 'currency':
          return val.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
            maximumFractionDigits: 0
          });
        case 'percent':
          return `${val}%`;
        default:
          return String(val);
      }
    }
    return String(val);
  };

  return (
    <div className="flex flex-col gap-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-base font-medium text-foreground">
        {formatValue(value, format)}
      </span>
    </div>
  );
}
