// GET /api/products/[productId] - Product detail endpoint
// PATCH /api/products/[productId] - Update product endpoint (admin only)
// DELETE /api/products/[productId] - Delete product endpoint (admin only)

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import * as productService from '@/services/product-service';
import type { UpdateProductRequest } from '@/services/types/product';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    // Authenticate user
    const user = await getCurrentUser();

    // Extract productId from params
    const { productId } = await params;

    // Get product
    const product = await productService.getProduct(user.tenantId, productId);

    return NextResponse.json(product, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/products/[productId]:', error);

    if (error.code === 'PRODUCT_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (error.code === 'UNAUTHENTICATED' || error.code === 'USER_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    // Authenticate user
    const user = await getCurrentUser();

    // Check admin role
    if (user.role !== 'publisher-admin' && user.role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Extract productId from params
    const { productId } = await params;

    // Parse request body
    const body = await request.json() as UpdateProductRequest;

    // Update product
    const product = await productService.updateProduct(user.tenantId, productId, body);

    return NextResponse.json(product, { status: 200 });
  } catch (error: any) {
    console.error('Error in PATCH /api/products/[productId]:', error);

    if (error.code === 'PRODUCT_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (error.code === 'VALIDATION_ERROR') {
      return NextResponse.json(
        { error: error.message || 'Validation error' },
        { status: 400 }
      );
    }

    if (error.code === 'UNAUTHENTICATED' || error.code === 'USER_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    // Authenticate user
    const user = await getCurrentUser();

    // Check admin role
    if (user.role !== 'publisher-admin' && user.role !== 'super-admin') {
      return NextResponse.json(
        { error: 'Forbidden' },
        { status: 403 }
      );
    }

    // Extract productId from params
    const { productId } = await params;

    // Delete product (soft delete)
    await productService.deleteProduct(user.tenantId, productId);

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('Error in DELETE /api/products/[productId]:', error);

    if (error.code === 'PRODUCT_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    if (error.code === 'UNAUTHENTICATED' || error.code === 'USER_NOT_FOUND') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    );
  }
}
