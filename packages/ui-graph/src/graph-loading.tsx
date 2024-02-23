import { cn } from '@commonalityco/ui-design-system';
import { Loader2 } from 'lucide-react';

export function GraphLoading() {
  return (
    <div
      className={cn(
        'absolute z-20 left-0 top-0 flex h-full w-full items-center justify-center bg-interactive',
      )}
    >
      <div className="animate-in fade-in delay-1000">
        <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
      </div>
    </div>
  );
}
