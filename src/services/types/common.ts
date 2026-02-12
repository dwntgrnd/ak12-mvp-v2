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

export type FitCategory = 'strong' | 'moderate' | 'low';

export interface FitAssessment {
  fitCategory: FitCategory;
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
