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
        'relative grid h-full max-h-screen min-h-0 w-full grid-cols-1 md:grid-cols-[auto_1fr] items-stretch overflow-hidden',
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
    <div
      className={cn(
        'h-full overflow-hidden shrink-0 pl-6 py-4 pr-4 border-r hidden md:block',
        className,
      )}
    >
      <div className="h-full w-80 shrink-0">{children}</div>
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
    <div className="align-stretch flex h-full grow w-full overflow-hidden">
      <div
        className={cn(
          'flex h-full w-full flex-col overflow-hidden bg-interactive relative',
          className,
        )}
        id="graph-layout-root"
      >
        {children}
      </div>
    </div>
  );
}
