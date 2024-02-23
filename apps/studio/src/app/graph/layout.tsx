import StudioGraphHeader from './studio-graph-header';
import { GraphProviders } from './providers';

export default function GraphLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col">
      <GraphProviders>
        <StudioGraphHeader />
        {children}
      </GraphProviders>
    </div>
  );
}
