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
  gradeRange?: GradeRange;      // matches products whose range overlaps with this range
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

export interface AssetUploadUrlRequest {
  fileName: string;
  fileType: string;          // MIME type
}

export interface AssetUploadUrl {
  uploadUrl: string;         // pre-signed S3 PUT URL
  assetId: string;           // provisional asset ID
  expiresAt: string;         // ISO 8601, URL expiry
}

/**
 * Minimal product shape for lens selector UI.
 * Lighter than ProductSummary — no description, asset count, etc.
 */
export interface ProductLensSummary {
  productId: string;
  name: string;
  category: string;         // "Math Intervention", "ELL Platform", etc.
  targetGradeBands: string[];
}

/**
 * Lightweight check: does the user's org have products?
 * Used for progressive disclosure (Spec 15 §9), not full library fetch.
 */
export interface LibraryReadinessResponse {
  hasProducts: boolean;
  productCount: number;
  products: ProductLensSummary[];
}
