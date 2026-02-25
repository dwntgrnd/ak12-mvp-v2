'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { X, Loader2, MoreHorizontal, Pencil } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { modeColors } from '@/lib/design-tokens';
import type { ModeKey } from '@/lib/design-tokens';
import type { ProductLensSummary } from '@/services/types/product';
import { useProductLens } from '@/hooks/use-product-lens';
import { useSubjectFilter } from '@/hooks/use-subject-filter';
import { useLibraryReadiness } from '@/hooks/use-library-readiness';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from '@/components/ui/alert-dialog';

interface ModeBarProps {
  districtId: string;
  districtName: string;
  activePlaybookId?: string;
  activePlaybookName?: string;
  activePlaybookStatus?: string;
  isPreviewActive?: boolean;
  generationStatus?: 'idle' | 'generating' | 'preview';
  onGeneratePlaybook?: () => void;
  onSavePlaybook?: () => void;
  onDiscardPlaybook?: () => void;
  onDeletePlaybook?: () => void;
  onRegenerateAll?: () => void;
  onRenamePlaybook?: (newName: string) => void;
}

export function ModeBar({
  districtId,
  activePlaybookId,
  activePlaybookName,
  isPreviewActive = false,
  generationStatus,
  onGeneratePlaybook,
  onSavePlaybook,
  onDiscardPlaybook,
  onDeletePlaybook,
  onRegenerateAll,
  onRenamePlaybook,
}: ModeBarProps) {
  const { activeProduct, clearProduct, isLensActive } = useProductLens();
  const { activeSubject, isFilterActive: isSubjectActive, clearSubject } = useSubjectFilter();
  const readiness = useLibraryReadiness();

  // Delete confirmation dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  // Inline rename state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editValue, setEditValue] = useState(activePlaybookName ?? '');
  const renameInputRef = useRef<HTMLInputElement>(null);

  // Sync editValue when activePlaybookName changes externally
  useEffect(() => {
    if (!isEditingName) {
      setEditValue(activePlaybookName ?? '');
    }
  }, [activePlaybookName, isEditingName]);

  // Focus the input when entering edit mode
  useEffect(() => {
    if (isEditingName) {
      renameInputRef.current?.focus();
      renameInputRef.current?.select();
    }
  }, [isEditingName]);

  const commitRename = () => {
    const trimmed = editValue.trim();
    if (trimmed && trimmed !== activePlaybookName) {
      onRenamePlaybook?.(trimmed);
    } else {
      setEditValue(activePlaybookName ?? '');
    }
    setIsEditingName(false);
  };

  const cancelRename = () => {
    setEditValue(activePlaybookName ?? '');
    setIsEditingName(false);
  };

  let mode: ModeKey;
  if (activePlaybookId) {
    mode = 'playbook';
  } else if (isPreviewActive && (generationStatus === 'generating' || generationStatus === 'preview')) {
    mode = 'preview';
  } else if (isLensActive) {
    mode = 'lens';
  } else if (isSubjectActive) {
    mode = 'subject';
  } else {
    mode = 'neutral';
  }

  const colors = modeColors[mode];

  return (
    <div
      className={cn(
        'flex items-center gap-4 px-4 py-3',
        colors.bg,
        colors.border,
        mode === 'neutral' || mode === 'subject' ? 'border-b' : 'border-b-2',
        mode === 'preview' && 'border-dashed',
      )}
    >
      {/* Left — Mode indicator */}
      <div className="flex items-center gap-2 shrink-0">
        {(mode === 'neutral' || mode === 'subject') && (
          <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
            District Intelligence
            {isSubjectActive && (
              <>
                <span className="text-foreground-secondary">·</span>
                <span>{activeSubject}</span>
                <button
                  onClick={clearSubject}
                  className="rounded p-0.5 hover:bg-surface-inset"
                  aria-label="Clear subject filter"
                >
                  <X className="h-3.5 w-3.5 text-foreground-secondary" />
                </button>
              </>
            )}
          </span>
        )}
        {mode === 'lens' && (
          <>
            <span className={cn('text-sm font-semibold', colors.text)}>
              {activeProduct?.name} Lens
            </span>
            <button
              onClick={clearProduct}
              className="rounded p-0.5 hover:bg-surface-inset"
              aria-label="Dismiss lens"
            >
              <X className="h-3.5 w-3.5 text-foreground-secondary" />
            </button>
          </>
        )}
        {mode === 'playbook' && (
          <>
            <span className={cn('text-sm font-semibold', colors.text)}>
              Playbook:{' '}
            </span>
            {isEditingName ? (
              <Input
                ref={renameInputRef}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') commitRename();
                  if (e.key === 'Escape') cancelRename();
                }}
                onBlur={commitRename}
                className="h-7 w-48 text-sm font-semibold"
              />
            ) : (
              <button
                type="button"
                className="group/rename inline-flex items-center gap-1"
                onClick={() => setIsEditingName(true)}
              >
                <span className={cn('text-sm font-semibold', colors.text)}>
                  {activePlaybookName}
                </span>
                <Pencil className="h-3 w-3 text-foreground-tertiary opacity-0 group-hover/rename:opacity-100 transition-opacity" />
              </button>
            )}
            <Link
              href={`/districts/${districtId}`}
              className="text-xs text-foreground-secondary underline decoration-foreground-tertiary underline-offset-2 hover:text-foreground"
            >
              Back to District
            </Link>
          </>
        )}
        {mode === 'preview' && generationStatus === 'generating' && (
          <span className={cn('flex items-center gap-2 text-sm font-semibold', colors.text)}>
            <Loader2 className="h-4 w-4 animate-spin" />
            Generating Preview…
          </span>
        )}
        {mode === 'preview' && generationStatus === 'preview' && (
          <>
            <span className={cn('text-sm font-semibold', colors.text)}>
              Preview: {activeProduct?.name}
            </span>
            <span className="inline-flex items-center rounded-md bg-[#FFC205]/15 px-2 py-0.5 text-xs font-medium text-[#92710A]">
              Unsaved
            </span>
          </>
        )}
      </div>

      {/* Center — Subject picker + Lens picker (neutral, subject, lens modes only) */}
      {(mode === 'neutral' || mode === 'subject' || mode === 'lens') && (
        <div className="flex items-center gap-3 shrink-0">
          {readiness.loading ? (
            <Skeleton className="h-9 w-56" />
          ) : (
            <>
              <SubjectPicker
                products={readiness.products}
                disabled={isPreviewActive}
              />
              <LensPicker
                products={readiness.products}
                activeProductId={activeProduct?.productId ?? ''}
                isLensActive={isLensActive}
                disabled={isPreviewActive}
              />
            </>
          )}
        </div>
      )}

      {/* Spacer */}
      <div className="flex-1" />

      {/* Right — Actions */}
      <div className="flex items-center gap-2 shrink-0">
        {(mode === 'neutral' || mode === 'subject') && (
          <Button size="sm" disabled>
            Generate Playbook
          </Button>
        )}
        {mode === 'lens' && (
          <Button
            size="sm"
            onClick={onGeneratePlaybook}
            disabled={isPreviewActive}
          >
            Generate Playbook
          </Button>
        )}
        {mode === 'playbook' && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Playbook actions</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onRegenerateAll?.()}>
                Regenerate All Sections
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                className="text-destructive focus:text-destructive"
                onClick={() => setDeleteDialogOpen(true)}
              >
                Delete Playbook
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        {mode === 'preview' && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={onDiscardPlaybook}
            >
              Discard
            </Button>
            <Button
              size="sm"
              onClick={onSavePlaybook}
              disabled={generationStatus === 'generating'}
            >
              Save Playbook
            </Button>
          </>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this playbook?</AlertDialogTitle>
            <AlertDialogDescription>
              This can&apos;t be undone. The playbook and all its sections will be permanently removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                onDeletePlaybook?.();
                setDeleteDialogOpen(false);
              }}
            >
              Continue
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}

/** Subject filter picker */
function SubjectPicker({
  products,
  disabled,
}: {
  products: ProductLensSummary[];
  disabled?: boolean;
}) {
  const { activeSubject, setSubject, clearSubject } = useSubjectFilter();

  const subjects = [...new Set(products.map((p) => p.category).filter(Boolean))].sort();

  const handleValueChange = (value: string) => {
    if (value === '__all__') {
      clearSubject();
    } else {
      setSubject(value);
    }
  };

  return (
    <Select
      value={activeSubject ?? '__all__'}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-44">
        <SelectValue placeholder="All Subjects" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="__all__">All Subjects</SelectItem>
        {subjects.map((s) => (
          <SelectItem key={s} value={s}>
            {s}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/** Extracted lens picker to keep ModeBar clean */
function LensPicker({
  products,
  activeProductId,
  isLensActive,
  disabled,
}: {
  products: ProductLensSummary[];
  activeProductId: string;
  isLensActive: boolean;
  disabled?: boolean;
}) {
  const { setProduct, clearProduct } = useProductLens();
  const { setSubject } = useSubjectFilter();

  const handleValueChange = (value: string) => {
    if (value === '__clear__') {
      clearProduct();
      return;
    }
    const product = products.find(p => p.productId === value);
    if (product) {
      setProduct(product);
      if (product.category) {
        setSubject(product.category);
      }
    }
  };

  return (
    <Select
      value={activeProductId}
      onValueChange={handleValueChange}
      disabled={disabled}
    >
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select a product lens…" />
      </SelectTrigger>
      <SelectContent>
        {isLensActive && (
          <SelectItem value="__clear__">
            <span className="text-foreground-secondary">Clear selection</span>
          </SelectItem>
        )}
        {products.map(p => (
          <SelectItem key={p.productId} value={p.productId}>
            {p.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
