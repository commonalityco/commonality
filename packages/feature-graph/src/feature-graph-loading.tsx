import { GraphLayoutMain } from '@commonalityco/ui-graph/graph-layout';
import { Loader2 } from 'lucide-react';

export function FeatureGraphLoading() {
  return (
    <GraphLayoutMain>
      <div className="h-12" />
      <div className="grow flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    </GraphLayoutMain>
  );
}

export default FeatureGraphLoading;
