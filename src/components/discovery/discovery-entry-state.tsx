import { DiscoveryInput } from './discovery-input';
import { ProductLensSelector } from './product-lens-selector';

interface DiscoveryEntryStateProps {
  onQuerySubmit: (query: string) => void;
  onDirectNavigation: (districtId: string) => void;
  products: Array<{ productId: string; name: string }>;
  productLensId: string | undefined;
  onProductLensChange: (productId: string | undefined) => void;
}

export function DiscoveryEntryState({
  onQuerySubmit,
  onDirectNavigation,
  products,
  productLensId,
  onProductLensChange,
}: DiscoveryEntryStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-var(--topbar-height)-120px)] -mt-[10vh]">
      <div className="w-full max-w-2xl text-center">
        {/* Page title */}
        <h1
          className="text-2xl font-bold text-foreground tracking-[-0.01em]"
          style={{ lineHeight: 1.2 }}
        >
          Discovery
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-sm font-normal text-muted-foreground">
          Find districts, explore market intelligence, or ask a question.
        </p>

        {/* Input */}
        <div className="mt-6">
          <DiscoveryInput
            variant="full"
            onSubmit={onQuerySubmit}
            onDirectNavigation={onDirectNavigation}
          />
        </div>

        {/* Product lens selector — below input, centered */}
        {products.length > 0 && (
          <div className="mt-3 flex justify-center">
            <ProductLensSelector
              products={products}
              selectedProductId={productLensId}
              onProductChange={onProductLensChange}
              variant="full"
            />
          </div>
        )}

        {/* Helper text */}
        <p className="mt-3 text-xs font-medium text-muted-foreground/70 max-w-[480px] mx-auto">
          Search by district name for direct navigation, or ask a natural language question to
          explore trends, compare districts, and surface sales intelligence.
        </p>
      </div>
    </div>
  );
}
