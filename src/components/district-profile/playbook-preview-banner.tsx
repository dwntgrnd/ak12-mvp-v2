'use client';

import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface PlaybookPreviewBannerProps {
  defaultName: string;
  onSave: (name: string) => void;
  onDiscard: () => void;
  saving?: boolean;
}

export function PlaybookPreviewBanner({
  defaultName,
  onSave,
  onDiscard,
  saving = false,
}: PlaybookPreviewBannerProps) {
  const [name, setName] = useState(defaultName);

  return (
    <div
      role="status"
      aria-live="polite"
      className="mt-6 rounded-md p-4"
      style={{ backgroundColor: 'rgba(251,191,36,0.08)', borderLeft: '3px solid var(--warning)' }}
    >
      <div className="flex items-center gap-2 mb-3">
        <AlertTriangle className="h-4 w-4 text-warning shrink-0" />
        <span className="text-sm font-semibold text-foreground">
          Playbook Preview — not yet saved
        </span>
      </div>

      <div className="flex items-end gap-3">
        <div className="flex-1">
          <label
            htmlFor="playbook-preview-name"
            className="text-xs font-medium text-foreground-secondary mb-1 block"
          >
            Name
          </label>
          <Input
            id="playbook-preview-name"
            aria-label="Playbook name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            disabled={saving}
          />
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={onDiscard}
            disabled={saving}
          >
            Discard
          </Button>
          <Button
            size="sm"
            onClick={() => onSave(name)}
            disabled={saving || !name.trim()}
          >
            {saving ? 'Saving…' : 'Save Playbook'}
          </Button>
        </div>
      </div>
    </div>
  );
}
