'use client';

import { useRouter } from 'next/navigation';
import type { DirectAnswerContent, ResponseConfidence, ProductAlignment } from '@/services/types/discovery';
import { ProductAlignmentBadge } from '@/components/discovery/product-alignment-badge';

interface DirectAnswerCardProps {
  content: DirectAnswerContent;
  confidence: ResponseConfidence;
  productRelevanceMap?: Record<string, ProductAlignment>;
}

export function DirectAnswerCard({ content, productRelevanceMap }: DirectAnswerCardProps) {
  const router = useRouter();

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

      {/* Context line — with linked district name when available */}
      <p className="mt-3 text-body font-[400] leading-[1.6] text-slate-500 text-center">
        {content.districtId && content.districtName ? (
          <>
            <a
              href={`/districts/${content.districtId}`}
              className="font-[500] text-primary hover:underline hover:decoration-primary/60 underline-offset-2 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                router.push(`/districts/${content.districtId}`);
              }}
            >
              {content.districtName}
            </a>
            {' · '}
            {content.contextLine.includes(content.districtName)
              ? content.contextLine
                  .substring(content.contextLine.indexOf(content.districtName) + content.districtName.length)
                  .replace(/^\s*·\s*/, '')
              : content.contextLine}
          </>
        ) : (
          content.contextLine
        )}
      </p>

      {/* Action link — only when district context available */}
      {content.districtId && (
        <div className="mt-4 text-center">
          <a
            href={`/districts/${content.districtId}`}
            className="text-caption font-[500] leading-[1.5] tracking-[0.025em] text-primary hover:underline hover:decoration-primary/60 underline-offset-2 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              router.push(`/districts/${content.districtId}`);
            }}
          >
            View district profile →
          </a>
        </div>
      )}

      {/* Product relevance — when lens active and district has relevance */}
      {content.districtId && productRelevanceMap?.[content.districtId] && (
        <div className="mt-3 flex items-center justify-center gap-2">
          <ProductAlignmentBadge alignment={productRelevanceMap[content.districtId]!} />
        </div>
      )}
    </div>
  );
}
