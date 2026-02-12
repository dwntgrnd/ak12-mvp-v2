'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import { EXCLUSION_CATEGORIES } from '@/services/types/controlled-vocabulary';
import type { ExclusionCategory } from '@/services/types/controlled-vocabulary';

interface ExcludeModalProps {
  districtId: string;
  onClose: () => void;
  onExcluded?: () => void;
}

const CATEGORY_LABELS: Record<ExclusionCategory, string> = {
  already_customer: 'Already a customer',
  not_a_fit: 'Not a fit',
  budget_timing: 'Budget/timing issue',
  other: 'Other',
};

export function ExcludeModal({
  districtId,
  onClose,
  onExcluded,
}: ExcludeModalProps) {
  const [category, setCategory] = useState<ExclusionCategory | ''>('');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!category) return;

    // Validate that note is required for 'other' category
    if (category === 'other' && !note.trim()) {
      setError('Please add a note for "Other" category');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/districts/${districtId}/exclude`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category,
          note: note.trim() || undefined,
        }),
      });

      if (response.status === 409) {
        setError('This district is already excluded');
        setLoading(false);
        return;
      }

      if (!response.ok) {
        throw new Error('Failed to exclude district');
      }

      onExcluded?.();
      onClose();
    } catch (err) {
      setError('An error occurred. Please try again.');
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-card border rounded-lg p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold font-heading">
            Exclude District
          </h2>
          <button
            onClick={onClose}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Category selection */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Reason for exclusion
              </label>
              <div className="space-y-2">
                {EXCLUSION_CATEGORIES.map((cat) => (
                  <label
                    key={cat}
                    className="flex items-center gap-2 cursor-pointer"
                  >
                    <input
                      type="radio"
                      name="category"
                      value={cat}
                      checked={category === cat}
                      onChange={(e) =>
                        setCategory(e.target.value as ExclusionCategory)
                      }
                      className="text-primary focus:ring-primary"
                    />
                    <span className="text-sm">{CATEGORY_LABELS[cat]}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Note field */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Note {category === 'other' && <span className="text-destructive">*</span>}
              </label>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note (optional)"
                rows={3}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary bg-background"
              />
            </div>

            {/* Error display */}
            {error && (
              <div className="text-sm text-destructive bg-destructive/10 p-2 rounded">
                {error}
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!category || loading}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? 'Excluding...' : 'Exclude'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
