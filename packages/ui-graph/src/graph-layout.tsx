import { Card } from '@commonalityco/ui-design-system';
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
        'bg-secondary relative grid h-full max-h-screen min-h-0 w-full grid-cols-[auto_1fr] items-stretch overflow-hidden',
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
    <div className={cn('h-full pl-4 py-4 pr-4', className)}>
      <Card className="h-full w-72 rounded-lg">{children}</Card>
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
    <div className="align-stretch flex h-full grow py-4 pr-4">
      <Card
        className={cn('flex h-full w-full flex-col overflow-hidden', className)}
        id="graph-layout-root"
      >
        {children}
      </Card>
    </div>
  );
}
