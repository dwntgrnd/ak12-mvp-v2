'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Bookmark, FileText, Search } from 'lucide-react';
import type { DistrictProfile } from '@/services/types/district';
import { cn } from '@/lib/utils';

interface QuickActionsPanelProps {
  district: DistrictProfile;
  productId?: string;
  onGeneratePlaybook: () => void;
}

export function QuickActionsPanel({
  district,
  onGeneratePlaybook,
}: QuickActionsPanelProps) {
  const router = useRouter();
  const [isSaved, setIsSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  async function handleToggleSave() {
    if (isSaving) return;
    setIsSaving(true);

    // Optimistic update
    const wasSaved = isSaved;
    setIsSaved(!wasSaved);

    try {
      const res = await fetch(`/api/districts/${district.districtId}/save`, {
        method: wasSaved ? 'DELETE' : 'POST',
      });
      if (!res.ok) {
        // Revert on failure
        setIsSaved(wasSaved);
      }
    } catch {
      setIsSaved(wasSaved);
    } finally {
      setIsSaving(false);
    }
  }

  const actions = [
    {
      icon: Bookmark,
      label: isSaved ? 'Remove from Saved' : 'Save District',
      subtitle: isSaved ? 'Remove from your saved list' : 'Add to your saved districts',
      iconBg: 'bg-blue-100 text-blue-600',
      onClick: handleToggleSave,
    },
    {
      icon: FileText,
      label: 'Create District Playbook',
      subtitle: 'Create AI-powered playbook',
      iconBg: 'bg-orange-100 text-orange-600',
      onClick: onGeneratePlaybook,
    },
    {
      icon: Search,
      label: 'Find Similar Districts',
      subtitle: 'Search 10,000+ districts',
      iconBg: 'bg-green-100 text-green-600',
      onClick: () => router.push('/discovery'),
    },
  ];

  return (
    <div className="space-y-2">
      {actions.map((action) => (
        <button
          key={action.label}
          onClick={action.onClick}
          className={cn(
            'flex w-full items-center gap-3 rounded-lg border p-3',
            'hover:bg-muted/50 transition-colors cursor-pointer text-left'
          )}
        >
          <div className={cn('flex h-9 w-9 shrink-0 items-center justify-center rounded-full', action.iconBg)}>
            <action.icon className="h-4 w-4" />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium">{action.label}</p>
            <p className="text-xs text-muted-foreground">{action.subtitle}</p>
          </div>
        </button>
      ))}
    </div>
  );
}
