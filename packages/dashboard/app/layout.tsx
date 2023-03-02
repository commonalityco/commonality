import './globals.css';
import { Inter, Fira_Code, Vollkorn } from 'next/font/google';
import { clsx } from 'clsx';
import Navigation from './Navigation';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

const vollkorn = Vollkorn({ subsets: ['latin'], variable: '--font-vollkorn' });

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body
        className={clsx(
          inter.variable,
          firaCode.variable,
          vollkorn.variable,
          'dark:bg-zinc-900 font-sans selection:bg-sky-200 selection:text-zinc-800 dark:selection:bg-sky-900 dark:selection:text-white h-full'
        )}
      >
        {/* @ts-expect-error Server Component */}
        <Navigation />
        {children}
      </body>
    </html>
  );
}
