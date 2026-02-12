'use client';

import { useState } from 'react';
import { Bookmark } from 'lucide-react';

interface SaveButtonProps {
  districtId: string;
  initialSaved?: boolean;
  onStatusChange?: (saved: boolean) => void;
}

export function SaveButton({
  districtId,
  initialSaved = false,
  onStatusChange,
}: SaveButtonProps) {
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  const handleClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    setLoading(true);
    try {
      const method = saved ? 'DELETE' : 'POST';
      const response = await fetch(`/api/districts/${districtId}/save`, {
        method,
      });

      if (!response.ok) {
        throw new Error(`Failed to ${saved ? 'unsave' : 'save'} district`);
      }

      const newSaved = !saved;
      setSaved(newSaved);
      onStatusChange?.(newSaved);
    } catch (error) {
      console.error('Error toggling save status:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className={`p-2 rounded-md transition-colors ${
        saved
          ? 'text-primary hover:bg-primary/10'
          : 'text-muted-foreground hover:bg-muted'
      } disabled:opacity-50 disabled:cursor-not-allowed`}
      title={saved ? 'Remove from saved' : 'Save district'}
    >
      <Bookmark
        className="h-5 w-5"
        fill={saved ? 'currentColor' : 'none'}
      />
    </button>
  );
}
