import type { DiscoveryQueryResponse, ResponseFormat } from '@/services/types/discovery';
import { BriefRenderer } from './renderers/brief-renderer';
import { DirectAnswerCard } from './renderers/direct-answer-card';
import { RecoveryRenderer } from './renderers/recovery-renderer';

interface DiscoveryFormatRouterProps {
  response: DiscoveryQueryResponse;
  onNewQuery: (query: string) => void;
}

function UnsupportedFormatPlaceholder({ format }: { format: ResponseFormat }) {
  return (
    <div className="bg-slate-50 rounded-md p-4 text-center">
      <p className="text-[12px] font-[500] leading-[1.5] tracking-[0.025em] text-slate-500">
        This response format ({format}) is not yet available in this build.
      </p>
    </div>
  );
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
    case 'card_set':
    case 'ranked_list':
      return <UnsupportedFormatPlaceholder format={content.format} />;
    default:
      return null;
  }
}
