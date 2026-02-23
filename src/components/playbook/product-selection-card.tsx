'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatGradeRange } from '@/lib/utils/format';

export interface ProductSelectionCardProps {
  product: {
    productId: string;
    name: string;
    subjectArea: string;
    gradeRange: { gradeFrom: number; gradeTo: number };
  };
  selected: boolean;
  onToggle: (productId: string) => void;
}

export function ProductSelectionCard({
  product,
  selected,
  onToggle,
}: ProductSelectionCardProps) {
  const gradeLabel = formatGradeRange(
    product.gradeRange.gradeFrom,
    product.gradeRange.gradeTo
  );

  return (
    <div
      role="checkbox"
      aria-checked={selected}
      aria-label={`${product.name}, ${product.subjectArea}, grades ${gradeLabel}`}
      tabIndex={0}
      onClick={() => onToggle(product.productId)}
      onKeyDown={(e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          onToggle(product.productId);
        }
      }}
      className={cn(
        'flex items-center gap-3 px-4 py-4 rounded-lg border cursor-pointer transition-colors',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
        'hover:bg-muted/50',
        selected
          ? 'border-border-default bg-brand-orange/5'
          : 'border-border-default bg-surface-raised'
      )}
    >
      <Checkbox
        checked={selected}
        tabIndex={-1}
        aria-hidden
        className="pointer-events-none shrink-0"
      />
      <span className="font-semibold text-foreground flex-grow min-w-0 break-words text-sm">
        {product.name}
      </span>
      <Badge variant="secondary" className="shrink-0">
        {product.subjectArea}
      </Badge>
      <span className="text-sm text-foreground-secondary shrink-0 whitespace-nowrap">
        {gradeLabel}
      </span>
    </div>
  );
}
