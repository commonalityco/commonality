export function GraphLayoutRoot({ children }: { children?: React.ReactNode }) {
  return (
    <main className="relative flex h-full max-h-screen min-h-0 w-full bg-secondary">
      {children}
    </main>
  );
}

export function GraphLayoutAside({ children }: { children?: React.ReactNode }) {
  return (
    <div className="px-5 py-5">
      <div className="h-full w-72 rounded-lg bg-background">{children}</div>
    </div>
  );
}

export function GraphLayoutMain({ children }: { children?: React.ReactNode }) {
  return (
    <div className="align-stretch flex grow py-5 pr-5">
      <div
        className="flex h-full w-full flex-col overflow-hidden rounded-lg bg-background"
        id="graph-layout-root"
      >
        {children}
      </div>
    </div>
  );
}
