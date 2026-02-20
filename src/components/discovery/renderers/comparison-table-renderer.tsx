'use client';

import { useRouter } from 'next/navigation';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { TransparencyNote } from './transparency-note';
import { ProductRelevanceBadge } from '@/components/discovery/product-relevance-badge';
import type { ComparisonContent, ResponseConfidence, ComparisonCell, ProductRelevance } from '@/services/types/discovery';

interface ComparisonTableRendererProps {
  content: ComparisonContent;
  confidence: ResponseConfidence;
  productRelevanceMap?: Record<string, ProductRelevance>;
}

function getCell(
  cells: ComparisonCell[],
  dimensionId: string,
  entityId: string
): ComparisonCell | undefined {
  return cells.find((c) => c.dimensionId === dimensionId && c.entityId === entityId);
}

export function ComparisonTableRenderer({ content, confidence, productRelevanceMap }: ComparisonTableRendererProps) {
  const router = useRouter();
  const { title, contextBanner, entities, dimensions, cells, synthesis } = content;

  const hasAnyRelevance = productRelevanceMap &&
    entities.some((e) => e.districtId && productRelevanceMap[e.districtId]);

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
      {/* Title */}
      <h2 className="text-section-heading font-[600] leading-[1.4] text-foreground">{title}</h2>

      {/* Context banner (optional) */}
      {contextBanner && (
        <div className="bg-[#E0F9FC] rounded-md p-3 mt-4">
          <p className="text-body font-[400] leading-[1.6] text-foreground">{contextBanner}</p>
        </div>
      )}

      {/* ── Desktop table (md+) ── */}
      <div className="hidden md:block mt-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {/* Empty first cell — dimension label column header */}
              <th className="w-[180px] pb-3 text-left" />

              {entities.map((entity) => {
                const headerNote = confidence.sections[entity.entityId];
                return (
                  <th
                    key={entity.entityId}
                    scope="col"
                    className="pb-3 text-left pl-4"
                  >
                    {entity.districtId ? (
                      <a
                        href={`/districts/${entity.districtId}`}
                        className="text-body font-[600] leading-[1.4] text-primary hover:underline hover:decoration-primary/60 underline-offset-2 transition-colors"
                        onClick={(e) => {
                          e.preventDefault();
                          router.push(`/districts/${entity.districtId}`);
                        }}
                      >
                        {entity.name}
                      </a>
                    ) : (
                      <span className="text-body font-[600] leading-[1.4] text-foreground">
                        {entity.name}
                      </span>
                    )}
                    {entity.overallConfidence >= 3 && headerNote?.transparencyNote && (
                      <TransparencyNote
                        note={headerNote.transparencyNote}
                        level={entity.overallConfidence}
                      />
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {dimensions.map((dim, dimIdx) => (
              <tr
                key={dim.dimensionId}
                className={dimIdx < dimensions.length - 1 ? 'border-b border-slate-100' : ''}
              >
                {/* Dimension label */}
                <th
                  scope="row"
                  className="py-3 pr-4 text-left text-caption font-[500] leading-[1.5] tracking-[0.025em] text-muted-foreground align-top"
                >
                  {dim.label}
                </th>

                {/* Entity value cells */}
                {entities.map((entity) => {
                  const cell = getCell(cells, dim.dimensionId, entity.entityId);
                  const note = cell?.confidence.transparencyNote;

                  return (
                    <td
                      key={entity.entityId}
                      className="py-3 pl-4 text-body font-[400] leading-[1.6] text-foreground align-top"
                    >
                      {cell ? (
                        <>
                          {cell.value}
                          {note && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
                                  className="text-overline text-slate-400 ml-1 cursor-help inline"
                                  aria-label={`Data coverage note for ${dim.label} — ${entity.name}`}
                                >
                                  ◆
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="max-w-[280px] p-3" align="start">
                                <p className="text-caption font-[500] leading-[1.5] tracking-[0.025em] text-muted-foreground">
                                  {note}
                                </p>
                              </PopoverContent>
                            </Popover>
                          )}
                        </>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Product Alignment row — conditional */}
            {hasAnyRelevance && (
              <tr className="border-t border-slate-200">
                <th
                  scope="row"
                  className="py-3 pr-4 text-left text-caption font-[500] leading-[1.5] tracking-[0.025em] text-muted-foreground align-top"
                >
                  Product Alignment
                </th>
                {entities.map((entity) => {
                  const relevance = entity.districtId ? productRelevanceMap![entity.districtId] : undefined;
                  return (
                    <td key={entity.entityId} className="py-3 pl-4 align-top">
                      {relevance ? (
                        <ProductRelevanceBadge relevance={relevance} />
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile stacked cards (below md) ── */}
      <div
        className="block md:hidden mt-6 flex flex-col gap-3"
        role="list"
      >
        {entities.map((entity) => {
          const entityNote = confidence.sections[entity.entityId];
          const relevance = entity.districtId ? productRelevanceMap?.[entity.districtId] : undefined;
          return (
            <div
              key={entity.entityId}
              className="bg-slate-50 rounded-md p-4"
              role="listitem"
              aria-label={entity.name}
            >
              {/* Entity name */}
              {entity.districtId ? (
                <a
                  href={`/districts/${entity.districtId}`}
                  className="text-body font-[600] leading-[1.4] text-primary hover:underline hover:decoration-primary/60 underline-offset-2 transition-colors block"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/districts/${entity.districtId}`);
                  }}
                >
                  {entity.name}
                </a>
              ) : (
                <p className="text-body font-[600] leading-[1.4] text-foreground">
                  {entity.name}
                </p>
              )}

              {/* Overall confidence note if level >= 3 */}
              {entity.overallConfidence >= 3 && entityNote?.transparencyNote && (
                <TransparencyNote
                  note={entityNote.transparencyNote}
                  level={entity.overallConfidence}
                />
              )}

              {/* Dimensions */}
              <div className="mt-3 space-y-3">
                {dimensions.map((dim) => {
                  const cell = getCell(cells, dim.dimensionId, entity.entityId);
                  const note = cell?.confidence.transparencyNote;

                  return (
                    <div key={dim.dimensionId}>
                      <p className="text-overline font-[500] leading-[1.4] tracking-[0.05em] uppercase text-slate-400">
                        {dim.label}
                      </p>
                      <p className="text-body font-[400] leading-[1.6] text-foreground">
                        {cell?.value ?? '—'}
                      </p>
                      {note && cell && (
                        <TransparencyNote note={note} level={cell.confidence.level} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Product relevance — conditional */}
              {relevance && (
                <div className="mt-3 pt-3 border-t border-slate-100">
                  <p className="text-overline font-[500] leading-[1.4] tracking-[0.05em] uppercase text-slate-400">
                    Product Alignment
                  </p>
                  <div className="mt-1">
                    <ProductRelevanceBadge relevance={relevance} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Synthesis ── */}
      {synthesis && (
        <div className="mt-6 bg-slate-50 rounded-md p-4">
          <p className="text-overline font-[500] leading-[1.4] tracking-[0.05em] uppercase text-slate-400 mb-2">
            SYNTHESIS
          </p>
          <p className="text-body font-[400] leading-[1.6] text-foreground">{synthesis}</p>
        </div>
      )}
    </div>
  );
}
