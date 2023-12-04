import { cn } from '@commonalityco/ui-design-system/cn';

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
        'relative grid h-full max-h-screen min-h-0 w-full grid-cols-[auto_1fr] items-stretch overflow-hidden px-6 gap-4',
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
    <div className={cn('h-full', className)}>
      <div className="h-full w-72">{children}</div>
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
    <div className="align-stretch flex h-full grow bg-secondary">
      <div
        className={cn(
          'flex h-full w-full flex-col rounded-lg border bg-secondary overflow-hidden',
          className,
        )}
        id="graph-layout-root"
      >
        {children}
      </div>
    </div>
  );
}
