// POST /api/products/[productId]/assets - Upload product asset endpoint (admin only)

import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import * as productService from '@/services/product-service';

export async function POST(
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
    const body = await request.json() as {
      fileName: string;
      fileType: string;
      fileSize: number;
      url: string;
    };

    // Upload asset metadata
    const asset = await productService.uploadProductAsset(
      user.tenantId,
      productId,
      body
    );

    return NextResponse.json(asset, { status: 201 });
  } catch (error: any) {
    console.error('Error in POST /api/products/[productId]/assets:', error);

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
