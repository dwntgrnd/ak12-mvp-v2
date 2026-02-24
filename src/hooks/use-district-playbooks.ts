'use client';

import { useState, useEffect, useRef } from 'react';

export interface DistrictPlaybookEntry {
  playbookId: string;
  productNames: string[];
  generatedAt: string;
}

export interface UseDistrictPlaybooksResult {
  loading: boolean;
  playbooks: DistrictPlaybookEntry[];
}

const MAX_ENTRIES = 5;

const INITIAL_STATE: UseDistrictPlaybooksResult = {
  loading: true,
  playbooks: [],
};

export function useDistrictPlaybooks(districtId: string): UseDistrictPlaybooksResult {
  const [state, setState] = useState<UseDistrictPlaybooksResult>(INITIAL_STATE);
  const fetchedRef = useRef(false);

  useEffect(() => {
    fetchedRef.current = false;
    setState(INITIAL_STATE);
  }, [districtId]);

  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;

    let cancelled = false;

    async function fetchPlaybooks() {
      try {
        const res = await fetch(`/api/districts/${districtId}/playbooks`);
        if (!res.ok) throw new Error('Failed to fetch playbooks');
        const playbooks: Array<{
          playbookId: string;
          productNames: string[];
          generatedAt: string;
        }> = await res.json();

        if (cancelled) return;

        const sorted = [...playbooks]
          .sort((a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime())
          .slice(0, MAX_ENTRIES);

        setState({
          loading: false,
          playbooks: sorted.map(({ playbookId, productNames, generatedAt }) => ({
            playbookId,
            productNames,
            generatedAt,
          })),
        });
      } catch {
        if (!cancelled) {
          setState({ loading: false, playbooks: [] });
        }
      }
    }

    fetchPlaybooks();

    return () => {
      cancelled = true;
    };
  }, [districtId]);

  return state;
}
