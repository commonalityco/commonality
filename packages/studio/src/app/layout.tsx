import './globals.css';
import { clsx } from 'clsx';
import StudioNavigation from 'app/studio-navigation';
import { firaCode, inter, vollkorn } from 'constants/fonts';
import { getProject } from 'data/project';
import { Providers } from 'app/providers';
import StudioGraphProvider from './studio-graph-provider';
import {
  FeatureGraphChartLayout,
  FeatureGraphLayout,
  FeatureGraphSidebarLayout,
} from '@commonalityco/feature-graph';
import { cookies } from 'next/headers';

export const metadata = {
  title: 'Commonality Studio',
  icons: {
    icon: './favicon.png',
  },
};

export default async function RootLayout({
  children,
  sidebar,
  chart,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  chart: React.ReactNode;
}) {
  const project = await getProject();
  const cookieStore = cookies();
  const defaultTheme = cookieStore.get('commonality:theme')?.value;

  return (
    <html
      lang="en"
      className="relative h-full overflow-hidden antialiased"
      suppressHydrationWarning
    >
      <body
        className={clsx(
          inter.className,
          inter.variable,
          firaCode.variable,
          vollkorn.variable,
          'flex h-full flex-col font-sans',
        )}
      >
        <Providers defaultTheme={defaultTheme}>
          <StudioNavigation title={project.name} defaultTheme={defaultTheme} />
          <div className="bg-secondary h-full">
            <StudioGraphProvider>
              <FeatureGraphLayout>
                <FeatureGraphSidebarLayout>{sidebar}</FeatureGraphSidebarLayout>
                <FeatureGraphChartLayout>{chart}</FeatureGraphChartLayout>
              </FeatureGraphLayout>
              {children}
            </StudioGraphProvider>
          </div>
        </Providers>
      </body>
    </html>
  );
}
