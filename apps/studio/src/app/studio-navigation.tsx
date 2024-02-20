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
import { ExternalLink, Network, PackageCheck } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { PackageManager } from '@commonalityco/utils-core';
import { NpmLogo, PnpmLogo, YarnLogo } from '@commonalityco/ui-core';

import dynamic from 'next/dynamic';
import { EditConfigButton } from '@/components/edit-config-button';

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
          <div className="flex grow items-center space-x-2">
            <Link href="/">
              <NavigationLogo />
            </Link>
            <p className="font-bold uppercase tracking-widest">Studio</p>
            <Divider className="fill-muted-foreground" />
            <PackageManagerIcon />
            <h1 className="text-base font-semibold text-foreground">{title}</h1>
          </div>
          <div className="flex items-center">
            <Button asChild variant="link">
              <Link
                href="https://github.com/commonalityco/commonality/issues/new?title=Feedback+for+%22Commonality+Studio%22&labels=feedback"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 items-center flex-nowrap"
              >
                Feedback
                <ExternalLink className="h-4 w-4 shrink-0" />
              </Link>
            </Button>
            <Button asChild variant="link">
              <Link
                href="https://commonality.co/docs/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="flex gap-2 items-center flex-nowrap"
              >
                Documentation
                <ExternalLink className="h-4 w-4 shrink-0" />
              </Link>
            </Button>

            <ThemeButton
              className="mr-4"
              defaultTheme={defaultTheme}
              onThemeChange={(theme) => {
                setCookie(COOKIE_KEY, theme);
                setTheme(theme);
              }}
            />

            <EditConfigButton />
          </div>
        </div>
      </Navigation>
      <div className="px-6 border-b flex justify-between items-center">
        <div className="flex space-x-2">
          <NavigationButton
            className="flex gap-2 items-center"
            href="/graph"
            active={pathname === '/graph'}
          >
            <Network className="h-4 w-4" />
            <span>Graph</span>
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
