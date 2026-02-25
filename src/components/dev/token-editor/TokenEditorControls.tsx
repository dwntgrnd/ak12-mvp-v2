'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getTokensByGroup, type TokenDefinition } from './token-registry';
import { HslColorControl } from './HslColorControl';
import { LengthControl } from './LengthControl';
import { ShadowControl } from './ShadowControl';
import { ModularScaleControl, type ScaleMetadata } from './ModularScaleControl';

interface TokenEditorControlsProps {
  getCurrentValue: (cssVar: string) => string;
  isModified: (cssVar: string) => boolean;
  updateToken: (cssVar: string, value: string) => void;
  resetToken: (cssVar: string) => void;
  getGroupChangeCount: (tokens: TokenDefinition[]) => number;
  setScaleMetadata: (meta: ScaleMetadata) => void;
}

export function TokenEditorControls({
  getCurrentValue,
  isModified,
  updateToken,
  resetToken,
  getGroupChangeCount,
  setScaleMetadata,
}: TokenEditorControlsProps) {
  const groups = getTokensByGroup();

  return (
    <Accordion type="single" collapsible className="te-accordion">
      {Array.from(groups.entries()).map(([groupName, tokens]) => {
        const changeCount = getGroupChangeCount(tokens);

        if (groupName === 'Modular Type Scale') {
          return (
            <AccordionItem key={groupName} value={groupName} className="te-accordion-item">
              <AccordionTrigger className="te-accordion-trigger">
                <span>
                  Modular Type Scale
                  {changeCount > 0 && (
                    <span className="te-change-badge">{changeCount}</span>
                  )}
                </span>
              </AccordionTrigger>
              <AccordionContent className="te-accordion-content">
                <ModularScaleControl
                  getCurrentValue={getCurrentValue}
                  isModified={isModified}
                  updateToken={updateToken}
                  resetToken={resetToken}
                  setScaleMetadata={setScaleMetadata}
                />
              </AccordionContent>
            </AccordionItem>
          );
        }

        return (
          <AccordionItem key={groupName} value={groupName} className="te-accordion-item">
            <AccordionTrigger className="te-accordion-trigger">
              <span>
                {groupName}
                {changeCount > 0 && (
                  <span className="te-change-badge">{changeCount}</span>
                )}
              </span>
            </AccordionTrigger>
            <AccordionContent className="te-accordion-content">
              <div className="te-token-list">
                {tokens.map((token) => {
                  const value = getCurrentValue(token.cssVar);
                  const modified = isModified(token.cssVar);

                  switch (token.type) {
                    case 'hsl-color':
                      return (
                        <HslColorControl
                          key={token.cssVar}
                          label={token.label}
                          value={value}
                          isModified={modified}
                          onChange={(v) => updateToken(token.cssVar, v)}
                          onReset={() => resetToken(token.cssVar)}
                        />
                      );
                    case 'length':
                      return (
                        <LengthControl
                          key={token.cssVar}
                          label={token.label}
                          value={value}
                          isModified={modified}
                          onChange={(v) => updateToken(token.cssVar, v)}
                          onReset={() => resetToken(token.cssVar)}
                        />
                      );
                    case 'font-size':
                      return (
                        <LengthControl
                          key={token.cssVar}
                          label={token.label}
                          value={value}
                          isModified={modified}
                          onChange={(v) => updateToken(token.cssVar, v)}
                          onReset={() => resetToken(token.cssVar)}
                          isFontSize
                        />
                      );
                    case 'shadow':
                      return (
                        <ShadowControl
                          key={token.cssVar}
                          label={token.label}
                          value={value}
                          isModified={modified}
                          onChange={(v) => updateToken(token.cssVar, v)}
                          onReset={() => resetToken(token.cssVar)}
                        />
                      );
                    default:
                      return null;
                  }
                })}
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}
