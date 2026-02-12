// Product service implementation

import { prisma } from '@/lib/prisma';
import type {
  Product,
  ProductSummary,
  ProductAsset,
  ProductFilters,
  CreateProductRequest,
  UpdateProductRequest
} from './types/product';
import { GRADE_RANGES, SUBJECT_AREAS } from './types/controlled-vocabulary';

/**
 * Get products with optional filters
 */
export async function getProducts(
  tenantId: string,
  filters?: ProductFilters
): Promise<ProductSummary[]> {
  // Build where clause
  const where: any = {
    tenantId,
    isDeleted: false
  };

  // Apply filters
  if (filters?.gradeRange) {
    where.gradeRange = filters.gradeRange;
  }

  if (filters?.subjectArea) {
    where.subjectArea = filters.subjectArea;
  }

  if (filters?.searchQuery) {
    where.name = {
      contains: filters.searchQuery,
      mode: 'insensitive'
    };
  }

  // Query products with asset counts
  const products = await prisma.product.findMany({
    where,
    select: {
      id: true,
      name: true,
      description: true,
      gradeRange: true,
      subjectArea: true,
      _count: {
        select: {
          assets: true
        }
      }
    },
    orderBy: {
      name: 'asc'
    }
  });

  // Map to ProductSummary with truncated description
  return products.map(product => ({
    productId: product.id,
    name: product.name,
    description: product.description.substring(0, 150),
    gradeRange: product.gradeRange as any,
    subjectArea: product.subjectArea as any,
    assetCount: product._count.assets
  }));
}

/**
 * Get full product detail by ID
 */
export async function getProduct(
  tenantId: string,
  productId: string
): Promise<Product> {
  const product = await prisma.product.findUnique({
    where: {
      id: productId
    },
    include: {
      assets: true
    }
  });

  // Check if product exists and belongs to tenant
  if (!product || product.isDeleted || product.tenantId !== tenantId) {
    const error: any = new Error('Product not found');
    error.code = 'PRODUCT_NOT_FOUND';
    throw error;
  }

  // Map to Product type
  return {
    productId: product.id,
    tenantId: product.tenantId,
    name: product.name,
    description: product.description,
    gradeRange: product.gradeRange as any,
    subjectArea: product.subjectArea as any,
    keyFeatures: product.keyFeatures,
    targetChallenges: product.targetChallenges,
    competitiveDifferentiators: product.competitiveDifferentiators,
    approvedMessaging: product.approvedMessaging,
    assets: product.assets.map(asset => ({
      assetId: asset.id,
      fileName: asset.fileName,
      fileType: asset.fileType,
      fileSize: asset.fileSize,
      uploadedAt: asset.uploadedAt.toISOString(),
      url: asset.url
    })),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
  };
}

/**
 * Create a new product
 */
export async function createProduct(
  tenantId: string,
  data: CreateProductRequest
): Promise<Product> {
  // Validate gradeRange
  if (!GRADE_RANGES.includes(data.gradeRange as any)) {
    const error: any = new Error('Invalid grade range');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  // Validate subjectArea
  if (!SUBJECT_AREAS.includes(data.subjectArea as any)) {
    const error: any = new Error('Invalid subject area');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  // Create product
  const product = await prisma.product.create({
    data: {
      tenantId,
      name: data.name,
      description: data.description,
      gradeRange: data.gradeRange,
      subjectArea: data.subjectArea,
      keyFeatures: data.keyFeatures || [],
      targetChallenges: data.targetChallenges || [],
      competitiveDifferentiators: data.competitiveDifferentiators || [],
      approvedMessaging: data.approvedMessaging || []
    },
    include: {
      assets: true
    }
  });

  // Map to Product type
  return {
    productId: product.id,
    tenantId: product.tenantId,
    name: product.name,
    description: product.description,
    gradeRange: product.gradeRange as any,
    subjectArea: product.subjectArea as any,
    keyFeatures: product.keyFeatures,
    targetChallenges: product.targetChallenges,
    competitiveDifferentiators: product.competitiveDifferentiators,
    approvedMessaging: product.approvedMessaging,
    assets: [],
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
  };
}

/**
 * Update an existing product
 */
export async function updateProduct(
  tenantId: string,
  productId: string,
  data: UpdateProductRequest
): Promise<Product> {
  // Find product
  const existing = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!existing || existing.isDeleted || existing.tenantId !== tenantId) {
    const error: any = new Error('Product not found');
    error.code = 'PRODUCT_NOT_FOUND';
    throw error;
  }

  // Validate gradeRange if provided
  if (data.gradeRange && !GRADE_RANGES.includes(data.gradeRange as any)) {
    const error: any = new Error('Invalid grade range');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  // Validate subjectArea if provided
  if (data.subjectArea && !SUBJECT_AREAS.includes(data.subjectArea as any)) {
    const error: any = new Error('Invalid subject area');
    error.code = 'VALIDATION_ERROR';
    throw error;
  }

  // Build update data object with only provided fields
  const updateData: any = {};
  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.gradeRange !== undefined) updateData.gradeRange = data.gradeRange;
  if (data.subjectArea !== undefined) updateData.subjectArea = data.subjectArea;
  if (data.keyFeatures !== undefined) updateData.keyFeatures = data.keyFeatures;
  if (data.targetChallenges !== undefined) updateData.targetChallenges = data.targetChallenges;
  if (data.competitiveDifferentiators !== undefined) updateData.competitiveDifferentiators = data.competitiveDifferentiators;
  if (data.approvedMessaging !== undefined) updateData.approvedMessaging = data.approvedMessaging;

  // Update product
  const product = await prisma.product.update({
    where: { id: productId },
    data: updateData,
    include: {
      assets: true
    }
  });

  // Map to Product type
  return {
    productId: product.id,
    tenantId: product.tenantId,
    name: product.name,
    description: product.description,
    gradeRange: product.gradeRange as any,
    subjectArea: product.subjectArea as any,
    keyFeatures: product.keyFeatures,
    targetChallenges: product.targetChallenges,
    competitiveDifferentiators: product.competitiveDifferentiators,
    approvedMessaging: product.approvedMessaging,
    assets: product.assets.map(asset => ({
      assetId: asset.id,
      fileName: asset.fileName,
      fileType: asset.fileType,
      fileSize: asset.fileSize,
      uploadedAt: asset.uploadedAt.toISOString(),
      url: asset.url
    })),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString()
  };
}

/**
 * Soft delete a product
 */
export async function deleteProduct(
  tenantId: string,
  productId: string
): Promise<void> {
  // Find product
  const existing = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!existing || existing.isDeleted || existing.tenantId !== tenantId) {
    const error: any = new Error('Product not found');
    error.code = 'PRODUCT_NOT_FOUND';
    throw error;
  }

  // Soft delete by setting isDeleted flag
  await prisma.product.update({
    where: { id: productId },
    data: { isDeleted: true }
  });
}

/**
 * Upload product asset metadata
 */
export async function uploadProductAsset(
  tenantId: string,
  productId: string,
  assetData: {
    fileName: string;
    fileType: string;
    fileSize: number;
    url: string;
  }
): Promise<ProductAsset> {
  // Verify product exists
  const product = await prisma.product.findUnique({
    where: { id: productId }
  });

  if (!product || product.isDeleted || product.tenantId !== tenantId) {
    const error: any = new Error('Product not found');
    error.code = 'PRODUCT_NOT_FOUND';
    throw error;
  }

  // Create asset record
  const asset = await prisma.productAsset.create({
    data: {
      productId,
      fileName: assetData.fileName,
      fileType: assetData.fileType,
      fileSize: assetData.fileSize,
      url: assetData.url
    }
  });

  // Map to ProductAsset type
  return {
    assetId: asset.id,
    fileName: asset.fileName,
    fileType: asset.fileType,
    fileSize: asset.fileSize,
    uploadedAt: asset.uploadedAt.toISOString(),
    url: asset.url
  };
}
