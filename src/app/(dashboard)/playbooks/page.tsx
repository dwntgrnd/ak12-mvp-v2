'use client';

import { useEffect, useState } from 'react';
import type { PlaybookSummary } from '@/services/types/playbook';
import { PlaybookCard } from '@/components/playbooks/playbook-card';
import { PlaybookFilters } from '@/components/playbooks/playbook-filters';

export default function PlaybooksPage() {
  const [filters, setFilters] = useState<{ fitCategory?: string }>({});
  const [playbooks, setPlaybooks] = useState<PlaybookSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch playbooks when filter changes
  useEffect(() => {
    const fetchPlaybooks = async () => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();

        if (filters.fitCategory) {
          params.set('fitCategory', filters.fitCategory);
        }

        const response = await fetch(`/api/playbooks?${params.toString()}`);

        if (!response.ok) {
          throw new Error('Failed to load playbooks');
        }

        const data = await response.json();
        setPlaybooks(data.playbooks || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
        setPlaybooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaybooks();
  }, [filters]);

  const handleDelete = async (playbookId: string) => {
    try {
      const response = await fetch(`/api/playbooks/${playbookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete playbook');
      }

      // Optimistic UI update - remove from local state
      setPlaybooks((prev) => prev.filter((p) => p.playbookId !== playbookId));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete playbook');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold font-heading">Playbooks</h1>
          <p className="text-muted-foreground mt-2">
            AI-generated district-specific playbooks for informed outreach.
          </p>
        </div>
      </div>

      <div className="mt-6">
        <PlaybookFilters filters={filters} onFiltersChange={setFilters} />
      </div>

      <div className="mt-6">
        {loading && (
          <p className="text-muted-foreground">Loading playbooks...</p>
        )}

        {error && (
          <p className="text-red-500">{error}</p>
        )}

        {!loading && !error && playbooks.length === 0 && (
          <p className="text-muted-foreground">
            No playbooks yet. Generate your first playbook from a district profile.
          </p>
        )}

        {!loading && !error && playbooks.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {playbooks.map((playbook) => (
              <PlaybookCard
                key={playbook.playbookId}
                playbook={playbook}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
