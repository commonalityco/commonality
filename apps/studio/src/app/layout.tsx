import './globals.css';
import { clsx } from 'clsx';
import StudioNavigation from 'app/StudioNavigation';
import { firaCode, inter, vollkorn } from 'constants/fonts';
import { getProject } from 'data/project';
import { Providers } from 'app/providers';

export const metadata = {
  title: 'Commonality Studio',
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
      <body
        className={clsx(
          inter.className,
          inter.variable,
          firaCode.variable,
          vollkorn.variable,
          'flex h-full flex-col font-sans'
        )}
      >
        <Providers>
          <StudioNavigation title={project.name} />
          {children}
        </Providers>
      </body>
    </html>
  );
}
