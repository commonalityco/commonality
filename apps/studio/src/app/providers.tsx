'use client';
import { Toaster } from '@commonalityco/ui-design-system/toast';
import { ThemeProvider, useTheme } from 'next-themes';

function ToasterWithTheme() {
  const { theme } = useTheme();

  return <Toaster theme={theme as 'light' | 'dark' | 'system' | undefined} />;
}

export function Providers({
  children,
  defaultTheme,
}: {
  children: React.ReactNode;
  defaultTheme?: string;
}) {
  return (
    <ThemeProvider attribute="class" defaultTheme={defaultTheme}>
      {children}
      <ToasterWithTheme />
    </ThemeProvider>
  );
}
