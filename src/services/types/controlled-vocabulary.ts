// Controlled vocabulary types with const arrays and derived types

export const GRADE_RANGES = [
  'Pre-K',
  'K-2',
  '3-5',
  '6-8',
  '9-12',
  'K-5',
  'K-8',
  '6-12',
  'K-12'
] as const;

export type GradeRange = typeof GRADE_RANGES[number];

export const SUBJECT_AREAS = [
  'Math',
  'ELA',
  'Science',
  'Social Studies',
  'STEM',
  'SEL',
  'Intervention',
  'Assessment',
  'Professional Development'
] as const;

export type SubjectArea = typeof SUBJECT_AREAS[number];

export const EXCLUSION_CATEGORIES = [
  'already_customer',
  'not_a_fit',
  'budget_timing',
  'other'
] as const;

export type ExclusionCategory = typeof EXCLUSION_CATEGORIES[number];
