// GET /api/products - Product list endpoint
// POST /api/products - Create product endpoint (admin only)

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import * as productService from '@/services/product-service';
import type { ProductFilters, CreateProductRequest } from '@/services/types/product';

export async function GET(request: NextRequest) {
  try {
    // Authenticate user
    const user = await getCurrentUser();

    const searchParams = request.nextUrl.searchParams;

    // Build filters from query params
    const filters: ProductFilters = {};

    const gradeRange = searchParams.get('gradeRange');
    if (gradeRange) {
      filters.gradeRange = gradeRange as any;
    }

    const subjectArea = searchParams.get('subjectArea');
    if (subjectArea) {
      filters.subjectArea = subjectArea as any;
    }

    const searchQuery = searchParams.get('q');
    if (searchQuery) {
      filters.searchQuery = searchQuery;
    }

    // Get products
    const products = await productService.getProducts(user.tenantId, filters);

    return NextResponse.json({ products }, { status: 200 });
  } catch (error: any) {
    console.error('Error in GET /api/products:', error);

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

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json() as CreateProductRequest;

    // Create product
    const product = await productService.createProduct(user.tenantId, body);

    return NextResponse.json(product, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/products:', error);

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
