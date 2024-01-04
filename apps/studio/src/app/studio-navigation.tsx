'use client';
import {
  Navigation,
  NavigationLogo,
  Divider,
  ThemeButton,
  BunLogo,
} from '@commonalityco/ui-core';
import { useTheme } from 'next-themes';
import { Button } from '@commonalityco/ui-design-system';
import Link from 'next/link';
import { setCookie } from 'cookies-next';
import { NavigationButton } from '@commonalityco/ui-core';
import { Network, PackageCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { PackageManager } from '@commonalityco/utils-core';
import { NpmLogo, PnpmLogo, YarnLogo } from '@commonalityco/ui-core';

import dynamic from 'next/dynamic';

const LastUpdateTime = dynamic(() => import('./last-update-time'), {
  ssr: false,
});

const COOKIE_KEY = 'commonality:theme';

const IconByPackageManager = {
  [PackageManager.NPM]: NpmLogo,
  [PackageManager.PNPM]: PnpmLogo,
  [PackageManager.YARN]: YarnLogo,
  [PackageManager.BUN]: BunLogo,
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
            <Button variant="link" asChild>
              <Link
                href="https://github.com/commonalityco/commonality/issues/new?title=Feedback+for+%22Commonality+Studio%22&labels=feedback"
                target="_blank"
                rel="noopener noreferrer"
              >
                Feedback
              </Link>
            </Button>
            <Button variant="link" asChild>
              <Link
                href="https://commonality.co/docs/overview"
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
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
      <div className="px-6 border-b flex justify-between items-center">
        <div className="flex space-x-2">
          <NavigationButton
            className="flex gap-2 items-center"
            href="/"
            active={pathname === '/'}
          >
            <Network className="h-4 w-4" />
            <span>Constraints</span>
          </NavigationButton>
          <NavigationButton
            className="flex gap-2 items-center"
            href="/checks"
            active={pathname === '/checks'}
          >
            <PackageCheck className="h-4 w-4" />
            <span>Checks</span>
          </NavigationButton>
        </div>
        <LastUpdateTime />
      </div>
    </div>
  );
}

export default StudioNavigation;
