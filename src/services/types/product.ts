// ProductService domain types

import type { GradeRange, SubjectArea } from './controlled-vocabulary';

export interface Product {
  productId: string;
  tenantId: string;
  name: string;
  description: string;
  gradeRange: GradeRange;
  subjectArea: SubjectArea;
  keyFeatures?: string[];
  targetChallenges?: string[];
  competitiveDifferentiators?: string[];
  approvedMessaging?: string[];
  assets: ProductAsset[];
  createdAt: string;         // ISO 8601
  updatedAt: string;         // ISO 8601
}

export interface ProductSummary {
  productId: string;
  name: string;
  description: string;       // truncated for list display
  gradeRange: GradeRange;
  subjectArea: SubjectArea;
  assetCount: number;
}

export interface ProductAsset {
  assetId: string;
  fileName: string;
  fileType: string;          // MIME type
  fileSize: number;          // bytes
  uploadedAt: string;        // ISO 8601
  url: string;               // download/preview URL
}

export interface ProductFilters {
  gradeRange?: GradeRange;
  subjectArea?: SubjectArea;
  searchQuery?: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  gradeRange: GradeRange;
  subjectArea: SubjectArea;
  keyFeatures?: string[];
  targetChallenges?: string[];
  competitiveDifferentiators?: string[];
  approvedMessaging?: string[];
}

export interface UpdateProductRequest {
  name?: string;
  description?: string;
  gradeRange?: GradeRange;
  subjectArea?: SubjectArea;
  keyFeatures?: string[];
  targetChallenges?: string[];
  competitiveDifferentiators?: string[];
  approvedMessaging?: string[];
}
