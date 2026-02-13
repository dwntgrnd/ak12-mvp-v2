import type { IProductService } from '../../interfaces/product-service';
import type { PaginatedRequest, PaginatedResponse } from '../../types/common';
import type {
  Product,
  ProductSummary,
  ProductAsset,
  ProductFilters,
  CreateProductRequest,
  UpdateProductRequest,
  AssetUploadUrlRequest,
  AssetUploadUrl,
} from '../../types/product';
import { MOCK_PRODUCTS } from './fixtures/products';

// In-memory store — shallow clone of fixtures so mutations don't affect source
let products: Product[] = JSON.parse(JSON.stringify(MOCK_PRODUCTS));

function delay(ms: number = 200): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export const mockProductService: IProductService = {
  async getProducts(
    filters?: ProductFilters,
    pagination?: PaginatedRequest
  ): Promise<PaginatedResponse<ProductSummary>> {
    await delay();
    let filtered = [...products];

    if (filters?.searchQuery) {
      const q = filters.searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) => p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
      );
    }
    if (filters?.subjectArea) {
      filtered = filtered.filter((p) => p.subjectArea === filters.subjectArea);
    }
    // Grade range overlap filtering
    if (filters?.gradeRange) {
      filtered = filtered.filter(
        (p) =>
          p.gradeRange.gradeFrom <= filters.gradeRange!.gradeTo &&
          p.gradeRange.gradeTo >= filters.gradeRange!.gradeFrom
      );
    }

    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 25;
    const start = (page - 1) * pageSize;
    const items: ProductSummary[] = filtered.slice(start, start + pageSize).map((p) => ({
      productId: p.productId,
      name: p.name,
      description: p.description.substring(0, 150) + '...',
      gradeRange: p.gradeRange,
      subjectArea: p.subjectArea,
      assetCount: p.assets.length,
    }));

    return {
      items,
      totalCount: filtered.length,
      page,
      pageSize,
      totalPages: Math.ceil(filtered.length / pageSize),
    };
  },

  async getProduct(productId: string): Promise<Product> {
    await delay();
    const product = products.find((p) => p.productId === productId);
    if (!product) {
      throw { code: 'PRODUCT_NOT_FOUND', message: `Product ${productId} not found`, retryable: false };
    }
    return JSON.parse(JSON.stringify(product));
  },

  async createProduct(data: CreateProductRequest): Promise<Product> {
    await delay(300);
    const existing = products.find((p) => p.name.toLowerCase() === data.name.toLowerCase());
    if (existing) {
      throw { code: 'DUPLICATE_PRODUCT_NAME', message: `Product "${data.name}" already exists`, retryable: false };
    }
    const newProduct: Product = {
      ...data,
      productId: `prod-${String(products.length + 1).padStart(3, '0')}`,
      tenantId: 'tenant-demo-001',
      assets: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    products.push(newProduct);
    return JSON.parse(JSON.stringify(newProduct));
  },

  async updateProduct(productId: string, data: UpdateProductRequest): Promise<Product> {
    await delay(300);
    const index = products.findIndex((p) => p.productId === productId);
    if (index === -1) {
      throw { code: 'PRODUCT_NOT_FOUND', message: `Product ${productId} not found`, retryable: false };
    }
    products[index] = {
      ...products[index],
      ...data,
      updatedAt: new Date().toISOString(),
    };
    return JSON.parse(JSON.stringify(products[index]));
  },

  async deleteProduct(productId: string): Promise<void> {
    await delay(200);
    const index = products.findIndex((p) => p.productId === productId);
    if (index === -1) {
      throw { code: 'PRODUCT_NOT_FOUND', message: `Product ${productId} not found`, retryable: false };
    }
    products.splice(index, 1);
  },

  async getProductAssetUploadUrl(
    _productId: string,
    _request: AssetUploadUrlRequest
  ): Promise<AssetUploadUrl> {
    // Stub — asset uploads deferred to Phase 4
    throw { code: 'NOT_IMPLEMENTED', message: 'Asset uploads not available in mock provider', retryable: false };
  },

  async confirmProductAssetUpload(_productId: string, _assetId: string): Promise<ProductAsset> {
    throw { code: 'NOT_IMPLEMENTED', message: 'Asset uploads not available in mock provider', retryable: false };
  },
};
