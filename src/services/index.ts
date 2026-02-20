// Service registry - single import point for all types and interfaces

// Service factory
export {
  getPlaybookService,
  getProductService,
  getConfigService,
  getDistrictService,
  getDiscoveryService,
} from './factory';

// Service interfaces
export type { IDiscoveryService } from './interfaces/discovery-service';
export type { IAuthService } from './interfaces/auth-service';
export type { IConfigService } from './interfaces/config-service';
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
  FitAssessment,
  ContentSource,
  SectionStatus,
  UserRole,
  ServiceContext
} from './types/common';

// Controlled vocabulary
export {
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
  UpdateProductRequest,
  AssetUploadUrlRequest,
  AssetUploadUrl
} from './types/product';

// District types
export type {
  DistrictSummary,
  DistrictProfile,
  DistrictSearchRequest,
  ExclusionStatus,
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

// Discovery types
export type {
  QueryIntent,
  ResponseFormat,
  ConfidenceLevel,
  CoverageCategory,
  CategoryCoverage,
  DistrictCoverage,
  SectionConfidence,
  ResponseConfidence,
  FollowUpChip,
  DiscoverySource,
  BriefSection,
  KeySignal,
  BriefContent,
  DirectAnswerContent,
  ComparisonCell,
  ComparisonEntity,
  ComparisonDimension,
  ComparisonContent,
  CardSetEntry,
  CardSetContent,
  RankedListEntry,
  RankedListContent,
  RecoveryContent,
  ProductRelevance,
  DiscoveryResponseContent,
  DiscoveryQueryResponse,
  DiscoveryQueryRequest,
  DirectoryEntry,
  DirectorySearchRequest,
  DirectorySearchResponse,
} from './types/discovery';
