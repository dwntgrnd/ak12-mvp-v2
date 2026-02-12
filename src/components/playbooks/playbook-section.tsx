'use client';

import { useState, useEffect } from 'react';
import { Pencil, RefreshCw, Loader2 } from 'lucide-react';
import type { PlaybookSection as PlaybookSectionType } from '@/services/types/playbook';

interface PlaybookSectionProps {
  section: PlaybookSectionType;
  playbookId: string;
  onSectionUpdate?: (sectionId: string, updatedSection: PlaybookSectionType) => void;
}

export function PlaybookSection({ section, playbookId, onSectionUpdate }: PlaybookSectionProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [currentSection, setCurrentSection] = useState(section);
  const [error, setError] = useState<string | null>(null);

  // Update local state when prop changes (e.g., after regeneration completes)
  useEffect(() => {
    setCurrentSection(section);
  }, [section]);

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

  const handleEditClick = () => {
    setEditContent(currentSection.content || '');
    setIsEditing(true);
    setError(null);
  };

  const handleCancel = () => {
    setEditContent('');
    setIsEditing(false);
    setError(null);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      const response = await fetch(`/api/playbooks/${playbookId}/sections/${currentSection.sectionId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: editContent }),
      });

      if (!response.ok) {
        throw new Error('Failed to save section');
      }

      const updatedSection: PlaybookSectionType = await response.json();
      setCurrentSection(updatedSection);
      setIsEditing(false);

      // Notify parent
      if (onSectionUpdate) {
        onSectionUpdate(currentSection.sectionId, updatedSection);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleRegenerate = async () => {
    setIsRegenerating(true);
    setError(null);

    try {
      // Trigger regeneration
      const response = await fetch(`/api/playbooks/${playbookId}/sections/${currentSection.sectionId}/regenerate`, {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to start regeneration');
      }

      // Set local status to 'generating'
      const generatingSection = { ...currentSection, status: 'generating' as const };
      setCurrentSection(generatingSection);

      // Start polling
      const pollInterval = setInterval(async () => {
        try {
          const statusResponse = await fetch(`/api/playbooks/${playbookId}/sections/${currentSection.sectionId}`);

          if (!statusResponse.ok) {
            throw new Error('Failed to fetch section status');
          }

          const updatedSection: PlaybookSectionType = await statusResponse.json();

          if (updatedSection.status === 'complete' || updatedSection.status === 'error') {
            clearInterval(pollInterval);
            setCurrentSection(updatedSection);
            setIsRegenerating(false);

            // Notify parent
            if (onSectionUpdate) {
              onSectionUpdate(currentSection.sectionId, updatedSection);
            }
          }
        } catch (err) {
          clearInterval(pollInterval);
          setError(err instanceof Error ? err.message : 'Polling failed');
          setIsRegenerating(false);
        }
      }, 2000); // Poll every 2 seconds

      // Cleanup interval after 5 minutes max
      setTimeout(() => clearInterval(pollInterval), 5 * 60 * 1000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to regenerate');
      setIsRegenerating(false);
    }
  };

  // Calculate textarea rows based on content line count
  const getTextareaRows = (content: string) => {
    const lineCount = content.split('\n').length;
    return Math.max(10, Math.min(lineCount + 2, 30)); // Min 10, max 30 rows
  };

  // Render based on section status
  if (currentSection.status === 'error') {
    return (
      <div className="border rounded-lg p-6 bg-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{currentSection.sectionLabel}</h2>
          <span className="text-xs px-2 py-1 rounded-full bg-red-100 text-red-800">
            Error
          </span>
        </div>
        <p className="text-sm text-red-600 mb-4">
          Failed to generate: {currentSection.errorMessage || 'Unknown error'}
        </p>
        {currentSection.retryable && (
          <button
            onClick={handleRegenerate}
            disabled={isRegenerating}
            className="flex items-center gap-2 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
          >
            {isRegenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Regenerating...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Regenerate
              </>
            )}
          </button>
        )}
        {error && (
          <p className="text-sm text-red-600 mt-2">{error}</p>
        )}
      </div>
    );
  }

  if (currentSection.status === 'pending' || currentSection.status === 'generating' || isRegenerating) {
    return (
      <div className="border rounded-lg p-6 bg-card">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">{currentSection.sectionLabel}</h2>
          <span className="text-xs px-2 py-1 rounded-full bg-yellow-100 text-yellow-800 capitalize flex items-center gap-1">
            <Loader2 className="h-3 w-3 animate-spin" />
            {isRegenerating ? 'Regenerating' : currentSection.status}
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

  // Complete status - render content with edit/regenerate options
  return (
    <div className="border rounded-lg p-6 bg-card">
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <h2 className="text-lg font-semibold">{currentSection.sectionLabel}</h2>
        <div className="flex items-center gap-2">
          <span className={`text-xs px-2 py-1 rounded-full capitalize ${getContentSourceColor(currentSection.contentSource)}`}>
            {currentSection.contentSource}
          </span>
          {currentSection.isEdited && (
            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800">
              Edited
            </span>
          )}
        </div>
      </div>

      {isEditing ? (
        // Edit mode
        <div className="space-y-4">
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={getTextareaRows(editContent)}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary text-sm font-mono min-h-[200px]"
            placeholder="Enter section content..."
          />
          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button
              onClick={handleCancel}
              disabled={isSaving}
              className="px-4 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        // View mode
        <>
          <div className="text-sm whitespace-pre-wrap mb-4">
            {currentSection.content || 'No content available'}
          </div>
          <div className="flex items-center gap-2 pt-4 border-t">
            <button
              onClick={handleEditClick}
              className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors"
            >
              <Pencil className="h-4 w-4" />
              Edit
            </button>
            {currentSection.retryable && (
              <button
                onClick={handleRegenerate}
                disabled={isRegenerating}
                className="flex items-center gap-2 px-3 py-2 text-sm border rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                {isRegenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Regenerating...
                  </>
                ) : (
                  <>
                    <RefreshCw className="h-4 w-4" />
                    Regenerate
                  </>
                )}
              </button>
            )}
          </div>
          {error && (
            <p className="text-sm text-red-600 mt-2">{error}</p>
          )}
        </>
      )}
    </div>
  );
}
