import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';

// ---------------------------------------------------------------------------
// CSS Variable → Figma Group/Name Mapping (DTCG nested objects)
//
// | CSS Variable                    | Figma Group/Name              |
// |---------------------------------|-------------------------------|
// | --background                    | semantic/background           |
// | --foreground                    | semantic/foreground           |
// | --card                          | semantic/card                 |
// | --card-foreground               | semantic/cardForeground       |
// | --popover                       | semantic/popover              |
// | --popover-foreground            | semantic/popoverForeground    |
// | --primary                       | semantic/primary              |
// | --primary-foreground            | semantic/primaryForeground    |
// | --secondary                     | semantic/secondary            |
// | --secondary-foreground          | semantic/secondaryForeground  |
// | --muted                         | semantic/muted                |
// | --muted-foreground              | semantic/mutedForeground      |
// | --accent                        | semantic/accent               |
// | --accent-foreground             | semantic/accentForeground     |
// | --destructive                   | semantic/destructive          |
// | --destructive-foreground        | semantic/destructiveForeground|
// | --success                       | semantic/success              |
// | --success-foreground            | semantic/successForeground    |
// | --warning                       | semantic/warning              |
// | --warning-foreground            | semantic/warningForeground    |
// | --border                        | semantic/border               |
// | --input                         | semantic/input                |
// | --ring                          | semantic/ring                 |
// | --brand-orange                  | brand/orange                  |
// | --district-link                 | brand/districtLink            |
// | --sidebar-bg                    | sidebar/bg                    |
// | --topbar-bg                     | sidebar/topbarBg              |
// | --sidebar-fg                    | sidebar/fg                    |
// | --sidebar-hover                 | sidebar/hover                 |
// | --sidebar-active                | sidebar/active                |
// | --surface-page                  | surface/page                  |
// | --surface-raised                | surface/raised                |
// | --surface-inset                 | surface/inset                 |
// | --surface-emphasis              | surface/emphasis              |
// | --surface-emphasis-neutral      | surface/emphasisNeutral       |
// | --foreground-secondary          | text/secondary                |
// | --foreground-tertiary           | text/tertiary                 |
// | --emphasis-surface              | emphasis/surface              |
// | --emphasis-surface-neutral      | emphasis/surfaceNeutral       |
// | --border-default                | borderTier/default            |
// | --border-subtle                 | borderTier/subtle             |
// | --topbar-height                 | spacing/topbarHeight          |
// | --utility-bar-height            | spacing/utilityBarHeight      |
// | --sidebar-width                 | spacing/sidebarWidth          |
// | --sidebar-width-collapsed       | spacing/sidebarWidthCollapsed |
// | --content-width                 | spacing/contentWidth          |
// | --radius                        | spacing/radius                |
// | --font-base                     | typography/fontBase           |
// | --font-size-page-title          | typography/sizePageTitle      |
// | --font-size-section-heading     | typography/sizeSectionHeading |
// | --font-size-subsection-heading  | typography/sizeSubsectionHeading |
// | --font-size-body                | typography/sizeBody           |
// | --font-size-subsection-sm       | typography/sizeSubsectionSm   |
// | --font-size-caption             | typography/sizeCaption        |
// | --font-size-overline            | typography/sizeOverline       |
// ---------------------------------------------------------------------------

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
  const match = value.trim().match(/^([\d.]+)\s+([\d.]+)%\s+([\d.]+)%$/);
  if (!match) return null;
  return { h: parseFloat(match[1]), s: parseFloat(match[2]), l: parseFloat(match[3]) };
}

// ---------------------------------------------------------------------------
// Parse :root block from globals.css
// ---------------------------------------------------------------------------

function parseRootVariables(css: string): Map<string, string> {
  const vars = new Map<string, string>();
  const rootMatch = css.match(/:root\s*\{([\s\S]*?)\n\}/);
  if (!rootMatch) throw new Error('Could not find :root block in globals.css');

  const rootBlock = rootMatch[1];
  const lineRegex = /--([a-z0-9-]+)\s*:\s*(.+?)\s*;/g;
  let match: RegExpExecArray | null;
  while ((match = lineRegex.exec(rootBlock)) !== null) {
    vars.set(match[1], match[2]);
  }
  return vars;
}

// ---------------------------------------------------------------------------
// Value conversion
// ---------------------------------------------------------------------------

function toPx(value: string, fontBase: number): number {
  const pxMatch = value.match(/^([\d.]+)px$/);
  if (pxMatch) return parseFloat(pxMatch[1]);

  const remMatch = value.match(/^([\d.]+)rem$/);
  if (remMatch) return parseFloat(remMatch[1]) * 16;

  const calcMatch = value.match(/calc\(\s*var\(--font-base\)\s*\*\s*([\d.]+)\s*\)/);
  if (calcMatch) return Math.round(fontBase * parseFloat(calcMatch[1]));

  if (value.trim() === 'var(--font-base)') return fontBase;

  return 0;
}

// ---------------------------------------------------------------------------
// CSS variable → DTCG group/key mapping
// ---------------------------------------------------------------------------

type TokenMapping = { group: string; key: string; type: 'color' | 'number' };

const TOKEN_MAP: Record<string, TokenMapping> = {
  // semantic group — core shadcn tokens
  'background':              { group: 'semantic', key: 'background',            type: 'color' },
  'foreground':              { group: 'semantic', key: 'foreground',            type: 'color' },
  'card':                    { group: 'semantic', key: 'card',                  type: 'color' },
  'card-foreground':         { group: 'semantic', key: 'cardForeground',        type: 'color' },
  'popover':                 { group: 'semantic', key: 'popover',               type: 'color' },
  'popover-foreground':      { group: 'semantic', key: 'popoverForeground',     type: 'color' },
  'primary':                 { group: 'semantic', key: 'primary',               type: 'color' },
  'primary-foreground':      { group: 'semantic', key: 'primaryForeground',     type: 'color' },
  'secondary':               { group: 'semantic', key: 'secondary',             type: 'color' },
  'secondary-foreground':    { group: 'semantic', key: 'secondaryForeground',   type: 'color' },
  'muted':                   { group: 'semantic', key: 'muted',                 type: 'color' },
  'muted-foreground':        { group: 'semantic', key: 'mutedForeground',       type: 'color' },
  'accent':                  { group: 'semantic', key: 'accent',                type: 'color' },
  'accent-foreground':       { group: 'semantic', key: 'accentForeground',      type: 'color' },
  'destructive':             { group: 'semantic', key: 'destructive',           type: 'color' },
  'destructive-foreground':  { group: 'semantic', key: 'destructiveForeground', type: 'color' },
  'success':                 { group: 'semantic', key: 'success',               type: 'color' },
  'success-foreground':      { group: 'semantic', key: 'successForeground',     type: 'color' },
  'warning':                 { group: 'semantic', key: 'warning',               type: 'color' },
  'warning-foreground':      { group: 'semantic', key: 'warningForeground',     type: 'color' },
  'border':                  { group: 'semantic', key: 'border',                type: 'color' },
  'input':                   { group: 'semantic', key: 'input',                 type: 'color' },
  'ring':                    { group: 'semantic', key: 'ring',                  type: 'color' },

  // brand group
  'brand-orange':            { group: 'brand', key: 'orange',       type: 'color' },
  'district-link':           { group: 'brand', key: 'districtLink', type: 'color' },

  // sidebar group
  'sidebar-bg':              { group: 'sidebar', key: 'bg',       type: 'color' },
  'topbar-bg':               { group: 'sidebar', key: 'topbarBg', type: 'color' },
  'sidebar-fg':              { group: 'sidebar', key: 'fg',       type: 'color' },
  'sidebar-hover':           { group: 'sidebar', key: 'hover',    type: 'color' },
  'sidebar-active':          { group: 'sidebar', key: 'active',   type: 'color' },

  // surface group
  'surface-page':              { group: 'surface', key: 'page',            type: 'color' },
  'surface-raised':            { group: 'surface', key: 'raised',          type: 'color' },
  'surface-inset':             { group: 'surface', key: 'inset',           type: 'color' },
  'surface-emphasis':          { group: 'surface', key: 'emphasis',        type: 'color' },
  'surface-emphasis-neutral':  { group: 'surface', key: 'emphasisNeutral', type: 'color' },

  // text group
  'foreground-secondary':    { group: 'text', key: 'secondary', type: 'color' },
  'foreground-tertiary':     { group: 'text', key: 'tertiary',  type: 'color' },

  // emphasis group
  'emphasis-surface':         { group: 'emphasis', key: 'surface',        type: 'color' },
  'emphasis-surface-neutral': { group: 'emphasis', key: 'surfaceNeutral', type: 'color' },

  // borderTier group
  'border-default':          { group: 'borderTier', key: 'default', type: 'color' },
  'border-subtle':           { group: 'borderTier', key: 'subtle',  type: 'color' },

  // spacing group
  'topbar-height':             { group: 'spacing', key: 'topbarHeight',          type: 'number' },
  'utility-bar-height':        { group: 'spacing', key: 'utilityBarHeight',      type: 'number' },
  'sidebar-width':             { group: 'spacing', key: 'sidebarWidth',          type: 'number' },
  'sidebar-width-collapsed':   { group: 'spacing', key: 'sidebarWidthCollapsed', type: 'number' },
  'content-width':             { group: 'spacing', key: 'contentWidth',          type: 'number' },
  'radius':                    { group: 'spacing', key: 'radius',                type: 'number' },

  // typography group
  'font-base':                     { group: 'typography', key: 'fontBase',              type: 'number' },
  'font-size-page-title':          { group: 'typography', key: 'sizePageTitle',         type: 'number' },
  'font-size-section-heading':     { group: 'typography', key: 'sizeSectionHeading',    type: 'number' },
  'font-size-subsection-heading':  { group: 'typography', key: 'sizeSubsectionHeading', type: 'number' },
  'font-size-body':                { group: 'typography', key: 'sizeBody',              type: 'number' },
  'font-size-subsection-sm':       { group: 'typography', key: 'sizeSubsectionSm',      type: 'number' },
  'font-size-caption':             { group: 'typography', key: 'sizeCaption',           type: 'number' },
  'font-size-overline':            { group: 'typography', key: 'sizeOverline',          type: 'number' },
};

// Also add text/primary as an alias for foreground (spec: text.primary = foreground)
const TEXT_PRIMARY_ALIAS = 'foreground';

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main() {
  const projectRoot = resolve(import.meta.dirname ?? __dirname, '..');
  const cssPath = resolve(projectRoot, 'src/app/globals.css');
  const css = readFileSync(cssPath, 'utf-8');
  const vars = parseRootVariables(css);

  const fontBaseRaw = vars.get('font-base') ?? '16px';
  const fontBase = parseFloat(fontBaseRaw);

  // Build DTCG output — nested objects with $type and $value
  const output: Record<string, Record<string, { $type: string; $value: string | number }>> = {};
  let colorCount = 0;
  let spacingCount = 0;
  let typographyCount = 0;

  for (const [cssName, rawValue] of vars) {
    const mapping = TOKEN_MAP[cssName];
    if (!mapping) continue;

    if (!output[mapping.group]) output[mapping.group] = {};

    if (mapping.type === 'color') {
      const hsl = parseHsl(rawValue);
      if (!hsl) continue;
      const hex = hslToHex(hsl.h, hsl.s, hsl.l);
      output[mapping.group][mapping.key] = { $type: 'color', $value: hex };
      colorCount++;
    } else {
      const px = toPx(rawValue, fontBase);
      output[mapping.group][mapping.key] = { $type: 'number', $value: px };
      if (mapping.group === 'spacing') spacingCount++;
      else typographyCount++;
    }
  }

  // Add text/primary alias (= foreground value)
  const fgValue = vars.get(TEXT_PRIMARY_ALIAS);
  if (fgValue) {
    const hsl = parseHsl(fgValue);
    if (hsl) {
      if (!output['text']) output['text'] = {};
      output['text']['primary'] = { $type: 'color', $value: hslToHex(hsl.h, hsl.s, hsl.l) };
      colorCount++;
    }
  }

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

  const total = colorCount + spacingCount + typographyCount;
  console.log('\nToken export complete (DTCG format):');
  console.log(`  Color variables:      ${colorCount}`);
  console.log(`  Spacing variables:    ${spacingCount}`);
  console.log(`  Typography variables: ${typographyCount}`);
  console.log(`  Total:                ${total}`);
}

main();
