import { DiscoveryInput } from './discovery-input';
import { FollowUpChips } from './follow-up-chips';
import { SourceCitations } from './source-citations';
import { DiscoveryFormatRouter } from './discovery-format-router';
import { ProductLensSelector } from './product-lens-selector';
import { Alert, AlertDescription } from '@/components/ui/alert';
import type { DiscoveryQueryResponse } from '@/services/types/discovery';

interface DiscoveryResultsLayoutProps {
  query: string;
  response: DiscoveryQueryResponse | null;
  error?: string | null;
  onNewQuery: (query: string) => void;
  onDirectNavigation: (districtId: string) => void;
  onClearResults: () => void;
  products: Array<{ productId: string; name: string }>;
  productLensId: string | undefined;
  onProductLensChange: (productId: string | undefined) => void;
}

export function DiscoveryResultsLayout({
  query,
  response,
  error,
  onNewQuery,
  onDirectNavigation,
  onClearResults,
  products,
  productLensId,
  onProductLensChange,
}: DiscoveryResultsLayoutProps) {
  return (
    <div className="w-full">
      {/* Compact input bar + product lens — full width row */}
      <div className="flex items-center gap-3 w-full">
        <div className="flex-1">
          <DiscoveryInput
            variant="compact"
            initialValue={query}
            onSubmit={onNewQuery}
            onDirectNavigation={onDirectNavigation}
            onClear={onClearResults}
          />
        </div>
        {products.length > 0 && (
          <ProductLensSelector
            products={products}
            selectedProductId={productLensId}
            onProductChange={onProductLensChange}
            variant="compact"
          />
        )}
      </div>

      {/* Content area — constrained to reading width */}
      <div className="max-w-3xl mx-auto mt-6">
        {error && !response && (
          <div className="space-y-3">
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            <button
              type="button"
              onClick={() => onNewQuery(query)}
              className="text-sm font-medium text-slate-600 hover:text-foreground transition-colors underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        )}

        {response && (
          <div className="space-y-6">
            {/* Format router — switches on content.format */}
            <DiscoveryFormatRouter response={response} onNewQuery={onNewQuery} />

            {/* Follow-up chips */}
            <FollowUpChips
              chips={response.followUpChips}
              onChipClick={onNewQuery}
            />

            {/* Source citations */}
            <SourceCitations sources={response.sources} />
          </div>
        )}
      </div>
    </div>
  );
}
