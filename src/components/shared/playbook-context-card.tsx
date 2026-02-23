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
      <div className="border border-border rounded-lg">
        <CollapsibleTrigger
          className="w-full px-4 py-3 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors rounded-lg"
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
          {isOpen ? (
            <ChevronUp className="h-4 w-4 text-foreground-secondary shrink-0" />
          ) : (
            <ChevronDown className="h-4 w-4 text-foreground-secondary shrink-0" />
          )}
        </CollapsibleTrigger>

        <CollapsibleContent id={contentId}>
          <div className="px-4 pb-4 pt-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* District column */}
            <div>
              <h3 className="font-semibold text-foreground mb-2">District Overview</h3>
              {districtLocation && (
                <p className="text-sm text-foreground-secondary">{districtLocation}</p>
              )}
              <div className="mt-2 grid grid-cols-2 gap-2 text-sm">
                {districtEnrollment != null && (
                  <div>
                    <span className="text-foreground-secondary">Enrollment:</span>{' '}
                    <span className="font-medium">{formatNumber(districtEnrollment)}</span>
                  </div>
                )}
                {elaProficiency != null && (
                  <div>
                    <span className="text-foreground-secondary">ELA:</span>{' '}
                    <span className="font-medium">{elaProficiency}%</span>
                  </div>
                )}
                {mathProficiency != null && (
                  <div>
                    <span className="text-foreground-secondary">Math:</span>{' '}
                    <span className="font-medium">{mathProficiency}%</span>
                  </div>
                )}
                {frpmRate != null && (
                  <div>
                    <span className="text-foreground-secondary">FRPM:</span>{' '}
                    <span className="font-medium">{frpmRate}%</span>
                  </div>
                )}
              </div>
              {fitScore != null && (
                <div className="mt-2 text-sm">
                  <span className="text-foreground-secondary">Fit Score:</span>{' '}
                  <span className="font-medium">{fitScore}/10</span>
                  {fitRationale && (
                    <p className="mt-1 text-xs text-foreground-secondary">{fitRationale}</p>
                  )}
                </div>
              )}
            </div>

            {/* Products column */}
            <div className="space-y-4">
              {products.map((product, index) => (
                <div key={product.productId}>
                  {index > 0 && <div className="border-t border-border mb-4" />}
                  <h4 className="font-medium text-foreground">{product.name}</h4>
                  <p className="text-sm text-foreground-secondary">
                    {product.subjectArea} &middot;{' '}
                    {formatGradeRange(product.gradeRange.gradeFrom, product.gradeRange.gradeTo)}
                  </p>
                  {product.description && (
                    <p className={cn('text-sm text-foreground-secondary mt-1 line-clamp-3')}>
                      {product.description}
                    </p>
                  )}
                  {product.pmContact && (
                    <p className="text-sm text-foreground-secondary mt-1">
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
        </CollapsibleContent>
      </div>
    </Collapsible>
  );
}
