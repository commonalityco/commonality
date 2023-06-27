'use client';
import { Package } from '@commonalityco/types';
import {
  Separator,
  ScrollArea,
  Text,
  Input,
} from '@commonalityco/ui-design-system';
import {
  formatPackageName,
  getIconForPackage,
  slugifyPackageName,
} from '@commonalityco/utils-package';
import { twMerge } from 'tailwind-merge';
import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import { usePathname } from 'next/navigation';

export function Sidebar({
  packages,
  stripScopeFromPackageNames,
  className,
}: {
  packages: Package[];
  stripScopeFromPackageNames?: boolean;
  className?: string;
}) {
  const pathname = usePathname();
  const [searchText, setSearchText] = useState('');
  const filteredPackages = searchText
    ? packages.filter((package_) => {
        const formattedName = formatPackageName(package_.name, {
          stripScope: stripScopeFromPackageNames ?? true,
        });

        return formattedName.includes(searchText);
      })
    : packages;

  return (
    <div
      className={twMerge(
        'w-72 shrink-0 overflow-hidden rounded-lg bg-background p-3',
        className
      )}
    >
      <a className="w-full justify-start" href="/docs">
        <GlobeAltIcon className="mr-2 h-4 w-4" />
        Root
      </a>

      <Separator className="mb-6 mt-3" />
      <div className="relative z-20 flex flex-nowrap gap-2">
        <Input
          placeholder="Search..."
          onChange={(event) => setSearchText(event.target.value)}
          className="grow"
        />
      </div>
      {filteredPackages.length === 0 ? (
        <div className="py-6 text-center">
          <Text>No packages</Text>
        </div>
      ) : (
        <div>
          <div className="sticky top-0 h-4 bg-gradient-to-b from-white dark:from-zinc-900" />
          {filteredPackages.map((package_) => {
            const IconForPackage = getIconForPackage(package_);

            const packageName = formatPackageName(package_.name, {
              stripScope: stripScopeFromPackageNames ?? true,
            });

            const packageNameSlug = slugifyPackageName(package_.name);

            return (
              <div key={package_.name}>
                <a
                  className="mb-1 w-full px-3"
                  href={`/docs/${packageNameSlug}`}
                >
                  <div className="flex w-full items-center gap-2">
                    <IconForPackage className="h-4 w-4 shrink-0 grow-0" />
                    <div className="flex-grow truncate text-left">
                      {packageName}
                    </div>
                  </div>
                </a>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
