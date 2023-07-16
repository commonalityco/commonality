export function GraphLayoutRoot({ children }: { children?: React.ReactNode }) {
  return (
    <main className="bg-secondary relative flex h-full max-h-screen min-h-0 w-full">
      {children}
    </main>
  );
}

export function GraphLayoutAside({ children }: { children?: React.ReactNode }) {
  return (
    <div className="p-3">
      <div className="bg-background h-full w-72 rounded-lg">{children}</div>
    </div>
  );
}

export function GraphLayoutMain({ children }: { children?: React.ReactNode }) {
  return (
    <div className="align-stretch flex grow py-3 pr-3">
      <div
        className="bg-background flex h-full w-full flex-col overflow-hidden rounded-lg"
        id="graph-layout-root"
      >
        {children}
      </div>
    </div>
  );
}
