// Pure types + preset configs for list management (no React)

/* ------------------------------------------------------------------ */
/*  Core types                                                         */
/* ------------------------------------------------------------------ */

export interface ActiveSort {
  key: string;
  direction: 'asc' | 'desc';
}

export interface ColumnDefinition {
  key: string;
  label: string;
  minWidth: string; // Tailwind min-w class, e.g. 'min-w-[72px]'
  sortable: boolean;
}

export interface SheetFilterDefinition {
  id: string;
  label: string;
  type: 'multi-checkbox' | 'bracket-select';
  options: Array<{ value: string; label: string }>;
}

export interface ListContextConfig {
  columns: ColumnDefinition[];
  availableFilters: SheetFilterDefinition[];
  showLocalFilter: boolean;
  showColumnHeaders: boolean;
  searchPlaceholder: string;
}

/* ------------------------------------------------------------------ */
/*  Shared metric min-widths (header + card strip alignment)           */
/* ------------------------------------------------------------------ */

export const METRIC_MIN_WIDTHS = [
  'min-w-[80px]', // Enrollment
  'min-w-[56px]', // FRPM
  'min-w-[56px]', // ELL
  'min-w-[64px]', // Academic (ELA/Math)
] as const;

/** Fixed metric column widths — used by both ColumnHeaderBar and DistrictListCard */
export const METRIC_COL_WIDTHS = [
  'w-[88px]',   // Enrollment (needs room for "63,518")
  'w-[64px]',   // FRPM
  'w-[56px]',   // ELL
  'w-[80px]',   // Academic (ELA/Math Prof.)
] as const;

/* ------------------------------------------------------------------ */
/*  Filter option presets                                              */
/* ------------------------------------------------------------------ */

const GRADE_BAND_FILTER: SheetFilterDefinition = {
  id: 'gradeBand',
  label: 'Grade Band',
  type: 'multi-checkbox',
  options: [
    { value: 'elementary', label: 'Elementary (K\u20136)' },
    { value: 'middle', label: 'Middle (6\u20138)' },
    { value: 'high', label: 'High School (9\u201312)' },
    { value: 'unified', label: 'Unified (K\u201312)' },
  ],
};

const DISTRICT_TYPE_FILTER: SheetFilterDefinition = {
  id: 'districtType',
  label: 'District Type',
  type: 'multi-checkbox',
  options: [
    { value: 'Unified', label: 'Unified' },
    { value: 'Elementary', label: 'Elementary' },
    { value: 'High School', label: 'High School' },
  ],
};

const ENROLLMENT_RANGE_FILTER: SheetFilterDefinition = {
  id: 'enrollmentRange',
  label: 'Enrollment Range',
  type: 'bracket-select',
  options: [
    { value: '0-1000', label: 'Under 1,000' },
    { value: '1000-5000', label: '1,000\u20135,000' },
    { value: '5000-20000', label: '5,000\u201320,000' },
    { value: '20000-50000', label: '20,000\u201350,000' },
    { value: '50000+', label: '50,000+' },
  ],
};

const SHARED_FILTERS: SheetFilterDefinition[] = [
  GRADE_BAND_FILTER,
  DISTRICT_TYPE_FILTER,
  ENROLLMENT_RANGE_FILTER,
];

/* ------------------------------------------------------------------ */
/*  Column definitions                                                 */
/* ------------------------------------------------------------------ */

const SHARED_METRIC_COLUMNS: ColumnDefinition[] = [
  { key: 'enrollment', label: 'Enrollment', minWidth: METRIC_MIN_WIDTHS[0], sortable: true },
  { key: 'frpm', label: 'FRPM', minWidth: METRIC_MIN_WIDTHS[1], sortable: true },
  { key: 'ell', label: 'ELL', minWidth: METRIC_MIN_WIDTHS[2], sortable: true },
  { key: 'academic', label: 'ELA Prof.', minWidth: METRIC_MIN_WIDTHS[3], sortable: true },
];

/* ------------------------------------------------------------------ */
/*  Preset configs                                                     */
/* ------------------------------------------------------------------ */

export const RANKED_LIST_CONFIG: ListContextConfig = {
  columns: [
    { key: 'rank', label: '#', minWidth: 'min-w-[32px]', sortable: false },
    { key: 'name', label: 'District', minWidth: 'min-w-0', sortable: true },
    ...SHARED_METRIC_COLUMNS,
  ],
  availableFilters: SHARED_FILTERS,
  showLocalFilter: false,
  showColumnHeaders: true,
  searchPlaceholder: '',
};

export const CARD_SET_CONFIG: ListContextConfig = {
  columns: [
    { key: 'name', label: 'District', minWidth: 'min-w-0', sortable: true },
    ...SHARED_METRIC_COLUMNS,
  ],
  availableFilters: SHARED_FILTERS,
  showLocalFilter: false,
  showColumnHeaders: true,
  searchPlaceholder: '',
};

/* ------------------------------------------------------------------ */
/*  Alignment filter / column (product lens active)                    */
/* ------------------------------------------------------------------ */

const ALIGNMENT_LEVEL_FILTER: SheetFilterDefinition = {
  id: 'alignmentLevel',
  label: 'Alignment Level',
  type: 'multi-checkbox',
  options: [
    { value: 'strong', label: 'Strong' },
    { value: 'moderate', label: 'Moderate' },
    { value: 'limited', label: 'Limited' },
  ],
};

const ALIGNMENT_COLUMN: ColumnDefinition = {
  key: 'alignment',
  label: 'Alignment',
  minWidth: 'min-w-[72px]',
  sortable: true,
};

/* ------------------------------------------------------------------ */
/*  Dynamic config builder                                             */
/* ------------------------------------------------------------------ */

export function buildListContextConfig(
  base: ListContextConfig,
  options: { hasProducts: boolean; productLensActive: boolean; academicLabel?: string },
): ListContextConfig {
  let columns = base.columns;

  // Override academic label if provided
  if (options.academicLabel) {
    columns = columns.map((col) =>
      col.key === 'academic' ? { ...col, label: options.academicLabel! } : col,
    );
  }

  if (!options.hasProducts || !options.productLensActive) {
    return columns !== base.columns ? { ...base, columns } : base;
  }

  return {
    ...base,
    columns: [...columns, ALIGNMENT_COLUMN],
    availableFilters: [...base.availableFilters, ALIGNMENT_LEVEL_FILTER],
  };
}
