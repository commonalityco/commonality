export function GraphLayoutRoot({ children }: { children?: React.ReactNode }) {
  return (
    <main className="bg-secondary relative grid h-full max-h-screen min-h-0 w-full grid-cols-[auto_1fr] items-stretch">
      {children}
    </main>
  );
}

export function GraphLayoutAside({ children }: { children?: React.ReactNode }) {
  return (
    <div className="h-full p-3">
      <div className="bg-background h-full w-72 rounded-lg border">
        {children}
      </div>
    </div>
  );
}

export function GraphLayoutMain({ children }: { children?: React.ReactNode }) {
  return (
    <div className="align-stretch flex h-full grow overflow-hidden py-3 pr-3">
      <div
        className="bg-background flex h-full w-full flex-col overflow-hidden rounded-lg border"
        id="graph-layout-root"
      >
        {children}
      </div>
    </div>
  );
}
