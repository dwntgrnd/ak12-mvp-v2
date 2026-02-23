'use client';

import { Input } from '@/components/ui/input';

const spacingScale = [
  { name: 'gap-1', px: 4, tw: '1' },
  { name: 'gap-2', px: 8, tw: '2' },
  { name: 'p-3', px: 12, tw: '3' },
  { name: 'p-4', px: 16, tw: '4' },
  { name: 'p-5', px: 20, tw: '5' },
  { name: 'gap-6', px: 24, tw: '6' },
  { name: 'gap-8', px: 32, tw: '8' },
  { name: 'p-10', px: 40, tw: '10' },
  { name: 'p-12', px: 48, tw: '12' },
  { name: 'p-16', px: 64, tw: '16' },
];

const purposeMap = [
  { purpose: 'Inline tight', value: '4px', tw: 'gap-1', when: 'Icon-to-label, badge padding' },
  { purpose: 'Inline related', value: '8px', tw: 'gap-2', when: 'Label-value pairs' },
  { purpose: 'Component compact', value: '12px', tw: 'p-3', when: 'Compact containers' },
  { purpose: 'Component standard', value: '16px', tw: 'p-4', when: 'Standard card padding' },
  { purpose: 'Component spacious', value: '20px', tw: 'p-5', when: 'Primary content containers' },
  { purpose: 'Sibling separation', value: '12px', tw: 'gap-3', when: 'Peer items in a group' },
  { purpose: 'Section gap', value: '24px', tw: 'gap-6 / mt-6', when: 'Between sections' },
  { purpose: 'Region gap', value: '32px', tw: 'gap-8 / mt-8', when: 'Between page regions' },
  { purpose: 'Page margin', value: '24px', tw: 'px-6', when: 'Horizontal page padding' },
];

export function SpacingTab() {
  return (
    <div className="space-y-8">
      {/* Visual bar scale */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Spacing Scale</h3>
        <div className="bg-surface-raised rounded-lg border border-border-default shadow-sm p-5 space-y-3">
          {spacingScale.map((s) => (
            <div key={s.name} className="flex items-center gap-3">
              <div className="w-20 shrink-0 text-right">
                <span className="text-xs font-mono text-foreground-secondary">{s.name}</span>
              </div>
              <div
                className="h-6 rounded bg-primary/20 border border-primary/30"
                style={{ width: `${s.px * 3}px` }}
              />
              <span className="text-xs text-foreground-tertiary">{s.px}px</span>
            </div>
          ))}
        </div>
      </div>

      {/* Purpose table */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Spacing Purpose Map</h3>
        <div className="bg-surface-raised rounded-lg border border-border-default shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-inset">
                <th className="text-left px-4 py-2 text-xs font-semibold text-foreground-secondary">Purpose</th>
                <th className="text-left px-4 py-2 text-xs font-semibold text-foreground-secondary">Value</th>
                <th className="text-left px-4 py-2 text-xs font-semibold text-foreground-secondary">Tailwind</th>
                <th className="text-left px-4 py-2 text-xs font-semibold text-foreground-secondary">When</th>
              </tr>
            </thead>
            <tbody>
              {purposeMap.map((p) => (
                <tr key={p.purpose} className="border-t border-border-subtle">
                  <td className="px-4 py-2 text-xs font-semibold text-foreground">{p.purpose}</td>
                  <td className="px-4 py-2 text-xs text-foreground-secondary">{p.value}</td>
                  <td className="px-4 py-2 font-mono text-xs text-foreground">{p.tw}</td>
                  <td className="px-4 py-2 text-xs text-foreground-secondary">{p.when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rhythm rule */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Rhythm Rule</h3>
        <div className="bg-surface-raised rounded-lg border border-border-default shadow-sm p-5">
          <div className="flex gap-8">
            <div className="flex-1">
              <div className="text-xs font-semibold text-foreground mb-2">Within group: 12px (gap-3)</div>
              <div className="bg-surface-inset rounded-md p-3 space-y-3">
                <div className="h-4 w-full bg-primary/15 rounded" />
                <div className="h-4 w-3/4 bg-primary/15 rounded" />
                <div className="h-4 w-5/6 bg-primary/15 rounded" />
              </div>
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-foreground mb-2">Between sections: 24px (gap-6)</div>
              <div className="bg-surface-inset rounded-md p-3 space-y-6">
                <div className="space-y-3">
                  <div className="h-4 w-full bg-primary/15 rounded" />
                  <div className="h-4 w-3/4 bg-primary/15 rounded" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-5/6 bg-primary/15 rounded" />
                  <div className="h-4 w-2/3 bg-primary/15 rounded" />
                </div>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-xs font-semibold text-foreground mb-2">Between regions: 32px (gap-8)</div>
              <div className="bg-surface-inset rounded-md p-3 space-y-8">
                <div className="space-y-3">
                  <div className="h-4 w-full bg-primary/15 rounded" />
                </div>
                <div className="space-y-3">
                  <div className="h-4 w-4/5 bg-primary/15 rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Gestalt proximity demo */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Gestalt Proximity — Form Fields</h3>
        <div className="grid grid-cols-2 gap-6">
          <div className="bg-surface-raised rounded-lg border border-border-default shadow-sm p-5">
            <div className="text-xs font-semibold text-foreground mb-3">Tight spacing (gap-2 = 8px)</div>
            <div className="space-y-2">
              <div>
                <label className="text-xs font-medium text-foreground-secondary">District Name</label>
                <Input placeholder="Los Angeles Unified" className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground-secondary">State</label>
                <Input placeholder="California" className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground-secondary">Enrollment</label>
                <Input placeholder="420,370" className="mt-1" />
              </div>
            </div>
          </div>

          <div className="bg-surface-raised rounded-lg border border-border-default shadow-sm p-5">
            <div className="text-xs font-semibold text-foreground mb-3">Standard spacing (gap-4 = 16px)</div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-foreground-secondary">District Name</label>
                <Input placeholder="Los Angeles Unified" className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground-secondary">State</label>
                <Input placeholder="California" className="mt-1" />
              </div>
              <div>
                <label className="text-xs font-medium text-foreground-secondary">Enrollment</label>
                <Input placeholder="420,370" className="mt-1" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
