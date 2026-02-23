'use client';

const typeScale = [
  {
    name: 'Page Title',
    token: '--font-size-page-title',
    px: '24px',
    ratio: '1.714',
    tailwind: 'text-2xl',
    weight: 700,
    tracking: '-0.01em',
    sample: 'Los Angeles Unified School District',
  },
  {
    name: 'Section Heading',
    token: '--font-size-section-heading',
    px: '18px',
    ratio: '1.286',
    tailwind: 'text-lg',
    weight: 600,
    tracking: '-0.01em',
    sample: 'Goals & Funding Overview',
  },
  {
    name: 'Subsection Heading',
    token: '--font-size-subsection-heading',
    px: '15px',
    ratio: '1.071',
    tailwind: 'text-subsection-heading',
    weight: 600,
    tracking: 'normal',
    sample: 'View all LCAP goals',
  },
  {
    name: 'Body',
    token: '--font-size-body',
    px: '14px',
    ratio: '1.000',
    tailwind: 'text-sm',
    weight: 400,
    tracking: 'normal',
    sample: 'Math proficiency trails ELA significantly, making math the more urgent instructional need.',
  },
  {
    name: 'Subsection Sm',
    token: '--font-size-subsection-sm',
    px: '13px',
    ratio: '0.929',
    tailwind: 'text-subsection-sm',
    weight: 600,
    tracking: 'normal',
    sample: 'Other Funding Signals',
  },
  {
    name: 'Caption',
    token: '--font-size-caption',
    px: '12px',
    ratio: '0.857',
    tailwind: 'text-xs',
    weight: 500,
    tracking: '0.025em',
    sample: 'Sources: CDE DataQuest (2023-24), District LCAP (2024-25)',
  },
  {
    name: 'Overline',
    token: '--font-size-overline',
    px: '11px',
    ratio: '0.786',
    tailwind: 'text-overline',
    weight: 500,
    tracking: '0.05em',
    sample: 'ACTIVE EVALUATION',
    uppercase: true,
  },
];

const fontWeights = [
  { weight: 400, name: 'Regular', usage: 'Body text, long-form reading' },
  { weight: 500, name: 'Medium', usage: 'Captions, overlines, metadata' },
  { weight: 600, name: 'Semibold', usage: 'Headings, emphasis, subsection labels' },
  { weight: 700, name: 'Bold', usage: 'Page titles only' },
];

export function TypographyTab() {
  return (
    <div className="space-y-8">
      {/* Typeface */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Typeface</h3>
        <div className="bg-surface-raised rounded-lg border border-border-default shadow-sm p-5">
          <div className="flex items-baseline gap-4">
            <span className="text-2xl font-bold text-foreground">Manrope</span>
            <span className="text-sm text-foreground-secondary">Variable weight 200-800</span>
          </div>
          <p className="text-sm text-foreground-secondary mt-2">
            Used everywhere. Heading font: <code className="text-xs font-mono bg-surface-inset px-1 py-0.5 rounded">--font-heading</code> · Body font: <code className="text-xs font-mono bg-surface-inset px-1 py-0.5 rounded">--font-body</code> · Both resolve to Manrope.
          </p>
          <p className="text-sm text-foreground-secondary mt-1">
            Base size: <code className="text-xs font-mono bg-surface-inset px-1 py-0.5 rounded">--font-base: 16px</code> — all other sizes computed via <code className="text-xs font-mono bg-surface-inset px-1 py-0.5 rounded">calc()</code> ratios.
          </p>
        </div>
      </div>

      {/* Scale */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Type Scale</h3>
        <div className="bg-surface-raised rounded-lg border border-border-default shadow-sm p-5 space-y-6">
          {typeScale.map((level) => (
            <div key={level.name} className="flex items-baseline gap-4">
              <div className="w-44 shrink-0">
                <div className="text-xs font-mono text-foreground-secondary">{level.name}</div>
                <div className="text-[10px] font-mono text-foreground-tertiary mt-0.5">
                  {level.px} · {level.weight} · {level.tracking}
                </div>
                <div className="text-[10px] font-mono text-foreground-tertiary">
                  {level.tailwind} · {'\u00d7'}{level.ratio}
                </div>
              </div>
              <span
                style={{
                  fontSize: `var(${level.token})`,
                  fontWeight: level.weight,
                  letterSpacing: level.tracking === 'normal' ? undefined : level.tracking,
                  textTransform: level.uppercase ? 'uppercase' : undefined,
                  color: level.name === 'Caption' || level.name === 'Overline'
                    ? 'hsl(var(--foreground-secondary))'
                    : 'hsl(var(--foreground))',
                }}
              >
                {level.sample}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Font Weights */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Font Weights</h3>
        <div className="bg-surface-raised rounded-lg border border-border-default shadow-sm p-5">
          <div className="grid grid-cols-4 gap-6">
            {fontWeights.map((fw) => (
              <div key={fw.weight}>
                <span className="text-2xl text-foreground" style={{ fontWeight: fw.weight }}>
                  Aa
                </span>
                <div className="mt-1 text-sm font-semibold text-foreground">{fw.weight} {fw.name}</div>
                <div className="text-xs text-foreground-secondary">{fw.usage}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Contextual demo */}
      <div>
        <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Text Tiers in Context</h3>
        <div className="bg-surface-raised rounded-lg border border-border-default shadow-sm p-5">
          <div className="text-overline font-medium tracking-[0.05em] uppercase text-foreground-tertiary">
            Active Evaluation
          </div>
          <h4 className="text-lg font-semibold text-foreground tracking-tight mt-1">
            K-8 Math Materials Adoption
          </h4>
          <p className="text-sm text-foreground mt-2">
            LAUSD is actively evaluating K-8 math materials aligned to the CA Math Framework, with <span className="font-semibold">$12.5M allocated</span> for 2024-25.
          </p>
          <p className="text-xs text-foreground-secondary mt-3 font-medium tracking-wide">
            Los Angeles County · 420,370 students · K-12
          </p>
          <div className="border-t border-border-default pt-3 mt-6">
            <span className="text-xs font-medium text-foreground-secondary tracking-wide">
              Sources: LAUSD LCAP (2024-25), CDE DataQuest (2023-24)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
