'use client';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';

export function ComponentsTab() {
  return (
    <div className="space-y-8">
      {/* Card composition */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Card Composition — District List</h3>
        <div className="bg-surface-page rounded-xl p-6 border border-border-subtle">
          <div className="space-y-3">
            {[
              { name: 'Los Angeles Unified', county: 'Los Angeles County', students: '420,370', level: 'K-12', fit: 'Strong Fit', fitBg: 'bg-success/10', fitText: 'text-success' },
              { name: 'San Diego Unified', county: 'San Diego County', students: '121,185', level: 'K-12', fit: 'Moderate Fit', fitBg: 'bg-warning/10', fitText: 'text-warning' },
              { name: 'Fresno Unified', county: 'Fresno County', students: '73,400', level: 'K-12', fit: 'Low Fit', fitBg: 'bg-destructive/10', fitText: 'text-destructive' },
            ].map((d) => (
              <div
                key={d.name}
                className="bg-surface-raised rounded-lg border border-border-default shadow-sm p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-subsection-heading font-semibold text-foreground">{d.name}</div>
                    <div className="text-xs font-medium text-foreground-secondary mt-0.5">
                      {d.county} · {d.students} students · {d.level}
                    </div>
                  </div>
                  <Badge variant="outline" className={`${d.fitBg} ${d.fitText} border-transparent text-[11px]`}>
                    {d.fit}
                  </Badge>
                </div>
                <div className="bg-surface-emphasis rounded-md p-3 mt-3">
                  <p className="text-sm text-foreground">
                    Active math materials evaluation with significant allocated budget.
                  </p>
                </div>
                <div className="flex items-center gap-2 mt-3">
                  <Button variant="outlineBrand" size="sm">View Playbook</Button>
                  <Button variant="outline" size="sm">District Profile</Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alert / status states */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Alert / Status States</h3>
        <div className="space-y-3">
          {[
            { label: 'Success', bg: 'bg-success/10', text: 'text-success', msg: 'Playbook generated successfully.' },
            { label: 'Warning', bg: 'bg-warning/10', text: 'text-warning', msg: 'District data may be outdated (last synced 90+ days ago).' },
            { label: 'Error', bg: 'bg-destructive/10', text: 'text-destructive', msg: 'Failed to load district profile. Please retry.' },
            { label: 'Info', bg: 'bg-primary/10', text: 'text-primary', msg: 'New data sources available for this district.' },
          ].map((a) => (
            <div key={a.label} className={`${a.bg} rounded-md p-4 flex items-start gap-3`}>
              <span className={`text-sm font-semibold ${a.text} shrink-0`}>{a.label}</span>
              <span className="text-sm text-foreground">{a.msg}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Badge variants */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Badge Variants</h3>
        <div className="bg-surface-raised rounded-lg border border-border-default shadow-sm p-5">
          <div className="flex flex-wrap gap-3">
            <Badge variant="default">Active</Badge>
            <Badge variant="secondary">Pending</Badge>
            <Badge variant="outline">Draft</Badge>
            <Badge variant="destructive">Error</Badge>
            <Badge variant="outline" className="bg-success/10 text-success border-transparent">Strong Fit</Badge>
            <Badge variant="outline" className="bg-warning/10 text-warning border-transparent">Moderate Fit</Badge>
            <Badge variant="outline" className="bg-destructive/10 text-destructive border-transparent">Low Fit</Badge>
            <Badge variant="outline" className="bg-primary/10 text-primary border-transparent">K-12</Badge>
            <Badge variant="outline" className="bg-surface-emphasis-neutral text-foreground-secondary border-transparent">Elementary</Badge>
          </div>
          <div className="mt-4 text-xs text-foreground-secondary">
            Base variants: <code className="font-mono bg-surface-inset px-1 py-0.5 rounded">default</code>, <code className="font-mono bg-surface-inset px-1 py-0.5 rounded">secondary</code>, <code className="font-mono bg-surface-inset px-1 py-0.5 rounded">outline</code>, <code className="font-mono bg-surface-inset px-1 py-0.5 rounded">destructive</code>. Fit badges use outline + className overrides.
          </div>
        </div>
      </div>

      {/* Input states */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Input States</h3>
        <div className="bg-surface-raised rounded-lg border border-border-default shadow-sm p-5">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-medium text-foreground-secondary mb-1 block">Default</label>
              <Input placeholder="Search districts..." />
            </div>
            <div>
              <label className="text-xs font-medium text-foreground-secondary mb-1 block">With value</label>
              <Input defaultValue="Los Angeles Unified" />
            </div>
            <div>
              <label className="text-xs font-medium text-destructive mb-1 block">Error</label>
              <Input placeholder="Required field" className="border-destructive focus-visible:ring-destructive" />
              <p className="text-xs text-destructive mt-1">District name is required.</p>
            </div>
            <div>
              <label className="text-xs font-medium text-foreground-tertiary mb-1 block">Disabled</label>
              <Input placeholder="Disabled input" disabled />
            </div>
          </div>
        </div>
      </div>

      {/* Source citation pattern */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Source Citation Pattern</h3>
        <div className="bg-surface-raised rounded-lg border border-border-default shadow-sm p-5">
          <p className="text-sm text-foreground">
            LAUSD is actively evaluating K-8 math materials aligned to the CA Math Framework, with $12.5M allocated for 2024-25.
          </p>
          <div className="border-t border-border-default pt-3 mt-6">
            <span className="text-xs font-medium text-foreground-secondary tracking-wide">
              Sources: LAUSD LCAP (2024-25), CDE DataQuest (2023-24)
            </span>
          </div>
          <div className="bg-surface-inset rounded-md p-3 mt-4">
            <p className="text-xs text-foreground-secondary">
              Position: last element. Separator: <code className="font-mono bg-surface-raised px-1 py-0.5 rounded">border-t border-border-default pt-3 mt-6</code>. No icon prefix. No bullets.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
