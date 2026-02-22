import type { DiscoveryQueryResponse, ProductAlignment } from '@/services/types/discovery';
import { BriefRenderer } from './renderers/brief-renderer';
import { DirectAnswerCard } from './renderers/direct-answer-card';
import { RecoveryRenderer } from './renderers/recovery-renderer';
import { ComparisonTableRenderer } from './renderers/comparison-table-renderer';
import { RankedListRenderer } from './renderers/ranked-list-renderer';
import { CardSetRenderer } from './renderers/card-set-renderer';

interface DiscoveryFormatRouterProps {
  response: DiscoveryQueryResponse;
  onNewQuery: (query: string) => void;
  products: Array<{ productId: string; name: string }>;
  productLensId: string | undefined;
  onProductLensChange: (productId: string | undefined) => void;
  hasProducts: boolean;
  savedDistricts?: Set<string>;
  onSaveDistrict?: (districtId: string) => void;
  onRemoveSaved?: (districtId: string) => void;
  onGeneratePlaybook?: (districtId: string) => void;
}

export function DiscoveryFormatRouter({ response, onNewQuery, products, productLensId, onProductLensChange, hasProducts, savedDistricts, onSaveDistrict, onRemoveSaved, onGeneratePlaybook }: DiscoveryFormatRouterProps) {
  const { content, confidence } = response;
  const relevanceMap: Record<string, ProductAlignment> | undefined = response.productRelevanceMap;

  const lensProps = { products, productLensId, onProductLensChange };
  const actionProps = { savedDistricts, onSaveDistrict, onRemoveSaved, onGeneratePlaybook };

  switch (content.format) {
    case 'narrative_brief':
      return <BriefRenderer content={content.data} confidence={confidence} format="narrative_brief" productAlignmentMap={relevanceMap} {...actionProps} />;
    case 'intelligence_brief':
      return <BriefRenderer content={content.data} confidence={confidence} format="intelligence_brief" productAlignmentMap={relevanceMap} {...actionProps} />;
    case 'direct_answer_card':
      return <DirectAnswerCard content={content.data} confidence={confidence} productRelevanceMap={relevanceMap} />;
    case 'recovery':
      return <RecoveryRenderer content={content.data} onRedirectQuery={onNewQuery} />;
    case 'comparison_table':
      return <ComparisonTableRenderer content={content.data} confidence={confidence} productRelevanceMap={relevanceMap} />;
    case 'ranked_list':
      return <RankedListRenderer content={content.data} confidence={confidence} productRelevanceMap={relevanceMap} hasProducts={hasProducts} {...lensProps} {...actionProps} />;
    case 'card_set':
      return <CardSetRenderer content={content.data} confidence={confidence} productRelevanceMap={relevanceMap} hasProducts={hasProducts} {...lensProps} {...actionProps} />;
    default:
      return null;
  }
}
