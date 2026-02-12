'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Playbook, PlaybookStatusResponse } from '@/services/types/playbook';
import { PlaybookSection } from '@/components/playbooks/playbook-section';
import { GenerationStatus } from '@/components/playbooks/generation-status';

export default function PlaybookDetailPage({
  params,
}: {
  params: Promise<{ playbookId: string }>;
}) {
  const [playbookId, setPlaybookId] = useState<string | null>(null);
  const [playbook, setPlaybook] = useState<Playbook | null>(null);
  const [status, setStatus] = useState<PlaybookStatusResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Unwrap params promise
  useEffect(() => {
    params.then(({ playbookId: id }) => {
      setPlaybookId(id);
    });
  }, [params]);

  // Fetch playbook data
  useEffect(() => {
    if (!playbookId) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch playbook detail and status in parallel
        const [playbookResponse, statusResponse] = await Promise.all([
          fetch(`/api/playbooks/${playbookId}`),
          fetch(`/api/playbooks/${playbookId}/status`)
        ]);

        if (!playbookResponse.ok) {
          throw new Error('Failed to load playbook');
        }

        if (!statusResponse.ok) {
          throw new Error('Failed to load playbook status');
        }

        const playbookData: Playbook = await playbookResponse.json();
        const statusData: PlaybookStatusResponse = await statusResponse.json();

        setPlaybook(playbookData);
        setStatus(statusData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [playbookId]);

  const handleDelete = async () => {
    if (!playbookId || !playbook) return;

    if (!window.confirm(`Are you sure you want to delete the playbook for ${playbook.districtName}?`)) {
      return;
    }

    try {
      const response = await fetch(`/api/playbooks/${playbookId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete playbook');
      }

      // Navigate back to list
      router.push('/playbooks');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete playbook');
    }
  };

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
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <p className="text-muted-foreground">Loading playbook...</p>
      </div>
    );
  }

  if (error || !playbook || !status) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
        <Link
          href="/playbooks"
          className="text-sm text-primary hover:underline flex items-center gap-1 mb-6"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Playbooks
        </Link>
        <p className="text-red-500">{error || 'Playbook not found'}</p>
      </div>
    );
  }

  const handleSectionUpdate = (sectionId: string, updatedSection: any) => {
    // Update the section in local playbook state
    if (playbook) {
      const updatedSections = playbook.sections.map((s) =>
        s.sectionId === sectionId ? updatedSection : s
      );
      setPlaybook({ ...playbook, sections: updatedSections });
    }
  };

  const isGenerating = status.overallStatus === 'generating';

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back navigation */}
      <Link
        href="/playbooks"
        className="text-sm text-primary hover:underline flex items-center gap-1 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Playbooks
      </Link>

      {/* Header section */}
      <div className="mb-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h1 className="text-2xl font-semibold font-heading">
              {playbook.districtName}
            </h1>

            <div className="flex items-center gap-2 mt-3 flex-wrap">
              {playbook.productNames.map((name, index) => (
                <span
                  key={index}
                  className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs"
                >
                  {name}
                </span>
              ))}
              <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getFitBadgeColor(playbook.fitAssessment.fitCategory)}`}>
                {playbook.fitAssessment.fitCategory} Fit
              </span>
            </div>

            <p className="text-sm text-muted-foreground mt-2">
              Generated {formatDate(playbook.generatedAt)}
            </p>
          </div>

          <button
            onClick={handleDelete}
            className="flex items-center gap-2 px-3 py-2 text-sm border border-destructive text-destructive rounded-md hover:bg-destructive/10 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
            Delete
          </button>
        </div>
      </div>

      {/* Fit rationale */}
      <div className="border rounded-lg p-4 bg-blue-50 mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
          Fit Rationale
        </h2>
        <p className="text-sm">
          {playbook.fitAssessment.fitRationale}
        </p>
      </div>

      {/* Generation status or sections */}
      {isGenerating ? (
        <GenerationStatus playbookId={playbookId!} initialStatus={status} />
      ) : (
        <div className="space-y-6">
          {/* Render sections in specified order */}
          {['key_themes', 'product_fit', 'objections', 'stakeholders', 'district_data', 'fit_assessment'].map((sectionType) => {
            const section = playbook.sections.find((s) => s.sectionType === sectionType);
            if (!section) return null;
            return (
              <PlaybookSection
                key={section.sectionId}
                section={section}
                playbookId={playbookId!}
                onSectionUpdate={handleSectionUpdate}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
