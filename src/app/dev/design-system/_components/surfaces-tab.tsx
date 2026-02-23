'use client';

const surfaceTiers = [
  { name: 'Page Surface', class: 'bg-surface-page', token: '--surface-page', hsl: '210 40% 98%', desc: 'Top-level page background' },
  { name: 'Raised Surface', class: 'bg-surface-raised', token: '--surface-raised', hsl: '0 0% 100%', desc: 'Cards, panels, elevated containers' },
  { name: 'Inset Surface', class: 'bg-surface-inset', token: '--surface-inset', hsl: '210 40% 98%', desc: 'Recessed areas within cards' },
  { name: 'Emphasis (brand)', class: 'bg-surface-emphasis', token: '--surface-emphasis', hsl: '186 85% 93%', desc: 'Cyan-tinted callout blocks' },
  { name: 'Emphasis (neutral)', class: 'bg-surface-emphasis-neutral', token: '--surface-emphasis-neutral', hsl: '210 40% 96%', desc: 'Neutral highlight blocks' },
];

const borderTiers = [
  { name: 'Default', class: 'border-border-default', token: '--border-default', hsl: '214 32% 91%', desc: 'Card edges, dividers, structural' },
  { name: 'Subtle', class: 'border-border-subtle', token: '--border-subtle', hsl: '214 32% 95%', desc: 'Light internal dividers' },
];

const radiusScale = [
  { name: 'none', value: '0px', class: 'rounded-none' },
  { name: 'sm', value: '4px', class: 'rounded-sm' },
  { name: 'md', value: '6px', class: 'rounded-md' },
  { name: 'lg', value: '8px', class: 'rounded-lg' },
  { name: 'xl', value: '12px', class: 'rounded-xl' },
  { name: 'full', value: '9999px', class: 'rounded-full' },
];

const layoutTokens = [
  { token: '--topbar-height', value: '3.5rem (56px)', desc: 'Top navigation bar' },
  { token: '--utility-bar-height', value: '2.5rem (40px)', desc: 'Utility/action bar' },
  { token: '--sidebar-width', value: '16rem (256px)', desc: 'Sidebar expanded' },
  { token: '--sidebar-width-collapsed', value: '4rem (64px)', desc: 'Sidebar collapsed' },
  { token: '--content-width', value: '900px', desc: 'Max content width' },
];

export function SurfacesTab() {
  return (
    <div className="space-y-8">
      {/* Surface swatches */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Surface Tiers</h3>
        <div className="grid grid-cols-5 gap-4">
          {surfaceTiers.map((s) => (
            <div key={s.name} className="flex flex-col">
              <div className={`h-20 rounded-lg border border-border-default ${s.class}`} />
              <div className="mt-2">
                <div className="text-xs font-semibold text-foreground">{s.name}</div>
                <div className="text-[10px] font-mono text-foreground-tertiary">{s.token}</div>
                <div className="text-[10px] text-foreground-secondary mt-0.5">{s.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Nested hierarchy */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Nested Hierarchy</h3>
        <div className="bg-surface-page rounded-xl p-6 border border-border-subtle">
          <div className="text-overline font-medium tracking-[0.05em] uppercase text-foreground-tertiary mb-2">Page Surface</div>

          <div className="bg-surface-raised rounded-lg border border-border-default shadow-sm p-5">
            <div className="text-overline font-medium tracking-[0.05em] uppercase text-foreground-tertiary mb-3">Raised Surface (Card)</div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-surface-emphasis rounded-md p-4">
                <div className="text-overline font-medium tracking-[0.05em] uppercase text-foreground-tertiary mb-1">Emphasis (brand)</div>
                <p className="text-sm text-foreground">
                  Cyan-tinted callout. Used for key insights and evidence blocks.
                </p>
              </div>
              <div className="bg-surface-emphasis-neutral rounded-md p-4">
                <div className="text-overline font-medium tracking-[0.05em] uppercase text-foreground-tertiary mb-1">Emphasis (neutral)</div>
                <p className="text-sm text-foreground">
                  Neutral highlight. Used for secondary callouts and negative signals.
                </p>
              </div>
            </div>

            <div className="bg-surface-inset rounded-md p-4 mt-4">
              <div className="text-overline font-medium tracking-[0.05em] uppercase text-foreground-tertiary mb-1">Inset Surface</div>
              <p className="text-sm text-foreground-secondary">
                Recessed detail area. Same hue as page surface but appears inset within the card.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Border tiers */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Border Tiers</h3>
        <div className="grid grid-cols-2 gap-4">
          {borderTiers.map((b) => (
            <div key={b.name} className={`rounded-lg border-2 ${b.class} bg-surface-raised p-4`}>
              <div className="text-sm font-semibold text-foreground">{b.name}</div>
              <div className="text-[10px] font-mono text-foreground-tertiary">{b.token}: {b.hsl}</div>
              <div className="text-xs text-foreground-secondary mt-1">{b.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Border radius */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Border Radius Scale</h3>
        <div className="bg-surface-raised rounded-lg border border-border-default shadow-sm p-5">
          <div className="flex items-end gap-4">
            {radiusScale.map((r) => (
              <div key={r.name} className="flex flex-col items-center">
                <div
                  className={`w-16 h-16 bg-surface-emphasis border border-border-default ${r.class}`}
                />
                <div className="mt-2 text-xs font-semibold text-foreground">{r.class}</div>
                <div className="text-[10px] text-foreground-tertiary">{r.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Layout tokens */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Layout Tokens</h3>
        <div className="bg-surface-raised rounded-lg border border-border-default shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-inset">
                <th className="text-left px-4 py-2 text-xs font-semibold text-foreground-secondary">Token</th>
                <th className="text-left px-4 py-2 text-xs font-semibold text-foreground-secondary">Value</th>
                <th className="text-left px-4 py-2 text-xs font-semibold text-foreground-secondary">Description</th>
              </tr>
            </thead>
            <tbody>
              {layoutTokens.map((t) => (
                <tr key={t.token} className="border-t border-border-subtle">
                  <td className="px-4 py-2 font-mono text-xs text-foreground">{t.token}</td>
                  <td className="px-4 py-2 text-xs text-foreground-secondary">{t.value}</td>
                  <td className="px-4 py-2 text-xs text-foreground-secondary">{t.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
