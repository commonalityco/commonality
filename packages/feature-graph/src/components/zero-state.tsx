import { Package as PackageIcon } from 'lucide-react';

export function ZeroState() {
  return (
    <div className="bg-accent absolute bottom-0 left-0 right-0 top-0 z-30 flex h-full w-full items-center justify-center transition-opacity">
      <div className="max-w-sm text-center">
        <PackageIcon className="mx-auto h-8 w-8" />
        <p className="mb-2 mt-4 text-base font-semibold">
          No packages match your filters
        </p>
        <p className="text-muted-foreground">
          You'll see your dependency graph here after you've created your first
          package.
        </p>
      </div>
    </div>
  );
}
