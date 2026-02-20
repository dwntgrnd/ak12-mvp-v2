import { Badge } from '@/components/ui/badge';
import type { ProductRelevance } from '@/services/types/discovery';

const ALIGNMENT_STYLES: Record<ProductRelevance['alignmentLevel'], { bg: string; text: string; label: string }> = {
  strong:   { bg: 'bg-green-50',  text: 'text-green-700',  label: 'Strong alignment' },
  moderate: { bg: 'bg-amber-50',  text: 'text-amber-700',  label: 'Moderate alignment' },
  limited:  { bg: 'bg-slate-100', text: 'text-slate-600',  label: 'Limited alignment' },
  unknown:  { bg: 'bg-slate-50',  text: 'text-slate-400',  label: 'Insufficient data' },
};

interface ProductRelevanceBadgeProps {
  relevance: ProductRelevance;
}

export function ProductRelevanceBadge({ relevance }: ProductRelevanceBadgeProps) {
  const style = ALIGNMENT_STYLES[relevance.alignmentLevel];

  return (
    <div className="flex items-center gap-2">
      <Badge
        variant="outline"
        className={`${style.bg} ${style.text} border-0 text-xs font-medium`}
      >
        {style.label}
      </Badge>
      {relevance.signals[0] && (
        <span className="text-caption font-[500] leading-[1.5] tracking-[0.025em] text-muted-foreground truncate">
          {relevance.signals[0]}
        </span>
      )}
    </div>
  );
}
