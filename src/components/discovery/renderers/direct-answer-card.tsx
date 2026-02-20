import type { DirectAnswerContent, ResponseConfidence } from '@/services/types/discovery';

interface DirectAnswerCardProps {
  content: DirectAnswerContent;
  confidence: ResponseConfidence;
}

export function DirectAnswerCard({ content }: DirectAnswerCardProps) {
  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
      {/* Emphasis surface — value + unit centered */}
      <div className="bg-[#E0F9FC] rounded-md p-5 text-center">
        <span className="text-page-title font-[700] leading-[1.2] tracking-[-0.01em] text-foreground">
          {content.value}
        </span>
        {content.valueUnit && (
          <span className="ml-1.5 text-body font-[400] leading-[1.6] text-slate-500">
            {content.valueUnit}
          </span>
        )}
      </div>

      {/* Context line */}
      <p className="mt-3 text-body font-[400] leading-[1.6] text-slate-500 text-center">
        {content.contextLine}
      </p>
    </div>
  );
}
