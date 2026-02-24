'use client';

import { FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface EmptyPlaybooksStateProps {
  onCreateClick: () => void;
}

export function EmptyPlaybooksState({ onCreateClick }: EmptyPlaybooksStateProps) {
  return (
    <div className="flex flex-col items-center text-center pt-20">
      <FileText className="h-12 w-12 text-foreground-tertiary" aria-hidden="true" />
      <h2 className="text-xl font-semibold mt-4">Build your first playbook</h2>
      <p className="text-sm text-foreground-secondary mt-2 max-w-md">
        Generate an AI-powered sales playbook tailored to a specific district and your products.
      </p>
      <Button
        size="lg"
        className="h-12 px-8 mt-6"
        onClick={onCreateClick}
      >
        Generate Playbook
      </Button>
    </div>
  );
}
