'use client';

import { useSyncExternalStore } from 'react';

// --- Module-level singleton cache ---

interface Cache {
  hasPlaybooks: boolean;
  loading: boolean;
}

let cache: Cache = { hasPlaybooks: false, loading: true };
let listeners = new Set<() => void>();
let fetchPromise: Promise<void> | null = null;
let hydrated = false;

function notify() {
  cache = { ...cache };
  listeners.forEach((l) => l());
}

function getSnapshot(): Cache {
  return cache;
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
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

  fetchPromise = fetch('/api/playbooks')
    .then((res) => {
      if (!res.ok) throw new Error('Failed to fetch playbooks');
      return res.json();
    })
    .then((data: { items: unknown[] }) => {
      cache = { hasPlaybooks: (data.items || []).length > 0, loading: false };
      notify();
    })
    .catch(() => {
      cache = { hasPlaybooks: false, loading: false };
      notify();
    })
    .finally(() => {
      fetchPromise = null;
    });
}

const serverSnapshot: Cache = { hasPlaybooks: false, loading: true };
function getServerSnapshot(): Cache {
  return serverSnapshot;
}

// --- Public API ---

/**
 * Call after creating or deleting a playbook to refresh the nav indicator.
 */
export function invalidatePlaybookCount() {
  hydrated = false;
  fetchPromise = null;
  hydrate();
}

/**
 * Reactive hook that tracks whether any playbooks exist.
 * Used by the top nav to show content indicators.
 */
export function usePlaybookCount(): { hasPlaybooks: boolean; loading: boolean } {
  const snapshot = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { hasPlaybooks: snapshot.hasPlaybooks, loading: snapshot.loading };
}
