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
import io from 'Socket.IO-client';
import { useEffect, useState } from 'react';
import { formatRelative } from 'date-fns';

const COOKIE_KEY = 'commonality:theme';

const IconByPackageManager = {
  [PackageManager.NPM]: NpmLogo,
  [PackageManager.PNPM]: PnpmLogo,
  [PackageManager.YARN]: YarnLogo,
};

function LastUpdateTime() {
  const [count, setCount] = useState(0);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    const createSocketConnection = async () => {
      const socket = io();

      socket.on('project-updated', async () => {
        await fetch('/api/revalidate?tag=metadata');
        setLastUpdated(new Date());
      });
      socket.on('disconnect', () => {
        console.log('disconnected');
      });
    };

    createSocketConnection();
  }, []);

  useEffect(() => {
    const id = setInterval(() => {
      setCount(count + 1);

      if (count > 60) {
        clearInterval(id);
      }
    }, 1000);

    return () => clearInterval(id);
  }, [count]);

  return (
    <div className="text-muted-foreground text-xs">
      {`Last updated ${formatRelative(new Date(), lastUpdated)}`}
    </div>
  );
}

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
      <div className="px-6 border-b flex justify-between items-center">
        <div className="flex space-x-2">
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
        <LastUpdateTime />
      </div>
    </div>
  );
}

export default StudioNavigation;
