'use client';

import Link from 'next/link';
import { X } from 'lucide-react';
import type { PlaybookSummary } from '@/services/types/playbook';

interface PlaybookCardProps {
  playbook: PlaybookSummary;
  onDelete?: (id: string) => void;
}

export function PlaybookCard({ playbook, onDelete }: PlaybookCardProps) {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (window.confirm(`Are you sure you want to delete the playbook for ${playbook.districtName}?`)) {
      onDelete?.(playbook.playbookId);
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

  const getSectionStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
        return 'bg-green-500';
      case 'generating':
        return 'bg-yellow-500';
      case 'error':
        return 'bg-red-500';
      case 'pending':
      default:
        return 'bg-gray-300';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Link
      href={`/playbooks/${playbook.playbookId}`}
      className="block border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer bg-card relative"
    >
      {/* Delete button */}
      {onDelete && (
        <button
          onClick={handleDelete}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
          aria-label="Delete playbook"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <h3 className="font-semibold text-lg font-heading pr-8">
        {playbook.districtName}
      </h3>

      <p className="text-sm text-muted-foreground mt-2 line-clamp-2">
        {playbook.productNames.join(', ')}
      </p>

      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${getFitBadgeColor(playbook.fitAssessment.fitCategory)}`}>
          {playbook.fitAssessment.fitCategory} Fit
        </span>

        <span className="text-xs text-muted-foreground">
          {formatDate(playbook.generatedAt)}
        </span>
      </div>

      {/* Section status indicators */}
      <div className="flex items-center gap-1 mt-3">
        {Object.entries(playbook.sectionStatuses).map(([sectionId, status]) => (
          <div
            key={sectionId}
            className={`w-2 h-2 rounded-full ${getSectionStatusColor(status)}`}
            title={`${sectionId}: ${status}`}
          />
        ))}
      </div>
    </Link>
  );
}
