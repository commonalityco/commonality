import { Package } from '@commonalityco/types';
import { Divider } from '@commonalityco/ui-divider';
import { Heading } from '@commonalityco/ui-heading';
import { Text } from '@commonalityco/ui-text';
import { getIconForPackage } from 'utils/get-icon-for-package';

function PackageHeader({
  pkg,
  children,
}: {
  pkg: Package;
  children: React.ReactNode;
}) {
  const IconForType = getIconForPackage(pkg);

  return (
    <div className="px-3 pt-3">
      <div className="flex flex-nowrap justify-between">
        <div className="flex items-center gap-2 px-3">
          <IconForType className="h-6 w-6" />
          <Heading size="sm">{pkg?.name}</Heading>
          <Text className="font-mono">{pkg?.version}</Text>
        </div>
        <div>{children}</div>
      </div>

      <Divider className="mt-4" />
    </div>
  );
}

export default PackageHeader;
