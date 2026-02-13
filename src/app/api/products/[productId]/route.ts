import { NextRequest, NextResponse } from 'next/server';
import { getProductService } from '@/services/factory';

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const service = await getProductService();
    const product = await service.getProduct(productId);
    return NextResponse.json(product);
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const status = err.code === 'PRODUCT_NOT_FOUND' ? 404 : 500;
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const service = await getProductService();
    const body = await request.json();
    const product = await service.updateProduct(productId, body);
    return NextResponse.json(product);
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const status = err.code === 'PRODUCT_NOT_FOUND' ? 404 : err.code === 'VALIDATION_ERROR' ? 400 : 500;
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ productId: string }> }
) {
  try {
    const { productId } = await params;
    const service = await getProductService();
    await service.deleteProduct(productId);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const status = err.code === 'PRODUCT_NOT_FOUND' ? 404 : 500;
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status }
    );
  }
}
