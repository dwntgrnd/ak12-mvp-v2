'use client';

import { useEffect, useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Skeleton } from '@/components/ui/skeleton';
import { Button } from '@/components/ui/button';

export default function PlaybookRedirectPage({
  params,
}: {
  params: Promise<{ playbookId: string }>;
}) {
  const { playbookId } = use(params);
  const router = useRouter();
  const [error, setError] = useState(false);

  useEffect(() => {
    let cancelled = false;

    fetch(`/api/playbooks/${playbookId}`)
      .then((res) => {
        if (!res.ok) throw new Error('Not found');
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          router.replace(`/districts/${data.districtId}/playbooks/${playbookId}`);
        }
      })
      .catch(() => {
        if (!cancelled) setError(true);
      });

    return () => { cancelled = true; };
  }, [playbookId, router]);

  if (error) {
    return (
      <div className="text-center py-16">
        <h2 className="text-lg font-semibold text-foreground mb-2">
          Playbook not found
        </h2>
        <p className="text-foreground-secondary mb-4">
          This playbook may have been deleted or doesn&apos;t exist.
        </p>
        <Button variant="outline" asChild>
          <Link href="/playbooks">Back to Playbooks</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}
