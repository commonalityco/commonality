'use client';
import { Button, cn } from '@commonalityco/ui-design-system';
import { useNodes } from '@xyflow/react';
import { PackageSearch } from 'lucide-react';

export function GraphEmpty({ onShow }: { onShow: () => void }) {
  const nodes = useNodes();

  return (
    <div
      className={cn(
        'bg-interactive bg-background absolute bottom-0 left-0 right-0 top-0 z-20 flex items-center justify-center transition',
        { 'pointer-events-none opacity-0': nodes.length },
        { 'opacity-100': nodes.length === 0 },
      )}
    >
      <div className="text-center">
        <PackageSearch className="mx-auto h-8 w-8" />
        <p className="my-4">No packages match your filters</p>
        <Button onClick={onShow}>Show all packages</Button>
      </div>
    </div>
  );
}
