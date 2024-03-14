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
        'relative grid h-full max-h-screen min-h-0 w-full grid-cols-1 items-stretch overflow-hidden md:grid-cols-[auto_1fr]',
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
        'hidden h-full shrink-0 overflow-hidden border-r p-4 md:block',
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
    <div className="align-stretch flex h-full w-full grow overflow-hidden">
      <div
        className={cn(
          'bg-interactive relative flex h-full w-full flex-col overflow-hidden',
          className,
        )}
        id="graph-layout-root"
      >
        {children}
      </div>
    </div>
  );
}
