'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface AdminActionsProps {
  productId: string;
  productName: string;
  isAdmin: boolean;
}

export function AdminActions({ productId, productName, isAdmin }: AdminActionsProps) {
  const router = useRouter();

  // Asset upload state
  const [fileName, setFileName] = useState('');
  const [fileType, setFileType] = useState('');
  const [fileSize, setFileSize] = useState('');
  const [url, setUrl] = useState('');
  const [uploadLoading, setUploadLoading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  // Delete state
  const [deleteLoading, setDeleteLoading] = useState(false);

  if (!isAdmin) {
    return null;
  }

  // Handle delete
  const handleDelete = async () => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${productName}? This action can be undone by an admin.`
    );

    if (!confirmed) {
      return;
    }

    setDeleteLoading(true);

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Delete failed' }));
        throw new Error(errorData.error || 'Failed to delete product');
      }

      // Redirect to solutions catalog
      router.push('/solutions');
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete product');
    } finally {
      setDeleteLoading(false);
    }
  };

  // Handle asset upload
  const handleAssetUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploadLoading(true);
    setUploadSuccess(false);
    setUploadError(null);

    try {
      const response = await fetch(`/api/products/${productId}/assets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fileName,
          fileType,
          fileSize: parseInt(fileSize, 10),
          url,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Upload failed' }));
        throw new Error(errorData.error || 'Failed to upload asset');
      }

      // Success - clear form and show success message
      setFileName('');
      setFileType('');
      setFileSize('');
      setUrl('');
      setUploadSuccess(true);

      // Refresh the page to show the new asset
      router.refresh();

      // Hide success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
      }, 3000);
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div className="border-t pt-6 mt-6">
      {/* Action buttons row */}
      <div className="flex gap-3 justify-end mb-6">
        <Link
          href={`/solutions/${productId}/edit`}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-primary/90"
        >
          Edit Product
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleteLoading}
          className="bg-destructive text-destructive-foreground px-4 py-2 rounded-md text-sm font-medium hover:bg-destructive/90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {deleteLoading ? 'Deleting...' : 'Delete Product'}
        </button>
      </div>

      {/* Asset upload section */}
      <div className="border-t pt-4">
        <h3 className="text-sm font-semibold mb-3">Upload Asset</h3>

        {uploadSuccess && (
          <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-2 rounded-md text-sm mb-3">
            Asset uploaded successfully!
          </div>
        )}

        {uploadError && (
          <div className="bg-destructive/10 text-destructive px-4 py-2 rounded-md text-sm mb-3">
            {uploadError}
          </div>
        )}

        <form onSubmit={handleAssetUpload} className="space-y-3">
          <div>
            <label htmlFor="fileName" className="block text-sm font-medium mb-1">
              File Name <span className="text-destructive">*</span>
            </label>
            <input
              id="fileName"
              type="text"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="fileType" className="block text-sm font-medium mb-1">
              File Type <span className="text-destructive">*</span>
            </label>
            <input
              id="fileType"
              type="text"
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              placeholder="application/pdf"
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="fileSize" className="block text-sm font-medium mb-1">
              File Size (bytes) <span className="text-destructive">*</span>
            </label>
            <input
              id="fileSize"
              type="number"
              value={fileSize}
              onChange={(e) => setFileSize(e.target.value)}
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div>
            <label htmlFor="url" className="block text-sm font-medium mb-1">
              URL <span className="text-destructive">*</span>
            </label>
            <input
              id="url"
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://..."
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <button
            type="submit"
            disabled={uploadLoading}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploadLoading ? 'Adding Asset...' : 'Add Asset'}
          </button>
        </form>
      </div>
    </div>
  );
}
