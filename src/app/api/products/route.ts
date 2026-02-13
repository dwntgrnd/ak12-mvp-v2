import { NextRequest, NextResponse } from 'next/server';
import { getProductService } from '@/services/factory';

export async function GET(request: NextRequest) {
  try {
    const service = await getProductService();
    const { searchParams } = new URL(request.url);

    const filters: Record<string, unknown> = {};
    if (searchParams.get('searchQuery')) filters.searchQuery = searchParams.get('searchQuery');
    if (searchParams.get('subjectArea')) filters.subjectArea = searchParams.get('subjectArea');
    if (searchParams.get('gradeFrom') && searchParams.get('gradeTo')) {
      filters.gradeRange = {
        gradeFrom: Number(searchParams.get('gradeFrom')),
        gradeTo: Number(searchParams.get('gradeTo')),
      };
    }

    const pagination = {
      page: Number(searchParams.get('page')) || 1,
      pageSize: Number(searchParams.get('pageSize')) || 25,
    };

    const result = await service.getProducts(filters as any, pagination);
    return NextResponse.json(result);
  } catch (error: unknown) {
    const err = error as { message?: string };
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const service = await getProductService();
    const body = await request.json();
    const product = await service.createProduct(body);
    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    const status = err.code === 'DUPLICATE_PRODUCT_NAME' ? 400 : err.code === 'VALIDATION_ERROR' ? 400 : 500;
    return NextResponse.json(
      { error: err.message || 'Internal server error' },
      { status }
    );
  }
}
