'use client';

import { useState } from 'react';
import { RotateCcw, AlertCircle, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

interface PlaybookSectionProps {
  sectionId: string;
  sectionLabel: string;
  status: 'pending' | 'generating' | 'complete' | 'error';
  isEdited: boolean;
  lastEditedAt?: string;
  generatedAt?: string;
  errorMessage?: string;
  retryable?: boolean;
  onRegenerate?: () => void;
  children: React.ReactNode;
}

function StatusIndicator({
  status,
  isEdited,
}: {
  status: PlaybookSectionProps['status'];
  isEdited: boolean;
}) {
  switch (status) {
    case 'pending':
      return (
        <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <span className="inline-block h-2 w-2 rounded-full bg-muted-foreground" />
          Pending
        </span>
      );
    case 'generating':
      return (
        <span className="flex items-center gap-1.5 text-sm text-primary">
          <span className="inline-block h-2 w-2 rounded-full bg-primary animate-pulse" />
          Generating...
        </span>
      );
    case 'complete':
      if (!isEdited) {
        return (
          <span className="flex items-center gap-1.5 text-sm text-success">
            <Check className="h-3.5 w-3.5" />
            Complete
          </span>
        );
      }
      return null;
    case 'error':
      return (
        <span className="flex items-center gap-1.5 text-sm text-destructive">
          <span className="inline-block h-2 w-2 rounded-full bg-destructive" />
          Error
        </span>
      );
    default:
      return null;
  }
}

function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function SkeletonContent({ animated }: { animated: boolean }) {
  return (
    <div className="space-y-3">
      <Skeleton className={`h-4 w-full ${animated ? '' : 'animate-none'}`} />
      <Skeleton className={`h-4 w-[90%] ${animated ? '' : 'animate-none'}`} />
      <Skeleton className={`h-4 w-[95%] ${animated ? '' : 'animate-none'}`} />
      <Skeleton className={`h-4 w-[60%] ${animated ? '' : 'animate-none'}`} />
    </div>
  );
}

export function PlaybookSection({
  sectionLabel,
  status,
  isEdited,
  lastEditedAt,
  generatedAt,
  errorMessage,
  onRegenerate,
  children,
}: PlaybookSectionProps) {
  const [confirmOpen, setConfirmOpen] = useState(false);

  const showRegenerate = status === 'complete' || status === 'error';

  const handleRegenerateClick = () => {
    if (isEdited) {
      setConfirmOpen(true);
    } else {
      onRegenerate?.();
    }
  };

  return (
    <div>
      {/* Section header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-foreground">{sectionLabel}</h2>
        <div className="flex items-center gap-3">
          <StatusIndicator status={status} isEdited={isEdited} />
          {showRegenerate && onRegenerate && (
            <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRegenerateClick}
                aria-label={`Regenerate ${sectionLabel} section`}
              >
                <RotateCcw className="h-3.5 w-3.5" />
                Regenerate
              </Button>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Regenerate section?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Regenerating will replace your edits to this section. This
                    can&apos;t be undone.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    onClick={() => {
                      onRegenerate();
                      setConfirmOpen(false);
                    }}
                  >
                    Regenerate
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>

      {/* Content area */}
      {status === 'pending' && <SkeletonContent animated={false} />}
      {status === 'generating' && <SkeletonContent animated={true} />}
      {status === 'error' && errorMessage && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}
      {status === 'complete' && children}

      {/* Metadata footer */}
      {status === 'complete' && (
        <div className="text-sm text-muted-foreground mt-6 pt-4 border-t border-border">
          {isEdited && lastEditedAt
            ? `Edited ${formatDate(lastEditedAt)}`
            : generatedAt
              ? `Generated ${formatDate(generatedAt)}`
              : null}
        </div>
      )}
    </div>
  );
}
