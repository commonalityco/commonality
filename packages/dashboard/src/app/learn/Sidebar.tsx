'use client';
import { Package } from '@commonalityco/types';
import { Button } from '@commonalityco/ui-button';
import { Divider } from '@commonalityco/ui-divider';
import Link from 'next/link';
import { formatPackageName } from 'utils/format-package-name';
import { getIconForPackage } from 'utils/get-icon-for-package';
import { slugifyPackageName } from 'utils/slugify-package-name';
import { twMerge } from 'tailwind-merge';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { TextInput } from '@commonalityco/ui-text-input';
import { useState } from 'react';
import { NavLink } from '@commonalityco/ui-nav-link';
import { usePathname, useSearchParams } from 'next/navigation';

function Sidebar({
  packages,
  stripScopeFromPackageNames,
  className,
}: {
  packages: Package[];
  stripScopeFromPackageNames: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const [searchText, setSearchText] = useState('');
  const filteredPackages = searchText
    ? packages.filter((pkg) => {
        const formattedName = formatPackageName(pkg.name, {
          stripScope: stripScopeFromPackageNames,
        });

        return formattedName.includes(searchText);
      })
    : packages;

  return (
    <div
      className={twMerge(
        'shrink-0 grow-0 basis-72 rounded-lg bg-white p-3 dark:bg-zinc-900',
        className
      )}
    >
      <NavLink
        use="ghost"
        className="w-full justify-start"
        href="/learn"
        active={pathname === '/learn'}
      >
        <GlobeAltIcon className="mr-2 h-4 w-4" />
        Root
      </NavLink>

      <Divider className="my-3" />
      <TextInput
        search
        placeholder="Search..."
        onChange={(event) => setSearchText(event.target.value)}
      />
      <div className="h-full overflow-auto">
        <div className="sticky top-0 h-4 bg-gradient-to-b from-white dark:from-zinc-900" />
        {filteredPackages.map((pkg) => {
          const IconForPackage = getIconForPackage(pkg);

          const packageName = formatPackageName(pkg.name, {
            stripScope: stripScopeFromPackageNames,
          });

          const packageNameSlug = slugifyPackageName(pkg.name);

          return (
            <NavLink
              use="ghost"
              className="mb-1 w-full px-3"
              href={`/learn/${packageNameSlug}`}
              key={pkg.name}
              active={pathname?.includes(packageNameSlug)}
            >
              <div className="flex w-full items-center justify-start gap-2">
                <IconForPackage className="h-4 w-4 shrink-0 grow-0" />
                <div className="grow truncate text-left">{packageName}</div>
              </div>
            </NavLink>
          );
        })}
      </div>
    </div>
  );
}

export default Sidebar;
