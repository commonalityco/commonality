import { Package } from '@commonalityco/types';
import { Button } from '@commonalityco/ui-button';
import { Heading } from '@commonalityco/ui-heading';
import { getPackagesData } from 'data/packages';
import { formatPackageName } from 'utils/format-package-name';
import { getIconForPackage } from 'utils/get-icon-for-package';

function Sidebar({
  packages,
  stripScopeFromPackageNames,
}: {
  packages: Package[];
  stripScopeFromPackageNames: boolean;
}) {
  return (
    <div className="shrink-0 grow-0 basis-72 overflow-auto border-r border-zinc-300 p-3 dark:border-zinc-600">
      <Heading size="sm" as="p">
        Packages
      </Heading>
      {packages.map((pkg) => {
        const IconForPackage = getIconForPackage(pkg);

        const packageName = formatPackageName(pkg.name, {
          stripScope: stripScopeFromPackageNames,
        });

        return (
          <Button key={pkg.name} use="ghost" className="w-full">
            <div className="flex w-full items-center justify-start gap-2">
              <IconForPackage className="h-5 w-5 shrink-0 grow-0" />
              <div className="grow truncate text-left">{packageName}</div>
            </div>
          </Button>
        );
      })}
    </div>
  );
}

export default Sidebar;
