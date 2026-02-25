'use client';

import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Pencil, Trash2, Upload, FileText, Image, X, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PlaybookNote, PlaybookAttachment } from '@/services/types/playbook';

interface PlaybookNotesTabProps {
  playbookId: string;
  notes: PlaybookNote[];
  attachments: PlaybookAttachment[];
  onAddNote: (content: string) => Promise<void>;
  onUpdateNote: (noteId: string, content: string) => Promise<void>;
  onDeleteNote: (noteId: string) => Promise<void>;
  onAddAttachment: (file: File) => Promise<void>;
  onRemoveAttachment: (attachmentId: string) => Promise<void>;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_TYPES = '.pdf,.doc,.docx,.xls,.xlsx,.png,.jpg,.jpeg,.gif';

function formatRelativeTime(isoDate: string): string {
  const now = Date.now();
  const then = new Date(isoDate).getTime();
  const diffMs = now - then;
  const diffMin = Math.floor(diffMs / 60000);
  if (diffMin < 1) return 'Just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;
  const diffDays = Math.floor(diffHr / 24);
  return `${diffDays}d ago`;
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(fileType: string) {
  if (fileType.startsWith('image/')) return Image;
  return FileText;
}

export function PlaybookNotesTab({
  notes,
  attachments,
  onAddNote,
  onUpdateNote,
  onDeleteNote,
  onAddAttachment,
  onRemoveAttachment,
}: PlaybookNotesTabProps) {
  // Notes state
  const [isAdding, setIsAdding] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // File state
  const [fileError, setFileError] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const addTextareaRef = useRef<HTMLTextAreaElement>(null);

  // --- Notes handlers ---

  const handleStartAdd = useCallback(() => {
    setIsAdding(true);
    setNewNoteContent('');
    setTimeout(() => addTextareaRef.current?.focus(), 0);
  }, []);

  const handleCancelAdd = useCallback(() => {
    setIsAdding(false);
    setNewNoteContent('');
  }, []);

  const handleSaveNewNote = useCallback(async () => {
    if (!newNoteContent.trim() || saving) return;
    setSaving(true);
    try {
      await onAddNote(newNoteContent.trim());
      setIsAdding(false);
      setNewNoteContent('');
    } finally {
      setSaving(false);
    }
  }, [newNoteContent, saving, onAddNote]);

  const handleStartEdit = useCallback((note: PlaybookNote) => {
    setEditingNoteId(note.noteId);
    setEditContent(note.content);
  }, []);

  const handleCancelEdit = useCallback(() => {
    setEditingNoteId(null);
    setEditContent('');
  }, []);

  const handleSaveEdit = useCallback(async () => {
    if (!editingNoteId || !editContent.trim() || saving) return;
    setSaving(true);
    try {
      await onUpdateNote(editingNoteId, editContent.trim());
      setEditingNoteId(null);
      setEditContent('');
    } finally {
      setSaving(false);
    }
  }, [editingNoteId, editContent, saving, onUpdateNote]);

  const handleConfirmDelete = useCallback(async (noteId: string) => {
    setSaving(true);
    try {
      await onDeleteNote(noteId);
      setDeletingNoteId(null);
    } finally {
      setSaving(false);
    }
  }, [onDeleteNote]);

  // --- File handlers ---

  const processFile = useCallback(async (file: File) => {
    setFileError(null);
    if (file.size > MAX_FILE_SIZE) {
      setFileError(`File "${file.name}" exceeds the 5 MB size limit. Please choose a smaller file.`);
      return;
    }
    setUploading(true);
    try {
      await onAddAttachment(file);
    } finally {
      setUploading(false);
    }
  }, [onAddAttachment]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    // Reset input so the same file can be re-selected
    e.target.value = '';
  }, [processFile]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, [processFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  return (
    <div className="space-y-0">
      {/* Notes Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-subsection-heading font-semibold text-foreground">Notes</h3>
          {!isAdding && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleStartAdd}
              aria-label="Add a new note"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add
            </Button>
          )}
        </div>

        {/* Add note form */}
        {isAdding && (
          <div className="mb-4 space-y-2">
            <textarea
              ref={addTextareaRef}
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Write your note..."
              className="w-full min-h-[100px] rounded-md border border-border-default bg-surface-raised px-3 py-2 text-sm text-foreground placeholder:text-foreground-tertiary focus:outline-none focus:ring-2 focus:ring-ring resize-y"
              aria-label="New note content"
            />
            <div className="flex gap-2">
              <Button
                size="sm"
                onClick={handleSaveNewNote}
                disabled={!newNoteContent.trim() || saving}
              >
                Save
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCancelAdd}
                disabled={saving}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* Notes list */}
        {notes.length > 0 ? (
          <div role="list" aria-label="Notes" className="space-y-3">
            {notes.map((note) => (
              <div
                key={note.noteId}
                role="listitem"
                className="bg-surface-inset rounded-md p-4"
              >
                {editingNoteId === note.noteId ? (
                  <div className="space-y-2">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="w-full min-h-[100px] rounded-md border border-border-default bg-surface-raised px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
                      aria-label="Edit note content"
                      autoFocus
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={handleSaveEdit}
                        disabled={!editContent.trim() || saving}
                      >
                        Save
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleCancelEdit}
                        disabled={saving}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : deletingNoteId === note.noteId ? (
                  <div className="space-y-2">
                    <p className="text-sm text-foreground">Delete this note?</p>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleConfirmDelete(note.noteId)}
                        disabled={saving}
                        className="text-destructive hover:text-destructive"
                        aria-label="Confirm delete note"
                      >
                        Yes
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeletingNoteId(null)}
                        disabled={saving}
                        aria-label="Cancel delete note"
                      >
                        No
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-sm text-foreground whitespace-pre-wrap">{note.content}</p>
                    <div className="flex items-center justify-between mt-3">
                      <span className="text-xs font-medium tracking-wide text-foreground-secondary">
                        {note.updatedAt !== note.createdAt
                          ? `Edited ${formatRelativeTime(note.updatedAt)}`
                          : formatRelativeTime(note.createdAt)}
                      </span>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleStartEdit(note)}
                          aria-label={`Edit note from ${formatRelativeTime(note.createdAt)}`}
                          className="h-7 w-7 p-0"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setDeletingNoteId(note.noteId)}
                          aria-label={`Delete note from ${formatRelativeTime(note.createdAt)}`}
                          className="h-7 w-7 p-0"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        ) : !isAdding ? (
          <p className="text-sm text-foreground-secondary py-4">
            No notes yet. Add notes about your meeting prep, follow-up items, or key observations.
          </p>
        ) : null}
      </div>

      {/* Files Section */}
      <div className="border-t border-border-default pt-6 mt-6">
        <h3 className="text-subsection-heading font-semibold text-foreground mb-3">Files</h3>

        {/* Drop zone */}
        <div
          className={cn(
            'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
            isDragOver
              ? 'border-primary bg-surface-emphasis'
              : 'border-border-default hover:border-foreground-tertiary'
          )}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              fileInputRef.current?.click();
            }
          }}
          role="button"
          tabIndex={0}
          aria-label="Upload file. Click or drag and drop"
        >
          <Upload className="h-6 w-6 mx-auto mb-2 text-foreground-tertiary" />
          <p className="text-sm text-foreground-secondary">
            {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
          </p>
          <p className="text-xs text-foreground-tertiary mt-1">
            PDF, Word, Excel, or images up to 5 MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept={ACCEPTED_TYPES}
            onChange={handleFileSelect}
            className="hidden"
            aria-hidden="true"
          />
        </div>

        {/* File size error */}
        {fileError && (
          <Alert variant="destructive" className="mt-3">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{fileError}</AlertDescription>
          </Alert>
        )}

        {/* File list */}
        {attachments.length > 0 && (
          <div role="list" aria-label="Attached files" className="mt-4 space-y-2">
            {attachments.map((att) => {
              const IconComponent = getFileIcon(att.fileType);
              return (
                <div
                  key={att.attachmentId}
                  role="listitem"
                  className="flex items-center gap-3 bg-surface-inset rounded-md px-3 py-2"
                >
                  <IconComponent className="h-4 w-4 text-foreground-secondary shrink-0" />
                  <div className="flex-1 min-w-0">
                    {att.dataUrl ? (
                      <a
                        href={att.dataUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-primary underline decoration-primary/30 underline-offset-2 hover:decoration-primary truncate block"
                      >
                        {att.fileName}
                      </a>
                    ) : (
                      <span className="text-sm text-foreground truncate block">{att.fileName}</span>
                    )}
                  </div>
                  <span className="text-xs text-foreground-tertiary shrink-0">
                    {formatFileSize(att.fileSize)}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveAttachment(att.attachmentId)}
                    aria-label={`Remove ${att.fileName}`}
                    className="h-7 w-7 p-0 shrink-0"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
