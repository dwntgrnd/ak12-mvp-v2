'use client';

import { useSyncExternalStore, useCallback } from 'react';
import type { SavedDistrict } from '@/services/types/district';

// --- Module-level singleton cache ---

interface Cache {
  ids: Set<string>;
  items: SavedDistrict[];
  loading: boolean;
}

let cache: Cache = { ids: new Set(), items: [], loading: true };
let listeners = new Set<() => void>();
let fetchPromise: Promise<void> | null = null;
let hydrated = false;

function notify() {
  // Create new cache reference so useSyncExternalStore detects change
  cache = { ...cache };
  listeners.forEach((l) => l());
}

function getSnapshot(): Cache {
  return cache;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  // Trigger initial hydration on first subscriber
  if (!hydrated) {
    hydrate();
  }
  return () => {
    listeners.delete(listener);
  };
}

async function hydrate() {
  if (fetchPromise) return;
  hydrated = true;

  fetchPromise = fetch('/api/saved-districts')
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch saved districts');
      return res.json();
    })
    .then((data: { items: SavedDistrict[] }) => {
      cache = {
        ids: new Set(data.items.map((d) => d.districtId)),
        items: data.items,
        loading: false,
      };
      notify();
    })
    .catch(() => {
      cache = { ...cache, loading: false };
      notify();
    })
    .finally(() => {
      fetchPromise = null;
    });
}

// --- Server snapshot for SSR ---

const serverSnapshot: Cache = { ids: new Set(), items: [], loading: true };
function getServerSnapshot(): Cache {
  return serverSnapshot;
}

// --- Exported hook ---

export interface UseSavedDistrictsReturn {
  savedDistrictIds: Set<string>;
  savedDistricts: SavedDistrict[];
  saveDistrict: (districtId: string) => Promise<void>;
  removeSavedDistrict: (districtId: string) => Promise<void>;
  isSaved: (districtId: string) => boolean;
  loading: boolean;
}

export function useSavedDistricts(): UseSavedDistrictsReturn {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const saveDistrict = useCallback(async (districtId: string) => {
    // Already saved — no-op
    if (cache.ids.has(districtId)) return;

    // Optimistic update
    const prevCache = cache;
    const optimisticItem: SavedDistrict = {
      districtId,
      snapshot: {
        districtId,
        name: '',
        city: '',
        county: '',
        state: '',
        docType: '',
        lowGrade: '',
        highGrade: '',
        totalEnrollment: 0,
        frpmPercent: 0,
        ellPercent: 0,
        elaProficiency: 0,
        mathProficiency: 0,
      },
      savedAt: new Date().toISOString(),
    };
    cache = {
      ids: new Set([...cache.ids, districtId]),
      items: [...cache.items, optimisticItem],
      loading: false,
    };
    notify();

    try {
      const res = await fetch(`/api/districts/${districtId}/save`, { method: 'POST' });
      if (!res.ok) throw new Error('Save failed');
      const saved: SavedDistrict = await res.json();
      // Replace optimistic item with server response
      cache = {
        ids: new Set([...cache.ids, districtId]),
        items: cache.items.map((d) => (d.districtId === districtId ? saved : d)),
        loading: false,
      };
      notify();
    } catch {
      // Rollback
      cache = prevCache;
      notify();
    }
  }, []);

  const removeSavedDistrict = useCallback(async (districtId: string) => {
    // Not saved — no-op
    if (!cache.ids.has(districtId)) return;

    // Optimistic update
    const prevCache = cache;
    const newIds = new Set(cache.ids);
    newIds.delete(districtId);
    cache = {
      ids: newIds,
      items: cache.items.filter((d) => d.districtId !== districtId),
      loading: false,
    };
    notify();

    try {
      const res = await fetch(`/api/districts/${districtId}/save`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Remove failed');
    } catch {
      // Rollback
      cache = prevCache;
      notify();
    }
  }, []);

  const isSaved = useCallback(
    (districtId: string) => snapshot.ids.has(districtId),
    [snapshot]
  );

  return {
    savedDistrictIds: snapshot.ids,
    savedDistricts: snapshot.items,
    saveDistrict,
    removeSavedDistrict,
    isSaved,
    loading: snapshot.loading,
  };
}
