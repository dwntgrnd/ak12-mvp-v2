'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from '@/components/ui/collapsible';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatGradeRange, formatNumber } from '@/lib/utils/format';

interface PlaybookContextCardProps {
  districtName: string;
  districtLocation?: string;
  districtEnrollment?: number;
  elaProficiency?: number;
  mathProficiency?: number;
  frpmRate?: number;
  fitScore?: number;
  fitRationale?: string;
  products: {
    productId: string;
    name: string;
    subjectArea: string;
    gradeRange: { gradeFrom: number; gradeTo: number };
    description?: string;
    pmContact?: { name: string; email: string };
  }[];
}

export function PlaybookContextCard({
  districtName,
  districtLocation,
  districtEnrollment,
  elaProficiency,
  mathProficiency,
  frpmRate,
  fitScore,
  fitRationale,
  products,
}: PlaybookContextCardProps) {
  const [isOpen, setIsOpen] = useState(false);
  const contentId = 'playbook-context-content';

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <div className="bg-surface-raised border border-border-default rounded-lg shadow-sm">
        <CollapsibleTrigger
          className="w-full px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-surface-inset transition-colors rounded-lg"
          aria-expanded={isOpen}
          aria-controls={contentId}
          aria-label={`${districtName} playbook context, ${isOpen ? 'expanded' : 'collapsed'}`}
        >
          <div className="flex items-center gap-3 flex-wrap">
            <span className="font-semibold text-foreground">{districtName}</span>
            <div className="flex items-center gap-1.5 flex-wrap">
              {products.map((p) => (
                <Badge key={p.productId} variant="secondary">
                  {p.name}
                </Badge>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-4 text-sm text-foreground-secondary mr-2">
              {districtEnrollment != null && (
                <span>{formatNumber(districtEnrollment)} students</span>
              )}
              {fitScore != null && (
                <span className={cn(
                  'font-medium',
                  fitScore >= 7 ? 'text-success' : fitScore >= 4 ? 'text-warning' : 'text-destructive'
                )}>
                  {fitScore}/10 fit
                </span>
              )}
            </div>
            {isOpen ? (
              <ChevronUp className="h-4 w-4 text-foreground-secondary shrink-0" />
            ) : (
              <ChevronDown className="h-4 w-4 text-foreground-secondary shrink-0" />
            )}
          </div>
        </CollapsibleTrigger>

        <CollapsibleContent id={contentId}>
          <div className="px-5 pb-5 pt-3 border-t border-border-subtle">
            <div className="grid grid-cols-1 md:grid-cols-[1fr_1px_1fr] gap-6">
              {/* District column */}
              <div>
                <h3 className="font-semibold text-foreground mb-2">District Overview</h3>
                {districtLocation && (
                  <p className="text-sm text-foreground-secondary">{districtLocation}</p>
                )}
                <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-2">
                  {districtEnrollment != null && (
                    <div>
                      <span className="text-overline font-medium uppercase tracking-[0.05em] text-foreground-tertiary">
                        Enrollment
                      </span>
                      <p className="text-sm font-semibold text-foreground">{formatNumber(districtEnrollment)}</p>
                    </div>
                  )}
                  {elaProficiency != null && (
                    <div>
                      <span className="text-overline font-medium uppercase tracking-[0.05em] text-foreground-tertiary">
                        ELA Proficiency
                      </span>
                      <p className="text-sm font-semibold text-foreground">{elaProficiency}%</p>
                    </div>
                  )}
                  {mathProficiency != null && (
                    <div>
                      <span className="text-overline font-medium uppercase tracking-[0.05em] text-foreground-tertiary">
                        Math Proficiency
                      </span>
                      <p className="text-sm font-semibold text-foreground">{mathProficiency}%</p>
                    </div>
                  )}
                  {frpmRate != null && (
                    <div>
                      <span className="text-overline font-medium uppercase tracking-[0.05em] text-foreground-tertiary">
                        FRPM
                      </span>
                      <p className="text-sm font-semibold text-foreground">{frpmRate}%</p>
                    </div>
                  )}
                </div>
                {fitScore != null && (
                  <div className="mt-3">
                    <span className="text-overline font-medium uppercase tracking-[0.05em] text-foreground-tertiary">
                      Fit Score
                    </span>
                    <p className={cn(
                      'text-sm font-semibold',
                      fitScore >= 7 ? 'text-success' : fitScore >= 4 ? 'text-warning' : 'text-destructive'
                    )}>
                      {fitScore}/10
                    </p>
                    {fitRationale && (
                      <p className="mt-0.5 text-xs text-foreground-secondary">{fitRationale}</p>
                    )}
                  </div>
                )}
              </div>

              {/* Vertical divider — hidden on mobile */}
              <div className="hidden md:block bg-border-subtle" />

              {/* Products column */}
              <div className="space-y-4">
                {products.map((product, index) => (
                  <div key={product.productId}>
                    {index > 0 && <div className="border-t border-border-subtle mb-4" />}
                    <h4 className="text-sm font-semibold text-foreground">{product.name}</h4>
                    <p className="text-sm text-foreground-secondary">
                      {product.subjectArea} &middot;{' '}
                      {formatGradeRange(product.gradeRange.gradeFrom, product.gradeRange.gradeTo)}
                    </p>
                    {product.description && (
                      <p className="text-xs text-foreground-secondary mt-1 line-clamp-3">
                        {product.description}
                      </p>
                    )}
                    {product.pmContact && (
                      <p className="text-xs text-foreground-secondary mt-1">
                        PM: {product.pmContact.name} &middot;{' '}
                        <a
                          href={`mailto:${product.pmContact.email}`}
                          className="text-primary hover:underline"
                        >
                          {product.pmContact.email}
                        </a>
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
