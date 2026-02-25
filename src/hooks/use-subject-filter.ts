'use client';

import { useSyncExternalStore, useCallback } from 'react';

// --- Module-level singleton cache ---

interface Cache {
  activeSubject: string | null;
}

let cache: Cache = { activeSubject: null };
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

const serverSnapshot: Cache = { activeSubject: null };
function getServerSnapshot(): Cache {
  return serverSnapshot;
}

// --- Exported hook ---

export interface UseSubjectFilterReturn {
  activeSubject: string | null;
  isFilterActive: boolean;
  setSubject: (subject: string) => void;
  clearSubject: () => void;
}

export function useSubjectFilter(): UseSubjectFilterReturn {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setSubject = useCallback((subject: string) => {
    cache = { activeSubject: subject };
    notify();
  }, []);

  const clearSubject = useCallback(() => {
    cache = { activeSubject: null };
    notify();
  }, []);

  return {
    activeSubject: snapshot.activeSubject,
    isFilterActive: snapshot.activeSubject !== null,
    setSubject,
    clearSubject,
  };
}
