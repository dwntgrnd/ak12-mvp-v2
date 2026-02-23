'use client';

import { useState } from 'react';
import { fitCategoryColors, brandColors } from '@/lib/design-tokens';

/* ── HSL values synced from globals.css :root ── */
const TOKEN_MAP: Record<string, { hsl: string; description: string; category: string }> = {
  // Core
  '--background':           { hsl: '210 40% 98%',  description: 'Page background',         category: 'Core' },
  '--foreground':           { hsl: '213 47% 17%',  description: 'Primary text',             category: 'Core' },
  '--card':                 { hsl: '0 0% 100%',    description: 'Card background',          category: 'Core' },
  '--card-foreground':      { hsl: '213 47% 17%',  description: 'Card text',                category: 'Core' },
  '--popover':              { hsl: '0 0% 100%',    description: 'Popover background',       category: 'Core' },
  '--popover-foreground':   { hsl: '213 47% 17%',  description: 'Popover text',             category: 'Core' },

  // Brand
  '--primary':              { hsl: '208 60% 38%',  description: 'Primary (brand blue)',     category: 'Brand' },
  '--primary-foreground':   { hsl: '0 0% 100%',    description: 'Primary on-color',         category: 'Brand' },
  '--brand-orange':         { hsl: '27 87% 57%',   description: 'Brand orange (CTAs)',      category: 'Brand' },
  '--district-link':        { hsl: '198 58% 43%',  description: 'District link color',      category: 'Brand' },

  // Semantic
  '--destructive':          { hsl: '347 95% 55%',  description: 'Error / destructive',      category: 'Semantic' },
  '--destructive-foreground': { hsl: '0 0% 100%',  description: 'Destructive on-color',     category: 'Semantic' },
  '--success':              { hsl: '160 100% 44%', description: 'Success',                  category: 'Semantic' },
  '--success-foreground':   { hsl: '0 0% 100%',    description: 'Success on-color',         category: 'Semantic' },
  '--warning':              { hsl: '45 100% 51%',  description: 'Warning',                  category: 'Semantic' },
  '--warning-foreground':   { hsl: '213 47% 17%',  description: 'Warning on-color',         category: 'Semantic' },
  '--ring':                 { hsl: '208 60% 38%',  description: 'Focus ring',               category: 'Semantic' },

  // Neutral
  '--secondary':            { hsl: '210 40% 96%',  description: 'Secondary background',     category: 'Neutral' },
  '--secondary-foreground': { hsl: '213 47% 17%',  description: 'Secondary text',           category: 'Neutral' },
  '--muted':                { hsl: '210 40% 96%',  description: 'Muted background',         category: 'Neutral' },
  '--muted-foreground':     { hsl: '215 16% 47%',  description: 'Muted text',               category: 'Neutral' },
  '--accent':               { hsl: '210 40% 96%',  description: 'Accent background',        category: 'Neutral' },
  '--accent-foreground':    { hsl: '213 47% 17%',  description: 'Accent text',              category: 'Neutral' },
  '--border':               { hsl: '214 32% 91%',  description: 'Default border',           category: 'Neutral' },
  '--input':                { hsl: '214 32% 91%',  description: 'Input border',             category: 'Neutral' },

  // Text tiers
  '--foreground-secondary': { hsl: '215 16% 47%',  description: 'Secondary text tier',      category: 'Text Tiers' },
  '--foreground-tertiary':  { hsl: '215 20% 65%',  description: 'Tertiary text tier',       category: 'Text Tiers' },

  // Surface tiers
  '--surface-page':             { hsl: '210 40% 98%',  description: 'Page surface',          category: 'Surfaces' },
  '--surface-raised':           { hsl: '0 0% 100%',    description: 'Raised surface (cards)', category: 'Surfaces' },
  '--surface-inset':            { hsl: '210 40% 98%',  description: 'Inset surface',          category: 'Surfaces' },
  '--surface-emphasis':         { hsl: '186 85% 93%',  description: 'Emphasis (cyan tint)',    category: 'Surfaces' },
  '--surface-emphasis-neutral': { hsl: '210 40% 96%',  description: 'Emphasis (neutral)',      category: 'Surfaces' },

  // Border tiers
  '--border-default': { hsl: '214 32% 91%', description: 'Default border', category: 'Borders' },
  '--border-subtle':  { hsl: '214 32% 95%', description: 'Subtle border',  category: 'Borders' },

  // Sidebar / nav
  '--sidebar-bg':     { hsl: '219 27% 41%', description: 'Sidebar bg',      category: 'Sidebar' },
  '--topbar-bg':      { hsl: '213 47% 17%', description: 'Topbar bg',       category: 'Sidebar' },
  '--sidebar-fg':     { hsl: '180 3% 95%',  description: 'Sidebar text',    category: 'Sidebar' },
  '--sidebar-hover':  { hsl: '217 33% 27%', description: 'Sidebar hover',   category: 'Sidebar' },
  '--sidebar-active': { hsl: '184 97% 42%', description: 'Sidebar active',  category: 'Sidebar' },

  // Emphasis surfaces (legacy aliases)
  '--emphasis-surface':         { hsl: '186 85% 93%', description: 'Emphasis surface (cyan)',    category: 'Surfaces' },
  '--emphasis-surface-neutral': { hsl: '210 40% 96%', description: 'Emphasis surface (neutral)', category: 'Surfaces' },
};

function hslToHex(hslStr: string): string {
  const [h, s, l] = hslStr.split(' ').map((v) => parseFloat(v));
  const sNorm = s / 100;
  const lNorm = l / 100;
  const a = sNorm * Math.min(lNorm, 1 - lNorm);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = lNorm - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function isLightColor(hslStr: string): boolean {
  const l = parseFloat(hslStr.split(' ')[2]);
  return l > 55;
}

function Swatch({ name, hsl, description }: { name: string; hsl: string; description: string }) {
  const [copied, setCopied] = useState(false);
  const hex = hslToHex(hsl);
  const light = isLightColor(hsl);

  const handleClick = () => {
    navigator.clipboard?.writeText(name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <button
      onClick={handleClick}
      className="group flex flex-col items-stretch cursor-pointer transition-transform hover:scale-105"
      title={`Copy ${name}`}
    >
      <div
        className="h-16 rounded-lg border border-black/5 flex items-end px-2 pb-1.5 transition-shadow group-hover:shadow-md"
        style={{ backgroundColor: `hsl(${hsl})` }}
      >
        {copied && (
          <span className={`text-[10px] font-mono font-bold ${light ? 'text-black/70' : 'text-white/90'}`}>
            Copied!
          </span>
        )}
      </div>
      <div className="mt-1.5 text-left">
        <div className="text-[11px] font-semibold text-foreground font-mono truncate">{name}</div>
        <div className="text-[10px] text-foreground-tertiary font-mono">{hsl}</div>
        <div className="text-[10px] text-foreground-tertiary font-mono">{hex}</div>
        <div className="text-[10px] text-foreground-secondary mt-0.5">{description}</div>
      </div>
    </button>
  );
}

function TokenSection({ title, tokens }: { title: string; tokens: [string, { hsl: string; description: string }][] }) {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">{title}</h3>
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-3">
        {tokens.map(([name, data]) => (
          <Swatch key={name} name={name} hsl={data.hsl} description={data.description} />
        ))}
      </div>
    </div>
  );
}

function TextTierDemo() {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Text Color Tiers — In Context</h3>
      <div className="bg-surface-raised rounded-lg border border-border-default shadow-sm p-5">
        <p className="text-sm text-foreground font-semibold">Primary — text-foreground</p>
        <p className="text-sm text-foreground mt-1">Titles, headings, body text, key values. HSL: 213 47% 17%</p>
        <p className="text-sm text-foreground-secondary mt-3 font-semibold">Secondary — text-foreground-secondary</p>
        <p className="text-sm text-foreground-secondary mt-1">Supporting text, metadata, captions, subsection labels. HSL: 215 16% 47%</p>
        <p className="text-sm text-foreground-tertiary mt-3 font-semibold">Tertiary — text-foreground-tertiary</p>
        <p className="text-sm text-foreground-tertiary mt-1">Overline labels, placeholders, citations, helper text. HSL: 215 20% 65%</p>
        <div className="mt-4 p-3 bg-surface-inset rounded-md">
          <p className="text-xs text-foreground-secondary">
            WCAG AA contrast (4.5:1 min): Primary on white = ~10:1, Secondary on white = ~5.5:1, Tertiary on white = ~3.5:1 (use large text only)
          </p>
        </div>
      </div>
    </div>
  );
}

function FitCategoriesDemo() {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Fit Category Colors</h3>
      <p className="text-sm text-foreground-secondary mb-3">
        From <code className="text-xs font-mono bg-surface-inset px-1 py-0.5 rounded">design-tokens.ts</code> — fitCategoryColors
      </p>
      <div className="grid grid-cols-3 gap-4">
        {(Object.entries(fitCategoryColors) as [string, typeof fitCategoryColors.strong][]).map(([key, val]) => (
          <div key={key} className={`rounded-lg p-4 ${val.bg}`}>
            <span className={`text-sm font-semibold ${val.text}`}>{val.label}</span>
            <div className="mt-2 text-xs text-foreground-secondary font-mono">
              bg: {val.bg} · text: {val.text} · border: {val.border}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BrandPrimitivesDemo() {
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Brand Primitives (design-tokens.ts)</h3>
      <p className="text-sm text-foreground-secondary mb-3">
        Raw hex values from <code className="text-xs font-mono bg-surface-inset px-1 py-0.5 rounded">brandColors.brand</code>
      </p>
      <div className="grid grid-cols-5 gap-3">
        {Object.entries(brandColors.brand).map(([name, hex]) => (
          <div key={name} className="flex flex-col items-stretch">
            <div
              className="h-14 rounded-lg border border-black/5"
              style={{ backgroundColor: hex }}
            />
            <div className="mt-1.5">
              <div className="text-[11px] font-semibold text-foreground font-mono">{name}</div>
              <div className="text-[10px] text-foreground-tertiary font-mono">{hex}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function SidebarPreview() {
  const sidebarTokens = Object.entries(TOKEN_MAP).filter(([, v]) => v.category === 'Sidebar');
  return (
    <div className="mb-8">
      <h3 className="text-lg font-semibold text-foreground tracking-tight mb-3">Sidebar / Navigation</h3>
      <div className="flex gap-6">
        <div className="w-64 rounded-lg overflow-hidden shadow-sm">
          <div className="h-10 flex items-center px-4" style={{ backgroundColor: `hsl(213 47% 17%)` }}>
            <span className="text-sm font-semibold" style={{ color: `hsl(180 3% 95%)` }}>Topbar</span>
          </div>
          <div className="p-3 space-y-1" style={{ backgroundColor: `hsl(219 27% 41%)` }}>
            <div className="px-3 py-2 rounded-md text-sm" style={{ color: `hsl(180 3% 95%)`, backgroundColor: `hsl(217 33% 27%)` }}>Hover state</div>
            <div className="px-3 py-2 rounded-md text-sm font-semibold" style={{ color: `hsl(184 97% 42%)` }}>Active item</div>
            <div className="px-3 py-2 rounded-md text-sm" style={{ color: `hsl(180 3% 95%)` }}>Normal item</div>
          </div>
        </div>
        <div className="flex-1 grid grid-cols-3 gap-3">
          {sidebarTokens.map(([name, data]) => (
            <Swatch key={name} name={name} hsl={data.hsl} description={data.description} />
          ))}
        </div>
      </div>
    </div>
  );
}

export function ColorsTab() {
  const grouped: Record<string, [string, { hsl: string; description: string }][]> = {};
  const skipCategories = new Set(['Sidebar', 'Surfaces', 'Borders']);
  for (const [name, data] of Object.entries(TOKEN_MAP)) {
    if (skipCategories.has(data.category)) continue;
    if (!grouped[data.category]) grouped[data.category] = [];
    grouped[data.category].push([name, data]);
  }

  // Deduplicate surface entries
  const surfaceTokens = Object.entries(TOKEN_MAP)
    .filter(([name, v]) => v.category === 'Surfaces' && name.startsWith('--surface'));
  const borderTokens = Object.entries(TOKEN_MAP)
    .filter(([, v]) => v.category === 'Borders');

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([category, tokens]) => (
        <TokenSection key={category} title={category} tokens={tokens} />
      ))}

      <TokenSection title="Surfaces" tokens={surfaceTokens} />
      <TokenSection title="Border Tiers" tokens={borderTokens} />

      <TextTierDemo />
      <SidebarPreview />
      <FitCategoriesDemo />
      <BrandPrimitivesDemo />
    </div>
  );
}
