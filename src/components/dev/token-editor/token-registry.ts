/**
 * Token registry — definitions for all CSS custom properties.
 * Static overrides + runtime auto-detection merge.
 */

import type { AutoDetectedToken } from './auto-detect';

export type TokenType = 'hsl-color' | 'length' | 'shadow' | 'font-size' | 'other';

export interface TokenDefinition {
  cssVar: string;
  label: string;
  group: string;
  type: TokenType;
  defaultValue: string;
  hint?: string;
  usedBy?: string[];
  managedByScale?: boolean;
  autoDetected?: boolean;
}

export interface TokenOverride {
  label?: string;
  group?: string;
  type?: TokenType;
  hint?: string;
  usedBy?: string[];
  hidden?: boolean;
  managedByScale?: boolean;
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

/**
 * Manual overrides for auto-detected tokens.
 * Used for human-friendly labels, usage hints, visibility control, and scale management.
 */
export const TOKEN_OVERRIDES: Record<string, TokenOverride> = {
  // Brand Colors
  '--brand-orange': {
    label: 'Brand Orange',
    group: 'Brand Colors',
    usedBy: ['bg-brand-orange', 'text-brand-orange', 'Button default variant'],
  },
  '--brand-blue': { label: 'Brand Blue', group: 'Brand Colors' },
  '--brand-green': { label: 'Brand Green', group: 'Brand Colors' },
  '--district-link': { label: 'District Link', group: 'Brand Colors' },

  // Semantic Colors
  '--background': { label: 'Background', group: 'Semantic Colors' },
  '--foreground': {
    label: 'Foreground',
    group: 'Semantic Colors',
    usedBy: ['text-foreground'],
  },
  '--primary': {
    label: 'Primary',
    group: 'Semantic Colors',
    usedBy: ['text-primary', 'bg-primary'],
  },
  '--primary-foreground': { label: 'Primary Foreground', group: 'Semantic Colors' },
  '--secondary': { label: 'Secondary', group: 'Semantic Colors' },
  '--secondary-foreground': { label: 'Secondary Foreground', group: 'Semantic Colors' },
  '--muted': { label: 'Muted', group: 'Semantic Colors' },
  '--muted-foreground': { label: 'Muted Foreground', group: 'Semantic Colors' },
  '--accent': { label: 'Accent', group: 'Semantic Colors' },
  '--accent-foreground': { label: 'Accent Foreground', group: 'Semantic Colors' },
  '--destructive': {
    label: 'Destructive',
    group: 'Semantic Colors',
    usedBy: ['text-destructive', 'bg-destructive'],
  },
  '--destructive-foreground': { label: 'Destructive FG', group: 'Semantic Colors' },
  '--success': {
    label: 'Success',
    group: 'Semantic Colors',
    usedBy: ['text-success', 'bg-success'],
  },
  '--success-foreground': { label: 'Success FG', group: 'Semantic Colors' },
  '--warning': {
    label: 'Warning',
    group: 'Semantic Colors',
    usedBy: ['text-warning', 'bg-warning'],
  },
  '--warning-foreground': { label: 'Warning FG', group: 'Semantic Colors' },
  '--card': { label: 'Card', group: 'Semantic Colors' },
  '--card-foreground': { label: 'Card Foreground', group: 'Semantic Colors' },
  '--popover': { label: 'Popover', group: 'Semantic Colors' },
  '--popover-foreground': { label: 'Popover Foreground', group: 'Semantic Colors' },
  '--ring': { label: 'Ring', group: 'Semantic Colors' },
  '--input': { label: 'Input', group: 'Semantic Colors' },

  // Surfaces
  '--surface-page': {
    label: 'Surface Page',
    group: 'Surfaces',
    usedBy: ['bg-surface-page'],
  },
  '--surface-raised': {
    label: 'Surface Raised',
    group: 'Surfaces',
    usedBy: ['bg-surface-raised'],
  },
  '--surface-inset': {
    label: 'Surface Inset',
    group: 'Surfaces',
    usedBy: ['bg-surface-inset'],
  },
  '--surface-emphasis': {
    label: 'Surface Emphasis',
    group: 'Surfaces',
    usedBy: ['bg-surface-emphasis'],
  },
  '--surface-emphasis-neutral': {
    label: 'Surface Emphasis Neutral',
    group: 'Surfaces',
    usedBy: ['bg-surface-emphasis-neutral'],
  },
  '--emphasis-surface': { label: 'Emphasis Surface', group: 'Surfaces' },
  '--emphasis-surface-neutral': { label: 'Emphasis Surface Neutral', group: 'Surfaces' },

  // Text Colors
  '--foreground-secondary': {
    label: 'Foreground Secondary',
    group: 'Text Colors',
    usedBy: ['text-foreground-secondary'],
  },
  '--foreground-tertiary': {
    label: 'Foreground Tertiary',
    group: 'Text Colors',
    usedBy: ['text-foreground-tertiary'],
  },

  // Borders
  '--border': { label: 'Border', group: 'Borders' },
  '--border-default': {
    label: 'Border Default',
    group: 'Borders',
    usedBy: ['border-border-default'],
  },
  '--border-subtle': {
    label: 'Border Subtle',
    group: 'Borders',
    usedBy: ['border-border-subtle'],
  },

  // Navigation
  '--sidebar-bg': { label: 'Sidebar BG', group: 'Navigation' },
  '--topbar-bg': { label: 'Topbar BG', group: 'Navigation' },
  '--sidebar-fg': { label: 'Sidebar FG', group: 'Navigation' },
  '--sidebar-hover': { label: 'Sidebar Hover', group: 'Navigation' },
  '--sidebar-active': { label: 'Sidebar Active', group: 'Navigation' },

  // Modular Type Scale — managed by ModularScaleControl
  '--font-base': {
    label: 'Font Base',
    group: 'Modular Type Scale',
    managedByScale: true,
  },
  '--font-size-overline': {
    label: 'Overline',
    group: 'Modular Type Scale',
    managedByScale: true,
  },
  '--font-size-caption': {
    label: 'Caption',
    group: 'Modular Type Scale',
    managedByScale: true,
  },
  '--font-size-subsection-sm': {
    label: 'Subsection Sm',
    group: 'Modular Type Scale',
    managedByScale: true,
  },
  '--font-size-body': {
    label: 'Body',
    group: 'Modular Type Scale',
    managedByScale: true,
  },
  '--font-size-subsection-heading': {
    label: 'Subsection Heading',
    group: 'Modular Type Scale',
    managedByScale: true,
  },
  '--font-size-section-heading': {
    label: 'Section Heading',
    group: 'Modular Type Scale',
    managedByScale: true,
  },
  '--font-size-page-title': {
    label: 'Page Title',
    group: 'Modular Type Scale',
    managedByScale: true,
  },

  // Spacing & Layout
  '--radius': { label: 'Border Radius', group: 'Spacing & Layout' },
  '--topbar-height': { label: 'Topbar Height', group: 'Spacing & Layout' },
  '--content-max-width': { label: 'Content Max Width', group: 'Spacing & Layout' },

  // Hidden / deprecated
  '--content-width': { hidden: true },

  // Shadows
  '--shadow-sm': { label: 'Shadow SM', group: 'Shadows' },
  '--shadow-md': { label: 'Shadow MD', group: 'Shadows' },
  '--shadow-lg': { label: 'Shadow LG', group: 'Shadows' },
};

/**
 * Merge auto-detected tokens with manual overrides to produce the final registry.
 */
export function buildRegistry(
  detected: Map<string, AutoDetectedToken>
): TokenDefinition[] {
  const registry: TokenDefinition[] = [];

  for (const [cssVar, auto] of detected) {
    const override = TOKEN_OVERRIDES[cssVar];

    // Skip hidden tokens
    if (override?.hidden) continue;

    registry.push({
      cssVar,
      label: override?.label ?? auto.label,
      group: override?.group ?? auto.group,
      type: override?.type ?? auto.type,
      defaultValue: auto.value,
      hint: override?.hint,
      usedBy: override?.usedBy,
      managedByScale: override?.managedByScale,
      autoDetected: !override,
    });
  }

  return registry;
}

/** Get tokens grouped by their group name, with known groups ordered first. */
export function getTokensByGroup(
  registry: TokenDefinition[]
): Map<string, TokenDefinition[]> {
  const map = new Map<string, TokenDefinition[]>();

  // Known groups first, in order
  for (const group of TOKEN_GROUPS) {
    const tokens = registry.filter((t) => t.group === group);
    if (tokens.length > 0) {
      map.set(group, tokens);
    }
  }

  // Unknown groups sorted alphabetically after
  const knownSet = new Set<string>(TOKEN_GROUPS);
  const unknownGroups = new Set<string>();
  for (const t of registry) {
    if (!knownSet.has(t.group)) {
      unknownGroups.add(t.group);
    }
  }
  for (const group of Array.from(unknownGroups).sort()) {
    const tokens = registry.filter((t) => t.group === group);
    if (tokens.length > 0) {
      map.set(group, tokens);
    }
  }

  return map;
}
