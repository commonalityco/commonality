'use client';
import { Theme } from '@commonalityco/utils-core';
import { Navigation } from '@commonalityco/ui-core';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';

const ThemeButton = dynamic(
  () => import('@commonalityco/ui-core').then((module) => module.ThemeButton),
  { ssr: false }
);

function DashboardNavigation({ title }: { title: string }) {
  const pathname = usePathname();
  const { setTheme, theme } = useTheme();

  return (
    <>
      <Navigation
        title={title}
        pathname={pathname}
        links={[
          {
            href: '/graph',
            label: 'Graph',
          },
          {
            href: '/docs',
            label: 'Documentation',
          },
        ]}
      >
        <div className="w-10">
          <ThemeButton
            defaultTheme={theme as Theme}
            onThemeChange={(theme) => {
              setTheme(theme);
            }}
          />
        </div>
      </Navigation>
    </>
  );
}

export default DashboardNavigation;
