'use client';
import { Theme } from '@commonalityco/utils-core';
import { Navigation, NavigationLogo, Divider } from '@commonalityco/ui-core';
import { useTheme } from 'next-themes';
import { usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@commonalityco/ui-design-system';
import Link from 'next/link';
import { ThemeButtonLoading } from '@commonalityco/ui-core';

const ThemeButton = dynamic(
  () => import('@commonalityco/ui-core').then((module) => module.ThemeButton),
  { ssr: false, loading: ThemeButtonLoading }
);

function DashboardNavigation({ title }: { title: string }) {
  const { setTheme, theme } = useTheme();

  return (
    <>
      <Navigation className="border-b">
        <div className="flex w-full items-center">
          <div className="flex grow items-center space-x-3">
            <NavigationLogo />
            <p className="font-bold uppercase tracking-widest">Studio</p>
            <Divider className="fill-muted-foreground" />
            <h1 className="text-base font-semibold text-foreground">{title}</h1>
          </div>
          <div className="flex items-center space-x-2">
            <Button variant="outline" asChild>
              <Link
                href="https://commonality.co/feedback"
                target="_blank"
                rel="noopener noreferrer"
              >
                Feedback
              </Link>
            </Button>
            <Button variant="link" asChild>
              <Link
                href="https://commonality.co/docs"
                target="_blank"
                rel="noopener noreferrer"
              >
                Docs
              </Link>
            </Button>
            <ThemeButton
              defaultTheme={theme as Theme}
              onThemeChange={(theme) => {
                setTheme(theme);
              }}
            />
          </div>
        </div>
      </Navigation>
    </>
  );
}

export default DashboardNavigation;
