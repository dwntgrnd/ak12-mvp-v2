// Service registry - single import point for all types and interfaces

// Service interfaces
export type { IAuthService } from './interfaces/auth-service';
export type { ITenantService } from './interfaces/tenant-service';
export type { IUserService } from './interfaces/user-service';
export type { IProductService } from './interfaces/product-service';
export type { IDistrictService } from './interfaces/district-service';
export type { IPlaybookService } from './interfaces/playbook-service';

// Common types
export type {
  PaginatedRequest,
  PaginatedResponse,
  ServiceError,
  FitCategory,
  FitAssessment,
  ContentSource,
  SectionStatus,
  UserRole,
  ServiceContext
} from './types/common';

// Controlled vocabulary
export {
  GRADE_RANGES,
  SUBJECT_AREAS,
  EXCLUSION_CATEGORIES
} from './types/controlled-vocabulary';
export type {
  GradeRange,
  SubjectArea,
  ExclusionCategory
} from './types/controlled-vocabulary';

// Auth types
export type {
  AuthCredentials,
  AuthSession,
  UserProfile
} from './types/auth';

// Tenant types
export type {
  TenantSummary,
  CreateTenantRequest,
  OrganizationStatus
} from './types/tenant';

// User types
export type {
  TenantUser,
  InviteUserRequest
} from './types/user';

// Product types
export type {
  Product,
  ProductSummary,
  ProductAsset,
  ProductFilters,
  CreateProductRequest,
  UpdateProductRequest
} from './types/product';

// District types
export type {
  DistrictSummary,
  DistrictProfile,
  DistrictSearchRequest,
  FilterFacet,
  FilterOption,
  SavedDistrict,
  ExclusionReason,
  ExcludedDistrict
} from './types/district';

// Playbook types
export type {
  PlaybookSummary,
  Playbook,
  PlaybookSection,
  PlaybookFilters,
  PlaybookGenerationRequest,
  PlaybookStatusResponse
} from './types/playbook';
