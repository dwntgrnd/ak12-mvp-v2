// ProductService interface

import type {
  Product,
  ProductSummary,
  ProductAsset,
  ProductFilters,
  CreateProductRequest,
  UpdateProductRequest
} from '../types/product';

export interface IProductService {
  // Authorization: publisher-admin, publisher-rep (read access)
  getProducts(filters?: ProductFilters): Promise<ProductSummary[]>;

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
  // Errors: PRODUCT_NOT_FOUND, FILE_TOO_LARGE, UNSUPPORTED_FILE_TYPE
  uploadProductAsset(productId: string, file: File): Promise<ProductAsset>;
}
