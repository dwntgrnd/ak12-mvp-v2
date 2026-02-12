'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import type { PlaybookSummary } from '@/services/types/playbook';

interface ExistingPlaybooksPanelProps {
  districtId: string;
}

export function ExistingPlaybooksPanel({ districtId }: ExistingPlaybooksPanelProps) {
  const [playbooks, setPlaybooks] = useState<PlaybookSummary[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlaybooks = async () => {
      try {
        const response = await fetch(`/api/districts/${districtId}/playbooks`);

        if (!response.ok) {
          // If fetch fails, just show nothing (silently fail)
          setPlaybooks([]);
          return;
        }

        const data: PlaybookSummary[] = await response.json();
        setPlaybooks(data);
      } catch (err) {
        // Silently fail - just show nothing
        setPlaybooks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPlaybooks();
  }, [districtId]);

  if (loading) {
    return (
      <div className="border rounded-lg p-4 bg-card">
        <p className="text-sm text-muted-foreground">Loading playbooks...</p>
      </div>
    );
  }

  // Return null if no playbooks exist
  if (playbooks.length === 0) {
    return null;
  }

  const getFitBadgeColor = (fitCategory: string) => {
    switch (fitCategory) {
      case 'strong':
        return 'bg-green-100 text-green-800';
      case 'moderate':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="border rounded-lg p-6 bg-card">
      <h2 className="text-lg font-semibold font-heading mb-4">
        Existing Playbooks ({playbooks.length})
      </h2>

      <div className="space-y-3">
        {playbooks.map((playbook) => (
          <Link
            key={playbook.playbookId}
            href={`/playbooks/${playbook.playbookId}`}
            className="block border rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between gap-3 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {playbook.productNames.map((name, index) => (
                    <span
                      key={index}
                      className="text-sm font-medium text-primary truncate"
                    >
                      {name}
                      {index < playbook.productNames.length - 1 && ','}
                    </span>
                  ))}
                </div>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded-full capitalize font-medium ${getFitBadgeColor(playbook.fitAssessment.fitCategory)}`}
              >
                {playbook.fitAssessment.fitCategory}
              </span>
            </div>

            <p className="text-xs text-muted-foreground">
              Generated {formatDate(playbook.generatedAt)}
            </p>
          </Link>
        ))}
      </div>
    </div>
  );
}
