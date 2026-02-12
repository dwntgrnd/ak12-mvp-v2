'use client';

import { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, Clock, XCircle } from 'lucide-react';
import type { PlaybookStatusResponse } from '@/services/types/playbook';

interface GenerationStatusProps {
  playbookId: string;
  initialStatus: PlaybookStatusResponse;
}

export function GenerationStatus({ playbookId, initialStatus }: GenerationStatusProps) {
  const [status, setStatus] = useState<PlaybookStatusResponse>(initialStatus);

  useEffect(() => {
    // Only poll if we're still generating
    if (status.overallStatus !== 'generating') {
      return;
    }

    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/playbooks/${playbookId}/status`);
        if (response.ok) {
          const data: PlaybookStatusResponse = await response.json();
          setStatus(data);

          // Stop polling when generation completes
          if (data.overallStatus === 'complete' || data.overallStatus === 'partial') {
            clearInterval(pollInterval);
            // Reload to show full content
            window.location.reload();
          }
        }
      } catch (error) {
        console.error('Failed to fetch playbook status:', error);
      }
    }, 2000);

    return () => clearInterval(pollInterval);
  }, [playbookId, status.overallStatus]);

  const getStatusIcon = (sectionStatus: string) => {
    switch (sectionStatus) {
      case 'complete':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      case 'generating':
        return <Loader2 className="h-4 w-4 text-yellow-600 animate-spin" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-600" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4 text-gray-400" />;
    }
  };

  const getSectionLabel = (sectionType: string) => {
    const labels: Record<string, string> = {
      key_themes: 'Key Themes',
      product_fit: 'Product Fit',
      objections: 'Objections',
      stakeholders: 'Stakeholders',
      district_data: 'District Data',
      fit_assessment: 'Fit Assessment'
    };
    return labels[sectionType] || sectionType;
  };

  return (
    <div className="border rounded-lg p-6 bg-card">
      <h2 className="text-lg font-semibold mb-2">Generating playbook...</h2>
      <p className="text-sm text-muted-foreground mb-4">
        Status: <span className="font-medium capitalize">{status.overallStatus}</span>
      </p>

      <div className="space-y-3">
        {status.sections.map((section) => (
          <div key={section.sectionId} className="flex items-center gap-3">
            {getStatusIcon(section.status)}
            <span className="text-sm">
              {getSectionLabel(section.sectionType)}
            </span>
            <span className="text-xs text-muted-foreground capitalize ml-auto">
              {section.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
