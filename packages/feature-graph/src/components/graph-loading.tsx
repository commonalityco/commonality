import { cn } from '@commonalityco/ui-design-system';
import { Loader2 } from 'lucide-react';

export function GraphLoading() {
  return (
    <div
      className={cn(
        'bg-interactive absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center',
      )}
    >
      <Loader2 className="text-muted-foreground h-6 w-6 animate-spin" />
    </div>
  );
}
