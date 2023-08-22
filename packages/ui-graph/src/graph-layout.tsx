import { cn } from '@commonalityco/ui-design-system';

export function GraphLayoutRoot({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <main
      className={cn(
        'bg-secondary relative grid h-full max-h-screen min-h-0 w-full grid-cols-[auto_1fr] items-stretch',
        className,
      )}
    >
      {children}
    </main>
  );
}

export function GraphLayoutAside({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('h-full p-3', className)}>
      <div className="bg-background h-full w-72 rounded-lg border">
        {children}
      </div>
    </div>
  );
}

export function GraphLayoutMain({
  children,
  className,
}: {
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="align-stretch flex h-full grow overflow-hidden py-3 pr-3">
      <div
        className={cn(
          'bg-background flex h-full w-full flex-col overflow-hidden rounded-lg border',
          className,
        )}
        id="graph-layout-root"
      >
        {children}
      </div>
    </div>
  );
}
