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
import { ExternalLink } from 'lucide-react';
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

  return (
    <div>
      <Navigation className="border-b py-2">
        <div className="flex w-full items-center">
          <div className="flex grow items-center space-x-2">
            <Link href="/">
              <NavigationLogo />
            </Link>
            <Divider className="fill-muted-foreground" />
            <PackageManagerIcon className="h-6 w-6" />
            <h1 className="text-foreground text-base font-semibold">{title}</h1>
          </div>
          <div className="flex items-center">
            <LastUpdateTime />
            <Button asChild variant="link">
              <Link
                href="https://github.com/commonalityco/commonality/issues/new?title=Feedback+for+%22Commonality+Studio%22&labels=feedback"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden flex-nowrap items-center gap-2 md:flex"
              >
                Feedback
                <ExternalLink className="h-4 w-4 shrink-0" />
              </Link>
            </Button>
            <Button asChild variant="link">
              <Link
                href="https://docs.commonality.co/overview"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden flex-nowrap items-center gap-2 md:flex"
              >
                Documentation
                <ExternalLink className="h-4 w-4 shrink-0" />
              </Link>
            </Button>

            <ThemeButton
              // className="md:mr-4"
              defaultTheme={defaultTheme}
              onThemeChange={(theme) => {
                setCookie(COOKIE_KEY, theme);
                setTheme(theme);
              }}
            />
          </div>
        </div>
      </Navigation>
    </div>
  );
}

export default StudioNavigation;
