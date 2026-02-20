import type { FollowUpChip } from '@/services/types/discovery';

interface FollowUpChipsProps {
  chips: FollowUpChip[];
  onChipClick: (query: string) => void;
}

export function FollowUpChips({ chips, onChipClick }: FollowUpChipsProps) {
  if (chips.length === 0) return null;

  return (
    <div>
      <p className="text-caption font-[500] leading-[1.5] tracking-[0.025em] text-slate-400 mb-2">
        Explore further
      </p>
      <div className="flex flex-wrap gap-2">
        {chips.map((chip) => (
          <button
            key={chip.chipId}
            type="button"
            onClick={() => onChipClick(chip.query)}
            className="px-3 py-1.5 rounded-full text-xs font-medium bg-slate-100 text-slate-600 border border-slate-200 hover:bg-slate-200 hover:text-foreground transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
