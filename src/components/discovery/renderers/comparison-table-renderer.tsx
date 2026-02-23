'use client';

import { useRouter } from 'next/navigation';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { TransparencyNote } from './transparency-note';
import { ProductAlignmentBadge } from '@/components/discovery/product-alignment-badge';
import { cn } from '@/lib/utils';
import type { ComparisonContent, ResponseConfidence, ComparisonCell, ProductAlignment } from '@/services/types/discovery';

interface ComparisonTableRendererProps {
  content: ComparisonContent;
  confidence: ResponseConfidence;
  productRelevanceMap?: Record<string, ProductAlignment>;
}

function getCell(
  cells: ComparisonCell[],
  dimensionId: string,
  entityId: string
): ComparisonCell | undefined {
  return cells.find((c) => c.dimensionId === dimensionId && c.entityId === entityId);
}

export function ComparisonTableRenderer({
  content,
  confidence,
  productRelevanceMap,
}: ComparisonTableRendererProps) {
  const router = useRouter();
  const { title, contextBanner, entities, dimensions, cells, synthesis } = content;

  const hasAnyRelevance =
    productRelevanceMap && entities.some((e) => e.districtId && productRelevanceMap[e.districtId]);

  return (
    <div className="bg-surface-raised border border-border rounded-lg shadow-sm p-5">

      {/* ── Header ── */}
      <h2 className="text-section-heading font-semibold leading-[1.4] tracking-[-0.01em] text-foreground">
        {title}
      </h2>

      {/* Context banner */}
      {contextBanner && (
        <div className="bg-surface-emphasis rounded-md p-3 mt-4">
          <p className="text-body font-normal leading-[1.6] text-foreground">{contextBanner}</p>
        </div>
      )}

      {/* ── Desktop table (md+) ── */}
      <div className="hidden md:block mt-6 overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b-2 border-border-default">
              {/* Empty corner cell — dimension label column */}
              <th className="w-[176px] pb-3 text-left" />

              {entities.map((entity, entityIdx) => {
                const headerNote = confidence.sections[entity.entityId];
                return (
                  <th
                    key={entity.entityId}
                    scope="col"
                    className={cn(
                      'pb-3 text-left pl-6',
                      entityIdx > 0 && 'border-l border-border-subtle'
                    )}
                  >
                    <div className="space-y-1">
                      {entity.districtId ? (
                        <a
                          href={`/districts/${entity.districtId}`}
                          className="text-body font-semibold leading-[1.4] text-district-link underline decoration-district-link/30 underline-offset-2 hover:decoration-district-link transition-colors"
                          onClick={(e) => {
                            e.preventDefault();
                            router.push(`/districts/${entity.districtId}`);
                          }}
                        >
                          {entity.name}
                        </a>
                      ) : (
                        <span className="text-body font-semibold leading-[1.4] text-foreground">
                          {entity.name}
                        </span>
                      )}
                      {entity.overallConfidence >= 3 && headerNote?.transparencyNote && (
                        <TransparencyNote
                          note={headerNote.transparencyNote}
                          level={entity.overallConfidence}
                        />
                      )}
                    </div>
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody>
            {dimensions.map((dim, dimIdx) => (
              <tr
                key={dim.dimensionId}
                className={cn(
                  'group hover:bg-surface-inset transition-colors',
                  dimIdx < dimensions.length - 1 && 'border-b border-border-subtle'
                )}
              >
                {/* Dimension label — overline tier */}
                <th
                  scope="row"
                  className="py-3.5 pr-4 text-left align-top"
                >
                  <span className="text-overline font-medium leading-[1.4] tracking-[0.05em] uppercase text-foreground-tertiary">
                    {dim.label}
                  </span>
                </th>

                {/* Entity value cells */}
                {entities.map((entity, entityIdx) => {
                  const cell = getCell(cells, dim.dimensionId, entity.entityId);
                  const note = cell?.confidence.transparencyNote;

                  return (
                    <td
                      key={entity.entityId}
                      className={cn(
                        'py-3.5 pl-6 text-body font-normal leading-[1.6] text-foreground align-top',
                        entityIdx > 0 && 'border-l border-border-subtle'
                      )}
                    >
                      {cell ? (
                        <>
                          {cell.value}
                          {note && (
                            <Popover>
                              <PopoverTrigger asChild>
                                <button
                                  type="button"
                                  className="text-overline text-foreground-tertiary ml-1 cursor-help inline hover:text-foreground-secondary transition-colors"
                                  aria-label={`Data coverage note for ${dim.label} — ${entity.name}`}
                                >
                                  ◆
                                </button>
                              </PopoverTrigger>
                              <PopoverContent className="max-w-[280px] p-3" align="start">
                                <p className="text-caption font-medium leading-[1.5] tracking-[0.025em] text-foreground-secondary">
                                  {note}
                                </p>
                              </PopoverContent>
                            </Popover>
                          )}
                        </>
                      ) : (
                        <span className="text-foreground-tertiary">—</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}

            {/* Product Alignment row — separated by a heavier rule */}
            {hasAnyRelevance && (
              <tr className="group hover:bg-surface-inset transition-colors border-t-2 border-border-default">
                <th
                  scope="row"
                  className="py-3.5 pr-4 text-left align-top"
                >
                  <span className="text-overline font-medium leading-[1.4] tracking-[0.05em] uppercase text-foreground-tertiary">
                    Product Alignment
                  </span>
                </th>
                {entities.map((entity, entityIdx) => {
                  const relevance = entity.districtId
                    ? productRelevanceMap![entity.districtId]
                    : undefined;
                  return (
                    <td
                      key={entity.entityId}
                      className={cn(
                        'py-3.5 pl-6 align-top',
                        entityIdx > 0 && 'border-l border-border-subtle'
                      )}
                    >
                      {relevance ? (
                        <ProductAlignmentBadge alignment={relevance} />
                      ) : (
                        <span className="text-foreground-tertiary">—</span>
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
      <div className="block md:hidden mt-6 flex flex-col gap-3" role="list">
        {entities.map((entity) => {
          const entityNote = confidence.sections[entity.entityId];
          const relevance = entity.districtId
            ? productRelevanceMap?.[entity.districtId]
            : undefined;
          return (
            <div
              key={entity.entityId}
              className="bg-surface-inset rounded-md p-4"
              role="listitem"
              aria-label={entity.name}
            >
              {/* Entity name */}
              {entity.districtId ? (
                <a
                  href={`/districts/${entity.districtId}`}
                  className="text-body font-semibold leading-[1.4] text-district-link underline decoration-district-link/30 underline-offset-2 hover:decoration-district-link transition-colors block"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push(`/districts/${entity.districtId}`);
                  }}
                >
                  {entity.name}
                </a>
              ) : (
                <p className="text-body font-semibold leading-[1.4] text-foreground">{entity.name}</p>
              )}

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
                      <p className="text-overline font-medium leading-[1.4] tracking-[0.05em] uppercase text-foreground-tertiary">
                        {dim.label}
                      </p>
                      <p className="mt-0.5 text-body font-normal leading-[1.6] text-foreground">
                        {cell?.value ?? '—'}
                      </p>
                      {note && cell && (
                        <TransparencyNote note={note} level={cell.confidence.level} />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Product relevance */}
              {relevance && (
                <div className="mt-3 pt-3 border-t border-border-default">
                  <p className="text-overline font-medium leading-[1.4] tracking-[0.05em] uppercase text-foreground-tertiary mb-1.5">
                    Product Alignment
                  </p>
                  <ProductAlignmentBadge alignment={relevance} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Synthesis ── */}
      {synthesis && (
        <div className="mt-6 bg-surface-emphasis rounded-md p-4">
          <p className="text-overline font-medium leading-[1.4] tracking-[0.05em] uppercase text-foreground-tertiary mb-2">
            Synthesis
          </p>
          <p className="text-body font-normal leading-[1.6] text-foreground">{synthesis}</p>
        </div>
      )}
    </div>
  );
}
