'use client';

import { useRouter } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogAction,
} from '@/components/ui/alert-dialog';

interface LibraryRequiredDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LibraryRequiredDialog({ open, onOpenChange }: LibraryRequiredDialogProps) {
  const router = useRouter();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="text-lg font-semibold tracking-[-0.01em] text-foreground">
            Product Library Required
          </AlertDialogTitle>
          <AlertDialogDescription className="text-sm leading-[1.6] text-muted-foreground">
            Playbook generation creates product-specific talking points, objection
            handling, and proof-of-fit evidence. Add at least one product to your
            Solutions Library to generate playbooks.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-brand-orange text-white font-semibold hover:bg-brand-orange/90"
            onClick={() => router.push('/solutions-library')}
          >
            Go to Solutions Library
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
