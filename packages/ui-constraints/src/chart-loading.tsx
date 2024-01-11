import { Loader2 } from 'lucide-react';

export function ChartLoading() {
  return (
    <div className="grow align-stretch h-full flex flex-col">
      <div className="h-12" />
      <div className="grow flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    </div>
  );
}

export default ChartLoading;
