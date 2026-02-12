import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { getProduct } from '@/services/product-service';
import { getCurrentUser } from '@/lib/auth-utils';
import { AdminActions } from '@/components/solutions/admin-actions';

// Helper function to format file size
function formatFileSize(bytes: number): string {
  if (bytes < 1024) {
    return `${bytes} B`;
  } else if (bytes < 1024 * 1024) {
    return `${(bytes / 1024).toFixed(1)} KB`;
  } else {
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  }
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;

  // Get current user for tenantId
  let user;
  try {
    user = await getCurrentUser();
  } catch (error: any) {
    return (
      <div className="p-6">
        <p className="text-red-500">Authentication required</p>
      </div>
    );
  }

  // Determine if user is admin
  const isAdmin = user.role === 'publisher-admin' || user.role === 'super-admin';

  // Fetch product
  let product;
  try {
    product = await getProduct(user.tenantId, productId);
  } catch (error: any) {
    if (error.code === 'PRODUCT_NOT_FOUND') {
      return (
        <div className="p-6 max-w-6xl mx-auto">
          <Link
            href="/solutions"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Solutions
          </Link>
          <p className="text-muted-foreground mt-4">Product not found</p>
        </div>
      );
    }
    throw error;
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      {/* Back navigation */}
      <Link
        href="/solutions"
        className="text-sm text-primary hover:underline flex items-center gap-1 mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Solutions
      </Link>

      {/* Header section */}
      <div className="mb-6">
        <h1 className="text-2xl font-semibold font-heading">
          {product.name}
        </h1>

        <div className="flex items-center gap-2 mt-3">
          <span className="rounded-full bg-primary/10 text-primary px-2 py-0.5 text-xs">
            {product.gradeRange}
          </span>
          <span className="rounded-full bg-secondary/10 text-secondary-foreground px-2 py-0.5 text-xs">
            {product.subjectArea}
          </span>
        </div>

        <p className="text-muted-foreground mt-2">
          {product.description}
        </p>
      </div>

      {/* Admin actions */}
      <AdminActions
        productId={productId}
        productName={product.name}
        isAdmin={isAdmin}
      />

      {/* Content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left column - Product Details */}
        <div className="border rounded-lg p-6 bg-card">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
            Product Details
          </h2>

          <div className="space-y-6">
            {/* Key Features */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Key Features
              </h3>
              {product.keyFeatures && product.keyFeatures.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {product.keyFeatures.map((feature, index) => (
                    <li key={index}>{feature}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No key features listed</p>
              )}
            </div>

            {/* Target Challenges */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Target Challenges
              </h3>
              {product.targetChallenges && product.targetChallenges.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {product.targetChallenges.map((challenge, index) => (
                    <li key={index}>{challenge}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No target challenges listed</p>
              )}
            </div>

            {/* Competitive Differentiators */}
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                Competitive Differentiators
              </h3>
              {product.competitiveDifferentiators && product.competitiveDifferentiators.length > 0 ? (
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {product.competitiveDifferentiators.map((diff, index) => (
                    <li key={index}>{diff}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground">No differentiators listed</p>
              )}
            </div>
          </div>
        </div>

        {/* Right column - Approved Messaging and Assets */}
        <div className="space-y-6">
          {/* Approved Messaging */}
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
              Approved Messaging
            </h2>
            {product.approvedMessaging && product.approvedMessaging.length > 0 ? (
              <ul className="list-disc list-inside space-y-1 text-sm">
                {product.approvedMessaging.map((message, index) => (
                  <li key={index}>{message}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No approved messaging</p>
            )}
          </div>

          {/* Product Assets */}
          <div className="border rounded-lg p-6 bg-card">
            <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-4">
              Product Assets
            </h2>
            {product.assets && product.assets.length > 0 ? (
              <div className="space-y-2">
                {product.assets.map((asset) => (
                  <div
                    key={asset.assetId}
                    className="flex items-center justify-between py-2 border-b last:border-0"
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {asset.fileName}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {asset.fileType}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {formatFileSize(asset.fileSize)}
                        </span>
                      </div>
                    </div>
                    <a
                      href={asset.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs text-primary hover:underline ml-4"
                    >
                      View
                    </a>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No assets uploaded yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
