'use client';
import { Button, cn } from '@commonalityco/ui-design-system';
import { PackageSearch } from 'lucide-react';
import { useInteractions } from '../context/interaction-context';

export function GraphEmpty() {
  const interactions = useInteractions();

  return (
    <div
      className={cn(
        'bg-interactive dark:bg-background absolute bottom-0 left-0 right-0 top-0 z-20 flex items-center justify-center transition',
      )}
    >
      <div className="text-center">
        <PackageSearch className="mx-auto h-8 w-8" />
        <p className="my-4">No packages match your filters</p>
        <Button onClick={interactions.showAll}>Show all packages</Button>
      </div>
    </div>
  );
}
