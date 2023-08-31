import './globals.css';
import { clsx } from 'clsx';
import { firaCode, inter } from 'constants/fonts';
import { Providers } from 'app/providers';
import { cookies } from 'next/headers';
import StudioNavigation from './studio-navigation';
import { getProject } from 'data/project';

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
  const cookieStore = cookies();
  const defaultTheme = cookieStore.get('commonality:theme')?.value;

  return (
    <html
      lang="en"
      className="relative h-full antialiased"
      suppressHydrationWarning
    >
      <body
        className={clsx(
          inter.className,
          inter.variable,
          firaCode.variable,
          'flex h-full flex-col justify-stretch font-sans relative',
        )}
      >
        <Providers defaultTheme={defaultTheme}>
          <StudioNavigation
            title={project.name}
            defaultTheme={defaultTheme}
            packageManager={project.packageManager}
          />
          {children}
        </Providers>
      </body>
    </html>
  );
}
