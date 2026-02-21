'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, ArrowRight, ExternalLink } from 'lucide-react';
import type { BriefContent, ResponseConfidence, ProductRelevance } from '@/services/types/discovery';
import { TransparencyNote } from './transparency-note';
import { DistrictListCard } from '@/components/shared/district-list-card';

interface BriefRendererProps {
  content: BriefContent;
  confidence: ResponseConfidence;
  format: 'narrative_brief' | 'intelligence_brief';
  productRelevanceMap?: Record<string, ProductRelevance>;
  savedDistricts?: Set<string>;
  onSaveDistrict?: (districtId: string) => void;
  onRemoveSaved?: (districtId: string) => void;
  onGeneratePlaybook?: (districtId: string) => void;
}

export function BriefRenderer({ content, confidence, format, productRelevanceMap, savedDistricts, onSaveDistrict, onRemoveSaved, onGeneratePlaybook }: BriefRendererProps) {
  const router = useRouter();
  const [openSections, setOpenSections] = useState<Set<string>>(
    new Set(content.sections.length > 0 ? [content.sections[0].sectionId] : [])
  );

  function toggleSection(sectionId: string) {
    setOpenSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) {
        next.delete(sectionId);
      } else {
        next.add(sectionId);
      }
      return next;
    });
  }

  return (
    <div className="bg-white border border-border rounded-lg shadow-sm p-6">
      {/* Format label — overline identity for both formats */}
      <p className="text-overline font-[500] leading-[1.4] tracking-[0.05em] uppercase text-slate-400 mb-3">
        {format === 'intelligence_brief' ? 'READINESS ASSESSMENT' : 'MARKET INTELLIGENCE'}
      </p>

      {/* Subject district name — linked, single-entity briefs only */}
      {content.subjectDistrictId && content.subjectDistrictName && (
        <div className="mb-3 flex items-center gap-3">
          <a
            href={`/districts/${content.subjectDistrictId}`}
            className="text-section-heading font-[600] leading-[1.3] tracking-[-0.01em] text-district-link hover:underline hover:decoration-district-link/60 underline-offset-2 transition-colors"
            onClick={(e) => {
              e.preventDefault();
              router.push(`/districts/${content.subjectDistrictId}`);
            }}
          >
            {content.subjectDistrictName}
          </a>
          <button
            type="button"
            onClick={() => router.push(`/districts/${content.subjectDistrictId}`)}
            className="inline-flex items-center gap-1 px-2.5 py-1 border border-primary/30 rounded-md text-xs font-medium text-primary hover:border-primary/60 transition-colors duration-150"
          >
            Open profile
            <ExternalLink size={11} />
          </button>
        </div>
      )}

      {/* Lead insight — headline treatment, emphasis surface */}
      <div className="bg-emphasis-surface rounded-md p-5">
        <p className="text-lg font-[700] leading-[1.5] tracking-[-0.01em] text-foreground">
          {content.leadInsight}
        </p>
      </div>

      {/* Key signals — 2-col grid */}
      {content.keySignals.length > 0 && (
        <div className="border-t border-border mt-6 pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
            {content.keySignals.map((signal, i) => {
              // District-linked signal → render as navigable card
              if (signal.districtId) {
                return (
                  <DistrictListCard
                    key={signal.districtId}
                    districtId={signal.districtId}
                    name={signal.label}
                    location={signal.location}
                    enrollment={signal.enrollment}
                    variant="inset"
                    metrics={[{ label: signal.detail || '', value: signal.value }]}
                    productRelevance={productRelevanceMap?.[signal.districtId]}
                    isSaved={savedDistricts?.has(signal.districtId!)}
                    onSave={onSaveDistrict}
                    onRemoveSaved={onRemoveSaved}
                    onGeneratePlaybook={onGeneratePlaybook}
                  />
                );
              }

              // Plain metric tile — inset surface treatment
              return (
                <div key={i} className="bg-slate-50 rounded-md p-3">
                  <p className="text-overline font-[500] leading-[1.4] tracking-[0.05em] uppercase text-slate-400">
                    {signal.label}
                  </p>
                  <p className="mt-1 text-body font-[600] leading-[1.6] text-foreground">
                    {signal.value}
                  </p>
                  {signal.detail && (
                    <p className="mt-0.5 text-caption font-[500] leading-[1.5] text-slate-500">
                      {signal.detail}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Collapsible sections */}
      {content.sections.length > 0 && (
        <div className="border-t border-border mt-6 pt-6 space-y-3">
          {content.sections.map((section) => {
            const isOpen = openSections.has(section.sectionId);
            // Prefer transparency note from section data; fall back to response.confidence.sections
            const transparencyNote =
              section.confidence.transparencyNote ??
              confidence.sections[section.sectionId]?.transparencyNote;
            // Empty section: body is empty AND confidence level is 4 or 5
            const isEmptySection = section.body === '' && section.confidence.level >= 4;
            const contentId = `section-content-${section.sectionId}`;

            return (
              <div key={section.sectionId}>
                {/* Full-row collapsible trigger */}
                <button
                  type="button"
                  onClick={() => toggleSection(section.sectionId)}
                  aria-expanded={isOpen}
                  aria-controls={contentId}
                  className="flex items-center gap-2 w-full text-left py-1.5 px-2 -mx-2 rounded-md hover:bg-slate-50 hover:text-primary transition-colors duration-150 group"
                >
                  <ChevronRight
                    size={18}
                    className={`shrink-0 transition-transform duration-200 ease-out group-hover:text-primary ${
                      isOpen ? 'rotate-90' : 'rotate-0'
                    }`}
                  />
                  <span className="text-subsection-heading font-[600] leading-[1.4] text-foreground group-hover:text-primary transition-colors duration-150">
                    {section.heading}
                  </span>
                </button>

                {/* Transparency note below trigger — shown for standard sections with notes */}
                {transparencyNote && !isEmptySection && (
                  <TransparencyNote
                    note={transparencyNote}
                    level={section.confidence.level}
                  />
                )}

                {/* Expanded content — grid-rows animation trick */}
                <div
                  id={contentId}
                  role="region"
                  className={`grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out ${
                    isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                  }`}
                >
                  <div className="overflow-hidden">
                    <div className="bg-slate-50 rounded-md p-4 mt-3">
                      {isEmptySection && transparencyNote ? (
                        // Empty body with coverage gap — show only transparency note inside inset
                        <TransparencyNote
                          note={transparencyNote}
                          level={section.confidence.level}
                        />
                      ) : (
                        <>
                          <p className="text-body font-[400] leading-[1.6] text-foreground">
                            {section.body}
                          </p>
                          {/* District profile nudge — single-entity briefs only */}
                          {content.subjectDistrictId && (
                            <div className="mt-3 pt-3 border-t border-border/60">
                              <button
                                type="button"
                                onClick={() => router.push(`/districts/${content.subjectDistrictId}`)}
                                className="inline-flex items-center gap-1 text-sm font-medium text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary transition-colors duration-150"
                              >
                                View full details in {content.subjectDistrictName ?? 'district'} profile
                                <ArrowRight size={13} />
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Primary CTA — single-entity briefs: full district profile button */}
      {content.subjectDistrictId && (
        <div className="mt-6 pt-6 border-t border-border">
          <button
            type="button"
            onClick={() => router.push(`/districts/${content.subjectDistrictId}`)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white text-primary border border-primary/30 font-medium text-sm rounded-md hover:border-primary/60 hover:shadow-sm transition-all duration-150"
          >
            Open full profile — {content.subjectDistrictName}
            <ArrowRight size={14} />
          </button>
        </div>
      )}

      {/* District profile strip — multi-district briefs: chips for each linked district */}
      {!content.subjectDistrictId && (() => {
        const linkedDistricts = content.keySignals.filter((s) => s.districtId);
        if (linkedDistricts.length === 0) return null;
        return (
          <div className="border-t border-border mt-6 pt-5">
            <p className="text-overline font-[500] leading-[1.4] tracking-[0.05em] uppercase text-slate-400 mb-3">
              Explore District Profiles
            </p>
            <div className="flex flex-wrap gap-2">
              {linkedDistricts.map((s) => (
                <button
                  key={s.districtId}
                  type="button"
                  onClick={() => router.push(`/districts/${s.districtId}`)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-primary/30 rounded-md text-sm font-medium text-primary hover:border-primary/60 hover:shadow-sm transition-all duration-150"
                >
                  {s.label}
                  <ArrowRight size={13} />
                </button>
              ))}
            </div>
          </div>
        );
      })()}
    </div>
  );
}
