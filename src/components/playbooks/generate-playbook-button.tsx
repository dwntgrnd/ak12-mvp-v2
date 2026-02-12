'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X, Loader2 } from 'lucide-react';
import { ProductSelector } from './product-selector';

interface GeneratePlaybookButtonProps {
  districtId: string;
  districtName: string;
}

export function GeneratePlaybookButton({ districtId, districtName }: GeneratePlaybookButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setSelectedProductIds([]);
    setError(null);
  };

  const handleCloseModal = () => {
    if (!isGenerating) {
      setIsModalOpen(false);
      setSelectedProductIds([]);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (selectedProductIds.length === 0) {
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/playbooks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          districtId,
          productIds: selectedProductIds,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to generate playbook');
      }

      const data = await response.json();
      const playbookId = data.playbookId;

      // Redirect to the playbook detail page
      router.push(`/playbooks/${playbookId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate playbook');
      setIsGenerating(false);
    }
  };

  return (
    <>
      <button
        onClick={handleOpenModal}
        className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium text-sm"
      >
        Generate Playbook
      </button>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between p-6 border-b">
              <h2 className="text-xl font-semibold font-heading">
                Generate Playbook for {districtName}
              </h2>
              <button
                onClick={handleCloseModal}
                disabled={isGenerating}
                className="p-1 hover:bg-gray-100 rounded-md transition-colors disabled:opacity-50"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal content */}
            <div className="p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">
                  Select Products
                  <span className="text-muted-foreground ml-1">
                    (at least 1 required)
                  </span>
                </label>
                <ProductSelector
                  selectedIds={selectedProductIds}
                  onSelectionChange={setSelectedProductIds}
                />
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{error}</p>
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div className="flex items-center justify-end gap-2 p-6 border-t bg-gray-50">
              <button
                onClick={handleCloseModal}
                disabled={isGenerating}
                className="px-4 py-2 text-sm border rounded-md hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleGenerate}
                disabled={selectedProductIds.length === 0 || isGenerating}
                className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors disabled:opacity-50 flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  'Generate'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
