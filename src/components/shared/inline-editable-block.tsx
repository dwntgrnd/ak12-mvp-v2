'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface InlineEditableBlockProps {
  value: string;
  onSave: (newValue: string) => void | Promise<void>;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  'aria-label': string;
}

export function InlineEditableBlock({
  value,
  onSave,
  placeholder = 'Click to edit...',
  disabled = false,
  className,
  'aria-label': ariaLabel,
}: InlineEditableBlockProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const displayRef = useRef<HTMLDivElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout>>(undefined);

  // Sync external value changes when not editing
  useEffect(() => {
    if (!isEditing) {
      setEditValue(value);
    }
  }, [value, isEditing]);

  const enterEditMode = useCallback(() => {
    if (disabled) return;
    setIsEditing(true);
    setEditValue(value);
  }, [disabled, value]);

  const exitEditMode = useCallback(
    async (save: boolean) => {
      setIsEditing(false);
      if (save && editValue !== value) {
        setSaveStatus('saving');
        try {
          await onSave(editValue);
          setSaveStatus('saved');
          if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
          saveTimeoutRef.current = setTimeout(() => setSaveStatus('idle'), 2000);
        } catch {
          setSaveStatus('idle');
        }
      }
      // Return focus to display div
      requestAnimationFrame(() => displayRef.current?.focus());
    },
    [editValue, value, onSave]
  );

  // Focus textarea when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      textareaRef.current.focus();
      // Move cursor to end
      const len = textareaRef.current.value.length;
      textareaRef.current.setSelectionRange(len, len);
    }
  }, [isEditing]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      setEditValue(value); // discard changes
      exitEditMode(false);
    }
  };

  const handleDisplayKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      enterEditMode();
    }
  };

  const rowCount = Math.max(3, editValue.split('\n').length + 1);

  if (isEditing) {
    return (
      <div className={cn('relative', className)}>
        <Textarea
          ref={textareaRef}
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
          onBlur={() => exitEditMode(true)}
          onKeyDown={handleKeyDown}
          rows={rowCount}
          aria-label={ariaLabel}
          className="resize-y"
        />
      </div>
    );
  }

  return (
    <div className={cn('relative group', className)}>
      <div
        ref={displayRef}
        role={disabled ? undefined : 'button'}
        tabIndex={disabled ? undefined : 0}
        aria-label={disabled ? undefined : ariaLabel}
        onClick={enterEditMode}
        onKeyDown={disabled ? undefined : handleDisplayKeyDown}
        className={cn(
          'whitespace-pre-wrap rounded-md px-3 py-2 text-foreground transition-colors',
          !disabled && 'cursor-text border border-transparent hover:border-border hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
          disabled && 'cursor-default',
          !value && 'text-foreground-secondary'
        )}
      >
        {value || placeholder}
      </div>
      {saveStatus !== 'idle' && (
        <span
          className={cn(
            'absolute right-2 top-2 text-xs transition-opacity',
            saveStatus === 'saving' && 'text-foreground-secondary',
            saveStatus === 'saved' && 'text-success'
          )}
        >
          {saveStatus === 'saving' ? 'Saving...' : 'Saved'}
        </span>
      )}
    </div>
  );
}
