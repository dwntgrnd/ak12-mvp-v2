'use client';

import { useCallback, useState } from 'react';
import { Copy, Check, RotateCcw } from 'lucide-react';

interface TokenEditorDiffOutputProps {
  diff: string;
  changeCount: number;
  onResetAll: () => void;
}

export function TokenEditorDiffOutput({
  diff,
  changeCount,
  onResetAll,
}: TokenEditorDiffOutputProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(diff);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [diff]);

  if (changeCount === 0) {
    return (
      <div className="te-diff-empty">
        No changes yet. Modify tokens above to see a diff.
      </div>
    );
  }

  return (
    <div className="te-diff">
      <div className="te-diff-header">
        <span className="te-diff-title">
          {changeCount} change{changeCount !== 1 ? 's' : ''}
        </span>
        <div className="te-diff-actions">
          <button
            type="button"
            className="te-btn te-btn-secondary"
            onClick={onResetAll}
          >
            <RotateCcw size={12} />
            Reset All
          </button>
          <button
            type="button"
            className="te-btn te-btn-primary"
            onClick={handleCopy}
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? 'Copied!' : 'Copy Changes'}
          </button>
        </div>
      </div>
      <pre className="te-diff-content">{diff}</pre>
    </div>
  );
}
