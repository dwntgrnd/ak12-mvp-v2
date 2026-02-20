import type { DiscoveryQueryResponse } from '@/services/types/discovery';
import { BriefRenderer } from './renderers/brief-renderer';
import { DirectAnswerCard } from './renderers/direct-answer-card';
import { RecoveryRenderer } from './renderers/recovery-renderer';
import { ComparisonTableRenderer } from './renderers/comparison-table-renderer';
import { RankedListRenderer } from './renderers/ranked-list-renderer';
import { CardSetRenderer } from './renderers/card-set-renderer';

interface DiscoveryFormatRouterProps {
  response: DiscoveryQueryResponse;
  onNewQuery: (query: string) => void;
}

export function DiscoveryFormatRouter({ response, onNewQuery }: DiscoveryFormatRouterProps) {
  const { content, confidence } = response;

  switch (content.format) {
    case 'narrative_brief':
      return <BriefRenderer content={content.data} confidence={confidence} format="narrative_brief" />;
    case 'intelligence_brief':
      return <BriefRenderer content={content.data} confidence={confidence} format="intelligence_brief" />;
    case 'direct_answer_card':
      return <DirectAnswerCard content={content.data} confidence={confidence} />;
    case 'recovery':
      return <RecoveryRenderer content={content.data} onRedirectQuery={onNewQuery} />;
    case 'comparison_table':
      return <ComparisonTableRenderer content={content.data} confidence={confidence} />;
    case 'ranked_list':
      return <RankedListRenderer content={content.data} confidence={confidence} />;
    case 'card_set':
      return <CardSetRenderer content={content.data} confidence={confidence} />;
    default:
      return null;
  }
}
