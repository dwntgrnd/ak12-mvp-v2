'use client';

import { useState, useEffect, useRef } from 'react';

interface DistrictPlaybookStatus {
  loading: boolean;
  existingPlaybookId: string | null;
  existingCount: number;
}

const INITIAL_STATE: DistrictPlaybookStatus = {
  loading: true,
  existingPlaybookId: null,
  existingCount: 0,
};

export function useDistrictPlaybookStatus(districtId: string): DistrictPlaybookStatus {
  const [state, setState] = useState<DistrictPlaybookStatus>(INITIAL_STATE);
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
        const playbooks: Array<{ playbookId: string; generatedAt: string }> = await res.json();

        if (cancelled) return;

        const sorted = [...playbooks].sort(
          (a, b) => new Date(b.generatedAt).getTime() - new Date(a.generatedAt).getTime()
        );

        setState({
          loading: false,
          existingPlaybookId: sorted.length > 0 ? sorted[0].playbookId : null,
          existingCount: sorted.length,
        });
      } catch {
        if (!cancelled) {
          setState({ loading: false, existingPlaybookId: null, existingCount: 0 });
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
