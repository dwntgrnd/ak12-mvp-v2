'use client';

import type { PlaybookSection } from '@/services/types/playbook';

interface PlaybookSectionProps {
  section: PlaybookSection;
  playbookId: string;
}

export function PlaybookSection({ section }: PlaybookSectionProps) {
  const getContentSourceColor = (contentSource: string) => {
    switch (contentSource) {
      case 'verbatim':
        return 'bg-blue-100 text-blue-800';
      case 'constrained':
        return 'bg-purple-100 text-purple-800';
      case 'synthesis':
        return 'bg-green-100 text-green-800';
      case 'hybrid':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Render based on section status
  if (section.status === 'error') {
    return (
      <div className="border rounded-lg p-6 bg-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{section.sectionLabel}</h2>
          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
            Error
          </span>
        </div>
        <p className="text-sm text-red-600">
          Failed to generate: {section.errorMessage || 'Unknown error'}
        </p>
      </div>
    );
  }

  if (section.status === 'pending' || section.status === 'generating') {
    return (
      <div className="border rounded-lg p-6 bg-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{section.sectionLabel}</h2>
          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 capitalize">
            {section.status}
          </span>
        </div>
        <div className="animate-pulse space-y-3">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          <div className="h-4 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    );
  }

  // Complete status - render content
  return (
    <div className="border rounded-lg p-6 bg-card">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-semibold">{section.sectionLabel}</h2>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full capitalize ${getContentSourceColor(section.contentSource)}`}>
            {section.contentSource}
          </span>
          {section.isEdited && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
              Edited
            </span>
          )}
        </div>
      </div>

      <div className="text-sm whitespace-pre-wrap">
        {section.content || 'No content available'}
      </div>
    </div>
  );
}
