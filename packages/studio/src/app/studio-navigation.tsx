'use client';
import {
  Navigation,
  NavigationLogo,
  Divider,
  ThemeButton,
} from '@commonalityco/ui-core';
import { useTheme } from 'next-themes';
import { Button } from '@commonalityco/ui-design-system';
import Link from 'next/link';
import { setCookie } from 'cookies-next';
import { NavigationButton } from '@commonalityco/ui-core';
import { Box, Network } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { PackageManager } from '@commonalityco/utils-core';
import { NpmLogo, PnpmLogo, YarnLogo } from '@commonalityco/ui-core';

const COOKIE_KEY = 'commonality:theme';

const IconByPackageManager = {
  [PackageManager.NPM]: NpmLogo,
  [PackageManager.PNPM]: PnpmLogo,
  [PackageManager.YARN]: YarnLogo,
};

function StudioNavigation({
  title,
  defaultTheme,
  packageManager,
}: {
  title: string;
  defaultTheme?: string;
  packageManager: PackageManager;
}) {
  const { setTheme } = useTheme();
  const PackageManagerIcon = IconByPackageManager[packageManager];
  const pathname = usePathname();

  return (
    <div>
      <Navigation>
        <div className="flex w-full items-center">
          <div className="flex grow items-center space-x-3">
            <Link href="/">
              <NavigationLogo />
            </Link>
            <p className="font-bold uppercase tracking-widest">Studio</p>
            <Divider className="fill-muted-foreground" />
            <PackageManagerIcon />
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
              defaultTheme={defaultTheme}
              onThemeChange={(theme) => {
                setCookie(COOKIE_KEY, theme);
                setTheme(theme);
              }}
            />
          </div>
        </div>
      </Navigation>
      <div className="px-6 flex space-x-2 border-b">
        <NavigationButton
          className="flex gap-2 items-center"
          href="/"
          active={pathname === '/'}
        >
          <Network className="h-4 w-4" />
          <span>Graph</span>
        </NavigationButton>
        <NavigationButton
          className="flex gap-2 items-center"
          href="/packages"
          active={pathname === '/packages'}
        >
          <Box className="h-4 w-4" />
          <span>Packages</span>
        </NavigationButton>
      </div>
    </div>
  );
}

export default StudioNavigation;
