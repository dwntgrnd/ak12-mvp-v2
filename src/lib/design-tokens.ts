// Brand primitive palette
export const brandColors = {
  white: '#FFFFFF',
  black: '#000000',
  brand: {
    wht: '#F4F5F5',
    blk: '#172642',
    blue: '#03C4D4',
    green: '#00DE9C',
    gold: '#FFC205',
    orange: '#F08632',
    midBlue: '#2990C5',
    deepBlue: '#1E698F',
    red: '#FA2E57',
  },
  slate: {
    50: '#F8FAFC',
    100: '#F1F5F9',
    200: '#E2E8F0',
    300: '#CBD5E1',
    400: '#94A3B8',
    500: '#64748B',
    600: '#475569',
    700: '#334155',
    800: '#1E293B',
    900: '#0F172A',
    950: '#020617',
  },
} as const;

// Match tier semantic colors (Spec 16)
export const matchTierColors = {
  strong: {
    bg: 'bg-success/10',
    text: 'text-success',
    border: 'border-success',
    label: 'Strong Fit',
  },
  moderate: {
    bg: 'bg-warning/10',
    text: 'text-warning',
    border: 'border-warning',
    label: 'Moderate Fit',
  },
  limited: {
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    border: 'border-destructive',
    label: 'Limited Fit',
  },
} as const;

export type MatchTierKey = keyof typeof matchTierColors;

/** @deprecated Use matchTierColors instead */
export const fitCategoryColors = {
  strong: matchTierColors.strong,
  moderate: matchTierColors.moderate,
  low: matchTierColors.limited,
} as const;

/** @deprecated Use MatchTierKey instead */
export type FitCategoryKey = keyof typeof fitCategoryColors;

// Mode bar visual treatments
export const modeColors = {
  neutral: {
    bg: '',
    border: 'border-border-default',
    text: 'text-foreground',
    label: 'District Intelligence',
  },
  lens: {
    bg: 'bg-[#03C4D4]/5',
    border: 'border-[#03C4D4]/40',
    text: 'text-[#1E698F]',
    label: 'Lens',
  },
  playbook: {
    bg: 'bg-[#00DE9C]/5',
    border: 'border-[#00DE9C]/40',
    text: 'text-[#0A7A5A]',
    label: 'Playbook',
  },
  preview: {
    bg: 'bg-[#FFC205]/5',
    border: 'border-[#FFC205]/50',
    text: 'text-[#92710A]',
    label: 'Preview',
  },
} as const;

export type ModeKey = keyof typeof modeColors;

// Elevation shadow scale
export const shadowTokens = {
  sm: 'shadow-sm',   // subtle lift — cards, context panels
  md: 'shadow-md',   // moderate elevation — modals, sheets, dropdowns
  lg: 'shadow-lg',   // high elevation — overlays, popovers
} as const;
