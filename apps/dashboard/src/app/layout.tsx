import './globals.css';
import { clsx } from 'clsx';
import DashboardNavigation from 'app/DashboardNavigation';
import { firaCode, inter } from 'constants/fonts';
import { getProject } from 'data/project';
import { themeEffect } from './theme-effect';
import { Providers } from 'app/providers';

export const revalidate = 360000;

export const metadata = {
  title: 'Commonality',
  icons: {
    icon: './favicon.png',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const project = await getProject();

  return (
    <html
      lang="en"
      className="relative h-full overflow-hidden antialiased"
      suppressHydrationWarning
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(${themeEffect.toString()})();`,
          }}
        />
      </head>
      <body
        className={clsx(
          inter.className,
          inter.variable,
          firaCode.variable,
          'flex h-full flex-col font-sans'
        )}
      >
        <Providers>
          <DashboardNavigation title={project.name} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
