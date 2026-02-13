// ProductService interface

import type { PaginatedRequest, PaginatedResponse } from '../types/common';
import type {
  Product,
  ProductSummary,
  ProductAsset,
  ProductFilters,
  CreateProductRequest,
  UpdateProductRequest,
  AssetUploadUrlRequest,
  AssetUploadUrl
} from '../types/product';

export interface IProductService {
  // Authorization: publisher-admin, publisher-rep (read access)
  getProducts(filters?: ProductFilters, pagination?: PaginatedRequest): Promise<PaginatedResponse<ProductSummary>>;

  // Authorization: publisher-admin, publisher-rep (read access)
  // Errors: PRODUCT_NOT_FOUND
  getProduct(productId: string): Promise<Product>;

  // Authorization: publisher-admin only
  // Errors: DUPLICATE_PRODUCT_NAME, VALIDATION_ERROR
  createProduct(data: CreateProductRequest): Promise<Product>;

  // Authorization: publisher-admin only
  // Errors: PRODUCT_NOT_FOUND, VALIDATION_ERROR
  updateProduct(productId: string, data: UpdateProductRequest): Promise<Product>;

  // Authorization: publisher-admin only (soft delete)
  // Errors: PRODUCT_NOT_FOUND
  deleteProduct(productId: string): Promise<void>;

  // Authorization: publisher-admin only
  // Step 1: Get pre-signed S3 upload URL
  // Errors: PRODUCT_NOT_FOUND, UNSUPPORTED_FILE_TYPE
  getProductAssetUploadUrl(productId: string, request: AssetUploadUrlRequest): Promise<AssetUploadUrl>;

  // Authorization: publisher-admin only
  // Step 2: Confirm upload complete (after client uploads directly to S3)
  // Errors: PRODUCT_NOT_FOUND, ASSET_NOT_FOUND, UPLOAD_NOT_COMPLETE
  confirmProductAssetUpload(productId: string, assetId: string): Promise<ProductAsset>;
}
