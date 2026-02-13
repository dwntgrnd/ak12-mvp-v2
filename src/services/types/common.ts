// Cross-cutting types shared across all services

export interface PaginatedRequest {
  page?: number;        // 1-indexed, defaults to 1
  pageSize?: number;    // defaults to 25
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface ServiceError {
  code: string;           // machine-readable
  message: string;        // human-readable
  field?: string;         // for validation errors
  retryable: boolean;
}

// Fit score: integer 0–10. Frontend maps to display labels:
// 0–3 = low, 4–6 = moderate, 7–10 = strong
// Label thresholds are a frontend concern and can be adjusted without API changes.
export interface FitAssessment {
  fitScore: number;          // 0–10 integer
  fitRationale: string;
}

export type ContentSource = 'verbatim' | 'constrained' | 'synthesis' | 'hybrid';
export type SectionStatus = 'pending' | 'generating' | 'complete' | 'error';

export type UserRole = 'super-admin' | 'publisher-admin' | 'publisher-rep';

export interface ServiceContext {
  userId: string;
  tenantId: string;
  userRole: UserRole;
  organizationName: string;
}
