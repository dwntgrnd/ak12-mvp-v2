'use client';

import { useSyncExternalStore, useCallback } from 'react';
import type { ProductLensSummary } from '@/services/types/product';

// --- Module-level singleton cache ---

interface Cache {
  activeProduct: ProductLensSummary | null;
}

let cache: Cache = { activeProduct: null };
let listeners = new Set<() => void>();

function notify() {
  cache = { ...cache };
  listeners.forEach((l) => l());
}

function getSnapshot(): Cache {
  return cache;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

// --- Server snapshot for SSR ---

const serverSnapshot: Cache = { activeProduct: null };
function getServerSnapshot(): Cache {
  return serverSnapshot;
}

// --- Exported hook ---

export interface UseProductLensReturn {
  activeProduct: ProductLensSummary | null;
  isLensActive: boolean;
  setProduct: (product: ProductLensSummary) => void;
  clearProduct: () => void;
}

export function useProductLens(): UseProductLensReturn {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setProduct = useCallback((product: ProductLensSummary) => {
    cache = { activeProduct: product };
    notify();
  }, []);

  const clearProduct = useCallback(() => {
    cache = { activeProduct: null };
    notify();
  }, []);

  return {
    activeProduct: snapshot.activeProduct,
    isLensActive: snapshot.activeProduct !== null,
    setProduct,
    clearProduct,
  };
}
