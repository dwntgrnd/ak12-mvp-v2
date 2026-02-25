/**
 * Token registry — definitions for all CSS custom properties in globals.css.
 */

export type TokenType = 'hsl-color' | 'length' | 'shadow' | 'font-size';

export interface TokenDefinition {
  cssVar: string;
  label: string;
  group: string;
  type: TokenType;
}

export const TOKEN_GROUPS = [
  'Brand Colors',
  'Semantic Colors',
  'Surfaces',
  'Text Colors',
  'Borders',
  'Navigation',
  'Modular Type Scale',
  'Typography Scale',
  'Spacing & Layout',
  'Shadows',
] as const;

export type TokenGroup = (typeof TOKEN_GROUPS)[number];

export const TOKEN_REGISTRY: TokenDefinition[] = [
  // Brand Colors
  { cssVar: '--brand-orange', label: 'Brand Orange', group: 'Brand Colors', type: 'hsl-color' },
  { cssVar: '--brand-blue', label: 'Brand Blue', group: 'Brand Colors', type: 'hsl-color' },
  { cssVar: '--brand-green', label: 'Brand Green', group: 'Brand Colors', type: 'hsl-color' },
  { cssVar: '--district-link', label: 'District Link', group: 'Brand Colors', type: 'hsl-color' },

  // Semantic Colors
  { cssVar: '--background', label: 'Background', group: 'Semantic Colors', type: 'hsl-color' },
  { cssVar: '--foreground', label: 'Foreground', group: 'Semantic Colors', type: 'hsl-color' },
  { cssVar: '--primary', label: 'Primary', group: 'Semantic Colors', type: 'hsl-color' },
  { cssVar: '--primary-foreground', label: 'Primary Foreground', group: 'Semantic Colors', type: 'hsl-color' },
  { cssVar: '--secondary', label: 'Secondary', group: 'Semantic Colors', type: 'hsl-color' },
  { cssVar: '--secondary-foreground', label: 'Secondary Foreground', group: 'Semantic Colors', type: 'hsl-color' },
  { cssVar: '--muted', label: 'Muted', group: 'Semantic Colors', type: 'hsl-color' },
  { cssVar: '--muted-foreground', label: 'Muted Foreground', group: 'Semantic Colors', type: 'hsl-color' },
  { cssVar: '--accent', label: 'Accent', group: 'Semantic Colors', type: 'hsl-color' },
  { cssVar: '--accent-foreground', label: 'Accent Foreground', group: 'Semantic Colors', type: 'hsl-color' },
  { cssVar: '--destructive', label: 'Destructive', group: 'Semantic Colors', type: 'hsl-color' },
  { cssVar: '--destructive-foreground', label: 'Destructive FG', group: 'Semantic Colors', type: 'hsl-color' },
  { cssVar: '--success', label: 'Success', group: 'Semantic Colors', type: 'hsl-color' },
  { cssVar: '--success-foreground', label: 'Success FG', group: 'Semantic Colors', type: 'hsl-color' },
  { cssVar: '--warning', label: 'Warning', group: 'Semantic Colors', type: 'hsl-color' },
  { cssVar: '--warning-foreground', label: 'Warning FG', group: 'Semantic Colors', type: 'hsl-color' },
  { cssVar: '--card', label: 'Card', group: 'Semantic Colors', type: 'hsl-color' },
  { cssVar: '--card-foreground', label: 'Card Foreground', group: 'Semantic Colors', type: 'hsl-color' },
  { cssVar: '--popover', label: 'Popover', group: 'Semantic Colors', type: 'hsl-color' },
  { cssVar: '--popover-foreground', label: 'Popover Foreground', group: 'Semantic Colors', type: 'hsl-color' },
  { cssVar: '--ring', label: 'Ring', group: 'Semantic Colors', type: 'hsl-color' },
  { cssVar: '--input', label: 'Input', group: 'Semantic Colors', type: 'hsl-color' },

  // Surfaces
  { cssVar: '--surface-page', label: 'Surface Page', group: 'Surfaces', type: 'hsl-color' },
  { cssVar: '--surface-raised', label: 'Surface Raised', group: 'Surfaces', type: 'hsl-color' },
  { cssVar: '--surface-inset', label: 'Surface Inset', group: 'Surfaces', type: 'hsl-color' },
  { cssVar: '--surface-emphasis', label: 'Surface Emphasis', group: 'Surfaces', type: 'hsl-color' },
  { cssVar: '--surface-emphasis-neutral', label: 'Surface Emphasis Neutral', group: 'Surfaces', type: 'hsl-color' },
  { cssVar: '--emphasis-surface', label: 'Emphasis Surface', group: 'Surfaces', type: 'hsl-color' },
  { cssVar: '--emphasis-surface-neutral', label: 'Emphasis Surface Neutral', group: 'Surfaces', type: 'hsl-color' },

  // Text Colors
  { cssVar: '--foreground-secondary', label: 'Foreground Secondary', group: 'Text Colors', type: 'hsl-color' },
  { cssVar: '--foreground-tertiary', label: 'Foreground Tertiary', group: 'Text Colors', type: 'hsl-color' },

  // Borders
  { cssVar: '--border', label: 'Border', group: 'Borders', type: 'hsl-color' },
  { cssVar: '--border-default', label: 'Border Default', group: 'Borders', type: 'hsl-color' },
  { cssVar: '--border-subtle', label: 'Border Subtle', group: 'Borders', type: 'hsl-color' },

  // Navigation
  { cssVar: '--sidebar-bg', label: 'Sidebar BG', group: 'Navigation', type: 'hsl-color' },
  { cssVar: '--topbar-bg', label: 'Topbar BG', group: 'Navigation', type: 'hsl-color' },
  { cssVar: '--sidebar-fg', label: 'Sidebar FG', group: 'Navigation', type: 'hsl-color' },
  { cssVar: '--sidebar-hover', label: 'Sidebar Hover', group: 'Navigation', type: 'hsl-color' },
  { cssVar: '--sidebar-active', label: 'Sidebar Active', group: 'Navigation', type: 'hsl-color' },

  // Modular Type Scale
  { cssVar: '--font-base', label: 'Font Base', group: 'Modular Type Scale', type: 'font-size' },
  { cssVar: '--font-size-overline', label: 'Overline', group: 'Modular Type Scale', type: 'font-size' },
  { cssVar: '--font-size-caption', label: 'Caption', group: 'Modular Type Scale', type: 'font-size' },
  { cssVar: '--font-size-subsection-sm', label: 'Subsection Sm', group: 'Modular Type Scale', type: 'font-size' },
  { cssVar: '--font-size-body', label: 'Body', group: 'Modular Type Scale', type: 'font-size' },
  { cssVar: '--font-size-subsection-heading', label: 'Subsection Heading', group: 'Modular Type Scale', type: 'font-size' },
  { cssVar: '--font-size-section-heading', label: 'Section Heading', group: 'Modular Type Scale', type: 'font-size' },
  { cssVar: '--font-size-page-title', label: 'Page Title', group: 'Modular Type Scale', type: 'font-size' },

  { cssVar: '--radius', label: 'Border Radius', group: 'Spacing & Layout', type: 'length' },

  // Spacing & Layout
  { cssVar: '--topbar-height', label: 'Topbar Height', group: 'Spacing & Layout', type: 'length' },
  { cssVar: '--content-max-width', label: 'Content Max Width', group: 'Spacing & Layout', type: 'length' },

  // Shadows
  { cssVar: '--shadow-sm', label: 'Shadow SM', group: 'Shadows', type: 'shadow' },
  { cssVar: '--shadow-md', label: 'Shadow MD', group: 'Shadows', type: 'shadow' },
  { cssVar: '--shadow-lg', label: 'Shadow LG', group: 'Shadows', type: 'shadow' },
];

/** Get tokens grouped by their group name */
export function getTokensByGroup(): Map<string, TokenDefinition[]> {
  const map = new Map<string, TokenDefinition[]>();
  for (const group of TOKEN_GROUPS) {
    const tokens = TOKEN_REGISTRY.filter((t) => t.group === group);
    if (tokens.length > 0) {
      map.set(group, tokens);
    }
  }
  return map;
}
