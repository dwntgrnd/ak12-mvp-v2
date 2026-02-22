import { Badge } from '@/components/ui/badge';
import type { ProductAlignment } from '@/services/types/discovery';

const ALIGNMENT_STYLES: Record<ProductAlignment['level'], { bg: string; text: string; label: string }> = {
  strong:   { bg: 'bg-success/10',  text: 'text-success',       label: 'Strong alignment' },
  moderate: { bg: 'bg-warning/10',  text: 'text-warning',       label: 'Moderate alignment' },
  limited:  { bg: 'bg-slate-100',   text: 'text-slate-600',     label: 'Limited alignment' },
};

interface ProductAlignmentBadgeProps {
  alignment: ProductAlignment;
}

export function ProductAlignmentBadge({ alignment }: ProductAlignmentBadgeProps) {
  const style = ALIGNMENT_STYLES[alignment.level];

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className={`${style.bg} ${style.text} border-0 text-xs font-medium`}
      >
        {style.label}
      </Badge>
      {alignment.primaryConnection && (
        <span className="text-xs font-medium tracking-[0.025em] text-muted-foreground truncate max-w-[200px]">
          {alignment.primaryConnection}
        </span>
      )}
    </div>
  );
}
