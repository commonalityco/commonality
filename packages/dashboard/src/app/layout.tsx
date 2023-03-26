import './globals.css';
import { clsx } from 'clsx';
import Navigation from './Navigation';
import { firaCode, inter, vollkorn } from 'constants/fonts';

export const revalidate = 360000;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={clsx(
          inter.className,
          inter.variable,
          firaCode.variable,
          vollkorn.variable,
          'flex h-full flex-col font-sans selection:bg-sky-200 selection:text-zinc-800 dark:bg-zinc-900 dark:selection:bg-sky-900 dark:selection:text-white'
        )}
      >
        {/* @ts-expect-error Server Component */}
        <Navigation />
        {children}
      </body>
    </html>
  );
}
