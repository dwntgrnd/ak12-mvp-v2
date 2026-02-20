import type { ConfidenceLevel } from '@/services/types/discovery';

interface TransparencyNoteProps {
  note: string;
  level: ConfidenceLevel;
}

export function TransparencyNote({ note }: TransparencyNoteProps) {
  if (!note) return null;

  return (
    <p
      className="mt-1.5 text-caption font-[500] leading-[1.5] tracking-[0.025em] text-slate-400 italic"
      aria-label="Data coverage note"
    >
      ◆ {note}
    </p>
  );
}
