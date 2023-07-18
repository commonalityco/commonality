'use client';

import { Toaster } from '@commonalityco/ui-design-system';
import { Provider } from 'jotai';
import { ThemeProvider } from 'next-themes';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class">
      <Provider>
        {children}
        <Toaster />
      </Provider>
    </ThemeProvider>
  );
}
