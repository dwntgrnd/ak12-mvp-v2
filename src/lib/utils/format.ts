// Grade integer mapping: 0=Pre-K, 1=K, 2=Grade 1, 3=Grade 2, ... 13=Grade 12

const GRADE_LABELS: Record<number, string> = {
  0: 'Pre-K',
  1: 'K',
  2: 'Grade 1',
  3: 'Grade 2',
  4: 'Grade 3',
  5: 'Grade 4',
  6: 'Grade 5',
  7: 'Grade 6',
  8: 'Grade 7',
  9: 'Grade 8',
  10: 'Grade 9',
  11: 'Grade 10',
  12: 'Grade 11',
  13: 'Grade 12',
};

export function formatGradeLabel(grade: number): string {
  return GRADE_LABELS[grade] ?? `Grade ${grade}`;
}

export function formatGradeRange(from: number, to: number): string {
  if (from === to) return formatGradeLabel(from);
  return `${formatGradeLabel(from)}\u2013${formatGradeLabel(to)}`;
}

const numberFormatter = new Intl.NumberFormat('en-US');

export function formatNumber(value: number): string {
  return numberFormatter.format(value);
}
