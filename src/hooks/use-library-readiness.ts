'use client';

import { useState, useEffect, useRef } from 'react';
import { getProductService } from '@/services';
import type { ProductLensSummary, LibraryReadinessResponse } from '@/services/types/product';

interface LibraryReadinessState {
  hasProducts: boolean;
  productCount: number;
  products: ProductLensSummary[];
  loading: boolean;
}

const INITIAL_STATE: LibraryReadinessState = {
  hasProducts: false,
  productCount: 0,
  products: [],
  loading: true,
};

export function useLibraryReadiness(): LibraryReadinessState {
  const [state, setState] = useState<LibraryReadinessState>(INITIAL_STATE);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    async function fetch() {
      try {
        const service = await getProductService();
        const result: LibraryReadinessResponse = await service.getLibraryReadiness();
        setState({
          hasProducts: result.hasProducts,
          productCount: result.productCount,
          products: result.products,
          loading: false,
        });
      } catch {
        setState({ ...INITIAL_STATE, loading: false });
      }
    }

    fetch();
  }, []);

  return state;
}
