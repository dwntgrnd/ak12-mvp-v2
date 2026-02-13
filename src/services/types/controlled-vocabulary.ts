// Controlled vocabulary types

// Grade range as integer struct: Pre-K=0, K=1, Grade 1=2, ... Grade 12=13
// Display label mapping is a frontend concern.
export interface GradeRange {
  gradeFrom: number;   // 0–13 inclusive
  gradeTo: number;     // 0–13 inclusive, must be >= gradeFrom
}

// Grade integer mapping:
// 0=Pre-K, 1=K, 2=Grade 1, 3=Grade 2, 4=Grade 3, 5=Grade 4,
// 6=Grade 5, 7=Grade 6, 8=Grade 7, 9=Grade 8, 10=Grade 9,
// 11=Grade 10, 12=Grade 11, 13=Grade 12

// SubjectArea is a string validated against a configurable allowed-values list
// maintained by the backend. Frontend fetches allowed values via
// ConfigService.getControlledVocabulary('subjectArea').
export type SubjectArea = string;

export const EXCLUSION_CATEGORIES = [
  'already_customer',
  'not_a_fit',
  'budget_timing',
  'other'
] as const;

export type ExclusionCategory = typeof EXCLUSION_CATEGORIES[number];
