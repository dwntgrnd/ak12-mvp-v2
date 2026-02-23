import type { FollowUpChip } from '@/services/types/discovery';

interface FollowUpChipsProps {
  chips: FollowUpChip[];
  onChipClick: (query: string) => void;
}

export function FollowUpChips({ chips, onChipClick }: FollowUpChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div>
      <p className="text-sm font-semibold leading-[1.5] text-foreground mb-3">
        Explore further
      </p>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip.chipId}
            type="button"
            onClick={() => onChipClick(chip.query)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-brand-orange/10 text-brand-orange border border-brand-orange/25 hover:bg-brand-orange/20 hover:border-brand-orange/35 transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
