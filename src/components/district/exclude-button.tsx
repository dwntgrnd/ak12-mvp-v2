'use client';

import { useState } from 'react';
import { XCircle } from 'lucide-react';
import { ExcludeModal } from './exclude-modal';

interface ExcludeButtonProps {
  districtId: string;
  onExcluded?: () => void;
}

export function ExcludeButton({ districtId, onExcluded }: ExcludeButtonProps) {
  const [showModal, setShowModal] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowModal(true);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="p-2 rounded-md text-muted-foreground hover:bg-muted transition-colors"
        title="Exclude district"
      >
        <XCircle className="h-5 w-5" />
      </button>

      {showModal && (
        <ExcludeModal
          districtId={districtId}
          onClose={() => setShowModal(false)}
          onExcluded={onExcluded}
        />
      )}
    </>
  );
}
