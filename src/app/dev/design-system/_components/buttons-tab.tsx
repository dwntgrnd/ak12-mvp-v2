'use client';

import { Button } from '@/components/ui/button';

const variants = [
  { variant: 'default' as const, label: 'default', description: 'Brand-orange filled. Primary CTAs: Generate, Create, New, Submit.' },
  { variant: 'outlineBrand' as const, label: 'outlineBrand', description: 'Brand-orange outline. Brand-prominent secondary: View Playbook, Find Similar.' },
  { variant: 'outline' as const, label: 'outline', description: 'Neutral outline. Utility actions: filter triggers, Retry, Go to Solutions.' },
  { variant: 'ghost' as const, label: 'ghost', description: 'Transparent. Subtle actions: Cancel, sidebar toggle, toolbar controls.' },
  { variant: 'destructive' as const, label: 'destructive', description: 'Red filled. Destructive confirmations only.' },
  { variant: 'link' as const, label: 'link', description: 'Text link styled as button. Rare.' },
];

const sizes = ['sm', 'default', 'lg'] as const;

export function ButtonsTab() {
  return (
    <div className="space-y-8">
      {/* All variants at all sizes */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Button Variants &times; Sizes</h3>
        <div className="bg-surface-raised rounded-lg border border-border-default shadow-sm p-5 space-y-6">
          {variants.map((v) => (
            <div key={v.variant}>
              <div className="flex items-baseline gap-2 mb-2">
                <code className="text-xs font-mono bg-surface-inset px-1.5 py-0.5 rounded text-foreground">
                  variant=&quot;{v.label}&quot;
                </code>
                <span className="text-xs text-foreground-secondary">{v.description}</span>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                {sizes.map((size) => (
                  <Button key={size} variant={v.variant} size={size}>
                    {size === 'sm' ? 'Small' : size === 'lg' ? 'Large Action' : 'Default'}
                  </Button>
                ))}
                <Button variant={v.variant} disabled>
                  Disabled
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Focus ring demo */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Focus Ring</h3>
        <div className="bg-surface-raised rounded-lg border border-border-default shadow-sm p-5">
          <p className="text-sm text-foreground-secondary mb-3">
            Tab to the button below to see the focus ring. Uses <code className="text-xs font-mono bg-surface-inset px-1 py-0.5 rounded">ring-ring</code> (cyan-based).
          </p>
          <Button variant="outline">Tab to focus me</Button>
        </div>
      </div>

      {/* Icon button */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Icon Size</h3>
        <div className="bg-surface-raised rounded-lg border border-border-default shadow-sm p-5">
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </Button>
            <Button variant="ghost" size="icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="6 9 12 15 18 9" />
              </svg>
            </Button>
            <span className="text-xs text-foreground-secondary ml-2">size=&quot;icon&quot; — 36&times;36px</span>
          </div>
        </div>
      </div>

      {/* Contextual usage */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Contextual Usage — District Action Bar</h3>
        <div className="bg-surface-raised rounded-lg border border-border-default shadow-sm p-5">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-subsection-heading font-semibold text-foreground">Los Angeles Unified</h4>
              <p className="text-xs text-foreground-secondary mt-0.5">420,370 students · K-12</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
                </svg>
                Save
              </Button>
              <Button variant="outlineBrand" size="sm">View Playbook</Button>
              <Button variant="default" size="sm">Generate Brief</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
