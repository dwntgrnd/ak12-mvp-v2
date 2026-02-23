import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

// ---------------------------------------------------------------------------
// HSL → Hex conversion
// ---------------------------------------------------------------------------

function hslToHex(h: number, s: number, l: number): string {
  s /= 100;
  l /= 100;

  const a = s * Math.min(l, 1 - l);
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color)
      .toString(16)
      .padStart(2, '0');
  };

  return `#${f(0)}${f(8)}${f(4)}`.toUpperCase();
}

function parseHsl(value: string): { h: number; s: number; l: number } | null {
  // Matches "210 40% 98%" pattern
  const match = value.trim().match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
  if (!match) return null;
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

// ---------------------------------------------------------------------------
// Parse :root block from globals.css
// ---------------------------------------------------------------------------

function parseRootVariables(css: string): Map<string, string> {
  const vars = new Map<string, string>();

  // Extract the :root { ... } block
  const rootMatch = css.match(/:root\s*\{([\s\S]*?)\n\}/);
  if (!rootMatch) {
    throw new Error('Could not find :root block in globals.css');
  }

  const rootBlock = rootMatch[1];
  const lineRegex = /--([a-z0-9-]+)\s*:\s*(.+?)\s*;/g;
  let match: RegExpExecArray | null;

  while ((match = lineRegex.exec(rootBlock)) !== null) {
    vars.set(match[1], match[2]);
  }

  return vars;
}

// ---------------------------------------------------------------------------
// Classify and convert variables
// ---------------------------------------------------------------------------

interface FigmaVariable {
  name: string;
  type: 'COLOR' | 'FLOAT';
  description: string;
  values: {
    Light: { hex: string; hsl: string } | { value: number; unit: string };
  };
}

// Color token names from the spec
const COLOR_TOKENS = new Set([
  'background', 'foreground',
  'card', 'card-foreground',
  'primary', 'primary-foreground',
  'secondary', 'secondary-foreground',
  'muted', 'muted-foreground',
  'accent', 'accent-foreground',
  'destructive', 'destructive-foreground',
  'success', 'success-foreground',
  'warning', 'warning-foreground',
  'border', 'input', 'ring',
  'brand-orange', 'district-link',
  'sidebar-bg', 'topbar-bg', 'sidebar-fg', 'sidebar-hover', 'sidebar-active',
  'emphasis-surface', 'emphasis-surface-neutral',
  'foreground-secondary', 'foreground-tertiary',
  'surface-page', 'surface-raised', 'surface-inset', 'surface-emphasis', 'surface-emphasis-neutral',
  'border-default', 'border-subtle',
]);

// Spacing token names from the spec
const SPACING_TOKENS = new Set([
  'topbar-height', 'utility-bar-height',
  'sidebar-width', 'sidebar-width-collapsed',
  'content-width', 'radius',
]);

// Typography token names from the spec
const TYPOGRAPHY_TOKENS = new Set([
  'font-base',
  'font-size-page-title', 'font-size-section-heading', 'font-size-subsection-heading',
  'font-size-body', 'font-size-subsection-sm', 'font-size-caption', 'font-size-overline',
]);

// Figma variable name mapping
const FIGMA_NAME_MAP: Record<string, string> = {
  'font-size-page-title': 'typography/size-page-title',
  'font-size-section-heading': 'typography/size-section-heading',
  'font-size-subsection-heading': 'typography/size-subsection-heading',
  'font-size-body': 'typography/size-body',
  'font-size-subsection-sm': 'typography/size-subsection-sm',
  'font-size-caption': 'typography/size-caption',
  'font-size-overline': 'typography/size-overline',
};

function getFigmaName(cssName: string): string {
  if (FIGMA_NAME_MAP[cssName]) return FIGMA_NAME_MAP[cssName];
  if (COLOR_TOKENS.has(cssName)) return `color/${cssName}`;
  if (SPACING_TOKENS.has(cssName)) return `spacing/${cssName}`;
  if (TYPOGRAPHY_TOKENS.has(cssName)) return `typography/${cssName}`;
  return cssName;
}

function getDescription(cssName: string): string {
  const descriptions: Record<string, string> = {
    'background': 'Page background',
    'foreground': 'Primary text',
    'card': 'Card background',
    'card-foreground': 'Card text',
    'primary': 'Primary brand color (cyan-blue)',
    'primary-foreground': 'Text on primary',
    'secondary': 'Secondary background',
    'secondary-foreground': 'Text on secondary',
    'muted': 'Muted background',
    'muted-foreground': 'Muted text',
    'accent': 'Accent background',
    'accent-foreground': 'Text on accent',
    'destructive': 'Destructive/error color',
    'destructive-foreground': 'Text on destructive',
    'success': 'Success color',
    'success-foreground': 'Text on success',
    'warning': 'Warning color',
    'warning-foreground': 'Text on warning',
    'border': 'Default border',
    'input': 'Input border',
    'ring': 'Focus ring',
    'brand-orange': 'Brand orange (CTA)',
    'district-link': 'District link color',
    'sidebar-bg': 'Sidebar background',
    'topbar-bg': 'Top bar background',
    'sidebar-fg': 'Sidebar text',
    'sidebar-hover': 'Sidebar hover state',
    'sidebar-active': 'Sidebar active state',
    'emphasis-surface': 'Emphasis surface (cyan tint)',
    'emphasis-surface-neutral': 'Emphasis surface (neutral)',
    'foreground-secondary': 'Secondary text tier',
    'foreground-tertiary': 'Tertiary text tier',
    'surface-page': 'Page-level surface',
    'surface-raised': 'Raised surface (cards)',
    'surface-inset': 'Inset/recessed surface',
    'surface-emphasis': 'Emphasis surface (brand)',
    'surface-emphasis-neutral': 'Emphasis surface (neutral)',
    'border-default': 'Default border tier',
    'border-subtle': 'Subtle border tier',
    'topbar-height': 'Top bar height',
    'utility-bar-height': 'Utility bar height',
    'sidebar-width': 'Sidebar expanded width',
    'sidebar-width-collapsed': 'Sidebar collapsed width',
    'content-width': 'Max content area width',
    'radius': 'Default border radius',
    'font-base': 'Base font size',
    'font-size-page-title': 'Page title size',
    'font-size-section-heading': 'Section heading size',
    'font-size-subsection-heading': 'Subsection heading size',
    'font-size-body': 'Body text size',
    'font-size-subsection-sm': 'Small subsection size',
    'font-size-caption': 'Caption size',
    'font-size-overline': 'Overline label size',
  };
  return descriptions[cssName] ?? '';
}

/** Convert a CSS length value to pixels. */
function toPx(value: string, fontBase: number): number {
  // Direct px value
  const pxMatch = value.match(/^([\d.]+)px$/);
  if (pxMatch) return parseFloat(pxMatch[1]);

  // rem value
  const remMatch = value.match(/^([\d.]+)rem$/);
  if (remMatch) return parseFloat(remMatch[1]) * 16; // 1rem = 16px browser default

  // calc(var(--font-base) * N) pattern
  const calcMatch = value.match(/calc\(\s*var\(--font-base\)\s*\*\s*([\d.]+)\s*\)/);
  if (calcMatch) return Math.round(fontBase * parseFloat(calcMatch[1]) * 100) / 100;

  // var(--font-base) direct reference
  if (value.trim() === 'var(--font-base)') return fontBase;

  return 0;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const projectRoot = resolve(import.meta.dirname ?? __dirname, '..');
  const cssPath = resolve(projectRoot, 'src/app/globals.css');
  const css = readFileSync(cssPath, 'utf-8');
  const vars = parseRootVariables(css);

  // Determine font-base for calc evaluation
  const fontBaseRaw = vars.get('font-base') ?? '16px';
  const fontBase = parseFloat(fontBaseRaw); // 16

  const colorVars: FigmaVariable[] = [];
  const spacingVars: FigmaVariable[] = [];
  const typographyVars: FigmaVariable[] = [];

  for (const [name, value] of vars) {
    if (COLOR_TOKENS.has(name)) {
      const hsl = parseHsl(value);
      if (!hsl) continue;
      const hex = hslToHex(hsl.h, hsl.s, hsl.l);
      colorVars.push({
        name: getFigmaName(name),
        type: 'COLOR',
        description: getDescription(name),
        values: {
          Light: { hex, hsl: value },
        },
      });
    } else if (SPACING_TOKENS.has(name)) {
      const px = toPx(value, fontBase);
      spacingVars.push({
        name: getFigmaName(name),
        type: 'FLOAT',
        description: getDescription(name),
        values: {
          Light: { value: px, unit: 'px' },
        },
      });
    } else if (TYPOGRAPHY_TOKENS.has(name)) {
      const px = toPx(value, fontBase);
      typographyVars.push({
        name: getFigmaName(name),
        type: 'FLOAT',
        description: getDescription(name),
        values: {
          Light: { value: px, unit: 'px' },
        },
      });
    }
  }

  const output = {
    metadata: {
      source: 'AK12-MVP-v2',
      generated: new Date().toISOString(),
      sourceFiles: ['src/app/globals.css', 'src/lib/design-tokens.ts'],
    },
    collections: [
      {
        name: 'AK12 Semantic Tokens',
        modes: ['Light'],
        variables: [...colorVars, ...spacingVars, ...typographyVars],
      },
    ],
  };

  const json = JSON.stringify(output, null, 2);

  // Output locations
  const outputs = [
    resolve(projectRoot, 'tokens-export.json'),
    resolve(projectRoot, 'public/dev/tokens-export.json'),
    '/Users/dorenberge/WorkInProgress/UI-Projects-Vault/Projects/AK12-MVP-v2/Design-System/Figma-Exports/ak12-design-tokens.json',
  ];

  for (const outPath of outputs) {
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, json, 'utf-8');
    console.log(`  Written: ${outPath}`);
  }

  // Summary
  console.log('\nToken export complete:');
  console.log(`  Color variables:      ${colorVars.length}`);
  console.log(`  Spacing variables:    ${spacingVars.length}`);
  console.log(`  Typography variables: ${typographyVars.length}`);
  console.log(`  Total:                ${colorVars.length + spacingVars.length + typographyVars.length}`);
}

main();
