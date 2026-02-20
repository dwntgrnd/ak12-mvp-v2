'use client';

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import type { BriefContent, ResponseConfidence } from '@/services/types/discovery';
import { TransparencyNote } from './transparency-note';
import { DiscoveryResultCard } from '@/components/discovery/discovery-result-card';

interface BriefRendererProps {
  content: BriefContent;
  confidence: ResponseConfidence;
  format: 'narrative_brief' | 'intelligence_brief';
}

export function BriefRenderer({ content, confidence, format }: BriefRendererProps) {
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
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm p-5">
      {/* Intelligence brief label */}
      {format === 'intelligence_brief' && (
        <p className="text-overline font-[500] leading-[1.4] tracking-[0.05em] uppercase text-slate-400 mb-3">
          READINESS ASSESSMENT
        </p>
      )}

      {/* Lead insight — emphasis surface, no left border */}
      <div className="bg-[#E0F9FC] rounded-md p-4">
        <p className="text-body font-[400] leading-[1.6] text-foreground">
          {content.leadInsight}
        </p>
      </div>

      {/* Key signals — 2-col grid */}
      {content.keySignals.length > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
          {content.keySignals.map((signal, i) => {
            // District-linked signal → render as navigable card
            if (signal.districtId) {
              return (
                <DiscoveryResultCard
                  key={signal.districtId}
                  districtId={signal.districtId}
                  name={signal.label}
                  location={signal.location}
                  enrollment={signal.enrollment}
                  variant="inset"
                >
                  {/* Content slot: activity signal + detail */}
                  <p className="mt-1 text-body font-[600] leading-[1.6] text-foreground">
                    {signal.value}
                  </p>
                  {signal.detail && (
                    <p className="mt-0.5 text-caption font-[500] leading-[1.5] text-slate-500">
                      {signal.detail}
                    </p>
                  )}
                </DiscoveryResultCard>
              );
            }

            // Plain metric tile (no district context)
            return (
              <div key={i}>
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
      )}

      {/* Collapsible sections */}
      {content.sections.length > 0 && (
        <div className="mt-6 space-y-3">
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
                  className="flex items-center gap-2 w-full text-left py-1.5 px-2 -mx-2 rounded-md hover:bg-slate-50 hover:text-cyan-600 transition-colors duration-150 group"
                >
                  <ChevronRight
                    size={18}
                    className={`shrink-0 transition-transform duration-200 ease-out group-hover:text-cyan-600 ${
                      isOpen ? 'rotate-90' : 'rotate-0'
                    }`}
                  />
                  <span className="text-subsection-heading font-[600] leading-[1.4] text-foreground group-hover:text-cyan-600 transition-colors duration-150">
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
                        <p className="text-body font-[400] leading-[1.6] text-foreground">
                          {section.body}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
