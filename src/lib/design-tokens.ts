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

// Fit category semantic colors
export const fitCategoryColors = {
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
  low: {
    bg: 'bg-destructive/10',
    text: 'text-destructive',
    border: 'border-destructive',
    label: 'Low Fit',
  },
} as const;

export type FitCategoryKey = keyof typeof fitCategoryColors;
