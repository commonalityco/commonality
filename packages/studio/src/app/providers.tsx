'use client';

import { Toaster } from '@commonalityco/ui-design-system/toaster';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      {children}
      <Toaster />
    </ThemeProvider>
  );
}
