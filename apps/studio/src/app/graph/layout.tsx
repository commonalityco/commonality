import { GraphProvider } from '@commonalityco/ui-graph/graph-provider';
import StudioGraphHeader from './studio-graph-header';
import { Provider as JotaiProvider } from 'jotai';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full flex flex-col">
      <GraphProvider>
        <JotaiProvider>
          <StudioGraphHeader />
          {children}
        </JotaiProvider>
      </GraphProvider>
    </div>
  );
}
